# Backend

FastAPI service for student registration, JWT sessions, published cases, case-restricted patient responses, attempts, scoring, feedback, and progress.

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
alembic upgrade head
PYTHONPATH=. python seed_cases.py
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
PYTHONPATH=. pytest -q
```

The default SQLite URL is for local diagnostics only. Set PostgreSQL for normal use. `app/ai/evaluator.py` calls OpenAI from the server and validates structured output; backend code recomputes the weighted total. Without a configured key/model, submitted answers remain stored and evaluation returns a safe retryable error.

Simulation API flow:

```text
POST /api/simulations/start
PATCH /api/simulations/{id}
GET /api/simulations/{id}
POST /api/simulations/{id}/submit
POST /api/simulations/{id}/evaluate
GET /api/simulations/{id}/feedback
POST /api/simulations/{id}/retry
```

Drafts, conversations, submissions, evaluation payloads and category score explanations are persisted. Every attempt lookup is restricted to the authenticated owner.

Public registration always creates students. Doctor/lecturer/admin roles are reserved; authoring and approval endpoints remain intentionally unavailable pending governance and authorization review.
