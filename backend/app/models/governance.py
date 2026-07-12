import uuid
from datetime import datetime, timezone
from typing import Optional
from sqlalchemy import String, ForeignKey, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base

class Policy(Base):
    __tablename__ = "policies"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), 
        primary_key=True, 
        default=uuid.uuid4
    )
    title: Mapped[str] = mapped_column(
        String(150), 
        nullable=False
    )
    description: Mapped[str] = mapped_column(
        String(255), 
        nullable=False
    )
    version: Mapped[str] = mapped_column(
        String(20), 
        nullable=False
    )
    effective_date: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), 
        nullable=False
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), 
        default=lambda: datetime.now(timezone.utc)
    )

    # Relationships
    acknowledgements = relationship("PolicyAcknowledgement", back_populates="policy")


class PolicyAcknowledgement(Base):
    __tablename__ = "policy_acknowledgements"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), 
        primary_key=True, 
        default=uuid.uuid4
    )
    policy_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), 
        ForeignKey("policies.id", ondelete="CASCADE"), 
        nullable=False
    )
    employee_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), 
        ForeignKey("users.id", ondelete="CASCADE"), 
        nullable=False
    )
    acknowledged_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), 
        default=lambda: datetime.now(timezone.utc)
    )

    # Relationships
    policy = relationship("Policy", back_populates="acknowledgements")
    employee = relationship("UserORM")


class Audit(Base):
    __tablename__ = "audits"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), 
        primary_key=True, 
        default=uuid.uuid4
    )
    department_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), 
        ForeignKey("departments.id", ondelete="CASCADE"), 
        nullable=False
    )
    auditor_name: Mapped[str] = mapped_column(
        String(100), 
        nullable=False
    )
    status: Mapped[str] = mapped_column(
        String(50), 
        default="Scheduled"
    )
    remarks: Mapped[Optional[str]] = mapped_column(
        String(255), 
        nullable=True
    )
    audit_date: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), 
        nullable=False
    )

    # Relationships
    department = relationship("DepartmentORM")
    compliance_issues = relationship("ComplianceIssue", back_populates="audit")


class ComplianceIssue(Base):
    __tablename__ = "compliance_issues"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), 
        primary_key=True, 
        default=uuid.uuid4
    )
    audit_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), 
        ForeignKey("audits.id", ondelete="CASCADE"), 
        nullable=False
    )
    severity: Mapped[str] = mapped_column(
        String(50), 
        nullable=False
    )
    description: Mapped[str] = mapped_column(
        String(255), 
        nullable=False
    )
    owner_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), 
        ForeignKey("users.id", ondelete="RESTRICT"), 
        nullable=False
    )
    status: Mapped[str] = mapped_column(
        String(50), 
        default="Open"
    )
    due_date: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), 
        nullable=False
    )

    # Relationships
    audit = relationship("Audit", back_populates="compliance_issues")
    owner = relationship("UserORM")
