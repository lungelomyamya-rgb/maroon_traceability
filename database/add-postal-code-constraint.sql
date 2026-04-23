-- Add Postal Code Constraint Script
-- Simple script to add the missing postal code constraint

-- Add postal code constraint
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'users_postal_code_check' 
        AND table_name = 'users'
    ) THEN
        ALTER TABLE users ADD CONSTRAINT users_postal_code_check 
        CHECK (postal_code IS NULL OR postal_code ~* '^[0-9A-Za-z\s-]+$');
        PERFORM 'Added postal code constraint successfully';
    ELSE
        PERFORM 'Postal code constraint already exists';
    END IF;
END $$;

-- Verify constraint was added
SELECT 
    constraint_name,
    check_clause
FROM information_schema.check_constraints 
WHERE constraint_name = 'users_postal_code_check';

SELECT 'Postal code constraint setup completed!' AS status;
