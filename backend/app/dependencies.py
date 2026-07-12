from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from typing import List

from app.config import settings
from app.security import decode_access_token
from app.models.user import User
from app.repositories.user import UserRepository
from app.repositories.department import DepartmentRepository
from app.services.user import UserService
from app.services.department import DepartmentService
from app.services.auth import AuthService

# Define where OAuth2 password tokens are generated
oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl=f"{settings.API_V1_STR}/auth/login",
    auto_error=True
)

# ----------------- REPOSITORY PROVIDERS -----------------

def get_user_repository() -> UserRepository:
    """Provide UserRepository instance."""
    return UserRepository()

def get_department_repository() -> DepartmentRepository:
    """Provide DepartmentRepository instance."""
    return DepartmentRepository()

# ------------------ SERVICE PROVIDERS -------------------

def get_user_service(
    user_repo: UserRepository = Depends(get_user_repository),
    department_repo: DepartmentRepository = Depends(get_department_repository)
) -> UserService:
    """Provide UserService instance."""
    return UserService(user_repo=user_repo, department_repo=department_repo)

def get_department_service(
    department_repo: DepartmentRepository = Depends(get_department_repository),
    user_repo: UserRepository = Depends(get_user_repository)
) -> DepartmentService:
    """Provide DepartmentService instance."""
    return DepartmentService(department_repo=department_repo, user_repo=user_repo)

def get_auth_service(
    user_service: UserService = Depends(get_user_service),
    user_repo: UserRepository = Depends(get_user_repository)
) -> AuthService:
    """Provide AuthService instance."""
    return AuthService(user_service=user_service, user_repo=user_repo)

# ------------------ AUTH DEPENDENCIES -------------------

def get_current_user(
    token: str = Depends(oauth2_scheme),
    user_repo: UserRepository = Depends(get_user_repository)
) -> User:
    """Extract and validate the current authenticated user from JWT."""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    # Decode token
    payload = decode_access_token(token)
    if payload is None:
        raise credentials_exception
        
    user_id: str = payload.get("sub")
    if user_id is None:
        raise credentials_exception
        
    # Retrieve user from mock storage
    user = user_repo.get_by_id(user_id)
    if user is None:
        raise credentials_exception
        
    if user.status != "Active":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is inactive"
        )
        
    return user

# ------------------- RBAC DEPENDENCY --------------------

class RoleChecker:
    def __init__(self, allowed_roles: List[str]):
        self.allowed_roles = allowed_roles

    def __call__(self, current_user: User = Depends(get_current_user)) -> User:
        """Enforce that current_user has an approved role."""
        if current_user.role not in self.allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access denied: role must be one of {self.allowed_roles}"
            )
        return current_user

def require_roles(allowed_roles: List[str]):
    """Reusable role check dependency factory."""
    return RoleChecker(allowed_roles)
