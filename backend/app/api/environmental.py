from fastapi import APIRouter, Depends, status
from typing import List
from uuid import UUID

from app.schemas.common import APIResponse
from app.schemas.environmental import (
    EmissionFactorCreate, EmissionFactorUpdate, EmissionFactorResponse,
    CarbonTransactionCreate, CarbonTransactionUpdate, CarbonTransactionResponse,
    EnvironmentalGoalCreate, EnvironmentalGoalUpdate, EnvironmentalGoalResponse
)
from app.services.environmental import EnvironmentalService
from app.dependencies import require_roles, get_current_user, get_user_repository, get_department_repository
from app.repositories.environmental import EmissionFactorRepository, CarbonTransactionRepository, EnvironmentalGoalRepository
from app.database import get_db
from sqlalchemy.orm import Session
from app.models.user import User

router = APIRouter(prefix="/environment", tags=["Environmental"])

# Helper dependencies to resolve service instances
def get_environmental_service(db: Session = Depends(get_db)) -> EnvironmentalService:
    return EnvironmentalService(
        factor_repo=EmissionFactorRepository(db),
        transaction_repo=CarbonTransactionRepository(db),
        goal_repo=EnvironmentalGoalRepository(db)
    )

# --- EMISSION FACTORS ---

@router.get(
    "/emission-factors",
    response_model=APIResponse[List[EmissionFactorResponse]],
    summary="List all emission factors",
    description="Retrieve a list of greenhouse gas emission factors catalogued in the system."
)
async def list_emission_factors(
    service: EnvironmentalService = Depends(get_environmental_service),
    current_user: User = Depends(get_current_user)
):
    objs = service.get_all_factors()
    data = [EmissionFactorResponse.model_validate(o) for o in objs]
    return APIResponse(success=True, message="Emission factors retrieved successfully", data=data)

@router.post(
    "/emission-factors",
    response_model=APIResponse[EmissionFactorResponse],
    status_code=status.HTTP_201_CREATED,
    summary="Create emission factor (Admin only)",
    description="Register a new activity category and CO2 footprint multiplier factor value."
)
async def create_emission_factor(
    payload: EmissionFactorCreate,
    service: EnvironmentalService = Depends(get_environmental_service),
    current_user: User = Depends(require_roles(["Admin"]))
):
    obj = service.create_factor(payload)
    return APIResponse(success=True, message="Emission factor created successfully", data=EmissionFactorResponse.model_validate(obj))

@router.put(
    "/emission-factors/{id}",
    response_model=APIResponse[EmissionFactorResponse],
    summary="Update emission factor (Admin and Manager)",
    description="Update the factor value, unit, category or descriptions for an activity footprint multiplier."
)
async def update_emission_factor(
    id: UUID,
    payload: EmissionFactorUpdate,
    service: EnvironmentalService = Depends(get_environmental_service),
    current_user: User = Depends(require_roles(["Admin", "Manager"]))
):
    obj = service.update_factor(id, payload)
    return APIResponse(success=True, message="Emission factor updated successfully", data=EmissionFactorResponse.model_validate(obj))

@router.delete(
    "/emission-factors/{id}",
    response_model=APIResponse[None],
    summary="Delete emission factor (Admin only)",
    description="Delete a designated activity category footprint multiplier factor."
)
async def delete_emission_factor(
    id: UUID,
    service: EnvironmentalService = Depends(get_environmental_service),
    current_user: User = Depends(require_roles(["Admin"]))
):
    service.delete_factor(id)
    return APIResponse(success=True, message="Emission factor deleted successfully", data=None)

# --- CARBON TRANSACTIONS ---

@router.get(
    "/carbon",
    response_model=APIResponse[List[CarbonTransactionResponse]],
    summary="List all carbon transactions",
    description="Retrieve a detailed ledger of all logged sustainability transactions and footprint assessments."
)
async def list_carbon_transactions(
    service: EnvironmentalService = Depends(get_environmental_service),
    current_user: User = Depends(get_current_user)
):
    objs = service.get_all_transactions()
    data = [CarbonTransactionResponse.model_validate(o) for o in objs]
    return APIResponse(success=True, message="Carbon transactions retrieved successfully", data=data)

