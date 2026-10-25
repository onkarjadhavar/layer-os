import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Integer, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from app.db.base import Base


class Subscription(Base):
    __tablename__ = "subscriptions"

    farm_id = Column(UUID(as_uuid=True), ForeignKey("farms.id", ondelete="CASCADE"), primary_key=True)
    plan_id = Column(String(50), default="starter", nullable=False)  # starter, grower, commercial
    status = Column(String(50), default="active", nullable=False)  # active, trial, past_due, canceled
    billing_cycle = Column(String(20), default="monthly", nullable=False)  # monthly, yearly
    razorpay_subscription_id = Column(String(100), nullable=True)
    razorpay_customer_id = Column(String(100), nullable=True)
    current_period_end = Column(DateTime(timezone=True), nullable=False)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))


class BillingInvoice(Base):
    __tablename__ = "billing_invoices"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    farm_id = Column(UUID(as_uuid=True), ForeignKey("farms.id", ondelete="CASCADE"), nullable=False, index=True)
    razorpay_payment_id = Column(String(100), nullable=True)
    razorpay_order_id = Column(String(100), nullable=True)
    razorpay_signature = Column(String(255), nullable=True)
    amount_paise = Column(Integer, default=0, nullable=False)
    currency = Column(String(10), default="INR", nullable=False)
    status = Column(String(50), default="paid", nullable=False)  # paid, pending, failed
    invoice_number = Column(String(100), nullable=False)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
