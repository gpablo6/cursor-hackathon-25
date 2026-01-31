# System Architecture

## Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER INTERFACE                          │
│                     (React Frontend - Port 5173)                │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────┐                        ┌──────────────┐      │
│  │ Mesero View  │                        │ Cocina View  │      │
│  │  (Waiter)    │                        │  (Kitchen)   │      │
│  │              │                        │              │      │
│  │ • Select Mesa│                        │ • View Orders│      │
│  │ • Add Items  │                        │ • Update     │      │
│  │ • Send Order │                        │   Status     │      │
│  │ • Pay Mesa   │                        │ • Delete     │      │
│  └──────┬───────┘                        └──────┬───────┘      │
│         │                                       │              │
└─────────┼───────────────────────────────────────┼──────────────┘
          │                                       │
          │ HTTP REST API                         │ HTTP REST API
          │ (JSON)                                │ (JSON)
          │                                       │
┌─────────▼───────────────────────────────────────▼──────────────┐
│                      API LAYER                                  │
│                 (services/ordersApi.ts)                         │
│                                                                 │
│  • createOrder()        • getPendingOrders()                   │
│  • completeOrder()      • deleteOrder()                        │
│                                                                 │
│  Data Transformation (services/orderTransform.ts)              │
│  • Frontend ↔ Backend format conversion                        │
│  • Status mapping                                              │
└─────────────────────────────┬───────────────────────────────────┘
                              │
                              │ HTTP/JSON
                              │
┌─────────────────────────────▼───────────────────────────────────┐
│                      BACKEND API                                │
│                  (FastAPI - Port 8000)                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                    API Endpoints                        │   │
│  │  POST   /api/v1/orders              (Create)           │   │
│  │  GET    /api/v1/orders/pending      (List Pending)     │   │
│  │  PATCH  /api/v1/orders/{id}/complete (Complete)        │   │
│  │  DELETE /api/v1/orders/{id}         (Cancel)           │   │
│  └─────────────────────────────────────────────────────────┘   │
│                              │                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              Business Logic Layer                       │   │
│  │  • Order validation (Pydantic schemas)                  │   │
│  │  • Status management                                    │   │
│  │  • Total calculation                                    │   │
│  └─────────────────────────────────────────────────────────┘   │
│                              │                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              Data Access Layer                          │   │
│  │  • SQLAlchemy ORM                                       │   │
│  │  • Order & OrderItem models                             │   │
│  └─────────────────────────────────────────────────────────┘   │
│                              │                                  │
└──────────────────────────────┼──────────────────────────────────┘
                               │
                               │
┌──────────────────────────────▼──────────────────────────────────┐
│                        DATABASE                                 │
│                   (SQLite - restaurant.db)                      │
│                                                                 │
│  Tables:                                                        │
│  • orders (id, table_number, status, total, created_at)        │
│  • order_items (id, order_id, name, amount, price)             │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow

### 1. Create Order Flow (Waiter → Kitchen)

```
┌──────────┐    1. Click "Enviar"    ┌──────────────┐
│  Waiter  │───────────────────────>│ WaiterView   │
│   View   │                         │  Component   │
└──────────┘                         └──────┬───────┘
                                            │
                                            │ 2. Call API
                                            ▼
                                     ┌──────────────┐
                                     │ ordersApi.   │
                                     │ createOrder()│
                                     └──────┬───────┘
                                            │
                                            │ 3. Transform data
                                            ▼
                                     ┌──────────────┐
                                     │ POST /api/v1/│
                                     │    orders    │
                                     └──────┬───────┘
                                            │
                                            │ 4. Save to DB
                                            ▼
                                     ┌──────────────┐
                                     │   Backend    │
                                     │   Database   │
                                     └──────┬───────┘
                                            │
                                            │ 5. Return order
                                            ▼
                                     ┌──────────────┐
                                     │  Success     │
                                     │  Toast       │
                                     └──────────────┘
```

### 2. Kitchen Polling Flow (Real-time Updates)

```
┌──────────┐    Every 5 seconds     ┌──────────────┐
│ Kitchen  │<───────────────────────│  setInterval │
│   View   │                         │   (polling)  │
└────┬─────┘                         └──────────────┘
     │
     │ 1. Fetch orders
     ▼
┌──────────────┐
│ ordersApi.   │
│getPending()  │
└──────┬───────┘
       │
       │ 2. GET request
       ▼
┌──────────────┐
│ GET /api/v1/ │
│orders/pending│
└──────┬───────┘
       │
       │ 3. Query DB
       ▼
┌──────────────┐
│   Backend    │
│   Returns    │
│   Orders     │
└──────┬───────┘
       │
       │ 4. Transform
       ▼
┌──────────────┐
│  Update UI   │
│  with Orders │
└──────────────┘
```

### 3. Complete Order Flow (Kitchen → Done)

