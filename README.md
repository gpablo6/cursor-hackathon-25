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
└── docs/architecture-and-integration.md  # Architecture and integration
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

The frontend and backend communicate via REST API. See [docs/architecture-and-integration.md](./docs/architecture-and-integration.md) for details on:
- Data transformation between frontend and backend
- Order workflow and status mapping
- API endpoints and polling behavior

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

### Backend Environment Variables

Create a `.env` file in the `backend/` directory (or set these in Railway):

```env
# Application Configuration
APP_NAME=Pupas API
APP_VERSION=0.1.0
DEBUG=false

# Server Configuration
HOST=0.0.0.0
PORT=8000

# Logging
LOG_LEVEL=INFO

# CORS Configuration (add your frontend URLs)
CORS_ORIGINS=["http://localhost:5173","http://localhost:3000","https://your-frontend.railway.app"]
CORS_ALLOW_CREDENTIALS=true

# Database (SQLite by default, can be changed to PostgreSQL)
DATABASE_URL=sqlite:////app/data/restaurant.db
```

### Frontend Environment Variables

Create a `.env` file in the `frontend/` directory (or set these in Railway):

```env
# API URL - Update this to your backend URL
VITE_API_URL=http://localhost:8000
```

**Important for Production:** Set `VITE_API_URL` to your Railway backend URL (e.g., `https://your-backend.railway.app`)

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

See [docs/architecture-and-integration.md](./docs/architecture-and-integration.md) for integration troubleshooting tips.

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

## Documentation

- **Deployment and Docker**: [docs/deployment.md](./docs/deployment.md)
- **Architecture and Integration**: [docs/architecture-and-integration.md](./docs/architecture-and-integration.md)
- **Docs consolidation plan**: [docs/documentation-consolidation.md](./docs/documentation-consolidation.md)
- **Utility Scripts**: [scripts/README.md](./scripts/README.md)

## Deployment

For detailed deployment instructions, see [docs/deployment.md](./docs/deployment.md).

### Quick Deploy to Railway

1. **Deploy Backend:**
   - Create new Railway project from GitHub repo
   - Set root directory to `backend`
   - Add environment variables (see below)
   - Add volume mount at `/app/data`
   - Copy backend URL

2. **Deploy Frontend:**
   - Add new service to same project
   - Set root directory to `frontend`
   - Set `VITE_API_URL` to backend URL
   - Copy frontend URL

3. **Update CORS:**
   - Update backend `CORS_ORIGINS` with frontend URL
   - Redeploy backend

See [docs/deployment.md](./docs/deployment.md) for complete step-by-step guide.

### Docker Deployment

#### Local Docker Testing

Test the Docker setup locally before deploying:

```bash
# Build and run with docker-compose
docker-compose up --build

# Backend will be available at http://localhost:8000
# Frontend will be available at http://localhost
```

#### Building Individual Images

```bash
# Build backend
cd backend
docker build -t pupuseria-backend .

# Build frontend
cd frontend
docker build -t pupuseria-frontend --build-arg VITE_API_URL=http://localhost:8000 .
```

### Railway Deployment

Railway is a modern platform that makes deployment simple. Follow these steps:

#### Prerequisites

