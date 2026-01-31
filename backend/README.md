Backend

## Overview

FastAPI backend application for a restaurant backoffice system with structured logging, configuration management, SQLAlchemy ORM, and comprehensive testing.

## Quickstart

### Setup
```bash
# Sync dependencies (including dev dependencies)
uv sync --extra dev
```

### Development
```bash
# Run the development server (with auto-reload)
uv run python -m backend.main

# Or use uvicorn directly
uv run uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
```

### 📚 View API Documentation

Once the server is running, access the interactive documentation:

- **Swagger UI**: http://localhost:8000/docs (Interactive, test endpoints in browser)
- **ReDoc**: http://localhost:8000/redoc (Clean, readable documentation)
- **OpenAPI JSON**: http://localhost:8000/openapi.json (Raw specification)

See [Swagger Documentation Guide](docs/SWAGGER_DOCUMENTATION.md) for detailed usage instructions.

### Testing
```bash
# Run all tests
uv run pytest

# Run with coverage
uv run pytest --cov=backend --cov-report=term-missing

# Run specific test file
uv run pytest tests/test_health.py
```

### Code Quality
```bash
# Lint code
uv run ruff check .

# Format code
uv run ruff format .

# Type check
uv run mypy src
```

## API Documentation

### 🎯 Interactive Documentation (Recommended)

The API includes **auto-generated, interactive documentation** with Swagger UI and ReDoc:

- **Swagger UI** (http://localhost:8000/docs): Test endpoints directly in your browser
- **ReDoc** (http://localhost:8000/redoc): Beautiful, readable API documentation

**Features:**
- ✅ Complete endpoint documentation with examples
- ✅ Interactive testing - try API calls from the browser
- ✅ Request/response schemas with validation rules
- ✅ Multiple examples for each endpoint
- ✅ Error response documentation
- ✅ Automatic updates when code changes

See [Swagger Documentation Guide](docs/SWAGGER_DOCUMENTATION.md) for detailed usage.

### API Endpoints

#### General
- `GET /` - Root endpoint with welcome message
- `GET /health` - Health check endpoint for monitoring

#### Orders API
- `POST /api/v1/orders` - Create a new order with items
- `GET /api/v1/orders/pending` - Get all pending orders
- `DELETE /api/v1/orders/{order_id}` - Cancel an order
- `PATCH /api/v1/orders/{order_id}/complete` - Mark an order as completed

See [Orders API Documentation](docs/ORDERS_API.md) for detailed endpoint information.

## Configuration

Configuration is managed via environment variables or a `.env` file:

- `APP_NAME` - Application name (default: "Backend API")
- `APP_VERSION` - Application version (default: "0.1.0")
- `DEBUG` - Debug mode (default: false)
- `HOST` - Server host (default: "0.0.0.0")
- `PORT` - Server port (default: 8000)
- `LOG_LEVEL` - Log verbosity (default: "INFO")
- `CORS_ORIGINS` - Allowed CORS origins (default: ["http://localhost:3000"])
- `DATABASE_URL` - Database connection URL (default: "sqlite:///./restaurant.db")

## Project Structure

```
src/backend/
├── __init__.py
├── main.py              # FastAPI application and entry point
├── config.py            # Configuration management
├── logging_config.py    # Structured logging setup
├── database.py          # Database configuration and session management
├── models/              # SQLAlchemy models
│   ├── __init__.py
│   └── order.py         # Order and OrderItem models
├── schemas/             # Pydantic schemas for validation
│   ├── __init__.py
│   └── order.py         # Order request/response schemas
└── routes/              # API route modules
    ├── __init__.py
    ├── health.py        # Health check endpoints
    └── orders.py        # Orders API endpoints
```

## Database

The application uses SQLite for local development. The database file (`restaurant.db`) is created automatically on first run.

### Models

- **Order**: Represents a restaurant order with table number, status, items, and total
- **OrderItem**: Represents an item within an order with name, amount, and price

### Migrations

Currently using SQLAlchemy's `create_all()` for table creation. For production, consider using Alembic for database migrations.

## Notes

- Linting and type checks ignore `.agents/` (skills content)
- Uses structured JSON logging for production
- Python 3.13+ required
- Follows TDD (Test-Driven Development) methodology
- All endpoints are fully tested with comprehensive test coverage
