from typing import List, Optional
from sqlalchemy.orm import Session
import uuid

from app.models.department import Department, DepartmentORM
from app.repositories.base import BaseRepository
from app.database import string_to_uuid

class DepartmentRepository(BaseRepository[Department]):
    
    def __init__(self, db: Session):
        self.db = db

    def _to_domain(self, orm: DepartmentORM) -> Department:
        """Map DepartmentORM database model to Department domain model."""
        return Department(
            id=str(orm.id),
            name=orm.name,
            code=orm.code,
            head=orm.head,
            status=orm.status
        )

    def get_by_id(self, id: str) -> Optional[Department]:
        db_id = string_to_uuid(id)
        if not db_id:
            return None
        orm_dep = self.db.query(DepartmentORM).filter(DepartmentORM.id == db_id).first()
        if not orm_dep:
            return None
        return self._to_domain(orm_dep)

    def get_by_code(self, code: str) -> Optional[Department]:
        from sqlalchemy import func
        orm_dep = self.db.query(DepartmentORM).filter(func.lower(DepartmentORM.code) == code.lower()).first()
        if not orm_dep:
            return None
        return self._to_domain(orm_dep)


    def get_all(self) -> List[Department]:
        orm_deps = self.db.query(DepartmentORM).all()
        return [self._to_domain(d) for d in orm_deps]

    def create(self, entity: Department) -> Department:
        # Generate stable UUID for ID if passing original string ID
        db_id = string_to_uuid(entity.id) or uuid.uuid4()

        orm_dep = DepartmentORM(
            id=db_id,
            name=entity.name,
            code=entity.code.upper(),
            head=entity.head,
            status=entity.status
        )
        self.db.add(orm_dep)
        self.db.commit()
        self.db.refresh(orm_dep)
        return self._to_domain(orm_dep)

    def update(self, id: str, entity_data: dict) -> Optional[Department]:
        db_id = string_to_uuid(id)
        if not db_id:
            return None

        orm_dep = self.db.query(DepartmentORM).filter(DepartmentORM.id == db_id).first()
        if not orm_dep:
            return None

        # Apply updates
        for key, val in entity_data.items():
            setattr(orm_dep, key, val)

        self.db.commit()
        self.db.refresh(orm_dep)
        return self._to_domain(orm_dep)

    def delete(self, id: str) -> bool:
        db_id = string_to_uuid(id)
        if not db_id:
            return False

        orm_dep = self.db.query(DepartmentORM).filter(DepartmentORM.id == db_id).first()
        if orm_dep:
            self.db.delete(orm_dep)
            self.db.commit()
            return True
        return False
