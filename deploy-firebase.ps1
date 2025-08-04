# Firebase Hosting Deployment Script (PowerShell)
param(
    [string]$Environment = "production"
)

Write-Host "🚀 Starting Firebase hosting deployment..." -ForegroundColor Green

# Check if we're in the right directory
if (-not (Test-Path "package.json")) {
    Write-Host "❌ Error: package.json not found. Please run this script from the project root directory." -ForegroundColor Red
    exit 1
}

# Install dependencies
Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
pnpm install

# Set environment
$env:NODE_ENV = $Environment
$env:NEXT_PUBLIC_ENVIRONMENT = $Environment

# Build the application for static export
Write-Host "🔨 Building application for Firebase hosting..." -ForegroundColor Yellow
cd apps/web
pnpm build

# Check if build was successful
if (-not (Test-Path "dist")) {
    Write-Host "❌ Error: Build failed. 'dist' directory not found." -ForegroundColor Red
    exit 1
}

Write-Host "✅ Build completed successfully!" -ForegroundColor Green

# Deploy to Firebase hosting
Write-Host "🚀 Deploying to Firebase hosting..." -ForegroundColor Green
cd ../..
firebase deploy --only hosting

Write-Host "✅ Firebase hosting deployment completed!" -ForegroundColor Green 