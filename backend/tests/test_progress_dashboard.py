from datetime import datetime, timezone
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
from app.api.routes.progress import dashboard, history
from app.database.session import Base
from app.models.entities import ClinicalCase, EvaluationResult, SimulationAttempt, User

engine = create_engine("sqlite://", connect_args={"check_same_thread": False}, poolclass=StaticPool)
Session = sessionmaker(bind=engine, expire_on_commit=False)


def setup_module(): Base.metadata.create_all(engine)
def teardown_module(): Base.metadata.drop_all(engine)


def user(user_id): return User(id=user_id, full_name=f"Student {user_id}", email=f"{user_id}@test.invalid", password_hash="hash", role="student")


def test_dashboard_progressive_states_and_student_isolation():
    with Session() as db:
        student_a, student_b = user("a"), user("b")
        case = ClinicalCase(id="c1", title="Approved Case", specialty="Medicine", difficulty="Beginner", summary="Summary", patient_profile={}, presenting_complaint="Complaint", doctor_verified_diagnosis="Diagnosis", accepted_diagnoses=["Diagnosis"], feedback={}, status="published")
        db.add_all([student_a, student_b, case]); db.commit()

        empty = dashboard(student_a, db)
        assert empty["has_activity"] is False
        assert empty["summary"]["average_score"] is None
        assert empty["recent_activity"] == []

        attempt = SimulationAttempt(id="a-progress", user_id="a", case_id="c1", status="in_progress", current_step="InitialDiagnosis", draft_updated_at=datetime.now(timezone.utc))
        other_attempt = SimulationAttempt(id="b-secret", user_id="b", case_id="c1", status="completed", overall_score=99, completed_at=datetime.now(timezone.utc))
        db.add_all([attempt, other_attempt]); db.flush()
        db.add(EvaluationResult(simulation_attempt_id="b-secret", corrected_response="", payload={"strengths": ["secret"]}, scores={"history_taking": 99}, overall_score=99))
        db.commit()

        active = dashboard(student_a, db)
        assert active["has_activity"] is True
        assert active["has_completed_evaluation"] is False
        assert active["summary"]["average_score"] is None
        assert active["continue_learning"]["step_progress"] == 50
        assert "b-secret" not in str(active)

        attempt.status = "evaluating"; attempt.completed_at = datetime.now(timezone.utc); db.commit()
        pending = dashboard(student_a, db)
        assert pending["evaluation_pending"]["status"] == "evaluating"
        assert pending["summary"]["average_score"] is None

        attempt.status = "completed"; attempt.overall_score = 76
        db.add(EvaluationResult(simulation_attempt_id=attempt.id, corrected_response="", payload={"strengths": ["Used real findings"], "study_focus": ["Examination"]}, scores={"history_taking": 80, "physical_examination": 72}, overall_score=76))
        db.commit()
        completed = dashboard(student_a, db)
        assert completed["has_completed_evaluation"] is True
        assert completed["summary"]["average_score"] == 76
        assert completed["latest_feedback"]["strengths"] == ["Used real findings"]
        assert history(student_a, db)[0]["overall_score"] == 76
