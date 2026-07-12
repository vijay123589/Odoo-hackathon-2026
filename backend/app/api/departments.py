from fastapi import APIRouter, Depends, status
from typing import List

from app.schemas.common import APIResponse
from app.schemas.department import DepartmentCreate, DepartmentUpdate, DepartmentResponse
from app.services.department import DepartmentService
from app.dependencies import get_department_service, require_roles, get_current_user
from app.models.department import Department
from app.models.user import User

router = APIRouter(prefix="/departments", tags=["Departments"])

def map_dep_to_response(dep: Department) -> DepartmentResponse:
    """Helper to convert department domain model to DepartmentResponse schema."""
    return DepartmentResponse(
        id=dep.id,
        name=dep.name,
        code=dep.code,
        head=dep.head,
        status=dep.status
    )

@router.get(
    "",
    response_model=APIResponse[List[DepartmentResponse]],
    summary="List all departments",
    description="Retrieve a list of all active departments inside EcoSphere. Accessible to all logged-in users."
)
async def list_departments(
    dep_service: DepartmentService = Depends(get_department_service),
    current_user: User = Depends(get_current_user)
):
    deps = dep_service.get_all_departments()
    data = [map_dep_to_response(d) for d in deps]
    return APIResponse(
        success=True,
        message="Departments listed successfully",
        data=data
    )

@router.post(
    "",
    response_model=APIResponse[DepartmentResponse],
    status_code=status.HTTP_201_CREATED,
    summary="Create a new department (Admin only)",
    description="Add a new department with unique code and designated head to EcoSphere. Restricted to Admin role only."
)
async def create_department(
    dep_in: DepartmentCreate,
    dep_service: DepartmentService = Depends(get_department_service),
    current_user: User = Depends(require_roles(["Admin"]))
):
    new_dep = dep_service.create_department(dep_in)
    return APIResponse(
        success=True,
        message="Department created successfully",
        data=map_dep_to_response(new_dep)
    )

@router.put(
    "/{id}",
    response_model=APIResponse[DepartmentResponse],
    summary="Update a department (Admin only)",
    description="Modify the details of a department (e.g. name, code, department head, status). Restricted to Admin role only."
)
async def update_department(
    id: str,
    dep_in: DepartmentUpdate,
    dep_service: DepartmentService = Depends(get_department_service),
    current_user: User = Depends(require_roles(["Admin"]))
):
    updated_dep = dep_service.update_department(id, dep_in)
    return APIResponse(
        success=True,
        message="Department updated successfully",
        data=map_dep_to_response(updated_dep)
    )

@router.delete(
    "/{id}",
    response_model=APIResponse[None],
    summary="Delete a department (Admin only)",
    description="Permanently remove a department from EcoSphere. Users belonging to this department will have their department field cleared. Restricted to Admin role only."
)
async def delete_department(
    id: str,
    dep_service: DepartmentService = Depends(get_department_service),
    current_user: User = Depends(require_roles(["Admin"]))
):
    dep_service.delete_department(id)
    return APIResponse(
        success=True,
        message="Department deleted successfully",
        data=None
    )
