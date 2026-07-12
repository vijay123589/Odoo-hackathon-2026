from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from uuid import UUID

class EmissionFactorCreate(BaseModel):
    activity_name: str = Field(..., min_length=2, max_length=150)
    category: str = Field(..., min_length=2, max_length=100)
    factor_value: float = Field(..., gt=0.0)
    unit: str = Field(..., min_length=1, max_length=50)
    description: Optional[str] = Field(None, max_length=255)

class EmissionFactorUpdate(BaseModel):
    activity_name: Optional[str] = Field(None, min_length=2, max_length=150)
    category: Optional[str] = Field(None, min_length=2, max_length=100)
    factor_value: Optional[float] = Field(None, gt=0.0)
    unit: Optional[str] = Field(None, min_length=1, max_length=50)
    description: Optional[str] = Field(None, max_length=255)

class EmissionFactorResponse(BaseModel):
    id: UUID
    activity_name: str
    category: str
    factor_value: float
    unit: str
    description: Optional[str]
    created_at: datetime
    updated_at: datetime

    model_config = {
        "from_attributes": True
    }


class CarbonTransactionCreate(BaseModel):
    user_id: UUID
    department_id: UUID
    emission_factor_id: UUID
    activity_name: str = Field(..., min_length=2, max_length=150)
    quantity: float = Field(..., gt=0.0)
    remarks: Optional[str] = Field(None, max_length=255)

class CarbonTransactionUpdate(BaseModel):
    user_id: Optional[UUID] = None
    department_id: Optional[UUID] = None
    emission_factor_id: Optional[UUID] = None
    activity_name: Optional[str] = Field(None, min_length=2, max_length=150)
    quantity: Optional[float] = Field(None, gt=0.0)
    remarks: Optional[str] = Field(None, max_length=255)

class CarbonTransactionResponse(BaseModel):
    id: UUID
    user_id: UUID
    department_id: UUID
    emission_factor_id: UUID
    activity_name: str
    quantity: float
    carbon_emission: float
    transaction_date: datetime
    remarks: Optional[str]
    created_at: datetime

    model_config = {
        "from_attributes": True
    }


class EnvironmentalGoalCreate(BaseModel):
    title: str = Field(..., min_length=2, max_length=150)
    description: str = Field(..., min_length=2, max_length=255)
    target_value: float = Field(..., gt=0.0)
    current_value: float = Field(default=0.0, ge=0.0)
    unit: str = Field(..., min_length=1, max_length=50)
    deadline: datetime

class EnvironmentalGoalUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=2, max_length=150)
    description: Optional[str] = Field(None, min_length=2, max_length=255)
    target_value: Optional[float] = Field(None, gt=0.0)
    current_value: Optional[float] = Field(None, ge=0.0)
    unit: Optional[str] = Field(None, min_length=1, max_length=50)
    deadline: Optional[datetime] = None
    status: Optional[str] = Field(None, max_length=50)

class EnvironmentalGoalResponse(BaseModel):
    id: UUID
    title: str
    description: str
    target_value: float
    current_value: float
    unit: str
    deadline: datetime
    status: str
    created_at: datetime

    model_config = {
        "from_attributes": True
    }
