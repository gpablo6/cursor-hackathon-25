"""Main API endpoints."""

from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, Field

router = APIRouter()


class ExampleRequest(BaseModel):
    """Example request model."""

    name: str = Field(..., min_length=1, max_length=100, description="Name field")
    value: int = Field(..., ge=0, description="Value must be non-negative")


class ExampleResponse(BaseModel):
    """Example response model."""

    message: str
    data: dict[str, str | int]


@router.get("/example", response_model=ExampleResponse)
async def get_example() -> ExampleResponse:
    """
    Example GET endpoint.

    Returns a sample response demonstrating the API structure.
    """
    return ExampleResponse(
        message="This is an example endpoint",
        data={"status": "success", "count": 0},
    )


@router.post("/example", response_model=ExampleResponse, status_code=status.HTTP_201_CREATED)
async def create_example(request: ExampleRequest) -> ExampleResponse:
    """
    Example POST endpoint.

    Accepts a request body and returns a response.
    """
    return ExampleResponse(
        message=f"Created example for {request.name}",
        data={"name": request.name, "value": request.value},
    )


@router.get("/example/{item_id}", response_model=ExampleResponse)
async def get_example_by_id(item_id: int) -> ExampleResponse:
    """
    Example GET endpoint with path parameter.

    Args:
        item_id: The ID of the item to retrieve

    Raises:
        HTTPException: If item_id is invalid
    """
    if item_id < 1:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Item ID must be positive",
        )

    return ExampleResponse(
        message=f"Retrieved item {item_id}",
        data={"id": item_id, "status": "found"},
    )
