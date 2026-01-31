"""Health check endpoints."""

from datetime import datetime, timezone

from fastapi import APIRouter
from pydantic import BaseModel, ConfigDict, Field

from backend.config import settings

router = APIRouter()


class HealthResponse(BaseModel):
    """Health check response model."""

    status: str = Field(..., description="Health status of the API", examples=["healthy"])
    app_name: str = Field(..., description="Application name")
    version: str = Field(..., description="Application version")
    timestamp: datetime = Field(..., description="Current server timestamp")
    
    model_config = ConfigDict(
        json_schema_extra={
            "examples": [
                {
                    "status": "healthy",
                    "app_name": "Backend API",
                    "version": "0.1.0",
                    "timestamp": "2026-01-31T19:45:00.000000Z"
                }
            ]
        }
    )


@router.get(
    "/health",
    response_model=HealthResponse,
    summary="Health check",
    description="""
    Check the health status of the API.
    
    This endpoint can be used for:
    - Monitoring and alerting systems
    - Load balancer health checks
    - Verifying API availability
    
    Returns the current status, application metadata, and server timestamp.
    """,
    response_description="Health status and application metadata",
)
async def health_check() -> HealthResponse:
    """Check API health status."""
    return HealthResponse(
        status="healthy",
        app_name=settings.app_name,
        version=settings.app_version,
        timestamp=datetime.now(timezone.utc),
    )


@router.get(
    "/",
    summary="Root endpoint",
    description="Welcome message and API information.",
    response_description="Welcome message",
    responses={
        200: {
            "description": "Welcome message",
            "content": {
                "application/json": {
                    "example": {
                        "message": "Welcome to Backend API"
                    }
                }
            }
        }
    }
)
async def root() -> dict[str, str]:
    """Get welcome message."""
    return {"message": f"Welcome to {settings.app_name}"}