@router.post(
    "/carbon",
    response_model=APIResponse[CarbonTransactionResponse],
    status_code=status.HTTP_201_CREATED,
    summary="Log carbon transaction (Admin only)",
    description="Record a carbon transaction activity (such as travel, energy use, or waste) and auto-calculate CO2 impact."
)
async def create_carbon_transaction(
    payload: CarbonTransactionCreate,
    service: EnvironmentalService = Depends(get_environmental_service),
    current_user: User = Depends(require_roles(["Admin"]))
):
    obj = service.create_transaction(payload)
    return APIResponse(success=True, message="Carbon transaction logged successfully", data=CarbonTransactionResponse.model_validate(obj))

@router.put(
    "/carbon/{id}",
    response_model=APIResponse[CarbonTransactionResponse],
    summary="Update carbon transaction (Admin and Manager)",
    description="Modify a logged transaction details (recalculates emissions dynamically if quantity changes)."
)
async def update_carbon_transaction(
    id: UUID,
    payload: CarbonTransactionUpdate,
    service: EnvironmentalService = Depends(get_environmental_service),
    current_user: User = Depends(require_roles(["Admin", "Manager"]))
):
    obj = service.update_transaction(id, payload)
    return APIResponse(success=True, message="Carbon transaction updated successfully", data=CarbonTransactionResponse.model_validate(obj))

@router.delete(
    "/carbon/{id}",
    response_model=APIResponse[None],
    summary="Delete carbon transaction (Admin only)",
    description="Remove a carbon transaction ledger entry."
)
async def delete_carbon_transaction(
    id: UUID,
    service: EnvironmentalService = Depends(get_environmental_service),
    current_user: User = Depends(require_roles(["Admin"]))
):
    service.delete_transaction(id)
    return APIResponse(success=True, message="Carbon transaction deleted successfully", data=None)

# --- ENVIRONMENTAL GOALS ---

@router.get(
    "/goals",
    response_model=APIResponse[List[EnvironmentalGoalResponse]],
    summary="List all environmental goals",
    description="Retrieve all corporate carbon reduction goals, target milestones, and current accomplishment levels."
)
async def list_goals(
    service: EnvironmentalService = Depends(get_environmental_service),
    current_user: User = Depends(get_current_user)
):
    objs = service.get_all_goals()
    data = [EnvironmentalGoalResponse.model_validate(o) for o in objs]
    return APIResponse(success=True, message="Environmental goals retrieved successfully", data=data)

@router.post(
    "/goals",
    response_model=APIResponse[EnvironmentalGoalResponse],
    status_code=status.HTTP_201_CREATED,
    summary="Create environmental goal (Admin only)",
    description="Establish a new corporate reduction target, with unit milestones and deadlines."
)
async def create_goal(
    payload: EnvironmentalGoalCreate,
    service: EnvironmentalService = Depends(get_environmental_service),
    current_user: User = Depends(require_roles(["Admin"]))
):
    obj = service.create_goal(payload)
    return APIResponse(success=True, message="Environmental goal created successfully", data=EnvironmentalGoalResponse.model_validate(obj))

@router.put(
    "/goals/{id}",
    response_model=APIResponse[EnvironmentalGoalResponse],
    summary="Update environmental goal (Admin and Manager)",
    description="Modify a corporate target values, track current progress metrics, or update goal status."
)
async def update_goal(
    id: UUID,
    payload: EnvironmentalGoalUpdate,
    service: EnvironmentalService = Depends(get_environmental_service),
    current_user: User = Depends(require_roles(["Admin", "Manager"]))
):
    obj = service.update_goal(id, payload)
    return APIResponse(success=True, message="Environmental goal updated successfully", data=EnvironmentalGoalResponse.model_validate(obj))

@router.delete(
    "/goals/{id}",
    response_model=APIResponse[None],
    summary="Delete environmental goal (Admin only)",
    description="Delete a corporate target reduction goal."
)
async def delete_goal(
    id: UUID,
    service: EnvironmentalService = Depends(get_environmental_service),
    current_user: User = Depends(require_roles(["Admin"]))
):
    service.delete_goal(id)
    return APIResponse(success=True, message="Environmental goal deleted successfully", data=None)
