import uuid
from typing import List
from fastapi import HTTPException, status
from app.models.department import Department
from app.repositories.department import DepartmentRepository
from app.repositories.user import UserRepository
from app.schemas.department import DepartmentCreate, DepartmentUpdate

class DepartmentService:
    def __init__(self, department_repo: DepartmentRepository, user_repo: UserRepository):
        self.department_repo = department_repo
        self.user_repo = user_repo

    def get_department_by_id(self, dep_id: str) -> Department:
        """Retrieve a department by ID or raise a 404 Exception."""
        dep = self.department_repo.get_by_id(dep_id)
        if not dep:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Department with ID '{dep_id}' not found"
            )
        return dep

    def get_all_departments(self) -> List[Department]:
        """Retrieve all departments."""
        return self.department_repo.get_all()

    def create_department(self, dep_in: DepartmentCreate) -> Department:
        """Create a new department, checking unique code constraint."""
        if self.department_repo.get_by_code(dep_in.code):
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"Department with code '{dep_in.code}' already exists"
            )
        
        new_dep = Department(
            id=f"dep-{uuid.uuid4().hex[:8]}",
            name=dep_in.name,
            code=dep_in.code.upper(),  # Force uppercase for standardization
            head=dep_in.head,
            status=dep_in.status
        )
        return self.department_repo.create(new_dep)

    def update_department(self, dep_id: str, dep_in: DepartmentUpdate) -> Department:
        """Update an existing department with validation checks."""
        dep = self.get_department_by_id(dep_id)
        update_data = dep_in.model_dump(exclude_unset=True)
        
        # Standardize and validate code if it is updated
        if "code" in update_data and update_data["code"]:
            update_data["code"] = update_data["code"].upper()
            if update_data["code"] != dep.code:
                if self.department_repo.get_by_code(update_data["code"]):
                    raise HTTPException(
                        status_code=status.HTTP_409_CONFLICT,
                        detail=f"Department with code '{update_data['code']}' already exists"
                    )

        return self.department_repo.update(dep_id, update_data)

    def delete_department(self, dep_id: str) -> bool:
        """Delete a department, updating any assigned users to have None as department."""
        self.get_department_by_id(dep_id)
        
        # Clean up user references to keep database consistent
        for user in self.user_repo.get_all():
            if user.department == dep_id:
                self.user_repo.update(user.id, {"department": None})
                
        return self.department_repo.delete(dep_id)
