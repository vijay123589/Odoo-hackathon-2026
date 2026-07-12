from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from uuid import UUID

class CSRActivityCreate(BaseModel):
    title: str = Field(..., min_length=2, max_length=150)
    description: str = Field(..., min_length=2, max_length=255)
    location: str = Field(..., min_length=2, max_length=150)
    activity_date: datetime
    max_points: int = Field(..., gt=0)

class CSRActivityUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=2, max_length=150)
    description: Optional[str] = Field(None, min_length=2, max_length=255)
    location: Optional[str] = Field(None, min_length=2, max_length=150)
    activity_date: Optional[datetime] = None
    max_points: Optional[int] = Field(None, gt=0)
    status: Optional[str] = Field(None, max_length=50)

class CSRActivityResponse(BaseModel):
    id: UUID
    title: str
    description: str
    location: str
    activity_date: datetime
    max_points: int
    status: str
    created_at: datetime

    model_config = {
        "from_attributes": True
    }


class EmployeeParticipationCreate(BaseModel):
    employee_id: UUID
    activity_id: UUID
    proof_url: Optional[str] = Field(None, max_length=255)

class EmployeeParticipationUpdate(BaseModel):
    employee_id: Optional[UUID] = None
    activity_id: Optional[UUID] = None
    proof_url: Optional[str] = Field(None, max_length=255)
    approval_status: Optional[str] = Field(None, max_length=50)
    points_earned: Optional[int] = Field(None, ge=0)

class EmployeeParticipationResponse(BaseModel):
    id: UUID
    employee_id: UUID
    activity_id: UUID
    proof_url: Optional[str]
    approval_status: str
    points_earned: int
    participated_at: datetime

    model_config = {
        "from_attributes": True
    }
