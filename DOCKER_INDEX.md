# Docker & Deployment Documentation Index

Complete guide to Docker and Railway deployment for the Pupuseria Management System.

## Quick Navigation

### 🚀 Getting Started
- **[Quick Start](./QUICKSTART_DOCKER.md)** - Get running in 5 minutes
- **[Main README](./README.md)** - Project overview and local development

### 📚 Comprehensive Guides
- **[Deployment Guide](./DEPLOYMENT.md)** - Step-by-step Railway deployment
- **[Docker Guide](./DOCKER.md)** - Technical Docker documentation
- **[Deployment Summary](./DOCKER_DEPLOYMENT_SUMMARY.md)** - Overview of what was created

### ✅ Checklists
- **[Deployment Checklist](./DEPLOYMENT_CHECKLIST.md)** - Deployment verification checklist

### 🛠️ Scripts
- **[Scripts Documentation](./scripts/README.md)** - Utility scripts guide
- **[build-docker.sh](./scripts/build-docker.sh)** - Build Docker images
- **[test-docker.sh](./scripts/test-docker.sh)** - Test Docker setup
- **[deploy-railway.sh](./scripts/deploy-railway.sh)** - Railway deployment helper
- **[backup-db.sh](./scripts/backup-db.sh)** - Backup database
- **[restore-db.sh](./scripts/restore-db.sh)** - Restore database

## Documentation by Use Case

### I want to...

#### Run Locally with Docker
1. Read: [Quick Start](./QUICKSTART_DOCKER.md)
2. Run: `./scripts/build-docker.sh all`
3. Run: `./scripts/test-docker.sh`
4. Access: http://localhost

#### Deploy to Railway
1. Read: [Deployment Guide](./DEPLOYMENT.md)
2. Run: `./scripts/deploy-railway.sh`
3. Follow the interactive prompts
4. Or use: [Deployment Checklist](./DEPLOYMENT_CHECKLIST.md)

#### Understand Docker Setup
1. Read: [Docker Guide](./DOCKER.md)
2. Read: [Deployment Summary](./DOCKER_DEPLOYMENT_SUMMARY.md)
3. Review: Dockerfiles in `backend/` and `frontend/`

