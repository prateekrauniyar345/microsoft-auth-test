# MS Auth OBO Backend

A scalable FastAPI backend for Microsoft Authentication with On-Behalf-Of (OBO) flow.

## Features

- ✅ FastAPI with async/await support
- ✅ SQLAlchemy ORM with PostgreSQL
- ✅ Microsoft Azure AD integration
- ✅ On-Behalf-Of (OBO) token exchange flow
- ✅ Token validation from frontend
- ✅ Microsoft Graph API integration
- ✅ Standard response wrapper
- ✅ Comprehensive error handling
- ✅ Audit logging
- ✅ CORS middleware
- ✅ Scalable services architecture

## Project Structure

```
server/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI app factory
│   ├── config.py            # Configuration (settings from .env)
│   │
│   ├── routes/              # API endpoints
│   │   ├── __init__.py
│   │   ├── default.py       # Health, status endpoints
│   │   └── microsoft.py     # Microsoft auth endpoints
│   │
│   ├── services/            # Business logic layer
│   │   ├── __init__.py
│   │   ├── microsoft_service.py  # Azure AD & Graph API
│   │   └── user_service.py       # User management
│   │
│   ├── models/              # SQLAlchemy ORM models
│   │   ├── __init__.py
│   │   └── models.py        # User, TokenCache, AuditLog
│   │
│   └── schemas/             # Pydantic request/response models
│       ├── __init__.py
│       └── schemas.py       # Validation schemas
│
├── .env                     # Environment configuration
├── run.py                   # Server entry point
├── start.sh                 # Start script
└── requirements.txt         # Python dependencies
```

## Installation

### 1. Create Virtual Environment

```bash
cd server
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Configure Environment

Edit `.env` file with your Azure AD credentials:

```env
AZURE_CLIENT_ID="your-client-id"
AZURE_CLIENT_SECRET="your-client-secret"
AZURE_TENANT_ID="your-tenant-id"
DATABASE_URL="postgresql://user:password@localhost:5432/db_name"
```

### 4. Run Server

```bash
python run.py
```

Server will be available at `http://localhost:8000`

## API Endpoints

### Default Routes (`/api`)

- `GET /api/health` - Health check
- `GET /api/status` - Service status
- `GET /api/version` - API version
- `GET /api/info` - API information

### Microsoft Routes (`/api/microsoft`)

- `POST /api/microsoft/validate-token` - Validate frontend token
- `POST /api/microsoft/obo-token` - Exchange for OBO token
- `POST /api/microsoft/user-profile` - Fetch user profile
- `POST /api/microsoft/user-photo` - Fetch user photo
- `GET /api/microsoft/me` - Get current user

## Usage Examples

### Validate Token

```bash
curl -X POST "http://localhost:8000/api/microsoft/validate-token" \
  -H "Content-Type: application/json" \
  -d '{"token": "your_frontend_token"}'
```

### Exchange OBO Token

```bash
curl -X POST "http://localhost:8000/api/microsoft/obo-token" \
  -H "Content-Type: application/json" \
  -d '{"frontend_token": "your_token", "scope": "https://graph.microsoft.com/.default"}'
```

### Fetch User Profile

```bash
curl -X POST "http://localhost:8000/api/microsoft/user-profile" \
  -H "Content-Type: application/json" \
  -d '{"token": "your_access_token"}'
```

## Architecture

### Services Pattern

All business logic is in the `services/` folder:
- `MicrosoftService` - Azure AD and Graph API operations
- `UserService` - User database operations

Routes import from services using absolute imports:

```python
from app.services.microsoft_service import MicrosoftService
from app.services.user_service import UserService
```

### Standard Response Format

All endpoints return a standard response wrapper:

```json
{
  "success": true,
  "data": { ... },
  "error": null,
  "message": "Success message",
  "timestamp": "2026-05-06T10:00:00"
}
```

## Configuration

All settings are loaded from `.env` file via `app.config.Settings`:

```python
from app.config import settings

settings.APP_NAME
settings.AZURE_CLIENT_ID
settings.DATABASE_URL
# etc.
```

## Database Setup

### PostgreSQL

```bash
# Create database
createdb ms_auth_db

# Run migrations (when added)
alembic upgrade head
```

### Models

- `User` - User accounts synced from Azure AD
- `TokenCache` - Cached tokens for OBO flow
- `AuditLog` - API call audit trail

## Logging

Configured with Python logging:

```python
import logging
logger = logging.getLogger(__name__)
logger.info("Message")
```

## Security

- JWT token validation
- CORS middleware
- Azure AD integration
- Request/response validation with Pydantic
- Error handling without exposing sensitive info in production

## Next Steps

1. Set up PostgreSQL database
2. Configure Azure AD credentials in `.env`
3. Run database migrations
4. Implement database operations in services
5. Add authentication middleware for protected routes
6. Deploy to production (Docker, cloud)

## Development

### Run Tests

```bash
pytest
```

### Format Code

```bash
black app/
```

### Lint

```bash
pylint app/
```

## License

MIT
