from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase

from app.config import Settings


class Base(DeclarativeBase):
    pass


def build_engine(settings: Settings):
    return create_engine(
        settings.database_url.get_secret_value(),
        pool_pre_ping=True,
        pool_size=5,
        max_overflow=0,
        pool_timeout=settings.db_connect_timeout_s,
        connect_args={
            "connect_timeout": settings.db_connect_timeout_s,
            "options": "-c statement_timeout=3000",
        },
    )
