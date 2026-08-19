from collections import defaultdict
from datetime import datetime, timedelta, timezone
from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload
from app.api.deps import current_user
from app.database.session import get_db
from app.models.entities import ClinicalCase, EvaluationResult, SimulationAttempt, User

router = APIRouter(prefix="/progress", tags=["progress"])

STEP_PROGRESS = {
    "ScenarioIntro": 0, "PatientScenario": 10, "HistoryStage": 20, "Examination": 35,
    "InitialDiagnosis": 50, "DifferentialDiagnosis": 60, "Investigation": 70,
    "InvestigationResults": 80, "FinalDiagnosis": 90, "ReviewAnswers": 95,
}
PENDING = {"submitted", "evaluating", "evaluation_failed"}


def utc(value):
    if not value: return None
    return value if value.tzinfo else value.replace(tzinfo=timezone.utc)


def attempts_for(user_id: str, db: Session) -> list[SimulationAttempt]:
    return list(db.scalars(
        select(SimulationAttempt)
        .options(selectinload(SimulationAttempt.evaluation))
        .where(SimulationAttempt.user_id == user_id)
        .order_by(SimulationAttempt.started_at.desc())
        .execution_options(populate_existing=True)
    ).all())


def case_map(attempts: list[SimulationAttempt], db: Session) -> dict:
    ids = {attempt.case_id for attempt in attempts}
    return {case.id: case for case in db.scalars(select(ClinicalCase).where(ClinicalCase.id.in_(ids))).all()} if ids else {}


def valid_completed(attempts: list[SimulationAttempt]) -> list[SimulationAttempt]:
    return [attempt for attempt in attempts if attempt.status == "completed" and attempt.evaluation and attempt.overall_score is not None]


def latest_completed_per_case(attempts: list[SimulationAttempt]) -> list[SimulationAttempt]:
    latest = {}
    for attempt in sorted(valid_completed(attempts), key=lambda item: utc(item.completed_at) or utc(item.started_at), reverse=True):
        latest.setdefault(attempt.case_id, attempt)
    return list(latest.values())


def streak_days(completed: list[SimulationAttempt]) -> int:
    dates = {utc(item.completed_at).date() for item in completed if item.completed_at}
    if not dates: return 0
    cursor = datetime.now(timezone.utc).date()
    if cursor not in dates: cursor -= timedelta(days=1)
    count = 0
    while cursor in dates:
        count += 1; cursor -= timedelta(days=1)
    return count


def activity_payload(attempts: list[SimulationAttempt], cases: dict) -> list[dict]:
    attempt_numbers = {}
    counts = defaultdict(int)
    for attempt in reversed(attempts):
        counts[attempt.case_id] += 1
        attempt_numbers[attempt.id] = counts[attempt.case_id]
    activity = []
    for attempt in attempts:
        case = cases.get(attempt.case_id)
        activity.append({
            "simulation_id": attempt.id, "case_id": attempt.case_id,
            "attempt_number": attempt_numbers[attempt.id],
            "case_title": case.title if case else "Unavailable clinical case",
            "specialty": case.specialty if case else None, "status": attempt.status,
            "current_step": attempt.current_step, "started_at": attempt.started_at,
            "submitted_at": attempt.completed_at if attempt.status in PENDING | {"completed"} else None,
            "completed_at": attempt.completed_at if attempt.status == "completed" else None,
            "overall_score": attempt.overall_score if attempt.status == "completed" and attempt.evaluation else None,
        })
    return activity


def dashboard_payload(user: User, db: Session) -> dict:
    attempts = attempts_for(user.id, db)
    cases = case_map(attempts, db)
    completed_for_stats = latest_completed_per_case(attempts)
    in_progress = [item for item in attempts if item.status == "in_progress"]
    pending = [item for item in attempts if item.status in PENDING]
    scores = [float(item.overall_score) for item in completed_for_stats]
    continue_attempt = in_progress[0] if in_progress else None
    pending_attempt = pending[0] if pending else None

    specialty_groups = defaultdict(list)
    for attempt in completed_for_stats:
        case = cases.get(attempt.case_id)
        if case: specialty_groups[case.specialty].append(float(attempt.overall_score))
    specialty_progress = [{"specialty": name, "completed": len(values), "average_score": round(sum(values) / len(values), 1)} for name, values in sorted(specialty_groups.items())]

    category_groups = defaultdict(list)
    for attempt in completed_for_stats:
        for key, value in (attempt.evaluation.scores or {}).items():
            if key != "overall" and isinstance(value, (int, float)): category_groups[key].append(float(value))
    category_averages = {key: round(sum(values) / len(values), 1) for key, values in category_groups.items()}

    latest_evaluated = max(completed_for_stats, key=lambda item: utc(item.completed_at) or utc(item.started_at), default=None)
    latest_payload = latest_evaluated.evaluation.payload if latest_evaluated else None
    latest_feedback = None
    if latest_payload:
        latest_feedback = {
            "simulation_id": latest_evaluated.id,
            "case_title": cases[latest_evaluated.case_id].title,
            "overall_score": latest_evaluated.overall_score,
            "strengths": latest_payload.get("strengths", []),
            "study_focus": latest_payload.get("study_focus", []),
            "personalized_advice": latest_payload.get("personalized_advice", ""),
        }

    recent_activity = activity_payload(attempts, cases)[:10]

    continue_learning = None
    if continue_attempt:
        case = cases.get(continue_attempt.case_id)
        continue_learning = {
            "simulation_id": continue_attempt.id, "case_id": continue_attempt.case_id,
            "case_title": case.title if case else "Unavailable clinical case",
            "current_step": continue_attempt.current_step,
            "step_progress": STEP_PROGRESS.get(continue_attempt.current_step, 0),
            "last_saved_at": continue_attempt.draft_updated_at or continue_attempt.started_at,
        }
    evaluation_pending = None
    if pending_attempt:
        case = cases.get(pending_attempt.case_id)
        evaluation_pending = {"simulation_id": pending_attempt.id, "case_title": case.title if case else "Unavailable clinical case", "status": pending_attempt.status, "submitted_at": pending_attempt.completed_at}

    total_seconds = sum(item.time_taken or 0 for item in valid_completed(attempts))
    return {
        "student": {"full_name": user.full_name}, "has_activity": bool(attempts),
        "has_completed_evaluation": bool(completed_for_stats),
        "summary": {"cases_completed": len(valid_completed(attempts)), "cases_in_progress": len(in_progress), "average_score": round(sum(scores) / len(scores), 1) if scores else None, "current_streak_days": streak_days(valid_completed(attempts)), "total_learning_minutes": round(total_seconds / 60)},
        "continue_learning": continue_learning, "evaluation_pending": evaluation_pending,
        "recent_activity": recent_activity, "specialty_progress": specialty_progress,
        "category_averages": category_averages, "latest_feedback": latest_feedback,
        "achievements": [], "retry_average_rule": "latest_completed_attempt_per_case",
    }


@router.get("/dashboard")
def dashboard(user: User = Depends(current_user), db: Session = Depends(get_db)):
    return dashboard_payload(user, db)


@router.get("/specialties")
def specialties(user: User = Depends(current_user), db: Session = Depends(get_db)):
    return dashboard_payload(user, db)["specialty_progress"]


@router.get("/history")
def history(user: User = Depends(current_user), db: Session = Depends(get_db)):
    attempts = attempts_for(user.id, db)
    return activity_payload(attempts, case_map(attempts, db))
