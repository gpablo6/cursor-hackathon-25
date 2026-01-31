# Deployment Architecture

Visual guide to the Docker and Railway deployment architecture.

## System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                            Railway Platform                          │
│                                                                       │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │                      Project: Pupuseria                         │ │
│  │                                                                  │ │
│  │  ┌──────────────────────┐      ┌──────────────────────┐       │ │
│  │  │  Frontend Service    │      │  Backend Service     │       │ │
│  │  │  ==================  │      │  ==================  │       │ │
│  │  │                      │      │                      │       │ │
│  │  │  Container:          │      │  Container:          │       │ │
│  │  │  - Nginx Alpine      │      │  - Python 3.13       │       │ │
│  │  │  - React SPA         │      │  - FastAPI + uv      │       │ │
│  │  │  - Static Assets     │      │  - SQLAlchemy        │       │ │
│  │  │                      │      │  - Uvicorn           │       │ │
│  │  │  Port: $PORT (80)    │      │  Port: $PORT (8000)  │       │ │
│  │  │  Health: /health     │      │  Health: /health     │       │ │
│  │  │                      │      │                      │       │ │
│  │  │  URL:                │      │  URL:                │       │ │
│  │  │  frontend.railway.app│◄─────│  backend.railway.app │       │ │
│  │  │                      │ CORS │                      │       │ │
│  │  │  Env:                │      │  Env:                │       │ │
│  │  │  - VITE_API_URL      │      │  - CORS_ORIGINS      │       │ │
│  │  │                      │      │  - DATABASE_URL      │       │ │
│  │  │                      │      │                      │       │ │
│  │  │                      │      │  Volume:             │       │ │
│  │  │                      │      │  /app/data           │       │ │
│  │  │                      │      │  └─ restaurant.db    │       │ │
│  │  └──────────────────────┘      └──────────────────────┘       │ │
│  │           │                              │                     │ │
│  │           │                              │                     │ │
│  │           └──────────HTTPS───────────────┘                     │ │
│  │                  (Auto SSL)                                    │ │
│  └────────────────────────────────────────────────────────────────┘ │
│                                                                       │
│  Features:                                                            │
│  - Automatic HTTPS                                                    │
│  - Health Checks                                                      │
│  - Auto Restart                                                       │
│  - Log Aggregation                                                    │
│  - Metrics & Monitoring                                               │
└───────────────────────────────────────────────────────────────────────┘
```

## Local Development Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      Docker Compose                              │
│                                                                   │
│  ┌──────────────────────┐      ┌──────────────────────┐        │
│  │  Frontend Container  │      │  Backend Container   │        │
│  │  ==================  │      │  ==================  │        │
│  │                      │      │                      │        │
│  │  Port: 80            │      │  Port: 8000          │        │
│  │  localhost           │      │  localhost:8000      │        │
│  │                      │      │                      │        │
│  │  Health: /health     │      │  Health: /health     │        │
│  │                      │      │                      │        │
│  │                      │◄─────│  CORS: localhost     │        │
│  │                      │      │                      │        │
│  │                      │      │  Volume Mount:       │        │
│  │                      │      │  backend-data        │        │
│  │                      │      │  └─ restaurant.db    │        │
│  └──────────────────────┘      └──────────────────────┘        │
│           │                              │                      │
│           └──────────HTTP────────────────┘                      │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
         │                              │
         │                              │
         ▼                              ▼
    Developer                      API Clients
    Browser                        (curl, Postman)
```

## Build Process

### Backend Build

