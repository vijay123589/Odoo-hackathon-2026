from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime
from app.schemas.auth import UserRole

class UserCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr = Field(...)
    password: str = Field(..., min_length=8)
    role: UserRole = Field(default=UserRole.EMPLOYEE)
    department: Optional[str] = Field(default=None)
    status: str = Field(default="Active")

class UserUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=2, max_length=100)
    email: Optional[EmailStr] = Field(None)
    password: Optional[str] = Field(None, min_length=8)
    role: Optional[UserRole] = Field(None)
    department: Optional[str] = Field(None)
    status: Optional[str] = Field(None)

class UserResponse(BaseModel):
    id: str
    name: str
    email: EmailStr
    role: UserRole
    department: Optional[str] = None
    status: str
    created_at: datetime

    model_config = {
        "from_attributes": True
    }

