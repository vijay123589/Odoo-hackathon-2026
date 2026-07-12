from typing import List
from uuid import UUID
from fastapi import HTTPException, status

from app.models.environmental import EmissionFactor, CarbonTransaction, EnvironmentalGoal
from app.repositories.environmental import EmissionFactorRepository, CarbonTransactionRepository, EnvironmentalGoalRepository
from app.schemas.environmental import (
    EmissionFactorCreate, EmissionFactorUpdate,
    CarbonTransactionCreate, CarbonTransactionUpdate,
    EnvironmentalGoalCreate, EnvironmentalGoalUpdate
)

class EnvironmentalService:
    def __init__(
        self,
        factor_repo: EmissionFactorRepository,
        transaction_repo: CarbonTransactionRepository,
        goal_repo: EnvironmentalGoalRepository
    ):
        self.factor_repo = factor_repo
        self.transaction_repo = transaction_repo
        self.goal_repo = goal_repo

    # --- EMISSION FACTORS ---
    def get_all_factors(self) -> List[EmissionFactor]:
        return self.factor_repo.get_all()

    def get_factor_by_id(self, id: UUID) -> EmissionFactor:
        obj = self.factor_repo.get_by_id(id)
        if not obj:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Emission factor not found")
        return obj

    def create_factor(self, data: EmissionFactorCreate) -> EmissionFactor:
        new_obj = EmissionFactor(
            activity_name=data.activity_name,
            category=data.category,
            factor_value=data.factor_value,
            unit=data.unit,
            description=data.description
        )
        return self.factor_repo.create(new_obj)

    def update_factor(self, id: UUID, data: EmissionFactorUpdate) -> EmissionFactor:
        self.get_factor_by_id(id)
        update_dict = data.model_dump(exclude_unset=True)
        return self.factor_repo.update(id, update_dict)

    def delete_factor(self, id: UUID) -> bool:
        self.get_factor_by_id(id)
        return self.factor_repo.delete(id)

    # --- CARBON TRANSACTIONS ---
    def get_all_transactions(self) -> List[CarbonTransaction]:
        return self.transaction_repo.get_all()

    def get_transaction_by_id(self, id: UUID) -> CarbonTransaction:
        obj = self.transaction_repo.get_by_id(id)
        if not obj:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Carbon transaction not found")
        return obj

    def create_transaction(self, data: CarbonTransactionCreate) -> CarbonTransaction:
        factor = self.factor_repo.get_by_id(data.emission_factor_id)
        if not factor:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid emission factor ID")
        
        # Calculate carbon emissions dynamically
        carbon_emission = data.quantity * factor.factor_value
        
        new_obj = CarbonTransaction(
            user_id=data.user_id,
            department_id=data.department_id,
            emission_factor_id=data.emission_factor_id,
            activity_name=data.activity_name,
            quantity=data.quantity,
            carbon_emission=carbon_emission,
            remarks=data.remarks
        )
        return self.transaction_repo.create(new_obj)

    def update_transaction(self, id: UUID, data: CarbonTransactionUpdate) -> CarbonTransaction:
        tx = self.get_transaction_by_id(id)
        update_dict = data.model_dump(exclude_unset=True)
        
        # If quantity or emission factor changed, recalculate emission value
        if "quantity" in update_dict or "emission_factor_id" in update_dict:
            qty = update_dict.get("quantity", tx.quantity)
            factor_id = update_dict.get("emission_factor_id", tx.emission_factor_id)
            factor = self.factor_repo.get_by_id(factor_id)
            if not factor:
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid emission factor ID")
            update_dict["carbon_emission"] = qty * factor.factor_value

        return self.transaction_repo.update(id, update_dict)

    def delete_transaction(self, id: UUID) -> bool:
        self.get_transaction_by_id(id)
        return self.transaction_repo.delete(id)

    # --- ENVIRONMENTAL GOALS ---
    def get_all_goals(self) -> List[EnvironmentalGoal]:
        return self.goal_repo.get_all()

    def get_goal_by_id(self, id: UUID) -> EnvironmentalGoal:
        obj = self.goal_repo.get_by_id(id)
        if not obj:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Environmental goal not found")
        return obj

    def create_goal(self, data: EnvironmentalGoalCreate) -> EnvironmentalGoal:
        status_val = "Completed" if data.current_value >= data.target_value else "In Progress"
        new_obj = EnvironmentalGoal(
            title=data.title,
            description=data.description,
            target_value=data.target_value,
            current_value=data.current_value,
            unit=data.unit,
            deadline=data.deadline,
            status=status_val
        )
        return self.goal_repo.create(new_obj)

    def update_goal(self, id: UUID, data: EnvironmentalGoalUpdate) -> EnvironmentalGoal:
        goal = self.get_goal_by_id(id)
        update_dict = data.model_dump(exclude_unset=True)
        
        # Recalculate status if current or target values are updated
        if "current_value" in update_dict or "target_value" in update_dict:
            curr = update_dict.get("current_value", goal.current_value)
            tgt = update_dict.get("target_value", goal.target_value)
            update_dict["status"] = "Completed" if curr >= tgt else "In Progress"

        return self.goal_repo.update(id, update_dict)

    def delete_goal(self, id: UUID) -> bool:
        self.get_goal_by_id(id)
        return self.goal_repo.delete(id)