```
┌─────────────────────────────────────────────────────────┐
│                    Backend Build                         │
│                                                           │
│  1. Base Image: python:3.13-slim                         │
│     └─ Install system dependencies (curl)                │
│                                                           │
│  2. Install uv package manager                           │
│     └─ Fast Python package installer                     │
│                                                           │
│  3. Copy Dependencies                                    │
│     ├─ pyproject.toml                                    │
│     └─ uv.lock                                           │
│                                                           │
│  4. Install Python Packages                              │
│     ├─ FastAPI                                           │
│     ├─ Uvicorn                                           │
│     ├─ SQLAlchemy                                        │
│     ├─ Pydantic                                          │
│     └─ Other dependencies                                │
│                                                           │
│  5. Copy Application Code                                │
│     └─ src/backend/                                      │
│                                                           │
│  6. Configure Runtime                                    │
│     ├─ Set PYTHONPATH                                    │
│     ├─ Create data directory                             │
│     └─ Set environment variables                         │
│                                                           │
│  7. Health Check                                         │
│     └─ curl http://localhost:$PORT/health                │
│                                                           │
│  8. Start Command                                        │
│     └─ uvicorn backend.main:app --host 0.0.0.0          │
│                                                           │
│  Result: pupuseria-backend:latest (~200MB)               │
└───────────────────────────────────────────────────────────┘
```

### Frontend Build

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend Build                        │
│                                                           │
│  STAGE 1: Build                                          │
│  ─────────────────                                       │
│  1. Base Image: node:20-alpine                           │
│                                                           │
│  2. Copy Dependencies                                    │
│     ├─ package.json                                      │
│     └─ package-lock.json                                 │
│                                                           │
│  3. Install Node Modules                                 │
│     └─ npm ci                                            │
│                                                           │
│  4. Copy Source Code                                     │
│     └─ src/                                              │
│                                                           │
│  5. Build React App                                      │
│     ├─ Set VITE_API_URL                                  │
│     ├─ npm run build                                     │
│     └─ Output: dist/                                     │
│                                                           │
│  STAGE 2: Production                                     │
│  ──────────────────                                      │
│  1. Base Image: nginx:alpine                             │
│                                                           │
│  2. Copy Nginx Config                                    │
│     └─ nginx.conf                                        │
│                                                           │
│  3. Copy Built Assets                                    │
│     └─ dist/ → /usr/share/nginx/html                     │
│                                                           │
│  4. Configure Runtime                                    │
│     ├─ Dynamic port binding                              │
│     └─ Health check script                               │
│                                                           │
│  5. Start Nginx                                          │
│     └─ nginx -g "daemon off;"                            │
│                                                           │
│  Result: pupuseria-frontend:latest (~25MB)               │
└───────────────────────────────────────────────────────────┘
```

## Data Flow

### Request Flow (Production)

```
┌──────────┐
│  User    │
│  Browser │
└────┬─────┘
     │
     │ HTTPS (443)
     ▼
┌────────────────────────────────────┐
│  Railway Load Balancer             │
│  - SSL Termination                 │
│  - Health Checks                   │
└────┬───────────────────────────────┘
     │
     │ HTTP (Dynamic Port)
     ▼
