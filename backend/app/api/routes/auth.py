from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session
from app.api.deps import current_user
from app.core.config import get_settings
from app.core.security import create_token, decode_token, hash_password, verify_password
from app.core.rate_limit import limiter
from app.database.session import get_db
from app.models.entities import User
from app.schemas.api import ForgotPasswordRequest, LoginRequest, RefreshRequest, ResetPasswordRequest, TokenPair, UserCreate, UserRead

router = APIRouter(prefix="/auth", tags=["authentication"])


def tokens(user_id: str) -> TokenPair:
    settings = get_settings()
    return TokenPair(
        access_token=create_token(user_id, "access", timedelta(minutes=settings.access_token_expire_minutes)),
        refresh_token=create_token(user_id, "refresh", timedelta(days=settings.refresh_token_expire_days)),
    )


@router.post("/register", response_model=UserRead, status_code=201)
@limiter.limit("8/minute")
def register(request: Request, payload: UserCreate, db: Session = Depends(get_db)):
    email = payload.email.lower()
    if db.scalar(select(User).where(User.email == email)):
        raise HTTPException(409, "An account with this email already exists")
    user = User(
        **payload.model_dump(exclude={"password", "email"}),
        email=email,
        password_hash=hash_password(payload.password),
        role="student",
    )
    db.add(user)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(409, "An account with this email already exists")
    db.refresh(user)
    return user


@router.post("/login", response_model=TokenPair)
@limiter.limit("12/minute")
def login(request: Request, payload: LoginRequest, db: Session = Depends(get_db)):
    user = db.scalar(select(User).where(User.email == payload.email.lower()))
    if not user or not user.is_active or not verify_password(payload.password, user.password_hash):
        raise HTTPException(401, "Email or password is incorrect")
    return tokens(user.id)


@router.post("/refresh", response_model=TokenPair)
def refresh(payload: RefreshRequest, db: Session = Depends(get_db)):
    try: user_id = decode_token(payload.refresh_token, "refresh")
    except ValueError: raise HTTPException(401, "Refresh token is invalid or expired")
    if not db.get(User, user_id): raise HTTPException(401, "Account unavailable")
    return tokens(user_id)


@router.post("/forgot-password")
def forgot_password(_: ForgotPasswordRequest):
    return {"message": "If an account exists, password reset instructions will be sent."}


@router.post("/reset-password")
def reset_password(_: ResetPasswordRequest):
    raise HTTPException(501, "Password-reset delivery requires email configuration")


@router.get("/me", response_model=UserRead)
def me(user: User = Depends(current_user)):
    return user
