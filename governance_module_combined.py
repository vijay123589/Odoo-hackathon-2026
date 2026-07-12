"""
GOVERNANCE MODULE (FastAPI)

Policies, policy acknowledgements, audits, and compliance issues.

This file combines the original models.py, schemas.py, and routes.py
into a single module. Section markers below indicate where each
original file's content begins.
"""

import uuid
from datetime import date
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy import Column, String, Text, Date, ForeignKey
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlalchemy.orm import Session

from database import Base, get_db


# =====================================================================
# MODELS
# =====================================================================

class Policy(Base):
    __tablename__ = "policies"

    id = Column(PG_UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String(100), nullable=False)
    description = Column(Text)
    effective_date = Column(Date, nullable=False)


class PolicyAcknowledgement(Base):
    __tablename__ = "policy_acknowledgements"

    id = Column(PG_UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    policy_id = Column(PG_UUID(as_uuid=True), ForeignKey("policies.id"), nullable=False)
    employee_id = Column(PG_UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    accepted_at = Column(Date)


class Audit(Base):
    __tablename__ = "audits"

    id = Column(PG_UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String(100), nullable=False)
    department_id = Column(PG_UUID(as_uuid=True), ForeignKey("departments.id"))
    status = Column(String(20), default="OPEN")
    audit_date = Column(Date)


class ComplianceIssue(Base):
    __tablename__ = "compliance_issues"

    id = Column(PG_UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    audit_id = Column(PG_UUID(as_uuid=True), ForeignKey("audits.id"))
    owner_id = Column(PG_UUID(as_uuid=True), ForeignKey("users.id"))
    severity = Column(String(20))
    description = Column(Text)
    due_date = Column(Date)
    status = Column(String(20), default="OPEN")


# =====================================================================
# SCHEMAS
# =====================================================================

class PolicyCreate(BaseModel):
    title: str
    description: str
    effective_date: date


class AcknowledgePolicy(BaseModel):
    employee_id: UUID


class AuditCreate(BaseModel):
    title: str
    department_id: UUID
    audit_date: date


class IssueCreate(BaseModel):
    audit_id: UUID
    owner_id: UUID
    severity: str
    description: str
    due_date: date


# =====================================================================
# ROUTES
# =====================================================================

router = APIRouter(prefix="/governance", tags=["Governance"])


# =====================================
# POLICIES
# =====================================
@router.post("/policies")
def create_policy(data: PolicyCreate, db: Session = Depends(get_db)):
    policy = Policy(**data.model_dump())
    db.add(policy)
    db.commit()
    db.refresh(policy)

    return {"message": "Policy created", "id": policy.id}


@router.get("/policies")
def list_policies(db: Session = Depends(get_db)):
    return db.query(Policy).all()


@router.post("/policies/{policy_id}/acknowledge")
def acknowledge(policy_id: UUID, data: AcknowledgePolicy, db: Session = Depends(get_db)):
    existing = db.query(PolicyAcknowledgement).filter(
        PolicyAcknowledgement.policy_id == policy_id,
        PolicyAcknowledgement.employee_id == data.employee_id
    ).first()

    if existing:
        raise HTTPException(400, "Already acknowledged")

    acknowledgement = PolicyAcknowledgement(
        policy_id=policy_id,
        employee_id=data.employee_id,
        accepted_at=date.today()
    )
    db.add(acknowledgement)
    db.commit()
    db.refresh(acknowledgement)

    return {"message": "Policy acknowledged", "id": acknowledgement.id}


# =====================================
# AUDITS
# =====================================
@router.post("/audits")
def create_audit(data: AuditCreate, db: Session = Depends(get_db)):
    audit = Audit(**data.model_dump())
    db.add(audit)
    db.commit()
    db.refresh(audit)

    return {"message": "Audit created", "id": audit.id}


# =====================================
# COMPLIANCE ISSUES
# =====================================
@router.post("/issues")
def create_issue(data: IssueCreate, db: Session = Depends(get_db)):
    issue = ComplianceIssue(**data.model_dump(), status="OPEN")
    db.add(issue)
    db.commit()
    db.refresh(issue)

    return {"message": "Issue created", "id": issue.id}


@router.get("/issues")
def list_issues(db: Session = Depends(get_db)):
    return db.query(ComplianceIssue).all()
