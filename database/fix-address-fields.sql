-- Fix Address Fields Script
-- This script checks and fixes missing address and postal_code columns

-- Check current table structure
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'users' 
ORDER BY ordinal_position;

-- Add missing columns if they don't exist
DO $$
BEGIN
    -- Add address column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'address'
    ) THEN
        ALTER TABLE users ADD COLUMN address TEXT;
        RAISE NOTICE 'Added address column to users table';
    END IF;
    
    -- Add postal_code column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'postal_code'
    ) THEN
        ALTER TABLE users ADD COLUMN postal_code VARCHAR(20);
        RAISE NOTICE 'Added postal_code column to users table';
    END IF;
END $$;

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
        RAISE NOTICE 'Added postal_code constraint to users table';
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

RAISE NOTICE 'Address fields fix completed successfully!';
