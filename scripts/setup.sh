#!/bin/bash

# CampIndia Setup Script
# This script helps set up the development environment

echo "🏕️  CampIndia Setup Script"
echo "=========================="

# Check Node.js version
echo "📋 Checking Node.js version..."
NODE_VERSION=$(node --version)
echo "Current Node.js version: $NODE_VERSION"

# Extract major version number
MAJOR_VERSION=$(echo $NODE_VERSION | cut -d'.' -f1 | sed 's/v//')

if [ "$MAJOR_VERSION" -lt 20 ]; then
    echo "❌ Error: Node.js version 20+ is required"
    echo "Current version: $NODE_VERSION"
    echo ""
    echo "Please upgrade Node.js:"
    echo "1. Using nvm: nvm install 22 && nvm use 22"
    echo "2. Download from: https://nodejs.org/"
    exit 1
else
    echo "✅ Node.js version is compatible"
fi

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found"
    echo "Please run this script from the project root directory"
    exit 1
fi

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
if npm install; then
    echo "✅ Dependencies installed successfully"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi

# Create necessary directories
echo ""
echo "📁 Creating directories..."
mkdir -p public/icons
mkdir -p public/images
mkdir -p src/i18n/locales
echo "✅ Directories created"

# Check if development server can start
echo ""
echo "🚀 Testing development server..."
echo "Starting server in background..."

# Start dev server in background
npm run dev &
DEV_PID=$!

# Wait a few seconds for server to start
sleep 5

# Check if server is running
if kill -0 $DEV_PID 2>/dev/null; then
    echo "✅ Development server started successfully"
    echo "🌐 Server should be running at: http://localhost:5173"
    
    # Kill the background process
    kill $DEV_PID
    wait $DEV_PID 2>/dev/null
else
    echo "❌ Failed to start development server"
    echo "Please check the error messages above"
    exit 1
fi

echo ""
echo "🎉 Setup completed successfully!"
echo ""
echo "Next steps:"
echo "1. Run 'npm run dev' to start the development server"
echo "2. Open http://localhost:5173 in your browser"
echo "3. Start developing your camping platform!"
echo ""
echo "📚 Check README.md for more information"
