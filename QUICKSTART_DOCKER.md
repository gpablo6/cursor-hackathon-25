# Docker Quick Start Guide

Get the Pupuseria Management System running with Docker in 5 minutes.

## Prerequisites

- Docker installed and running
- docker-compose installed
- Git repository cloned

## Quick Start

### Option 1: Using Scripts (Recommended)

```bash
# 1. Build images
./scripts/build-docker.sh all

# 2. Test the setup
./scripts/test-docker.sh

# 3. Access the application
# Backend:  http://localhost:8000
# Frontend: http://localhost
```

### Option 2: Using docker-compose

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Access the application
# Backend:  http://localhost:8000
# Frontend: http://localhost

# Stop services
docker-compose down
```

### Option 3: Manual Docker Commands

```bash
# Build backend
cd backend
docker build -t pupuseria-backend .

# Build frontend
cd ../frontend
docker build -t pupuseria-frontend --build-arg VITE_API_URL=http://localhost:8000 .

# Run backend
docker run -d \
  --name pupuseria-backend \
  -p 8000:8000 \
  -e CORS_ORIGINS='["http://localhost"]' \
  -v pupuseria-data:/app/data \
  pupuseria-backend

# Run frontend
docker run -d \
  --name pupuseria-frontend \
  -p 80:80 \
  pupuseria-frontend

# Access the application
# Backend:  http://localhost:8000
# Frontend: http://localhost
```

## Verify Installation

### Check Services

```bash
# Backend health
curl http://localhost:8000/health
# Expected: {"status":"healthy"}

# Frontend health
curl http://localhost/health
# Expected: healthy

# API documentation
open http://localhost:8000/docs

# Frontend application
open http://localhost
```

### Check Logs

```bash
# All services
docker-compose logs -f

# Backend only
docker-compose logs -f backend

# Frontend only
docker-compose logs -f frontend
```

### Check Containers

```bash
# List running containers
docker ps

# Container stats
docker stats
```

## Common Tasks

### Stop Services

```bash
docker-compose down
```

### Restart Services

```bash
docker-compose restart
```

### Rebuild After Changes

```bash
docker-compose up -d --build
```

### View Database

```bash
# Backup database first
./scripts/backup-db.sh

# Database is in Docker volume
docker volume inspect cursor-hackathon-25_backend-data
```

### Clean Up Everything

```bash
# Stop and remove containers, networks, volumes
docker-compose down -v

# Remove images
docker rmi pupuseria-backend pupuseria-frontend
```

## Troubleshooting

### Port Already in Use

```bash
# Check what's using the port
lsof -i :8000  # Backend
lsof -i :80    # Frontend

# Option 1: Stop the other service
# Option 2: Change ports in docker-compose.yml
```

### Services Won't Start

```bash
# Check logs
docker-compose logs

# Rebuild images
docker-compose build --no-cache

# Start fresh
docker-compose down -v
docker-compose up -d --build
```

### Frontend Can't Connect to Backend

```bash
# Check backend is running
curl http://localhost:8000/health

# Check CORS settings
docker exec cursor-hackathon-25-backend-1 env | grep CORS

# Rebuild frontend with correct API URL
cd frontend
docker build -t pupuseria-frontend --build-arg VITE_API_URL=http://localhost:8000 .
docker-compose up -d frontend
```

### Database Issues

```bash
# Create backup
./scripts/backup-db.sh

# Check volume exists
docker volume ls | grep backend-data

# Recreate volume
docker-compose down -v
docker-compose up -d
```

## Next Steps

### Local Development
- Use `npm run dev` and `uv run uvicorn` for development
- Docker is for production-like testing

### Deploy to Railway
1. Follow [DEPLOYMENT.md](./DEPLOYMENT.md)
2. Or use: `./scripts/deploy-railway.sh`

### Database Management
```bash
# Backup
./scripts/backup-db.sh my-backup

# Restore
./scripts/restore-db.sh my-backup.db
```

## URLs

| Service | URL | Description |
|---------|-----|-------------|
| Frontend | http://localhost | Main application |
| Backend API | http://localhost:8000 | REST API |
| API Docs | http://localhost:8000/docs | Swagger UI |
| Backend Health | http://localhost:8000/health | Health check |
| Frontend Health | http://localhost/health | Health check |

## Environment Variables

### Backend
```env
PORT=8000
HOST=0.0.0.0
DEBUG=false
CORS_ORIGINS=["http://localhost"]
DATABASE_URL=sqlite:////app/data/restaurant.db
```

### Frontend
```env
VITE_API_URL=http://localhost:8000
```

## File Locations

| Item | Location |
|------|----------|
| Backend Dockerfile | `backend/Dockerfile` |
| Frontend Dockerfile | `frontend/Dockerfile` |
| docker-compose | `docker-compose.yml` |
| Database Volume | Docker volume: `cursor-hackathon-25_backend-data` |
| Backups | `backups/` directory |
| Scripts | `scripts/` directory |

## Getting Help

- **Detailed Docs**: [DOCKER.md](./DOCKER.md)
- **Deployment**: [DEPLOYMENT.md](./DEPLOYMENT.md)
- **Scripts**: [scripts/README.md](./scripts/README.md)
- **Issues**: Open a GitHub issue

---

**Quick Links:**
- [Full README](./README.md)
- [Docker Documentation](./DOCKER.md)
- [Deployment Guide](./DEPLOYMENT.md)
- [Scripts Documentation](./scripts/README.md)
