from fastapi import APIRouter, Depends, status
from typing import List
from uuid import UUID

from app.schemas.common import APIResponse
from app.schemas.governance import (
    PolicyCreate, PolicyUpdate, PolicyResponse,
    PolicyAcknowledgementCreate, PolicyAcknowledgementResponse,
    AuditCreate, AuditUpdate, AuditResponse,
    ComplianceIssueCreate, ComplianceIssueUpdate, ComplianceIssueResponse
)
from app.services.governance import GovernanceService
from app.dependencies import require_roles, get_current_user
from app.repositories.governance import PolicyRepository, PolicyAcknowledgementRepository, AuditRepository, ComplianceIssueRepository
from app.database import get_db
from sqlalchemy.orm import Session
from app.models.user import User

router = APIRouter(prefix="/governance", tags=["Governance"])

def get_governance_service(db: Session = Depends(get_db)) -> GovernanceService:
    return GovernanceService(
        policy_repo=PolicyRepository(db),
        ack_repo=PolicyAcknowledgementRepository(db),
        audit_repo=AuditRepository(db),
        compliance_repo=ComplianceIssueRepository(db)
    )

# --- POLICIES ---

@router.get(
    "/policies",
    response_model=APIResponse[List[PolicyResponse]],
    summary="List all policies",
    description="Retrieve a listing of all active corporate policies, version numbers, and effective dates."
)
async def list_policies(
    service: GovernanceService = Depends(get_governance_service),
    current_user: User = Depends(get_current_user)
):
    objs = service.get_all_policies()
    data = [PolicyResponse.model_validate(o) for o in objs]
    return APIResponse(success=True, message="Policies retrieved successfully", data=data)

@router.post(
    "/policies",
    response_model=APIResponse[PolicyResponse],
    status_code=status.HTTP_201_CREATED,
    summary="Create corporate policy (Admin only)",
    description="Establish a new policy, version number, and set active/effective date."
)
async def create_policy(
    payload: PolicyCreate,
    service: GovernanceService = Depends(get_governance_service),
    current_user: User = Depends(require_roles(["Admin"]))
):
    obj = service.create_policy(payload)
    return APIResponse(success=True, message="Policy created successfully", data=PolicyResponse.model_validate(obj))

@router.put(
    "/policies/{id}",
    response_model=APIResponse[PolicyResponse],
    summary="Update corporate policy (Admin and Manager)",
    description="Modify a policy title, details, version, or effective date."
)
async def update_policy(
    id: UUID,
    payload: PolicyUpdate,
    service: GovernanceService = Depends(get_governance_service),
    current_user: User = Depends(require_roles(["Admin", "Manager"]))
):
    obj = service.update_policy(id, payload)
    return APIResponse(success=True, message="Policy updated successfully", data=PolicyResponse.model_validate(obj))

@router.delete(
    "/policies/{id}",
    response_model=APIResponse[None],
    summary="Delete corporate policy (Admin only)",
    description="Remove a policy from governance records."
)
async def delete_policy(
    id: UUID,
    service: GovernanceService = Depends(get_governance_service),
    current_user: User = Depends(require_roles(["Admin"]))
):
    service.delete_policy(id)
    return APIResponse(success=True, message="Policy deleted successfully", data=None)

# --- POLICY ACKNOWLEDGEMENTS ---

@router.get(
    "/acknowledgements",
    response_model=APIResponse[List[PolicyAcknowledgementResponse]],
    summary="List acknowledgements (Admin and Manager)",
    description="Retrieve all registered policy sign-offs and signatures."
)
async def list_acknowledgements(
    service: GovernanceService = Depends(get_governance_service),
    current_user: User = Depends(require_roles(["Admin", "Manager"]))
):
    objs = service.get_all_acknowledgements()
    data = [PolicyAcknowledgementResponse.model_validate(o) for o in objs]
    return APIResponse(success=True, message="Acknowledgement records retrieved successfully", data=data)

@router.post(
    "/acknowledgements",
    response_model=APIResponse[PolicyAcknowledgementResponse],
    status_code=status.HTTP_201_CREATED,
    summary="Acknowledge policy (Logged-in User)",
    description="Sign off/acknowledge that the logged-in employee has read and understood a corporate policy."
)
async def acknowledge_policy(
    payload: PolicyAcknowledgementCreate,
    service: GovernanceService = Depends(get_governance_service),
    current_user: User = Depends(get_current_user)
):
    # Security: prevent users from signing acknowledgements for other employees
    if current_user.role != "Admin" and current_user.id != str(payload.employee_id):
        payload.employee_id = UUID(current_user.id)
        
    obj = service.acknowledge_policy(payload)
    return APIResponse(success=True, message="Policy acknowledged successfully", data=PolicyAcknowledgementResponse.model_validate(obj))

