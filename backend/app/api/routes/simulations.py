from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy import select
from sqlalchemy.orm import Session
from app.api.deps import current_user
from app.database.session import get_db
from app.ai.evaluator import evaluate_with_ai
from app.ai.prompts import EVALUATION_PROMPT_VERSION
from app.core.config import get_settings
from app.models.entities import CaseContent, ClinicalCase, ConversationMessage, EvaluationResult, ExaminationItem, HistoryItem, Investigation, SavedSimulationState, ScoreBreakdown, SimulationAttempt, StudentResponse, User
from app.schemas.api import SimulationStart, SimulationUpdate
from app.services.scoring import weighted_score
from app.core.rate_limit import limiter

router = APIRouter(prefix="/simulations", tags=["simulations"])


def owned(attempt_id: str, user: User, db: Session) -> SimulationAttempt:
    attempt = db.scalar(select(SimulationAttempt).where(SimulationAttempt.id == attempt_id, SimulationAttempt.user_id == user.id))
    if not attempt: raise HTTPException(404, "Simulation not found")
    return attempt


@router.post("/start", status_code=201)
def start(payload: SimulationStart, user: User = Depends(current_user), db: Session = Depends(get_db)):
    case = db.get(ClinicalCase, payload.case_id)
    if not case or case.status != "published": raise HTTPException(404, "Clinical case not found")
    attempt = SimulationAttempt(user_id=user.id, case_id=case.id); db.add(attempt); db.commit(); db.refresh(attempt)
    return {"id": attempt.id, "case_id": case.id, "status": attempt.status, "started_at": attempt.started_at}


@router.get("/history")
def history(user: User = Depends(current_user), db: Session = Depends(get_db)):
    return db.scalars(select(SimulationAttempt).where(SimulationAttempt.user_id == user.id).order_by(SimulationAttempt.started_at.desc())).all()


@router.get("/{attempt_id}")
def detail(attempt_id: str, user: User = Depends(current_user), db: Session = Depends(get_db)):
    attempt = owned(attempt_id, user, db)
    response = attempt.response
    return {
        "id": attempt.id, "case_id": attempt.case_id, "status": attempt.status,
        "current_step": attempt.current_step, "started_at": attempt.started_at,
        "draft_updated_at": attempt.draft_updated_at,
        "response": None if not response else {
            "history_questions": response.history_questions,
            "conversation": response.conversation,
            "examinations_requested": response.examinations_requested,
            "initial_diagnosis": response.initial_diagnosis,
            "initial_reasoning": response.initial_reasoning,
            "differential_diagnoses": response.differential_diagnoses,
            "most_likely_diagnosis": response.most_likely_diagnosis,
            "investigations_selected": response.investigations_selected,
            "investigation_interpretation": response.investigation_interpretation,
            "final_diagnosis": response.final_diagnosis,
            "final_reasoning": response.final_reasoning,
        },
    }


@router.patch("/{attempt_id}")
def update(attempt_id: str, payload: SimulationUpdate, user: User = Depends(current_user), db: Session = Depends(get_db)):
    attempt = owned(attempt_id, user, db)
    if attempt.status != "in_progress": raise HTTPException(409, "Completed simulations cannot be changed")
    response = attempt.response or StudentResponse(simulation_attempt_id=attempt.id)
    values = payload.model_dump()
    attempt.current_step = values.pop("current_step")
    attempt.draft_updated_at = datetime.now(timezone.utc)
    for key, value in values.items(): setattr(response, key, value)
    db.add(response)
    snapshot = db.scalar(select(SavedSimulationState).where(SavedSimulationState.simulation_attempt_id == attempt.id)) or SavedSimulationState(simulation_attempt_id=attempt.id)
    snapshot.state = payload.model_dump(); snapshot.updated_at = attempt.draft_updated_at; db.add(snapshot)
    existing_sequences = set(db.scalars(select(ConversationMessage.sequence).where(ConversationMessage.simulation_attempt_id == attempt.id)).all())
    for sequence, message in enumerate(values.get("conversation", [])):
        if sequence not in existing_sequences:
            db.add(ConversationMessage(simulation_attempt_id=attempt.id, sequence=sequence, sender=str(message.get("sender", "student"))[:30], original_text=str(message.get("originalText", message.get("text", ""))), corrected_text=str(message.get("correctedText", "")), response_text=str(message.get("text", "")), matched_item_id=message.get("matchedItemId"), confidence=message.get("confidence")))
    db.commit()
    return {"id": attempt.id, "status": attempt.status, "saved": True}


@router.post("/{attempt_id}/submit")
def submit(attempt_id: str, user: User = Depends(current_user), db: Session = Depends(get_db)):
    attempt = owned(attempt_id, user, db)
    if attempt.status != "in_progress":
        return {"simulation_id": attempt.id, "status": attempt.status, "submitted": True}
    if not attempt.response or not attempt.response.final_diagnosis.strip() or not attempt.response.final_reasoning.strip():
        raise HTTPException(422, "Final diagnosis and reasoning are required")
    now = datetime.now(timezone.utc)
    attempt.status = "submitted"; attempt.completed_at = now
    started_at = attempt.started_at if attempt.started_at.tzinfo else attempt.started_at.replace(tzinfo=timezone.utc)
    attempt.time_taken = int((now - started_at).total_seconds())
    db.commit()
    return {"simulation_id": attempt.id, "status": attempt.status, "submitted": True}


