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
    UniqueConstraint,
    Index,
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.db.base import Base


class DailyRecord(Base):
    __tablename__ = "daily_records"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    farm_id = Column(UUID(as_uuid=True), ForeignKey("farms.id", ondelete="CASCADE"), nullable=False, index=True)
    flock_id = Column(UUID(as_uuid=True), ForeignKey("flocks.id", ondelete="CASCADE"), nullable=False, index=True)
    record_date = Column(Date, nullable=False, index=True)
    opening_birds = Column(Integer, nullable=False)
    mortality = Column(Integer, default=0, nullable=False)
    culls = Column(Integer, default=0, nullable=False)
    closing_birds = Column(Integer, nullable=False)
    total_eggs_collected = Column(Integer, default=0, nullable=False)
    broken_cracked_eggs = Column(Integer, default=0, nullable=False)
    soft_shell_eggs = Column(Integer, default=0, nullable=False)
    reject_eggs = Column(Integer, default=0, nullable=False)
    good_eggs = Column(Integer, default=0, nullable=False)
    morning_collection = Column(Integer, default=0, nullable=False)
    evening_collection = Column(Integer, default=0, nullable=False)
    hd_pct = Column(Numeric(5, 2), nullable=False)
    feed_issued_kg = Column(Numeric(8, 2), default=0.0, nullable=False)
    feed_per_bird_g = Column(Numeric(6, 1), default=0.0, nullable=False)
    water_consumption_litres = Column(Numeric(8, 1), nullable=True)
    avg_egg_weight_g = Column(Numeric(5, 2), nullable=True)
    is_closed = Column(Boolean, default=False, nullable=False)
    notes = Column(Text, nullable=True)
    created_by = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    flock = relationship("Flock", back_populates="records")

    __table_args__ = (
        UniqueConstraint("flock_id", "record_date", name="uq_flock_record_date"),
        Index("idx_daily_records_farm_date", "farm_id", "record_date"),
    )
