import re
from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload
from app.ai.safety import REFUSAL, requests_hidden_answer
from app.ai.evaluator import match_patient_question
from app.api.deps import current_user
from app.database.session import get_db
from app.models.entities import ClinicalCase, ExaminationItem, HistoryItem, Investigation, User
from app.schemas.api import ClinicalRequest, HistoryQuestion
from app.core.rate_limit import limiter

router = APIRouter(prefix="/cases", tags=["clinical cases"], dependencies=[Depends(current_user)])


def get_case(case_id: str, db: Session) -> ClinicalCase:
    case = db.scalar(select(ClinicalCase).where(ClinicalCase.id == case_id, ClinicalCase.status == "published"))
    if not case: raise HTTPException(404, "Clinical case not found")
    return case


def tokens(text: str) -> set[str]:
    return set(re.findall(r"[a-z0-9]+", text.lower())) - {"the", "a", "an", "patient", "please", "tell", "me", "about"}


@router.get("")
def cases(db: Session = Depends(get_db)):
    rows = db.scalars(select(ClinicalCase).where(ClinicalCase.status == "published").order_by(ClinicalCase.title)).all()
    return [{"id": c.id, "title": c.title, "specialty": c.specialty, "difficulty": c.difficulty, "estimated_time": c.estimated_time, "summary": c.summary} for c in rows]


@router.get("/specialties")
def specialties(db: Session = Depends(get_db)):
    return db.scalars(select(ClinicalCase.specialty).where(ClinicalCase.status == "published").distinct()).all()


@router.get("/{case_id}")
def case_detail(case_id: str, db: Session = Depends(get_db)):
    case = get_case(case_id, db)
    return {"id": case.id, "title": case.title, "specialty": case.specialty, "difficulty": case.difficulty, "estimated_time": case.estimated_time, "summary": case.summary, "patient_profile": case.patient_profile, "presenting_complaint": case.presenting_complaint}


@router.get("/{case_id}/patient")
def patient(case_id: str, db: Session = Depends(get_db)):
    case = get_case(case_id, db)
    return {"patient_profile": case.patient_profile, "presenting_complaint": case.presenting_complaint}


@router.post("/{case_id}/history-question")
@limiter.limit("30/minute")
def history_question(request: Request, case_id: str, payload: HistoryQuestion, db: Session = Depends(get_db)):
    get_case(case_id, db)
    if requests_hidden_answer(payload.question):
        return {"original_question": payload.question, "detected_meaning": "Request for hidden case information", "corrected_question": payload.question, "matched_history_item_id": None, "confidence": 100, "patient_response": REFUSAL, "needs_clarification": False, "clarification_prompt": ""}
    question_tokens = tokens(payload.question)
    items = db.scalars(select(HistoryItem).where(HistoryItem.case_id == case_id)).all()
    scored = [(len(question_tokens & (tokens(" ".join(i.accepted_questions)) | set(i.keywords))), i) for i in items]
    score, item = max(scored, default=(0, None), key=lambda value: value[0])
    confidence = min(100, score * 25)
    if item and confidence >= 50:
        return {"original_question": payload.question, "detected_meaning": item.section, "corrected_question": item.accepted_questions[0] if item.accepted_questions else payload.question, "matched_history_item_id": item.id, "confidence": confidence, "patient_response": item.patient_answer, "needs_clarification": False, "clarification_prompt": ""}
    approved = [{"id": row.id, "accepted_questions": row.accepted_questions, "keywords": row.keywords} for row in items]
    try:
        semantic = match_patient_question(payload.question, approved)
    except Exception:
        semantic = None
    matched = next((row for row in items if semantic and row.id == semantic.matched_history_item_id), None)
    if not matched or not semantic or semantic.confidence < 45:
        return {"original_question": payload.question, "detected_meaning": semantic.detected_meaning if semantic else "The intended question was unclear.", "corrected_question": semantic.corrected_question if semantic else payload.question, "matched_history_item_id": None, "confidence": semantic.confidence if semantic else 0, "patient_response": "", "needs_clarification": True, "clarification_prompt": semantic.clarification_prompt if semantic else "Could you rephrase that as one focused history question?"}
    semantic.patient_response = matched.patient_answer
    semantic.needs_clarification = False
    semantic.clarification_prompt = ""
    return semantic


@router.post("/{case_id}/examination")
def examination(case_id: str, payload: ClinicalRequest, db: Session = Depends(get_db)):
    get_case(case_id, db); query = tokens(payload.request)
    items = db.scalars(select(ExaminationItem).where(ExaminationItem.case_id == case_id)).all()
    item = max(items, default=None, key=lambda i: len(query & (tokens(i.examination_name) | set(i.keywords))))
    if not item or not query & (tokens(item.examination_name) | set(item.keywords)): raise HTTPException(404, "Examination request was not recognized")
    return {"id": item.id, "findings": item.findings}


@router.post("/{case_id}/investigation")
def investigation(case_id: str, payload: ClinicalRequest, db: Session = Depends(get_db)):
    get_case(case_id, db); query = tokens(payload.request)
    items = db.scalars(select(Investigation).where(Investigation.case_id == case_id)).all()
    item = max(items, default=None, key=lambda i: len(query & tokens(i.name + " " + " ".join(i.accepted_requests))))
    if not item or not query & tokens(item.name + " " + " ".join(item.accepted_requests)): raise HTTPException(404, "Investigation request was not recognized")
    return {"id": item.id, "name": item.name, "result": item.result}
