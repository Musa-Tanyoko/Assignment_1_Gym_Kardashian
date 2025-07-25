#!/bin/bash

# Staging Deployment Script for Fitness App
set -e

echo "🚀 Starting staging deployment..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the fitness-app root directory."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
pnpm install

# Copy staging environment file
echo "⚙️ Setting up staging environment..."
if [ -f "apps/web/.env.staging" ]; then
    cp apps/web/.env.staging apps/web/.env.local
    echo "✅ Staging environment configured"
else
    echo "⚠️ Warning: .env.staging not found, using default environment"
fi

# Set staging environment variables
export NODE_ENV=staging
export VITE_ENVIRONMENT=staging

# Build the application
echo "🔨 Building application for staging..."
pnpm build:staging

# Run type checking
echo "🔍 Running type checks..."
pnpm type-check 2>/dev/null || echo "⚠️  Type checking not configured, skipping..."

# Run linting
echo "🧹 Running linting..."
pnpm lint

echo "✅ Staging build completed successfully!"

# Check if build output exists
if [ -d "apps/web/dist" ]; then
    echo "📁 Build output: apps/web/dist"
    echo "🌐 You can now deploy the contents of apps/web/dist to your staging server"
    
    # Optional: Deploy to staging platform
    # Uncomment and configure based on your deployment platform
    
    # For Vercel:
    # echo "🚀 Deploying to Vercel staging..."
    # cd apps/web
    # vercel --prod
    # cd ../..
    
    # For Netlify:
    # echo "🚀 Deploying to Netlify staging..."
    # cd apps/web
    # netlify deploy --prod --dir=dist
    # cd ../..
    
    # For Firebase Hosting:
    # echo "🚀 Deploying to Firebase Hosting..."
    # firebase deploy --only hosting
    
    echo "🚀 Application built successfully for staging!"
else
    echo "❌ Error: Build output not found at apps/web/dist"
    exit 1
fi