```
┌──────────┐    Drag to "Listo"     ┌──────────────┐
│ Kitchen  │───────────────────────>│  Optimistic  │
│  Staff   │                         │  UI Update   │
└──────────┘                         └──────┬───────┘
                                            │
                                            │ Call API
                                            ▼
                                     ┌──────────────┐
                                     │ ordersApi.   │
                                     │completeOrder│
                                     └──────┬───────┘
                                            │
                                            │ PATCH request
                                            ▼
                                     ┌──────────────┐
                                     │PATCH /api/v1/│
                                     │orders/{id}/  │
                                     │  complete    │
                                     └──────┬───────┘
                                            │
                                            │ Update DB
                                            ▼
                                     ┌──────────────┐
                                     │   Backend    │
                                     │   Updates    │
                                     │   Status     │
                                     └──────┬───────┘
                                            │
                                            │ Success
                                            ▼
                                     ┌──────────────┐
                                     │  Success     │
                                     │  Toast       │
                                     └──────────────┘
```

## Component Hierarchy

```
App
├── Router
│   └── Pupuseria
│       ├── WaiterView
│       │   ├── MesaSelector
│       │   ├── MenuPupusas
│       │   └── OrderSummary
│       │       └── ConfirmModal
│       │
│       └── KitchenView
│           └── KitchenKanban
│               └── OrderCard (multiple)
```

## State Management

### Frontend State
```typescript
// WaiterView State
{
  selectedMesa: number | null,
  orderItems: OrderItem[],
  isSubmitting: boolean,
  searchQuery: string,
  selectedCategory: 'pupusa' | 'bebida' | 'all',
  globalNotes: string
}

// KitchenView State
{
  orders: Order[],
  isLoading: boolean,
  error: string | null
}
```

### Backend State (Database)
```sql
-- orders table
CREATE TABLE orders (
    id INTEGER PRIMARY KEY,
    table_number INTEGER NOT NULL,
    status VARCHAR NOT NULL,  -- pending, in_progress, completed, cancelled
    total FLOAT NOT NULL,
    created_at TIMESTAMP NOT NULL
);

-- order_items table
CREATE TABLE order_items (
    id INTEGER PRIMARY KEY,
    order_id INTEGER NOT NULL,
    name VARCHAR NOT NULL,
    amount INTEGER NOT NULL,
    price FLOAT NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id)
);
```

## API Request/Response Examples

### Create Order
**Request:**
```json
POST /api/v1/orders
{
  "table_number": 5,
  "items": [
    {"name": "Pupusa de Queso", "amount": 2, "price": 1.00},
    {"name": "Coca-Cola", "amount": 1, "price": 1.50}
  ]
}
```

**Response:**
```json
{
  "id": 1,
  "table_number": 5,
  "status": "pending",
  "items": [
    {"id": 1, "name": "Pupusa de Queso", "amount": 2, "price": 1.00},
    {"id": 2, "name": "Coca-Cola", "amount": 1, "price": 1.50}
  ],
  "total": 3.50,
  "created_at": "2026-01-31T20:00:00Z"
}
```

### Get Pending Orders
**Request:**
```
GET /api/v1/orders/pending
```

**Response:**
```json
[
  {
    "id": 1,
    "table_number": 5,
    "status": "pending",
    "items": [...],
    "total": 3.50,
    "created_at": "2026-01-31T20:00:00Z"
  }
]
```

## Security Considerations

### Current Implementation
- ✅ CORS configured for local development
- ✅ Input validation via Pydantic
- ✅ SQL injection protection via SQLAlchemy ORM
- ✅ Type safety with TypeScript

### Production Recommendations
- 🔒 Add authentication (JWT tokens)
- 🔒 Add authorization (role-based access)
- 🔒 Use HTTPS for all communications
- 🔒 Add rate limiting
- 🔒 Implement request signing
- 🔒 Add API versioning
- 🔒 Use environment-specific CORS origins

## Performance Considerations

### Current Implementation
- ✅ Optimistic UI updates
- ✅ 5-second polling interval
- ✅ Efficient database queries
- ✅ Minimal data transfer

### Optimization Opportunities
- 🚀 WebSockets for real-time updates (eliminate polling)
- 🚀 Redis for caching
- 🚀 Database indexing
- 🚀 Response compression
- 🚀 CDN for static assets
- 🚀 Service workers for offline support

## Monitoring & Logging

### Backend
- Structured JSON logging
- Request/response logging
- Error tracking
- Performance metrics

### Frontend
- Console logging for development
- Error boundaries for React
- Network request monitoring
- User action tracking

## Deployment Architecture

```
Production Setup:

┌─────────────────┐
│   Load Balancer │
│    (Nginx)      │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
┌───▼───┐ ┌──▼────┐
│Backend│ │Backend│  (Multiple instances)
│   1   │ │   2   │
└───┬───┘ └──┬────┘
    │        │
    └────┬───┘
         │
    ┌────▼────┐
    │Database │
    │(PostgreSQL)
    └─────────┘

Frontend:
┌─────────────────┐
│   CDN (Vercel)  │  (Static files)
└─────────────────┘
```

## Technology Choices

### Why FastAPI?
- Modern Python framework
- Automatic API documentation
- Type hints and validation
- Async support
- Fast performance

### Why React?
- Component-based architecture
- Large ecosystem
- TypeScript support
- Excellent developer experience
- Virtual DOM performance

### Why SQLite?
- Zero configuration
- File-based (easy backup)
- Perfect for development
- Can migrate to PostgreSQL for production

### Why Polling (not WebSockets)?
- Simpler implementation
- Works with standard HTTP
- Easier to debug
- Good enough for 5-second updates
- Can upgrade to WebSockets later
