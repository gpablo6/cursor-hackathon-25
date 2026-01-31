Backend

## Overview

FastAPI backend application with structured logging, configuration management, and comprehensive testing.

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

## API Endpoints

- `GET /` - Root endpoint
- `GET /health` - Health check endpoint
- `GET /api/v1/example` - Example GET endpoint
- `POST /api/v1/example` - Example POST endpoint
- `GET /api/v1/example/{item_id}` - Example GET with path parameter

## Configuration

Configuration is managed via environment variables or a `.env` file:

- `APP_NAME` - Application name (default: "Backend API")
- `APP_VERSION` - Application version (default: "0.1.0")
- `DEBUG` - Debug mode (default: false)
- `HOST` - Server host (default: "0.0.0.0")
- `PORT` - Server port (default: 8000)
- `LOG_LEVEL` - Log verbosity (default: "INFO")
- `CORS_ORIGINS` - Allowed CORS origins (default: ["http://localhost:3000"])

## Project Structure

```
src/backend/
├── __init__.py
├── main.py              # FastAPI application and entry point
├── config.py            # Configuration management
├── logging_config.py    # Structured logging setup
└── routes/              # API route modules
    ├── __init__.py
    ├── health.py        # Health check endpoints
    └── api.py           # Main API endpoints
```

## Notes

- Linting and type checks ignore `.agents/` (skills content)
- Uses structured JSON logging for production
- Python 3.13+ required
