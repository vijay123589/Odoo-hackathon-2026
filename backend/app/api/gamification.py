from fastapi import APIRouter, Depends, status
from typing import List
from uuid import UUID

from app.schemas.common import APIResponse
from app.schemas.gamification import (
    ChallengeCreate, ChallengeUpdate, ChallengeResponse,
    ChallengeParticipationCreate, ChallengeParticipationUpdate, ChallengeParticipationResponse,
    BadgeCreate, BadgeUpdate, BadgeResponse,
    EmployeeBadgeCreate, EmployeeBadgeResponse,
    RewardCreate, RewardUpdate, RewardResponse,
    RewardRedemptionCreate, RewardRedemptionResponse
)
from app.services.gamification import GamificationService
from app.dependencies import require_roles, get_current_user
from app.repositories.gamification import (
    ChallengeRepository, ChallengeParticipationRepository,
    BadgeRepository, EmployeeBadgeRepository,
    RewardRepository, RewardRedemptionRepository
)
from app.database import get_db
from sqlalchemy.orm import Session
from app.models.user import User

router = APIRouter(prefix="/gamification", tags=["Gamification"])

def get_gamification_service(db: Session = Depends(get_db)) -> GamificationService:
    return GamificationService(
        challenge_repo=ChallengeRepository(db),
        part_repo=ChallengeParticipationRepository(db),
        badge_repo=BadgeRepository(db),
        emp_badge_repo=EmployeeBadgeRepository(db),
        reward_repo=RewardRepository(db),
        redemption_repo=RewardRedemptionRepository(db)
    )

# --- CHALLENGES ---

@router.get(
    "/challenges",
    response_model=APIResponse[List[ChallengeResponse]],
    summary="List all challenges",
    description="Retrieve all green challenges, deadlines, and points multipliers."
)
async def list_challenges(
    service: GamificationService = Depends(get_gamification_service),
    current_user: User = Depends(get_current_user)
):
    objs = service.get_all_challenges()
    data = [ChallengeResponse.model_validate(o) for o in objs]
    return APIResponse(success=True, message="Challenges retrieved successfully", data=data)

@router.post(
    "/challenges",
    response_model=APIResponse[ChallengeResponse],
    status_code=status.HTTP_201_CREATED,
    summary="Create challenge (Admin only)",
    description="Create a new green action challenge with target deadlines and point values."
)
async def create_challenge(
    payload: ChallengeCreate,
    service: GamificationService = Depends(get_gamification_service),
    current_user: User = Depends(require_roles(["Admin"]))
):
    obj = service.create_challenge(payload)
    return APIResponse(success=True, message="Challenge created successfully", data=ChallengeResponse.model_validate(obj))

@router.put(
    "/challenges/{id}",
    response_model=APIResponse[ChallengeResponse],
    summary="Update challenge (Admin and Manager)",
    description="Modify a challenge title, deadline, points, or update active status."
)
async def update_challenge(
    id: UUID,
    payload: ChallengeUpdate,
    service: GamificationService = Depends(get_gamification_service),
    current_user: User = Depends(require_roles(["Admin", "Manager"]))
):
    obj = service.update_challenge(id, payload)
    return APIResponse(success=True, message="Challenge updated successfully", data=ChallengeResponse.model_validate(obj))

@router.delete(
    "/challenges/{id}",
    response_model=APIResponse[None],
    summary="Delete challenge (Admin only)",
    description="Cancel and delete a challenge from logs."
)
async def delete_challenge(
    id: UUID,
    service: GamificationService = Depends(get_gamification_service),
    current_user: User = Depends(require_roles(["Admin"]))
):
    service.delete_challenge(id)
    return APIResponse(success=True, message="Challenge deleted successfully", data=None)

# --- CHALLENGE PARTICIPATIONS ---

@router.get(
    "/challenges/participation",
    response_model=APIResponse[List[ChallengeParticipationResponse]],
    summary="List participations",
    description="Retrieve all employee challenge registrations and progress levels."
)
async def list_challenge_participations(
    service: GamificationService = Depends(get_gamification_service),
    current_user: User = Depends(get_current_user)
):
    objs = service.get_all_participations()
    data = [ChallengeParticipationResponse.model_validate(o) for o in objs]
    return APIResponse(success=True, message="Participation logs retrieved successfully", data=data)

