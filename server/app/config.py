"""
Configuration module for FastAPI application
"""

from pydantic_settings import BaseSettings
from typing import Optional
from dotenv import load_dotenv
import os
import sys
load_dotenv()  # Load environment variables from .env file


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
    CORS_ORIGINS: list = os.getenv("CORS_ORIGINS", "http://localhost:3000,http://localhost:5173").split(",")
    CORS_ALLOW_CREDENTIALS: bool = True
    CORS_ALLOW_METHODS: list = ["*"]
    CORS_ALLOW_HEADERS: list = ["*"]
    
    # JWT/Security
    SECRET_KEY: str = "your-secret-key-change-this-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # Microsoft Azure AD - Client Side (Frontend to Backend)
    AZURE_CLIENTSIDE_TENANT_ID: str = os.getenv("AZURE_CLIENTSIDE_TENANT_ID")
    AZURE_CLIENTSIDE_CLIENT_ID: str = os.getenv("AZURE_CLIENTSIDE_CLIENT_ID")
    AZURE_CLIENTSIDE_CLIENT_SECRET_ID: Optional[str] = os.getenv("AZURE_CLIENTSIDE_CLIENT_SECRET_ID") or None
    AZURE_CLIENTSIDE_CLIENT_SECRET_VALUE: Optional[str] = os.getenv("AZURE_CLIENTSIDE_CLIENT_SECRET_VALUE") or None
    



    # Microsoft Azure AD - Server Side (Backend to Downstream Services/Graph API)
    AZURE_SERVERSIDE_TENANT_ID: str = os.getenv("AZURE_SERVERSIDE_TENANT_ID")
    AZURE_SERVERSIDE_CLIENT_ID: str = os.getenv("AZURE_SERVERSIDE_CLIENT_ID")
    AZURE_SERVERSIDE_CLIENT_SECRET_VALUE: Optional[str] = os.getenv("AZURE_SERVERSIDE_CLIENT_SECRET_VALUE") or None
    AZURE_SERVERSIDE_CLIENT_SECRET_ID: Optional[str] = os.getenv("AZURE_SERVERSIDE_CLIENT_SECRET_ID") or None
    AZURE_SERVERSIDE_SCOPE: Optional[str] = os.getenv("AZURE_SERVERSIDE_SCOPE") or None
    
    class Config:
        env_file = ".env"
        case_sensitive = True


# Create settings instance
settings = Settings()
