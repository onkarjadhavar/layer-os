import uuid
from datetime import datetime, timezone
from sqlalchemy import (
    Column,
    String,
    Integer,
    Numeric,
    Boolean,
    Date,
    DateTime,
    ForeignKey,
    Text,
    Index,
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.db.base import Base


class Customer(Base):
    __tablename__ = "customers"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    farm_id = Column(UUID(as_uuid=True), ForeignKey("farms.id", ondelete="CASCADE"), nullable=False, index=True)
    name = Column(String(255), nullable=False)
    phone = Column(String(20), nullable=False)
    area = Column(String(100), nullable=True)
    customer_type = Column(String(50), default="wholesaler", nullable=False)  # trader, wholesaler, retailer, hotel_bakery, direct_consumer
    credit_limit = Column(Numeric(12, 2), default=200000.00, nullable=False)
    credit_days = Column(Integer, default=7, nullable=False)
    current_outstanding = Column(Numeric(12, 2), default=0.00, nullable=False)
    default_price_unit = Column(String(20), default="per_100", nullable=False)
    preferred_discount_per_100 = Column(Numeric(6, 2), default=0.00, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    sales = relationship("Sale", back_populates="customer")
    payments = relationship("Payment", back_populates="customer")


class Sale(Base):
    __tablename__ = "sales"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    farm_id = Column(UUID(as_uuid=True), ForeignKey("farms.id", ondelete="CASCADE"), nullable=False, index=True)
    customer_id = Column(UUID(as_uuid=True), ForeignKey("customers.id", ondelete="SET NULL"), nullable=True)
    invoice_number = Column(String(50), nullable=False, index=True)
    sale_date = Column(Date, nullable=False, index=True)
    sale_type = Column(String(50), default="eggs", nullable=False)  # eggs, empty_bags, spent_birds, manure, other
    quantity_units = Column(Numeric(10, 2), nullable=False)
    unit_name = Column(String(50), nullable=False)  # eggs, gatta, trays, bags, birds, tonnes
    total_eggs_equivalent = Column(Integer, default=0, nullable=False)
    rate_per_unit = Column(Numeric(10, 2), nullable=False)
    gross_amount = Column(Numeric(12, 2), nullable=False)
    discount = Column(Numeric(10, 2), default=0.0, nullable=False)
    net_amount = Column(Numeric(12, 2), nullable=False)
    paid_amount = Column(Numeric(12, 2), default=0.0, nullable=False)
    payment_status = Column(String(20), default="pending", nullable=False)  # paid, partial, pending
    vehicle_number = Column(String(50), nullable=True)
    delivery_person = Column(String(100), nullable=True)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    customer = relationship("Customer", back_populates="sales")
    payments = relationship("Payment", back_populates="sale")

    __table_args__ = (
        Index("idx_sales_farm_date", "farm_id", "sale_date"),
    )


class Payment(Base):
    __tablename__ = "payments"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    farm_id = Column(UUID(as_uuid=True), ForeignKey("farms.id", ondelete="CASCADE"), nullable=False, index=True)
    customer_id = Column(UUID(as_uuid=True), ForeignKey("customers.id", ondelete="CASCADE"), nullable=False)
    sale_id = Column(UUID(as_uuid=True), ForeignKey("sales.id", ondelete="SET NULL"), nullable=True)
    payment_date = Column(Date, nullable=False)
    amount = Column(Numeric(12, 2), nullable=False)
    payment_mode = Column(String(50), default="upi", nullable=False)  # upi, cash, bank_transfer, cheque
    reference_number = Column(String(100), nullable=True)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    customer = relationship("Customer", back_populates="payments")
    sale = relationship("Sale", back_populates="payments")
