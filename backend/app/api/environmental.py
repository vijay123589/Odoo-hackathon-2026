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


# --- ADDITIONAL AGGREGATE & CALCULATOR ENDPOINTS ---

from pydantic import BaseModel
from typing import Optional, Dict, Any
from app.utils.calculator import calculate_environment_score
from app.models.environmental import CarbonTransaction, EnvironmentalGoal, EmissionFactor
from app.models.department import DepartmentORM

class CalculatePayload(BaseModel):
    activityType: str
    value: float
    unit: str
    region: Optional[str] = "US"

@router.post("/calculate", summary="Stateless carbon calculation (Vijay's frontend specifications)")
async def calculate_carbon_estimate(
    payload: CalculatePayload,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Try finding factor in SQLite DB
    factor_orm = db.query(EmissionFactor).filter(
        EmissionFactor.category == payload.activityType.lower()
    ).first()
    
    if factor_orm:
        factor_val = factor_orm.factor_value
        provider = "Local EcoSphere DB"
    else:
        # Fallback to hardcoded local multipliers matching Vijay's engine
        local_fallbacks = {
            "electricity": 0.000409,
            "diesel": 0.00263,
            "petrol": 0.00231,
            "natural_gas": 0.00189,
            "flights": 0.00018,
            "train": 0.000041,
            "bus": 0.000096,
            "shipping": 0.000161,
            "waste": 0.450,
            "water": 0.000298,
            "paper": 0.000919,
            "plastic": 0.00196
        }
        factor_val = local_fallbacks.get(payload.activityType.lower(), 0.000409)
        provider = "Local EcoSphere Fallback"
        
    co2e_value = float(payload.value * factor_val)
    
    return {
        "provider": provider,
        "input": {
            "activityType": payload.activityType,
            "value": payload.value,
            "unit": payload.unit,
            "region": payload.region
        },
        "emissionFactor": factor_val,
        "co2eValue": round(co2e_value, 4),
        "confidence": "HIGH" if factor_orm else "MEDIUM",
        "timestamp": datetime.now(timezone.utc).isoformat() if hasattr(datetime, 'now') else datetime.utcnow().isoformat()
    }


@router.get("/dashboard", response_model=APIResponse[Dict[str, Any]], summary="Environmental Dashboard Aggregations")
async def get_dashboard_summary(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    txs = db.query(CarbonTransaction).all()
    total_emission = sum(t.carbon_emission for t in txs)

    # Goals completed vs total
    goals = db.query(EnvironmentalGoal).all()
    total_goals = len(goals)
    completed_goals = sum(1 for g in goals if g.status == "Completed")
    goal_progress = int((completed_goals / total_goals) * 100) if total_goals > 0 else 0

    # Monthly groupings
    monthly_map = {}
    for t in txs:
        m_key = t.transaction_date.strftime("%Y-%m")
        monthly_map[m_key] = monthly_map.get(m_key, 0.0) + t.carbon_emission
        
    monthly_list = [
        {"month": m, "emission": round(v, 4)}
        for m, v in sorted(monthly_map.items())
    ]

    # Top department
    dept_map = {}
    for t in txs:
        dept_map[t.department_id] = dept_map.get(t.department_id, 0.0) + t.carbon_emission
        
    top_dept_name = "N/A"
    if dept_map:
        top_dept_id = max(dept_map, key=dept_map.get)
        dep_obj = db.query(DepartmentORM).filter(DepartmentORM.id == top_dept_id).first()
        top_dept_name = dep_obj.name if dep_obj else str(top_dept_id)

    # Dynamic ESG Environmental Score
    score = calculate_environment_score(db)

    return APIResponse(
        success=True,
        message="Environmental dashboard summary generated",
        data={
            "total_emission": round(total_emission, 4),
            "goal_progress": goal_progress,
            "monthly_emission": monthly_list,
            "top_department": top_dept_name,
            "environment_score": round(score, 1)
        }
    )


@router.get("/report", response_model=APIResponse[Dict[str, Any]], summary="Environmental Report Breakdown")
async def get_report_breakdown(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    txs = db.query(CarbonTransaction).all()
    total_emission = sum(t.carbon_emission for t in txs)

    dept_map = {}
    for t in txs:
        dept_map[t.department_id] = dept_map.get(t.department_id, 0.0) + t.carbon_emission
        
    emissions_summary = {}
    for d_id, val in dept_map.items():
        dep_obj = db.query(DepartmentORM).filter(DepartmentORM.id == d_id).first()
        name = dep_obj.name if dep_obj else str(d_id)
        emissions_summary[name] = round(val, 4)
        
    highest_dept = max(emissions_summary, key=emissions_summary.get) if emissions_summary else "N/A"

    monthly_map = {}
    for t in txs:
        m_key = t.transaction_date.strftime("%Y-%m")
        monthly_map[m_key] = monthly_map.get(m_key, 0.0) + t.carbon_emission
        
    monthly_trends = {m: round(v, 4) for m, v in sorted(monthly_map.items())}

    active_goals = [
        {
            "id": str(g.id),
            "title": g.title,
            "description": g.description,
            "target_value": g.target_value,
            "current_value": g.current_value,
            "unit": g.unit,
            "deadline": g.deadline.isoformat(),
            "status": g.status
        }
        for g in db.query(EnvironmentalGoal).filter(EnvironmentalGoal.status == "In Progress").all()
    ]

    score = calculate_environment_score(db)

    return APIResponse(
        success=True,
        message="Environmental report compiled successfully",
        data={
            "total_emissions": round(total_emission, 4),
            "highest_department": highest_dept,
            "monthly_trends": monthly_trends,
            "active_goals": active_goals,
            "emissions_summary": emissions_summary,
            "environment_score": round(score, 1)
        }
    )

