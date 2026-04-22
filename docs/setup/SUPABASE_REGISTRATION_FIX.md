# Supabase Registration Fix Guide

## Problem Identified

The registration system was failing with 500 errors due to:
1. Restrictive RLS policies preventing user profile creation
2. Schema field name mismatches between adapter and database
3. Missing environment variables

## Solution Steps

### 1. Apply Database Schema Fixes

Run the following SQL commands in your Supabase SQL Editor:

```sql
-- Apply the main schema
-- Run the contents of: database/schema.sql

-- Then apply the RLS fixes
-- Run the contents of: database/fixRLS.sql
```

### 2. Configure Environment Variables

Create a `.env.local` file with your Supabase credentials:

```bash
# Get these from your Supabase project settings
NEXT_PUBLIC_SUPABASE_URL="https://your-project-id.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
```

### 3. Verify Supabase Configuration

1. **Authentication Settings**:
   - Enable email confirmation
   - Set site URL to `http://localhost:3000`
   - Add redirect URLs for your domain

2. **Database Settings**:
   - Ensure the `users` table exists with the correct schema
   - Apply the RLS policies from `fixRLS.sql`
   - Verify the `_test_connection` table exists

### 4. Test the Registration Flow

1. Start the development server: `npm run dev`
2. Navigate to `/register/individual`
3. Try registering with a test email
4. Check the console for detailed logging

## Key Changes Made

### Database Schema Fixes

1. **RLS Policies**: Updated to allow public insertion for registration
2. **Field Name Mapping**: Fixed adapter to use correct database field names
3. **Error Handling**: Added comprehensive logging and error handling

### Code Improvements

1. **SupabaseRegistrationAdapter**: Fixed field name mismatches
2. **Error Logging**: Added detailed console logging for debugging
3. **Data Transformation**: Proper mapping between database and interface types

## Troubleshooting

### Registration Still Fails?

1. **Check Environment Variables**:
   ```bash
   # In your terminal
   echo $NEXT_PUBLIC_SUPABASE_URL
   echo $NEXT_PUBLIC_SUPABASE_ANON_KEY
   ```

2. **Verify Database Connection**:
   - Open Supabase SQL Editor
   - Run: `SELECT * FROM _test_connection LIMIT 1;`

3. **Check RLS Policies**:
   ```sql
   -- Verify policies exist
   SELECT * FROM pg_policies WHERE tablename = 'users';
   ```

4. **Review Console Logs**:
   - Look for detailed error messages
   - Check for field name mismatches
   - Verify Supabase client initialization

### Common Issues

1. **"Database error saving new user"**:
   - Usually caused by RLS policies
   - Solution: Apply the `fixRLS.sql` script

2. **"Supabase is not available"**:
   - Environment variables not set
   - Solution: Configure `.env.local` properly

3. **"Invalid email format"**:
   - Email validation is too strict
   - Solution: Use a valid email format

## Testing Commands

```bash
# Test environment variables
npm run dev

# Check type compilation
npm run type-check

# Run tests (when implemented)
npm test
```

## Support

If issues persist:
1. Check the browser console for detailed errors
2. Verify Supabase project settings
3. Ensure database schema is applied correctly
4. Review the registration adapter logs
