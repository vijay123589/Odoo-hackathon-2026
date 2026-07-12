from datetime import timedelta
from fastapi import HTTPException, status
from app.models.user import User
from app.repositories.user import UserRepository
from app.services.user import UserService
from app.schemas.auth import UserLogin, UserRegister, Token
from app.security import verify_password, create_access_token
from app.config import settings

class AuthService:
    def __init__(self, user_service: UserService, user_repo: UserRepository):
        self.user_service = user_service
        self.user_repo = user_repo

    def authenticate_user(self, login_data: UserLogin) -> User:
        """Authenticate a user using email and password. Raises 401 or 403."""
        user = self.user_repo.get_by_email(login_data.email)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password",
                headers={"WWW-Authenticate": "Bearer"},
            )
        if not verify_password(login_data.password, user.password_hash):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password",
                headers={"WWW-Authenticate": "Bearer"},
            )
        if user.status != "Active":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="User account is inactive"
            )
        return user

    def register_user(self, register_data: UserRegister) -> User:
        """Register a new user inside the database."""
        from app.schemas.user import UserCreate
        user_create = UserCreate(
            name=register_data.name,
            email=register_data.email,
            password=register_data.password,
            role=register_data.role,
            department=register_data.department,
            status="Active"
        )
        return self.user_service.create_user(user_create)

    def create_user_tokens(self, user: User) -> Token:
        """Create signed access token for authenticated session."""
        access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            subject=user.id, expires_delta=access_token_expires
        )
        return Token(access_token=access_token, token_type="bearer")
