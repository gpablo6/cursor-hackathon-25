#!/bin/bash

# Build Docker images for Pupuseria Management System
# Usage: ./scripts/build-docker.sh [backend|frontend|all]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Get the directory where the script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

# Default API URL for frontend build
VITE_API_URL="${VITE_API_URL:-http://localhost:8000}"

echo -e "${GREEN}Building Docker images for Pupuseria Management System${NC}"
echo "Project root: $PROJECT_ROOT"
echo ""

build_backend() {
    echo -e "${YELLOW}Building backend image...${NC}"
    cd "$PROJECT_ROOT/backend"
    docker build -t pupuseria-backend:latest .
    echo -e "${GREEN}✓ Backend image built successfully${NC}"
    echo ""
}

build_frontend() {
    echo -e "${YELLOW}Building frontend image...${NC}"
    echo "Using API URL: $VITE_API_URL"
    cd "$PROJECT_ROOT/frontend"
    docker build -t pupuseria-frontend:latest \
        --build-arg VITE_API_URL="$VITE_API_URL" .
    echo -e "${GREEN}✓ Frontend image built successfully${NC}"
    echo ""
}

show_images() {
    echo -e "${YELLOW}Docker images:${NC}"
    docker images | grep -E "REPOSITORY|pupuseria"
    echo ""
}

# Parse command line arguments
COMPONENT="${1:-all}"

case "$COMPONENT" in
    backend)
        build_backend
        ;;
    frontend)
        build_frontend
        ;;
    all)
        build_backend
        build_frontend
        ;;
    *)
        echo -e "${RED}Error: Invalid component '$COMPONENT'${NC}"
        echo "Usage: $0 [backend|frontend|all]"
        exit 1
        ;;
esac

show_images

echo -e "${GREEN}Build complete!${NC}"
echo ""
echo "Next steps:"
echo "  1. Run with docker-compose: docker-compose up -d"
echo "  2. Or run individually:"
echo "     Backend:  docker run -p 8000:8000 pupuseria-backend:latest"
echo "     Frontend: docker run -p 80:80 pupuseria-frontend:latest"
echo ""
echo "To set custom API URL for frontend:"
echo "  VITE_API_URL=https://api.example.com $0 frontend"
