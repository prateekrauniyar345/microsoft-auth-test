"""
Default routes - health checks and status endpoints
"""

from fastapi import APIRouter, Response
from datetime import datetime
from app.config import settings
from app.schemas.schemas import HealthCheckResponse, StatusResponse, StandardResponse

router = APIRouter(prefix="/api", tags=["default"])


@router.get("/health", response_model=HealthCheckResponse)
async def health_check():
    """
    Health check endpoint
    Returns the health status of the API
    """
    return HealthCheckResponse(
        status="healthy",
        version=settings.APP_VERSION
    )


@router.get("/status", response_model=StandardResponse)
async def get_status():
    """
    Get API status including database and service health
    """
    try:
        # In a real app, check database connection here
        db_status = "connected"
        message = "All systems operational"
    except Exception as e:
        db_status = "disconnected"
        message = f"Error: {str(e)}"

    return StandardResponse(
        success=True,
        data={
            "service": settings.APP_NAME,
            "status": "running",
            "database": db_status,
            "version": settings.APP_VERSION,
            "timestamp": datetime.utcnow().isoformat()
        },
        message=message
    )


@router.get("/version")
async def get_version():
    """
    Get API version
    """
    return StandardResponse(
        success=True,
        data={
            "name": settings.APP_NAME,
            "version": settings.APP_VERSION
        }
    )


@router.get("/info")
async def get_info():
    """
    Get API information
    """
    return StandardResponse(
        success=True,
        data={
            "name": settings.APP_NAME,
            "version": settings.APP_VERSION,
            "debug": settings.DEBUG,
            "database_configured": bool(settings.DATABASE_URL),
            "azure_configured": bool(settings.AZURE_CLIENT_ID)
        }
    )
