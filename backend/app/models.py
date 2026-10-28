from datetime import datetime

from sqlalchemy import DateTime, String, func
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class SystemRelease(Base):
    """R1 migration marker; domain tables will be introduced with their features."""

    __tablename__ = "system_release"
    version: Mapped[str] = mapped_column(String(32), primary_key=True)
    installed_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
