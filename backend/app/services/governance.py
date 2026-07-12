from typing import List
from uuid import UUID
from fastapi import HTTPException, status

from app.models.governance import Policy, PolicyAcknowledgement, Audit, ComplianceIssue
from app.repositories.governance import PolicyRepository, PolicyAcknowledgementRepository, AuditRepository, ComplianceIssueRepository
from app.schemas.governance import (
    PolicyCreate, PolicyUpdate,
    PolicyAcknowledgementCreate,
    AuditCreate, AuditUpdate,
    ComplianceIssueCreate, ComplianceIssueUpdate
)

class GovernanceService:
    def __init__(
        self,
        policy_repo: PolicyRepository,
        ack_repo: PolicyAcknowledgementRepository,
        audit_repo: AuditRepository,
        compliance_repo: ComplianceIssueRepository
    ):
        self.policy_repo = policy_repo
        self.ack_repo = ack_repo
        self.audit_repo = audit_repo
        self.compliance_repo = compliance_repo

    # --- POLICIES ---
    def get_all_policies(self) -> List[Policy]:
        return self.policy_repo.get_all()

    def get_policy_by_id(self, id: UUID) -> Policy:
        obj = self.policy_repo.get_by_id(id)
        if not obj:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Policy not found")
        return obj

    def create_policy(self, data: PolicyCreate) -> Policy:
        new_obj = Policy(
            title=data.title,
            description=data.description,
            version=data.version,
            effective_date=data.effective_date
        )
        return self.policy_repo.create(new_obj)

    def update_policy(self, id: UUID, data: PolicyUpdate) -> Policy:
        self.get_policy_by_id(id)
        update_dict = data.model_dump(exclude_unset=True)
        return self.policy_repo.update(id, update_dict)

    def delete_policy(self, id: UUID) -> bool:
        self.get_policy_by_id(id)
        return self.policy_repo.delete(id)

    # --- POLICY ACKNOWLEDGEMENTS ---
    def get_all_acknowledgements(self) -> List[PolicyAcknowledgement]:
        return self.ack_repo.get_all()

    def acknowledge_policy(self, data: PolicyAcknowledgementCreate) -> PolicyAcknowledgement:
        # Check policy exists
        policy = self.policy_repo.get_by_id(data.policy_id)
        if not policy:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid policy ID")
            
        # Prevent duplicate acknowledgements
        existing = self.ack_repo.get_by_policy_and_employee(data.policy_id, data.employee_id)
        if existing:
            return existing

        new_obj = PolicyAcknowledgement(
            policy_id=data.policy_id,
            employee_id=data.employee_id
        )
        return self.ack_repo.create(new_obj)

    # --- AUDITS ---
    def get_all_audits(self) -> List[Audit]:
        return self.audit_repo.get_all()

    def get_audit_by_id(self, id: UUID) -> Audit:
        obj = self.audit_repo.get_by_id(id)
        if not obj:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Audit report not found")
        return obj

    def create_audit(self, data: AuditCreate) -> Audit:
        new_obj = Audit(
            department_id=data.department_id,
            auditor_name=data.auditor_name,
            audit_date=data.audit_date,
            remarks=data.remarks,
            status="Scheduled"
        )
        return self.audit_repo.create(new_obj)

    def update_audit(self, id: UUID, data: AuditUpdate) -> Audit:
        self.get_audit_by_id(id)
        update_dict = data.model_dump(exclude_unset=True)
        return self.audit_repo.update(id, update_dict)

    def delete_audit(self, id: UUID) -> bool:
        self.get_audit_by_id(id)
        return self.audit_repo.delete(id)

    # --- COMPLIANCE ISSUES ---
    def get_all_compliance_issues(self) -> List[ComplianceIssue]:
        return self.compliance_repo.get_all()

    def get_compliance_issue_by_id(self, id: UUID) -> ComplianceIssue:
        obj = self.compliance_repo.get_by_id(id)
        if not obj:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Compliance issue not found")
        return obj

    def create_compliance_issue(self, data: ComplianceIssueCreate) -> ComplianceIssue:
        # Check audit report exists
        audit = self.audit_repo.get_by_id(data.audit_id)
        if not audit:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid audit ID")

        new_obj = ComplianceIssue(
            audit_id=data.audit_id,
            severity=data.severity,
            description=data.description,
            owner_id=data.owner_id,
            due_date=data.due_date,
            status="Open"
        )
        return self.compliance_repo.create(new_obj)

    def update_compliance_issue(self, id: UUID, data: ComplianceIssueUpdate) -> ComplianceIssue:
        self.get_compliance_issue_by_id(id)
        update_dict = data.model_dump(exclude_unset=True)
        return self.compliance_repo.update(id, update_dict)

    def delete_compliance_issue(self, id: UUID) -> bool:
        self.get_compliance_issue_by_id(id)
        return self.compliance_repo.delete(id)

