"""
Pydantic schemas for request/response models
"""

from pydantic import BaseModel, Field
from typing import Optional, Any, Dict
from datetime import datetime


# ============================================================================
# Standard Response Wrapper
# ============================================================================

class StandardResponse(BaseModel):
    """Standard API response wrapper"""
    success: bool = Field(..., description="Whether the request was successful")
    data: Optional[Dict[str, Any]] = Field(None, description="Response data")
    error: Optional[str] = Field(None, description="Error message if applicable")
    message: Optional[str] = Field(None, description="Additional message")
    timestamp: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        json_schema_extra = {
            "example": {
                "success": True,
                "data": {"key": "value"},
                "error": None,
                "message": "Request successful",
                "timestamp": "2026-05-06T10:00:00"
            }
        }


# ============================================================================
# Default Route Schemas
# ============================================================================

class HealthCheckResponse(BaseModel):
    """Health check response"""
    status: str = Field(..., description="Health status")
    version: str = Field(..., description="API version")
    timestamp: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        json_schema_extra = {
            "example": {
                "status": "healthy",
                "version": "1.0.0",
                "timestamp": "2026-05-06T10:00:00"
            }
        }


class StatusResponse(BaseModel):
    """Status response"""
    service: str
    status: str
    database: str
    message: str

    class Config:
        json_schema_extra = {
            "example": {
                "service": "MS Auth OBO Backend",
                "status": "running",
                "database": "connected",
                "message": "All systems operational"
            }
        }


# ============================================================================
# Microsoft Authentication Schemas
# ============================================================================

class TokenValidationRequest(BaseModel):
    """Request to validate a token from frontend"""
    token: str = Field(..., description="Azure AD token from frontend")


class TokenValidationResponse(BaseModel):
    """Response from token validation"""
    valid: bool = Field(..., description="Whether token is valid")
    user_id: Optional[str] = Field(None, description="User ID from token")
    email: Optional[str] = Field(None, description="User email")
    name: Optional[str] = Field(None, description="User name")
    expires_at: Optional[datetime] = Field(None, description="Token expiration time")


class OBOTokenRequest(BaseModel):
    """Request to exchange frontend token for backend token (OBO flow)"""
    frontend_token: str = Field(..., description="Token from frontend (MSAL)")
    scope: str = Field(default="https://graph.microsoft.com/.default", description="Requested scope")


class OBOTokenResponse(BaseModel):
    """Response with exchanged OBO token"""
    access_token: str = Field(..., description="Backend access token")
    token_type: str = Field(..., description="Token type")
    expires_in: int = Field(..., description="Token expiration in seconds")


class UserProfileRequest(BaseModel):
    """Request to fetch user profile"""
    token: str = Field(..., description="Access token")


class UserProfileResponse(BaseModel):
    """User profile from Microsoft Graph"""
    id: str = Field(..., description="User ID")
    email: Optional[str] = Field(None, description="User email")
    display_name: Optional[str] = Field(None, description="User display name")
    given_name: Optional[str] = Field(None, description="User first name")
    surname: Optional[str] = Field(None, description="User last name")
    job_title: Optional[str] = Field(None, description="Job title")
    office_location: Optional[str] = Field(None, description="Office location")
    mobile_phone: Optional[str] = Field(None, description="Mobile phone")


class TokenRefreshRequest(BaseModel):
    """Request to refresh token"""
    refresh_token: str = Field(..., description="Refresh token")


class TokenRefreshResponse(BaseModel):
    """Response with new tokens"""
    access_token: str = Field(..., description="New access token")
    refresh_token: Optional[str] = Field(None, description="New refresh token if rotated")
    expires_in: int = Field(..., description="Expiration in seconds")
