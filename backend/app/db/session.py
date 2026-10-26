from typing import Generator
import logging
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, Session
from app.core.config import settings

logger = logging.getLogger("layeros.db")


def create_db_engine():
    db_url = settings.DATABASE_URL
    if db_url.startswith("sqlite"):
        return create_engine(db_url, connect_args={"check_same_thread": False})

    try:
        connect_args = {"connect_timeout": 2} if "psycopg" in db_url else {}
        eng = create_engine(
            db_url,
            pool_size=settings.DB_POOL_SIZE,
            max_overflow=settings.DB_MAX_OVERFLOW,
            pool_pre_ping=True,
            connect_args=connect_args
        )
        with eng.connect() as conn:
            conn.execute(text("SELECT 1"))
        return eng
    except Exception as e:
        logger.warning(f"PostgreSQL connection failed ({e}). Falling back to local SQLite database.")
        from app.db.base import Base
        import app.models  # noqa: F401
        sqlite_engine = create_engine("sqlite:///./layer_os.db", connect_args={"check_same_thread": False})
        Base.metadata.create_all(sqlite_engine)
        return sqlite_engine


engine = create_db_engine()
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
