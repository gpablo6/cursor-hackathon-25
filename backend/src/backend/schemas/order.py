"""Pydantic schemas for order endpoints."""

from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field, field_validator


class OrderItemCreate(BaseModel):
    """
    Schema for creating an order item.
    
    Represents a single item in an order with its name, quantity, and price.
    """
    
    name: str = Field(
        ...,
        min_length=1,
        max_length=255,
        description="Name of the menu item",
        examples=["Burger", "Fries", "Soda"]
    )
    amount: int = Field(
        ...,
        gt=0,
        description="Quantity of this item",
        examples=[1, 2, 3]
    )
    price: float = Field(
        ...,
        gt=0,
        description="Price per unit in USD (max 2 decimal places)",
        examples=[12.50, 5.00, 3.99]
    )
    
    model_config = ConfigDict(
        json_schema_extra={
            "examples": [
                {
                    "name": "Burger",
                    "amount": 2,
                    "price": 12.50
                },
                {
                    "name": "Fries",
                    "amount": 1,
                    "price": 5.00
                }
            ]
        }
    )
    
    @field_validator("price")
    @classmethod
    def validate_price(cls, v: float) -> float:
        """Validate price has at most 2 decimal places."""
        if round(v, 2) != v:
            raise ValueError("Price must have at most 2 decimal places")
        return v


class OrderItemResponse(BaseModel):
    """
    Schema for order item response.
    
    Represents an order item as returned by the API.
    """
    
    id: int = Field(..., description="Unique identifier for the order item")
    name: str = Field(..., description="Name of the menu item")
    amount: int = Field(..., description="Quantity ordered")
    price: float = Field(..., description="Price per unit in USD")
    
    model_config = ConfigDict(
        from_attributes=True,
        json_schema_extra={
            "examples": [
                {
                    "id": 1,
                    "name": "Burger",
                    "amount": 2,
                    "price": 12.50
                }
            ]
        }
    )


class OrderCreate(BaseModel):
    """
    Schema for creating an order.
    
    Used to create a new restaurant order for a specific table.
    """
    
    table_number: int = Field(
        ...,
        gt=0,
        description="Table number where the order is placed",
        examples=[1, 5, 10]
    )
    items: list[OrderItemCreate] = Field(
        ...,
        min_length=1,
        description="List of items in the order (at least one required)"
    )
    
    model_config = ConfigDict(
        json_schema_extra={
            "examples": [
                {
                    "table_number": 5,
                    "items": [
                        {
                            "name": "Burger",
                            "amount": 2,
                            "price": 12.50
                        },
                        {
                            "name": "Fries",
                            "amount": 1,
                            "price": 5.00
                        }
                    ]
                },
                {
                    "table_number": 3,
                    "items": [
                        {
                            "name": "Pizza Margherita",
                            "amount": 1,
                            "price": 15.00
                        },
                        {
                            "name": "Soda",
                            "amount": 2,
                            "price": 3.50
                        }
                    ]
                }
            ]
        }
    )


class OrderResponse(BaseModel):
    """
    Schema for order response.
    
    Represents a complete order as returned by the API, including all items
    and the calculated total.
    """
    
    id: int = Field(..., description="Unique identifier for the order")
    table_number: int = Field(..., description="Table number")
    status: str = Field(
        ...,
        description="Order status (pending, in_progress, or ready)"
    )
    items: list[OrderItemResponse] = Field(
        ...,
        description="List of items in the order"
    )
    total: float = Field(
        ...,
        description="Total price in USD (automatically calculated)"
    )
    created_at: datetime = Field(
        ...,
        description="Timestamp when the order was created"
    )
    
    model_config = ConfigDict(
        from_attributes=True,
        arbitrary_types_allowed=True,
        json_schema_extra={
            "examples": [
                {
                    "id": 1,
                    "table_number": 5,
                    "status": "pending",
                    "items": [
                        {
                            "id": 1,
                            "name": "Burger",
                            "amount": 2,
                            "price": 12.50
                        },
                        {
                            "id": 2,
                            "name": "Fries",
                            "amount": 1,
                            "price": 5.00
                        }
                    ],
                    "total": 30.00,
                    "created_at": "2026-01-31T19:45:00.000000Z"
                }
            ]
        }
    )
