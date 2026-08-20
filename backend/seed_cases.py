"""Seed the five doctor-approved clinical cases from backend-owned JSON data."""
import json
from pathlib import Path
from sqlalchemy import select
from app.database.session import SessionLocal
from app.models.entities import AcceptedDiagnosis, CaseContent, ClinicalCase, ClinicalReasoningPoint, ExaminationItem, HistoryItem, Investigation, TeachingPoint

DATA_FILE = Path(__file__).resolve().parent / "seed_data" / "cases.json"


def read_cases():
    with DATA_FILE.open(encoding="utf-8") as source:
        cases = json.load(source)
    if not isinstance(cases, list) or len(cases) != 5:
        count = len(cases) if isinstance(cases, list) else "non-list data"
        raise RuntimeError(f"Expected 5 doctor-approved cases, found {count}")
    return cases


def seed():
    cases = read_cases()
    with SessionLocal() as db:
        for data in cases:
            if db.get(ClinicalCase, data["id"]):
                for diagnosis in data.get("acceptedDiagnoses", [data["doctorVerifiedDiagnosis"]]):
                    if not db.scalar(select(AcceptedDiagnosis).where(AcceptedDiagnosis.case_id == data["id"], AcceptedDiagnosis.diagnosis == diagnosis)):
                        db.add(AcceptedDiagnosis(case_id=data["id"], diagnosis=diagnosis))
                for point in data.get("teachingPoints", []):
                    if not db.scalar(select(TeachingPoint).where(TeachingPoint.case_id == data["id"], TeachingPoint.content == str(point))):
                        db.add(TeachingPoint(case_id=data["id"], content=str(point)))
                for point in data.get("clinicalReasoning", {}).get("reasoningPoints", []):
                    content = point.get("explanation", "")
                    if not db.scalar(select(ClinicalReasoningPoint).where(ClinicalReasoningPoint.case_id == data["id"], ClinicalReasoningPoint.content == content)):
                        db.add(ClinicalReasoningPoint(case_id=data["id"], content=content, keyword=point.get("keyword"), weight=point.get("weight", 1)))
                continue
            patient = data.get("patient", {})
            case = ClinicalCase(id=data["id"], title=data["title"], specialty=data.get("specialty", "General Medicine"), difficulty=data.get("difficulty", "Intermediate"), estimated_time=str(data.get("estimatedTime", "15 min")), summary=data.get("description", data["title"]), patient_profile=patient, presenting_complaint=patient.get("presentingComplaint", data.get("presentingComplaint", "")), doctor_verified_diagnosis=data["doctorVerifiedDiagnosis"], accepted_diagnoses=data.get("acceptedDiagnoses", [data["doctorVerifiedDiagnosis"]]), feedback=data.get("feedback", {}), status="published")
            db.add(case); db.flush()
            for key, answer in data.get("history", {}).items(): db.add(HistoryItem(id=f'{data["id"]}-{key}', case_id=data["id"], section=key, accepted_questions=[key], keywords=[key.lower()], patient_answer=str(answer), is_important=key in data.get("evaluation", {}).get("importantHistorySections", [])))
            for item in data.get("examination", []): db.add(ExaminationItem(id=f'{data["id"]}-{item["id"]}', case_id=data["id"], examination_name=item.get("name", item["id"]), accepted_requests=item.get("acceptedRequests", []), keywords=item.get("keywords", []), findings=item.get("findings", ""), is_important=item.get("name") in data.get("evaluation", {}).get("importantExaminations", [])))
            for item in data.get("investigations", []): db.add(Investigation(id=f'{data["id"]}-{item["id"]}', case_id=data["id"], name=item.get("name", item["id"]), accepted_requests=item.get("acceptedRequests", []), result=str(item.get("result", "")), interpretation=item.get("interpretation", item.get("relevance", "")), is_required=item.get("name") in data.get("evaluation", {}).get("expectedInvestigations", [])))
            for point in data.get("teachingPoints", []): db.add(CaseContent(case_id=data["id"], kind="teaching_point", content=str(point)))
            for diagnosis in data.get("acceptedDiagnoses", [data["doctorVerifiedDiagnosis"]]): db.add(AcceptedDiagnosis(case_id=data["id"], diagnosis=diagnosis))
            for point in data.get("teachingPoints", []): db.add(TeachingPoint(case_id=data["id"], content=str(point)))
            for point in data.get("clinicalReasoning", {}).get("reasoningPoints", []): db.add(CaseContent(case_id=data["id"], kind="reasoning_point", content=point.get("explanation", ""), keyword=point.get("keyword"), weight=point.get("weight", 1)))
            for point in data.get("clinicalReasoning", {}).get("reasoningPoints", []): db.add(ClinicalReasoningPoint(case_id=data["id"], content=point.get("explanation", ""), keyword=point.get("keyword"), weight=point.get("weight", 1)))
        db.commit()
    print(f"Seed complete: {len(cases)} source cases preserved.")


if __name__ == "__main__": seed()
