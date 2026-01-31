#!/bin/bash

# Deploy to Railway helper script
# This script helps set up environment variables for Railway deployment

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${GREEN}Railway Deployment Helper${NC}"
echo "================================"
echo ""

# Check if railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo -e "${YELLOW}Railway CLI not found.${NC}"
    echo "Install it with: npm i -g @railway/cli"
    echo "Or use the Railway dashboard: https://railway.app/dashboard"
    echo ""
    USE_CLI=false
else
    echo -e "${GREEN}✓ Railway CLI found${NC}"
    USE_CLI=true
fi

echo ""
echo -e "${BLUE}Deployment Steps:${NC}"
echo ""

echo "1. BACKEND DEPLOYMENT"
echo "   ==================="
echo ""
echo "   Required Environment Variables:"
echo "   --------------------------------"
echo "   PORT=\${{PORT}}"
echo "   HOST=0.0.0.0"
echo "   DEBUG=false"
echo "   LOG_LEVEL=INFO"
echo "   CORS_ORIGINS=[\"*\"]"
echo "   DATABASE_URL=sqlite:////app/data/restaurant.db"
echo ""
echo "   Volume Mount:"
echo "   -------------"
echo "   Mount Path: /app/data"
echo ""

if [ "$USE_CLI" = true ]; then
    echo -e "${YELLOW}   Set backend variables with CLI:${NC}"
    echo '   railway variables set APP_NAME="Pupas API"'
    echo '   railway variables set DEBUG=false'
    echo '   railway variables set LOG_LEVEL=INFO'
    echo '   railway variables set CORS_ORIGINS='"'"'["*"]'"'"
    echo '   railway variables set DATABASE_URL="sqlite:////app/data/restaurant.db"'
    echo ""
fi

echo "   After deployment, copy your backend URL"
echo "   Example: https://pupuseria-backend-production.up.railway.app"
echo ""

read -p "Press Enter when backend is deployed and you have the URL..."
echo ""

read -p "Enter your backend URL: " BACKEND_URL

if [ -z "$BACKEND_URL" ]; then
    echo -e "${RED}Error: Backend URL is required${NC}"
    exit 1
fi

echo ""
echo "2. FRONTEND DEPLOYMENT"
echo "   ===================="
echo ""
echo "   Required Environment Variables:"
echo "   --------------------------------"
echo "   VITE_API_URL=$BACKEND_URL"
echo ""

if [ "$USE_CLI" = true ]; then
    echo -e "${YELLOW}   Set frontend variables with CLI:${NC}"
    echo "   railway variables set VITE_API_URL=\"$BACKEND_URL\""
    echo ""
fi

echo "   After deployment, copy your frontend URL"
echo "   Example: https://pupuseria-frontend-production.up.railway.app"
echo ""

read -p "Press Enter when frontend is deployed and you have the URL..."
echo ""

read -p "Enter your frontend URL: " FRONTEND_URL

if [ -z "$FRONTEND_URL" ]; then
    echo -e "${RED}Error: Frontend URL is required${NC}"
    exit 1
fi

echo ""
echo "3. UPDATE BACKEND CORS"
echo "   ===================="
echo ""
echo "   Update backend CORS_ORIGINS to include frontend URL:"
echo "   CORS_ORIGINS=[\"$FRONTEND_URL\"]"
echo ""

if [ "$USE_CLI" = true ]; then
    echo -e "${YELLOW}   Update with CLI:${NC}"
    echo "   railway variables set CORS_ORIGINS='[\"$FRONTEND_URL\"]'"
    echo ""
fi

echo ""
echo -e "${GREEN}Deployment Configuration Summary${NC}"
echo "=================================="
echo ""
echo "Backend URL:  $BACKEND_URL"
echo "Frontend URL: $FRONTEND_URL"
echo ""
echo "Backend Environment Variables:"
echo "  PORT=\${{PORT}}"
echo "  HOST=0.0.0.0"
echo "  DEBUG=false"
echo "  LOG_LEVEL=INFO"
echo "  CORS_ORIGINS=[\"$FRONTEND_URL\"]"
echo "  DATABASE_URL=sqlite:////app/data/restaurant.db"
echo ""
echo "Frontend Environment Variables:"
echo "  VITE_API_URL=$BACKEND_URL"
echo ""
echo "Volume Mount (Backend):"
echo "  /app/data"
echo ""
echo -e "${GREEN}Next Steps:${NC}"
echo "1. Update backend CORS_ORIGINS with frontend URL"
echo "2. Wait for backend to redeploy"
echo "3. Test your application at: $FRONTEND_URL"
echo "4. Verify health checks:"
echo "   - Backend: curl $BACKEND_URL/health"
echo "   - Frontend: curl $FRONTEND_URL/health"
echo ""
echo "For detailed instructions, see DEPLOYMENT.md"
