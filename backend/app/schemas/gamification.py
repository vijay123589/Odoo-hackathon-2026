from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from uuid import UUID

class ChallengeCreate(BaseModel):
    title: str = Field(..., min_length=2, max_length=150)
    description: str = Field(..., min_length=2, max_length=255)
    points: int = Field(..., gt=0)
    difficulty: str = Field(..., min_length=2, max_length=50)
    deadline: datetime

class ChallengeUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=2, max_length=150)
    description: Optional[str] = Field(None, min_length=2, max_length=255)
    points: Optional[int] = Field(None, gt=0)
    difficulty: Optional[str] = Field(None, min_length=2, max_length=50)
    deadline: Optional[datetime] = None
    status: Optional[str] = Field(None, max_length=50)

class ChallengeResponse(BaseModel):
    id: UUID
    title: str
    description: str
    points: int
    difficulty: str
    deadline: datetime
    status: str
    created_at: datetime

    model_config = {
        "from_attributes": True
    }


class ChallengeParticipationCreate(BaseModel):
    challenge_id: UUID
    employee_id: UUID

class ChallengeParticipationUpdate(BaseModel):
    challenge_id: Optional[UUID] = None
    employee_id: Optional[UUID] = None
    progress: Optional[float] = Field(None, ge=0.0, le=100.0)
    completed: Optional[bool] = None
    points_awarded: Optional[int] = Field(None, ge=0)

class ChallengeParticipationResponse(BaseModel):
    id: UUID
    challenge_id: UUID
    employee_id: UUID
    progress: float
    completed: bool
    points_awarded: int

    model_config = {
        "from_attributes": True
    }


class BadgeCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    description: str = Field(..., min_length=2, max_length=255)
    icon: Optional[str] = Field(None, max_length=255)
    required_points: int = Field(..., ge=0)

class BadgeUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=2, max_length=100)
    description: Optional[str] = Field(None, min_length=2, max_length=255)
    icon: Optional[str] = Field(None, max_length=255)
    required_points: Optional[int] = Field(None, ge=0)

class BadgeResponse(BaseModel):
    id: UUID
    name: str
    description: str
    icon: Optional[str]
    required_points: int

    model_config = {
        "from_attributes": True
    }


class EmployeeBadgeCreate(BaseModel):
    employee_id: UUID
    badge_id: UUID

class EmployeeBadgeResponse(BaseModel):
    employee_id: UUID
    badge_id: UUID
    earned_at: datetime

    model_config = {
        "from_attributes": True
    }


class RewardCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=150)
    description: str = Field(..., min_length=2, max_length=255)
    points_required: int = Field(..., gt=0)
    stock: int = Field(..., ge=0)

class RewardUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=2, max_length=150)
    description: Optional[str] = Field(None, min_length=2, max_length=255)
    points_required: Optional[int] = Field(None, gt=0)
    stock: Optional[int] = Field(None, ge=0)

class RewardResponse(BaseModel):
    id: UUID
    name: str
    description: str
    points_required: int
    stock: int

    model_config = {
        "from_attributes": True
    }


class RewardRedemptionCreate(BaseModel):
    employee_id: UUID
    reward_id: UUID

class RewardRedemptionResponse(BaseModel):
    id: UUID
    employee_id: UUID
    reward_id: UUID
    redeemed_at: datetime

    model_config = {
        "from_attributes": True
    }
