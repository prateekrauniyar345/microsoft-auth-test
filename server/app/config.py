"""
Configuration module for FastAPI application
"""

from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    """
    Application settings loaded from environment variables
    """
    # Application
    APP_NAME: str = "MS Auth OBO Backend"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = False
    
    # Server
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    
    # Database
    DATABASE_URL: str = "postgresql://user:password@localhost:5432/ms_auth_db"
    DB_ECHO: bool = False  # Set to True to log SQL queries
    
    # CORS
    CORS_ORIGINS: list = ["http://localhost:3000", "http://localhost:5173"]
    CORS_ALLOW_CREDENTIALS: bool = True
    CORS_ALLOW_METHODS: list = ["*"]
    CORS_ALLOW_HEADERS: list = ["*"]
    
    # JWT/Security
    SECRET_KEY: str = "your-secret-key-change-this-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # Microsoft Azure AD
    AZURE_TENANT_ID: str = "23d82046-7e7d-4cf9-8efd-8012ec1d7a7c"
    AZURE_CLIENT_ID: str = "4c9d1f93-e2a9-490d-af3a-0c02164dfa84"
    AZURE_CLIENT_SECRET: str = ""
    MICROSOFT_AUTHORITY_URL: str = f"https://login.microsoftonline.com/{AZURE_TENANT_ID}"
    MICROSOFT_GRAPH_ENDPOINT: str = "https://graph.microsoft.com/v1.0"
    
    class Config:
        env_file = ".env"
        case_sensitive = True


# Create settings instance
settings = Settings()
