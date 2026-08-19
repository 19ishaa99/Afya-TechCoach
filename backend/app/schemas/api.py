from datetime import datetime
from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator


class UserCreate(BaseModel):
    full_name: str = Field(min_length=2, max_length=160)
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)
    university: str | None = Field(default=None, max_length=255)
    registration_number: str | None = Field(default=None, max_length=100)


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class RefreshRequest(BaseModel):
    refresh_token: str


class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str = Field(min_length=8, max_length=128)


class UserRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    full_name: str
    email: EmailStr
    university: str | None
    registration_number: str | None
    role: str
    is_active: bool


class TokenPair(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class SimulationStart(BaseModel):
    case_id: str


class SimulationUpdate(BaseModel):
    current_step: str = Field(default="PatientScenario", max_length=60)
    history_questions: list = []
    conversation: list = []
    examinations_requested: list = []
    initial_diagnosis: str = ""
    initial_reasoning: str = ""
    differential_diagnoses: list = []
    most_likely_diagnosis: str = ""
    investigations_selected: list = []
    investigation_interpretation: str = ""
    final_diagnosis: str = ""
    final_reasoning: str = ""


class HistoryQuestion(BaseModel):
    question: str = Field(min_length=2, max_length=1000)


class ClinicalRequest(BaseModel):
    request: str = Field(min_length=2, max_length=500)


class ScoreSet(BaseModel):
    history_taking: float = Field(ge=0, le=100)
    physical_examination: float = Field(ge=0, le=100)
    initial_diagnosis: float = Field(ge=0, le=100)
    differential_diagnosis: float = Field(ge=0, le=100)
    investigation_selection: float = Field(ge=0, le=100)
    investigation_interpretation: float = Field(ge=0, le=100)
    final_diagnosis: float = Field(ge=0, le=100)
    clinical_reasoning: float = Field(ge=0, le=100)
    patient_safety: float = Field(ge=0, le=100)
    overall: float = Field(default=0, ge=0, le=100)


class CorrectedResponse(BaseModel):
    initial_diagnosis: str = ""
    differential_diagnoses: list[str] = []
    investigation_interpretation: str = ""
    final_diagnosis: str = ""
    clinical_reasoning: str = ""


class LanguageFeedback(BaseModel):
    strengths: list[str] = []
    corrections: list[str] = []
    clearer_medical_wording: list[str] = []


class ScoreExplanations(BaseModel):
    history_taking: str
    physical_examination: str
    initial_diagnosis: str
    differential_diagnosis: str
    investigation_selection: str
    investigation_interpretation: str
    final_diagnosis: str
    clinical_reasoning: str
    patient_safety: str


class AIEvaluation(BaseModel):
    original_response: dict
    detected_meaning: str
    corrected_response: CorrectedResponse
    language_feedback: LanguageFeedback
    scores: ScoreSet
    score_explanations: ScoreExplanations
    strengths: list[str]
    partially_correct_points: list[str]
    incorrect_points: list[str]
    missed_important_points: list[str]
    unsafe_recommendations: list[str]
    doctor_verified_diagnosis: str
    doctor_approved_explanation: str
    clinical_learning_points: list[str]
    personalized_advice: str
    study_focus: list[str]
    encouragement: str
    educational_disclaimer: str


class PatientMatch(BaseModel):
    original_question: str
    detected_meaning: str
    corrected_question: str
    matched_history_item_id: str | None
    confidence: float = Field(ge=0, le=100)
    patient_response: str
    needs_clarification: bool
    clarification_prompt: str = ""
