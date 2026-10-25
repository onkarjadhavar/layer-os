from typing import Optional
from datetime import date, datetime
from pydantic import BaseModel, Field, ConfigDict
import uuid


class QuickDailyRecordInput(BaseModel):
    farm_id: uuid.UUID
    flock_id: uuid.UUID
    record_date: date
    eggs_collected: int = Field(..., ge=0)
    feed_kg: float = Field(..., ge=0)
    mortality: int = Field(..., ge=0)
    selling_rate: float = Field(5.40, ge=0)
    sold_qty_eggs: Optional[int] = Field(None, ge=0)


class FullDailyRecordInput(BaseModel):
    farm_id: uuid.UUID
    flock_id: uuid.UUID
    record_date: date
    opening_birds: int
    mortality: int = 0
    culls: int = 0
    total_eggs_collected: int
    broken_cracked_eggs: int = 0
    soft_shell_eggs: int = 0
    reject_eggs: int = 0
    good_eggs: int = 0
    morning_collection: int = 0
    evening_collection: int = 0
    feed_issued_kg: float
    water_consumption_litres: Optional[float] = None
    avg_egg_weight_g: Optional[float] = None
    selling_price_per_egg: float = 5.40
    notes: Optional[str] = None


class DailyRecordResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    farm_id: uuid.UUID
    flock_id: uuid.UUID
    record_date: date
    opening_birds: int
    mortality: int
    culls: int
    closing_birds: int
    total_eggs_collected: int
    broken_cracked_eggs: int
    soft_shell_eggs: int
    reject_eggs: int
    good_eggs: int
    morning_collection: int
    evening_collection: int
    hd_pct: float
    feed_issued_kg: float
    feed_per_bird_g: float
    water_consumption_litres: Optional[float] = None
    avg_egg_weight_g: Optional[float] = None
    is_closed: bool
    notes: Optional[str] = None
    created_at: datetime
    updated_at: datetime
