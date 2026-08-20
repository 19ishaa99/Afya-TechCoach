import json

from google import genai
from google.genai import types

from app.ai.prompts import PATIENT_PROMPT, SYSTEM_PROMPT
from app.core.config import get_settings
from app.schemas.api import AIEvaluation, PatientMatch
from app.services.scoring import weighted_score


def get_gemini_client():
    settings = get_settings()

    if not settings.gemini_api_key:
        raise RuntimeError("Gemini API key is not configured")

    return genai.Client(api_key=settings.gemini_api_key)


def evaluate_with_ai(
    case_facts: dict,
    student_response: dict
) -> AIEvaluation:

    settings = get_settings()

    if not settings.gemini_api_key or not settings.gemini_model:
        raise RuntimeError("AI evaluation is not configured")

    client = get_gemini_client()

    prompt = json.dumps(
        {
            "approved_case": case_facts,
            "student_response": student_response,
        }
    )

    response = client.models.generate_content(
        model=settings.gemini_model,
        contents=prompt,
        config=types.GenerateContentConfig(
            system_instruction=SYSTEM_PROMPT,
            response_mime_type="application/json",
            response_schema=AIEvaluation,
            temperature=0.2,
        ),
    )

    if response.parsed is None:
        raise RuntimeError(
            "Gemini did not return a valid structured evaluation"
        )

    result = response.parsed

    raw = result.scores.model_dump(
        exclude={"overall"}
    )

    result.scores.overall = weighted_score(raw)

    return result


def match_patient_question(
    question: str,
    approved_items: list[dict]
) -> PatientMatch:

    settings = get_settings()

    if not settings.gemini_api_key or not settings.gemini_model:
        return PatientMatch(
            original_question=question,
            detected_meaning="The intended question was unclear.",
            corrected_question=question,
            matched_history_item_id=None,
            confidence=0,
            patient_response="",
            needs_clarification=True,
            clarification_prompt=(
                "Could you rephrase that as one focused history question?"
            ),
        )

    safe_items = [
        {
            "id": item["id"],
            "accepted_questions": item["accepted_questions"],
            "keywords": item["keywords"],
        }
        for item in approved_items
    ]

    client = get_gemini_client()

    prompt = json.dumps(
        {
            "student_question": question,
            "approved_items": safe_items,
        }
    )

    response = client.models.generate_content(
        model=settings.gemini_model,
        contents=prompt,
        config=types.GenerateContentConfig(
            system_instruction=PATIENT_PROMPT,
            response_mime_type="application/json",
            response_schema=PatientMatch,
            temperature=0.1,
        ),
    )

    if response.parsed is None:
        raise RuntimeError(
            "Gemini language matcher did not return a valid structured response"
        )

    return response.parsed