# R1 validation

Validated locally on October 27, 2026:

- Python 3.11.18: Ruff passes; two backend tests pass.
- PostgreSQL integration test is skipped locally because no PostgreSQL server is available.
- Real psycopg connection-refused check: /health returns 503 with redacted output;
  /live remains 200.
- Alembic offline upgrade generates PostgreSQL SQL for the baseline and release row.
- Three frontend tests pass; TypeScript checking and Vite production build pass.
- Frozen dependency installation checked with the configured pnpm 10.28.2.

Not yet verified: live PostgreSQL migration round trip, Docker image/Compose execution,
GitHub-hosted CI, authenticated GitHub write permissions, branch protection, and HTTPS
staging. CI is configured to test PostgreSQL and Docker once this branch is published.
Docker is not installed on this workstation. No existing/cloud database was contacted.
The current FastAPI/Starlette test client emits a non-failing httpx deprecation warning.

Prepared on feat/r1-walking-skeleton with the user-provided Git author identity.
Nothing has been pushed; GitHub authentication and default-branch initialization remain pending.
