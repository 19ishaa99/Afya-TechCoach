"""Add normalized learning, conversation, score, and draft records."""
from alembic import op
import sqlalchemy as sa

revision = "0004"
down_revision = "0003"
branch_labels = None
depends_on = None


def upgrade():
    existing = set(sa.inspect(op.get_bind()).get_table_names())
    tables = [
        ("accepted_diagnoses", [sa.Column("id", sa.String(36), primary_key=True), sa.Column("case_id", sa.String(36), sa.ForeignKey("clinical_cases.id", ondelete="CASCADE"), nullable=False), sa.Column("diagnosis", sa.String(255), nullable=False)]),
        ("clinical_reasoning_points", [sa.Column("id", sa.String(36), primary_key=True), sa.Column("case_id", sa.String(36), sa.ForeignKey("clinical_cases.id", ondelete="CASCADE"), nullable=False), sa.Column("content", sa.Text(), nullable=False), sa.Column("keyword", sa.String(120)), sa.Column("weight", sa.Float(), nullable=False, server_default="1")]),
        ("teaching_points", [sa.Column("id", sa.String(36), primary_key=True), sa.Column("case_id", sa.String(36), sa.ForeignKey("clinical_cases.id", ondelete="CASCADE"), nullable=False), sa.Column("content", sa.Text(), nullable=False)]),
        ("conversation_messages", [sa.Column("id", sa.String(36), primary_key=True), sa.Column("simulation_attempt_id", sa.String(36), sa.ForeignKey("simulation_attempts.id", ondelete="CASCADE"), nullable=False), sa.Column("sequence", sa.Integer(), nullable=False), sa.Column("sender", sa.String(30), nullable=False), sa.Column("original_text", sa.Text(), nullable=False, server_default=""), sa.Column("corrected_text", sa.Text(), nullable=False, server_default=""), sa.Column("response_text", sa.Text(), nullable=False, server_default=""), sa.Column("matched_item_id", sa.String(80)), sa.Column("confidence", sa.Float()), sa.Column("created_at", sa.DateTime(timezone=True), nullable=False)]),
        ("score_breakdowns", [sa.Column("id", sa.String(36), primary_key=True), sa.Column("evaluation_result_id", sa.String(36), sa.ForeignKey("evaluation_results.id", ondelete="CASCADE"), nullable=False), sa.Column("category", sa.String(80), nullable=False), sa.Column("score", sa.Float(), nullable=False), sa.Column("explanation", sa.Text(), nullable=False)]),
        ("saved_simulation_states", [sa.Column("id", sa.String(36), primary_key=True), sa.Column("simulation_attempt_id", sa.String(36), sa.ForeignKey("simulation_attempts.id", ondelete="CASCADE"), nullable=False, unique=True), sa.Column("state", sa.JSON(), nullable=False, server_default="{}"), sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False)]),
    ]
    for name, columns in tables:
        if name not in existing: op.create_table(name, *columns)


def downgrade():
    existing = set(sa.inspect(op.get_bind()).get_table_names())
    for name in ["saved_simulation_states", "score_breakdowns", "conversation_messages", "teaching_points", "clinical_reasoning_points", "accepted_diagnoses"]:
        if name in existing: op.drop_table(name)
