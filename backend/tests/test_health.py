from unittest.mock import MagicMock

from fastapi.testclient import TestClient
from sqlalchemy.exc import OperationalError

from app.config import Settings
from app.main import create_app


def client(engine):
    return TestClient(create_app(Settings(
        database_url="postgresql+psycopg://test:test@localhost/test", _env_file=None
    ), engine))


def test_reachable_database():
    engine = MagicMock()
    with client(engine) as api:
        response = api.get("/health")
        assert response.status_code == 200
        assert response.json()["database"]["reachable"] is True
        assert response.json()["status"] == "ok"
        assert response.headers["cache-control"] == "no-store"
        query = engine.connect.return_value.__enter__.return_value.execute.call_args.args[0]
        assert str(query) == "SELECT 1"
    engine.dispose.assert_called_once()


def test_database_failure_preserves_liveness_and_redacts_errors():
    engine = MagicMock()
    engine.connect.side_effect = OperationalError("secret-host", {}, Exception("secret-password"))
    with client(engine) as api:
        response = api.get("/health")
        assert response.status_code == 503
        assert response.json()["status"] == "degraded"
        assert response.json()["database"]["reachable"] is False
        assert "secret" not in response.text
        assert api.get("/live").status_code == 200
