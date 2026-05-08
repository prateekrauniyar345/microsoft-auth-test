from fastapi import APIRouter, HTTPException, Header, Depends
from pydantic import BaseModel, Field
from typing import Optional
from app.auth.msal import get_current_user_from_token


router = APIRouter(prefix="/api", tags=["Microsoft Authentication"])


class AccessTokenResponse(BaseModel):
    """
    Response model for client-side access token
    """
    success: bool = Field(..., description="Indicates if the request was successful")
    access_token: str = Field(..., description="Backend access token for downstream services")
    message: Optional[str] = Field(default=None, description="Optional message providing additional information")
    user: Optional[dict] = Field(default=None, description="Information about the authenticated user")


@router.post("/get-client-side-access-token", response_model=AccessTokenResponse)
async def exchange_token(
    authorization: Optional[str] = Header(None),
    current_user: dict = Depends(get_current_user_from_token)
    ) -> AccessTokenResponse:
    """
    Exchange frontend token for backend token (OBO flow)
    
    Frontend sends token in Authorization header: "Bearer <token>"
    Backend exchanges it for a downstream service token
    """
    
    return AccessTokenResponse(
        success=True,
        access_token=authorization[:20] + "......",
        message="Token validated successfully",
        user={
            "name": current_user.get("name"),
            "username": current_user.get("preferred_username"),
            "tenant_id": current_user.get("tid"),
            "scope": current_user.get("scp"),
            "audience": current_user.get("aud"),
        }
    )
