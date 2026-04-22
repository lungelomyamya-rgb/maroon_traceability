#!/bin/bash

# Supabase Setup Script for Maroon Traceability Demo
# This script will help you set up the database schema and environment variables

echo "=== Maroon Traceability Demo - Supabase Setup ==="
echo ""

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "Installing Supabase CLI..."
    npm install -g supabase
fi

echo "Supabase CLI is installed!"
echo ""

# Environment variables setup
echo "=== Environment Variables Setup ==="
echo "Please create a .env.local file in your project root with the following content:"
echo ""
echo "# Supabase Configuration"
echo "NEXT_PUBLIC_SUPABASE_URL=\"https://lzgglzgdgkgrxzbjevzy.supabase.co\""
echo "NEXT_PUBLIC_SUPABASE_ANON_KEY=\"sb_publishable_s_uhYh50W5uCJZvuEMLAUg_WxONb2Iq\""
echo "SUPABASE_SERVICE_ROLE_KEY=\"[YOUR-SERVICE-ROLE-KEY]\""
echo ""
echo "To get your SERVICE_ROLE_KEY:"
echo "1. Go to https://lzgglzgdgkgrxzbjevzy.supabase.co"
echo "2. Navigate to Settings > API"
echo "3. Copy the 'service_role' key"
echo ""

# Database schema setup
echo "=== Database Schema Setup ==="
echo "Now you need to apply the database schema:"
echo ""
echo "Option 1: Use Supabase Dashboard"
echo "1. Go to https://lzgglzgdgkgrxzbjevzy.supabase.co"
echo "2. Navigate to SQL Editor"
echo "3. Copy the contents of database/schema.sql"
echo "4. Paste and run the script"
echo ""
echo "Option 2: Use Supabase CLI"
echo "1. Run: supabase link --project-ref lzgglzgdgkgrxzbjevzy"
echo "2. Run: supabase db push database/schema.sql"
echo ""

# Authentication setup
echo "=== Authentication Setup ==="
echo "1. Go to https://lzgglzgdgkgrxzbjevzy.supabase.co"
echo "2. Navigate to Authentication > Settings"
echo "3. Set Site URL to: http://localhost:3000"
echo "4. Add redirect URL: http://localhost:3000/auth/callback"
echo "5. Enable email confirmations"
echo "6. Configure email templates (optional)"
echo ""

# Test the setup
echo "=== Testing the Setup ==="
echo "1. Create .env.local file with the variables above"
echo "2. Run: npm run dev"
echo "3. Navigate to: http://localhost:3000/register/individual"
echo "4. Test the registration flow"
echo ""

echo "=== Setup Complete ==="
echo "Your registration system is ready to use!"
echo "For detailed instructions, see docs/setup/supabase-setup.md"
