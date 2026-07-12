import uuid
from typing import List
from fastapi import HTTPException, status
from app.models.user import User
from app.repositories.user import UserRepository
from app.repositories.department import DepartmentRepository
from app.schemas.user import UserCreate, UserUpdate
from app.security import get_password_hash

class UserService:
    def __init__(self, user_repo: UserRepository, department_repo: DepartmentRepository):
        self.user_repo = user_repo
        self.department_repo = department_repo

    def get_user_by_id(self, user_id: str) -> User:
        """Retrieve a user by ID or raise a 404 Exception."""
        user = self.user_repo.get_by_id(user_id)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"User with ID '{user_id}' not found"
            )
        return user

    def get_all_users(self) -> List[User]:
        """Retrieve all users in the system."""
        return self.user_repo.get_all()

    def create_user(self, user_in: UserCreate) -> User:
        """Create a new user with validation checks."""
        # 1. Check for email duplicate
        if self.user_repo.get_by_email(user_in.email):
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"Email address '{user_in.email}' is already registered"
            )
        
        # 2. Check if department exists
        if user_in.department:
            if not self.department_repo.get_by_id(user_in.department):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Department with ID '{user_in.department}' does not exist"
                )

        # 3. Hash password and build database instance
        hashed_password = get_password_hash(user_in.password)
        new_user = User(
            id=f"usr-{uuid.uuid4().hex[:8]}",
            name=user_in.name,
            email=user_in.email,
            password_hash=hashed_password,
            role=user_in.role.value,
            department=user_in.department,
            status=user_in.status,
        )
        return self.user_repo.create(new_user)

    def update_user(self, user_id: str, user_in: UserUpdate) -> User:
        """Update an existing user with validations."""
        # Ensure user exists
        user = self.get_user_by_id(user_id)
        
        # Convert schema to dict, filtering out fields not sent
        update_data = user_in.model_dump(exclude_unset=True)
        
        # 1. Check email uniqueness if email is changed
        if "email" in update_data and update_data["email"] != user.email:
            if self.user_repo.get_by_email(update_data["email"]):
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail=f"Email address '{update_data['email']}' is already registered"
                )

        # 2. Check department existence if updated
        if "department" in update_data and update_data["department"] is not None:
            if not self.department_repo.get_by_id(update_data["department"]):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Department with ID '{update_data['department']}' does not exist"
                )

        # 3. Hash password if updated
        if "password" in update_data and update_data["password"]:
            update_data["password_hash"] = get_password_hash(update_data["password"])
            del update_data["password"]

        # Convert enums to value string
        if "role" in update_data and update_data["role"]:
            update_data["role"] = update_data["role"].value

        return self.user_repo.update(user_id, update_data)

    def delete_user(self, user_id: str) -> bool:
        """Delete a user, raising 404 if user doesn't exist."""
        # Validate existence
        self.get_user_by_id(user_id)
        return self.user_repo.delete(user_id)
