@echo off
echo 🔧 Fixing .env.local file...

REM Check if .env.local exists
if not exist ".env.local" (
    echo ❌ .env.local file not found!
    exit /b 1
)

REM Create backup
copy ".env.local" ".env.local.backup" >nul
echo ✅ Created backup: .env.local.backup

REM Create a proper .env.local file from .env.example
echo 📝 Creating new .env.local from .env.example...

(
echo # Environment Variables for Maroon Traceability
echo # Generated from .env.example
echo.
echo NEXT_PUBLIC_APP_NAME="Maroon Blockchain"
echo NEXT_PUBLIC_APP_DESCRIPTION="Blockchain-based supply chain traceability"
echo NEXT_PUBLIC_BASE_URL="http://localhost:3000"
echo NEXT_PUBLIC_API_BASE_URL="http://localhost:3000/api"
echo.
echo # Database Configuration
echo NEXT_PUBLIC_SUPABASE_URL="https://lzgglzgdgkgrxzbjevzy.supabase.co"
echo NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx6Z2dsemdkZ2tncnh6Ympldnp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAyMDk5NTksImV4cCI6MjA4NTc4NTk1OX0.xHvSfID9wtq0FVC4clLH8TmheJE-jPtfKIq2qXfmDFk"
echo SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx6Z2dsemdkZ2tncnh6Ympldnp5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDIwOTk1OSwiZXhwIjoyMDg1Nzg1OTU5fQ.9RacyqhlZf1yQAz6CZlhuatsuwF_Ug8aULZBRlLLP98"
echo.
echo # Blockchain Configuration
echo NEXT_PUBLIC_BLOCKCHAIN_NETWORK="localhost"
echo NEXT_PUBLIC_BLOCKCHAIN_PORT="8545"
echo.
echo # Feature Flags
echo NEXT_PUBLIC_ENABLE_ANALYTICS="false"
echo NEXT_PUBLIC_ENABLE_ERROR_TRACKING="true"
echo NEXT_PUBLIC_ENABLE_PERFORMANCE_MONITORING="true"
echo.
echo # Development
echo NEXT_PUBLIC_DEV_MODE="true"
) > ".env.local"

echo ✅ Created new .env.local with proper formatting

echo.
echo 📄 New .env.local content:
type ".env.local"

echo.
echo 🎉 Environment file fixed!
echo 📋 Next steps:
echo 1. Restart your development server: npm run dev
echo 2. Check the console for any remaining errors
echo 3. Verify Supabase connection in the debug logs

pause
