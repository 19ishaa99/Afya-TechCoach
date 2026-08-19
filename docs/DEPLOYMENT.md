# Deployment and tester APK

## Backend

Provision a managed PostgreSQL database and a Docker-capable HTTPS host. `render.yaml` is an optional blueprint; importing it does not deploy automatically. Configure these server-only values in the host dashboard:

```env
ENVIRONMENT=production
DATABASE_URL=postgresql+psycopg://USER:PASSWORD@HOST:5432/DATABASE?sslmode=require
JWT_SECRET_KEY=<at-least-64-random-hex-characters>
OPENAI_API_KEY=<server-only-key>
OPENAI_MODEL=<Responses-API model supporting structured outputs>
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7
CORS_ORIGINS=https://your-web-app.example
DATABASE_POOL_SIZE=5
DATABASE_MAX_OVERFLOW=10
```

The container runs migrations, idempotently seeds the five approved cases, and starts Uvicorn. Verify `https://YOUR-API/health`, then test registration, login, cases, draft save, submission, evaluation retry, feedback reload, and cross-user attempt isolation. Enable provider database backups, TLS enforcement, uptime/error monitoring, log retention with access controls, and secret rotation. The built-in limiter is per-process; use a shared Redis-backed limiter before high-volume public release.

## EAS environments and APK

Install and authenticate the CLI, then create the public URL independently for preview and production. This is the only backend value included in the app:

```bash
npx eas-cli login
npx eas-cli env:create --environment preview --name EXPO_PUBLIC_API_BASE_URL --value https://YOUR-API.example --visibility plaintext
npx eas-cli env:create --environment production --name EXPO_PUBLIC_API_BASE_URL --value https://YOUR-API.example --visibility plaintext
npx eas-cli build --platform android --profile preview
```

The preview profile creates an installable APK. Download it from the build URL, transfer it to the phone, allow installation from that source, and install. The production command creates an AAB:

```bash
npx eas-cli build --platform android --profile production
```

Never build a tester APK with `localhost` or a LAN IP. A standalone APK works while the development PC is off only when its configured HTTPS backend and PostgreSQL database are continuously online.

Before distribution, test on a fresh Android installation: registration, login/session restart, hardware Back, unfinished-simulation recovery, history language matching, final submission, AI failure/retry, feedback restart, logout, offline draft preservation, reconnection, and a small phone layout.