┌────────────────────────────────────┐
│  Frontend Container (Nginx)        │
│                                    │
│  Routes:                           │
│  - /health → health check          │
│  - /assets/* → static files        │
│  - /* → index.html (SPA)           │
└────┬───────────────────────────────┘
     │
     │ API Requests
     │ (VITE_API_URL)
     ▼
┌────────────────────────────────────┐
│  Railway Load Balancer             │
└────┬───────────────────────────────┘
     │
     │ HTTP (Dynamic Port)
     ▼
┌────────────────────────────────────┐
│  Backend Container (FastAPI)       │
│                                    │
│  Routes:                           │
│  - /health → health check          │
│  - /docs → Swagger UI              │
│  - /api/v1/* → API endpoints       │
│                                    │
│  ┌──────────────────────────────┐ │
│  │  SQLAlchemy                  │ │
│  └────┬─────────────────────────┘ │
│       │                            │
│       ▼                            │
│  ┌──────────────────────────────┐ │
│  │  SQLite Database             │ │
│  │  /app/data/restaurant.db     │ │
│  │  (Persistent Volume)         │ │
│  └──────────────────────────────┘ │
└────────────────────────────────────┘
```

### Database Persistence

```
┌─────────────────────────────────────────────────────────┐
│                    Railway Volume                        │
│                                                           │
│  Mount Point: /app/data                                  │
│                                                           │
│  ┌─────────────────────────────────────────────────┐    │
│  │  restaurant.db (SQLite)                         │    │
│  │                                                  │    │
│  │  Tables:                                         │    │
│  │  - orders                                        │    │
│  │  - order_items                                   │    │
│  │  - (future tables)                               │    │
│  │                                                  │    │
│  │  Persists across:                                │    │
│  │  - Container restarts                            │    │
│  │  - Deployments                                   │    │
│  │  - Service updates                               │    │
│  └─────────────────────────────────────────────────┘    │
│                                                           │
│  Backup Strategy:                                        │
│  1. Local: ./scripts/backup-db.sh                        │
│  2. Manual: Download from Railway                        │
│  3. Automated: Scheduled backups (future)                │
└───────────────────────────────────────────────────────────┘
```

## CI/CD Pipeline

```
┌─────────────────────────────────────────────────────────┐
│                    GitHub Actions                        │
│                                                           │
│  Trigger: Push to main/backend/frontend                 │
│                                                           │
│  ┌─────────────────────────────────────────────────┐    │
│  │  Job 1: Build Backend                           │    │
│  │  ─────────────────────                          │    │
│  │  1. Checkout code                                │    │
│  │  2. Setup Docker Buildx                          │    │
│  │  3. Build backend image                          │    │
│  │  4. Start test container                         │    │
│  │  5. Test health endpoint                         │    │
│  │  6. Test API docs                                │    │
│  │  7. Cleanup                                      │    │
│  └─────────────────────────────────────────────────┘    │
│                                                           │
│  ┌─────────────────────────────────────────────────┐    │
│  │  Job 2: Build Frontend                          │    │
│  │  ──────────────────────                         │    │
│  │  1. Checkout code                                │    │
│  │  2. Setup Docker Buildx                          │    │
│  │  3. Build frontend image                         │    │
│  │  4. Start test container                         │    │
│  │  5. Test health endpoint                         │    │
│  │  6. Test index page                              │    │
│  │  7. Cleanup                                      │    │
│  └─────────────────────────────────────────────────┘    │
│                                                           │
│  ┌─────────────────────────────────────────────────┐    │
│  │  Job 3: Integration Test                        │    │
│  │  ───────────────────────                        │    │
│  │  1. Checkout code                                │    │
│  │  2. Start with docker-compose                    │    │
│  │  3. Test backend endpoints                       │    │
│  │  4. Test frontend endpoints                      │    │
│  │  5. Show logs on failure                         │    │
│  │  6. Cleanup                                      │    │
│  └─────────────────────────────────────────────────┘    │
│                                                           │
│  Result: ✅ All tests passed                             │
└───────────────────────────────────────────────────────────┘
         │
         │ Manual Deploy
         ▼
┌─────────────────────────────────────────────────────────┐
│                       Railway                            │
│                                                           │
│  1. Detect push to main                                  │
│  2. Pull latest code                                     │
│  3. Build Docker images                                  │
│  4. Deploy new containers                                │
│  5. Run health checks                                    │
│  6. Switch traffic to new containers                     │
│  7. Keep old containers for rollback                     │
└───────────────────────────────────────────────────────────┘
```

## Deployment Workflow

```
┌─────────────────────────────────────────────────────────┐
│                  Deployment Process                      │
│                                                           │
│  Local Development                                       │
│  ─────────────────                                       │
│  1. Write code                                           │
│  2. Test locally (npm run dev, uvicorn)                 │
│  3. Test with Docker (./scripts/test-docker.sh)         │
│  4. Commit changes                                       │
│                                                           │
│  ▼                                                       │
│                                                           │
│  Git Repository                                          │
│  ──────────────                                          │
│  1. Push to GitHub                                       │
│  2. GitHub Actions runs tests                            │
│  3. Tests pass ✅                                        │
│                                                           │
│  ▼                                                       │
│                                                           │
│  Railway Deployment                                      │
│  ──────────────────                                      │
│  1. Railway detects push                                 │
│  2. Builds Docker images                                 │
│  3. Runs health checks                                   │
│  4. Deploys to production                                │
│  5. Updates URLs                                         │
│                                                           │
│  ▼                                                       │
│                                                           │
│  Production                                              │
│  ──────────                                              │
│  1. Services running                                     │
│  2. Health checks passing                                │
│  3. Logs available                                       │
│  4. Metrics tracked                                      │
└───────────────────────────────────────────────────────────┘
```

## Security Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Security Layers                       │
│                                                           │
│  Layer 1: Network                                        │
│  ────────────────                                        │
│  - Railway HTTPS (automatic SSL)                         │
│  - CORS configuration                                    │
│  - Security headers (Nginx)                              │
│                                                           │
│  Layer 2: Application                                    │
│  ─────────────────────                                   │
│  - Input validation (Pydantic)                           │
│  - SQL injection prevention (SQLAlchemy)                 │
│  - XSS protection (React)                                │
│                                                           │
│  Layer 3: Container                                      │
│  ───────────────────                                     │
│  - Minimal base images                                   │
│  - Non-root users (future)                               │
│  - Read-only filesystems (future)                        │
│                                                           │
│  Layer 4: Data                                           │
│  ──────────────                                          │
│  - Encrypted at rest (Railway)                           │
│  - Encrypted in transit (HTTPS)                          │
│  - Regular backups                                       │
│                                                           │
│  Layer 5: Access                                         │
│  ───────────────                                         │
│  - Environment variables (secrets)                       │
│  - Railway access control                                │
│  - GitHub repository access                              │
└───────────────────────────────────────────────────────────┘
```

## Monitoring & Observability

```
┌─────────────────────────────────────────────────────────┐
│                    Monitoring Stack                      │
│                                                           │
│  Health Checks                                           │
│  ─────────────                                           │
│  - Backend: GET /health → {"status":"healthy"}          │
│  - Frontend: GET /health → "healthy"                    │
│  - Interval: 30 seconds                                  │
│  - Timeout: 10 seconds                                   │
│  - Retries: 3                                            │
│                                                           │
│  Logs                                                    │
│  ────                                                    │
│  - Structured JSON logging (backend)                     │
│  - Nginx access logs (frontend)                          │
│  - Railway log aggregation                               │
│  - Log levels: DEBUG, INFO, WARNING, ERROR               │
│                                                           │
│  Metrics (Railway)                                       │
│  ─────────────────                                       │
│  - CPU usage                                             │
│  - Memory usage                                          │
│  - Network traffic                                       │
│  - Request count                                         │
│  - Response times                                        │
│                                                           │
│  Alerts (Future)                                         │
│  ───────────────                                         │
│  - Service down                                          │
│  - High error rate                                       │
│  - Resource limits                                       │
│  - Deployment failures                                   │
└───────────────────────────────────────────────────────────┘
```

## Scalability Path

```
Current Architecture (v1.0)
───────────────────────────
- Single backend container
- Single frontend container
- SQLite database
- Railway free tier

Suitable for: Development, small deployments

Future Enhancements
──────────────────

Phase 1: Database
├─ Migrate to PostgreSQL
├─ Connection pooling
├─ Database replicas
└─ Automated backups

Phase 2: Caching
├─ Add Redis
├─ Session storage
├─ API response caching
└─ Rate limiting

Phase 3: Horizontal Scaling
├─ Multiple backend instances
├─ Load balancing
├─ Shared state (Redis)
└─ CDN for static assets

Phase 4: Advanced
├─ Kubernetes deployment
├─ Service mesh
├─ Distributed tracing
└─ Advanced monitoring
```

---

**For Implementation Details:** See [DOCKER.md](./DOCKER.md)
**For Deployment Steps:** See [DEPLOYMENT.md](./DEPLOYMENT.md)
**For Quick Start:** See [QUICKSTART_DOCKER.md](./QUICKSTART_DOCKER.md)
