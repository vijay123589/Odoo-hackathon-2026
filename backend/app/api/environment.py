from fastapi import APIRouter, Depends, HTTPException, status
from typing import List, Dict, Any
from datetime import datetime, timezone
import uuid

from app.schemas.common import APIResponse
from app.schemas.environment import (
    EmissionFactorCreate, EmissionFactorUpdate, EmissionFactorResponse,
    CarbonTransactionCreate, CarbonTransactionUpdate, CarbonTransactionResponse,
    EnvironmentalGoalCreate, EnvironmentalGoalUpdate, EnvironmentalGoalResponse,
    CarbonCalculateRequest
)
from app.models.environment import EmissionFactor, CarbonTransaction, EnvironmentalGoal
from app.models.user import User
from app.dependencies import get_current_user
from app.database import (
    EMISSION_FACTORS_DB, CARBON_TRANSACTIONS_DB, ENVIRONMENTAL_GOALS_DB, DEPARTMENTS_DB,
    save_transaction_to_sqlite, delete_transaction_from_sqlite
)
from app.utils.calculator import calculate_environment_score

router = APIRouter(prefix="/environment", tags=["Environment"])


# Helper functions to convert DB dicts to schema models
def map_factor_to_response(fac: dict) -> EmissionFactorResponse:
    return EmissionFactorResponse(
        id=fac["id"],
        category=fac["category"],
        factor=fac["factor"],
        unit=fac["unit"],
        description=fac.get("description"),
        created_at=fac["created_at"]
    )

def map_transaction_to_response(tx: dict) -> CarbonTransactionResponse:
    return CarbonTransactionResponse(
        id=tx["id"],
        department_id=tx["department_id"],
        emission_factor_id=tx["emission_factor_id"],
        activity_name=tx["activity_name"],
        quantity=tx["quantity"],
        emission_value=tx["emission_value"],
        created_by=tx["created_by"],
        date=tx["date"]
    )

def map_goal_to_response(goal: dict) -> EnvironmentalGoalResponse:
    return EnvironmentalGoalResponse(
        id=goal["id"],
        title=goal["title"],
        target_value=goal["target_value"],
        current_value=goal.get("current_value", 0.0),
        deadline=goal["deadline"],
        status=goal.get("status", "Active")
    )


# --- Emission Factors Endpoints ---

@router.get("/factors", response_model=APIResponse[List[EmissionFactorResponse]])
async def get_factors(current_user: User = Depends(get_current_user)):
    data = [map_factor_to_response(f) for f in EMISSION_FACTORS_DB.values()]
    return APIResponse(
        success=True,
        message="Emission factors retrieved successfully",
        data=data
    )

@router.post("/factors", response_model=APIResponse[EmissionFactorResponse], status_code=status.HTTP_201_CREATED)
async def create_factor(factor_in: EmissionFactorCreate, current_user: User = Depends(get_current_user)):
    # Check if category already exists
    for f in EMISSION_FACTORS_DB.values():
        if f["category"].lower() == factor_in.category.lower():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Emission factor category '{factor_in.category}' already exists."
            )
    
    new_factor = EmissionFactor(
        category=factor_in.category,
        factor=factor_in.factor,
        unit=factor_in.unit,
        description=factor_in.description
    )
    EMISSION_FACTORS_DB[new_factor.id] = new_factor.to_dict()
    return APIResponse(
        success=True,
        message="Emission factor created successfully",
        data=map_factor_to_response(EMISSION_FACTORS_DB[new_factor.id])
    )

@router.put("/factors/{id}", response_model=APIResponse[EmissionFactorResponse])
async def update_factor(id: str, factor_in: EmissionFactorUpdate, current_user: User = Depends(get_current_user)):
    if id not in EMISSION_FACTORS_DB:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Emission factor with ID {id} not found."
        )
    
    fac = EMISSION_FACTORS_DB[id]
    update_data = factor_in.model_dump(exclude_unset=True) if hasattr(factor_in, 'model_dump') else factor_in.dict(exclude_unset=True)
    
    for field, value in update_data.items():
        fac[field] = value
    
    EMISSION_FACTORS_DB[id] = fac
    return APIResponse(
        success=True,
        message="Emission factor updated successfully",
        data=map_factor_to_response(fac)
    )

