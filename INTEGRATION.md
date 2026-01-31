# Backend-Frontend Integration Guide

This document describes how the backend and frontend are integrated in the Pupuseria application.

## Architecture Overview

The application uses a **FastAPI backend** with a **React frontend** communicating via REST API.

### Backend (FastAPI)
- **Location**: `/backend`
- **Port**: `8000`
- **Database**: SQLite (`restaurant.db`)
- **API Base**: `http://localhost:8000/api/v1`

### Frontend (React + Vite)
- **Location**: `/frontend`
- **Port**: `5173` (default Vite dev server)
- **Framework**: React 19 + TypeScript + Tailwind CSS

## Setup Instructions

### 1. Backend Setup

```bash
cd backend

# Install dependencies
uv sync --extra dev

# Create .env file (already created)
# The .env file configures CORS to allow frontend requests

# Start the backend server
PYTHONPATH=./src uv run uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload
```

The backend will be available at:
- API: http://localhost:8000
- Swagger UI: http://localhost:8000/docs
- Health Check: http://localhost:8000/health

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env file (already created)
# Contains VITE_API_URL=http://localhost:8000

# Start the development server
npm run dev
```

The frontend will be available at: http://localhost:5173

## Integration Flow

### 1. Waiter View (Mesero Tab)

**Creating Orders:**
1. Waiter selects a mesa (table)
2. Adds pupusas/beverages to the order
3. Clicks "Enviar a Cocina" (Send to Kitchen)
4. Frontend calls: `POST /api/v1/orders`
   - Transforms frontend order items to backend format
   - Sends table number and items (name, amount, price)
5. On success: Shows success toast and clears form
6. On error: Shows error message and keeps order in form

**Payment Flow:**
1. Waiter clicks "Pagar" on a mesa
2. Frontend calls: `PATCH /api/v1/orders/{id}/complete` for each order
3. Orders are marked as completed in the backend
4. Mesa is cleared from local state

### 2. Kitchen View (Cocina Tab)

**Loading Orders:**
1. On tab open: Fetches all pending orders via `GET /api/v1/orders/pending`
2. Shows loading spinner during initial fetch
3. Sets up 5-second polling interval to refresh orders automatically

**Updating Order Status:**
1. Kitchen staff drags order to different status column
2. When moved to "Listo" (Ready): Calls `PATCH /api/v1/orders/{id}/complete`
3. Uses optimistic updates: UI updates immediately, rolls back on error

**Deleting Orders:**
1. Kitchen staff clicks delete button on an order
2. Frontend calls: `DELETE /api/v1/orders/{id}`
3. Order is marked as cancelled in the backend
4. Removed from the UI with optimistic update

## Data Transformation

### Frontend → Backend

**Frontend Order Item:**
```typescript
{
  id: string,
  pupusa: {
    nombre: string,
    precio: number,
    emoji: string,
    categoria: 'pupusa' | 'bebida'
  },
  cantidad: number,
  notas: string
}
```

**Backend Order Item:**
```json
{
  "name": "string",
  "amount": number,
  "price": number
}
```

### Backend → Frontend

**Backend Order Response:**
```json
{
  "id": number,
  "table_number": number,
  "status": "pending" | "in_progress" | "completed" | "cancelled",
  "items": [...],
  "total": number,
  "created_at": "ISO datetime"
}
```

**Frontend Order:**
```typescript
{
  id: string,
  mesa: number,
  status: "pendiente" | "preparando" | "listo",
  items: [...],
  total: number,
  timestamp: Date
}
```

## Status Mapping

| Frontend Status | Backend Status | Description |
|----------------|----------------|-------------|
| `pendiente`    | `pending`      | Order received, waiting to be prepared |
| `preparando`   | `in_progress`  | Order is being prepared |
| `listo`        | `completed`    | Order is ready to be served |
| N/A            | `cancelled`    | Order was deleted/cancelled |

## API Endpoints Used

### Orders API (`/api/v1/orders`)

1. **Create Order**
   - `POST /api/v1/orders`
   - Creates a new order for a table
   - Returns the created order with ID

2. **Get Pending Orders**
   - `GET /api/v1/orders/pending`
   - Returns all orders with status "pending"
   - Used by Kitchen View for polling

3. **Complete Order**
   - `PATCH /api/v1/orders/{order_id}/complete`
   - Marks an order as completed
   - Idempotent (can be called multiple times)

4. **Delete Order**
   - `DELETE /api/v1/orders/{order_id}`
   - Cancels an order
   - Returns the cancelled order

## Error Handling

### Frontend
- **Loading States**: Shows spinners during API calls
- **Optimistic Updates**: UI updates immediately, rolls back on error
- **Error Messages**: Toast notifications with error details
- **Retry Logic**: User can retry failed operations

### Backend
- **Validation**: Pydantic schemas validate all inputs
- **Error Responses**: Consistent JSON error format
- **Logging**: Structured JSON logging for debugging
- **CORS**: Configured to allow frontend requests

## Development Tips

### Running Both Services

**Terminal 1 - Backend:**
```bash
cd backend
PYTHONPATH=./src uv run uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### Testing the Integration

1. Open frontend: http://localhost:5173
2. Navigate to "Mesero" tab
3. Select a mesa and add items
4. Click "Enviar a Cocina"
5. Navigate to "Cocina" tab
6. See the order appear (or wait up to 5 seconds for polling)
7. Drag order to different status or delete it

### Debugging

**Backend Logs:**
- Check terminal running uvicorn
- Structured JSON logs show all API calls

**Frontend Console:**
- Open browser DevTools
- Check Network tab for API calls
- Check Console for errors

**API Documentation:**
- Visit http://localhost:8000/docs
- Test endpoints directly in Swagger UI

## Future Enhancements

1. **WebSockets**: Replace polling with real-time updates
2. **Authentication**: Add user authentication and authorization
3. **Order Notes**: Store and display order notes in backend
4. **Order History**: View completed/cancelled orders
5. **Analytics**: Track order metrics and performance
6. **Multi-restaurant**: Support multiple restaurant locations

## Troubleshooting

### Backend won't start
- Check if port 8000 is already in use: `lsof -i :8000`
- Verify .env file exists in backend directory
- Check Python version: `python --version` (requires 3.13+)

### Frontend can't connect to backend
- Verify backend is running: `curl http://localhost:8000/health`
- Check .env file in frontend directory
- Verify CORS settings in backend/.env
- Check browser console for CORS errors

### Orders not appearing in Kitchen View
- Check backend logs for errors
- Verify orders are being created: `curl http://localhost:8000/api/v1/orders/pending`
- Check browser console for API errors
- Wait 5 seconds for polling to refresh

### CORS Errors
- Verify frontend URL in backend/.env CORS_ORIGINS
- Restart backend after changing .env
- Check browser console for specific CORS error

## Files Modified/Created

### Backend
- `backend/.env` - Environment configuration with CORS settings

### Frontend
- `frontend/.env` - API URL configuration
- `frontend/src/services/api.types.ts` - Backend API type definitions
- `frontend/src/services/orderTransform.ts` - Data transformation utilities
- `frontend/src/services/ordersApi.ts` - API client service
- `frontend/src/features/pupuseria/WaiterView.tsx` - Updated to use API
- `frontend/src/features/pupuseria/KitchenView.tsx` - Updated to use API with polling
- `frontend/src/features/pupuseria/components/OrderSummary.tsx` - Added loading state

### Documentation
- `INTEGRATION.md` - This file
