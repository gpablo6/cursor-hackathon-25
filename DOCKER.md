# Docker Setup Guide

This guide explains the Docker configuration for the Pupuseria Management System.

## Overview

The application consists of two Docker containers:

1. **Backend**: FastAPI application with Python 3.13
2. **Frontend**: React application served by Nginx

## Docker Files

### Backend Dockerfile

Located at: `backend/Dockerfile`

**Key Features:**
- Based on `python:3.13-slim`
- Uses `uv` package manager for fast dependency installation
- Creates persistent volume for SQLite database at `/app/data`
- Exposes port 8000 (configurable via `PORT` env var)
- Includes health check endpoint

**Build Process:**
1. Install system dependencies (curl)
2. Install uv package manager
3. Copy and install Python dependencies
4. Copy application source code
5. Create database directory
6. Set environment variables

### Frontend Dockerfile

Located at: `frontend/Dockerfile`

**Key Features:**
- Multi-stage build for optimized image size
- Build stage: Node.js 20 for building React app
- Production stage: Nginx Alpine for serving static files
- Dynamic port configuration for Railway
- Custom Nginx configuration with health check

**Build Process:**
1. **Build Stage:**
   - Install Node.js dependencies
   - Build React application with Vite
   - Accept `VITE_API_URL` as build argument

2. **Production Stage:**
   - Copy built files to Nginx
   - Configure Nginx for SPA routing
   - Set up health check endpoint
   - Enable dynamic port binding

## Docker Compose

Located at: `docker-compose.yml`

**Services:**
- `backend`: FastAPI backend on port 8000
- `frontend`: Nginx frontend on port 80

**Features:**
- Automatic service dependency (frontend waits for backend)
- Health checks for both services
- Persistent volume for backend database
- Environment variable configuration

## Building Docker Images

### Build Backend

```bash
cd backend
docker build -t pupuseria-backend .
```

**Build Arguments:** None required

**Environment Variables:**
- `PORT`: Server port (default: 8000)
- `HOST`: Bind address (default: 0.0.0.0)
- `DEBUG`: Debug mode (default: false)
- `CORS_ORIGINS`: Allowed origins (JSON array)
- `DATABASE_URL`: Database connection string

### Build Frontend

```bash
cd frontend
docker build -t pupuseria-frontend \
  --build-arg VITE_API_URL=http://localhost:8000 .
```

**Build Arguments:**
- `VITE_API_URL`: Backend API URL (required)

**Environment Variables:**
- `PORT`: Server port (default: 80)

## Running with Docker Compose

### Start All Services

```bash
# Build and start in detached mode
docker-compose up -d --build

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

### Access Services

- **Backend API**: http://localhost:8000
- **Backend Docs**: http://localhost:8000/docs
- **Backend Health**: http://localhost:8000/health
- **Frontend**: http://localhost
- **Frontend Health**: http://localhost/health

## Running Individual Containers

### Backend

```bash
docker run -d \
  --name pupuseria-backend \
  -p 8000:8000 \
  -e APP_NAME="Pupas API" \
  -e DEBUG=false \
  -e CORS_ORIGINS='["http://localhost"]' \
  -e DATABASE_URL="sqlite:////app/data/restaurant.db" \
  -v pupuseria-data:/app/data \
  pupuseria-backend
```

### Frontend

```bash
docker run -d \
  --name pupuseria-frontend \
  -p 80:80 \
  pupuseria-frontend
```

## Environment Variables

### Backend Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `APP_NAME` | No | `Pupas API` | Application name |
| `APP_VERSION` | No | `0.1.0` | Application version |
| `DEBUG` | No | `false` | Enable debug mode |
| `HOST` | No | `0.0.0.0` | Server bind address |
| `PORT` | No | `8000` | Server port |
| `LOG_LEVEL` | No | `INFO` | Logging level |
| `CORS_ORIGINS` | Yes | `["http://localhost:3000"]` | Allowed CORS origins |
| `CORS_ALLOW_CREDENTIALS` | No | `true` | Allow credentials |
| `DATABASE_URL` | No | `sqlite:////app/data/restaurant.db` | Database connection |

### Frontend Build Arguments

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `VITE_API_URL` | Yes | None | Backend API URL |

## Volume Management

### Backend Data Volume

The backend uses a volume to persist the SQLite database:

**Mount Point:** `/app/data`
**Contains:** `restaurant.db` (SQLite database)

**Create Volume:**
```bash
docker volume create pupuseria-data
```

**Inspect Volume:**
```bash
docker volume inspect pupuseria-data
```

**Backup Database:**
```bash
docker run --rm \
  -v pupuseria-data:/data \
  -v $(pwd):/backup \
  alpine \
  cp /data/restaurant.db /backup/restaurant-backup.db
```

**Restore Database:**
```bash
docker run --rm \
  -v pupuseria-data:/data \
  -v $(pwd):/backup \
  alpine \
  cp /backup/restaurant-backup.db /data/restaurant.db
```

## Health Checks

### Backend Health Check

**Endpoint:** `GET /health`

**Docker Health Check:**
```dockerfile
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:${PORT:-8000}/health || exit 1
```

**Manual Check:**
```bash
curl http://localhost:8000/health
```

