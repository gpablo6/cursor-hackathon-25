"""Tests for orders endpoints and models."""

from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from backend.models.order import Order, OrderItem, OrderStatus


class TestOrderModel:
    """Test Order and OrderItem models."""
    
    def test_create_order_with_items(self, test_db: Session):
        """Test creating an order with items."""
        order = Order(
            table_number=5,
            status=OrderStatus.PENDING,
        )
        
        item1 = OrderItem(
            name="Burger",
            amount=2,
            price=12.50,
            order=order
        )
        
        item2 = OrderItem(
            name="Fries",
            amount=1,
            price=5.00,
            order=order
        )
        
        test_db.add(order)
        test_db.commit()
        test_db.refresh(order)
        
        assert order.id is not None
        assert order.table_number == 5
        assert order.status == OrderStatus.PENDING
        assert len(order.items) == 2
        assert order.total == 30.00  # (2 * 12.50) + (1 * 5.00)
    
    def test_order_total_calculation(self, test_db: Session):
        """Test that order total is calculated correctly."""
        order = Order(table_number=3, status=OrderStatus.PENDING)
        
        OrderItem(name="Pizza", amount=3, price=15.00, order=order)
        OrderItem(name="Soda", amount=2, price=3.50, order=order)
        
        test_db.add(order)
        test_db.commit()
        test_db.refresh(order)
        
        assert order.total == 52.00  # (3 * 15.00) + (2 * 3.50)
    
    def test_order_status_enum(self, test_db: Session):
        """Test order status transitions."""
        order = Order(table_number=1, status=OrderStatus.PENDING)
        test_db.add(order)
        test_db.commit()
        
        assert order.status == OrderStatus.PENDING
        
        order.status = OrderStatus.IN_PROGRESS
        test_db.commit()
        assert order.status == OrderStatus.IN_PROGRESS
        
        order.status = OrderStatus.READY
        test_db.commit()
        assert order.status == OrderStatus.READY


class TestCreateOrderEndpoint:
    """Test POST /api/v1/orders endpoint."""
    
    def test_create_order_success(self, client: TestClient):
        """Test creating a new order successfully."""
        order_data = {
            "table_number": 5,
            "items": [
                {"name": "Burger", "amount": 2, "price": 12.50},
                {"name": "Fries", "amount": 1, "price": 5.00}
            ]
        }
        
        response = client.post("/api/v1/orders", json=order_data)
        
        assert response.status_code == 201
        data = response.json()
        assert data["table_number"] == 5
        assert data["status"] == "pending"
        assert len(data["items"]) == 2
        assert data["total"] == 30.00
        assert "id" in data
        assert "created_at" in data
    
    def test_create_order_with_single_item(self, client: TestClient):
        """Test creating an order with a single item."""
        order_data = {
            "table_number": 3,
            "items": [
                {"name": "Steak", "amount": 1, "price": 25.00}
            ]
        }
        
        response = client.post("/api/v1/orders", json=order_data)
        
        assert response.status_code == 201
        data = response.json()
        assert data["total"] == 25.00
    
    def test_create_order_empty_items(self, client: TestClient):
        """Test that creating an order with no items fails."""
        order_data = {
            "table_number": 2,
            "items": []
        }
        
        response = client.post("/api/v1/orders", json=order_data)
        
        assert response.status_code == 422
    
    def test_create_order_invalid_table_number(self, client: TestClient):
        """Test that invalid table number fails validation."""
        order_data = {
            "table_number": 0,
            "items": [
                {"name": "Coffee", "amount": 1, "price": 3.00}
            ]
        }
        
        response = client.post("/api/v1/orders", json=order_data)
        
        assert response.status_code == 422
    
    def test_create_order_invalid_item_amount(self, client: TestClient):
        """Test that invalid item amount fails validation."""
        order_data = {
            "table_number": 5,
            "items": [
                {"name": "Pasta", "amount": 0, "price": 15.00}
            ]
        }
        
        response = client.post("/api/v1/orders", json=order_data)
        
        assert response.status_code == 422
    
    def test_create_order_invalid_price(self, client: TestClient):
        """Test that negative price fails validation."""
        order_data = {
            "table_number": 5,
            "items": [
                {"name": "Salad", "amount": 1, "price": -10.00}
            ]
        }
        
        response = client.post("/api/v1/orders", json=order_data)
        
        assert response.status_code == 422


