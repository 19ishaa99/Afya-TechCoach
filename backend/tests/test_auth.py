from uuid import uuid4
import pytest
from fastapi import HTTPException
from starlette.requests import Request
from sqlalchemy import select
from app.api.routes.auth import login, refresh, register
from app.core.security import decode_token, verify_password
from app.database.session import Base, SessionLocal, engine
from app.models.entities import User
from app.schemas.api import LoginRequest, RefreshRequest, UserCreate


def test_register_login_refresh_and_duplicate_database_flow():
    Base.metadata.create_all(engine)
    db = SessionLocal()
    email = f"student-{uuid4()}@example.com"
    payload = UserCreate(
        full_name="Flow Test Student",
        email=email,
        password="password123",
        university="Afya Medical University",
        registration_number=f"TEST-{uuid4()}"
    )
    try:
        request = Request({"type": "http", "method": "POST", "path": "/api/auth", "headers": [], "client": ("test", 1)})
        created = register(request, payload, db)
        stored = db.scalar(select(User).where(User.email == email))
        assert stored and stored.id == created.id
        assert stored.password_hash != payload.password
        assert verify_password(payload.password, stored.password_hash)
        assert stored.role.value == "student"

        with pytest.raises(HTTPException) as duplicate:
            register(request, payload, db)
        assert duplicate.value.status_code == 409

        with pytest.raises(HTTPException) as bad_login:
            login(request, LoginRequest(email=email, password="wrong-password"), db)
        assert bad_login.value.status_code == 401

        token_pair = login(request, LoginRequest(email=email, password=payload.password), db)
        assert decode_token(token_pair.access_token, "access") == stored.id
        assert decode_token(token_pair.refresh_token, "refresh") == stored.id

        refreshed = refresh(RefreshRequest(refresh_token=token_pair.refresh_token), db)
        assert decode_token(refreshed.access_token, "access") == stored.id
    finally:
        db.close()


def test_schema_rejects_invalid_auth_payloads():
    with pytest.raises(ValueError):
        UserCreate(full_name="", email="invalid", password="short")
    with pytest.raises(ValueError):
        LoginRequest(email="invalid", password="x")
