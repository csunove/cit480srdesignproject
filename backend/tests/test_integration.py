import os

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import inspect, text

from app.config import Settings
from app.database import build_engine
from app.main import create_app


@pytest.mark.skipif(os.getenv("RUN_DB_TESTS") != "1", reason="requires migrated PostgreSQL")
def test_real_database_and_migration():
    settings = Settings()
    engine = build_engine(settings)
    with engine.connect() as connection:
        assert "system_release" in inspect(connection).get_table_names()
        assert connection.execute(text("SELECT version FROM system_release")).scalar_one() == "0.1.0"
    with TestClient(create_app(settings, engine)) as api:
        assert api.get("/health").json()["database"]["reachable"] is True
