from typing import Generator, Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
import uuid

from app.db.session import get_db
from app.core.config import settings
from app.core.security import decode_access_token
from app.models.user import User
from app.models.admin import PlatformAdminUser

oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl=f"{settings.API_V1_STR}/auth/login",
    auto_error=False
)


def get_current_user_optional(
    token: Optional[str] = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
) -> Optional[User]:
    if not token:
        return None
    payload = decode_access_token(token)
    if not payload:
        return None
    user_id = payload.get("sub")
    if not user_id:
        return None
    try:
        user_uuid = uuid.UUID(user_id)
        return db.query(User).filter(User.id == user_uuid, User.is_active == True).first()
    except Exception:
        return None


def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    if not token:
        raise credentials_exception
    payload = decode_access_token(token)
    if not payload:
        raise credentials_exception
    user_id = payload.get("sub")
    if not user_id:
        raise credentials_exception
    try:
        user_uuid = uuid.UUID(user_id)
        user = db.query(User).filter(User.id == user_uuid, User.is_active == True).first()
        if not user:
            raise credentials_exception
        return user
    except Exception:
        raise credentials_exception


def get_current_admin(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
) -> PlatformAdminUser:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Admin authorization required",
        headers={"WWW-Authenticate": "Bearer"},
    )
    if not token:
        raise credentials_exception
    payload = decode_access_token(token)
    if not payload or payload.get("role") != "platform_admin":
        raise credentials_exception
    admin_id = payload.get("sub")
    if not admin_id:
        raise credentials_exception
    try:
        admin_uuid = uuid.UUID(admin_id)
        admin = db.query(PlatformAdminUser).filter(PlatformAdminUser.id == admin_uuid, PlatformAdminUser.is_active == True).first()
        if not admin:
            raise credentials_exception
        return admin
    except Exception:
        raise credentials_exception