class TestGetPendingOrdersEndpoint:
    """Test GET /api/v1/orders/pending endpoint."""
    
    def test_get_pending_orders_empty(self, client: TestClient):
        """Test getting pending orders when none exist."""
        response = client.get("/api/v1/orders/pending")
        
        assert response.status_code == 200
        data = response.json()
        assert data == []
    
    def test_get_pending_orders(self, client: TestClient):
        """Test getting all pending orders."""
        # Create multiple orders with different statuses
        orders_data = [
            {
                "table_number": 1,
                "items": [{"name": "Coffee", "amount": 1, "price": 3.00}]
            },
            {
                "table_number": 2,
                "items": [{"name": "Tea", "amount": 2, "price": 2.50}]
            },
            {
                "table_number": 3,
                "items": [{"name": "Juice", "amount": 1, "price": 4.00}]
            }
        ]
        
        created_ids = []
        for order_data in orders_data:
            response = client.post("/api/v1/orders", json=order_data)
            assert response.status_code == 201
            created_ids.append(response.json()["id"])
        
        # Get pending orders
        response = client.get("/api/v1/orders/pending")
        
        assert response.status_code == 200
        data = response.json()
        assert len(data) == 3
        assert all(order["status"] == "pending" for order in data)
        assert {order["table_number"] for order in data} == {1, 2, 3}
    
    def test_get_pending_orders_filters_other_statuses(self, client: TestClient, test_db: Session):
        """Test that only pending orders are returned."""
        # Create a pending order
        pending_order_data = {
            "table_number": 5,
            "items": [{"name": "Burger", "amount": 1, "price": 12.00}]
        }
        response = client.post("/api/v1/orders", json=pending_order_data)
        assert response.status_code == 201
        
        # Manually create orders with other statuses
        in_progress_order = Order(table_number=6, status=OrderStatus.IN_PROGRESS)
        OrderItem(name="Pizza", amount=1, price=15.00, order=in_progress_order)
        
        ready_order = Order(table_number=7, status=OrderStatus.READY)
        OrderItem(name="Pasta", amount=1, price=18.00, order=ready_order)
        
        test_db.add_all([in_progress_order, ready_order])
        test_db.commit()
        
        # Get pending orders
        response = client.get("/api/v1/orders/pending")
        
        assert response.status_code == 200
        data = response.json()
        assert len(data) == 1
        assert data[0]["status"] == "pending"
        assert data[0]["table_number"] == 5
    
    def test_pending_orders_include_all_fields(self, client: TestClient):
        """Test that pending orders include all required fields."""
        order_data = {
            "table_number": 10,
            "items": [
                {"name": "Steak", "amount": 1, "price": 30.00},
                {"name": "Wine", "amount": 2, "price": 8.00}
            ]
        }
        
        client.post("/api/v1/orders", json=order_data)
        
        response = client.get("/api/v1/orders/pending")
        
        assert response.status_code == 200
        data = response.json()
        assert len(data) == 1
        
        order = data[0]
        assert "id" in order
        assert "table_number" in order
        assert "status" in order
        assert "items" in order
        assert "total" in order
        assert "created_at" in order
        assert order["total"] == 46.00
        assert len(order["items"]) == 2


