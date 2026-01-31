"""Tests for API endpoints."""

from fastapi.testclient import TestClient


def test_get_example(client: TestClient) -> None:
    """Test the GET example endpoint."""
    response = client.get("/api/v1/example")
    assert response.status_code == 200

    data = response.json()
    assert "message" in data
    assert "data" in data
    assert data["data"]["status"] == "success"


def test_create_example(client: TestClient) -> None:
    """Test the POST example endpoint with valid data."""
    payload = {"name": "test", "value": 42}
    response = client.post("/api/v1/example", json=payload)
    assert response.status_code == 201

    data = response.json()
    assert "message" in data
    assert "test" in data["message"]
    assert data["data"]["name"] == "test"
    assert data["data"]["value"] == 42


def test_create_example_validation_error(client: TestClient) -> None:
    """Test the POST example endpoint with invalid data."""
    # Missing required field
    response = client.post("/api/v1/example", json={"name": "test"})
    assert response.status_code == 422

    # Invalid value (negative)
    response = client.post("/api/v1/example", json={"name": "test", "value": -1})
    assert response.status_code == 422

    # Empty name
    response = client.post("/api/v1/example", json={"name": "", "value": 1})
    assert response.status_code == 422


def test_get_example_by_id(client: TestClient) -> None:
    """Test the GET example by ID endpoint."""
    response = client.get("/api/v1/example/123")
    assert response.status_code == 200

    data = response.json()
    assert "message" in data
    assert "123" in data["message"]
    assert data["data"]["id"] == 123


def test_get_example_by_id_invalid(client: TestClient) -> None:
    """Test the GET example by ID endpoint with invalid ID."""
    response = client.get("/api/v1/example/0")
    assert response.status_code == 400

    data = response.json()
    assert "detail" in data
    assert "positive" in data["detail"].lower()
