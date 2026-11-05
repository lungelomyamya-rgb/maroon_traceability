# Vercel Secrets Setup Script (PowerShell)
# This script helps you add all necessary environment variables as Vercel secrets

Write-Host "🔐 Setting up Vercel secrets for Maroon Traceability..." -ForegroundColor Green
Write-Host ""

# Check if Vercel CLI is installed
try {
    $vercelVersion = vercel --version
    Write-Host "✅ Vercel CLI found: $vercelVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Vercel CLI is not installed. Please install it first:" -ForegroundColor Red
    Write-Host "   npm i -g vercel" -ForegroundColor Yellow
    Write-Host "   vercel login" -ForegroundColor Yellow
    exit 1
}

# Check if logged in to Vercel
Write-Host "🔍 Checking Vercel authentication..." -ForegroundColor Yellow
try {
    $vercelUser = vercel whoami
    Write-Host "✅ Logged in to Vercel as: $vercelUser" -ForegroundColor Green
} catch {
    Write-Host "❌ You're not logged in to Vercel. Please run:" -ForegroundColor Red
    Write-Host "   vercel login" -ForegroundColor Yellow
    exit 1
}

Write-Host ""

# Supabase Configuration
Write-Host "🔧 Adding Supabase secrets..." -ForegroundColor Cyan

Write-Host "Setting NEXT_PUBLIC_SUPABASE_URL..." -ForegroundColor Yellow
vercel env add NEXT_PUBLIC_SUPABASE_URL

Write-Host "Setting NEXT_PUBLIC_SUPABASE_ANON_KEY..." -ForegroundColor Yellow
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY

Write-Host "Setting SUPABASE_SERVICE_ROLE_KEY..." -ForegroundColor Yellow
vercel env add SUPABASE_SERVICE_ROLE_KEY

# App Configuration
Write-Host ""
Write-Host "🔧 Adding app configuration secrets..." -ForegroundColor Cyan

Write-Host "Setting NEXT_PUBLIC_APP_NAME..." -ForegroundColor Yellow
vercel env add NEXT_PUBLIC_APP_NAME

Write-Host "Setting NEXT_PUBLIC_APP_DESCRIPTION..." -ForegroundColor Yellow
vercel env add NEXT_PUBLIC_APP_DESCRIPTION

Write-Host "Setting NEXT_PUBLIC_BASE_URL..." -ForegroundColor Yellow
vercel env add NEXT_PUBLIC_BASE_URL

Write-Host "Setting NEXT_PUBLIC_API_BASE_URL..." -ForegroundColor Yellow
vercel env add NEXT_PUBLIC_API_BASE_URL

# Feature Flags
Write-Host ""
Write-Host "🔧 Adding feature flag secrets..." -ForegroundColor Cyan

Write-Host "Setting NEXT_PUBLIC_ENABLE_ANALYTICS..." -ForegroundColor Yellow
vercel env add NEXT_PUBLIC_ENABLE_ANALYTICS

Write-Host "Setting NEXT_PUBLIC_ENABLE_ERROR_TRACKING..." -ForegroundColor Yellow
vercel env add NEXT_PUBLIC_ENABLE_ERROR_TRACKING

Write-Host "Setting NEXT_PUBLIC_ENABLE_PERFORMANCE_MONITORING..." -ForegroundColor Yellow
vercel env add NEXT_PUBLIC_ENABLE_PERFORMANCE_MONITORING

Write-Host "Setting NEXT_PUBLIC_DEV_MODE..." -ForegroundColor Yellow
vercel env add NEXT_PUBLIC_DEV_MODE

Write-Host ""
Write-Host "✅ All secrets have been added to your Vercel project!" -ForegroundColor Green
Write-Host ""

# Display values to copy
Write-Host "📋 Values to use when prompted:" -ForegroundColor Cyan
Write-Host ""
Write-Host "NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY:" -ForegroundColor White
Write-Host "Copy from Supabase Dashboard -> Project Settings -> API Keys (use the sb_publishable_ and sb_secret_ keys)" -ForegroundColor Gray
Write-Host ""
Write-Host "NEXT_PUBLIC_APP_NAME:" -ForegroundColor White
Write-Host "Maroon Blockchain" -ForegroundColor Gray
Write-Host ""
Write-Host "NEXT_PUBLIC_APP_DESCRIPTION:" -ForegroundColor White
Write-Host "Blockchain-based supply chain traceability" -ForegroundColor Gray
Write-Host ""
Write-Host "NEXT_PUBLIC_BASE_URL:" -ForegroundColor White
Write-Host "https://your-vercel-app-url.vercel.app" -ForegroundColor Gray
Write-Host ""
Write-Host "NEXT_PUBLIC_API_BASE_URL:" -ForegroundColor White
Write-Host "https://your-vercel-app-url.vercel.app/api" -ForegroundColor Gray
Write-Host ""
Write-Host "NEXT_PUBLIC_ENABLE_ANALYTICS:" -ForegroundColor White
Write-Host "false" -ForegroundColor Gray
Write-Host ""
Write-Host "NEXT_PUBLIC_ENABLE_ERROR_TRACKING:" -ForegroundColor White
Write-Host "true" -ForegroundColor Gray
Write-Host ""
Write-Host "NEXT_PUBLIC_ENABLE_PERFORMANCE_MONITORING:" -ForegroundColor White
Write-Host "true" -ForegroundColor Gray
Write-Host ""
Write-Host "NEXT_PUBLIC_DEV_MODE:" -ForegroundColor White
Write-Host "false" -ForegroundColor Gray
Write-Host ""
Write-Host "🚀 After adding all secrets, trigger a new deployment in Vercel!" -ForegroundColor Green
