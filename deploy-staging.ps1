# Staging Deployment Script for Fitness App (PowerShell)
param(
    [string]$Environment = "staging"
)

Write-Host "🚀 Starting staging deployment..." -ForegroundColor Green

# Check if we're in the right directory
if (-not (Test-Path "package.json")) {
    Write-Host "❌ Error: package.json not found. Please run this script from the fitness-app root directory." -ForegroundColor Red
    exit 1
}

# Install dependencies
Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
pnpm install

# Copy staging environment file
Write-Host "⚙️ Setting up staging environment..." -ForegroundColor Yellow
if (Test-Path "apps/web/.env.staging") {
    Copy-Item "apps/web/.env.staging" "apps/web/.env.local" -Force
    Write-Host "✅ Staging environment configured" -ForegroundColor Green
}
else {
    Write-Host "⚠️ Warning: .env.staging not found, using default environment" -ForegroundColor Yellow
}

# Set staging environment variables
$env:NODE_ENV = $Environment
$env:VITE_ENVIRONMENT = $Environment

# Build the application
Write-Host "🔨 Building application for staging..." -ForegroundColor Yellow
pnpm build:staging

# Run type checking
Write-Host "🔍 Running type checks..." -ForegroundColor Yellow
pnpm type-check

# Run linting (optional - won't fail deployment)
Write-Host "🧹 Running linting..." -ForegroundColor Yellow
try {
    pnpm lint
    Write-Host "✅ Linting passed" -ForegroundColor Green
}
catch {
    Write-Host "⚠️ Linting had issues, but continuing with deployment..." -ForegroundColor Yellow
}

Write-Host "✅ Staging build completed successfully!" -ForegroundColor Green

# Check if build output exists
if (Test-Path "apps/web/dist") {
    Write-Host "📁 Build output: apps/web/dist" -ForegroundColor Cyan
    
    # Deploy to Firebase Hosting
    Write-Host "🚀 Deploying to Firebase Hosting (staging)..." -ForegroundColor Green
    firebase deploy --only hosting:staging
    
    Write-Host "🎉 Deployment completed successfully!" -ForegroundColor Green
    Write-Host "🌐 Your staging app is now live!" -ForegroundColor Cyan
}
else {
    Write-Host "❌ Error: Build output not found at apps/web/dist" -ForegroundColor Red
    exit 1
}
