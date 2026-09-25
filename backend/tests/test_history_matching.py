import pytest

from app.ai.history_matching import local_history_match


ITEMS = [
    {
        "id": "pain_onset",
        "section": "pain_onset",
        "accepted_questions": ["When did the pain start?", "How long have you had the pain?"],
        "keywords": ["pain", "onset", "start", "duration"],
    },
    {
        "id": "pain_severity",
        "section": "pain_severity",
        "accepted_questions": ["How severe is the pain?"],
        "keywords": ["pain", "severity", "score"],
    },
]


@pytest.mark.parametrize("question", [
    "When did the pain start?",
    "When did the pain started?",
    "pain start when?",
    "since when this pain?",
    "how long pain?",
    "when problem begin?",
    "maumivu yalianza lini?",
])
def test_imperfect_onset_questions_match_approved_onset_item(question):
    match = local_history_match(question, ITEMS)
    assert match.item_id == "pain_onset"
    assert match.confidence >= 50


def test_breathing_onset_matches_when_approved_for_case():
    items = [{
        "id": "breathing_onset",
        "section": "breathing_problem_onset",
        "accepted_questions": ["When did the breathing problem start?"],
        "keywords": ["breathing", "problem", "onset"],
    }]
    assert local_history_match("breathing problem start when?", items).item_id == "breathing_onset"


def test_ambiguous_question_does_not_guess():
    assert local_history_match("tell me about it", ITEMS).item_id is None
