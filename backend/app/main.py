from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from starlette.exceptions import HTTPException as StarletteHTTPException

from app.config import settings
from app.database import seed_database
from app.middleware.logging import LoggingMiddleware
from app.api.auth import router as auth_router
from app.api.users import router as users_router
from app.api.departments import router as departments_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifecycle events handler. Runs seeding on startup."""
    seed_database()
    yield
    # Cleanup actions (none required for mock storage)

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.PROJECT_VERSION,
    description="Backend API services for EcoSphere ESG Management platform (Phase 1 Mock Architecture)",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc"
)

# ----------------- MIDDLEWARES -----------------

# Custom request logger and timing measurement middleware
app.add_middleware(LoggingMiddleware)

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Restrict this to specific domains in production settings
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------- API ROUTERS ------------------

app.include_router(auth_router, prefix=settings.API_V1_STR)
app.include_router(users_router, prefix=settings.API_V1_STR)
app.include_router(departments_router, prefix=settings.API_V1_STR)

# ------------ GLOBAL EXCEPTION HANDLERS ---------

@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request: Request, exc: StarletteHTTPException):
    """Intercept all standard FastAPI HTTPExceptions to wrap them in the API envelope."""
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "message": exc.detail,
            "data": None
        }
    )

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """Intercept Pydantic/FastAPI validation errors and format them into the standard envelope."""
    errors = exc.errors()
    # Build a clean readable explanation of the validation problems
    error_details = []
    for err in errors:
        loc = " -> ".join(str(x) for x in err.get("loc", []))
        msg = err.get("msg", "invalid value")
        error_details.append(f"{loc}: {msg}")
    
    friendly_message = f"Validation failed: {', '.join(error_details)}"
    
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "success": False,
            "message": friendly_message,
            "data": errors  # Pass raw structured errors for frontend parsing
        }
    )

@app.exception_handler(Exception)
async def generic_exception_handler(request: Request, exc: Exception):
    """Catch-all for unhandled exceptions to prevent raw stack traces from exposing to client."""
    import logging
    logger = logging.getLogger("EcoSphereAPI")
    logger.exception("An unhandled system error occurred:")
    
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "success": False,
            "message": f"A critical internal server error occurred: {str(exc)}",
            "data": None
        }
    )

@app.get("/", tags=["Root"])
async def root():
    """Default health-check endpoint."""
    return {
        "success": True,
        "message": f"Welcome to the {settings.PROJECT_NAME} API v{settings.PROJECT_VERSION}",
        "data": {
            "environment": settings.ENVIRONMENT,
            "docs_url": "/docs"
        }
    }
