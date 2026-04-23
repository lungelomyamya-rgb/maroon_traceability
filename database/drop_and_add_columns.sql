-- Maroon Traceability - Drop and Add Registration Columns
-- Simple approach: drop existing columns and add fresh ones

-- Drop existing columns if they exist
DO $$
BEGIN
    -- Drop phone column
    BEGIN
        ALTER TABLE users DROP COLUMN IF EXISTS phone;
        RAISE NOTICE '✅ Phone column dropped (if it existed)';
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'ℹ️ Phone column did not exist or could not be dropped';
    END;
    
    -- Drop city column
    BEGIN
        ALTER TABLE users DROP COLUMN IF EXISTS city;
        RAISE NOTICE '✅ City column dropped (if it existed)';
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'ℹ️ City column did not exist or could not be dropped';
    END;
    
    -- Drop province column
    BEGIN
        ALTER TABLE users DROP COLUMN IF EXISTS province;
        RAISE NOTICE '✅ Province column dropped (if it existed)';
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'ℹ️ Province column did not exist or could not be dropped';
    END;
    
    RAISE NOTICE '=== COLUMN DROPPING COMPLETE ===';
END $$;

-- Add fresh columns
DO $$
BEGIN
    RAISE NOTICE '=== ADDING FRESH COLUMNS ===';
    
    -- Add phone column
    ALTER TABLE users ADD COLUMN phone VARCHAR(50);
    RAISE NOTICE '✅ Phone column added successfully';
    
    -- Add city column
    ALTER TABLE users ADD COLUMN city VARCHAR(100);
    RAISE NOTICE '✅ City column added successfully';
    
    -- Add province column
    ALTER TABLE users ADD COLUMN province VARCHAR(50);
    RAISE NOTICE '✅ Province column added successfully';
    
    RAISE NOTICE '=== COLUMN ADDITION COMPLETE ===';
END $$;

-- Verify columns were added
DO $$
DECLARE
    phone_exists BOOLEAN;
    city_exists BOOLEAN;
    province_exists BOOLEAN;
BEGIN
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'phone'
    ) INTO phone_exists;
    
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'city'
    ) INTO city_exists;
    
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'province'
    ) INTO province_exists;
    
    RAISE NOTICE '=== VERIFICATION RESULTS ===';
    RAISE NOTICE 'Phone column exists: %', CASE WHEN phone_exists THEN '✅ YES' ELSE '❌ NO' END;
    RAISE NOTICE 'City column exists: %', CASE WHEN city_exists THEN '✅ YES' ELSE '❌ NO' END;
    RAISE NOTICE 'Province column exists: %', CASE WHEN province_exists THEN '✅ YES' ELSE '❌ NO' END;
    
    IF phone_exists AND city_exists AND province_exists THEN
        RAISE NOTICE '🎉 ALL COLUMNS ADDED SUCCESSFULLY!';
        RAISE NOTICE 'Now run: \i database/create_simple_indexes.sql';
    ELSE
        RAISE NOTICE '❌ Some columns failed to add';
    END IF;
END $$;
