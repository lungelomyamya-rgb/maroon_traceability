# Fix .env.local file - remove line continuation characters
$envLocalPath = ".env.local"
$backupPath = ".env.local.backup"

Write-Host "🔧 Fixing .env.local file..." -ForegroundColor Green

# Check if .env.local exists
if (-not (Test-Path $envLocalPath)) {
    Write-Host "❌ .env.local file not found!" -ForegroundColor Red
    exit 1
}

# Create backup
Copy-Item $envLocalPath $backupPath -Force
Write-Host "✅ Created backup: $backupPath" -ForegroundColor Green

# Read the file and fix line continuations
$content = Get-Content $envLocalPath -Raw
$fixedContent = $content -replace '\\\s*\n', '' -replace '\\\s*\r\n', ''

# Write the fixed content
Set-Content $envLocalPath $fixedContent -NoNewline
Write-Host "✅ Fixed line continuation characters" -ForegroundColor Green

# Show the fixed content
Write-Host "`n📄 Fixed .env.local content:" -ForegroundColor Cyan
Get-Content $envLocalPath | ForEach-Object { Write-Host $_ }

Write-Host "`n🎉 Environment file fixed!" -ForegroundColor Green
Write-Host "📋 Next steps:" -ForegroundColor Yellow
Write-Host "1. Restart your development server: npm run dev" -ForegroundColor White
Write-Host "2. Check the console for any remaining errors" -ForegroundColor White
