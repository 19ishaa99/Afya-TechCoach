"""Store complete structured AI evaluation payloads."""
from alembic import op
import sqlalchemy as sa

revision = "0003"
down_revision = "0002"
branch_labels = None
depends_on = None


def upgrade():
    columns = {column["name"] for column in sa.inspect(op.get_bind()).get_columns("evaluation_results")}
    if "payload" not in columns:
        op.add_column("evaluation_results", sa.Column("payload", sa.JSON(), nullable=False, server_default="{}"))


def downgrade():
    columns = {column["name"] for column in sa.inspect(op.get_bind()).get_columns("evaluation_results")}
    if "payload" in columns: op.drop_column("evaluation_results", "payload")
