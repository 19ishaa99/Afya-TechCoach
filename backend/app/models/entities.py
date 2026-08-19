import enum
import uuid
from datetime import datetime, timezone
from sqlalchemy import Boolean, DateTime, Enum, Float, ForeignKey, Integer, JSON, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.session import Base


def uid() -> str:
    return str(uuid.uuid4())


def now() -> datetime:
    return datetime.now(timezone.utc)


class UserRole(str, enum.Enum):
    student = "student"
    doctor = "doctor"
    lecturer = "lecturer"
    administrator = "administrator"


class User(Base):
    __tablename__ = "users"
    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=uid)
    full_name: Mapped[str] = mapped_column(String(160))
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    password_hash: Mapped[str] = mapped_column(String(255))
    university: Mapped[str | None] = mapped_column(String(255))
    registration_number: Mapped[str | None] = mapped_column(String(100))
    role: Mapped[UserRole] = mapped_column(Enum(UserRole), default=UserRole.student)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=now)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=now, onupdate=now)


class ClinicalCase(Base):
    __tablename__ = "clinical_cases"
    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    title: Mapped[str] = mapped_column(String(255))
    specialty: Mapped[str] = mapped_column(String(120), index=True)
    difficulty: Mapped[str] = mapped_column(String(40))
    estimated_time: Mapped[str | None] = mapped_column(String(40))
    summary: Mapped[str] = mapped_column(Text)
    patient_profile: Mapped[dict] = mapped_column(JSON)
    presenting_complaint: Mapped[str] = mapped_column(Text)
    doctor_verified_diagnosis: Mapped[str] = mapped_column(String(255))
    accepted_diagnoses: Mapped[list] = mapped_column(JSON, default=list)
    feedback: Mapped[dict] = mapped_column(JSON, default=dict)
    status: Mapped[str] = mapped_column(String(30), default="draft", index=True)
    created_by: Mapped[str | None] = mapped_column(ForeignKey("users.id"))
    verified_by: Mapped[str | None] = mapped_column(ForeignKey("users.id"))
    verified_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=now)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=now, onupdate=now)
    history_items: Mapped[list["HistoryItem"]] = relationship(cascade="all, delete-orphan")
    examination_items: Mapped[list["ExaminationItem"]] = relationship(cascade="all, delete-orphan")
    investigations: Mapped[list["Investigation"]] = relationship(cascade="all, delete-orphan")


class HistoryItem(Base):
    __tablename__ = "history_items"
    id: Mapped[str] = mapped_column(String(80), primary_key=True, default=uid)
    case_id: Mapped[str] = mapped_column(ForeignKey("clinical_cases.id", ondelete="CASCADE"), index=True)
    section: Mapped[str] = mapped_column(String(120))
    accepted_questions: Mapped[list] = mapped_column(JSON, default=list)
    keywords: Mapped[list] = mapped_column(JSON, default=list)
    patient_answer: Mapped[str] = mapped_column(Text)
    is_important: Mapped[bool] = mapped_column(Boolean, default=False)


class ExaminationItem(Base):
    __tablename__ = "examination_items"
    id: Mapped[str] = mapped_column(String(80), primary_key=True, default=uid)
    case_id: Mapped[str] = mapped_column(ForeignKey("clinical_cases.id", ondelete="CASCADE"), index=True)
    examination_name: Mapped[str] = mapped_column(String(180))
    accepted_requests: Mapped[list] = mapped_column(JSON, default=list)
    keywords: Mapped[list] = mapped_column(JSON, default=list)
    findings: Mapped[str] = mapped_column(Text)
    is_important: Mapped[bool] = mapped_column(Boolean, default=False)


class Investigation(Base):
    __tablename__ = "investigations"
    id: Mapped[str] = mapped_column(String(80), primary_key=True, default=uid)
    case_id: Mapped[str] = mapped_column(ForeignKey("clinical_cases.id", ondelete="CASCADE"), index=True)
    name: Mapped[str] = mapped_column(String(180))
    accepted_requests: Mapped[list] = mapped_column(JSON, default=list)
    result: Mapped[str] = mapped_column(Text)
    interpretation: Mapped[str] = mapped_column(Text, default="")
    classification: Mapped[str] = mapped_column(String(60), default="helpful")
    is_required: Mapped[bool] = mapped_column(Boolean, default=False)


class CaseContent(Base):
    __tablename__ = "case_content"
    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=uid)
    case_id: Mapped[str] = mapped_column(ForeignKey("clinical_cases.id", ondelete="CASCADE"), index=True)
    kind: Mapped[str] = mapped_column(String(40), index=True)
    content: Mapped[str] = mapped_column(Text)
    diagnosis_type: Mapped[str | None] = mapped_column(String(40))
    keyword: Mapped[str | None] = mapped_column(String(120))
    weight: Mapped[float] = mapped_column(Float, default=1.0)


class AcceptedDiagnosis(Base):
    __tablename__ = "accepted_diagnoses"
    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=uid)
    case_id: Mapped[str] = mapped_column(ForeignKey("clinical_cases.id", ondelete="CASCADE"), index=True)
    diagnosis: Mapped[str] = mapped_column(String(255))