1. Create a [Railway account](https://railway.app/)
2. Install Railway CLI (optional): `npm i -g @railway/cli`
3. Have your code in a Git repository (GitHub, GitLab, etc.)

#### Deploy Backend

1. **Create a New Project** in Railway
2. **Add a Service** → Select "Deploy from GitHub repo"
3. **Configure the Backend Service:**
   - **Root Directory:** `backend`
   - **Build Command:** (leave empty, Dockerfile will be used)
   - **Start Command:** (leave empty, Dockerfile CMD will be used)

4. **Set Environment Variables** in Railway dashboard:
   ```
   APP_NAME=Pupas API
   DEBUG=false
   PORT=${{PORT}}
   HOST=0.0.0.0
   LOG_LEVEL=INFO
   CORS_ORIGINS=["https://your-frontend-url.railway.app"]
   DATABASE_URL=sqlite:////app/data/restaurant.db
   ```
   
   **Note:** Railway automatically provides `${{PORT}}` variable. The backend will use this port.

5. **Add Volume (Optional but Recommended):**
   - Go to your backend service → Variables → Add Volume
   - Mount path: `/app/data`
   - This persists your SQLite database across deployments

6. **Deploy** - Railway will automatically detect the Dockerfile and deploy

7. **Get your Backend URL** - Copy the public URL (e.g., `https://your-backend.railway.app`)

#### Deploy Frontend

1. **Add Another Service** to the same Railway project
2. **Configure the Frontend Service:**
   - **Root Directory:** `frontend`
   - **Build Command:** (leave empty, Dockerfile will be used)
   - **Start Command:** (leave empty, Dockerfile CMD will be used)

3. **Set Environment Variables** (Build-time):
   ```
   VITE_API_URL=https://your-backend.railway.app
   ```
   
   **Important:** Replace with your actual backend URL from step 7 above.

4. **Deploy** - Railway will build and deploy the frontend

5. **Access your App** - Use the generated frontend URL

#### Railway Configuration Tips

**Environment Variables:**
- Backend `CORS_ORIGINS` must include your frontend URL
- Frontend `VITE_API_URL` must point to your backend URL
- Use Railway's `${{PORT}}` variable for the backend port
- Set `DEBUG=false` in production

**Database Options:**
- **SQLite (Default):** Simple, requires volume mount at `/app/data`
- **PostgreSQL:** Add Railway PostgreSQL plugin and update `DATABASE_URL`

**Networking:**
- Railway services can communicate privately using service names
- Public URLs are automatically generated with HTTPS
- CORS must be properly configured for cross-origin requests

**Monitoring:**
- Use Railway's built-in logs to debug issues
- Health check endpoints: `/health` (backend), `/health` (frontend)
- Set up alerts for service downtime

#### Updating Deployments

Railway automatically redeploys when you push to your connected Git branch:

```bash
git add .
git commit -m "Update application"
git push origin main
```

#### Railway CLI Deployment (Alternative)

```bash
# Login to Railway
railway login

# Link to your project
railway link

# Deploy backend
cd backend
railway up

# Deploy frontend
cd frontend
railway up
```

### Environment Variables Reference

#### Required Backend Variables
| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port (Railway sets this) | `8000` |
| `CORS_ORIGINS` | Allowed frontend URLs | `["https://app.railway.app"]` |
| `DATABASE_URL` | Database connection string | `sqlite:////app/data/restaurant.db` |

#### Required Frontend Variables
| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `https://backend.railway.app` |

#### Optional Backend Variables
| Variable | Description | Default |
|----------|-------------|---------|
| `APP_NAME` | Application name | `Pupas API` |
| `DEBUG` | Debug mode | `false` |
| `LOG_LEVEL` | Logging level | `INFO` |
| `CORS_ALLOW_CREDENTIALS` | Allow credentials | `true` |

### Troubleshooting Deployment

**Backend won't start:**
- Check Railway logs for errors
- Verify `PORT` environment variable is set
- Ensure Dockerfile is in `backend/` directory
- Check that `pyproject.toml` and `uv.lock` are present

**Frontend can't connect to backend:**
- Verify `VITE_API_URL` is set correctly (with https://)
- Check backend `CORS_ORIGINS` includes frontend URL
- Test backend health: `curl https://your-backend.railway.app/health`
- Check browser console for CORS errors

**Database not persisting:**
- Add a volume mount at `/app/data` in Railway
- Verify `DATABASE_URL` points to `/app/data/restaurant.db`

**Build failures:**
- Check that all dependencies are in `package.json` / `pyproject.toml`
- Verify Dockerfile syntax
- Check Railway build logs for specific errors

## Support

For issues and questions, please open an issue on GitHub.
