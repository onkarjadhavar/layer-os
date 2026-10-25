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
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.db.base import Base


class Farm(Base):
    __tablename__ = "farms"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(255), nullable=False)
    owner_name = Column(String(255), nullable=False)
    phone = Column(String(20), nullable=False)
    email = Column(String(255), nullable=True)
    address = Column(Text, nullable=True)
    district = Column(String(100), default="Pune", nullable=False)
    state = Column(String(100), default="Maharashtra", nullable=False)
    pincode = Column(String(10), nullable=True)
    gstin = Column(String(20), nullable=True)
    total_capacity = Column(Integer, default=35000, nullable=False)
    status = Column(String(50), default="active", nullable=False)  # pending_approval, active, suspended, rejected
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    unit_settings = relationship("UnitSettings", back_populates="farm", uselist=False, cascade="all, delete-orphan")
    sheds = relationship("Shed", back_populates="farm", cascade="all, delete-orphan")
    flocks = relationship("Flock", back_populates="farm", cascade="all, delete-orphan")
    members = relationship("FarmMember", back_populates="farm", cascade="all, delete-orphan")


class UnitSettings(Base):
    __tablename__ = "unit_settings"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    farm_id = Column(UUID(as_uuid=True), ForeignKey("farms.id", ondelete="CASCADE"), unique=True, nullable=False)
    tray_size_eggs = Column(Integer, default=30, nullable=False)
    gatta_size_trays = Column(Integer, default=7, nullable=False)
    carton_size_trays = Column(Integer, default=12, nullable=False)
    feed_bag_weight_kg = Column(Numeric(6, 2), default=50.00, nullable=False)
    default_egg_rate_unit = Column(String(20), default="per_100", nullable=False)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    farm = relationship("Farm", back_populates="unit_settings")


class Shed(Base):
    __tablename__ = "sheds"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    farm_id = Column(UUID(as_uuid=True), ForeignKey("farms.id", ondelete="CASCADE"), nullable=False)
    shed_number = Column(String(50), nullable=False)
    name = Column(String(100), nullable=True)
    capacity = Column(Integer, nullable=False)
    shed_type = Column(String(50), default="elevated_cage", nullable=False)
    has_climate_sensors = Column(Boolean, default=False, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    farm = relationship("Farm", back_populates="sheds")
    flocks = relationship("Flock", back_populates="shed")


class Flock(Base):
    __tablename__ = "flocks"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    farm_id = Column(UUID(as_uuid=True), ForeignKey("farms.id", ondelete="CASCADE"), nullable=False)
    shed_id = Column(UUID(as_uuid=True), ForeignKey("sheds.id", ondelete="SET NULL"), nullable=True)
    batch_code = Column(String(100), nullable=False)
    breed = Column(String(100), default="BV300", nullable=False)
    hatchery_source = Column(String(255), nullable=True)
    placement_date = Column(Date, nullable=False)
    initial_chick_count = Column(Integer, nullable=False)
    chick_cost_per_bird = Column(Numeric(8, 2), default=42.00, nullable=False)
    current_bird_count = Column(Integer, nullable=False)
    current_phase = Column(String(50), default="laying", nullable=False)
    cumulative_rearing_cost = Column(Numeric(12, 2), default=0.00, nullable=False)
    amortization_months = Column(Integer, default=14, nullable=False)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    farm = relationship("Farm", back_populates="flocks")
    shed = relationship("Shed", back_populates="flocks")
    records = relationship("DailyRecord", back_populates="flock", cascade="all, delete-orphan")


class FarmMember(Base):
    __tablename__ = "farm_members"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    farm_id = Column(UUID(as_uuid=True), ForeignKey("farms.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    role = Column(String(50), default="supervisor", nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    farm = relationship("Farm", back_populates="members")
    user = relationship("User", back_populates="farm_memberships")


class FarmInvitation(Base):
    __tablename__ = "farm_invitations"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    farm_id = Column(UUID(as_uuid=True), ForeignKey("farms.id", ondelete="CASCADE"), nullable=False)
    phone = Column(String(20), nullable=False)
    role = Column(String(50), default="supervisor", nullable=False)
    email = Column(String(255), nullable=True)
    invite_token = Column(String(100), unique=True, nullable=False)
    is_accepted = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    expires_at = Column(DateTime(timezone=True), nullable=False)
