"""
OpenAPI documentation for the Orders API.

Centralizes tags, operation metadata, and response examples so that:
- Routes stay focused on business logic
- Docs are consistent and easy to update
- Swagger UI is easier to navigate with operation_id and clear tags
"""

# ---------------------------------------------------------------------------
# Tag (used in main.py openapi_tags and on router)
# ---------------------------------------------------------------------------

ORDERS_TAG = "Orders"

# ---------------------------------------------------------------------------
# Reusable response examples (single source of truth)
# ---------------------------------------------------------------------------

ORDER_RESPONSE_EXAMPLE = {
    "id": 1,
    "table_number": 5,
    "status": "pending",
    "items": [
        {"id": 1, "name": "Burger", "amount": 2, "price": 12.50},
        {"id": 2, "name": "Fries", "amount": 1, "price": 5.00},
    ],
    "total": 30.00,
    "created_at": "2026-01-31T19:45:00.000000Z",
}

ORDER_CANCELLED_EXAMPLE = {**ORDER_RESPONSE_EXAMPLE, "status": "cancelled"}
ORDER_COMPLETED_EXAMPLE = {**ORDER_RESPONSE_EXAMPLE, "status": "completed"}

PENDING_ORDERS_EXAMPLE = [
    {**ORDER_RESPONSE_EXAMPLE, "total": 25.00},
    {
        "id": 2,
        "table_number": 3,
        "status": "pending",
        "items": [{"id": 3, "name": "Pizza", "amount": 1, "price": 15.00}],
        "total": 15.00,
        "created_at": "2026-01-31T19:46:00.000000Z",
    },
]

ERROR_404_ORDER = {"detail": "Order with id 123 not found"}
ERROR_422_VALIDATION = {
    "detail": [
        {
            "type": "greater_than",
            "loc": ["body", "table_number"],
            "msg": "Input should be greater than 0",
            "input": 0,
        }
    ]
}
ERROR_500_CREATE = {"detail": "Failed to create order"}
ERROR_500_PENDING = {"detail": "Failed to retrieve pending orders"}
ERROR_500_CANCEL = {"detail": "Failed to cancel order"}
ERROR_500_COMPLETE = {"detail": "Failed to complete order"}
ERROR_400_ALREADY_CANCELLED = {"detail": "Order is already cancelled"}
ERROR_400_COMPLETED_NO_CANCEL = {"detail": "Completed orders cannot be cancelled"}
ERROR_400_CANCELLED_NO_COMPLETE = {"detail": "Cancelled orders cannot be completed"}

# ---------------------------------------------------------------------------
# Response spec builders (for consistent 200/404/400/422/500 in routes)
# ---------------------------------------------------------------------------


def _json_content(example: dict) -> dict:
    return {"application/json": {"example": example}}


def _json_content_examples(examples: dict[str, dict]) -> dict:
    return {
        "application/json": {
            "examples": {k: {"summary": k.replace("_", " ").title(), "value": v} for k, v in examples.items()}
        }
    }


def response_201_order() -> dict:
    return {
        201: {"description": "Order created successfully", "content": _json_content(ORDER_RESPONSE_EXAMPLE)},
        422: {"description": "Validation error", "content": _json_content(ERROR_422_VALIDATION)},
        500: {"description": "Internal server error", "content": _json_content(ERROR_500_CREATE)},
    }


def response_200_order_cancelled() -> dict:
    return {
        200: {"description": "Order cancelled successfully", "content": _json_content(ORDER_CANCELLED_EXAMPLE)},
        404: {"description": "Order not found", "content": _json_content(ERROR_404_ORDER)},
        400: {
            "description": "Order cannot be cancelled",
            "content": _json_content_examples({
                "already_cancelled": ERROR_400_ALREADY_CANCELLED,
                "already_completed": ERROR_400_COMPLETED_NO_CANCEL,
            }),
        },
        500: {"description": "Internal server error", "content": _json_content(ERROR_500_CANCEL)},
    }


def response_200_order_completed() -> dict:
    return {
        200: {"description": "Order completed successfully", "content": _json_content(ORDER_COMPLETED_EXAMPLE)},
        404: {"description": "Order not found", "content": _json_content(ERROR_404_ORDER)},
        400: {"description": "Order cannot be completed", "content": _json_content(ERROR_400_CANCELLED_NO_COMPLETE)},
        500: {"description": "Internal server error", "content": _json_content(ERROR_500_COMPLETE)},
    }


def response_200_pending_list() -> dict:
    return {
        200: {
            "description": "List of pending orders (or empty list)",
            "content": {
                "application/json": {
                    "examples": {
                        "with_orders": {"summary": "Multiple pending orders", "value": PENDING_ORDERS_EXAMPLE},
                        "empty": {"summary": "No pending orders", "value": []},
                    }
                }
            },
        },
        500: {"description": "Internal server error", "content": _json_content(ERROR_500_PENDING)},
    }


# ---------------------------------------------------------------------------
# Operation metadata: summary + description (for use in route decorators)
# ---------------------------------------------------------------------------

CREATE_ORDER = {
    "summary": "Create a new order",
    "description": """
Create a new restaurant order for a specific table.

The order is created with status **pending**; the total is calculated from items.

**Validation:** Table number > 0; at least one item; item name 1–255 chars; amount > 0; price positive, max 2 decimals.
""".strip(),
    "response_description": "The created order with items and total",
    "responses": response_201_order,
}

LIST_PENDING_ORDERS = {
    "summary": "List pending orders",
    "description": """
Return all orders with status **pending**, sorted by creation time (oldest first).

Use this to process orders in the order they were received (e.g. kitchen display).
""".strip(),
    "response_description": "List of pending orders (may be empty)",
    "responses": response_200_pending_list,
}

CANCEL_ORDER = {
    "summary": "Cancel an order",
    "description": """
Cancel an order that is not yet completed. The order is set to **cancelled** (not deleted).

**Allowed statuses:** pending, in_progress, ready. Completed or already cancelled orders return 400.
""".strip(),
    "response_description": "The cancelled order",
    "responses": response_200_order_cancelled,
}

COMPLETE_ORDER = {
    "summary": "Mark order as completed",
    "description": """
Mark an order as **completed** (e.g. delivered to the table). Idempotent: calling again on an already completed order returns success.
""".strip(),
    "response_description": "The completed order",
    "responses": response_200_order_completed,
}
