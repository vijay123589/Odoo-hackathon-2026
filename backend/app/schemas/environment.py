from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class EmissionFactorCreate(BaseModel):
    category: str = Field(..., min_length=2, max_length=100)
    factor: float = Field(..., gt=0.0)
    unit: str = Field(..., min_length=1, max_length=20)
    description: Optional[str] = Field(None, max_length=500)

class EmissionFactorUpdate(BaseModel):
    category: Optional[str] = Field(None, min_length=2, max_length=100)
    factor: Optional[float] = Field(None, gt=0.0)
    unit: Optional[str] = Field(None, min_length=1, max_length=20)
    description: Optional[str] = Field(None, max_length=500)

class EmissionFactorResponse(BaseModel):
    id: str
    category: str
    factor: float
    unit: str
    description: Optional[str] = None
    created_at: datetime

    model_config = {
        "from_attributes": True
    }


class CarbonTransactionCreate(BaseModel):
    department_id: str = Field(...)
    emission_factor_id: str = Field(...)
    activity_name: str = Field(..., min_length=2, max_length=200)
    quantity: float = Field(..., gt=0.0)

class CarbonTransactionUpdate(BaseModel):
    department_id: Optional[str] = None
    emission_factor_id: Optional[str] = None
    activity_name: Optional[str] = None
    quantity: Optional[float] = None

class CarbonTransactionResponse(BaseModel):
    id: str
    department_id: str
    emission_factor_id: str
    activity_name: str
    quantity: float
    emission_value: float
    date: datetime
    created_by: str

    model_config = {
        "from_attributes": True
    }

class CarbonCalculateRequest(BaseModel):
    activityType: str
    value: float
    unit: str
    region: Optional[str] = None

class EnvironmentalGoalCreate(BaseModel):
    title: str = Field(..., min_length=2, max_length=200)
    target_value: float = Field(..., gt=0.0)
    deadline: datetime

class EnvironmentalGoalUpdate(BaseModel):
    title: Optional[str] = None
    target_value: Optional[float] = None
    current_value: Optional[float] = None
    deadline: Optional[datetime] = None
    status: Optional[str] = None  # "Active", "Achieved", "Failed"

class EnvironmentalGoalResponse(BaseModel):
    id: str
    title: str
    target_value: float
    current_value: float
    deadline: datetime
    status: str

    model_config = {
        "from_attributes": True
    }
