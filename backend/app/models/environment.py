from datetime import datetime, timezone
from typing import Optional
import uuid

class EmissionFactor:
    def __init__(
        self,
        category: str,
        factor: float,
        unit: str,
        description: Optional[str] = None,
        id: Optional[str] = None,
        created_at: Optional[datetime] = None
    ):
        self.id = id or f"fac-{uuid.uuid4().hex[:8]}"
        self.category = category
        self.factor = factor
        self.unit = unit
        self.description = description
        self.created_at = created_at or datetime.now(timezone.utc)

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "category": self.category,
            "factor": self.factor,
            "unit": self.unit,
            "description": self.description,
            "created_at": self.created_at
        }

    @classmethod
    def from_dict(cls, data: dict) -> 'EmissionFactor':
        return cls(
            id=data["id"],
            category=data["category"],
            factor=data["factor"],
            unit=data["unit"],
            description=data.get("description"),
            created_at=data.get("created_at")
        )


class CarbonTransaction:
    def __init__(
        self,
        department_id: str,
        emission_factor_id: str,
        activity_name: str,
        quantity: float,
        emission_value: float,
        created_by: str,
        id: Optional[str] = None,
        date: Optional[datetime] = None
    ):
        self.id = id or f"tx-{uuid.uuid4().hex[:8]}"
        self.department_id = department_id
        self.emission_factor_id = emission_factor_id
        self.activity_name = activity_name
        self.quantity = quantity
        self.emission_value = emission_value
        self.created_by = created_by
        self.date = date or datetime.now(timezone.utc)

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "department_id": self.department_id,
            "emission_factor_id": self.emission_factor_id,
            "activity_name": self.activity_name,
            "quantity": self.quantity,
            "emission_value": self.emission_value,
            "created_by": self.created_by,
            "date": self.date
        }

    @classmethod
    def from_dict(cls, data: dict) -> 'CarbonTransaction':
        return cls(
            id=data["id"],
            department_id=data["department_id"],
            emission_factor_id=data["emission_factor_id"],
            activity_name=data["activity_name"],
            quantity=data["quantity"],
            emission_value=data["emission_value"],
            created_by=data["created_by"],
            date=data.get("date")
        )


class EnvironmentalGoal:
    def __init__(
        self,
        title: str,
        target_value: float,
        current_value: float = 0.0,
        deadline: Optional[datetime] = None,
        status: str = "Active",
        id: Optional[str] = None
    ):
        self.id = id or f"goal-{uuid.uuid4().hex[:8]}"
        self.title = title
        self.target_value = target_value
        self.current_value = current_value
        self.deadline = deadline or datetime.now(timezone.utc)
        self.status = status  # "Active", "Achieved", "Failed"

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "title": self.title,
            "target_value": self.target_value,
            "current_value": self.current_value,
            "deadline": self.deadline,
            "status": self.status
        }

    @classmethod
    def from_dict(cls, data: dict) -> 'EnvironmentalGoal':
        return cls(
            id=data["id"],
            title=data["title"],
            target_value=data["target_value"],
            current_value=data.get("current_value", 0.0),
            deadline=data.get("deadline"),
            status=data.get("status", "Active")
        )