class TestCancelOrderEndpoint:
    """Test DELETE /api/v1/orders/{order_id} endpoint."""
    
    def test_cancel_order_success(self, client: TestClient):
        """Test cancelling an order successfully."""
        # Create an order first
        order_data = {
            "table_number": 5,
            "items": [{"name": "Burger", "amount": 1, "price": 12.50}]
        }
        create_response = client.post("/api/v1/orders", json=order_data)
        assert create_response.status_code == 201
        order_id = create_response.json()["id"]
        
        # Cancel the order
        response = client.delete(f"/api/v1/orders/{order_id}")
        
        assert response.status_code == 200
        data = response.json()
        assert data["id"] == order_id
        assert data["status"] == "cancelled"
        assert data["table_number"] == 5
    
    def test_cancel_order_not_found(self, client: TestClient):
        """Test cancelling a non-existent order."""
        response = client.delete("/api/v1/orders/99999")
        
        assert response.status_code == 404
        assert "not found" in response.json()["detail"].lower()
    
    def test_cancel_already_completed_order(self, client: TestClient, test_db: Session):
        """Test that completed orders cannot be cancelled."""
        # Create and complete an order
        order = Order(table_number=5, status=OrderStatus.COMPLETED)
        OrderItem(name="Burger", amount=1, price=12.50, order=order)
        test_db.add(order)
        test_db.commit()
        test_db.refresh(order)
        
        # Try to cancel it
        response = client.delete(f"/api/v1/orders/{order.id}")
        
        assert response.status_code == 400
        assert "cannot be cancelled" in response.json()["detail"].lower()
    
    def test_cancel_already_cancelled_order(self, client: TestClient, test_db: Session):
        """Test that already cancelled orders cannot be cancelled again."""
        # Create a cancelled order
        order = Order(table_number=5, status=OrderStatus.CANCELLED)
        OrderItem(name="Burger", amount=1, price=12.50, order=order)
        test_db.add(order)
        test_db.commit()
        test_db.refresh(order)
        
        # Try to cancel it again
        response = client.delete(f"/api/v1/orders/{order.id}")
        
        assert response.status_code == 400
        assert "already cancelled" in response.json()["detail"].lower()
    
    def test_cancel_pending_order(self, client: TestClient):
        """Test cancelling a pending order."""
        # Create a pending order
        order_data = {
            "table_number": 3,
            "items": [{"name": "Pizza", "amount": 1, "price": 15.00}]
        }
        create_response = client.post("/api/v1/orders", json=order_data)
        order_id = create_response.json()["id"]
        
        # Cancel it
        response = client.delete(f"/api/v1/orders/{order_id}")
        
        assert response.status_code == 200
        assert response.json()["status"] == "cancelled"
    
    def test_cancel_in_progress_order(self, client: TestClient, test_db: Session):
        """Test cancelling an in-progress order."""
        # Create an in-progress order
        order = Order(table_number=5, status=OrderStatus.IN_PROGRESS)
        OrderItem(name="Burger", amount=1, price=12.50, order=order)
        test_db.add(order)
        test_db.commit()
        test_db.refresh(order)
        
        # Cancel it
        response = client.delete(f"/api/v1/orders/{order.id}")
        
        assert response.status_code == 200
        assert response.json()["status"] == "cancelled"
    
    def test_cancelled_order_not_in_pending_list(self, client: TestClient):
        """Test that cancelled orders don't appear in pending list."""
        # Create and cancel an order
        order_data = {
            "table_number": 5,
            "items": [{"name": "Burger", "amount": 1, "price": 12.50}]
        }
        create_response = client.post("/api/v1/orders", json=order_data)
        order_id = create_response.json()["id"]
        client.delete(f"/api/v1/orders/{order_id}")
        
        # Check pending orders
        response = client.get("/api/v1/orders/pending")
        
        assert response.status_code == 200
        pending_orders = response.json()
        assert all(order["id"] != order_id for order in pending_orders)


