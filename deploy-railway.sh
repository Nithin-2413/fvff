#!/bin/bash

echo "🚀 Starting Railway deployment build..."

# Install dependencies
echo "📦 Installing dependencies..."
npm ci

# Build the project
echo "🔨 Building project..."
npm run build

# Verify build output
echo "✅ Verifying build output..."
if [ ! -d "dist" ]; then
    echo "❌ Build failed: dist directory not found"
    exit 1
fi

if [ ! -f "dist/index.js" ]; then
    echo "❌ Build failed: server bundle not found"
    exit 1
fi

if [ ! -d "dist/public" ]; then
    echo "❌ Build failed: client build not found"
    exit 1
fi

echo "✅ Build completed successfully!"
echo "🌟 Ready for deployment!"