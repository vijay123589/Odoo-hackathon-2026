from fastapi import APIRouter, Depends, status
from typing import List
from uuid import UUID

from app.schemas.common import APIResponse
from app.schemas.social import (
    CSRActivityCreate, CSRActivityUpdate, CSRActivityResponse,
    EmployeeParticipationCreate, EmployeeParticipationUpdate, EmployeeParticipationResponse
)
from app.services.social import SocialService
from app.dependencies import require_roles, get_current_user
from app.repositories.social import CSRActivityRepository, EmployeeParticipationRepository
from app.database import get_db
from sqlalchemy.orm import Session
from app.models.user import User

router = APIRouter(prefix="/social", tags=["Social"])

def get_social_service(db: Session = Depends(get_db)) -> SocialService:
    return SocialService(
        activity_repo=CSRActivityRepository(db),
        participation_repo=EmployeeParticipationRepository(db)
    )

# --- CSR ACTIVITIES ---

@router.get(
    "/csr",
    response_model=APIResponse[List[CSRActivityResponse]],
    summary="List CSR activities",
    description="Retrieve a schedule of all corporate social responsibility (CSR) activities."
)
async def list_csr_activities(
    service: SocialService = Depends(get_social_service),
    current_user: User = Depends(get_current_user)
):
    objs = service.get_all_activities()
    data = [CSRActivityResponse.model_validate(o) for o in objs]
    return APIResponse(success=True, message="CSR activities retrieved successfully", data=data)

@router.post(
    "/csr",
    response_model=APIResponse[CSRActivityResponse],
    status_code=status.HTTP_201_CREATED,
    summary="Create CSR activity (Admin only)",
    description="Register a new social/volunteer activity, scheduling location, points and limits."
)
async def create_csr_activity(
    payload: CSRActivityCreate,
    service: SocialService = Depends(get_social_service),
    current_user: User = Depends(require_roles(["Admin"]))
):
    obj = service.create_activity(payload)
    return APIResponse(success=True, message="CSR activity created successfully", data=CSRActivityResponse.model_validate(obj))

@router.put(
    "/csr/{id}",
    response_model=APIResponse[CSRActivityResponse],
    summary="Update CSR activity (Admin and Manager)",
    description="Update a CSR activity title, date, description, points or state parameters."
)
async def update_csr_activity(
    id: UUID,
    payload: CSRActivityUpdate,
    service: SocialService = Depends(get_social_service),
    current_user: User = Depends(require_roles(["Admin", "Manager"]))
):
    obj = service.update_activity(id, payload)
    return APIResponse(success=True, message="CSR activity updated successfully", data=CSRActivityResponse.model_validate(obj))

@router.delete(
    "/csr/{id}",
    response_model=APIResponse[None],
    summary="Delete CSR activity (Admin only)",
    description="Remove a scheduled CSR activity item."
)
async def delete_csr_activity(
    id: UUID,
    service: SocialService = Depends(get_social_service),
    current_user: User = Depends(require_roles(["Admin"]))
):
    service.delete_activity(id)
    return APIResponse(success=True, message="CSR activity deleted successfully", data=None)

# --- EMPLOYEE PARTICIPATIONS ---

@router.get(
    "/participation",
    response_model=APIResponse[List[EmployeeParticipationResponse]],
    summary="List volunteer participations",
    description="Retrieve all logged employee participation records in social activities."
)
async def list_participations(
    service: SocialService = Depends(get_social_service),
    current_user: User = Depends(get_current_user)
):
    objs = service.get_all_participations()
    data = [EmployeeParticipationResponse.model_validate(o) for o in objs]
    return APIResponse(success=True, message="Participation records retrieved successfully", data=data)

@router.post(
    "/participation",
    response_model=APIResponse[EmployeeParticipationResponse],
    status_code=status.HTTP_201_CREATED,
    summary="Log volunteer participation (Admin only)",
    description="Log employee registration or submission for a CSR activity with proof references."
)
async def create_participation(
    payload: EmployeeParticipationCreate,
    service: SocialService = Depends(get_social_service),
    current_user: User = Depends(require_roles(["Admin"]))
):
    obj = service.create_participation(payload)
    return APIResponse(success=True, message="Participation logged successfully. Pending approval.", data=EmployeeParticipationResponse.model_validate(obj))

@router.put(
    "/participation/{id}",
    response_model=APIResponse[EmployeeParticipationResponse],
    summary="Update participation/approve points (Admin and Manager)",
    description="Modify a logged participation or update its approval status to 'Approved' (which grants volunteer points)."
)
async def update_participation(
    id: UUID,
    payload: EmployeeParticipationUpdate,
    service: SocialService = Depends(get_social_service),
    current_user: User = Depends(require_roles(["Admin", "Manager"]))
):
    obj = service.update_participation(id, payload)
    return APIResponse(success=True, message="Participation status updated successfully", data=EmployeeParticipationResponse.model_validate(obj))

@router.delete(
    "/participation/{id}",
    response_model=APIResponse[None],
    summary="Delete participation (Admin only)",
    description="Remove an employee's CSR participation log entry."
)
async def delete_participation(
    id: UUID,
    service: SocialService = Depends(get_social_service),
    current_user: User = Depends(require_roles(["Admin"]))
):
    service.delete_participation(id)
    return APIResponse(success=True, message="Participation record deleted successfully", data=None)
