import requests
from fastapi import APIRouter, Depends, HTTPException

from app.auth.msal import get_current_user_from_token
from app.auth.obo import exchange_token_on_behalf_of

router = APIRouter(prefix="/api", tags=["Authentication OBO"])


@router.post("/test-obo")
async def test_obo(auth_data: dict = Depends(get_current_user_from_token)):
    user = auth_data["user"]
    frontend_token = auth_data["token"]

    graph_token_response = exchange_token_on_behalf_of(frontend_token, user)

    return {
        "success": True,
        "message": "OBO exchange successful",
        "user": {
            "name": user.get("name"),
            "username": user.get("preferred_username"),
            "scope": user.get("scp"),
            "audience": user.get("aud"),
        },
        "graph_token_info": {
            "token_type": graph_token_response.get("token_type"),
            "expires_in": graph_token_response.get("expires_in"),
            "scope": graph_token_response.get("scope"),
        },
    }


@router.get("/me")
async def get_me(auth_data: dict = Depends(get_current_user_from_token)):
    frontend_token = auth_data["token"]
    user = auth_data["user"]

    graph_token_response = exchange_token_on_behalf_of(frontend_token, user)
    graph_access_token = graph_token_response.get("access_token")

    if not graph_access_token:
        raise HTTPException(status_code=502, detail="Microsoft Graph access token missing from OBO response")

    graph_response = requests.get(
        "https://graph.microsoft.com/v1.0/me",
        headers={"Authorization": f"Bearer {graph_access_token}"},
        timeout=15,
    )

    if graph_response.status_code != 200:
        try:
            graph_error = graph_response.json()
        except ValueError:
            graph_error = {"raw": graph_response.text}

        raise HTTPException(status_code=graph_response.status_code, detail=graph_error)

    return {
        "success": True,
        "data": graph_response.json(),
    }