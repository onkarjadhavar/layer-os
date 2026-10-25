import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Integer, Boolean, DateTime, Text, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from app.db.base import Base


class PlatformAdminUser(Base):
    __tablename__ = "platform_admin_users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String(255), unique=True, nullable=False, index=True)
    hashed_password = Column(String(255), nullable=True)
    full_name = Column(String(255), nullable=False)
    role = Column(String(50), default="super_admin", nullable=False)  # super_admin, operator, support_agent
    is_active = Column(Boolean, default=True, nullable=False)
    last_login_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))


class AdminAuditLog(Base):
    __tablename__ = "admin_audit_logs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    admin_id = Column(UUID(as_uuid=True), ForeignKey("platform_admin_users.id", ondelete="SET NULL"), nullable=True)
    admin_email = Column(String(255), nullable=False)
    action = Column(String(100), nullable=False)
    target_farm_id = Column(UUID(as_uuid=True), ForeignKey("farms.id", ondelete="SET NULL"), nullable=True)
    target_farm_name = Column(String(255), nullable=True)
    reason = Column(Text, nullable=True)
    ip_address = Column(String(50), nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), index=True)


class PlatformSettings(Base):
    __tablename__ = "platform_settings"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    enrollment_mode = Column(String(50), default="auto_approve", nullable=False)  # auto_approve, manual_review
    default_trial_days = Column(Integer, default=30, nullable=False)
    support_phone = Column(String(20), default="+91 98220 12345", nullable=False)
    support_whatsapp = Column(String(20), default="+91 98220 12345", nullable=False)
    support_email = Column(String(255), default="support@layeros.in", nullable=False)
    maintenance_banner = Column(Text, default="", nullable=False)
    is_maintenance_active = Column(Boolean, default=False, nullable=False)
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
