# Architecture and Integration

Owner: TBD
Last validated: 2026-01-31
Scope: system overview, data flow, API usage, and frontend-backend integration.

## System overview

- Frontend: React + Vite (`frontend/`), dev port 5173
- Backend: FastAPI (`backend/`), port 8000
- Database: SQLite (`/app/data/restaurant.db`)
- Communication: REST API (JSON)

## Key flows

### Create order (Waiter -> Kitchen)

1. Waiter creates order in UI.
2. Frontend calls `POST /api/v1/orders`.
3. Backend validates, persists, and returns the order.

### Kitchen updates (polling)

1. Kitchen view polls every 5 seconds.
2. Frontend calls `GET /api/v1/orders/pending`.
3. Backend returns pending orders.

### Complete order

1. Kitchen drags order to "Listo".
2. Frontend calls `PATCH /api/v1/orders/{id}/complete`.
3. Backend updates status.

## API endpoints used

- `POST /api/v1/orders` - create order
- `GET /api/v1/orders/pending` - list pending orders
- `PATCH /api/v1/orders/{id}/complete` - complete order
- `DELETE /api/v1/orders/{id}` - cancel order
- `GET /health` - health check

## Status mapping

| Frontend | Backend | Meaning |
| --- | --- | --- |
| `pendiente` | `pending` | Order received |
| `preparando` | `in_progress` | Order being prepared |
| `listo` | `completed` | Order completed |
| N/A | `cancelled` | Order cancelled |

## Data transformation

Frontend order items are converted to backend format before sending.

Frontend item (example):

```ts
{
  id: string,
  pupusa: { nombre: string, precio: number, categoria: "pupusa" | "bebida" },
  cantidad: number,
  notas: string
}
```

Backend item (example):

```json
{
  "name": "string",
  "amount": 2,
  "price": 1.5
}
```

Implementation files:
- `frontend/src/services/ordersApi.ts`
- `frontend/src/services/orderTransform.ts`

## Development quick run

```bash
# Backend
cd backend
uv sync --extra dev
PYTHONPATH=./src uv run uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload

# Frontend
cd frontend
npm install
npm run dev
```

## Future enhancements (short)

- WebSockets instead of polling
- Authentication and role-based access
- Order history and analytics
