"""Create R1 release marker. Domain schema intentionally deferred to R2+."""
import sqlalchemy as sa
from alembic import op

revision = "0001_r1_baseline"
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    table = op.create_table(
        "system_release",
        sa.Column("version", sa.String(32), primary_key=True),
        sa.Column("installed_at", sa.DateTime(timezone=True),
                  server_default=sa.func.now(), nullable=False),
    )
    op.bulk_insert(table, [{"version": "0.1.0"}])


def downgrade():
    op.drop_table("system_release")
