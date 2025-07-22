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

# Set staging environment
$env:NODE_ENV = $Environment
$env:NEXT_PUBLIC_ENVIRONMENT = $Environment

# Build the application
Write-Host "🔨 Building application for staging..." -ForegroundColor Yellow
pnpm build

# Run type checking
Write-Host "🔍 Running type checks..." -ForegroundColor Yellow
pnpm type-check

# Run linting
Write-Host "🧹 Running linting..." -ForegroundColor Yellow
pnpm lint

Write-Host "✅ Staging build completed successfully!" -ForegroundColor Green

# Optional: Deploy to staging platform
# Uncomment and configure based on your deployment platform

# For Vercel:
# Write-Host "🚀 Deploying to Vercel staging..." -ForegroundColor Green
# vercel --prod

# For Netlify:
# Write-Host "🚀 Deploying to Netlify staging..." -ForegroundColor Green
# netlify deploy --prod --dir=apps/web/.next

# For custom server:
Write-Host "🚀 Application built successfully for staging!" -ForegroundColor Green
Write-Host "📁 Build output: apps/web/.next" -ForegroundColor Cyan
Write-Host "🌐 You can now deploy the contents of apps/web/.next to your staging server" -ForegroundColor Cyan 