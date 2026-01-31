#!/bin/bash

# Restore SQLite database to Docker volume
# Usage: ./scripts/restore-db.sh <backup-file>

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

echo -e "${GREEN}Database Restore Utility${NC}"
echo "========================"
echo ""

# Check arguments
if [ -z "$1" ]; then
    echo -e "${RED}Error: Backup file not specified${NC}"
    echo "Usage: $0 <backup-file>"
    echo ""
    echo "Available backups:"
    ls -1 "$BACKUP_DIR"/*.db 2>/dev/null || echo "  (none)"
    exit 1
fi

BACKUP_FILE="$1"

# If backup file doesn't have full path, look in backups directory
if [ ! -f "$BACKUP_FILE" ]; then
    BACKUP_FILE="$BACKUP_DIR/$1"
fi

# Check if backup file exists
if [ ! -f "$BACKUP_FILE" ]; then
    echo -e "${RED}✗ Backup file not found: $BACKUP_FILE${NC}"
    echo ""
    echo "Available backups:"
    ls -1 "$BACKUP_DIR"/*.db 2>/dev/null || echo "  (none)"
    exit 1
fi

echo "Backup file: $BACKUP_FILE"
BACKUP_SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
echo "Size: $BACKUP_SIZE"
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
    echo -e "${YELLOW}⚠ Volume '$VOLUME_NAME' not found, creating...${NC}"
    docker volume create "$VOLUME_NAME"
fi

# Warning
echo -e "${YELLOW}WARNING: This will overwrite the current database!${NC}"
read -p "Are you sure you want to continue? (yes/no): " CONFIRM

if [ "$CONFIRM" != "yes" ]; then
    echo "Restore cancelled."
    exit 0
fi

echo ""
echo -e "${YELLOW}Restoring database to volume: $VOLUME_NAME${NC}"

# Get absolute path for backup file
BACKUP_FILE_ABS=$(cd "$(dirname "$BACKUP_FILE")" && pwd)/$(basename "$BACKUP_FILE")

# Restore backup using a temporary container
docker run --rm \
    -v "$VOLUME_NAME:/data" \
    -v "$(dirname "$BACKUP_FILE_ABS"):/backup" \
    alpine \
    cp "/backup/$(basename "$BACKUP_FILE_ABS")" /data/restaurant.db

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Database restored successfully${NC}"
    echo ""
    echo "Restart the backend container to use the restored database:"
    echo "  docker compose restart backend"
else
    echo -e "${RED}✗ Restore failed${NC}"
    exit 1
fi
