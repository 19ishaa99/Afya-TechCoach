"""Add recoverable simulation draft fields.

Revision ID: 0002
Revises: 0001
"""
from alembic import op
import sqlalchemy as sa

revision = "0002"
down_revision = "0001"
branch_labels = None
depends_on = None


def upgrade():
    inspector = sa.inspect(op.get_bind())
    attempt_columns = {column["name"] for column in inspector.get_columns("simulation_attempts")}
    response_columns = {column["name"] for column in inspector.get_columns("student_responses")}
    if "current_step" not in attempt_columns:
        op.add_column("simulation_attempts", sa.Column("current_step", sa.String(length=60), nullable=False, server_default="PatientScenario"))
    if "draft_updated_at" not in attempt_columns:
        op.add_column("simulation_attempts", sa.Column("draft_updated_at", sa.DateTime(timezone=True), nullable=True))
    if "conversation" not in response_columns:
        op.add_column("student_responses", sa.Column("conversation", sa.JSON(), nullable=False, server_default="[]"))


def downgrade():
    inspector = sa.inspect(op.get_bind())
    attempt_columns = {column["name"] for column in inspector.get_columns("simulation_attempts")}
    response_columns = {column["name"] for column in inspector.get_columns("student_responses")}
    if "conversation" in response_columns: op.drop_column("student_responses", "conversation")
    if "draft_updated_at" in attempt_columns: op.drop_column("simulation_attempts", "draft_updated_at")
    if "current_step" in attempt_columns: op.drop_column("simulation_attempts", "current_step")
