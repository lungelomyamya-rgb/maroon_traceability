@echo off
echo Creating clean .env.local file...

del ".env.local" 2>nul

echo # Environment Variables for Maroon Traceability > ".env.local"
echo NEXT_PUBLIC_APP_NAME="Maroon Blockchain" >> ".env.local"
echo NEXT_PUBLIC_APP_DESCRIPTION="Blockchain-based supply chain traceability" >> ".env.local"
echo NEXT_PUBLIC_BASE_URL="http://localhost:3000" >> ".env.local"
echo NEXT_PUBLIC_API_BASE_URL="http://localhost:3000/api" >> ".env.local"
echo. >> ".env.local"
echo # Database Configuration >> ".env.local"
echo NEXT_PUBLIC_SUPABASE_URL="https://lzgglzgdgkgrxzbjevzy.supabase.co" >> ".env.local"
echo NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx6Z2dsemdkZ2tncnh6Ympldnp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAyMDk5NTksImV4cCI6MjA4NTc4NTk1OX0.xHvSfID9wtq0FVC4clLH8TmheJE-jPtfKIq2qXfmDFk" >> ".env.local"
echo SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx6Z2dsemdkZ2tncnh6Ympldnp5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDIwOTk1OSwiZXhwIjoyMDg1Nzg1OTU5fQ.9RacyqhlZf1yQAz6CZlhuatsuwF_Ug8aULZBRlLLP98" >> ".env.local"
echo. >> ".env.local"
echo # Blockchain Configuration >> ".env.local"
echo NEXT_PUBLIC_BLOCKCHAIN_NETWORK="localhost" >> ".env.local"
echo NEXT_PUBLIC_BLOCKCHAIN_PORT="8545" >> ".env.local"
echo. >> ".env.local"
echo # Feature Flags >> ".env.local"
echo NEXT_PUBLIC_ENABLE_ANALYTICS="false" >> ".env.local"
echo NEXT_PUBLIC_ENABLE_ERROR_TRACKING="true" >> ".env.local"
echo NEXT_PUBLIC_ENABLE_PERFORMANCE_MONITORING="true" >> ".env.local"
echo. >> ".env.local"
echo # Development >> ".env.local"
echo NEXT_PUBLIC_DEV_MODE="true" >> ".env.local"

echo ✅ Clean .env.local created successfully!
echo 📋 Key variables set:
echo   - Supabase URL: https://lzgglzgdgkgrxzbjevzy.supabase.co
echo   - Supabase Anon Key: SET
echo   - Supabase Service Role Key: SET

pause
