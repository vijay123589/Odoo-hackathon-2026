from typing import List
from uuid import UUID
from fastapi import HTTPException, status

from app.models.gamification import Challenge, ChallengeParticipation, Badge, EmployeeBadge, Reward, RewardRedemption
from app.repositories.gamification import (
    ChallengeRepository, ChallengeParticipationRepository,
    BadgeRepository, EmployeeBadgeRepository,
    RewardRepository, RewardRedemptionRepository
)
from app.schemas.gamification import (
    ChallengeCreate, ChallengeUpdate,
    ChallengeParticipationCreate, ChallengeParticipationUpdate,
    BadgeCreate, BadgeUpdate,
    EmployeeBadgeCreate,
    RewardCreate, RewardUpdate,
    RewardRedemptionCreate
)

class GamificationService:
    def __init__(
        self,
        challenge_repo: ChallengeRepository,
        part_repo: ChallengeParticipationRepository,
        badge_repo: BadgeRepository,
        emp_badge_repo: EmployeeBadgeRepository,
        reward_repo: RewardRepository,
        redemption_repo: RewardRedemptionRepository
    ):
        self.challenge_repo = challenge_repo
        self.part_repo = part_repo
        self.badge_repo = badge_repo
        self.emp_badge_repo = emp_badge_repo
        self.reward_repo = reward_repo
        self.redemption_repo = redemption_repo

    # --- CHALLENGES ---
    def get_all_challenges(self) -> List[Challenge]:
        return self.challenge_repo.get_all()

    def get_challenge_by_id(self, id: UUID) -> Challenge:
        obj = self.challenge_repo.get_by_id(id)
        if not obj:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Challenge not found")
        return obj

    def create_challenge(self, data: ChallengeCreate) -> Challenge:
        new_obj = Challenge(
            title=data.title,
            description=data.description,
            points=data.points,
            difficulty=data.difficulty,
            deadline=data.deadline
        )
        return self.challenge_repo.create(new_obj)

    def update_challenge(self, id: UUID, data: ChallengeUpdate) -> Challenge:
        self.get_challenge_by_id(id)
        update_dict = data.model_dump(exclude_unset=True)
        return self.challenge_repo.update(id, update_dict)

    def delete_challenge(self, id: UUID) -> bool:
        self.get_challenge_by_id(id)
        return self.challenge_repo.delete(id)

    # --- CHALLENGE PARTICIPATIONS ---
    def get_all_participations(self) -> List[ChallengeParticipation]:
        return self.part_repo.get_all()

    def get_participation_by_id(self, id: UUID) -> ChallengeParticipation:
        obj = self.part_repo.get_by_id(id)
        if not obj:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Participation not found")
        return obj

    def join_challenge(self, data: ChallengeParticipationCreate) -> ChallengeParticipation:
        # Check challenge exists
        challenge = self.challenge_repo.get_by_id(data.challenge_id)
        if not challenge:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid challenge ID")

        # Prevent duplicate entries
        existing = self.part_repo.get_by_challenge_and_employee(data.challenge_id, data.employee_id)
        if existing:
            return existing

        new_obj = ChallengeParticipation(
            challenge_id=data.challenge_id,
            employee_id=data.employee_id,
            progress=0.0,
            completed=False,
            points_awarded=0
        )
        return self.part_repo.create(new_obj)

    def update_participation(self, id: UUID, data: ChallengeParticipationUpdate) -> ChallengeParticipation:
        part = self.get_participation_by_id(id)
        update_dict = data.model_dump(exclude_unset=True)

        # Trigger points award on completion
        if "completed" in update_dict:
            comp_status = update_dict["completed"]
            challenge = self.challenge_repo.get_by_id(part.challenge_id)
            if comp_status:
                update_dict["points_awarded"] = challenge.points if challenge else 0
                update_dict["progress"] = 100.0
            else:
                update_dict["points_awarded"] = 0

        # Enforce progress completion mapping
        if "progress" in update_dict and update_dict["progress"] >= 100.0:
            challenge = self.challenge_repo.get_by_id(part.challenge_id)
            update_dict["completed"] = True
            update_dict["points_awarded"] = challenge.points if challenge else 0

        return self.part_repo.update(id, update_dict)

    def delete_participation(self, id: UUID) -> bool:
        self.get_participation_by_id(id)
        return self.part_repo.delete(id)

    # --- BADGES ---
    def get_all_badges(self) -> List[Badge]:
        return self.badge_repo.get_all()

    def get_badge_by_id(self, id: UUID) -> Badge:
        obj = self.badge_repo.get_by_id(id)
        if not obj:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Badge not found")
        return obj

    def create_badge(self, data: BadgeCreate) -> Badge:
        new_obj = Badge(
            name=data.name,
            description=data.description,
            icon=data.icon,
            required_points=data.required_points
        )
        return self.badge_repo.create(new_obj)

    def update_badge(self, id: UUID, data: BadgeUpdate) -> Badge:
        self.get_badge_by_id(id)
        update_dict = data.model_dump(exclude_unset=True)
        return self.badge_repo.update(id, update_dict)

    def delete_badge(self, id: UUID) -> bool:
        self.get_badge_by_id(id)
        return self.badge_repo.delete(id)

    # --- EMPLOYEE BADGES ---
    def get_all_employee_badges(self) -> List[EmployeeBadge]:
        return self.emp_badge_repo.get_all()

    def award_badge(self, data: EmployeeBadgeCreate) -> EmployeeBadge:
        # Check badge exists
        badge = self.badge_repo.get_by_id(data.badge_id)
        if not badge:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid badge ID")

        # Prevent duplicate badge allocations
        existing = self.emp_badge_repo.get_by_ids(data.employee_id, data.badge_id)
        if existing:
            return existing

        new_obj = EmployeeBadge(
            employee_id=data.employee_id,
            badge_id=data.badge_id
        )
        return self.emp_badge_repo.create(new_obj)

    # --- REWARDS ---
    def get_all_rewards(self) -> List[Reward]:
        return self.reward_repo.get_all()

    def get_reward_by_id(self, id: UUID) -> Reward:
        obj = self.reward_repo.get_by_id(id)
        if not obj:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Reward item not found")
        return obj

    def create_reward(self, data: RewardCreate) -> Reward:
        new_obj = Reward(
            name=data.name,
            description=data.description,
            points_required=data.points_required,
            stock=data.stock
        )
        return self.reward_repo.create(new_obj)

    def update_reward(self, id: UUID, data: RewardUpdate) -> Reward:
        self.get_reward_by_id(id)
        update_dict = data.model_dump(exclude_unset=True)
        return self.reward_repo.update(id, update_dict)

    def delete_reward(self, id: UUID) -> bool:
        self.get_reward_by_id(id)
        return self.reward_repo.delete(id)

    # --- REWARD REDEMPTIONS ---
    def get_all_redemptions(self) -> List[RewardRedemption]:
        return self.redemption_repo.get_all()

    def redeem_reward(self, data: RewardRedemptionCreate) -> RewardRedemption:
        # Check reward exists and is in stock
        reward = self.reward_repo.get_by_id(data.reward_id)
        if not reward:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid reward ID")
        if reward.stock <= 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, 
                detail="Reward out of stock"
            )

        # Deduct stock in database
        self.reward_repo.update(reward.id, {"stock": reward.stock - 1})

        new_obj = RewardRedemption(
            employee_id=data.employee_id,
            reward_id=data.reward_id
        )
        return self.redemption_repo.create(new_obj)
