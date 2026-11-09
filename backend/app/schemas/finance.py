import uuid
from typing import Optional
from datetime import date, datetime
from pydantic import BaseModel, Field, ConfigDict


class ExpenseCategoryCreate(BaseModel):
    farm_id: uuid.UUID
    code: str
    name_mr: str
    name_en: str
    is_cash_expense: bool = True


class ExpenseCategoryResponse(ExpenseCategoryCreate):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    created_at: datetime


class ExpenseCreate(BaseModel):
    farm_id: uuid.UUID
    flock_id: Optional[uuid.UUID] = None
    category_id: Optional[uuid.UUID] = None
    expense_date: date
    amount: float = Field(..., gt=0)
    payment_mode: str = "upi"
    vendor_name: Optional[str] = None
    description: Optional[str] = None


class ExpenseResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    farm_id: uuid.UUID
    flock_id: Optional[uuid.UUID] = None
    category_id: Optional[uuid.UUID] = None
    expense_date: date
    amount: float
    payment_mode: str
    vendor_name: Optional[str] = None
    description: Optional[str] = None
    created_at: datetime


class LoanCreate(BaseModel):
    farm_id: uuid.UUID
    bank_name: str
    principal_amount: float = Field(..., gt=0)
    annual_interest_rate: float = Field(..., ge=0)
    monthly_emi: float = Field(..., ge=0)
    emi_due_day: int = 5
    tenure_months: int = Field(..., gt=0)
    start_date: date
    outstanding_principal: float = Field(..., ge=0)


class LoanResponse(LoanCreate):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    created_at: datetime


class EmployeeCreate(BaseModel):
    farm_id: uuid.UUID
    name: str
    role: str = "Shed Attendant"
    monthly_salary: float = Field(..., ge=0)
    phone: Optional[str] = None
    joining_date: date
    is_active: bool = True


class EmployeeResponse(EmployeeCreate):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    created_at: datetime

