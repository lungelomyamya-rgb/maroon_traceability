-- Fix Address Fields Script (Simple Version)
-- This script checks and fixes missing address and postal_code columns
-- Compatible with all PostgreSQL versions

-- Check current table structure
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'users' 
ORDER BY ordinal_position;

-- Add missing columns if they don't exist (simple version)
-- Note: This will show warnings if columns already exist, which is normal

ALTER TABLE users ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS postal_code VARCHAR(20);

-- Add postal code constraint if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'users_postal_code_check' 
        AND table_name = 'users'
    ) THEN
        ALTER TABLE users ADD CONSTRAINT users_postal_code_check 
        CHECK (postal_code IS NULL OR postal_code ~* '^[0-9A-Za-z\s-]+$');
        SELECT 'Added postal code constraint to users table' AS result;
    ELSE
        SELECT 'Postal code constraint already exists' AS result;
    END IF;
END $$;

-- Show final table structure
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'users' 
ORDER BY ordinal_position;

-- Show sample data to verify
SELECT 
    id, 
    email, 
    name, 
    role,
    address,
    postal_code,
    is_active, 
    email_verified,
    additional_data
FROM users 
LIMIT 5;

SELECT 'Address fields fix completed!' AS status;