def response_payload(response: StudentResponse) -> dict:
    return {
        "history_questions": response.history_questions, "conversation": response.conversation,
        "examinations_requested": response.examinations_requested, "initial_diagnosis": response.initial_diagnosis,
        "initial_reasoning": response.initial_reasoning, "differential_diagnoses": response.differential_diagnoses,
        "most_likely_diagnosis": response.most_likely_diagnosis, "investigations_selected": response.investigations_selected,
        "investigation_interpretation": response.investigation_interpretation, "final_diagnosis": response.final_diagnosis,
        "final_reasoning": response.final_reasoning,
    }


@router.post("/{attempt_id}/evaluate")
@limiter.limit("5/minute")
def evaluate(request: Request, attempt_id: str, user: User = Depends(current_user), db: Session = Depends(get_db)):
    attempt = owned(attempt_id, user, db)
    if attempt.evaluation and attempt.evaluation.payload:
        return attempt.evaluation.payload
    if attempt.status == "in_progress": raise HTTPException(409, "Submit the simulation before evaluation")
    if attempt.status == "evaluating": raise HTTPException(409, "Evaluation is already in progress")
    case = db.get(ClinicalCase, attempt.case_id)
    content = db.scalars(select(CaseContent).where(CaseContent.case_id == case.id)).all()
    case_facts = {
        "title": case.title, "specialty": case.specialty, "patient_profile": case.patient_profile,
        "presenting_complaint": case.presenting_complaint, "doctor_verified_diagnosis": case.doctor_verified_diagnosis,
        "accepted_diagnoses": case.accepted_diagnoses, "doctor_approved_feedback": case.feedback,
        "history_items": [{"section": row.section, "patient_answer": row.patient_answer, "important": row.is_important} for row in db.scalars(select(HistoryItem).where(HistoryItem.case_id == case.id))],
        "examinations": [{"name": row.examination_name, "findings": row.findings, "important": row.is_important} for row in db.scalars(select(ExaminationItem).where(ExaminationItem.case_id == case.id))],
        "investigations": [{"name": row.name, "result": row.result, "interpretation": row.interpretation, "required": row.is_required} for row in db.scalars(select(Investigation).where(Investigation.case_id == case.id))],
        "rubric": [{"kind": row.kind, "content": row.content, "keyword": row.keyword, "weight": row.weight} for row in content],
    }
    attempt.status = "evaluating"; db.commit()
    try:
        result = evaluate_with_ai(case_facts, response_payload(attempt.response))
        result.doctor_verified_diagnosis = case.doctor_verified_diagnosis
        result.doctor_approved_explanation = str(case.feedback.get("explanation", case.feedback))
        payload = result.model_dump()
        scores = result.scores.model_dump()
        evaluation = EvaluationResult(
            simulation_attempt_id=attempt.id, corrected_response=result.corrected_response.clinical_reasoning,
            payload=payload, scores=scores, overall_score=result.scores.overall, strengths=result.strengths,
            mistakes=result.incorrect_points, missed_points=result.missed_important_points,
            improvement_advice=result.personalized_advice, study_focus=result.study_focus,
            safety_flags=result.unsafe_recommendations, ai_model=get_settings().openai_model,
            prompt_version=EVALUATION_PROMPT_VERSION,
        )
        attempt.status = "completed"; attempt.overall_score = result.scores.overall
        db.add(evaluation); db.flush()
        explanations = result.score_explanations.model_dump()
        for category, score in result.scores.model_dump(exclude={"overall"}).items():
            db.add(ScoreBreakdown(evaluation_result_id=evaluation.id, category=category, score=score, explanation=explanations[category]))
        db.commit()
        return payload
    except Exception:
        attempt.status = "evaluation_failed"; db.commit()
        raise HTTPException(503, "Evaluation is temporarily unavailable. Your submitted answers are safe; please retry.")


@router.get("/{attempt_id}/feedback")
def feedback(attempt_id: str, user: User = Depends(current_user), db: Session = Depends(get_db)):
    attempt = owned(attempt_id, user, db)
    if not attempt.evaluation or not attempt.evaluation.payload: raise HTTPException(409, "Simulation has not been evaluated")
    return attempt.evaluation.payload


@router.post("/{attempt_id}/retry", status_code=201)
def retry(attempt_id: str, user: User = Depends(current_user), db: Session = Depends(get_db)):
    previous = owned(attempt_id, user, db); attempt = SimulationAttempt(user_id=user.id, case_id=previous.case_id)
    db.add(attempt); db.commit(); db.refresh(attempt); return {"id": attempt.id, "case_id": attempt.case_id, "status": attempt.status}
