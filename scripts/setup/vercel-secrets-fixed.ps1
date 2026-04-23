# Vercel Secrets Setup Script (Fixed) - PowerShell
# This script properly handles Vercel's environment separation

Write-Host "🔐 Setting up Vercel secrets for Maroon Traceability..." -ForegroundColor Green
Write-Host ""

# Check if Vercel CLI is installed and logged in
try {
    $vercelVersion = vercel --version
    Write-Host "✅ Vercel CLI found: $vercelVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Vercel CLI is not installed. Please install it first:" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Project is linked to Vercel" -ForegroundColor Green
Write-Host ""

# Production and Preview secrets (sensitive)
Write-Host "🔧 Adding Production & Preview secrets..." -ForegroundColor Cyan

$secrets = @{
    "NEXT_PUBLIC_SUPABASE_URL" = "https://lzgglzgdgkgrxzbjevzy.supabase.co"
    "NEXT_PUBLIC_SUPABASE_ANON_KEY" = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx6Z2dsemdkZ2tncnh6Ympldnp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAyMDk5NTksImV4cCI6MjA4NTc4NTk1OX0.xHvSfID9wtq0FVC4clLH8TmheJE-jPtfKIq2qXfmDFk"
    "SUPABASE_SERVICE_ROLE_KEY" = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx6Z2dsemdkZ2tncnh6Ympldnp5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDIwOTk1OSwiZXhwIjoyMDg1Nzg1OTU5fQ.9RacyqhlZf1yQAz6CZlhuatsuwF_Ug8aULZBRlLLP98"
}

foreach ($secret in $secrets.GetEnumerator()) {
    Write-Host "Setting $($secret.Key) for Production & Preview..." -ForegroundColor Yellow
    $value = $secret.Value
    Write-Output $value | vercel env add $secret.Key production
    Write-Output $value | vercel env add $secret.Key preview
}

# Development environment variables (non-sensitive or local)
Write-Host ""
Write-Host "🔧 Adding Development environment variables..." -ForegroundColor Cyan

$devVars = @{
    "NEXT_PUBLIC_APP_NAME" = "Maroon Blockchain"
    "NEXT_PUBLIC_APP_DESCRIPTION" = "Blockchain-based supply chain traceability"
    "NEXT_PUBLIC_BASE_URL" = "http://localhost:3000"
    "NEXT_PUBLIC_API_BASE_URL" = "http://localhost:3000/api"
    "NEXT_PUBLIC_ENABLE_ANALYTICS" = "false"
    "NEXT_PUBLIC_ENABLE_ERROR_TRACKING" = "true"
    "NEXT_PUBLIC_ENABLE_PERFORMANCE_MONITORING" = "true"
    "NEXT_PUBLIC_DEV_MODE" = "true"
}

foreach ($var in $devVars.GetEnumerator()) {
    Write-Host "Setting $($var.Key) for Development..." -ForegroundColor Yellow
    $value = $var.Value
    Write-Output $value | vercel env add $var.Key development
}

# Production/Preview non-sensitive vars
Write-Host ""
Write-Host "🔧 Adding Production & Preview non-sensitive variables..." -ForegroundColor Cyan

$prodVars = @{
    "NEXT_PUBLIC_APP_NAME" = "Maroon Blockchain"
    "NEXT_PUBLIC_APP_DESCRIPTION" = "Blockchain-based supply chain traceability"
    "NEXT_PUBLIC_ENABLE_ANALYTICS" = "false"
    "NEXT_PUBLIC_ENABLE_ERROR_TRACKING" = "true"
    "NEXT_PUBLIC_ENABLE_PERFORMANCE_MONITORING" = "true"
    "NEXT_PUBLIC_DEV_MODE" = "false"
}

foreach ($var in $prodVars.GetEnumerator()) {
    Write-Host "Setting $($var.Key) for Production & Preview..." -ForegroundColor Yellow
    $value = $var.Value
    Write-Output $value | vercel env add $var.Key production
    Write-Output $value | vercel env add $var.Key preview
}

# Production URLs (need to be set manually since we don't know the exact URL)
Write-Host ""
Write-Host "⚠️  MANUAL SETUP REQUIRED:" -ForegroundColor Yellow
Write-Host "You need to manually set these URLs in Vercel dashboard:" -ForegroundColor White
Write-Host ""
Write-Host "For Production:" -ForegroundColor Cyan
Write-Host "- NEXT_PUBLIC_BASE_URL: https://your-vercel-app-url.vercel.app" -ForegroundColor Gray
Write-Host "- NEXT_PUBLIC_API_BASE_URL: https://your-vercel-app-url.vercel.app/api" -ForegroundColor Gray
Write-Host ""
Write-Host "For Preview:" -ForegroundColor Cyan
Write-Host "- NEXT_PUBLIC_BASE_URL: https://your-preview-url.vercel.app" -ForegroundColor Gray
Write-Host "- NEXT_PUBLIC_API_BASE_URL: https://your-preview-url.vercel.app/api" -ForegroundColor Gray
Write-Host ""

Write-Host "✅ Secrets setup completed!" -ForegroundColor Green
Write-Host "🚀 Now trigger a new deployment in Vercel!" -ForegroundColor Green
