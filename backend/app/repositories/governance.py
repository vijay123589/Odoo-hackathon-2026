from sqlalchemy.orm import Session
from typing import List, Optional
from uuid import UUID
from app.models.governance import Policy, PolicyAcknowledgement, Audit, ComplianceIssue

class PolicyRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_id(self, id: UUID) -> Optional[Policy]:
        return self.db.query(Policy).filter(Policy.id == id).first()

    def get_all(self) -> List[Policy]:
        return self.db.query(Policy).all()

    def create(self, entity: Policy) -> Policy:
        self.db.add(entity)
        self.db.commit()
        self.db.refresh(entity)
        return entity

    def update(self, id: UUID, data: dict) -> Optional[Policy]:
        obj = self.get_by_id(id)
        if obj:
            for k, v in data.items():
                setattr(obj, k, v)
            self.db.commit()
            self.db.refresh(obj)
        return obj

    def delete(self, id: UUID) -> bool:
        obj = self.get_by_id(id)
        if obj:
            self.db.delete(obj)
            self.db.commit()
            return True
        return False


class PolicyAcknowledgementRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_id(self, id: UUID) -> Optional[PolicyAcknowledgement]:
        return self.db.query(PolicyAcknowledgement).filter(PolicyAcknowledgement.id == id).first()

    def get_all(self) -> List[PolicyAcknowledgement]:
        return self.db.query(PolicyAcknowledgement).all()

    def get_by_policy_and_employee(self, policy_id: UUID, employee_id: UUID) -> Optional[PolicyAcknowledgement]:
        return self.db.query(PolicyAcknowledgement).filter(
            PolicyAcknowledgement.policy_id == policy_id,
            PolicyAcknowledgement.employee_id == employee_id
        ).first()

    def create(self, entity: PolicyAcknowledgement) -> PolicyAcknowledgement:
        self.db.add(entity)
        self.db.commit()
        self.db.refresh(entity)
        return entity

    def delete(self, id: UUID) -> bool:
        obj = self.get_by_id(id)
        if obj:
            self.db.delete(obj)
            self.db.commit()
            return True
        return False


class AuditRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_id(self, id: UUID) -> Optional[Audit]:
        return self.db.query(Audit).filter(Audit.id == id).first()

    def get_all(self) -> List[Audit]:
        return self.db.query(Audit).all()

    def create(self, entity: Audit) -> Audit:
        self.db.add(entity)
        self.db.commit()
        self.db.refresh(entity)
        return entity

    def update(self, id: UUID, data: dict) -> Optional[Audit]:
        obj = self.get_by_id(id)
        if obj:
            for k, v in data.items():
                setattr(obj, k, v)
            self.db.commit()
            self.db.refresh(obj)
        return obj

    def delete(self, id: UUID) -> bool:
        obj = self.get_by_id(id)
        if obj:
            self.db.delete(obj)
            self.db.commit()
            return True
        return False


class ComplianceIssueRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_id(self, id: UUID) -> Optional[ComplianceIssue]:
        return self.db.query(ComplianceIssue).filter(ComplianceIssue.id == id).first()

    def get_all(self) -> List[ComplianceIssue]:
        return self.db.query(ComplianceIssue).all()

    def create(self, entity: ComplianceIssue) -> ComplianceIssue:
        self.db.add(entity)
        self.db.commit()
        self.db.refresh(entity)
        return entity

    def update(self, id: UUID, data: dict) -> Optional[ComplianceIssue]:
        obj = self.get_by_id(id)
        if obj:
            for k, v in data.items():
                setattr(obj, k, v)
            self.db.commit()
            self.db.refresh(obj)
        return obj

    def delete(self, id: UUID) -> bool:
        obj = self.get_by_id(id)
        if obj:
            self.db.delete(obj)
            self.db.commit()
            return True
        return False
