# Mentor & Me v1

CSUN CIT Senior Design, Team 3. React **18**, TypeScript, Vite, Tailwind CSS,
Python **3.11**, FastAPI, SQLAlchemy, PostgreSQL **16**, Alembic, and GitHub Actions.

Mentor & Me connects CSUN students and alumni for mentorship. The team has deployed
the starter backend and frontend on AWS and added the Figma Make design as an
interactive prototype.

## Live site and current progress

- [Project landing page](https://mentorandme.com/)
- [Frontend prototype](https://mentorandme.com/prototype)
- [API health](https://mentorandme.com/api/health)

| Area | Current implementation | Next work |
| --- | --- | --- |
| Frontend | React prototype with signup, mentor and mentee profile setup, discovery, requests, matches, and chat screens | Review desktop and mobile layouts and connect screens to backend endpoints |
| Backend foundation | FastAPI health endpoints, PostgreSQL connectivity checks, and a baseline migration | Implement account, profile, matching, request, and messaging endpoints |
| Data | The baseline migration creates and seeds `system_release` | Add domain tables and migrations for the application features |
| Hosting | AWS deployment with the `mentorandme.com` domain | Confirm the deployment branch and document the deployment procedure with the hosting teammate |
| Validation | Backend, frontend, and container CI checks passed for the frontend prototype PR | Review the deployed user flows and repeat checks for later changes |

The prototype uses sample profiles, fixed match percentages, and browser memory.
Signup and chat interactions demonstrate the intended flow. Real account creation,
authentication, saved profiles, calculated recommendations, and persistent messages
are planned backend integration work. Use sample information when reviewing it.

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

## Figma prototype

Open **Open the design prototype** on the landing page, or visit
http://localhost:5173/prototype with Vite (http://localhost:8080/prototype
with Docker). The prototype runs with Vite alone. Use sample info when trying the
signup and profile flows. The screens use local state and demo data for accounts,
profiles, mentor discovery, requests, matches, and chat.

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

`0001_r1_baseline` creates and seeds `system_release`. Subsequent migrations
will add application tables for accounts, profiles, requests, matches, and messages.
Before implementing requests and matches, agree on the transition from a pending
request to a mutually accepted connection and enforce conversation access in the
backend and database.

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

## Proposed matching approach

The following weights are a starting proposal for team review. The prototype's
current match percentages are fixed demo values. The backend will calculate and
return recommendations after profiles are stored in the database.

First, filter candidates using agreed eligibility rules, including mentor role,
active status, and available mentoring capacity. Rank eligible mentors using the
student's preferences and the mentor's profile.

| Comparison | Proposed weight |
| --- | --- |
| Mentor expertise aligns with student interests | 40% |
| Mentor can support the student's career goals | 30% |
| Availability overlaps | 20% |
| Preferred meeting format aligns | 10% |

Normalize each comparison to a value between 0 and 1, multiply by its weight, and
sum the results for a score from 0 to 100. Before implementing scoring, agree on
shared interest and goal tags, availability fields and time zones, treatment of
missing answers, and a stable order for tied scores. The score describes profile
alignment. A confirmed mentorship requires both participants to accept.

## Next development priorities

1. Implement account creation and login with backend validation.
2. Save mentor and mentee profiles and verify they persist after logout and reload.
3. Implement mentor eligibility and the agreed matching score, then return ranked
   recommendations to the discovery screen.
4. Save requests and track acceptance by both participants.
5. Enable persistent conversations for accepted matches.
6. Review complete flows on desktop and mobile and exercise validation, loading,
   empty, and error states.

## Branches and review

Use `feat/<description>` for feature work and open a pull request for teammate
review. The repository's default branch is `feat/figma-prototype`. The former
`feat/r1-walking-skeleton` branch is now named `feat/r1-mentor-and-me-v2`.

Create documentation updates from the current default branch and target that branch
in the pull request. Feature work may target another integration branch when agreed
with the team.

Confirm the current integration and AWS deployment branch with the teammate who
manages hosting before choosing a pull request's base. Require one teammate's
approval and passing `backend`, `frontend`, and `containers` checks before merging.
Each contributor should configure their own Git commit identity.

## Deployment coordination

The hosting teammate manages the AWS environment and domain. Coordinate deployment
through that existing setup. Record the actual AWS compute and database services,
region, deployment branch, and deployment steps once the hosting teammate confirms
them.

The local `compose.yaml` starts its own development database. For AWS deployment,
supply the cloud database connection and secrets through the hosting environment,
apply the reviewed migrations, and configure `/api` routing to FastAPI. Keep
credentials outside Git and frontend code. Confirm the database network path and
TLS configuration with the hosting teammate.

After deployment, check the landing page, `/prototype`, `/api/health`, and the
features delivered by the release. A healthy database probe verifies connection
availability. Feature readiness also requires the relevant schema, endpoints, and
complete user flows to work.
