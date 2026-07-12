import uuid
from datetime import datetime, timezone
from typing import Optional
from sqlalchemy import String, Integer, ForeignKey, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base

class CSRActivity(Base):
    __tablename__ = "csr_activities"

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
    location: Mapped[str] = mapped_column(
        String(150), 
        nullable=False
    )
    activity_date: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), 
        nullable=False
    )
    max_points: Mapped[int] = mapped_column(
        Integer, 
        nullable=False
    )
    status: Mapped[str] = mapped_column(
        String(50), 
        default="Planned"
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), 
        default=lambda: datetime.now(timezone.utc)
    )

    # Relationships
    participations = relationship("EmployeeParticipation", back_populates="activity")


class EmployeeParticipation(Base):
    __tablename__ = "employee_participation"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), 
        primary_key=True, 
        default=uuid.uuid4
    )
    employee_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), 
        ForeignKey("users.id", ondelete="CASCADE"), 
        nullable=False
    )
    activity_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), 
        ForeignKey("csr_activities.id", ondelete="CASCADE"), 
        nullable=False
    )
    proof_url: Mapped[Optional[str]] = mapped_column(
        String(255), 
        nullable=True
    )
    approval_status: Mapped[str] = mapped_column(
        String(50), 
        default="Pending"
    )
    points_earned: Mapped[int] = mapped_column(
        Integer, 
        default=0
    )
    participated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), 
        default=lambda: datetime.now(timezone.utc)
    )

    # Relationships
    activity = relationship("CSRActivity", back_populates="participations")
    employee = relationship("UserORM")
