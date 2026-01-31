# Utility Scripts

This directory contains helper scripts for Docker and Railway deployment.

## Prerequisites

- **Docker**: Required for all Docker-related scripts
- **docker-compose**: Required for testing and running locally
- **Railway CLI** (optional): For Railway deployment script
- **curl**: For testing scripts
- **bash**: All scripts are bash scripts

## Scripts Overview

### 1. build-docker.sh

Builds Docker images for the application.

**Usage:**
```bash
./scripts/build-docker.sh [backend|frontend|all]
```

**Examples:**
```bash
# Build both images
./scripts/build-docker.sh all

# Build only backend
./scripts/build-docker.sh backend

# Build frontend with custom API URL
VITE_API_URL=https://api.example.com ./scripts/build-docker.sh frontend
```

**Environment Variables:**
- `VITE_API_URL`: Backend API URL for frontend build (default: http://localhost:8000)

### 2. test-docker.sh

Tests the Docker setup by starting services and running health checks.

**Usage:**
```bash
./scripts/test-docker.sh
```

**What it does:**
1. Checks if Docker and docker-compose are installed
2. Starts services with docker-compose
3. Waits for services to be healthy
4. Tests backend health endpoint
5. Tests backend API docs
6. Tests backend orders endpoint
7. Tests frontend health endpoint
8. Tests frontend index page
9. Shows container status

**Output:**
- ✓ Green checkmarks for passing tests
- ✗ Red X marks for failing tests
- Service URLs and helpful commands

### 3. deploy-railway.sh

Interactive helper for Railway deployment.

**Usage:**
```bash
./scripts/deploy-railway.sh
```

**What it does:**
1. Checks if Railway CLI is installed
2. Provides backend environment variables
3. Prompts for backend URL after deployment
4. Provides frontend environment variables
5. Prompts for frontend URL after deployment
6. Shows CORS update instructions
7. Displays deployment summary

**Interactive prompts:**
- Backend URL input
- Frontend URL input
- Confirmation steps

### 4. backup-db.sh

Backs up the SQLite database from Docker volume.

**Usage:**
```bash
./scripts/backup-db.sh [backup-name]
```

**Examples:**
```bash
# Create backup with timestamp
./scripts/backup-db.sh

# Create backup with custom name
./scripts/backup-db.sh before-migration

# Create backup before update
./scripts/backup-db.sh pre-v2.0
```

**What it does:**
1. Creates `backups/` directory if it doesn't exist
2. Extracts database from Docker volume
3. Saves to `backups/[backup-name].db`
4. Shows backup size and location
5. Lists all available backups

**Backup location:**
- Directory: `backups/`
- Format: `backup_YYYYMMDD_HHMMSS.db` or custom name

### 5. restore-db.sh

Restores SQLite database to Docker volume.

**Usage:**
```bash
./scripts/restore-db.sh <backup-file>
```

**Examples:**
```bash
# Restore from backup file
./scripts/restore-db.sh backup_20260131_120000.db

# Restore with full path
./scripts/restore-db.sh backups/before-migration.db
```

**What it does:**
1. Validates backup file exists
2. Shows backup size
3. Prompts for confirmation (destructive operation)
4. Copies backup to Docker volume
5. Provides restart instructions

**Safety:**
- Requires explicit "yes" confirmation
- Shows warning about overwriting current database
- Lists available backups if file not found

## Common Workflows

### Local Development Testing

```bash
# 1. Build images
./scripts/build-docker.sh all

# 2. Test the setup
./scripts/test-docker.sh

# 3. View logs
docker-compose logs -f

# 4. Stop services
docker-compose down
```

### Before Major Changes

```bash
# 1. Backup current database
./scripts/backup-db.sh before-changes

# 2. Make your changes
# ... edit code ...

# 3. Rebuild and test
./scripts/build-docker.sh all
./scripts/test-docker.sh

# 4. If something goes wrong, restore
./scripts/restore-db.sh before-changes.db
docker-compose restart backend
```

### Railway Deployment

```bash
# 1. Build and test locally first
./scripts/build-docker.sh all
./scripts/test-docker.sh

# 2. Commit and push changes
git add .
git commit -m "Ready for deployment"
git push origin main

# 3. Use deployment helper
./scripts/deploy-railway.sh

# 4. Follow the interactive prompts
```

### Database Management

```bash
# Create regular backups
./scripts/backup-db.sh daily-backup

# List all backups
ls -lh backups/

# Restore specific backup
./scripts/restore-db.sh daily-backup.db
docker-compose restart backend
```

## Troubleshooting

### Script Permission Denied

```bash
chmod +x scripts/*.sh
```

### Docker Not Running

```bash
# Start Docker Desktop (macOS/Windows)
# Or start Docker daemon (Linux)
sudo systemctl start docker
```

### Volume Not Found

The volume is created when you first run `docker-compose up`. If you get volume errors:

```bash
docker-compose up -d
```

### Backup/Restore Fails

Make sure the backend container has been started at least once:

```bash
docker-compose up -d backend
sleep 5
./scripts/backup-db.sh
```

### Port Already in Use

```bash
# Find what's using the port
lsof -i :8000  # Backend
lsof -i :80    # Frontend

# Stop existing containers
docker-compose down

# Or change ports in docker-compose.yml
```

## Script Exit Codes

All scripts follow standard exit code conventions:

- `0`: Success
- `1`: Error (with descriptive message)

This allows for scripting and automation:

```bash
if ./scripts/test-docker.sh; then
    echo "Tests passed, deploying..."
    git push origin main
else
    echo "Tests failed, fix issues first"
    exit 1
fi
```

## Environment Variables

### build-docker.sh

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_URL` | `http://localhost:8000` | Backend API URL for frontend |

### All Scripts

Scripts respect standard environment variables:
- `DOCKER_HOST`: Docker daemon socket
- `COMPOSE_PROJECT_NAME`: docker-compose project name
- `COMPOSE_FILE`: docker-compose file location

## Adding Custom Scripts

To add your own scripts:

1. Create script in `scripts/` directory
2. Add shebang: `#!/bin/bash`
3. Add `set -e` for error handling
4. Make executable: `chmod +x scripts/your-script.sh`
5. Document in this README

**Template:**

```bash
#!/bin/bash
set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}Your Script Name${NC}"
echo "================="
echo ""

# Your script logic here

echo -e "${GREEN}✓ Success${NC}"
```

## CI/CD Integration

These scripts can be used in CI/CD pipelines:

**GitHub Actions Example:**

```yaml
- name: Build Docker Images
  run: ./scripts/build-docker.sh all

- name: Test Docker Setup
  run: ./scripts/test-docker.sh

- name: Backup Database
  run: ./scripts/backup-db.sh ci-backup-${{ github.sha }}
```

## Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Railway Documentation](https://docs.railway.app/)
- [Bash Scripting Guide](https://www.gnu.org/software/bash/manual/)

---

**Last Updated:** January 2026