@router.delete("/factors/{id}", response_model=APIResponse[None])
async def delete_factor(id: str, current_user: User = Depends(get_current_user)):
    if id not in EMISSION_FACTORS_DB:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Emission factor with ID {id} not found."
        )
    del EMISSION_FACTORS_DB[id]
    return APIResponse(
        success=True,
        message="Emission factor deleted successfully",
        data=None
    )


# --- Carbon Transactions Endpoints ---

@router.post("/calculate")
async def calculate_carbon(req: CarbonCalculateRequest, current_user: User = Depends(get_current_user)):
    activity_map = {
        'electricity': 'Electricity',
        'diesel': 'Diesel',
        'flights': 'Flight',
        'natural_gas': 'Natural Gas'
    }
    category = activity_map.get(req.activityType, 'Electricity')
    
    factor = 0.000409
    for f in EMISSION_FACTORS_DB.values():
        if f["category"].lower() == category.lower():
            factor = f["factor"]
            break
            
    co2e = round(req.value * factor, 4)
    
    return {
        "provider": "Local EcoSphere",
        "input": req.model_dump(),
        "emissionFactor": factor,
        "co2eValue": co2e,
        "confidence": "MEDIUM",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "note": "Operating in Local Carbon Intelligence Mode."
    }

@router.get("/carbon", response_model=APIResponse[List[CarbonTransactionResponse]])
async def get_transactions(current_user: User = Depends(get_current_user)):
    data = [map_transaction_to_response(t) for t in CARBON_TRANSACTIONS_DB.values()]
    return APIResponse(
        success=True,
        message="Carbon transactions retrieved successfully",
        data=data
    )

@router.post("/carbon", response_model=APIResponse[CarbonTransactionResponse], status_code=status.HTTP_201_CREATED)
async def create_transaction(tx_in: CarbonTransactionCreate, current_user: User = Depends(get_current_user)):
    # 1. Fetch factor
    factor = EMISSION_FACTORS_DB.get(tx_in.emission_factor_id)
    if not factor:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Emission factor with ID {tx_in.emission_factor_id} does not exist."
        )
        
    # 2. Check department
    if tx_in.department_id not in DEPARTMENTS_DB:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Department with ID {tx_in.department_id} does not exist."
        )

    # 3. Calculate emissions
    emission_val = tx_in.quantity * factor["factor"]

    # 4. Create record
    new_tx = CarbonTransaction(
        department_id=tx_in.department_id,
        emission_factor_id=tx_in.emission_factor_id,
        activity_name=tx_in.activity_name,
        quantity=tx_in.quantity,
        emission_value=emission_val,
        created_by=current_user.email
    )
    CARBON_TRANSACTIONS_DB[new_tx.id] = new_tx.to_dict()
    save_transaction_to_sqlite(new_tx.to_dict())
    return APIResponse(
        success=True,
        message="Carbon transaction logged successfully",
        data=map_transaction_to_response(CARBON_TRANSACTIONS_DB[new_tx.id])
    )

