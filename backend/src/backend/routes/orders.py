"""Orders API endpoints."""

import logging
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, selectinload

from backend.database import get_db
from backend.models.order import Order, OrderItem, OrderStatus
from backend.openapi.orders import (
    CANCEL_ORDER,
    COMPLETE_ORDER,
    CREATE_ORDER,
    LIST_PENDING_ORDERS,
    ORDERS_TAG,
    response_200_order_cancelled,
    response_200_order_completed,
    response_200_pending_list,
    response_201_order,
)
from backend.schemas.order import OrderCreate, OrderResponse

router = APIRouter(tags=[ORDERS_TAG])
logger = logging.getLogger(__name__)


def get_order_or_404(db: Session, order_id: int) -> Order:
    """
    Get an order by ID or raise 404.

    Args:
        db: Database session
        order_id: Order ID

    Returns:
        Order instance

    Raises:
        HTTPException: If order not found
    """
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Order with id {order_id} not found",
        )
    return order


@router.post(
    "/orders",
    response_model=OrderResponse,
    status_code=status.HTTP_201_CREATED,
    operation_id="create_order",
    summary=CREATE_ORDER["summary"],
    description=CREATE_ORDER["description"],
    response_description=CREATE_ORDER["response_description"],
    responses=response_201_order(),
)
def create_order(
    order_data: OrderCreate,
    db: Annotated[Session, Depends(get_db)],
) -> Order:
    """Create a new restaurant order."""
    try:
        # Create order
        order = Order(
            table_number=order_data.table_number,
            status=OrderStatus.PENDING,
        )

        # Create order items
        for item_data in order_data.items:
            order_item = OrderItem(
                name=item_data.name,
                amount=item_data.amount,
                price=item_data.price,
                order=order,
            )
            db.add(order_item)

        db.add(order)
        db.commit()
        db.refresh(order)

        logger.info(
            "Order created",
            extra={
                "order_id": order.id,
                "table_number": order.table_number,
                "items_count": len(order.items),
                "total": order.total,
            },
        )

        return order

    except Exception as e:
        db.rollback()
        logger.error("Failed to create order", exc_info=e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create order",
        ) from e


@router.get(
    "/orders/pending",
    response_model=list[OrderResponse],
    operation_id="list_pending_orders",
    summary=LIST_PENDING_ORDERS["summary"],
    description=LIST_PENDING_ORDERS["description"],
    response_description=LIST_PENDING_ORDERS["response_description"],
    responses=response_200_pending_list(),
)
def get_pending_orders(
    db: Annotated[Session, Depends(get_db)],
) -> list[Order]:
    """Get all pending orders sorted by creation time."""
    try:
        orders = (
            db.query(Order)
            .options(selectinload(Order.items))
            .filter(Order.status == OrderStatus.PENDING)
            .order_by(Order.created_at.asc())
            .all()
        )

        logger.info(
            "Retrieved pending orders",
            extra={"count": len(orders)},
        )

        return orders

    except Exception as e:
        logger.error("Failed to retrieve pending orders", exc_info=e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve pending orders",
        ) from e


@router.delete(
    "/orders/{order_id}",
    response_model=OrderResponse,
    operation_id="cancel_order",
    summary=CANCEL_ORDER["summary"],
    description=CANCEL_ORDER["description"],
    response_description=CANCEL_ORDER["response_description"],
    responses=response_200_order_cancelled(),
)
def cancel_order(
    order_id: int,
    db: Annotated[Session, Depends(get_db)],
) -> Order:
    """Cancel an order by marking it as cancelled."""
    try:
        # Get the order
        order = get_order_or_404(db, order_id)

        # Check if order can be cancelled
        if order.status == OrderStatus.CANCELLED:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Order is already cancelled",
            )

        if order.status == OrderStatus.COMPLETED:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Completed orders cannot be cancelled",
            )

        # Cancel the order
        old_status = order.status
        order.status = OrderStatus.CANCELLED
        db.commit()
        db.refresh(order)

        logger.info(
            "Order cancelled",
            extra={
                "order_id": order.id,
                "table_number": order.table_number,
                "old_status": old_status.value,
                "new_status": order.status.value,
            },
        )

        return order

    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        logger.error("Failed to cancel order", exc_info=e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to cancel order",
        ) from e


@router.patch(
    "/orders/{order_id}/complete",
    response_model=OrderResponse,
    operation_id="complete_order",
    summary=COMPLETE_ORDER["summary"],
    description=COMPLETE_ORDER["description"],
    response_description=COMPLETE_ORDER["response_description"],
    responses=response_200_order_completed(),
)
def complete_order(
    order_id: int,
    db: Annotated[Session, Depends(get_db)],
) -> Order:
    """Mark an order as completed."""
    try:
        # Get the order
        order = get_order_or_404(db, order_id)

        # Check if order can be completed
        if order.status == OrderStatus.CANCELLED:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Cancelled orders cannot be completed",
            )

        # If already completed, return success (idempotent)
        if order.status == OrderStatus.COMPLETED:
            logger.info(
                "Order already completed",
                extra={
                    "order_id": order.id,
                    "table_number": order.table_number,
                },
            )
            return order

        # Complete the order
        old_status = order.status
        order.status = OrderStatus.COMPLETED
        db.commit()
        db.refresh(order)

        logger.info(
            "Order completed",
            extra={
                "order_id": order.id,
                "table_number": order.table_number,
                "old_status": old_status.value,
                "new_status": order.status.value,
            },
        )

        return order

    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        logger.error("Failed to complete order", exc_info=e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to complete order",
        ) from e
