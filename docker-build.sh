#!/bin/bash

# Docker Build Script for Pupuseria Management System
# This script builds both backend and frontend Docker images

set -e  # Exit on error

echo "🐳 Building Docker Images for Pupuseria Management System"
echo "=========================================================="

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Default values
BACKEND_TAG="pupuseria-backend:latest"
FRONTEND_TAG="pupuseria-frontend:latest"
VITE_API_URL="${VITE_API_URL:-http://localhost:8000}"

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --backend-tag)
            BACKEND_TAG="$2"
            shift 2
            ;;
        --frontend-tag)
            FRONTEND_TAG="$2"
            shift 2
            ;;
        --api-url)
            VITE_API_URL="$2"
            shift 2
            ;;
        --help)
            echo "Usage: ./docker-build.sh [OPTIONS]"
            echo ""
            echo "Options:"
            echo "  --backend-tag TAG    Tag for backend image (default: pupuseria-backend:latest)"
            echo "  --frontend-tag TAG   Tag for frontend image (default: pupuseria-frontend:latest)"
            echo "  --api-url URL        Backend API URL for frontend (default: http://localhost:8000)"
            echo "  --help               Show this help message"
            exit 0
            ;;
        *)
            echo -e "${RED}Unknown option: $1${NC}"
            echo "Use --help for usage information"
            exit 1
            ;;
    esac
done

# Build Backend
echo ""
echo -e "${BLUE}📦 Building Backend Image...${NC}"
echo "Tag: $BACKEND_TAG"
cd backend
docker build -t "$BACKEND_TAG" .
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Backend image built successfully${NC}"
else
    echo -e "${RED}❌ Backend build failed${NC}"
    exit 1
fi
cd ..

# Build Frontend
echo ""
echo -e "${BLUE}📦 Building Frontend Image...${NC}"
echo "Tag: $FRONTEND_TAG"
echo "API URL: $VITE_API_URL"
cd frontend
docker build -t "$FRONTEND_TAG" --build-arg VITE_API_URL="$VITE_API_URL" .
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Frontend image built successfully${NC}"
else
    echo -e "${RED}❌ Frontend build failed${NC}"
    exit 1
fi
cd ..

# Summary
echo ""
echo -e "${GREEN}🎉 All images built successfully!${NC}"
echo ""
echo "Images created:"
echo "  - $BACKEND_TAG"
echo "  - $FRONTEND_TAG"
echo ""
echo "Next steps:"
echo "  1. Run with docker-compose: docker-compose up -d"
echo "  2. Or run individually:"
echo "     docker run -d -p 8000:8000 --name backend $BACKEND_TAG"
echo "     docker run -d -p 80:80 --name frontend $FRONTEND_TAG"
echo ""
echo "Access the application:"
echo "  - Backend: http://localhost:8000"
echo "  - Frontend: http://localhost"
echo "  - API Docs: http://localhost:8000/docs"