@router.put("/carbon/{id}", response_model=APIResponse[CarbonTransactionResponse])
async def update_transaction(id: str, tx_in: CarbonTransactionUpdate, current_user: User = Depends(get_current_user)):
    if id not in CARBON_TRANSACTIONS_DB:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Carbon transaction with ID {id} not found."
        )
        
    tx = CARBON_TRANSACTIONS_DB[id]
    update_data = tx_in.model_dump(exclude_unset=True) if hasattr(tx_in, 'model_dump') else tx_in.dict(exclude_unset=True)
    
    qty_changed = "quantity" in update_data and update_data["quantity"] != tx["quantity"]
    factor_changed = "emission_factor_id" in update_data and update_data["emission_factor_id"] != tx["emission_factor_id"]
    
    if qty_changed or factor_changed:
        fac_id = update_data.get("emission_factor_id", tx["emission_factor_id"])
        factor = EMISSION_FACTORS_DB.get(fac_id)
        if not factor:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Emission factor with ID {fac_id} does not exist."
            )
        qty = update_data.get("quantity", tx["quantity"])
        tx["emission_value"] = qty * factor["factor"]

    for field, value in update_data.items():
        tx[field] = value

    CARBON_TRANSACTIONS_DB[id] = tx
    save_transaction_to_sqlite(tx)
    return APIResponse(
        success=True,
        message="Carbon transaction updated successfully",
        data=map_transaction_to_response(tx)
    )

@router.delete("/carbon/{id}", response_model=APIResponse[None])
async def delete_transaction(id: str, current_user: User = Depends(get_current_user)):
    if id not in CARBON_TRANSACTIONS_DB:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Carbon transaction with ID {id} not found."
        )
    del CARBON_TRANSACTIONS_DB[id]
    delete_transaction_from_sqlite(id)
    return APIResponse(
        success=True,
        message="Carbon transaction deleted successfully",
        data=None
    )


# --- Sustainability Goals Endpoints ---

@router.get("/goals", response_model=APIResponse[List[EnvironmentalGoalResponse]])
async def get_goals(current_user: User = Depends(get_current_user)):
    data = [map_goal_to_response(g) for g in ENVIRONMENTAL_GOALS_DB.values()]
    return APIResponse(
        success=True,
        message="Sustainability goals retrieved successfully",
        data=data
    )

@router.post("/goals", response_model=APIResponse[EnvironmentalGoalResponse], status_code=status.HTTP_201_CREATED)
async def create_goal(goal_in: EnvironmentalGoalCreate, current_user: User = Depends(get_current_user)):
    new_goal = EnvironmentalGoal(
        title=goal_in.title,
        target_value=goal_in.target_value,
        deadline=goal_in.deadline
    )
    ENVIRONMENTAL_GOALS_DB[new_goal.id] = new_goal.to_dict()
    return APIResponse(
        success=True,
        message="Sustainability goal created successfully",
        data=map_goal_to_response(ENVIRONMENTAL_GOALS_DB[new_goal.id])
    )

@router.patch("/goals/{id}", response_model=APIResponse[EnvironmentalGoalResponse])
async def update_goal(id: str, goal_in: EnvironmentalGoalUpdate, current_user: User = Depends(get_current_user)):
    if id not in ENVIRONMENTAL_GOALS_DB:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Sustainability goal with ID {id} not found."
        )
        
    goal = ENVIRONMENTAL_GOALS_DB[id]
    update_data = goal_in.model_dump(exclude_unset=True) if hasattr(goal_in, 'model_dump') else goal_in.dict(exclude_unset=True)
    
    for field, value in update_data.items():
        goal[field] = value
        
    ENVIRONMENTAL_GOALS_DB[id] = goal
    return APIResponse(
        success=True,
        message="Sustainability goal updated successfully",
        data=map_goal_to_response(goal)
    )

@router.delete("/goals/{id}", response_model=APIResponse[None])
async def delete_goal(id: str, current_user: User = Depends(get_current_user)):
    if id not in ENVIRONMENTAL_GOALS_DB:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Sustainability goal with ID {id} not found."
        )
    del ENVIRONMENTAL_GOALS_DB[id]
    return APIResponse(
        success=True,
        message="Sustainability goal deleted successfully",
        data=None
    )


# --- Custom Aggregate Dashboard & Report Endpoints ---

