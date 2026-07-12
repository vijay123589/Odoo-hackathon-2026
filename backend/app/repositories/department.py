from typing import List, Optional
from app.models.department import Department
from app.repositories.base import BaseRepository
from app.database import DEPARTMENTS_DB

class DepartmentRepository(BaseRepository[Department]):
    
    def get_by_id(self, id: str) -> Optional[Department]:
        dep_dict = DEPARTMENTS_DB.get(id)
        if not dep_dict:
            return None
        return Department.from_dict(dep_dict)

    def get_by_code(self, code: str) -> Optional[Department]:
        for dep_dict in DEPARTMENTS_DB.values():
            if dep_dict["code"].lower() == code.lower():
                return Department.from_dict(dep_dict)
        return None

    def get_all(self) -> List[Department]:
        return [Department.from_dict(d) for d in DEPARTMENTS_DB.values()]

    def create(self, entity: Department) -> Department:
        DEPARTMENTS_DB[entity.id] = entity.to_dict()
        return entity

    def update(self, id: str, entity_data: dict) -> Optional[Department]:
        dep_dict = DEPARTMENTS_DB.get(id)
        if not dep_dict:
            return None
        # Apply updates
        for key, val in entity_data.items():
            dep_dict[key] = val
        DEPARTMENTS_DB[id] = dep_dict
        return Department.from_dict(dep_dict)

    def delete(self, id: str) -> bool:
        if id in DEPARTMENTS_DB:
            del DEPARTMENTS_DB[id]
            return True
        return False
