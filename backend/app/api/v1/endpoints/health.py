from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.db.session import get_db

router = APIRouter()


@router.get("/health")
def health_check(db: Session = Depends(get_db)):
    db_status = "healthy"
    try:
        db.execute(text("SELECT 1"))
    except Exception as e:
        db_status = f"unhealthy: {str(e)}"

    return {
        "status": "ok" if db_status == "healthy" else "degraded",
        "service": "LayerOS Poultry ERP (Maharashtra)",
        "version": "1.0.0",
        "database": "postgresql_live" if db_status == "healthy" else db_status,
        "checks": {
            "api": "healthy",
            "auth": "ready",
            "storage": "ready",
            "database": db_status,
        }
    }


@router.get("/ready")
def readiness_check(db: Session = Depends(get_db)):
    try:
        db.execute(text("SELECT 1"))
        return {"ready": True}
    except Exception:
        return {"ready": False}
