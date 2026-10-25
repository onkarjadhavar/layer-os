import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Integer, Numeric, Boolean, Date, DateTime, ForeignKey, Text
from sqlalchemy.dialects.postgresql import UUID, JSONB
from app.db.base import Base


class VaccinationTask(Base):
    __tablename__ = "vaccination_tasks"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    farm_id = Column(UUID(as_uuid=True), ForeignKey("farms.id", ondelete="CASCADE"), nullable=False, index=True)
    flock_id = Column(UUID(as_uuid=True), ForeignKey("flocks.id", ondelete="CASCADE"), nullable=False, index=True)
    vaccine_name = Column(String(255), nullable=False)
    disease_targeted = Column(String(255), nullable=False)
    due_age_weeks = Column(Integer, nullable=False)
    due_date = Column(Date, nullable=False)
    status = Column(String(50), default="pending", nullable=False)  # pending, done, skipped
    completed_date = Column(Date, nullable=True)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))


class AlertItem(Base):
    __tablename__ = "alerts"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    farm_id = Column(UUID(as_uuid=True), ForeignKey("farms.id", ondelete="CASCADE"), nullable=False, index=True)
    severity = Column(String(20), default="info", nullable=False)  # critical, warning, info, safe
    title_mr = Column(String(255), nullable=False)
    title_en = Column(String(255), nullable=False)
    message_mr = Column(Text, nullable=False)
    message_en = Column(Text, nullable=False)
    action_url = Column(String(255), nullable=True)
    is_resolved = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))


class AIRun(Base):
    __tablename__ = "ai_runs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    farm_id = Column(UUID(as_uuid=True), ForeignKey("farms.id", ondelete="CASCADE"), nullable=False, index=True)
    run_date = Column(Date, nullable=False)
    health_score = Column(Integer, nullable=False)
    summary_mr = Column(Text, nullable=False)
    summary_en = Column(Text, nullable=False)
    feed_recommended_kg = Column(Numeric(8, 2), nullable=False)
    break_even_price = Column(Numeric(6, 2), nullable=False)
    risks = Column(JSONB, default=list, nullable=False)
    actions = Column(JSONB, default=list, nullable=False)
    sales_advice = Column(JSONB, default=dict, nullable=False)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
