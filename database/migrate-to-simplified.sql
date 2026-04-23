-- Migration Script: Complex Schema to Simplified Schema
-- This script migrates from the complex registration schema to the simplified one

-- NOTE: This will remove unused columns and tables
-- BACKUP YOUR DATABASE BEFORE RUNNING THIS SCRIPT

-- Step 1: Create backup of current users table (optional but recommended)
-- CREATE TABLE users_backup AS SELECT * FROM users;

-- Step 2: Drop unused tables that are no longer needed
DROP TABLE IF EXISTS registration_attempts CASCADE;
DROP TABLE IF EXISTS email_verification_tokens CASCADE;
DROP TABLE IF EXISTS user_sessions CASCADE;

-- Step 3: Remove unused columns from users table
-- Remove business information columns
ALTER TABLE users DROP COLUMN IF EXISTS user_type;
ALTER TABLE users DROP COLUMN IF EXISTS registration_type;
ALTER TABLE users DROP COLUMN IF EXISTS company_name;
ALTER TABLE users DROP COLUMN IF EXISTS registration_number;
ALTER TABLE users DROP COLUMN IF EXISTS tax_number;
ALTER TABLE users DROP COLUMN IF EXISTS vat_number;
ALTER TABLE users DROP COLUMN IF EXISTS contact_person;

-- Remove contact information columns
ALTER TABLE users DROP COLUMN IF EXISTS phone;
ALTER TABLE users DROP COLUMN IF EXISTS address;
ALTER TABLE users DROP COLUMN IF EXISTS city;
ALTER TABLE users DROP COLUMN IF EXISTS province;
ALTER TABLE users DROP COLUMN IF EXISTS postal_code;
ALTER TABLE users DROP COLUMN IF EXISTS country;

-- Remove farm/business detail columns
ALTER TABLE users DROP COLUMN IF EXISTS farm_size;
ALTER TABLE users DROP COLUMN IF EXISTS livestock_type;
ALTER TABLE users DROP COLUMN IF EXISTS number_of_employees;
ALTER TABLE users DROP COLUMN IF EXISTS annual_revenue;
ALTER TABLE users DROP COLUMN IF EXISTS business_type;
ALTER TABLE users DROP COLUMN IF EXISTS number_of_members;

-- Remove subscription columns
ALTER TABLE users DROP COLUMN IF EXISTS plan;
ALTER TABLE users DROP COLUMN IF EXISTS subscription_status;

-- Remove approval column (simplified flow auto-approves)
ALTER TABLE users DROP COLUMN IF EXISTS is_approved;

-- Step 4: Drop unused indexes
DROP INDEX IF EXISTS idx_users_user_type;
DROP INDEX IF EXISTS idx_users_email_verified;
DROP INDEX IF EXISTS idx_users_phone;
DROP INDEX IF EXISTS idx_users_company_name;

-- Step 5: Update constraints
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_phone_check;

-- Step 6: Update RLS policies for simplified schema
DROP POLICY IF EXISTS "Users can view own data" ON users;
DROP POLICY IF EXISTS "Users can insert own data" ON users;
DROP POLICY IF EXISTS "Users can update own data" ON users;
DROP POLICY IF EXISTS "Admins have full access" ON users;

-- Recreate simplified RLS policies
CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert own data" ON users
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins have full access" ON users
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Step 7: Set all existing users to active (since we removed is_approved)
UPDATE users SET is_active = TRUE WHERE is_active IS NULL;

-- Step 8: Clean up additional_data for simplified registration
UPDATE users SET 
  additional_data = jsonb_build_object(
    'registrationType', COALESCE(additional_data->>'registrationType', 'simplified'),
    'registeredAt', COALESCE(additional_data->>'registeredAt', created_at::text),
    'migratedAt', NOW()::text
  )
WHERE additional_data IS NULL OR additional_data = '{}';

-- Step 9: Verify the simplified schema
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'users' 
ORDER BY ordinal_position;

-- Step 10: Show sample data to verify migration
SELECT 
  id, 
  email, 
  name, 
  role, 
  is_active, 
  email_verified,
  additional_data
FROM users 
LIMIT 5;

-- Migration complete message
DO $$
BEGIN
  RAISE NOTICE 'Migration to simplified schema completed successfully!';
  RAISE NOTICE 'Users table now has only essential columns: id, email, name, role, is_active, email_verified, created_at, updated_at, last_login_at, additional_data';
END $$;
