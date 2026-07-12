from typing import List, Optional
from sqlalchemy import func

from sqlalchemy.orm import Session
import uuid

from app.models.user import User, UserORM
from app.models.role import Role
from app.repositories.base import BaseRepository
from app.database import string_to_uuid

class UserRepository(BaseRepository[User]):
    
    def __init__(self, db: Session):
        self.db = db

    def _to_domain(self, orm: UserORM) -> User:
        """Map UserORM database model to User domain model."""
        return User(
            id=str(orm.id),
            name=orm.name,
            email=orm.email,
            password_hash=orm.password_hash,
            role=orm.role_relation.name if orm.role_relation else "Employee",
            department=str(orm.department_id) if orm.department_id else None,
            status=orm.status,
            created_at=orm.created_at
        )

    def get_by_id(self, id: str) -> Optional[User]:
        db_id = string_to_uuid(id)
        if not db_id:
            return None
        orm_user = self.db.query(UserORM).filter(UserORM.id == db_id).first()
        if not orm_user:
            return None
        return self._to_domain(orm_user)

    def get_by_email(self, email: str) -> Optional[User]:
        orm_user = self.db.query(UserORM).filter(func.lower(UserORM.email) == email.lower()).first()
        if not orm_user:
            return None
        return self._to_domain(orm_user)


    def get_all(self) -> List[User]:
        orm_users = self.db.query(UserORM).all()
        return [self._to_domain(u) for u in orm_users]

    def get_by_department(self, department_id: str) -> List[User]:
        dep_uuid = string_to_uuid(department_id)
        if not dep_uuid:
            return []
        orm_users = self.db.query(UserORM).filter(UserORM.department_id == dep_uuid).all()
        return [self._to_domain(u) for u in orm_users]

    def create(self, entity: User) -> User:
        # Generate stable UUID for ID if passing original string ID
        db_id = string_to_uuid(entity.id) or uuid.uuid4()
        
        # Look up role corresponding to string role name
        role_orm = self.db.query(Role).filter(Role.name == entity.role).first()
        if not role_orm:
            # Fallback if role is missing in db (should not happen due to seeder)
            role_orm = self.db.query(Role).filter(Role.name == "Employee").first()
            
        # Parse department UUID
        dep_id = string_to_uuid(entity.department) if entity.department else None

        orm_user = UserORM(
            id=db_id,
            name=entity.name,
            email=entity.email,
            password_hash=entity.password_hash,
            role_id=role_orm.id if role_orm else None,
            department_id=dep_id,
            status=entity.status,
            created_at=entity.created_at
        )
        self.db.add(orm_user)
        self.db.commit()
        self.db.refresh(orm_user)
        return self._to_domain(orm_user)

    def update(self, id: str, entity_data: dict) -> Optional[User]:
        db_id = string_to_uuid(id)
        if not db_id:
            return None
            
        orm_user = self.db.query(UserORM).filter(UserORM.id == db_id).first()
        if not orm_user:
            return None

        # Build update properties copy to prevent writing foreign key mappings directly
        data = entity_data.copy()
        
        # Map string role to role_id in ORM
        if "role" in data:
            role_name = data.pop("role")
            role_orm = self.db.query(Role).filter(Role.name == role_name).first()
            if role_orm:
                orm_user.role_id = role_orm.id

        # Map string department to department_id in ORM
        if "department" in data:
            dep_val = data.pop("department")
            orm_user.department_id = string_to_uuid(dep_val) if dep_val else None

        # Apply other attributes
        for key, val in data.items():
            setattr(orm_user, key, val)

        self.db.commit()
        self.db.refresh(orm_user)
        return self._to_domain(orm_user)

    def delete(self, id: str) -> bool:
        db_id = string_to_uuid(id)
        if not db_id:
            return False
            
        orm_user = self.db.query(UserORM).filter(UserORM.id == db_id).first()
        if orm_user:
            self.db.delete(orm_user)
            self.db.commit()
            return True
        return False