@router.get("/dashboard", response_model=APIResponse[Dict[str, Any]])
async def get_dashboard(current_user: User = Depends(get_current_user)):
    # 1. Total carbon emissions sum
    total_emission = sum(tx["emission_value"] for tx in CARBON_TRANSACTIONS_DB.values())

    # 2. Goal achievement progress
    total_goals = len(ENVIRONMENTAL_GOALS_DB)
    achieved_goals = sum(1 for g in ENVIRONMENTAL_GOALS_DB.values() if g.get("status") == "Achieved")
    goal_progress = int((achieved_goals / total_goals) * 100) if total_goals > 0 else 0

    # 3. Monthly breakdown
    monthly_map = {}
    for tx in CARBON_TRANSACTIONS_DB.values():
        date_obj = tx["date"]
        # Format date depending on type
        month_key = date_obj.strftime("%Y-%m") if isinstance(date_obj, datetime) else date_obj[:7]
        monthly_map[month_key] = monthly_map.get(month_key, 0.0) + tx["emission_value"]
        
    monthly_emissions_list = [
        {"month": month, "emission": round(val, 2)}
        for month, val in sorted(monthly_map.items())
    ]

    # 4. Top department (highest emission)
    dept_map = {}
    for tx in CARBON_TRANSACTIONS_DB.values():
        dept_id = tx["department_id"]
        dept_map[dept_id] = dept_map.get(dept_id, 0.0) + tx["emission_value"]
        
    top_dept_name = "N/A"
    if dept_map:
        top_dept_id = max(dept_map, key=dept_map.get)
        dept_obj = DEPARTMENTS_DB.get(top_dept_id)
        top_dept_name = dept_obj["name"] if dept_obj else top_dept_id

    # 5. ESG Environmental Score
    score = calculate_environment_score()

    return APIResponse(
        success=True,
        message="Environmental dashboard summary generated",
        data={
            "total_emission": round(total_emission, 2),
            "goal_progress": goal_progress,
            "monthly_emission": monthly_emissions_list,
            "top_department": top_dept_name,
            "environment_score": round(score, 1)
        }
    )

@router.get("/report", response_model=APIResponse[Dict[str, Any]])
async def get_report(current_user: User = Depends(get_current_user)):
    # 1. Total emissions
    total_emission = sum(tx["emission_value"] for tx in CARBON_TRANSACTIONS_DB.values())

    # 2. Emissions summary by department
    dept_map = {}
    for tx in CARBON_TRANSACTIONS_DB.values():
        dept_id = tx["department_id"]
        dept_obj = DEPARTMENTS_DB.get(dept_id)
        dept_name = dept_obj["name"] if dept_obj else dept_id
        dept_map[dept_name] = dept_map.get(dept_name, 0.0) + tx["emission_value"]
    dept_map_rounded = {dept: round(val, 2) for dept, val in dept_map.items()}

    # 3. Highest department
    highest_department = max(dept_map, key=dept_map.get) if dept_map else "N/A"

    # 4. Monthly trends
    monthly_map = {}
    for tx in CARBON_TRANSACTIONS_DB.values():
        date_obj = tx["date"]
        month_key = date_obj.strftime("%Y-%m") if isinstance(date_obj, datetime) else date_obj[:7]
        monthly_map[month_key] = monthly_map.get(month_key, 0.0) + tx["emission_value"]
    monthly_trends = {m: round(v, 2) for m, v in sorted(monthly_map.items())}

    # 5. List of active goals
    active_goals = [
        {
            "id": g["id"],
            "title": g["title"],
            "target_value": g["target_value"],
            "current_value": g["current_value"],
            "deadline": g["deadline"].isoformat() if isinstance(g["deadline"], datetime) else g["deadline"],
            "status": g["status"]
        }
        for g in ENVIRONMENTAL_GOALS_DB.values()
        if g.get("status") == "Active"
    ]

    # 6. ESG Environmental Score
    score = calculate_environment_score()

    return APIResponse(
        success=True,
        message="Environmental report compiled successfully",
        data={
            "total_emissions": round(total_emission, 2),
            "highest_department": highest_department,
            "monthly_trends": monthly_trends,
            "active_goals": active_goals,
            "emissions_summary": dept_map_rounded,
            "environment_score": round(score, 1)
        }
    )
