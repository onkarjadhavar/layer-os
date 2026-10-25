import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Integer, Numeric, Boolean, Date, DateTime, ForeignKey, Text
from sqlalchemy.dialects.postgresql import UUID
from app.db.base import Base


class ExpenseCategory(Base):
    __tablename__ = "expense_categories"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    farm_id = Column(UUID(as_uuid=True), ForeignKey("farms.id", ondelete="CASCADE"), nullable=False, index=True)
    code = Column(String(50), nullable=False)
    name_mr = Column(String(100), nullable=False)
    name_en = Column(String(100), nullable=False)
    is_cash_expense = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))


class Expense(Base):
    __tablename__ = "expenses"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    farm_id = Column(UUID(as_uuid=True), ForeignKey("farms.id", ondelete="CASCADE"), nullable=False, index=True)
    flock_id = Column(UUID(as_uuid=True), ForeignKey("flocks.id", ondelete="SET NULL"), nullable=True)
    category_id = Column(UUID(as_uuid=True), ForeignKey("expense_categories.id", ondelete="SET NULL"), nullable=True)
    expense_date = Column(Date, nullable=False, index=True)
    amount = Column(Numeric(12, 2), nullable=False)
    payment_mode = Column(String(50), default="upi", nullable=False)
    vendor_name = Column(String(255), nullable=True)
    description = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))


class Loan(Base):
    __tablename__ = "loans"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    farm_id = Column(UUID(as_uuid=True), ForeignKey("farms.id", ondelete="CASCADE"), nullable=False, index=True)
    bank_name = Column(String(255), nullable=False)
    principal_amount = Column(Numeric(14, 2), nullable=False)
    annual_interest_rate = Column(Numeric(5, 2), nullable=False)
    monthly_emi = Column(Numeric(12, 2), nullable=False)
    emi_due_day = Column(Integer, default=5, nullable=False)
    tenure_months = Column(Integer, nullable=False)
    start_date = Column(Date, nullable=False)
    outstanding_principal = Column(Numeric(14, 2), nullable=False)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))


class Employee(Base):
    __tablename__ = "employees"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    farm_id = Column(UUID(as_uuid=True), ForeignKey("farms.id", ondelete="CASCADE"), nullable=False, index=True)
    name = Column(String(255), nullable=False)
    role = Column(String(100), default="Shed Attendant", nullable=False)
    monthly_salary = Column(Numeric(10, 2), nullable=False)
    phone = Column(String(20), nullable=True)
    joining_date = Column(Date, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
