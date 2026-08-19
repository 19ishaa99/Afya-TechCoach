import pytest
from app.services.scoring import weighted_score


def test_weighted_score_uses_every_numeric_category():
    scores = {"history_taking": 80, "physical_examination": 70, "initial_diagnosis": 100, "differential_diagnosis": 60, "investigation_selection": 90, "investigation_interpretation": 50, "final_diagnosis": 100, "clinical_reasoning": 80, "patient_safety": 100}
    assert weighted_score(scores) == 79.5


def test_weighted_score_rejects_missing_category():
    with pytest.raises(ValueError): weighted_score({"history_taking": 100})


def test_weighted_score_clamps_values():
    assert weighted_score({key: 150 for key in ["history_taking", "physical_examination", "initial_diagnosis", "differential_diagnosis", "investigation_selection", "investigation_interpretation", "final_diagnosis", "clinical_reasoning", "patient_safety"]}) == 100
