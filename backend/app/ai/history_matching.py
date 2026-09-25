import re
import unicodedata
from dataclasses import dataclass
from difflib import SequenceMatcher


STOP_WORDS = {
    "a", "an", "the", "patient", "please", "tell", "me", "about", "did",
    "does", "do", "is", "are", "you", "your", "have", "has", "this", "it",
    "ni", "je", "ya", "yako", "una", "kuhusu", "na", "au",
}

# Small, clinically neutral language mappings improve the fast path without
# introducing any patient facts. Gemini remains the fallback for harder cases.
TOKEN_ALIASES = {
    "started": "start", "starting": "start", "began": "start", "begin": "start",
    "begun": "start", "since": "start", "onset": "start", "duration": "long",
    "lini": "when", "yalianza": "start", "ilianza": "start", "alianza": "start",
    "maumivu": "pain", "kupumua": "breathing", "pumzi": "breathing",
    "shida": "problem", "tatizo": "problem",
    "dalili": "symptom", "zilianza": "start", "imeanza": "start",
    "wapi": "where", "sehemu": "location", "gani": "what",
    "makali": "severe", "kiasi": "severity", "mzio": "allergy",
    "dawa": "medication", "sigara": "smoke", "pombe": "alcohol",
    "safari": "travel", "umesafiri": "travel", "familia": "family",
    "yakoje": "character", "yanaenea": "spread", "kinapunguza": "relieve",
    "kinaongeza": "worse", "nyingine": "other",
    "bad": "severe", "rate": "score", "rating": "score", "ten": "scale", "zero": "scale",
}

SECTION_LANGUAGE = {
    "presentingIllness": ("Tell me more about your main problem.", "complaint problem symptom tatizo dalili"),
    "onset": ("When did the symptom start?", "onset start begin when duration long lini ilianza"),
    "location": ("Where do you feel the symptom?", "location where site place wapi sehemu"),
    "character": ("What does the symptom feel like?", "character quality feel describe aina yakoje"),
    "radiation": ("Does the pain spread anywhere else?", "radiation radiate spread move enea"),
    "associatedSymptoms": ("Do you have any other symptoms?", "associated other symptoms dalili nyingine"),
    "timing": ("When does it happen, and is it constant?", "timing constant intermittent frequency time muda wakati"),
    "aggravatingFactors": ("What makes the symptom worse?", "aggravating worse worsen increase ongeza zidi"),
    "relievingFactors": ("What makes the symptom better?", "relieving better relieve reduce punguza"),
    "severity": ("How severe is the symptom?", "severity severe score scale makali kiasi"),
    "pastMedicalHistory": ("Do you have any previous medical conditions?", "past medical history conditions previous magonjwa zamani"),
    "medicationHistory": ("Are you taking any medicines?", "medication medicine drugs dawa"),
    "allergies": ("Do you have any allergies?", "allergy allergies allergic mzio"),
    "familyHistory": ("Are there important illnesses in your family?", "family relative familia urithi"),
    "socialHistory": ("Do you smoke or drink alcohol?", "social smoke alcohol occupation sigara pombe kazi"),
    "travelHistory": ("Have you travelled recently?", "travel trip safari safiri"),
}

SECTION_HINTS = {
    "presentingIllness": {"complaint", "problem", "symptom"},
    "location": {"location", "where", "site", "place"},
    "character": {"character", "quality", "feel", "describe"},
    "radiation": {"radiation", "spread", "move"},
    "associatedSymptoms": {"associated", "other"},
    "timing": {"timing", "constant", "intermittent", "frequency"},
    "aggravatingFactors": {"aggravating", "worse", "worsen", "increase"},
    "relievingFactors": {"relieving", "better", "relieve", "reduce"},
    "severity": {"severity", "severe", "score", "scale"},
    "pastMedicalHistory": {"past", "medical", "conditions", "previous"},
    "medicationHistory": {"medication", "medicine", "drugs"},
    "allergies": {"allergy", "allergies", "allergic"},
    "familyHistory": {"family", "relative"},
    "socialHistory": {"social", "smoke", "alcohol", "occupation"},
    "travelHistory": {"travel", "trip"},
}

INTENT_TERMS = {
    "onset": {"start", "when", "long"},
}


@dataclass(frozen=True)
class LocalHistoryMatch:
    item_id: str | None
    confidence: float
    detected_meaning: str
    corrected_question: str


def normalize_tokens(text: str) -> set[str]:
    normalized = unicodedata.normalize("NFKD", text.lower())
    words = re.findall(r"[a-z0-9]+", normalized)
    return {TOKEN_ALIASES.get(word, word) for word in words if word not in STOP_WORDS}


def _item_tokens(item: dict) -> set[str]:
    section = str(item.get("section", ""))
    _, section_terms = SECTION_LANGUAGE.get(section, (section, section))
    text = " ".join(
        [section, section_terms]
        + [str(value) for value in item.get("accepted_questions", [])]
        + [str(value) for value in item.get("keywords", [])]
    )
    return normalize_tokens(text)


def _is_onset(tokens: set[str]) -> bool:
    return "start" in tokens or ({"when", "long"} & tokens and bool(tokens - {"when", "long", "problem"}))


def local_history_match(question: str, approved_items: list[dict]) -> LocalHistoryMatch:
    query = normalize_tokens(question)
    if not query or query <= {"problem"}:
        return LocalHistoryMatch(None, 0, "The intended history domain is unclear.", question)

    onset_query = _is_onset(query)
    ranked: list[tuple[float, dict, set[str]]] = []
    for item in approved_items:
        item_tokens = _item_tokens(item)
        overlap = query & item_tokens
        score = len(overlap) * 24.0

        section = str(item.get("section", ""))
        if query & SECTION_HINTS.get(section, set()):
            score += 32.0

        if onset_query and ("start" in item_tokens or "onset" in str(item.get("section", "")).lower()):
            score += 48.0

        # Accepted-question similarity catches spelling and word-order variants.
        compact_question = " ".join(sorted(query))
        similarities = [
            SequenceMatcher(None, compact_question, " ".join(sorted(normalize_tokens(value)))).ratio()
            for value in item.get("accepted_questions", [])
        ]
        if similarities:
            score += max(similarities) * 25.0
        ranked.append((score, item, item_tokens))

    ranked.sort(key=lambda value: value[0], reverse=True)
    if not ranked or ranked[0][0] < 50:
        return LocalHistoryMatch(None, min(49, ranked[0][0] if ranked else 0), "The intended history domain is unclear.", question)

    best_score, best, best_tokens = ranked[0]
    second_score = ranked[1][0] if len(ranked) > 1 else 0
    subject_terms = query - INTENT_TERMS["onset"] - {"problem"}
    best_subject_overlap = subject_terms & best_tokens

    # If several approved items describe the same intent and the student gave
    # no distinguishing symptom, clarification is safer than guessing.
    if second_score >= best_score - 12 and not best_subject_overlap:
        return LocalHistoryMatch(None, 40, "The timing is clear, but the symptom is ambiguous.", question)

    accepted = best.get("accepted_questions", [])
    section_key = str(best.get("section", "history item"))
    friendly_question, _ = SECTION_LANGUAGE.get(section_key, (str(accepted[0]) if accepted else question, section_key))
    corrected = friendly_question
    section = re.sub(r"(?<!^)(?=[A-Z])", " ", section_key).replace("_", " ").lower()
    meaning = f"The student is asking about {section}."
    return LocalHistoryMatch(str(best["id"]), min(98, max(50, best_score)), meaning, corrected)
