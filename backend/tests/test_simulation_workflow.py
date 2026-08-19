from starlette.requests import Request
from fastapi import HTTPException
import pytest
from app.api.routes.simulations import detail, evaluate, start, submit, update
from app.core.security import hash_password
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
from app.database.session import Base
from app.models.entities import ClinicalCase, User
from app.schemas.api import SimulationStart, SimulationUpdate

request = Request({"type": "http", "method": "POST", "path": "/api/simulations/test/evaluate", "headers": [], "client": ("test", 1)})
test_engine = create_engine("sqlite://", connect_args={"check_same_thread": False}, poolclass=StaticPool)
TestSession = sessionmaker(bind=test_engine, expire_on_commit=False)


def setup_module():
    Base.metadata.create_all(test_engine)


def teardown_module():
    Base.metadata.drop_all(test_engine)


def test_owned_draft_submit_and_safe_evaluation_retry(monkeypatch):
    with TestSession() as db:
        owner = User(id="owner", full_name="Owner", email="owner@test.invalid", password_hash=hash_password("password123"), role="student")
        other = User(id="other", full_name="Other", email="other@test.invalid", password_hash=hash_password("password123"), role="student")
        case = ClinicalCase(id="case", title="Case", specialty="Medicine", difficulty="Intermediate", summary="Summary", patient_profile={}, presenting_complaint="Pain", doctor_verified_diagnosis="Approved", accepted_diagnoses=["Approved"], feedback={}, status="published")
        db.add_all([owner, other, case]); db.commit()
        attempt = start(SimulationStart(case_id=case.id), owner, db)
        saved = update(attempt["id"], SimulationUpdate(current_step="FinalDiagnosis", conversation=[{"sender": "Student", "text": "hello"}], final_diagnosis="Approved", final_reasoning="Reasoning based on the approved fictional findings."), owner, db)
        assert saved["saved"] is True
        restored = detail(attempt["id"], owner, db)
        assert restored["current_step"] == "FinalDiagnosis"
        assert restored["response"]["conversation"][0]["text"] == "hello"
        with pytest.raises(HTTPException) as denied: detail(attempt["id"], other, db)
        assert denied.value.status_code == 404
        first = submit(attempt["id"], owner, db)
        second = submit(attempt["id"], owner, db)
        assert first["submitted"] and second["submitted"]
        monkeypatch.setattr("app.api.routes.simulations.evaluate_with_ai", lambda *_: (_ for _ in ()).throw(RuntimeError("offline")))
        with pytest.raises(HTTPException) as unavailable: evaluate(request, attempt["id"], owner, db)
        assert unavailable.value.status_code == 503
        assert detail(attempt["id"], owner, db)["status"] == "evaluation_failed"