class ClinicalReasoningPoint(Base):
    __tablename__ = "clinical_reasoning_points"
    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=uid)
    case_id: Mapped[str] = mapped_column(ForeignKey("clinical_cases.id", ondelete="CASCADE"), index=True)
    content: Mapped[str] = mapped_column(Text)
    keyword: Mapped[str | None] = mapped_column(String(120))
    weight: Mapped[float] = mapped_column(Float, default=1.0)


class TeachingPoint(Base):
    __tablename__ = "teaching_points"
    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=uid)
    case_id: Mapped[str] = mapped_column(ForeignKey("clinical_cases.id", ondelete="CASCADE"), index=True)
    content: Mapped[str] = mapped_column(Text)


class SimulationAttempt(Base):
    __tablename__ = "simulation_attempts"
    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=uid)
    user_id: Mapped[str] = mapped_column(ForeignKey("users.id"), index=True)
    case_id: Mapped[str] = mapped_column(ForeignKey("clinical_cases.id"), index=True)
    status: Mapped[str] = mapped_column(String(30), default="in_progress")
    current_step: Mapped[str] = mapped_column(String(60), default="PatientScenario")
    draft_updated_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    started_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=now)
    completed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    time_taken: Mapped[int | None] = mapped_column(Integer)
    overall_score: Mapped[float | None] = mapped_column(Float)
    response: Mapped["StudentResponse | None"] = relationship(cascade="all, delete-orphan", uselist=False)
    evaluation: Mapped["EvaluationResult | None"] = relationship(cascade="all, delete-orphan", uselist=False)


class StudentResponse(Base):
    __tablename__ = "student_responses"
    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=uid)
    simulation_attempt_id: Mapped[str] = mapped_column(ForeignKey("simulation_attempts.id", ondelete="CASCADE"), unique=True)
    history_questions: Mapped[list] = mapped_column(JSON, default=list)
    conversation: Mapped[list] = mapped_column(JSON, default=list)
    examinations_requested: Mapped[list] = mapped_column(JSON, default=list)
    initial_diagnosis: Mapped[str] = mapped_column(Text, default="")
    initial_reasoning: Mapped[str] = mapped_column(Text, default="")
    differential_diagnoses: Mapped[list] = mapped_column(JSON, default=list)
    most_likely_diagnosis: Mapped[str] = mapped_column(Text, default="")
    investigations_selected: Mapped[list] = mapped_column(JSON, default=list)
    investigation_interpretation: Mapped[str] = mapped_column(Text, default="")
    final_diagnosis: Mapped[str] = mapped_column(Text, default="")
    final_reasoning: Mapped[str] = mapped_column(Text, default="")


class EvaluationResult(Base):
    __tablename__ = "evaluation_results"
    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=uid)
    simulation_attempt_id: Mapped[str] = mapped_column(ForeignKey("simulation_attempts.id", ondelete="CASCADE"), unique=True)
    corrected_response: Mapped[str] = mapped_column(Text, default="")
    payload: Mapped[dict] = mapped_column(JSON, default=dict)
    scores: Mapped[dict] = mapped_column(JSON)
    overall_score: Mapped[float] = mapped_column(Float)
    strengths: Mapped[list] = mapped_column(JSON, default=list)
    mistakes: Mapped[list] = mapped_column(JSON, default=list)
    missed_points: Mapped[list] = mapped_column(JSON, default=list)
    improvement_advice: Mapped[str] = mapped_column(Text, default="")
    study_focus: Mapped[list] = mapped_column(JSON, default=list)
    safety_flags: Mapped[list] = mapped_column(JSON, default=list)
    ai_model: Mapped[str | None] = mapped_column(String(120))
    prompt_version: Mapped[str] = mapped_column(String(40), default="v1")
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=now)


class ConversationMessage(Base):
    __tablename__ = "conversation_messages"
    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=uid)
    simulation_attempt_id: Mapped[str] = mapped_column(ForeignKey("simulation_attempts.id", ondelete="CASCADE"), index=True)
    sequence: Mapped[int] = mapped_column(Integer)
    sender: Mapped[str] = mapped_column(String(30))
    original_text: Mapped[str] = mapped_column(Text, default="")
    corrected_text: Mapped[str] = mapped_column(Text, default="")
    response_text: Mapped[str] = mapped_column(Text, default="")
    matched_item_id: Mapped[str | None] = mapped_column(String(80))
    confidence: Mapped[float | None] = mapped_column(Float)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=now)


class ScoreBreakdown(Base):
    __tablename__ = "score_breakdowns"
    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=uid)
    evaluation_result_id: Mapped[str] = mapped_column(ForeignKey("evaluation_results.id", ondelete="CASCADE"), index=True)
    category: Mapped[str] = mapped_column(String(80))
    score: Mapped[float] = mapped_column(Float)
    explanation: Mapped[str] = mapped_column(Text)


class SavedSimulationState(Base):
    __tablename__ = "saved_simulation_states"
    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=uid)
    simulation_attempt_id: Mapped[str] = mapped_column(ForeignKey("simulation_attempts.id", ondelete="CASCADE"), unique=True, index=True)
    state: Mapped[dict] = mapped_column(JSON, default=dict)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=now, onupdate=now)
