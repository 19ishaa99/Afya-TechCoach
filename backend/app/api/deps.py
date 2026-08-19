from fastapi import Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session
from app.core.security import decode_token
from app.database.session import get_db
from app.models.entities import User

bearer = HTTPBearer(auto_error=False)


def current_user(credentials: HTTPAuthorizationCredentials = Depends(bearer), db: Session = Depends(get_db)) -> User:
    if not credentials:
        raise HTTPException(401, "Authentication required")
    try:
        user_id = decode_token(credentials.credentials, "access")
    except ValueError:
        raise HTTPException(401, "Session expired or invalid")
    user = db.get(User, user_id)
    if not user or not user.is_active:
        raise HTTPException(401, "Session expired or invalid")
    return user
