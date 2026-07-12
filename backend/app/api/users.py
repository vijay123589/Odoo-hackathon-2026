from fastapi import APIRouter, Depends, status, HTTPException
from typing import List

from app.schemas.common import APIResponse
from app.schemas.user import UserCreate, UserUpdate, UserResponse
from app.services.user import UserService
from app.dependencies import get_user_service, require_roles, get_current_user
from app.models.user import User

router = APIRouter(prefix="/users", tags=["Users"])

def map_user_to_response(user: User) -> UserResponse:
    """Helper to convert user domain model to UserResponse schema."""
    return UserResponse(
        id=user.id,
        name=user.name,
        email=user.email,
        role=user.role,  # Coerced to UserRole enum
        department=user.department,
        status=user.status,
        created_at=user.created_at
    )

@router.get(
    "",
    response_model=APIResponse[List[UserResponse]],
    summary="List all users",
    description="Retrieve a list of all registered users on EcoSphere. Restricted to Admins and Managers."
)
async def list_users(
    user_service: UserService = Depends(get_user_service),
    current_user: User = Depends(require_roles(["Admin", "Manager"]))
):
    users = user_service.get_all_users()
    data = [map_user_to_response(u) for u in users]
    return APIResponse(
        success=True,
        message="Users listed successfully",
        data=data
    )

@router.get(
    "/{id}",
    response_model=APIResponse[UserResponse],
    summary="Get user by ID",
    description="Retrieve detailed profile information for a specific user. Employees can only retrieve their own profiles; Admins and Managers can retrieve any profile."
)
async def get_user(
    id: str,
    user_service: UserService = Depends(get_user_service),
    current_user: User = Depends(get_current_user)
):
    # Rule: Employee role can only query their own ID
    if current_user.role == "Employee" and current_user.id != id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied: employees can only retrieve their own profiles"
        )
        
    user = user_service.get_user_by_id(id)
    return APIResponse(
        success=True,
        message="User profile retrieved successfully",
        data=map_user_to_response(user)
    )

@router.post(
    "",
    response_model=APIResponse[UserResponse],
    status_code=status.HTTP_201_CREATED,
    summary="Create a new user (Admin only)",
    description="Register a new user account with specified roles and departments. Restricted to Admin role only."
)
async def create_user(
    user_in: UserCreate,
    user_service: UserService = Depends(get_user_service),
    current_user: User = Depends(require_roles(["Admin"]))
):
    new_user = user_service.create_user(user_in)
    return APIResponse(
        success=True,
        message="User created successfully",
        data=map_user_to_response(new_user)
    )

@router.put(
    "/{id}",
    response_model=APIResponse[UserResponse],
    summary="Update a user (Admin only)",
    description="Modify user profile properties including roles, statuses, and departments. Restricted to Admin role only."
)
async def update_user(
    id: str,
    user_in: UserUpdate,
    user_service: UserService = Depends(get_user_service),
    current_user: User = Depends(require_roles(["Admin"]))
):
    updated_user = user_service.update_user(id, user_in)
    return APIResponse(
        success=True,
        message="User updated successfully",
        data=map_user_to_response(updated_user)
    )

@router.delete(
    "/{id}",
    response_model=APIResponse[None],
    summary="Delete a user (Admin only)",
    description="Permantently remove a user account from EcoSphere. Restricted to Admin role only."
)
async def delete_user(
    id: str,
    user_service: UserService = Depends(get_user_service),
    current_user: User = Depends(require_roles(["Admin"]))
):
    # Prevent admin from deleting themselves
    if current_user.id == id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Self-deletion is forbidden. An Admin cannot delete their own profile."
        )
        
    user_service.delete_user(id)
    return APIResponse(
        success=True,
        message="User deleted successfully",
        data=None
    )
