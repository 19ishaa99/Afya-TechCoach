import json
import logging
from datetime import datetime, timezone
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware
from app.api.routes import auth, cases, progress, simulations
from app.core.config import get_settings
from app.core.rate_limit import limiter

class JsonFormatter(logging.Formatter):
    def format(self, record):
        return json.dumps({"timestamp": datetime.now(timezone.utc).isoformat(), "level": record.levelname, "logger": record.name, "message": record.getMessage()})


handler = logging.StreamHandler(); handler.setFormatter(JsonFormatter())
logging.basicConfig(level=logging.INFO, handlers=[handler], force=True)
settings = get_settings()
app = FastAPI(title=settings.app_name, version="1.0.0")
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
app.add_middleware(SlowAPIMiddleware)
app.add_middleware(CORSMiddleware, allow_origins=settings.origins, allow_credentials=True, allow_methods=["*"], allow_headers=["*"])


@app.middleware("http")
async def request_size_limit(request: Request, call_next):
    length = request.headers.get("content-length")
    if length and int(length) > settings.max_request_bytes:
        return JSONResponse({"detail": "Request is too large"}, status_code=413)
    return await call_next(request)


@app.exception_handler(Exception)
async def safe_unhandled_error(request: Request, exc: Exception):
    logging.getLogger("afya.api").exception("Unhandled request failure path=%s", request.url.path)
    return JSONResponse({"detail": "The service is temporarily unavailable. Please try again."}, status_code=500)


@app.get("/health")
def health(): return {"status": "ok"}


app.include_router(auth.router, prefix="/api")
app.include_router(cases.router, prefix="/api")
app.include_router(simulations.router, prefix="/api")
app.include_router(progress.router, prefix="/api")
