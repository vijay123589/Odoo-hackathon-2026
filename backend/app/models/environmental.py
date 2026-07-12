import uuid
from datetime import datetime, timezone
from typing import Optional
from sqlalchemy import String, Float, ForeignKey, DateTime, text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base

class EmissionFactor(Base):
    __tablename__ = "emission_factors"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), 
        primary_key=True, 
        default=uuid.uuid4
    )
    activity_name: Mapped[str] = mapped_column(
        String(150), 
        nullable=False
    )
    category: Mapped[str] = mapped_column(
        String(100), 
        nullable=False
    )
    factor_value: Mapped[float] = mapped_column(
        Float, 
        nullable=False
    )
    unit: Mapped[str] = mapped_column(
        String(50), 
        nullable=False
    )
    description: Mapped[Optional[str]] = mapped_column(
        String(255), 
        nullable=True
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), 
        default=lambda: datetime.now(timezone.utc)
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), 
        default=lambda: datetime.now(timezone.utc), 
        onupdate=lambda: datetime.now(timezone.utc)
    )

    # Relationships
    carbon_transactions = relationship("CarbonTransaction", back_populates="emission_factor")


class CarbonTransaction(Base):
    __tablename__ = "carbon_transactions"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), 
        primary_key=True, 
        default=uuid.uuid4
    )
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), 
        ForeignKey("users.id", ondelete="RESTRICT"), 
        nullable=False
    )
    department_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), 
        ForeignKey("departments.id", ondelete="RESTRICT"), 
        nullable=False
    )
    emission_factor_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), 
        ForeignKey("emission_factors.id", ondelete="RESTRICT"), 
        nullable=False
    )
    activity_name: Mapped[str] = mapped_column(
        String(150), 
        nullable=False
    )
    quantity: Mapped[float] = mapped_column(
        Float, 
        nullable=False
    )
    carbon_emission: Mapped[float] = mapped_column(
        Float, 
        nullable=False
    )
    transaction_date: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), 
        default=lambda: datetime.now(timezone.utc)
    )
    remarks: Mapped[Optional[str]] = mapped_column(
        String(255), 
        nullable=True
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), 
        default=lambda: datetime.now(timezone.utc)
    )

    # Relationships
    emission_factor = relationship("EmissionFactor", back_populates="carbon_transactions")
    # Using string names for UserORM and DepartmentORM to avoid import cycles
    user = relationship("UserORM")
    department = relationship("DepartmentORM")


class EnvironmentalGoal(Base):
    __tablename__ = "environmental_goals"

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
    target_value: Mapped[float] = mapped_column(
        Float, 
        nullable=False
    )
    current_value: Mapped[float] = mapped_column(
        Float, 
        default=0.0
    )
    unit: Mapped[str] = mapped_column(
        String(50), 
        nullable=False
    )
    deadline: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), 
        nullable=False
    )
    status: Mapped[str] = mapped_column(
        String(50), 
        default="In Progress"
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), 
        default=lambda: datetime.now(timezone.utc)
    )
