from datetime import datetime, timedelta, timezone
from uuid import uuid4
from jose import JWTError, jwt
from passlib.context import CryptContext
from app.core.config import get_settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
ALGORITHM = "HS256"


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(password: str, password_hash: str) -> bool:
    return pwd_context.verify(password, password_hash)


def create_token(subject: str, token_type: str, expires: timedelta) -> str:
    now = datetime.now(timezone.utc)
    payload = {"sub": subject, "type": token_type, "iat": now, "exp": now + expires, "jti": str(uuid4())}
    return jwt.encode(payload, get_settings().jwt_secret_key, algorithm=ALGORITHM)


def decode_token(token: str, expected_type: str) -> str:
    try:
        payload = jwt.decode(token, get_settings().jwt_secret_key, algorithms=[ALGORITHM])
    except JWTError as exc:
        raise ValueError("Invalid or expired token") from exc
    if payload.get("type") != expected_type or not payload.get("sub"):
        raise ValueError("Invalid token type")
    return payload["sub"]