# --- AUDITS ---

@router.get(
    "/audits",
    response_model=APIResponse[List[AuditResponse]],
    summary="List audit reports",
    description="Retrieve governance auditing schedules, auditors, and review statuses."
)
async def list_audits(
    service: GovernanceService = Depends(get_governance_service),
    current_user: User = Depends(get_current_user)
):
    objs = service.get_all_audits()
    data = [AuditResponse.model_validate(o) for o in objs]
    return APIResponse(success=True, message="Audits retrieved successfully", data=data)

@router.post(
    "/audits",
    response_model=APIResponse[AuditResponse],
    status_code=status.HTTP_201_CREATED,
    summary="Create audit report (Admin only)",
    description="Schedule a new internal ESG audit on a department."
)
async def create_audit(
    payload: AuditCreate,
    service: GovernanceService = Depends(get_governance_service),
    current_user: User = Depends(require_roles(["Admin"]))
):
    obj = service.create_audit(payload)
    return APIResponse(success=True, message="Audit scheduled successfully", data=AuditResponse.model_validate(obj))

@router.put(
    "/audits/{id}",
    response_model=APIResponse[AuditResponse],
    summary="Update audit report (Admin and Manager)",
    description="Modify audit remarks, date, or update status (Scheduled/Completed)."
)
async def update_audit(
    id: UUID,
    payload: AuditUpdate,
    service: GovernanceService = Depends(get_governance_service),
    current_user: User = Depends(require_roles(["Admin", "Manager"]))
):
    obj = service.update_audit(id, payload)
    return APIResponse(success=True, message="Audit updated successfully", data=AuditResponse.model_validate(obj))

@router.delete(
    "/audits/{id}",
    response_model=APIResponse[None],
    summary="Delete audit report (Admin only)",
    description="Cancel and remove an audit report from records."
)
async def delete_audit(
    id: UUID,
    service: GovernanceService = Depends(get_governance_service),
    current_user: User = Depends(require_roles(["Admin"]))
):
    service.delete_audit(id)
    return APIResponse(success=True, message="Audit deleted successfully", data=None)

# --- COMPLIANCE ISSUES ---

@router.get(
    "/compliance",
    response_model=APIResponse[List[ComplianceIssueResponse]],
    summary="List compliance issues",
    description="Retrieve all logged compliance issues, severity levels, owners, and resolution deadlines."
)
async def list_compliance_issues(
    service: GovernanceService = Depends(get_governance_service),
    current_user: User = Depends(get_current_user)
):
    objs = service.get_all_compliance_issues()
    data = [ComplianceIssueResponse.model_validate(o) for o in objs]
    return APIResponse(success=True, message="Compliance issues retrieved successfully", data=data)

@router.post(
    "/compliance",
    response_model=APIResponse[ComplianceIssueResponse],
    status_code=status.HTTP_201_CREATED,
    summary="Log compliance issue (Admin only)",
    description="Record a new compliance violation/issue arising from an audit."
)
async def create_compliance_issue(
    payload: ComplianceIssueCreate,
    service: GovernanceService = Depends(get_governance_service),
    current_user: User = Depends(require_roles(["Admin"]))
):
    obj = service.create_compliance_issue(payload)
    return APIResponse(success=True, message="Compliance issue logged successfully", data=ComplianceIssueResponse.model_validate(obj))

@router.put(
    "/compliance/{id}",
    response_model=APIResponse[ComplianceIssueResponse],
    summary="Update compliance issue (Admin and Manager)",
    description="Update a compliance issue severity, description, status (Open/Resolved), due date, or ownership."
)
async def update_compliance_issue(
    id: UUID,
    payload: ComplianceIssueUpdate,
    service: GovernanceService = Depends(get_governance_service),
    current_user: User = Depends(require_roles(["Admin", "Manager"]))
):
    obj = service.update_compliance_issue(id, payload)
    return APIResponse(success=True, message="Compliance issue updated successfully", data=ComplianceIssueResponse.model_validate(obj))

@router.delete(
    "/compliance/{id}",
    response_model=APIResponse[None],
    summary="Delete compliance issue (Admin only)",
    description="Remove a compliance issue log entry."
)
async def delete_compliance_issue(
    id: UUID,
    service: GovernanceService = Depends(get_governance_service),
    current_user: User = Depends(require_roles(["Admin"]))
):
    service.delete_compliance_issue(id)
    return APIResponse(success=True, message="Compliance issue deleted successfully", data=None)
