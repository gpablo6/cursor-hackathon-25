#!/bin/bash

# Backup SQLite database from Docker volume
# Usage: ./scripts/backup-db.sh [backup-name]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Get the directory where the script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
BACKUP_DIR="$PROJECT_ROOT/backups"

# Create backups directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

# Generate backup filename
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_NAME="${1:-backup_$TIMESTAMP}"
BACKUP_FILE="$BACKUP_DIR/${BACKUP_NAME}.db"

echo -e "${GREEN}Database Backup Utility${NC}"
echo "======================="
echo ""

# Check if docker is running
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}✗ Docker is not running${NC}"
    exit 1
fi

# Determine volume name
DEFAULT_PROJECT_NAME="${COMPOSE_PROJECT_NAME:-$(basename "$PROJECT_ROOT")}"
VOLUME_NAME="${VOLUME_NAME:-${DEFAULT_PROJECT_NAME}_backend-data}"

# Check if volume exists
if ! docker volume inspect "$VOLUME_NAME" > /dev/null 2>&1; then
    echo -e "${RED}✗ Volume '$VOLUME_NAME' not found${NC}"
    echo "Make sure the backend container has been started at least once."
    exit 1
fi

echo -e "${YELLOW}Backing up database from volume: $VOLUME_NAME${NC}"
echo "Backup file: $BACKUP_FILE"
echo ""

# Create backup using a temporary container
docker run --rm \
    -v "$VOLUME_NAME:/data" \
    -v "$BACKUP_DIR:/backup" \
    alpine \
    sh -c "if [ -f /data/restaurant.db ]; then cp /data/restaurant.db /backup/${BACKUP_NAME}.db; else exit 1; fi"

if [ $? -eq 0 ]; then
    BACKUP_SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
    echo -e "${GREEN}✓ Backup created successfully${NC}"
    echo "  File: $BACKUP_FILE"
    echo "  Size: $BACKUP_SIZE"
    echo ""
    
    # List all backups
    echo "Available backups:"
    ls -lh "$BACKUP_DIR"/*.db 2>/dev/null || echo "  (none)"
else
    echo -e "${RED}✗ Backup failed${NC}"
    echo "Database file may not exist yet. Start the backend to create it."
    exit 1
fi

echo ""
echo "To restore this backup:"
echo "  ./scripts/restore-db.sh ${BACKUP_NAME}.db"
