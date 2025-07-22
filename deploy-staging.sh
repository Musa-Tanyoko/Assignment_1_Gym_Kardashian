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

# Set staging environment
export NODE_ENV=staging
export NEXT_PUBLIC_ENVIRONMENT=staging

# Build the application
echo "🔨 Building application for staging..."
pnpm build

# Run type checking
echo "🔍 Running type checks..."
pnpm type-check

# Run linting
echo "🧹 Running linting..."
pnpm lint

echo "✅ Staging build completed successfully!"

# Optional: Deploy to staging platform
# Uncomment and configure based on your deployment platform

# For Vercel:
# echo "🚀 Deploying to Vercel staging..."
# vercel --prod

# For Netlify:
# echo "🚀 Deploying to Netlify staging..."
# netlify deploy --prod --dir=apps/web/.next

# For custom server:
echo "🚀 Application built successfully for staging!"
echo "📁 Build output: apps/web/.next"
echo "🌐 You can now deploy the contents of apps/web/.next to your staging server" 