@router.post(
    "/challenges/join",
    response_model=APIResponse[ChallengeParticipationResponse],
    status_code=status.HTTP_201_CREATED,
    summary="Join challenge (Logged-in User)",
    description="Register the logged-in employee as a participant in a challenge."
)
async def join_challenge(
    payload: ChallengeParticipationCreate,
    service: GamificationService = Depends(get_gamification_service),
    current_user: User = Depends(get_current_user)
):
    # Enforce registering the current user if not Admin
    if current_user.role != "Admin" and current_user.id != str(payload.employee_id):
        payload.employee_id = UUID(current_user.id)

    obj = service.join_challenge(payload)
    return APIResponse(success=True, message="Successfully joined the challenge", data=ChallengeParticipationResponse.model_validate(obj))

@router.put(
    "/challenges/participation/{id}",
    response_model=APIResponse[ChallengeParticipationResponse],
    summary="Update progress (Admin and Manager)",
    description="Update challenge progress percentage (0-100%). Hits completion and awards points automatically if progress is 100%."
)
async def update_challenge_participation(
    id: UUID,
    payload: ChallengeParticipationUpdate,
    service: GamificationService = Depends(get_gamification_service),
    current_user: User = Depends(require_roles(["Admin", "Manager"]))
):
    obj = service.update_participation(id, payload)
    return APIResponse(success=True, message="Challenge progress updated successfully", data=ChallengeParticipationResponse.model_validate(obj))

# --- BADGES ---

@router.get(
    "/badges",
    response_model=APIResponse[List[BadgeResponse]],
    summary="List all badges",
    description="Retrieve all awards and badge definitions in the gamification system."
)
async def list_badges(
    service: GamificationService = Depends(get_gamification_service),
    current_user: User = Depends(get_current_user)
):
    objs = service.get_all_badges()
    data = [BadgeResponse.model_validate(o) for o in objs]
    return APIResponse(success=True, message="Badges retrieved successfully", data=data)

@router.post(
    "/badges",
    response_model=APIResponse[BadgeResponse],
    status_code=status.HTTP_201_CREATED,
    summary="Create badge (Admin only)",
    description="Register a new green badge and set required volunteer/challenge points to unlock it."
)
async def create_badge(
    payload: BadgeCreate,
    service: GamificationService = Depends(get_gamification_service),
    current_user: User = Depends(require_roles(["Admin"]))
):
    obj = service.create_badge(payload)
    return APIResponse(success=True, message="Badge registered successfully", data=BadgeResponse.model_validate(obj))

@router.put(
    "/badges/{id}",
    response_model=APIResponse[BadgeResponse],
    summary="Update badge (Admin and Manager)",
    description="Modify a badge details, name, or points criteria."
)
async def update_badge(
    id: UUID,
    payload: BadgeUpdate,
    service: GamificationService = Depends(get_gamification_service),
    current_user: User = Depends(require_roles(["Admin", "Manager"]))
):
    obj = service.update_badge(id, payload)
    return APIResponse(success=True, message="Badge updated successfully", data=BadgeResponse.model_validate(obj))

@router.delete(
    "/badges/{id}",
    response_model=APIResponse[None],
    summary="Delete badge (Admin only)",
    description="Delete a badge award definition from the system."
)
async def delete_badge(
    id: UUID,
    service: GamificationService = Depends(get_gamification_service),
    current_user: User = Depends(require_roles(["Admin"]))
):
    service.delete_badge(id)
    return APIResponse(success=True, message="Badge deleted successfully", data=None)

# --- EMPLOYEE BADGES ---

@router.get(
    "/badges/awarded",
    response_model=APIResponse[List[EmployeeBadgeResponse]],
    summary="List all awarded badges",
    description="Retrieve all badge achievement records for employees."
)
async def list_employee_badges(
    service: GamificationService = Depends(get_gamification_service),
    current_user: User = Depends(get_current_user)
):
    objs = service.get_all_employee_badges()
    data = [EmployeeBadgeResponse.model_validate(o) for o in objs]
    return APIResponse(success=True, message="Awarded badges log retrieved successfully", data=data)

