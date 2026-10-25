from typing import Optional
from datetime import date, datetime
from pydantic import BaseModel, Field, ConfigDict
import uuid


class CustomerCreate(BaseModel):
    farm_id: uuid.UUID
    name: str = Field(..., min_length=2)
    phone: str = Field(..., min_length=10)
    area: Optional[str] = None
    customer_type: str = "wholesaler"
    credit_limit: float = 200000.00
    credit_days: int = 7
    default_price_unit: str = "per_100"
    preferred_discount_per_100: float = 0.0


class CustomerResponse(CustomerCreate):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    current_outstanding: float
    is_active: bool
    created_at: datetime


class SaleCreate(BaseModel):
    farm_id: uuid.UUID
    customer_id: Optional[uuid.UUID] = None
    invoice_number: Optional[str] = None
    sale_date: date
    sale_type: str = "eggs"
    quantity_units: float = Field(..., gt=0)
    unit_name: str = "eggs"
    total_eggs_equivalent: int = 0
    rate_per_unit: float = Field(..., gt=0)
    gross_amount: Optional[float] = None
    discount: float = 0.0
    net_amount: Optional[float] = None
    paid_amount: float = 0.0
    payment_status: str = "pending"
    vehicle_number: Optional[str] = None
    delivery_person: Optional[str] = None
    notes: Optional[str] = None


class SaleResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    farm_id: uuid.UUID
    customer_id: Optional[uuid.UUID]
    invoice_number: str
    sale_date: date
    sale_type: str
    quantity_units: float
    unit_name: str
    total_eggs_equivalent: int
    rate_per_unit: float
    gross_amount: float
    discount: float
    net_amount: float
    paid_amount: float
    payment_status: str
    vehicle_number: Optional[str]
    delivery_person: Optional[str]
    notes: Optional[str]
    created_at: datetime


class PaymentCreate(BaseModel):
    farm_id: uuid.UUID
    customer_id: uuid.UUID
    sale_id: Optional[uuid.UUID] = None
    payment_date: date
    amount: float = Field(..., gt=0)
    payment_mode: str = "upi"
    reference_number: Optional[str] = None
    notes: Optional[str] = None


class PaymentResponse(PaymentCreate):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    created_at: datetime