class TestCompleteOrderEndpoint:
    """Test PATCH /api/v1/orders/{order_id}/complete endpoint."""
    
    def test_complete_order_success(self, client: TestClient, test_db: Session):
        """Test completing an order successfully."""
        # Create a ready order
        order = Order(table_number=5, status=OrderStatus.READY)
        OrderItem(name="Burger", amount=1, price=12.50, order=order)
        test_db.add(order)
        test_db.commit()
        test_db.refresh(order)
        
        # Complete the order
        response = client.patch(f"/api/v1/orders/{order.id}/complete")
        
        assert response.status_code == 200
        data = response.json()
        assert data["id"] == order.id
        assert data["status"] == "completed"
        assert data["table_number"] == 5
    
    def test_complete_order_not_found(self, client: TestClient):
        """Test completing a non-existent order."""
        response = client.patch("/api/v1/orders/99999/complete")
        
        assert response.status_code == 404
        assert "not found" in response.json()["detail"].lower()
    
    def test_complete_already_completed_order(self, client: TestClient, test_db: Session):
        """Test that already completed orders return success (idempotent)."""
        # Create a completed order
        order = Order(table_number=5, status=OrderStatus.COMPLETED)
        OrderItem(name="Burger", amount=1, price=12.50, order=order)
        test_db.add(order)
        test_db.commit()
        test_db.refresh(order)
        
        # Try to complete it again
        response = client.patch(f"/api/v1/orders/{order.id}/complete")
        
        assert response.status_code == 200
        assert response.json()["status"] == "completed"
    
    def test_complete_cancelled_order(self, client: TestClient, test_db: Session):
        """Test that cancelled orders cannot be completed."""
        # Create a cancelled order
        order = Order(table_number=5, status=OrderStatus.CANCELLED)
        OrderItem(name="Burger", amount=1, price=12.50, order=order)
        test_db.add(order)
        test_db.commit()
        test_db.refresh(order)
        
        # Try to complete it
        response = client.patch(f"/api/v1/orders/{order.id}/complete")
        
        assert response.status_code == 400
        assert "cannot be completed" in response.json()["detail"].lower()
    
    def test_complete_pending_order(self, client: TestClient):
        """Test completing a pending order (should work)."""
        # Create a pending order
        order_data = {
            "table_number": 3,
            "items": [{"name": "Pizza", "amount": 1, "price": 15.00}]
        }
        create_response = client.post("/api/v1/orders", json=order_data)
        order_id = create_response.json()["id"]
        
        # Complete it
        response = client.patch(f"/api/v1/orders/{order_id}/complete")
        
        assert response.status_code == 200
        assert response.json()["status"] == "completed"
    
    def test_complete_in_progress_order(self, client: TestClient, test_db: Session):
        """Test completing an in-progress order."""
        # Create an in-progress order
        order = Order(table_number=5, status=OrderStatus.IN_PROGRESS)
        OrderItem(name="Burger", amount=1, price=12.50, order=order)
        test_db.add(order)
        test_db.commit()
        test_db.refresh(order)
        
        # Complete it
        response = client.patch(f"/api/v1/orders/{order.id}/complete")
        
        assert response.status_code == 200
        assert response.json()["status"] == "completed"
    
    def test_completed_order_not_in_pending_list(self, client: TestClient):
        """Test that completed orders don't appear in pending list."""
        # Create and complete an order
        order_data = {
            "table_number": 5,
            "items": [{"name": "Burger", "amount": 1, "price": 12.50}]
        }
        create_response = client.post("/api/v1/orders", json=order_data)
        order_id = create_response.json()["id"]
        client.patch(f"/api/v1/orders/{order_id}/complete")
        
        # Check pending orders
        response = client.get("/api/v1/orders/pending")
        
        assert response.status_code == 200
        pending_orders = response.json()
        assert all(order["id"] != order_id for order in pending_orders)
    
    def test_complete_order_preserves_data(self, client: TestClient, test_db: Session):
        """Test that completing an order preserves all order data."""
        # Create an order with multiple items
        order = Order(table_number=10, status=OrderStatus.READY)
        OrderItem(name="Burger", amount=2, price=12.50, order=order)
        OrderItem(name="Fries", amount=1, price=5.00, order=order)
        test_db.add(order)
        test_db.commit()
        test_db.refresh(order)
        
        # Complete it
        response = client.patch(f"/api/v1/orders/{order.id}/complete")
        
        assert response.status_code == 200
        data = response.json()
        assert data["table_number"] == 10
        assert len(data["items"]) == 2
        assert data["total"] == 30.00
        assert data["status"] == "completed"
