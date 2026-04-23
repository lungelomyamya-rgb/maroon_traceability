#!/bin/bash

# Vercel Secrets Setup Script
# This script helps you add all necessary environment variables as Vercel secrets

echo "🔐 Setting up Vercel secrets for Maroon Traceability..."
echo ""

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI is not installed. Please install it first:"
    echo "   npm i -g vercel"
    echo "   vercel login"
    exit 1
fi

# Check if logged in to Vercel
echo "🔍 Checking Vercel authentication..."
if ! vercel whoami &> /dev/null; then
    echo "❌ You're not logged in to Vercel. Please run:"
    echo "   vercel login"
    exit 1
fi

echo "✅ Vercel CLI is ready!"
echo ""

# Supabase Configuration
echo "🔧 Adding Supabase secrets..."

echo "Setting NEXT_PUBLIC_SUPABASE_URL..."
vercel env add NEXT_PUBLIC_SUPABASE_URL

echo "Setting NEXT_PUBLIC_SUPABASE_ANON_KEY..."
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY

echo "Setting SUPABASE_SERVICE_ROLE_KEY..."
vercel env add SUPABASE_SERVICE_ROLE_KEY

# App Configuration
echo ""
echo "🔧 Adding app configuration secrets..."

echo "Setting NEXT_PUBLIC_APP_NAME..."
vercel env add NEXT_PUBLIC_APP_NAME

echo "Setting NEXT_PUBLIC_APP_DESCRIPTION..."
vercel env add NEXT_PUBLIC_APP_DESCRIPTION

echo "Setting NEXT_PUBLIC_BASE_URL..."
vercel env add NEXT_PUBLIC_BASE_URL

echo "Setting NEXT_PUBLIC_API_BASE_URL..."
vercel env add NEXT_PUBLIC_API_BASE_URL

# Feature Flags
echo ""
echo "🔧 Adding feature flag secrets..."

echo "Setting NEXT_PUBLIC_ENABLE_ANALYTICS..."
vercel env add NEXT_PUBLIC_ENABLE_ANALYTICS

echo "Setting NEXT_PUBLIC_ENABLE_ERROR_TRACKING..."
vercel env add NEXT_PUBLIC_ENABLE_ERROR_TRACKING

echo "Setting NEXT_PUBLIC_ENABLE_PERFORMANCE_MONITORING..."
vercel env add NEXT_PUBLIC_ENABLE_PERFORMANCE_MONITORING

echo "Setting NEXT_PUBLIC_DEV_MODE..."
vercel env add NEXT_PUBLIC_DEV_MODE

echo ""
echo "✅ All secrets have been added to your Vercel project!"
echo ""
echo "📋 Values to use when prompted:"
echo ""
echo "NEXT_PUBLIC_SUPABASE_URL:"
echo "https://lzgglzgdgkgrxzbjevzy.supabase.co"
echo ""
echo "NEXT_PUBLIC_SUPABASE_ANON_KEY:"
echo "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx6Z2dsemdkZ2tncnh6Ympldnp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAyMDk5NTksImV4cCI6MjA4NTc4NTk1OX0.xHvSfID9wtq0FVC4clLH8TmheJE-jPtfKIq2qXfmDFk"
echo ""
echo "SUPABASE_SERVICE_ROLE_KEY:"
echo "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx6Z2dsemdkZ2tncnh6Ympldnp5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDIwOTk1OSwiZXhwIjoyMDg1Nzg1OTU5fQ.9RacyqhlZf1yQAz6CZlhuatsuwF_Ug8aULZBRlLLP98"
echo ""
echo "NEXT_PUBLIC_APP_NAME:"
echo "Maroon Blockchain"
echo ""
echo "NEXT_PUBLIC_APP_DESCRIPTION:"
echo "Blockchain-based supply chain traceability"
echo ""
echo "NEXT_PUBLIC_BASE_URL:"
echo "https://your-vercel-app-url.vercel.app"
echo ""
echo "NEXT_PUBLIC_API_BASE_URL:"
echo "https://your-vercel-app-url.vercel.app/api"
echo ""
echo "NEXT_PUBLIC_ENABLE_ANALYTICS:"
echo "false"
echo ""
echo "NEXT_PUBLIC_ENABLE_ERROR_TRACKING:"
echo "true"
echo ""
echo "NEXT_PUBLIC_ENABLE_PERFORMANCE_MONITORING:"
echo "true"
echo ""
echo "NEXT_PUBLIC_DEV_MODE:"
echo "false"
echo ""
echo "🚀 After adding all secrets, trigger a new deployment in Vercel!"
