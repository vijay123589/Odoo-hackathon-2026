from fastapi import APIRouter, Depends, status
from fastapi.security import OAuth2PasswordRequestForm
from app.schemas.common import APIResponse
from app.schemas.auth import UserRegister, UserLogin, Token
from app.schemas.user import UserResponse
from app.services.auth import AuthService
from app.dependencies import get_auth_service, get_current_user
from app.models.user import User

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post(
    "/register",
    response_model=APIResponse[UserResponse],
    status_code=status.HTTP_201_CREATED,
    summary="Register a new user",
    description="Create a new user account on EcoSphere. New users default to the 'Employee' role and 'Active' status."
)
async def register(
    register_data: UserRegister,
    auth_service: AuthService = Depends(get_auth_service)
):
    new_user = auth_service.register_user(register_data)
    # Convert domain model to response schema
    user_response = UserResponse.model_validate(new_user)
    return APIResponse(
        success=True,
        message="User registered successfully",
        data=user_response
    )

@router.post(
    "/login",
    response_model=APIResponse[Token],
    summary="Authenticate user and obtain JWT token",
    description="Log in with email (username) and password to generate a bearer JWT access token (valid for 60 minutes)."
)
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    auth_service: AuthService = Depends(get_auth_service)
):
    login_payload = UserLogin(email=form_data.username, password=form_data.password)
    user = auth_service.authenticate_user(login_payload)
    tokens = auth_service.create_user_tokens(user)
    return APIResponse(
        success=True,
        message="Authentication successful",
        data=tokens
    )

@router.get(
    "/me",
    response_model=APIResponse[UserResponse],
    summary="Get current user details",
    description="Retrieve profile details of the currently logged-in user using the Bearer JWT token."
)
async def get_me(current_user: User = Depends(get_current_user)):
    user_response = UserResponse.model_validate(current_user)
    return APIResponse(
        success=True,
        message="User profile retrieved successfully",
        data=user_response
    )


@router.post(
    "/logout",
    response_model=APIResponse[None],
    summary="User logout (placeholder)",
    description="Standard API placeholder for logging out. JWT authentication is stateless, so token revocation should also be managed on the client side."
)
async def logout(current_user: User = Depends(get_current_user)):
    return APIResponse(
        success=True,
        message="Logout successful. Please delete the token on the client side.",
        data=None
    )
