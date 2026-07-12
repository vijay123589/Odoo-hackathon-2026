import uuid
from datetime import datetime, timezone
from typing import Optional
from sqlalchemy import String, Integer, Float, Boolean, ForeignKey, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base

class Challenge(Base):
    __tablename__ = "challenges"

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
    points: Mapped[int] = mapped_column(
        Integer, 
        nullable=False
    )
    difficulty: Mapped[str] = mapped_column(
        String(50), 
        nullable=False
    )
    deadline: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), 
        nullable=False
    )
    status: Mapped[str] = mapped_column(
        String(50), 
        default="Active"
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), 
        default=lambda: datetime.now(timezone.utc)
    )

    # Relationships
    participations = relationship("ChallengeParticipation", back_populates="challenge")


class ChallengeParticipation(Base):
    __tablename__ = "challenge_participation"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), 
        primary_key=True, 
        default=uuid.uuid4
    )
    challenge_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), 
        ForeignKey("challenges.id", ondelete="CASCADE"), 
        nullable=False
    )
    employee_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), 
        ForeignKey("users.id", ondelete="CASCADE"), 
        nullable=False
    )
    progress: Mapped[float] = mapped_column(
        Float, 
        default=0.0
    )
    completed: Mapped[bool] = mapped_column(
        Boolean, 
        default=False
    )
    points_awarded: Mapped[int] = mapped_column(
        Integer, 
        default=0
    )

    # Relationships
    challenge = relationship("Challenge", back_populates="participations")
    employee = relationship("UserORM")


class Badge(Base):
    __tablename__ = "badges"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), 
        primary_key=True, 
        default=uuid.uuid4
    )
    name: Mapped[str] = mapped_column(
        String(100), 
        nullable=False
    )
    description: Mapped[str] = mapped_column(
        String(255), 
        nullable=False
    )
    icon: Mapped[Optional[str]] = mapped_column(
        String(255), 
        nullable=True
    )
    required_points: Mapped[int] = mapped_column(
        Integer, 
        nullable=False
    )

    # Relationships
    employee_badges = relationship("EmployeeBadge", back_populates="badge")


class EmployeeBadge(Base):
    __tablename__ = "employee_badges"

    employee_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), 
        ForeignKey("users.id", ondelete="CASCADE"), 
        primary_key=True
    )
    badge_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), 
        ForeignKey("badges.id", ondelete="CASCADE"), 
        primary_key=True
    )
    earned_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), 
        default=lambda: datetime.now(timezone.utc)
    )

    # Relationships
    badge = relationship("Badge", back_populates="employee_badges")
    employee = relationship("UserORM")


class Reward(Base):
    __tablename__ = "rewards"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), 
        primary_key=True, 
        default=uuid.uuid4
    )
    name: Mapped[str] = mapped_column(
        String(150), 
        nullable=False
    )
    description: Mapped[str] = mapped_column(
        String(255), 
        nullable=False
    )
    points_required: Mapped[int] = mapped_column(
        Integer, 
        nullable=False
    )
    stock: Mapped[int] = mapped_column(
        Integer, 
        default=0
    )

    # Relationships
    redemptions = relationship("RewardRedemption", back_populates="reward")


class RewardRedemption(Base):
    __tablename__ = "reward_redemptions"

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
    reward_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), 
        ForeignKey("rewards.id", ondelete="CASCADE"), 
        nullable=False
    )
    redeemed_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), 
        default=lambda: datetime.now(timezone.utc)
    )

    # Relationships
    reward = relationship("Reward", back_populates="redemptions")
    employee = relationship("UserORM")
