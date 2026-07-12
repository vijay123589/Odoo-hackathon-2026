from sqlalchemy.orm import Session
from typing import List, Optional
from uuid import UUID
from app.models.social import CSRActivity, EmployeeParticipation

class CSRActivityRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_id(self, id: UUID) -> Optional[CSRActivity]:
        return self.db.query(CSRActivity).filter(CSRActivity.id == id).first()

    def get_all(self) -> List[CSRActivity]:
        return self.db.query(CSRActivity).all()

    def create(self, entity: CSRActivity) -> CSRActivity:
        self.db.add(entity)
        self.db.commit()
        self.db.refresh(entity)
        return entity

    def update(self, id: UUID, data: dict) -> Optional[CSRActivity]:
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


class EmployeeParticipationRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_id(self, id: UUID) -> Optional[EmployeeParticipation]:
        return self.db.query(EmployeeParticipation).filter(EmployeeParticipation.id == id).first()

    def get_all(self) -> List[EmployeeParticipation]:
        return self.db.query(EmployeeParticipation).all()

    def create(self, entity: EmployeeParticipation) -> EmployeeParticipation:
        self.db.add(entity)
        self.db.commit()
        self.db.refresh(entity)
        return entity

    def update(self, id: UUID, data: dict) -> Optional[EmployeeParticipation]:
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
