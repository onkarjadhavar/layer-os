from typing import Optional, List, Dict, Any
from datetime import date, datetime
from pydantic import BaseModel, Field, ConfigDict
import uuid


class UnitSettingsBase(BaseModel):
    tray_size_eggs: int = 30
    gatta_size_trays: int = 7
    carton_size_trays: int = 12
    feed_bag_weight_kg: float = 50.0
    default_egg_rate_unit: str = "per_100"


class UnitSettingsUpdate(BaseModel):
    tray_size_eggs: Optional[int] = None
    gatta_size_trays: Optional[int] = None
    carton_size_trays: Optional[int] = None
    feed_bag_weight_kg: Optional[float] = None
    default_egg_rate_unit: Optional[str] = None


class UnitSettingsResponse(UnitSettingsBase):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    farm_id: uuid.UUID
    created_at: datetime
    updated_at: datetime


class ShedCreate(BaseModel):
    shed_number: str
    name: Optional[str] = None
    capacity: int
    shed_type: str = "elevated_cage"
    has_climate_sensors: bool = False


class ShedResponse(ShedCreate):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    farm_id: uuid.UUID
    is_active: bool
    created_at: datetime
    updated_at: datetime


class FlockCreate(BaseModel):
    shed_id: Optional[uuid.UUID] = None
    batch_code: str
    breed: str = "BV300"
    hatchery_source: Optional[str] = None
    placement_date: date
    initial_chick_count: int
    chick_cost_per_bird: float = 42.0
    current_bird_count: int
    current_phase: str = "laying"
    cumulative_rearing_cost: float = 0.0
    amortization_months: int = 14


class FlockPhaseUpdate(BaseModel):
    phase: str


class FlockResponse(FlockCreate):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    farm_id: uuid.UUID
    created_at: datetime
    updated_at: datetime


class FarmCreate(BaseModel):
    name: str = Field(..., min_length=2)
    owner_name: str = Field(..., min_length=2)
    phone: str = Field(..., min_length=10)
    email: Optional[str] = None
    address: Optional[str] = None
    district: str = "Pune"
    state: str = "Maharashtra"
    pincode: Optional[str] = None
    gstin: Optional[str] = None
    total_capacity: int = 35000


class FarmResponse(FarmCreate):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    status: str
    created_at: datetime
    updated_at: datetime
    unit_settings: Optional[UnitSettingsResponse] = None


# Enrollment Wizard Schemas
class OwnerEnrollSchema(BaseModel):
    fullName: str = Field(..., min_length=2)
    mobileNumber: str = Field(..., min_length=10)
    email: Optional[str] = None
    password: Optional[str] = None
    acceptTermsAndPrivacy: Optional[bool] = True


class FarmDetailsEnrollSchema(BaseModel):
    farmName: str = Field(..., min_length=2)
    ownerName: str = Field(..., min_length=2)
    villageTown: Optional[str] = "दौंड"
    taluka: Optional[str] = "दौंड"
    district: str = "Pune"
    state: str = "Maharashtra"
    pincode: Optional[str] = "412219"
    preferredLanguage: Optional[str] = "mr"


class FlockEnrollItem(BaseModel):
    batchCode: str = "Batch-1"
    breed: str = "BV300"
    birdsPlaced: int = 30000
    currentLiveBirds: int = 30000
    ageWeeks: int = 24
    housingType: str = "elevated_cage"


class ShedsFlocksEnrollSchema(BaseModel):
    numberOfSheds: int = 1
    flocks: List[FlockEnrollItem] = Field(default_factory=list)


class FeedEnrollSchema(BaseModel):
    feedBagsPerDay: Optional[float] = 22.0
    bagSizeKg: Optional[float] = 50.0
    feedPricePerKg: Optional[float] = 35.0
    feedSupplier: Optional[str] = None
    planningHorizonDays: Optional[int] = 30
    expectedFeedStockKg: Optional[float] = 2000.0


class SalesEnrollSchema(BaseModel):
    traySize: Optional[int] = 30
    traysPerGatta: Optional[int] = 7
    currentSellingPricePerEgg: Optional[float] = 5.4
    mainBuyerType: Optional[str] = "trader"
    nearestMandi: Optional[str] = "Pune"


class FinanceEnrollSchema(BaseModel):
    monthlyLabour: Optional[float] = 25000.0
    monthlyMedicine: Optional[float] = 10000.0
    monthlyElectricity: Optional[float] = 8000.0
    monthlyOther: Optional[float] = 5000.0
    monthlyLoanEmi: Optional[float] = 0.0
    numberOfEmployees: Optional[int] = 2


class FarmEnrollmentRequest(BaseModel):
    owner: OwnerEnrollSchema
    farm: FarmDetailsEnrollSchema
    shedsFlocks: ShedsFlocksEnrollSchema
    feed: Optional[FeedEnrollSchema] = None
    sales: Optional[SalesEnrollSchema] = None
    finance: Optional[FinanceEnrollSchema] = None
    honeypot: Optional[str] = None


class FarmEnrollmentResponse(BaseModel):
    id: uuid.UUID
    name: str
    owner_name: str
    phone: str
    district: str
    total_capacity: int
    status: str
    user_id: uuid.UUID
    access_token: str
    token_type: str = "bearer"
    sheds_count: int = 1
    flocks_count: int = 1
    redirect_url: str


class FarmDashboardSummary(BaseModel):
    total_birds: int = 0
    eggs_collected_today: int = 0
    feed_used_today_kg: float = 0.0
    mortality_today: int = 0
    hd_pct: float = 0.0
    feed_per_bird_g: float = 0.0
    today_revenue: float = 0.0
    today_cost: float = 0.0
    today_operating_profit: float = 0.0
    break_even_price: float = 0.0
    selling_price_per_egg: float = 5.4


class FarmDashboardResponse(BaseModel):
    farm: FarmResponse
    sheds: List[ShedResponse] = Field(default_factory=list)
    flocks: List[FlockResponse] = Field(default_factory=list)
    unit_settings: Optional[UnitSettingsResponse] = None
    daily_records: List[Dict[str, Any]] = Field(default_factory=list)
    sales: List[Dict[str, Any]] = Field(default_factory=list)
    summary: FarmDashboardSummary = Field(default_factory=FarmDashboardSummary)
