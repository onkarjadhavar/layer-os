import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Numeric, Date, DateTime, UniqueConstraint, Index
from sqlalchemy.dialects.postgresql import UUID
from app.db.base import Base


class MarketRate(Base):
    __tablename__ = "market_rates"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    mandi_name = Column(String(100), nullable=False, index=True)  # Pune, Mumbai, Nashik, Nagpur, Namakkal
    rate_date = Column(Date, nullable=False, index=True)
    rate_per_100 = Column(Numeric(8, 2), nullable=False)
    rate_per_egg = Column(Numeric(6, 2), nullable=False)
    trend = Column(String(20), default="steady", nullable=False)  # up, down, steady
    source = Column(String(100), default="NECC / Direct Mandi Quotation", nullable=False)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    __table_args__ = (
        UniqueConstraint("mandi_name", "rate_date", name="uq_mandi_rate_date"),
        Index("idx_market_rates_mandi_date", "mandi_name", "rate_date"),
    )
