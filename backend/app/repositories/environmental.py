from sqlalchemy.orm import Session
from typing import List, Optional
from uuid import UUID
from app.models.environmental import EmissionFactor, CarbonTransaction, EnvironmentalGoal

class EmissionFactorRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_id(self, id: UUID) -> Optional[EmissionFactor]:
        return self.db.query(EmissionFactor).filter(EmissionFactor.id == id).first()

    def get_all(self) -> List[EmissionFactor]:
        return self.db.query(EmissionFactor).all()

    def create(self, entity: EmissionFactor) -> EmissionFactor:
        self.db.add(entity)
        self.db.commit()
        self.db.refresh(entity)
        return entity

    def update(self, id: UUID, data: dict) -> Optional[EmissionFactor]:
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


class CarbonTransactionRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_id(self, id: UUID) -> Optional[CarbonTransaction]:
        return self.db.query(CarbonTransaction).filter(CarbonTransaction.id == id).first()

    def get_all(self) -> List[CarbonTransaction]:
        return self.db.query(CarbonTransaction).all()

    def create(self, entity: CarbonTransaction) -> CarbonTransaction:
        self.db.add(entity)
        self.db.commit()
        self.db.refresh(entity)
        return entity

    def update(self, id: UUID, data: dict) -> Optional[CarbonTransaction]:
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


class EnvironmentalGoalRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_id(self, id: UUID) -> Optional[EnvironmentalGoal]:
        return self.db.query(EnvironmentalGoal).filter(EnvironmentalGoal.id == id).first()

    def get_all(self) -> List[EnvironmentalGoal]:
        return self.db.query(EnvironmentalGoal).all()

    def create(self, entity: EnvironmentalGoal) -> EnvironmentalGoal:
        self.db.add(entity)
        self.db.commit()
        self.db.refresh(entity)
        return entity

    def update(self, id: UUID, data: dict) -> Optional[EnvironmentalGoal]:
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
