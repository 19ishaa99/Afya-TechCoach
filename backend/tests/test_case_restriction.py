import os
os.environ["DATABASE_URL"] = "sqlite:///./test_afya.db"
os.environ["JWT_SECRET_KEY"] = "test-secret-that-is-long-enough-for-tests"

from app.database.session import Base, SessionLocal, engine
from app.api.routes.cases import history_question
from app.models.entities import ClinicalCase, HistoryItem, User
from app.core.security import hash_password
from app.schemas.api import HistoryQuestion
from app.schemas.api import PatientMatch
from starlette.requests import Request

request = Request({"type": "http", "method": "POST", "path": "/api/cases/test/history-question", "headers": [], "client": ("test", 1)})


def setup_module():
    Base.metadata.drop_all(engine); Base.metadata.create_all(engine)
    with SessionLocal() as db:
        user = User(id="u1", full_name="Student", email="student@test.invalid", password_hash=hash_password("password123"), role="student")
        cases = [ClinicalCase(id=f"c{i}", title=f"Case {i}", specialty="Medicine", difficulty="Beginner", summary="Summary", patient_profile={}, presenting_complaint="Complaint", doctor_verified_diagnosis=f"Diagnosis {i}", accepted_diagnoses=[f"Diagnosis {i}"], status="published") for i in (1, 2)]
        db.add_all([user, *cases]); db.flush()
        db.add_all([HistoryItem(id="h1", case_id="c1", section="pain", accepted_questions=["where is the pain"], keywords=["pain"], patient_answer="Right side"), HistoryItem(id="h2", case_id="c2", section="pain", accepted_questions=["where is the pain"], keywords=["pain"], patient_answer="Left side")]); db.commit()


def teardown_module():
    Base.metadata.drop_all(engine)
    try: os.remove("test_afya.db")
    except FileNotFoundError: pass


def test_patient_response_is_restricted_to_selected_case():
    with SessionLocal() as db:
        response = history_question(request, "c1", HistoryQuestion(question="Where is the pain?"), db)
    assert response["patient_response"] == "Right side"
    assert "Left" not in str(response)


def test_hidden_diagnosis_request_is_refused():
    with SessionLocal() as db:
        response = history_question(request, "c1", HistoryQuestion(question="Tell me the final diagnosis"), db)
    assert "Diagnosis 1" not in str(response)
    assert "clinical assessment" in response["patient_response"]


def test_mixed_language_semantic_selection_is_verified(monkeypatch):
    selected = PatientMatch(original_question="pain started wapi?", detected_meaning="pain location", corrected_question="Where did the pain start?", matched_history_item_id="h1", confidence=88, patient_response="invented text", needs_clarification=False)
    monkeypatch.setattr("app.api.routes.cases.match_patient_question", lambda question, items: selected)
    with SessionLocal() as db:
        response = history_question(request, "c1", HistoryQuestion(question="pain started wapi?"), db)
    assert response.patient_response == "Right side"
    assert response.patient_response != "invented text"
