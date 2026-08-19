import json
from openai import OpenAI
from app.ai.prompts import PATIENT_PROMPT, SYSTEM_PROMPT
from app.core.config import get_settings
from app.schemas.api import AIEvaluation, PatientMatch
from app.services.scoring import weighted_score


def evaluate_with_ai(case_facts: dict, student_response: dict) -> AIEvaluation:
    settings = get_settings()
    if not settings.openai_api_key or not settings.openai_model:
        raise RuntimeError("AI evaluation is not configured")
    client = OpenAI(api_key=settings.openai_api_key, timeout=30, max_retries=2)
    response = client.responses.parse(
        model=settings.openai_model,
        input=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": json.dumps({"approved_case": case_facts, "student_response": student_response})},
        ],
        text_format=AIEvaluation,
    )
    result = response.output_parsed
    raw = result.scores.model_dump(exclude={"overall"})
    result.scores.overall = weighted_score(raw)
    return result


def match_patient_question(question: str, approved_items: list[dict]) -> PatientMatch:
    settings = get_settings()
    if not settings.openai_api_key or not settings.openai_model:
        return PatientMatch(
            original_question=question, detected_meaning="The intended question was unclear.",
            corrected_question=question, matched_history_item_id=None, confidence=0,
            patient_response="", needs_clarification=True,
            clarification_prompt="Could you rephrase that as one focused history question?",
        )
    safe_items = [{"id": item["id"], "accepted_questions": item["accepted_questions"], "keywords": item["keywords"]} for item in approved_items]
    client = OpenAI(api_key=settings.openai_api_key, timeout=20, max_retries=1)
    response = client.responses.parse(
        model=settings.openai_model,
        input=[
            {"role": "system", "content": PATIENT_PROMPT},
            {"role": "user", "content": json.dumps({"student_question": question, "approved_items": safe_items})},
        ],
        text_format=PatientMatch,
    )
    if not response.output_parsed:
        raise RuntimeError("The language matcher did not return a valid response")
    return response.output_parsed
