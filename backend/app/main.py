from contextlib import asynccontextmanager
from time import monotonic
from typing import Literal

from fastapi import FastAPI, Response
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy import text
from sqlalchemy.exc import SQLAlchemyError

from app.config import Settings
from app.database import build_engine


class DatabaseHealth(BaseModel):
    reachable: bool
    latency_ms: float


class Health(BaseModel):
    status: Literal["ok", "degraded"]
    version: str
    uptime_s: int
    database: DatabaseHealth


def create_app(settings: Settings | None = None, engine=None) -> FastAPI:
    settings = settings or Settings()
    db = engine if engine is not None else build_engine(settings)
    started = monotonic()

    @asynccontextmanager
    async def lifespan(app: FastAPI):
        yield
        db.dispose()

    app = FastAPI(title="Mentor & Me API", version=settings.app_version, lifespan=lifespan)
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_methods=["GET"],
        allow_headers=["Content-Type"],
    )

    @app.get("/live")
    def live() -> dict[str, str]:
        return {"status": "ok"}

    @app.get("/health", response_model=Health, responses={503: {"model": Health}})
    def health(response: Response) -> Health:
        before = monotonic()
        try:
            with db.connect() as connection:
                connection.execute(text("SELECT 1"))
            reachable = True
        except SQLAlchemyError:
            # Never expose connection strings, hostnames, or driver errors in the API.
            reachable = False
            response.status_code = 503
        response.headers["Cache-Control"] = "no-store"
        return Health(
            status="ok" if reachable else "degraded",
            version=settings.app_version,
            uptime_s=int(monotonic() - started),
            database=DatabaseHealth(
                reachable=reachable, latency_ms=round((monotonic() - before) * 1000, 2)
            ),
        )

    return app
