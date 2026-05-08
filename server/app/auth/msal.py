import logging
import requests
from jose import jwt
from jose.exceptions import JWTError, ExpiredSignatureError
from fastapi import HTTPException, Header
from app.config import settings

logger = logging.getLogger(__name__)

BACKEND_CLIENT_ID = settings.AZURE_SERVERSIDE_CLIENT_ID
REQUIRED_SCOPE = (settings.AZURE_SERVERSIDE_SCOPE or "access_as_user").strip().strip('"')


def get_microsoft_public_keys(tenant_id: str | None, issuer: str | None):
    if tenant_id:
        jwks_url = f"https://login.microsoftonline.com/{tenant_id}/discovery/v2.0/keys"
    elif issuer:
        issuer_parts = issuer.rstrip("/").split("/")
        if len(issuer_parts) < 2:
            raise HTTPException(status_code=401, detail="Invalid token issuer")
        derived_tenant_id = issuer_parts[-2]
        jwks_url = f"https://login.microsoftonline.com/{derived_tenant_id}/discovery/v2.0/keys"
    else:
        raise HTTPException(status_code=401, detail="Token is missing issuer and tenant information")

    response = requests.get(jwks_url, timeout=10)
    response.raise_for_status()
    return response.json()


def validate_access_token(token: str):
    try:
        unverified_header = jwt.get_unverified_header(token)
        unverified_claims = jwt.get_unverified_claims(token)

        kid = unverified_header.get("kid")
        token_issuer = unverified_claims.get("iss")
        token_tenant_id = unverified_claims.get("tid")

        logger.debug(
            "Validating token with kid=%s issuer=%s tenant=%s",
            kid,
            token_issuer,
            token_tenant_id,
        )

        jwks = get_microsoft_public_keys(token_tenant_id, token_issuer)

        key = None
        for jwk in jwks["keys"]:
            if jwk["kid"] == kid:
                key = jwk
                break

        if key is None:
            available_kids = [jwk.get("kid") for jwk in jwks.get("keys", [])]
            logger.warning(
                "Token signing key not found for kid=%s. Available kids=%s",
                kid,
                available_kids,
            )
            raise HTTPException(status_code=401, detail="Token signing key not found")

        payload = jwt.decode(
            token,
            key,
            algorithms=["RS256"],
            audience=BACKEND_CLIENT_ID,
            issuer=token_issuer,
        )

        scopes = payload.get("scp", "")

        if REQUIRED_SCOPE not in scopes.split():
            raise HTTPException(
                status_code=403,
                detail=f"Token does not contain required scope: {REQUIRED_SCOPE}"
            )

        return payload

    except ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")

    except JWTError as e:
        raise HTTPException(status_code=401, detail=f"Invalid token: {str(e)}")


def get_current_user_from_token(authorization: str = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Authorization header missing")

    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid authorization header")

    token = authorization.replace("Bearer ", "")
    logger.debug("Received bearer token prefix=%s...", token[:30])

    return validate_access_token(token)