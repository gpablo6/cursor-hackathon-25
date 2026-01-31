# Orders API Documentation

## Overview

The Orders API provides endpoints for managing restaurant orders in the backoffice application.

## Data Models

### Order

An order represents a customer's order at a specific table.

**Fields:**
- `id` (integer): Unique identifier for the order
- `table_number` (integer): Table number (must be > 0)
- `status` (string): Order status - one of: `pending`, `in_progress`, `ready`
- `items` (array): List of order items
- `total` (float): Total price in USD (calculated automatically)
- `created_at` (datetime): Timestamp when the order was created

### OrderItem

An item within an order.

**Fields:**
- `id` (integer): Unique identifier for the item
- `name` (string): Name of the item (1-255 characters)
- `amount` (integer): Quantity ordered (must be > 0)
- `price` (float): Price per unit in USD (must be > 0, max 2 decimal places)

## Endpoints

### Overview

The Orders API provides four main endpoints:
1. **POST /api/v1/orders** - Create a new order
2. **GET /api/v1/orders/pending** - Get all pending orders
3. **DELETE /api/v1/orders/{order_id}** - Cancel an order
4. **PATCH /api/v1/orders/{order_id}/complete** - Mark an order as completed

### POST /api/v1/orders

Create a new order.

**Request Body:**
```json
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
}
```

**Response:** `201 Created`
```json
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
```

**Validation Rules:**
- `table_number` must be greater than 0
- `items` array must contain at least 1 item
- Each item's `name` must be 1-255 characters
- Each item's `amount` must be greater than 0
- Each item's `price` must be greater than 0 and have at most 2 decimal places

### GET /api/v1/orders/pending

Retrieve all orders with `pending` status, ordered by creation time (oldest first).

**Response:** `200 OK`
```json
[
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
```

### DELETE /api/v1/orders/{order_id}

Cancel an order before it's completed.

**Path Parameters:**
- `order_id` (integer, required): The ID of the order to cancel

**Response:** `200 OK`
```json
{
  "id": 1,
  "table_number": 5,
  "status": "cancelled",
  "items": [
    {
      "id": 1,
      "name": "Burger",
      "amount": 2,
      "price": 12.50
    }
  ],
  "total": 25.00,
  "created_at": "2026-01-31T19:45:00.000000Z"
}
```

**Business Rules:**
- Only orders with status `pending`, `in_progress`, or `ready` can be cancelled
- Already completed orders cannot be cancelled (returns 400)
- Already cancelled orders will return an error (returns 400)
- The order is marked as `cancelled` but not deleted from the database

**Use Cases:**
- Customer leaves before order is sent to kitchen
- Order was entered incorrectly and needs to be voided
- Customer changes their mind

**Error Responses:**
- `404 Not Found`: Order with the given ID doesn't exist
- `400 Bad Request`: Order cannot be cancelled (already completed or cancelled)

### PATCH /api/v1/orders/{order_id}/complete

Mark an order as completed when it has been delivered to the customer.

**Path Parameters:**
- `order_id` (integer, required): The ID of the order to complete

**Response:** `200 OK`
```json
{
  "id": 1,
  "table_number": 5,
  "status": "completed",
  "items": [
    {
      "id": 1,
      "name": "Burger",
      "amount": 2,
      "price": 12.50
    }
  ],
  "total": 25.00,
  "created_at": "2026-01-31T19:45:00.000000Z"
}
```

**Business Rules:**
- Orders in any status except `cancelled` can be marked as completed
- Already completed orders will return success (idempotent operation)
- Cancelled orders cannot be completed (returns 400)
- The order status is updated to `completed`

**Use Cases:**
- Order has been delivered to the table
- Customer has received their food
- Transaction is complete and ready for billing

**Idempotency:**
This endpoint is idempotent - calling it multiple times on an already completed order will return success without error.

**Error Responses:**
- `404 Not Found`: Order with the given ID doesn't exist
- `400 Bad Request`: Order cannot be completed (cancelled orders)

## Order Status Flow

```
pending → in_progress → ready → completed
   ↓           ↓          ↓
cancelled   cancelled  cancelled
```

**Status Descriptions:**
- `pending`: Order has been created but not yet started
- `in_progress`: Order is being prepared in the kitchen
- `ready`: Order is ready for delivery
- `completed`: Order has been delivered to the customer
- `cancelled`: Order has been cancelled and will not be fulfilled

## Error Responses

### 422 Unprocessable Entity

Returned when request validation fails.

```json
{
  "detail": [
    {
      "type": "greater_than",
      "loc": ["body", "table_number"],
      "msg": "Input should be greater than 0",
      "input": 0
    }
  ]
}
```

### 500 Internal Server Error

Returned when an unexpected error occurs.

```json
{
  "detail": "Failed to create order"
}
```

## Database

The application uses SQLite for local development. The database file is created at `./restaurant.db`.

### Tables

**orders**
- `id` INTEGER PRIMARY KEY
- `table_number` INTEGER NOT NULL
- `status` VARCHAR (ENUM: pending, in_progress, ready)
- `created_at` DATETIME NOT NULL

**order_items**
- `id` INTEGER PRIMARY KEY
- `order_id` INTEGER NOT NULL (FK to orders.id)
- `name` VARCHAR(255) NOT NULL
- `amount` INTEGER NOT NULL
- `price` NUMERIC(10, 2) NOT NULL

## Running the Application

1. Install dependencies:
```bash
uv sync --all-extras
```

2. Run the server:
```bash
uv run python -m backend.main
```

The API will be available at `http://localhost:8000`.

API documentation is available at:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Running Tests

Run all tests:
```bash
uv run pytest
```

Run only order tests:
```bash
uv run pytest tests/test_orders.py -v
```

Run with coverage:
```bash
uv run pytest --cov=backend --cov-report=html
```
