from typing import List
from datetime import date
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import desc

from app.db.session import get_db
from app.models.market import MarketRate
from app.schemas.market import MarketRateCreate, MarketRateResponse

router = APIRouter()

MANDI_SEEDS = [
    {"mandi_name": "Pune", "rate_per_100": 540.0, "rate_per_egg": 5.40, "trend": "steady"},
    {"mandi_name": "Mumbai", "rate_per_100": 555.0, "rate_per_egg": 5.55, "trend": "up"},
    {"mandi_name": "Nashik", "rate_per_100": 535.0, "rate_per_egg": 5.35, "trend": "steady"},
    {"mandi_name": "Nagpur", "rate_per_100": 545.0, "rate_per_egg": 5.45, "trend": "down"},
    {"mandi_name": "Namakkal", "rate_per_100": 520.0, "rate_per_egg": 5.20, "trend": "steady"},
]


@router.get("/latest", response_model=List[MarketRateResponse])
def get_latest_market_rates(db: Session = Depends(get_db)):
    rates = db.query(MarketRate).order_by(desc(MarketRate.rate_date)).limit(10).all()
    if not rates:
        # Seed default mandi rates for today
        today = date.today()
        seeded = []
        for s in MANDI_SEEDS:
            r = MarketRate(
                mandi_name=s["mandi_name"],
                rate_date=today,
                rate_per_100=s["rate_per_100"],
                rate_per_egg=s["rate_per_egg"],
                trend=s["trend"],
                source="NECC / Direct Mandi Quotation"
            )
            db.add(r)
            seeded.append(r)
        db.commit()
        for r in seeded:
            db.refresh(r)
        return [MarketRateResponse.model_validate(r) for r in seeded]

    return [MarketRateResponse.model_validate(r) for r in rates]


@router.post("/", response_model=MarketRateResponse)
def create_market_rate(
    rate_in: MarketRateCreate,
    db: Session = Depends(get_db)
):
    rate = MarketRate(
        mandi_name=rate_in.mandi_name,
        rate_date=rate_in.rate_date,
        rate_per_100=rate_in.rate_per_100,
        rate_per_egg=rate_in.rate_per_egg,
        trend=rate_in.trend,
        source=rate_in.source,
    )
    db.add(rate)
    db.commit()
    db.refresh(rate)
    return MarketRateResponse.model_validate(rate)
