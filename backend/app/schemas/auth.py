from typing import Optional, List
from pydantic import BaseModel, EmailStr, Field, ConfigDict
import uuid


class LoginInput(BaseModel):
    phone: Optional[str] = Field(None, description="10-digit Indian phone number")
    email: Optional[str] = Field(None, description="User email address")
    password: Optional[str] = Field(None, description="Password if registered")
    otp: Optional[str] = Field(None, description="OTP if phone login")


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: "UserResponse"


class UserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    farm_id: Optional[uuid.UUID] = None
    phone: str
    email: Optional[str] = None
    full_name: str
    role: str
    preferred_language: str
    is_active: bool


class RegisterOwnerInput(BaseModel):
    farm_name: str = Field(..., min_length=2)
    owner_name: str = Field(..., min_length=2)
    phone: str = Field(..., min_length=10, max_length=15)
    password: Optional[str] = None
    district: str = "Pune"
    capacity: int = 35000
    breed: str = "BV300"
    initial_birds: int = 30000
    age_weeks: int = 24


class StaffInviteInput(BaseModel):
    farm_id: uuid.UUID
    phone: str
    role: str = "supervisor"
    email: Optional[str] = None


class StaffInviteResponse(BaseModel):
    invite_token: str
    invite_url: str


class AcceptInviteInput(BaseModel):
    invite_token: str
