# Mentor & Me — R1 walking skeleton

CSUN CIT Senior Design, Team 3. React **18**, TypeScript, Vite, Tailwind CSS,
Python **3.11**, FastAPI, SQLAlchemy, PostgreSQL **16**, Alembic, and GitHub Actions.

## Run with Docker

Install Docker with Compose v2, then from this directory:

```sh
cp .env.example .env
docker compose up --build -d --wait
```

- App: http://localhost:8080
- API health: http://localhost:8080/api/health
- API documentation: http://localhost:8000/docs
- OpenAPI: http://localhost:8000/openapi.json

Compose starts a **local** PostgreSQL instance, waits for it, runs the migration as a
separate one-shot service, then starts the API and web server. Database data persists
in a named volume. `docker compose down` stops services without deleting data.
`docker compose down -v` deletes the local database; use only for disposable data.
The supplied password is for local development only. Local Compose credentials must
be URL-safe; percent-encode credentials when constructing other database URLs.
Changing POSTGRES_PASSWORD does not change an existing volume's database password.

## Run without containers (application development)

Prerequisites: Python 3.11, Node 22.12+, pnpm 10.28.2, and PostgreSQL 16.
Vite's Node requirements: https://vite.dev/guide/.

```sh
cp .env.example .env
# Set DATABASE_URL in .env to your local PostgreSQL instance.
cd backend
python3.11 -m venv .venv
. .venv/bin/activate
pip install -r requirements.txt
alembic upgrade head
uvicorn app.main:create_app --factory --reload
```

In another terminal:

```sh
cd frontend
corepack enable
corepack prepare pnpm@10.28.2 --activate
pnpm install --frozen-lockfile
pnpm dev
```

Open http://localhost:5173. Vite forwards `/api/*` to localhost:8000; Docker's
Nginx forwards the same path to the backend container. No secrets enter the browser
bundle. The same frontend image can be used across environments with a same-origin
`/api` reverse proxy. The manifest and service worker provide a PWA starter and an
explicit offline message, without caching health responses. Full offline operation
and cross-browser installation verification remain future work.

## Configuration

`DATABASE_URL` is required. Example shape (not real credentials):

```
postgresql+psycopg://USER:URL_ENCODED_PASSWORD@HOST:5432/DATABASE?sslmode=verify-full&sslrootcert=/run/certs/provider-ca.pem
```

`APP_VERSION` defaults to 0.1.0. `CORS_ORIGINS` is a JSON array of explicit origins.
`DB_CONNECT_TIMEOUT_S` defaults to 3 (range 2–30); query timeout is 3 seconds.
The API starts without connecting to PostgreSQL. `/live` returns 200 when the process
responds. `/health` executes SELECT 1 and returns 200/`ok` or 503/`degraded`, plus
version, uptime, reachability, and elapsed probe time. Errors never include connection
credentials. This probe verifies connectivity, **not schema currency**; migrations are
an explicit deployment prerequisite. It is synchronous so database I/O runs in
FastAPI's worker thread pool rather than blocking its event loop.

## Migrations

```sh
cd backend
alembic upgrade head
alembic current
alembic check
# Disposable development DB only:
alembic downgrade base
alembic upgrade head
```

`0001_r1_baseline` creates and seeds `system_release`. It is a real, reversible
starter migration. It deliberately does **not** implement the ten domain tables,
authentication, matching, embeddings, Redis, or seed profiles. Those belong to
subsequent increments. Before R2, resolve the spec's pending-match versus accepted-
match ambiguity and design database enforcement for conversation participants and
accepted/active matches: a foreign key alone does not enforce those rules.

New models go in `app/models.py`, then use `alembic revision --autogenerate -m "..."`
and review the generated migration. Never auto-create schema on API startup.
Alembic workflow reference: https://alembic.sqlalchemy.org/en/latest/tutorial.html.

## Tests and CI

```sh
cd backend
ruff check .
pytest -q
# Only against a disposable, migrated PostgreSQL database:
RUN_DB_TESTS=1 pytest -q
cd ../frontend
pnpm test
pnpm build
```

CI runs backend lint, health tests, PostgreSQL integration, schema drift checking,
migration upgrade/downgrade/upgrade, frontend tests and build, and a Docker Compose
smoke test through the frontend proxy. Backend dependencies and frontend dependencies
are locked in requirements.txt and pnpm-lock.yaml. Refresh them deliberately.

## Branches and repository setup

Work on `feat/<description>` and open a PR for teammate review. This delivery is on
`feat/r1-walking-skeleton`; it has not been pushed. Repository inspection found no
remote refs, so there is no existing main commit to target yet. The repository is
readable anonymously (public), despite the older spec describing it as private.
Write access and branch protection have not been verified.

A repository owner must establish the initial default branch using the team's approved
bootstrap process, then require one approval and passing `backend`, `frontend`, and
`containers` CI checks for main. Do not bypass protection or push this work directly
to main. After default-branch setup, push this feature branch and create a PR.
No GitHub credentials are included. Each teammate should configure their own Git commit identity.

## Staging handoff — information needed

No AWS service, credentials, infrastructure, or live database has been assumed or
modified. Before staging deployment, confirm:

1. Exact service (RDS, Aurora PostgreSQL, or PostgreSQL on EC2), engine/version,
   hostname, port, and database name.
2. Network path from the API: VPC/subnet/security groups, VPN or tunnel if needed.
   Avoid opening PostgreSQL to the public internet.
3. Runtime database user and secret delivery mechanism, plus a separate migration
   role with DDL privileges. Keep secrets outside Git and frontend configuration.
4. Required TLS mode and CA certificate path; use verified TLS for remote connections.
5. Whether pgvector is supported and who can enable it. R1 does not require it.
6. Staging compute service, domain, HTTPS certificate/termination, deployment access,
   and the teammate responsible for deployment.

Use the same images, inject staging configuration securely, run migrations once,
then start the API and configure `/api` routing. Local compose.yaml is a development
stack and always uses its own `db`; do not point it at the existing cloud database.
Require a healthy API, app load, and green PR checks before marking R1 complete.
**The spec's full R1 exit criteria are not met until HTTPS staging is deployed and CI
has actually run successfully on GitHub.**
