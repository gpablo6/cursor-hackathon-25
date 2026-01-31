# Pupuseria Management System

A full-stack restaurant management application for pupuserías, built with FastAPI (backend) and React (frontend).

## Features

- **Waiter Interface**: Take orders, manage tables, process payments
- **Kitchen Interface**: View pending orders, update status, manage workflow
- **Real-time Updates**: 5-second polling for order synchronization
- **Order Management**: Create, update, complete, and cancel orders
- **Menu Management**: Comprehensive menu with pupusas and beverages

## Tech Stack

### Backend
- **FastAPI** - Modern Python web framework
- **SQLAlchemy** - ORM for database operations
- **SQLite** - Lightweight database
- **Pydantic** - Data validation
- **Uvicorn** - ASGI server

### Frontend
- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **Sonner** - Toast notifications

## Quick Start

### Prerequisites
- Python 3.13+
- Node.js 18+
- uv (Python package manager)
- npm or pnpm

### 1. Start Backend

```bash
cd backend

# Install dependencies
uv sync --extra dev

# Start server
PYTHONPATH=./src uv run uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload
```

Backend will be available at:
- API: http://localhost:8000
- Swagger Docs: http://localhost:8000/docs
- Health Check: http://localhost:8000/health

### 2. Start Frontend

```bash
cd frontend

# Install dependencies
npm install

# Start dev server
npm run dev
```

Frontend will be available at: http://localhost:5173

## Project Structure

```
.
├── backend/              # FastAPI backend
│   ├── src/
│   │   └── backend/
│   │       ├── main.py           # FastAPI app
│   │       ├── config.py         # Configuration
│   │       ├── database.py       # Database setup
│   │       ├── models/           # SQLAlchemy models
│   │       ├── schemas/          # Pydantic schemas
│   │       └── routes/           # API endpoints
│   ├── tests/                    # Backend tests
│   ├── .env                      # Environment variables
│   └── pyproject.toml            # Python dependencies
│
├── frontend/             # React frontend
│   ├── src/
│   │   ├── features/
│   │   │   └── pupuseria/
│   │   │       ├── WaiterView.tsx    # Waiter interface
│   │   │       └── KitchenView.tsx   # Kitchen interface
│   │   ├── services/
│   │   │   ├── ordersApi.ts          # API client
│   │   │   └── orderTransform.ts     # Data transformers
│   │   └── types/                    # TypeScript types
│   ├── .env                          # Environment variables
│   └── package.json                  # Node dependencies
│
└── INTEGRATION.md        # Integration documentation
```

## API Endpoints

### Orders
- `POST /api/v1/orders` - Create a new order
- `GET /api/v1/orders/pending` - Get all pending orders
- `PATCH /api/v1/orders/{id}/complete` - Mark order as completed
- `DELETE /api/v1/orders/{id}` - Cancel an order

### Health
- `GET /health` - Health check endpoint

For detailed API documentation, visit http://localhost:8000/docs when the backend is running.

## Integration Details

The frontend and backend communicate via REST API. See [INTEGRATION.md](./INTEGRATION.md) for detailed information about:
- Data transformation between frontend and backend
- Order workflow and status mapping
- Error handling and retry logic
- Polling mechanism for real-time updates

## Development

### Backend Development

```bash
cd backend

# Run tests
uv run pytest

# Run with coverage
uv run pytest --cov=backend --cov-report=term-missing

# Lint code
uv run ruff check .

# Format code
uv run ruff format .

# Type check
uv run mypy src
```

### Frontend Development

```bash
cd frontend

# Run linter
npm run lint

# Build for production
npm run build

# Preview production build
npm run preview
```

## Configuration

### Backend (.env)
```env
APP_NAME=Pupas API
DEBUG=true
HOST=0.0.0.0
PORT=8000
CORS_ORIGINS=["http://localhost:5173","http://localhost:3000"]
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:8000
```

## Workflow

### Waiter Workflow
1. Select a table (mesa)
2. Add pupusas and beverages to order
3. Click "Enviar a Cocina" to send to kitchen
4. Order is created in backend and appears in Kitchen View

### Kitchen Workflow
1. View all pending orders in real-time
2. Drag orders between status columns (Pendiente → Preparando → Listo)
3. Delete orders if needed (calls cancel endpoint)
4. Orders marked as "Listo" are completed in the backend

### Payment Workflow
1. Waiter clicks "Pagar" on a table
2. All orders for that table are marked as completed
3. Table is cleared and ready for new customers

## Troubleshooting

See [INTEGRATION.md](./INTEGRATION.md) for detailed troubleshooting steps.

### Common Issues

**Backend won't start:**
- Check if port 8000 is in use: `lsof -i :8000`
- Verify Python version: `python --version`

**Frontend can't connect:**
- Verify backend is running: `curl http://localhost:8000/health`
- Check CORS settings in `backend/.env`

**Orders not appearing:**
- Check backend logs for errors
- Verify API endpoint: `curl http://localhost:8000/api/v1/orders/pending`
- Wait 5 seconds for polling to refresh

## License

MIT

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linters
5. Submit a pull request

## Support

For issues and questions, please open an issue on GitHub.
