from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel, EmailStr, ConfigDict
import uuid


class AdminLoginInput(BaseModel):
    email: EmailStr
    password: str
    totp: Optional[str] = None


class AdminUserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    email: str
    full_name: str
    role: str
    is_active: bool
    last_login_at: Optional[datetime]


class PlatformKPIsResponse(BaseModel):
    total_farms: int
    active_farms: int
    pending_approvals: int
    suspended_farms: int
    total_live_birds: int
    daily_egg_production: int
    active_paid_subscriptions: int
    monthly_recurring_revenue_inr: float


class AdminFarmResponse(BaseModel):
    id: uuid.UUID
    name: str
    owner_name: str
    phone: str
    district: str
    capacity: int
    status: str
    created_at: datetime
    plan_id: str
    subscription_status: str
    total_birds: int


class ChangeFarmStatusInput(BaseModel):
    farm_id: uuid.UUID
    new_status: str
    reason: str


class ExtendPlanInput(BaseModel):
    farm_id: uuid.UUID
    days: int
    reason: str


class AdminAuditLogResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    admin_email: str
    action: str
    target_farm_id: Optional[uuid.UUID]
    target_farm_name: Optional[str]
    reason: Optional[str]
    created_at: datetime


class PlatformSettingsResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    enrollment_mode: str
    default_trial_days: int
    support_phone: str
    support_whatsapp: str
    support_email: str
    maintenance_banner: str
    is_maintenance_active: bool
    updated_at: datetime


class PlatformSettingsUpdate(BaseModel):
    enrollment_mode: Optional[str] = None
    default_trial_days: Optional[int] = None
    support_phone: Optional[str] = None
    support_whatsapp: Optional[str] = None
    support_email: Optional[str] = None
    maintenance_banner: Optional[str] = None
    is_maintenance_active: Optional[bool] = None
