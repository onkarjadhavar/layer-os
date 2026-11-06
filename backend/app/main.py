import uuid
from datetime import datetime, timezone, timedelta
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.v1.api import api_router
from app.db.base import Base
from app.db.session import engine, SessionLocal
from app.models.farm import Farm, Shed, Flock, UnitSettings
from app.models.user import User
from app.models.admin import PlatformAdminUser
from app.core.security import get_password_hash
import app.models  # noqa: F401


def seed_default_production_data():
    """Seeds baseline Rohan Farm and platform admins if absent on fresh databases."""
    db = SessionLocal()
    try:
        # 1. Seed Rohan Farm & Owner User if not present
        rohan_user = db.query(User).filter(
            (User.phone == "7666040924") | (User.email == "umbarepatilrohan@gmail.com")
        ).first()

        if not rohan_user:
            rohan_farm = db.query(Farm).filter(Farm.name == "Rohan Farm").first()
            if not rohan_farm:
                rohan_farm = Farm(
                    id=uuid.UUID("39b23d01-26f6-4b88-bacc-6092cee8056e"),
                    name="Rohan Farm",
                    owner_name="Rohan Tukaram Umbarepatil",
                    phone="7666040924",
                    district="Osmanabad (Dharashiv)",
                    total_capacity=10000,
                    status="active"
                )
                db.add(rohan_farm)
                db.flush()

                unit_settings = UnitSettings(farm_id=rohan_farm.id)
                db.add(unit_settings)

                shed1 = Shed(
                    shed_number="SHED-01",
                    name="शेड 1",
                    capacity=5000,
                    farm_id=rohan_farm.id
                )
                shed2 = Shed(
                    shed_number="SHED-02",
                    name="शेड 2",
                    capacity=5000,
                    farm_id=rohan_farm.id
                )
                db.add_all([shed1, shed2])
                db.flush()

                flock = Flock(
                    farm_id=rohan_farm.id,
                    shed_id=shed1.id,
                    batch_code="Batch-1",
                    breed="BV300",
                    placement_date=datetime.now(timezone.utc).date() - timedelta(days=120),
                    initial_chick_count=10000,
                    current_bird_count=9985,
                    current_phase="laying"
                )
                db.add(flock)

            rohan_user = User(
                id=uuid.UUID("8bd103f0-5716-40af-880c-497bb0006560"),
                full_name="Rohan Tukaram Umbarepatil",
                phone="7666040924",
                email="umbarepatilrohan@gmail.com",
                role="owner",
                farm_id=rohan_farm.id,
                hashed_password=get_password_hash("Rohan@2026"),
                is_active=True
            )
            db.add(rohan_user)

        # 2. Seed Super Admin if not present
        admin = db.query(PlatformAdminUser).filter(
            PlatformAdminUser.email.in_(["admin@layeros.internal", "admin@layeros.in"])
        ).first()
        if not admin:
            admin = PlatformAdminUser(
                email="admin@layeros.internal",
                full_name="मुख्य प्रशासक (Super Admin)",
                hashed_password=get_password_hash("SuperAdmin@2026"),
                role="super_admin",
                is_active=True
            )
            db.add(admin)

        # 3. Seed Operator if not present
        operator = db.query(PlatformAdminUser).filter(
            PlatformAdminUser.email.in_(["operator@layeros.internal", "operator@layeros.in"])
        ).first()
        if not operator:
            operator = PlatformAdminUser(
                email="operator@layeros.internal",
                full_name="प्लॅटफॉर्म ऑपरेटर (Platform Operator)",
                hashed_password=get_password_hash("Operator@2026"),
                role="operator",
                is_active=True
            )
            db.add(operator)

        db.commit()
    except Exception as e:
        db.rollback()
        print(f"Seed note: {e}")
    finally:
        db.close()


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Ensure all tables exist on startup and seed initial admin & farm
    try:
        Base.metadata.create_all(bind=engine)
        seed_default_production_data()
    except Exception as e:
        print(f"Database auto-creation note: {e}")
    yield


app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Backend API for LayerOS Layer Poultry & Egg Business ERP (Maharashtra, India)",
    docs_url="/docs",
    openapi_url="/openapi.json",
    lifespan=lifespan,
)

# CORS middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include v1 router
app.include_router(api_router, prefix=settings.API_V1_STR)


@app.get("/")
def root():
    return {
        "service": "LayerOS Poultry ERP API",
        "version": settings.VERSION,
        "docs": "/docs",
        "api_v1": settings.API_V1_STR
    }


@app.get("/api/v1/init-production-seed")
def trigger_production_seed():
    """Manual or health-check trigger to seed production baseline data."""
    seed_default_production_data()
    return {
        "status": "success",
        "message": "Production seed completed. Rohan Farm, Admin and Operator accounts are active."
    }
