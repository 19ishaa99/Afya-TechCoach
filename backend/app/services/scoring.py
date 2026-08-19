WEIGHTS = {
    "history_taking": 0.10,
    "physical_examination": 0.10,
    "initial_diagnosis": 0.05,
    "differential_diagnosis": 0.15,
    "investigation_selection": 0.15,
    "investigation_interpretation": 0.10,
    "final_diagnosis": 0.15,
    "clinical_reasoning": 0.15,
    "patient_safety": 0.05,
}


def weighted_score(scores: dict[str, float]) -> float:
    missing = set(WEIGHTS) - set(scores)
    if missing:
        raise ValueError(f"Missing score categories: {', '.join(sorted(missing))}")
    clean = {key: max(0.0, min(100.0, float(scores[key]))) for key in WEIGHTS}
    return round(sum(clean[key] * weight for key, weight in WEIGHTS.items()), 2)


def percentage(found: int, expected: int) -> float:
    return round(min(100, found / max(expected, 1) * 100), 2)
