from fastapi import APIRouter, HTTPException, Header
from pydantic import BaseModel, Field
from typing import Optional


router = APIRouter(prefix="/api", tags=["Microsoft Authentication"])


class AccessTokenResponse(BaseModel):
    """
    Response model for client-side access token
    """
    success: bool = Field(..., description="Indicates if the request was successful")
    access_token: str = Field(..., description="Backend access token for downstream services")
    message: Optional[str] = Field(None, description="Optional message providing additional information")


@router.post("/get-client-side-access-token", response_model=AccessTokenResponse)
async def exchange_token(authorization: Optional[str] = Header(None)) -> AccessTokenResponse:
    """
    Exchange frontend token for backend token (OBO flow)
    
    Frontend sends token in Authorization header: "Bearer <token>"
    Backend exchanges it for a downstream service token
    """
    
    # Check if Authorization header exists
    if not authorization:
        raise HTTPException(
            status_code=401,
            detail="Authorization header required"
        )
    
    # Extract Bearer token
    # Format: "Bearer <token>"
    parts = authorization.split()
    if len(parts) != 2 or parts[0].lower() != "bearer":
        raise HTTPException(
            status_code=401,
            detail="Invalid Authorization header format. Expected: 'Bearer <token>'"
        )
    
    frontend_token = parts[1]
    
    # TODO: In real OBO flow, exchange frontend_token for backend_token using MSAL
    # For now, just acknowledge receipt of the token
    return AccessTokenResponse(
        success=True,
        access_token=f"{frontend_token[:10]}........",  # In production: would be exchanged token, only showing first 10 chars for demo
        message="Token processed successfully"
    )
