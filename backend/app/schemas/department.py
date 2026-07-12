from pydantic import BaseModel, Field
from typing import Optional

class DepartmentCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=150)
    code: str = Field(..., min_length=2, max_length=10, description="Department code (e.g. SUS, HR)")
    head: str = Field(..., min_length=2, max_length=100, description="Name of the department head")
    status: str = Field(default="Active", description="Department status (Active/Inactive)")

class DepartmentUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=2, max_length=150)
    code: Optional[str] = Field(None, min_length=2, max_length=10)
    head: Optional[str] = Field(None, min_length=2, max_length=100)
    status: Optional[str] = Field(None)

class DepartmentResponse(BaseModel):
    id: str
    name: str
    code: str
    head: str
    status: str

    model_config = {
        "from_attributes": True
    }

