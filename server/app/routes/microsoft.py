from fastapi import APIRouter, Depends
from pydantic import BaseModel, Field
from typing import Optional
from app.auth.msal import get_current_user_from_token


router = APIRouter(prefix="/api", tags=["Microsoft Authentication"])


class AccessTokenResponse(BaseModel):
    """
    Response model for validated client-side access token
    """
    success: bool = Field(..., description="Indicates if the request was successful")
    message: Optional[str] = Field(default=None, description="Optional message providing additional information")
    user: Optional[dict] = Field(default=None, description="Information about the authenticated user")


@router.post("/get-client-side-access-token", response_model=AccessTokenResponse)
async def exchange_token(
    auth_data: dict = Depends(get_current_user_from_token)
    ) -> AccessTokenResponse:
    """
    Validate the frontend access token before OBO exchange.
    
    Frontend sends token in Authorization header: "Bearer <token>"
    Backend validates it and keeps the raw token server-side for later OBO exchange.
    """
    current_user = auth_data["user"]
    
    return AccessTokenResponse(
        success=True,
        message="Token validated successfully",
        user={
            "name": current_user.get("name"),
            "username": current_user.get("preferred_username"),
            "tenant_id": current_user.get("tid"),
            "scope": current_user.get("scp"),
            "audience": current_user.get("aud"),
        }
    )