**Expected Response:**
```json
{"status": "healthy"}
```

### Frontend Health Check

**Endpoint:** `GET /health`

**Docker Health Check:**
```dockerfile
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://localhost:${PORT:-80}/health || exit 1
```

**Manual Check:**
```bash
curl http://localhost/health
```

**Expected Response:**
```
healthy
```

## Nginx Configuration

Located at: `frontend/nginx.conf`

**Features:**
- Gzip compression for text files
- Security headers (X-Frame-Options, X-Content-Type-Options, X-XSS-Protection)
- Long cache for static assets (1 year)
- SPA fallback routing (all routes serve index.html)
- Health check endpoint at `/health`

**Key Directives:**
```nginx
# SPA routing
location / {
    try_files $uri $uri/ /index.html;
}

# Static asset caching
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

## Troubleshooting

### Backend Issues

#### Container Won't Start

**Check logs:**
```bash
docker logs pupuseria-backend
```

**Common issues:**
- Port 8000 already in use
- Invalid CORS_ORIGINS format (must be JSON array)
- Database directory not writable

#### Database Not Persisting

**Check volume:**
```bash
docker volume inspect pupuseria-data
```

**Ensure volume is mounted:**
```bash
docker inspect pupuseria-backend | grep -A 10 Mounts
```

#### Health Check Failing

**Test manually:**
```bash
docker exec pupuseria-backend curl http://localhost:8000/health
```

### Frontend Issues

#### Build Fails

**Check build logs:**
```bash
docker build -t pupuseria-frontend --progress=plain .
```

**Common issues:**
- `VITE_API_URL` not provided as build argument
- Missing dependencies in package.json
- Build errors in TypeScript code

#### Can't Connect to Backend

**Check CORS settings:**
- Ensure backend `CORS_ORIGINS` includes frontend URL
- Check browser console for CORS errors

**Test backend from container:**
```bash
docker exec pupuseria-frontend wget -O- http://backend:8000/health
```

#### Nginx Not Starting

**Check nginx config:**
```bash
docker exec pupuseria-frontend nginx -t
```

**Check logs:**
```bash
docker logs pupuseria-frontend
```

### General Issues

#### Port Conflicts

**Find process using port:**
```bash
# macOS/Linux
lsof -i :8000
lsof -i :80

# Windows
netstat -ano | findstr :8000
```

**Use different ports:**
```bash
docker-compose up -d
# Edit docker-compose.yml to change port mappings
```

#### Container Networking

**List networks:**
```bash
docker network ls
```

**Inspect network:**
```bash
docker network inspect cursor-hackathon-25_default
```

**Test connectivity:**
```bash
docker exec pupuseria-frontend ping backend
```

## Optimization

### Image Size Optimization

**Backend:**
- Uses `python:3.13-slim` (smaller than full image)
- Multi-stage build not needed (uv is fast)
- `.dockerignore` excludes unnecessary files

**Frontend:**
- Multi-stage build (build stage discarded)
- Production stage uses `nginx:alpine` (very small)
- Only built assets copied to final image

**Check image sizes:**
```bash
docker images | grep pupuseria
```

### Build Cache

**Use BuildKit for faster builds:**
```bash
DOCKER_BUILDKIT=1 docker build -t pupuseria-backend backend/
```

**Clear build cache:**
```bash
docker builder prune
```

### Performance

**Backend:**
- Use uvicorn with multiple workers in production
- Consider gunicorn with uvicorn workers for better performance

**Frontend:**
- Nginx is already optimized
- Gzip compression enabled
- Static assets cached for 1 year

## Production Considerations

### Security

1. **Don't run as root:**
   - Add `USER` directive to Dockerfiles
   - Create non-root user

2. **Scan for vulnerabilities:**
   ```bash
   docker scan pupuseria-backend
   docker scan pupuseria-frontend
   ```

3. **Use secrets for sensitive data:**
   - Don't hardcode secrets in Dockerfiles
   - Use Docker secrets or environment variables

4. **Update base images regularly:**
   ```bash
   docker pull python:3.13-slim
   docker pull node:20-alpine
   docker pull nginx:alpine
   ```

### Monitoring

**Container stats:**
```bash
docker stats pupuseria-backend pupuseria-frontend
```

**Logs:**
```bash
# Follow logs
docker-compose logs -f

# Last 100 lines
docker-compose logs --tail=100

# Specific service
docker-compose logs backend
```

### Scaling

**Horizontal scaling:**
```bash
docker-compose up -d --scale backend=3
```

**Note:** Requires load balancer and shared database

## Railway-Specific Notes

Railway automatically:
- Detects Dockerfiles in service root directories
- Sets `PORT` environment variable
- Provides HTTPS endpoints
- Handles container orchestration

**Railway configuration files:**
- `backend/railway.toml`: Backend service config
- `frontend/railway.toml`: Frontend service config

**Key differences from local Docker:**
- Port is dynamic (`$PORT` env var)
- No need for docker-compose
- Automatic HTTPS
- Built-in load balancing

## Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [FastAPI Deployment](https://fastapi.tiangolo.com/deployment/docker/)
- [Vite Production Build](https://vitejs.dev/guide/build.html)

---

**Last Updated:** January 2026
