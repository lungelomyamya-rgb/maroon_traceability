-- Maroon Traceability - Create Simple Indexes
-- Run this AFTER drop_and_add_columns.sql
-- This creates indexes on the freshly added columns

-- Create indexes for the new columns
DO $$
BEGIN
    RAISE NOTICE '=== CREATING INDEXES ===';
    
    -- Create phone index
    CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);
    RAISE NOTICE '✅ Phone index created';
    
    -- Create city index
    CREATE INDEX IF NOT EXISTS idx_users_city ON users(city);
    RAISE NOTICE '✅ City index created';
    
    -- Create province index
    CREATE INDEX IF NOT EXISTS idx_users_province ON users(province);
    RAISE NOTICE '✅ Province index created';
    
    RAISE NOTICE '🎉 ALL INDEXES CREATED SUCCESSFULLY!';
END $$;

-- Verify indexes were created
DO $$
DECLARE
    phone_index_exists BOOLEAN;
    city_index_exists BOOLEAN;
    province_index_exists BOOLEAN;
BEGIN
    -- Check if indexes exist
    SELECT EXISTS (
        SELECT 1 FROM pg_indexes 
        WHERE tablename = 'users' AND indexname = 'idx_users_phone'
    ) INTO phone_index_exists;
    
    SELECT EXISTS (
        SELECT 1 FROM pg_indexes 
        WHERE tablename = 'users' AND indexname = 'idx_users_city'
    ) INTO city_index_exists;
    
    SELECT EXISTS (
        SELECT 1 FROM pg_indexes 
        WHERE tablename = 'users' AND indexname = 'idx_users_province'
    ) INTO province_index_exists;
    
    RAISE NOTICE '=== INDEX VERIFICATION ===';
    RAISE NOTICE 'Phone index exists: %', CASE WHEN phone_index_exists THEN '✅ YES' ELSE '❌ NO' END;
    RAISE NOTICE 'City index exists: %', CASE WHEN city_index_exists THEN '✅ YES' ELSE '❌ NO' END;
    RAISE NOTICE 'Province index exists: %', CASE WHEN province_index_exists THEN '✅ YES' ELSE '❌ NO' END;
    
    IF phone_index_exists AND city_index_exists AND province_index_exists THEN
        RAISE NOTICE '🎉 ALL INDEXES VERIFIED!';
        RAISE NOTICE 'Now run: \i database/complete_registration_migration.sql';
    ELSE
        RAISE NOTICE '❌ Some indexes failed to create';
    END IF;
END $$;
