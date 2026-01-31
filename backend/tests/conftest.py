"""Pytest configuration and fixtures."""

from collections.abc import Generator

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker

from backend.database import Base, get_db
from backend.main import create_app


@pytest.fixture(scope="function")
def test_engine():
    """Create a test database engine."""
    import tempfile
    import os
    
    # Import models to register them with Base.metadata
    from backend.models import order  # noqa: F401
    
    # Create a temporary file for the test database
    db_fd, db_path = tempfile.mkstemp(suffix=".db")
    
    engine = create_engine(
        f"sqlite:///{db_path}",
        connect_args={"check_same_thread": False}
    )
    Base.metadata.create_all(bind=engine)
    yield engine
    Base.metadata.drop_all(bind=engine)
    engine.dispose()
    
    # Clean up the temporary database file
    os.close(db_fd)
    os.unlink(db_path)


@pytest.fixture
def test_db(test_engine) -> Generator[Session, None, None]:
    """Create a test database session."""
    TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=test_engine)
    db = TestingSessionLocal()
    try:
        yield db
        db.rollback()  # Rollback any uncommitted changes
    finally:
        db.close()


@pytest.fixture
def client(test_engine) -> Generator[TestClient, None, None]:
    """Create a test client for the FastAPI application."""
    from fastapi import FastAPI
    from backend.routes import health, orders
    from backend.config import settings
    
    # Create app without lifespan to avoid database initialization
    app = FastAPI(
        title=settings.app_name,
        version=settings.app_version,
        debug=settings.debug,
    )
    
    # Include routers
    app.include_router(health.router, tags=["health"])
    app.include_router(orders.router, prefix="/api/v1", tags=["orders"])
    
    # Create a session factory for the test engine
    TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=test_engine)
    
    def override_get_db():
        db = TestingSessionLocal()
        try:
            yield db
        finally:
            db.close()
    
    app.dependency_overrides[get_db] = override_get_db
    
    with TestClient(app) as test_client:
        yield test_client
    
    app.dependency_overrides.clear()