@router.post(
    "/badges/award",
    response_model=APIResponse[EmployeeBadgeResponse],
    status_code=status.HTTP_201_CREATED,
    summary="Award badge to employee (Admin only)",
    description="Explicitly award a badge to an employee."
)
async def award_badge(
    payload: EmployeeBadgeCreate,
    service: GamificationService = Depends(get_gamification_service),
    current_user: User = Depends(require_roles(["Admin"]))
):
    obj = service.award_badge(payload)
    return APIResponse(success=True, message="Badge awarded successfully", data=EmployeeBadgeResponse.model_validate(obj))

# --- REWARDS ---

@router.get(
    "/rewards",
    response_model=APIResponse[List[RewardResponse]],
    summary="List all rewards",
    description="Retrieve catalog of rewards, stock counts, and required points."
)
async def list_rewards(
    service: GamificationService = Depends(get_gamification_service),
    current_user: User = Depends(get_current_user)
):
    objs = service.get_all_rewards()
    data = [RewardResponse.model_validate(o) for o in objs]
    return APIResponse(success=True, message="Rewards retrieved successfully", data=data)

@router.post(
    "/rewards",
    response_model=APIResponse[RewardResponse],
    status_code=status.HTTP_201_CREATED,
    summary="Create reward item (Admin only)",
    description="Register a new redeemable reward item in the system."
)
async def create_reward(
    payload: RewardCreate,
    service: GamificationService = Depends(get_gamification_service),
    current_user: User = Depends(require_roles(["Admin"]))
):
    obj = service.create_reward(payload)
    return APIResponse(success=True, message="Reward item registered successfully", data=RewardResponse.model_validate(obj))

@router.put(
    "/rewards/{id}",
    response_model=APIResponse[RewardResponse],
    summary="Update reward item (Admin and Manager)",
    description="Modify a reward name, points requirements, description, or adjust stock parameters."
)
async def update_reward(
    id: UUID,
    payload: RewardUpdate,
    service: GamificationService = Depends(get_gamification_service),
    current_user: User = Depends(require_roles(["Admin", "Manager"]))
):
    obj = service.update_reward(id, payload)
    return APIResponse(success=True, message="Reward updated successfully", data=RewardResponse.model_validate(obj))

@router.delete(
    "/rewards/{id}",
    response_model=APIResponse[None],
    summary="Delete reward item (Admin only)",
    description="Remove a reward item from catalog."
)
async def delete_reward(
    id: UUID,
    service: GamificationService = Depends(get_gamification_service),
    current_user: User = Depends(require_roles(["Admin"]))
):
    service.delete_reward(id)
    return APIResponse(success=True, message="Reward item deleted successfully", data=None)

# --- REWARD REDEMPTIONS ---

@router.get(
    "/rewards/redemptions",
    response_model=APIResponse[List[RewardRedemptionResponse]],
    summary="List all redemptions",
    description="Retrieve log of all employee reward redemptions."
)
async def list_redemptions(
    service: GamificationService = Depends(get_gamification_service),
    current_user: User = Depends(get_current_user)
):
    objs = service.get_all_redemptions()
    data = [RewardRedemptionResponse.model_validate(o) for o in objs]
    return APIResponse(success=True, message="Redemption log retrieved successfully", data=data)

@router.post(
    "/rewards/redeem",
    response_model=APIResponse[RewardRedemptionResponse],
    status_code=status.HTTP_201_CREATED,
    summary="Redeem reward (Logged-in User)",
    description="Submit a redemption for a reward item (deducts stock dynamically)."
)
async def redeem_reward(
    payload: RewardRedemptionCreate,
    service: GamificationService = Depends(get_gamification_service),
    current_user: User = Depends(get_current_user)
):
    # Enforce registering the current user if not Admin
    if current_user.role != "Admin" and current_user.id != str(payload.employee_id):
        payload.employee_id = UUID(current_user.id)

    obj = service.redeem_reward(payload)
    return APIResponse(success=True, message="Reward redeemed successfully", data=RewardRedemptionResponse.model_validate(obj))
