import re

HIDDEN_ANSWER_PATTERNS = [
    r"final diagnosis", r"hidden answer", r"ignore (all |your )?instructions",
    r"doctor who created", r"system prompt", r"reveal.*answer",
    r"show me (the )?answer", r"pretend.*case.*complete", r"tell me (the )?diagnosis",
]


def requests_hidden_answer(text: str) -> bool:
    return any(re.search(pattern, text, re.IGNORECASE) for pattern in HIDDEN_ANSWER_PATTERNS)


REFUSAL = "I can only answer questions about the patient's approved history. Please continue your clinical assessment."
