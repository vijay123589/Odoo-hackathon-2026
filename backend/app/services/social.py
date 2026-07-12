from typing import List
from uuid import UUID
from fastapi import HTTPException, status

from app.models.social import CSRActivity, EmployeeParticipation
from app.repositories.social import CSRActivityRepository, EmployeeParticipationRepository
from app.schemas.social import (
    CSRActivityCreate, CSRActivityUpdate,
    EmployeeParticipationCreate, EmployeeParticipationUpdate
)

class SocialService:
    def __init__(
        self,
        activity_repo: CSRActivityRepository,
        participation_repo: EmployeeParticipationRepository
    ):
        self.activity_repo = activity_repo
        self.participation_repo = participation_repo

    # --- CSR ACTIVITIES ---
    def get_all_activities(self) -> List[CSRActivity]:
        return self.activity_repo.get_all()

    def get_activity_by_id(self, id: UUID) -> CSRActivity:
        obj = self.activity_repo.get_by_id(id)
        if not obj:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="CSR Activity not found")
        return obj

    def create_activity(self, data: CSRActivityCreate) -> CSRActivity:
        new_obj = CSRActivity(
            title=data.title,
            description=data.description,
            location=data.location,
            activity_date=data.activity_date,
            max_points=data.max_points
        )
        return self.activity_repo.create(new_obj)

    def update_activity(self, id: UUID, data: CSRActivityUpdate) -> CSRActivity:
        self.get_activity_by_id(id)
        update_dict = data.model_dump(exclude_unset=True)
        return self.activity_repo.update(id, update_dict)

    def delete_activity(self, id: UUID) -> bool:
        self.get_activity_by_id(id)
        return self.activity_repo.delete(id)

    # --- EMPLOYEE PARTICIPATIONS ---
    def get_all_participations(self) -> List[EmployeeParticipation]:
        return self.participation_repo.get_all()

    def get_participation_by_id(self, id: UUID) -> EmployeeParticipation:
        obj = self.participation_repo.get_by_id(id)
        if not obj:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Employee participation not found")
        return obj

    def create_participation(self, data: EmployeeParticipationCreate) -> EmployeeParticipation:
        activity = self.activity_repo.get_by_id(data.activity_id)
        if not activity:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid CSR activity ID")

        new_obj = EmployeeParticipation(
            employee_id=data.employee_id,
            activity_id=data.activity_id,
            proof_url=data.proof_url,
            approval_status="Pending",
            points_earned=0
        )
        return self.participation_repo.create(new_obj)

    def update_participation(self, id: UUID, data: EmployeeParticipationUpdate) -> EmployeeParticipation:
        part = self.get_participation_by_id(id)
        update_dict = data.model_dump(exclude_unset=True)

        # Trigger points calculation if approval status is updated
        if "approval_status" in update_dict:
            status_val = update_dict["approval_status"]
            activity = self.activity_repo.get_by_id(part.activity_id)
            if status_val == "Approved":
                update_dict["points_earned"] = activity.max_points if activity else 0
            else:
                update_dict["points_earned"] = 0

        return self.participation_repo.update(id, update_dict)

    def delete_participation(self, id: UUID) -> bool:
        self.get_participation_by_id(id)
        return self.participation_repo.delete(id)
