# Afya TechCoach

Afya TechCoach is an Expo React Native clinical-training application backed by FastAPI and PostgreSQL. Students follow the preserved flow from patient presentation through history, examination, diagnoses, investigations, final reasoning, and doctor-approved educational feedback.

## Architecture

- `src/`: Expo client, navigation, simulation context, deterministic matching/evaluation, secure token storage, and centralized APIs.
- `src/constants/mockData.js`: the five original clinical cases; retained as the local fallback and seed source.
- `backend/app/`: FastAPI routes, SQLAlchemy models, security, scoring, and OpenAI Responses API boundary.
- `backend/alembic/`: database migration.
- `backend/seed_cases.py`: imports all five existing cases.
- `docs/PROJECT_AUDIT.md`: detailed audit and remaining release work.

## Navigation and recovery

Expo Web uses stable routes including `/login`, `/register`, `/dashboard`, `/cases/:caseId`, and `/simulations/:simulationId/...`. React Navigation owns browser Back/Forward history. Android/iOS cache the last navigation state in AsyncStorage. Authentication restores before the protected navigator is rendered.

`SimulationContext` keeps a recovery cache in AsyncStorage and treats the authenticated FastAPI attempt as authoritative. Meaningful draft changes are debounced, saved locally and patched remotely; the app also saves when it backgrounds and before submission. Deep links reload the attempt by ID and reject unavailable or unauthorized attempts with a recovery screen.

## Patient conversation and evaluation

History questions use deterministic approved synonyms first. Low-confidence wording—including misspellings or mixed English–Swahili—may use the backend semantic matcher. The matcher sees IDs, approved question variants and keywords, but never patient answers; FastAPI verifies the returned ID belongs to the active case and returns only its stored response.

Final answers are reviewed, saved, locked idempotently, then evaluated through the backend OpenAI Responses API with a strict Pydantic schema. The backend clamps every category to 0–100 and independently calculates the weighted overall score: history 10%, examination 10%, initial diagnosis 5%, differential 15%, investigation selection 15%, interpretation 10%, final diagnosis 15%, reasoning 15%, safety 5%. Language guidance remains separate from clinical scoring. If AI fails, the submission is retained and evaluation can be retried without a duplicate attempt.

## Frontend setup

```bash
npm install
npx expo start
```

Create an uncommitted root `.env`:

```env
EXPO_PUBLIC_API_BASE_URL=http://192.168.1.10:8000
```

Only the backend URL belongs in an `EXPO_PUBLIC_` variable. Never place an OpenAI key or JWT secret there.

## Backend and PostgreSQL setup

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
```

Create PostgreSQL database `afya_techcoach`, edit `backend/.env`, then run:

```bash
alembic upgrade head
PYTHONPATH=. python seed_cases.py
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

API docs are at `http://localhost:8000/docs`; health is at `/health`.

## Exact configuration locations

- OpenAI key: `backend/.env` → `OPENAI_API_KEY=...`
- Supported model: `backend/.env` → `OPENAI_MODEL=...`
- PostgreSQL URL: `backend/.env` → `DATABASE_URL=postgresql+psycopg://...`
- Long random JWT secret: `backend/.env` → `JWT_SECRET_KEY=...`
- Mobile backend URL: root `.env` → `EXPO_PUBLIC_API_BASE_URL=http://LAN-IP:8000`

Both `.env` files are ignored. Do not put secrets in `app.json`, `eas.json`, source, an APK/AAB, or GitHub.

## Android

For Expo Go or a physical phone, connect PC and phone to the same network, run the API with `--host 0.0.0.0`, use the PC LAN IP in the client URL, run `npx expo start`, and scan the QR code. The PC must stay on while it hosts Metro or the local backend.

For an APK, use `eas build --platform android --profile preview`; use a production profile for an AAB. An installed build does not require Metro but still requires its configured backend. The PC may be off only when that backend is deployed to an always-on HTTPS server.

## Tests

```bash
npm run test:frontend
cd backend
PYTHONPATH=. .venv/bin/pytest -q
```

The AI path also needs a staging test with a funded key. Feedback is educational, not medical advice or automatically doctor-verified.

## Manual release checklist

- [ ] Create an OpenAI Platform account, key, and billing/credits; add key/model to `backend/.env`.
- [ ] Create/start PostgreSQL and set `DATABASE_URL`.
- [ ] Generate a long random `JWT_SECRET_KEY`.
- [ ] Run migrations and seed all five cases.
- [ ] Start/deploy the backend and set the client URL.
- [ ] Configure reset-email delivery; reset completion deliberately returns `501` until then.
- [ ] Configure Google OAuth; the current Google button remains UI-only.
- [ ] Have qualified doctors review cases and prompt/rubric changes.
- [ ] Replace or withhold content that is not medically verified.
- [ ] Configure production HTTPS, persistent rate limiting, monitoring, backups, and logs.
- [ ] Add reviewed privacy policy and terms.
- [ ] Build, sign, test, and distribute the Android APK/AAB.

No external deployment or GitHub push has been performed.
