#!/bin/bash

# CampEdge Node.js Issue Fix Script
# This script helps resolve Node.js version conflicts

echo "🔧 CampEdge Node.js Issue Fix Script"
echo "====================================="

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check current Node.js version
echo "📋 Current Node.js version:"
node --version

# Check if we have the right version
NODE_VERSION=$(node --version)
MAJOR_VERSION=$(echo $NODE_VERSION | cut -d'.' -f1 | sed 's/v//')

if [ "$MAJOR_VERSION" -lt 20 ]; then
    echo "❌ Error: Node.js version $NODE_VERSION is too old"
    echo "Required: Node.js 20+ or 22+"
    echo ""
    echo "🔧 Attempting to fix..."
    
    # Check for nvm
    if command_exists nvm; then
        echo "📦 Found nvm, installing Node.js 22..."
        nvm install 22
        nvm use 22
        echo "✅ Switched to Node.js 22"
    # Check for nvs
    elif command_exists nvs; then
        echo "📦 Found nvs, switching to Node.js 22..."
        nvs add 22
        nvs use 22
        echo "✅ Switched to Node.js 22"
    # Check for n
    elif command_exists n; then
        echo "📦 Found n, installing Node.js 22..."
        sudo n 22
        echo "✅ Switched to Node.js 22"
    else
        echo "❌ No Node.js version manager found"
        echo "Please install Node.js 22 manually:"
        echo "1. Download from: https://nodejs.org/"
        echo "2. Or install nvm: curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash"
        exit 1
    fi
    
    # Verify the fix
    echo ""
    echo "📋 New Node.js version:"
    node --version
    NEW_MAJOR_VERSION=$(node --version | cut -d'.' -f1 | sed 's/v//')
    
    if [ "$NEW_MAJOR_VERSION" -lt 20 ]; then
        echo "❌ Still using old Node.js version"
        echo "Please restart your terminal and try again"
        exit 1
    fi
else
    echo "✅ Node.js version is compatible"
fi

# Clean and reinstall dependencies
echo ""
echo "🧹 Cleaning old dependencies..."
rm -rf node_modules package-lock.json

echo "📦 Installing dependencies with correct Node.js version..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi

# Test the development server
echo ""
echo "🚀 Testing development server..."
echo "Starting server for 5 seconds..."

# Start dev server in background
npm run dev &
DEV_PID=$!

# Wait for server to start
sleep 5

# Check if server is running
if kill -0 $DEV_PID 2>/dev/null; then
    echo "✅ Development server started successfully"
    echo "🌐 Server is running at: http://localhost:5173"
    
    # Kill the background process
    kill $DEV_PID
    wait $DEV_PID 2>/dev/null
    
    echo ""
    echo "🎉 All issues fixed successfully!"
    echo ""
    echo "Next steps:"
    echo "1. Run 'npm run dev' to start the development server"
    echo "2. Open http://localhost:5173 in your browser"
    echo "3. Enjoy your camping platform!"
else
    echo "❌ Development server failed to start"
    echo "Please check the error messages above"
    exit 1
fi
