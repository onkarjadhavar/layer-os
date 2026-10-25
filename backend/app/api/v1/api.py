from fastapi import APIRouter
from app.api.v1.endpoints import (
    health,
    auth,
    farms,
    records,
    sales,
    market_rates,
    ai,
    admin,
    billing,
)

api_router = APIRouter()

api_router.include_router(health.router, tags=["Health"])
api_router.include_router(auth.router, prefix="/auth", tags=["Auth & Memberships"])
api_router.include_router(farms.router, prefix="/farms", tags=["Farms & Flocks"])
api_router.include_router(records.router, prefix="/records", tags=["Daily Production Records"])
api_router.include_router(sales.router, prefix="/sales", tags=["Sales & Commercial"])
api_router.include_router(market_rates.router, prefix="/market-rates", tags=["Mandi Market Rates"])
api_router.include_router(ai.router, prefix="/ai", tags=["AI Advisory"])
api_router.include_router(admin.router, prefix="/admin", tags=["Platform Supervision Admin"])
api_router.include_router(billing.router, prefix="/billing", tags=["Billing & SaaS Plans"])
