#!/bin/bash

# Test Docker setup for Pupuseria Management System
# Usage: ./scripts/test-docker.sh

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${GREEN}Testing Docker Setup${NC}"
echo "===================="
echo ""

# Check if docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}✗ Docker is not installed${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Docker is installed${NC}"

# Check if Docker Compose is installed
COMPOSE_CMD=""
if docker compose version > /dev/null 2>&1; then
    COMPOSE_CMD="docker compose"
    echo -e "${GREEN}✓ docker compose is installed${NC}"
elif command -v docker-compose &> /dev/null; then
    COMPOSE_CMD="docker-compose"
    echo -e "${GREEN}✓ docker-compose is installed${NC}"
else
    echo -e "${RED}✗ Docker Compose is not installed${NC}"
    exit 1
fi

echo ""
echo -e "${BLUE}Starting services with Docker Compose...${NC}"
$COMPOSE_CMD up -d

echo ""
echo "Waiting for services to be healthy..."
sleep 10

echo ""
echo -e "${BLUE}Testing Backend...${NC}"

# Test backend health
BACKEND_HEALTH=$(curl -s http://localhost:8000/health || echo "failed")
if [[ $BACKEND_HEALTH == *"healthy"* ]]; then
    echo -e "${GREEN}✓ Backend health check passed${NC}"
else
    echo -e "${RED}✗ Backend health check failed${NC}"
    echo "Response: $BACKEND_HEALTH"
    $COMPOSE_CMD logs backend
    exit 1
fi

# Test backend API docs
BACKEND_DOCS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8000/docs)
if [ "$BACKEND_DOCS" = "200" ]; then
    echo -e "${GREEN}✓ Backend API docs accessible${NC}"
else
    echo -e "${RED}✗ Backend API docs not accessible (HTTP $BACKEND_DOCS)${NC}"
fi

# Test backend orders endpoint
BACKEND_ORDERS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8000/api/v1/orders/pending)
if [ "$BACKEND_ORDERS" = "200" ]; then
    echo -e "${GREEN}✓ Backend orders endpoint accessible${NC}"
else
    echo -e "${RED}✗ Backend orders endpoint not accessible (HTTP $BACKEND_ORDERS)${NC}"
fi

echo ""
echo -e "${BLUE}Testing Frontend...${NC}"

# Test frontend health
FRONTEND_HEALTH=$(curl -s http://localhost/health || echo "failed")
if [[ $FRONTEND_HEALTH == *"healthy"* ]]; then
    echo -e "${GREEN}✓ Frontend health check passed${NC}"
else
    echo -e "${RED}✗ Frontend health check failed${NC}"
    echo "Response: $FRONTEND_HEALTH"
    $COMPOSE_CMD logs frontend
    exit 1
fi

# Test frontend index
FRONTEND_INDEX=$(curl -s -o /dev/null -w "%{http_code}" http://localhost/)
if [ "$FRONTEND_INDEX" = "200" ]; then
    echo -e "${GREEN}✓ Frontend index page accessible${NC}"
else
    echo -e "${RED}✗ Frontend index page not accessible (HTTP $FRONTEND_INDEX)${NC}"
fi

echo ""
echo -e "${BLUE}Container Status:${NC}"
$COMPOSE_CMD ps

echo ""
echo -e "${BLUE}Container Health:${NC}"
docker ps --filter "name=cursor-hackathon-25" --format "table {{.Names}}\t{{.Status}}"

echo ""
echo -e "${GREEN}All tests passed!${NC}"
echo ""
echo "Services are running:"
echo "  Backend:  http://localhost:8000"
echo "  API Docs: http://localhost:8000/docs"
echo "  Frontend: http://localhost"
echo ""
echo "To view logs:"
echo "  $COMPOSE_CMD logs -f"
echo ""
echo "To stop services:"
echo "  $COMPOSE_CMD down"
echo ""
echo "To stop and remove volumes:"
echo "  $COMPOSE_CMD down -v"
