from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field



router = APIRouter(prefix="/api", tags=["Microsoft Authentication"])


class AccessTokenRequest(BaseModel):
    """
    Request model for obtaining client-side access token
    """
    access_token: str = Field(..., description="Client-side access token")

class AccessTokenResponse(BaseModel):
    """
    Response model for client-side access token
    """
    success: bool = Field(..., description="Indicates if the request was successful")
    access_token: str = Field(..., description="Client-side access token")
    message: str = Field(None, description="Optional message providing additional information")

@router.post("/get-client-side-access-token", response_model=AccessTokenResponse)
async def get_client_side_access_token(request: AccessTokenRequest) -> AccessTokenResponse:
    # Your logic to get the client-side access token
    return AccessTokenResponse(
        success=True, 
        access_token=request.access_token, 
        message="Client-side access token retrieved successfully"
    )
