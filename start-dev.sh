#!/bin/bash

# Development startup script for Pupuseria Management System
# This script starts both backend and frontend in separate terminal windows

set -e

echo "🚀 Starting Pupuseria Management System..."
echo ""

# Check if we're in the project root
if [ ! -d "backend" ] || [ ! -d "frontend" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

# Check if backend .env exists
if [ ! -f "backend/.env" ]; then
    echo "❌ Error: backend/.env not found"
    echo "Please create backend/.env from backend/.env.example"
    exit 1
fi

# Check if frontend .env exists
if [ ! -f "frontend/.env" ]; then
    echo "❌ Error: frontend/.env not found"
    echo "Please create frontend/.env from frontend/.env.example"
    exit 1
fi

echo "✅ Environment files found"
echo ""

# Function to start backend
start_backend() {
    echo "📦 Starting Backend..."
    cd backend
    PYTHONPATH=./src uv run uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload
}

# Function to start frontend
start_frontend() {
    echo "🎨 Starting Frontend..."
    cd frontend
    npm run dev
}

# Detect OS and open terminals accordingly
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    echo "🍎 Detected macOS"
    echo ""
    echo "Opening Backend in new terminal..."
    osascript -e 'tell app "Terminal" to do script "cd '"$PWD"' && bash -c \"echo '📦 Backend Server' && cd backend && PYTHONPATH=./src uv run uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload\""'
    
    sleep 2
    
    echo "Opening Frontend in new terminal..."
    osascript -e 'tell app "Terminal" to do script "cd '"$PWD"' && bash -c \"echo '🎨 Frontend Dev Server' && cd frontend && npm run dev\""'
    
    echo ""
    echo "✅ Both services starting in separate terminals!"
    echo ""
    echo "📍 Access the application:"
    echo "   Frontend: http://localhost:5173"
    echo "   Backend API: http://localhost:8000"
    echo "   API Docs: http://localhost:8000/docs"
    echo ""
    
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Linux
    echo "🐧 Detected Linux"
    echo ""
    
    # Try to detect terminal emulator
    if command -v gnome-terminal &> /dev/null; then
        gnome-terminal -- bash -c "cd $PWD/backend && PYTHONPATH=./src uv run uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload; exec bash"
        gnome-terminal -- bash -c "cd $PWD/frontend && npm run dev; exec bash"
    elif command -v xterm &> /dev/null; then
        xterm -e "cd $PWD/backend && PYTHONPATH=./src uv run uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload" &
        xterm -e "cd $PWD/frontend && npm run dev" &
    else
        echo "⚠️  Could not detect terminal emulator"
        echo "Please run these commands in separate terminals:"
        echo ""
        echo "Terminal 1:"
        echo "  cd backend"
        echo "  PYTHONPATH=./src uv run uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload"
        echo ""
        echo "Terminal 2:"
        echo "  cd frontend"
        echo "  npm run dev"
        exit 1
    fi
    
    echo "✅ Both services starting in separate terminals!"
    
else
    # Windows or other
    echo "⚠️  Unsupported OS: $OSTYPE"
    echo "Please run these commands in separate terminals:"
    echo ""
    echo "Terminal 1:"
    echo "  cd backend"
    echo "  PYTHONPATH=./src uv run uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload"
    echo ""
    echo "Terminal 2:"
    echo "  cd frontend"
    echo "  npm run dev"
    exit 1
fi
