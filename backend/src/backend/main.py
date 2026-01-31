import logging
from contextlib import asynccontextmanager
from typing import AsyncGenerator

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from backend.config import settings
from backend.database import init_db
from backend.logging_config import configure_logging
from backend.routes import health, orders


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    """Handle application startup and shutdown events."""
    configure_logging(level=settings.log_level)
    logger = logging.getLogger(__name__)
    logger.info(
        "Starting application",
        extra={
            "app_name": settings.app_name,
            "version": settings.app_version,
            "debug": settings.debug,
        },
    )
    # Initialize database
    init_db()
    logger.info("Database initialized")
    yield
    logger.info("Shutting down application")


def create_app() -> FastAPI:
    """Create and configure the FastAPI application."""
    app = FastAPI(
        title=settings.app_name,
        version=settings.app_version,
        debug=settings.debug,
        lifespan=lifespan,
        description="""
        ## Restaurant Backoffice API
        
        A comprehensive API for managing restaurant operations including orders, 
        inventory, and staff management.
        
        ### Features
        
        * **Orders Management**: Create and track customer orders
        * **Real-time Status**: Monitor order status (pending, in progress, ready)
        * **Automatic Calculations**: Total prices calculated automatically
        * **Validation**: Comprehensive input validation for data integrity
        
        ### Getting Started
        
        1. Use the **Orders** endpoints to create and manage orders
        2. Monitor pending orders to process them efficiently
        3. Check the health endpoint to verify API status
        
        ### Authentication
        
        Currently, the API does not require authentication. This will be added in future versions.
        """,
        contact={
            "name": "Restaurant Backoffice Support",
            "email": "support@restaurant-backoffice.com",
        },
        license_info={
            "name": "MIT",
        },
        openapi_tags=[
            {
                "name": "Orders",
                "description": """
                **Orders** – Create orders, list pending orders, cancel, and mark as completed.

                Endpoints are grouped here with stable `operation_id`s for easy discovery:
                `create_order`, `list_pending_orders`, `cancel_order`, `complete_order`.
                """,
            },
            {
                "name": "health",
                "description": "Health check and status endpoints for monitoring API availability.",
            },
        ],
    )

    # Configure CORS
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_credentials=settings.cors_allow_credentials,
        allow_methods=settings.cors_allow_methods,
        allow_headers=settings.cors_allow_headers,
    )

    # Include routers (tags come from each router's APIRouter(tags=[...]))
    app.include_router(health.router, tags=["health"])
    app.include_router(orders.router, prefix="/api/v1")

    return app


app = create_app()


@app.exception_handler(Exception)
async def global_exception_handler(request, exc: Exception) -> JSONResponse:
    """Handle uncaught exceptions globally."""
    logger = logging.getLogger(__name__)
    logger.error(
        "Unhandled exception",
        exc_info=exc,
        extra={"path": request.url.path, "method": request.method},
    )
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error"},
    )


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "backend.main:app",
        host=settings.host,
        port=settings.port,
        reload=settings.debug,
        log_config=None,  # Use our custom logging configuration
    )
