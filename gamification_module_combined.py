"""
GAMIFICATION MODULE (FastAPI)

Challenges, badges, rewards, and leaderboard for employee gamification.

This file combines the original models.py, schemas.py, and routes.py
into a single module. Section markers below indicate where each
original file's content begins.
"""

import uuid
from datetime import date
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy import Column, String, Integer, Date, ForeignKey
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlalchemy.orm import Session

from database import Base, get_db


# =====================================================================
# MODELS
# =====================================================================

class Challenge(Base):
    __tablename__ = "challenges"

    id = Column(PG_UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String(100), nullable=False)
    category = Column(String(50))
    xp = Column(Integer, default=0)
    difficulty = Column(String(20))
    deadline = Column(Date)
    status = Column(String(20), default="ACTIVE")


class ChallengeParticipation(Base):
    __tablename__ = "challenge_participation"

    id = Column(PG_UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    challenge_id = Column(PG_UUID(as_uuid=True), ForeignKey("challenges.id"))
    employee_id = Column(PG_UUID(as_uuid=True), ForeignKey("users.id"))
    progress = Column(Integer, default=0)
    proof = Column(String)
    xp_awarded = Column(Integer, default=0)


class Badge(Base):
    __tablename__ = "badges"

    id = Column(PG_UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(100))
    description = Column(String)
    unlock_rule = Column(String)
    icon = Column(String)


class EmployeeBadge(Base):
    __tablename__ = "employee_badges"

    employee_id = Column(PG_UUID(as_uuid=True), ForeignKey("users.id"), primary_key=True)
    badge_id = Column(PG_UUID(as_uuid=True), ForeignKey("badges.id"), primary_key=True)
    earned_at = Column(Date)


class Reward(Base):
    __tablename__ = "rewards"

    id = Column(PG_UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(100))
    points_required = Column(Integer)
    stock = Column(Integer)


class RewardRedemption(Base):
    __tablename__ = "reward_redemptions"

    id = Column(PG_UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    employee_id = Column(PG_UUID(as_uuid=True), ForeignKey("users.id"))
    reward_id = Column(PG_UUID(as_uuid=True), ForeignKey("rewards.id"))
    redeemed_at = Column(Date)


# =====================================================================
# SCHEMAS
# =====================================================================

class ChallengeCreate(BaseModel):
    title: str
    category: str
    xp: int
    difficulty: str
    deadline: date


class JoinChallenge(BaseModel):
    employee_id: UUID


class ProgressUpdate(BaseModel):
    progress: int
    proof: str | None = None


class RewardCreate(BaseModel):
    name: str
    points_required: int
    stock: int


class RedeemReward(BaseModel):
    employee_id: UUID
    available_points: int


class BadgeCreate(BaseModel):
    name: str
    description: str
    unlock_rule: str
    icon: str


# =====================================================================
# ROUTES
# =====================================================================

router = APIRouter(prefix="/gamification", tags=["Gamification"])


# =====================================
# CHALLENGES
# =====================================
@router.post("/challenges")
def create_challenge(data: ChallengeCreate, db: Session = Depends(get_db)):
    challenge = Challenge(**data.model_dump(), status="ACTIVE")
    db.add(challenge)
    db.commit()
    db.refresh(challenge)
    return challenge


@router.get("/challenges")
def list_challenges(db: Session = Depends(get_db)):
    return db.query(Challenge).filter(Challenge.status == "ACTIVE").all()


@router.post("/challenges/{cid}/join")
def join(cid: UUID, data: JoinChallenge, db: Session = Depends(get_db)):
    existing = db.query(ChallengeParticipation).filter_by(
        challenge_id=cid,
        employee_id=data.employee_id
    ).first()

    if existing:
        raise HTTPException(400, "Already joined")

    participation = ChallengeParticipation(
        challenge_id=cid,
        employee_id=data.employee_id
    )
    db.add(participation)
    db.commit()

    return {"message": "Joined"}


@router.put("/challenges/{pid}/progress")
def progress(pid: UUID, data: ProgressUpdate, db: Session = Depends(get_db)):
    participation = db.query(ChallengeParticipation).filter_by(id=pid).first()

    if not participation:
        raise HTTPException(404, "Not found")

    participation.progress = data.progress
    participation.proof = data.proof

    if participation.progress >= 100:
        participation.xp_awarded = 100

    db.commit()
    return participation


# =====================================
# BADGES
# =====================================
@router.post("/badges")
def create_badge(data: BadgeCreate, db: Session = Depends(get_db)):
    badge = Badge(**data.model_dump())
    db.add(badge)
    db.commit()
    return badge


@router.get("/badges")
def badges(db: Session = Depends(get_db)):
    return db.query(Badge).all()


# =====================================
# REWARDS
# =====================================
@router.post("/rewards")
def create_reward(data: RewardCreate, db: Session = Depends(get_db)):
    reward = Reward(**data.model_dump())
    db.add(reward)
    db.commit()
    return reward


@router.get("/rewards")
def rewards(db: Session = Depends(get_db)):
    return db.query(Reward).all()


@router.post("/rewards/{rid}/redeem")
def redeem(rid: UUID, data: RedeemReward, db: Session = Depends(get_db)):
    reward = db.query(Reward).filter_by(id=rid).first()

    if not reward:
        raise HTTPException(404, "Reward not found")

    if reward.stock <= 0:
        raise HTTPException(400, "Out of stock")

    if data.available_points < reward.points_required:
        raise HTTPException(400, "Not enough points")

    reward.stock -= 1
    db.add(RewardRedemption(
        employee_id=data.employee_id,
        reward_id=rid,
        redeemed_at=date.today()
    ))
    db.commit()

    return {"message": "Redeemed"}


# =====================================
# LEADERBOARD
# =====================================
@router.get("/leaderboard")
def leaderboard(db: Session = Depends(get_db)):
    return db.query(
        ChallengeParticipation.employee_id,
        ChallengeParticipation.xp_awarded
    ).order_by(
        ChallengeParticipation.xp_awarded.desc()
    ).all()
