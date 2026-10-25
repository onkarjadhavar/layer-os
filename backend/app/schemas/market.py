from datetime import date, datetime
from pydantic import BaseModel, Field, ConfigDict
import uuid


class MarketRateCreate(BaseModel):
    mandi_name: str
    rate_date: date
    rate_per_100: float = Field(..., gt=0)
    rate_per_egg: float = Field(..., gt=0)
    trend: str = "steady"
    source: str = "NECC / Direct Mandi Quotation"


class MarketRateResponse(MarketRateCreate):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    created_at: datetime
