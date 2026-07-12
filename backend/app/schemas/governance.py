from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from uuid import UUID

class PolicyCreate(BaseModel):
    title: str = Field(..., min_length=2, max_length=150)
    description: str = Field(..., min_length=2, max_length=255)
    version: str = Field(..., min_length=1, max_length=20)
    effective_date: datetime

class PolicyUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=2, max_length=150)
    description: Optional[str] = Field(None, min_length=2, max_length=255)
    version: Optional[str] = Field(None, min_length=1, max_length=20)
    effective_date: Optional[datetime] = None

class PolicyResponse(BaseModel):
    id: UUID
    title: str
    description: str
    version: str
    effective_date: datetime
    created_at: datetime

    model_config = {
        "from_attributes": True
    }


class PolicyAcknowledgementCreate(BaseModel):
    policy_id: UUID
    employee_id: UUID

class PolicyAcknowledgementResponse(BaseModel):
    id: UUID
    policy_id: UUID
    employee_id: UUID
    acknowledged_at: datetime

    model_config = {
        "from_attributes": True
    }


class AuditCreate(BaseModel):
    department_id: UUID
    auditor_name: str = Field(..., min_length=2, max_length=100)
    audit_date: datetime
    remarks: Optional[str] = Field(None, max_length=255)

class AuditUpdate(BaseModel):
    department_id: Optional[UUID] = None
    auditor_name: Optional[str] = Field(None, min_length=2, max_length=100)
    status: Optional[str] = Field(None, max_length=50)
    remarks: Optional[str] = Field(None, max_length=255)
    audit_date: Optional[datetime] = None

class AuditResponse(BaseModel):
    id: UUID
    department_id: UUID
    auditor_name: str
    status: str
    remarks: Optional[str]
    audit_date: datetime

    model_config = {
        "from_attributes": True
    }


class ComplianceIssueCreate(BaseModel):
    audit_id: UUID
    severity: str = Field(..., min_length=2, max_length=50)
    description: str = Field(..., min_length=2, max_length=255)
    owner_id: UUID
    due_date: datetime

class ComplianceIssueUpdate(BaseModel):
    audit_id: Optional[UUID] = None
    severity: Optional[str] = Field(None, min_length=2, max_length=50)
    description: Optional[str] = Field(None, min_length=2, max_length=255)
    owner_id: Optional[UUID] = None
    status: Optional[str] = Field(None, max_length=50)
    due_date: Optional[datetime] = None

class ComplianceIssueResponse(BaseModel):
    id: UUID
    audit_id: UUID
    severity: str
    description: str
    owner_id: UUID
    status: str
    due_date: datetime

    model_config = {
        "from_attributes": True
    }