#### Manage Database
1. Backup: `./scripts/backup-db.sh`
2. Restore: `./scripts/restore-db.sh backup-name.db`
3. Read: [Docker Guide - Volume Management](./DOCKER.md#volume-management)

#### Troubleshoot Issues
1. Check: [Deployment Guide - Troubleshooting](./DEPLOYMENT.md#troubleshooting)
2. Check: [Docker Guide - Troubleshooting](./DOCKER.md#troubleshooting)
3. Check: [Quick Start - Troubleshooting](./QUICKSTART_DOCKER.md#troubleshooting)

#### Customize Configuration
1. Backend: Edit `backend/Dockerfile` and `.env`
2. Frontend: Edit `frontend/Dockerfile` and `nginx.conf`
3. Local: Edit `docker-compose.yml`
4. Railway: Edit `railway.toml` files

## File Structure

```
.
├── QUICKSTART_DOCKER.md          # Quick start guide
├── DEPLOYMENT.md                  # Complete deployment guide
├── DEPLOYMENT_CHECKLIST.md        # Deployment checklist
├── DOCKER.md                      # Docker technical docs
├── DOCKER_DEPLOYMENT_SUMMARY.md   # Summary of setup
├── DOCKER_INDEX.md               # This file
│
├── docker-compose.yml            # Local orchestration
├── railway.json                  # Railway project config
│
├── backend/
│   ├── Dockerfile               # Backend Docker image
│   ├── .dockerignore            # Backend exclusions
│   └── railway.toml             # Backend Railway config
│
├── frontend/
│   ├── Dockerfile               # Frontend Docker image
│   ├── .dockerignore            # Frontend exclusions
│   ├── nginx.conf               # Nginx configuration
│   └── railway.toml             # Frontend Railway config
│
├── scripts/
│   ├── README.md                # Scripts documentation
│   ├── build-docker.sh          # Build images
│   ├── test-docker.sh           # Test setup
│   ├── deploy-railway.sh        # Deployment helper
│   ├── backup-db.sh             # Backup database
│   └── restore-db.sh            # Restore database
│
└── .github/
    └── workflows/
        └── docker-build.yml     # CI/CD workflow
```

## Quick Commands Reference

### Docker Commands

```bash
# Build
./scripts/build-docker.sh all
docker-compose build

# Run
./scripts/test-docker.sh
docker-compose up -d

# Stop
docker-compose down
docker-compose down -v  # with volumes

# Logs
docker-compose logs -f
docker-compose logs backend
docker-compose logs frontend

# Status
docker-compose ps
docker ps
docker stats
```

### Database Commands

```bash
# Backup
./scripts/backup-db.sh
./scripts/backup-db.sh my-backup-name

# Restore
./scripts/restore-db.sh backup-file.db

# List backups
ls -lh backups/
```

### Railway Commands

```bash
# Deploy (interactive)
./scripts/deploy-railway.sh

# CLI (if installed)
railway login
railway up
railway logs
railway variables set KEY=value
```

### Health Checks

```bash
# Backend
curl http://localhost:8000/health
curl https://your-backend.railway.app/health

# Frontend
curl http://localhost/health
curl https://your-frontend.railway.app/health

# API Docs
open http://localhost:8000/docs
open https://your-backend.railway.app/docs
```

## Environment Variables Quick Reference

### Backend (Production)
```env
PORT=${{PORT}}
HOST=0.0.0.0
DEBUG=false
LOG_LEVEL=INFO
CORS_ORIGINS=["https://your-frontend.railway.app"]
DATABASE_URL=sqlite:////app/data/restaurant.db
```

### Frontend (Production)
```env
VITE_API_URL=https://your-backend.railway.app
```

### Backend (Local)
```env
PORT=8000
HOST=0.0.0.0
DEBUG=true
LOG_LEVEL=DEBUG
CORS_ORIGINS=["http://localhost:5173","http://localhost:3000","http://localhost"]
DATABASE_URL=sqlite:///./restaurant.db
```

### Frontend (Local)
```env
VITE_API_URL=http://localhost:8000
```

## Common Issues & Solutions

| Issue | Quick Fix | Documentation |
|-------|-----------|---------------|
| Port in use | `docker-compose down` | [Quick Start](./QUICKSTART_DOCKER.md#port-already-in-use) |
| CORS errors | Update `CORS_ORIGINS` | [Deployment](./DEPLOYMENT.md#cors-errors) |
| Build fails | Check Dockerfile location | [Docker](./DOCKER.md#build-fails) |
| DB not persisting | Add volume mount | [Deployment](./DEPLOYMENT.md#database-not-persisting) |
| Can't connect | Check API URL | [Deployment](./DEPLOYMENT.md#frontend-cant-connect-to-backend) |

## Learning Path

### Beginner
1. Start with [Quick Start](./QUICKSTART_DOCKER.md)
2. Run locally with docker-compose
3. Explore the application
4. Try backup/restore scripts

### Intermediate
1. Read [Docker Guide](./DOCKER.md)
2. Understand Dockerfiles
3. Customize nginx.conf
4. Deploy to Railway using [Deployment Guide](./DEPLOYMENT.md)

### Advanced
1. Read [Deployment Summary](./DOCKER_DEPLOYMENT_SUMMARY.md)
2. Modify Docker images for optimization
3. Set up CI/CD with GitHub Actions
4. Implement monitoring and logging
5. Scale to PostgreSQL

## Support & Resources

### Internal Documentation
- [Main README](./README.md) - Project overview
- [Integration Guide](./INTEGRATION.md) - Frontend/Backend integration
- [Architecture](./ARCHITECTURE.md) - System architecture

### External Resources
- [Docker Documentation](https://docs.docker.com/)
- [Railway Documentation](https://docs.railway.app/)
- [FastAPI Deployment](https://fastapi.tiangolo.com/deployment/)
- [Nginx Documentation](https://nginx.org/en/docs/)

### Getting Help
1. Check troubleshooting sections in docs
2. Review Railway logs
3. Test locally with docker-compose
4. Open GitHub issue with:
   - Error messages
   - Steps to reproduce
   - Environment details

## Contributing

When adding new Docker/deployment features:

1. Update relevant documentation
2. Add scripts to `scripts/` directory
3. Update this index
4. Test locally before deploying
5. Update CI/CD workflow if needed

## Version History

- **v1.0.0** (2026-01-31) - Initial Docker and Railway setup
  - Backend and frontend Dockerfiles
  - docker-compose configuration
  - Railway deployment setup
  - Utility scripts
  - Comprehensive documentation
  - CI/CD workflow

---

**Last Updated:** January 31, 2026
**Maintained By:** Development Team
**Questions?** Open an issue on GitHub
