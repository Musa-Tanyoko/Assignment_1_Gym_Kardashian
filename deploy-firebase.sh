#!/bin/bash

# Firebase Hosting Deployment Script
set -e

echo "🚀 Starting Firebase hosting deployment..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root directory."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
pnpm install

# Set environment
export NODE_ENV=production
export NEXT_PUBLIC_ENVIRONMENT=production

# Build the application for static export
echo "🔨 Building application for Firebase hosting..."
cd apps/web
pnpm build

# Check if build was successful
if [ ! -d "out" ]; then
    echo "❌ Error: Build failed. 'out' directory not found."
    exit 1
fi

echo "✅ Build completed successfully!"

# Deploy to Firebase hosting
echo "🚀 Deploying to Firebase hosting..."
cd ../..
firebase deploy --only hosting

echo "✅ Firebase hosting deployment completed!" 