import logging

import requests
from fastapi import HTTPException

from app.config import settings

logger = logging.getLogger(__name__)

GRAPH_SCOPE = "https://graph.microsoft.com/User.Read"


def _resolve_obo_tenant_id(user_claims: dict | None = None) -> str:
    if user_claims and user_claims.get("tid"):
        return user_claims["tid"]

    if settings.AZURE_SERVERSIDE_TENANT_ID:
        return settings.AZURE_SERVERSIDE_TENANT_ID

    raise HTTPException(status_code=500, detail="Azure tenant is not configured for OBO exchange")


def exchange_token_on_behalf_of(user_access_token: str, user_claims: dict | None = None) -> dict:
    """
    Exchange the validated frontend access token for a Microsoft Graph access token
    using OAuth 2.0 On-Behalf-Of flow.
    """
    tenant_id = _resolve_obo_tenant_id(user_claims)
    token_endpoint = f"https://login.microsoftonline.com/{tenant_id}/oauth2/v2.0/token"

    if not settings.AZURE_SERVERSIDE_CLIENT_ID or not settings.AZURE_SERVERSIDE_CLIENT_SECRET_VALUE:
        raise HTTPException(status_code=500, detail="Azure backend client credentials are not configured")

    data = {
        "grant_type": "urn:ietf:params:oauth:grant-type:jwt-bearer",
        "client_id": settings.AZURE_SERVERSIDE_CLIENT_ID,
        "client_secret": settings.AZURE_SERVERSIDE_CLIENT_SECRET_VALUE,
        "assertion": user_access_token,
        "requested_token_use": "on_behalf_of",
        "scope": GRAPH_SCOPE,
    }

    response = requests.post(
        token_endpoint,
        data=data,
        headers={"Content-Type": "application/x-www-form-urlencoded"},
        timeout=15,
    )

    if response.status_code != 200:
        logger.warning("OBO token exchange failed with status=%s body=%s", response.status_code, response.text)
        try:
            microsoft_error = response.json()
        except ValueError:
            microsoft_error = {"raw": response.text}

        raise HTTPException(
            status_code=response.status_code,
            detail={
                "message": "OBO token exchange failed",
                "microsoft_error": microsoft_error,
            },
        )

    return response.json()