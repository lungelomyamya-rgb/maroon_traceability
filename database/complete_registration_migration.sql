-- Maroon Traceability - Complete Registration Migration (Part 2)
-- Run this AFTER running add_registration_columns.sql
-- This script creates the remaining tables, functions, and views

-- =====================================================
-- 1. Update role constraint to ensure it includes all roles
-- =====================================================

-- Drop existing role constraint if it exists
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.check_constraints 
        WHERE constraint_name = 'users_role_check'
    ) THEN
        ALTER TABLE users DROP CONSTRAINT users_role_check;
    END IF;
END $$;

-- Add updated role constraint
ALTER TABLE users 
ADD CONSTRAINT users_role_check 
CHECK (role IN ('farmer', 'inspector', 'logistics', 'packaging', 'retailer', 'public', 'government', 'admin', 'saps', 'viewer'));

-- =====================================================
-- 2. Create user_profiles table for extended profile information
-- =====================================================

CREATE TABLE IF NOT EXISTS user_profiles (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    
    -- Business Information
    company_name VARCHAR(255),
    registration_number VARCHAR(100),
    tax_number VARCHAR(100),
    vat_number VARCHAR(100),
    
    -- Contact Information
    phone VARCHAR(50),
    address TEXT,
    city VARCHAR(100),
    province VARCHAR(50),
    postal_code VARCHAR(20),
    country VARCHAR(100) DEFAULT 'South Africa',
    
    -- Farm/Business Details
    farm_size VARCHAR(50),
    livestock_type VARCHAR(50),
    business_type VARCHAR(100),
    number_of_workers INTEGER,
    annual_revenue VARCHAR(50),
    
    -- Metadata
    profile_completion_score INTEGER DEFAULT 0 CHECK (profile_completion_score >= 0 AND profile_completion_score <= 100),
    last_profile_update TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Unique constraint
    UNIQUE(user_id)
);

-- Create indexes for user_profiles
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_company_name ON user_profiles(company_name);
CREATE INDEX IF NOT EXISTS idx_user_profiles_business_type ON user_profiles(business_type);

-- =====================================================
-- 3. Create registration_attempts table for tracking
-- =====================================================

CREATE TABLE IF NOT EXISTS registration_attempts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) NOT NULL,
    registration_type VARCHAR(50) NOT NULL, -- 'individual', 'commercial', 'smme', 'retailer'
    user_role VARCHAR(50) NOT NULL,
    attempt_data JSONB DEFAULT '{}'::jsonb,
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'completed', 'failed', 'abandoned'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    
    -- Constraints
    CONSTRAINT registration_attempts_email_check CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    CONSTRAINT registration_attempts_status_check CHECK (status IN ('pending', 'completed', 'failed', 'abandoned')),
    CONSTRAINT registration_attempts_type_check CHECK (registration_type IN ('individual', 'commercial', 'smme', 'retailer'))
);

-- Create indexes for registration_attempts
CREATE INDEX IF NOT EXISTS idx_registration_attempts_email ON registration_attempts(email);
CREATE INDEX IF NOT EXISTS idx_registration_attempts_status ON registration_attempts(status);
CREATE INDEX IF NOT EXISTS idx_registration_attempts_type ON registration_attempts(registration_type);
CREATE INDEX IF NOT EXISTS idx_registration_attempts_created_at ON registration_attempts(created_at);

-- =====================================================
-- 4. Create updated_at trigger function
-- =====================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at 
BEFORE UPDATE ON users 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles;
CREATE TRIGGER update_user_profiles_updated_at 
BEFORE UPDATE ON user_profiles 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_registration_attempts_updated_at ON registration_attempts;
CREATE TRIGGER update_registration_attempts_updated_at 
BEFORE UPDATE ON registration_attempts 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 5. Create migration function for existing users
-- =====================================================

CREATE OR REPLACE FUNCTION migrate_user_registration_data()
RETURNS TABLE(user_id UUID, migrated_fields TEXT[]) AS $$
DECLARE
    user_record RECORD;
    fields_to_migrate TEXT[];
BEGIN
    -- Loop through existing users and migrate their data
    FOR user_record IN 
        SELECT id, additional_data, address, postal_code, phone, city, province
        FROM users 
        WHERE additional_data IS NOT NULL AND jsonb_typeof(additional_data) = 'object'
    LOOP
        fields_to_migrate := ARRAY[]::TEXT[];
        
        -- Migrate phone if not already set
        IF user_record.phone IS NULL AND user_record.additional_data ? 'phone' THEN
            UPDATE users 
            SET phone = (additional_data->>'phone') 
            WHERE id = user_record.id;
            fields_to_migrate := array_append(fields_to_migrate, 'phone');
        END IF;
        
        -- Migrate city if not already set
        IF user_record.city IS NULL AND user_record.additional_data ? 'city' THEN
            UPDATE users 
            SET city = (additional_data->>'city') 
            WHERE id = user_record.id;
            fields_to_migrate := array_append(fields_to_migrate, 'city');
        END IF;
        
        -- Migrate province if not already set
        IF user_record.province IS NULL AND user_record.additional_data ? 'province' THEN
            UPDATE users 
            SET province = (additional_data->>'province') 
            WHERE id = user_record.id;
            fields_to_migrate := array_append(fields_to_migrate, 'province');
        END IF;
        
        -- Create or update user profile record
        INSERT INTO user_profiles (
            user_id, 
            company_name, 
            registration_number, 
            tax_number, 
            vat_number,
            phone,
            address,
            city,
            province,
            postal_code,
            country,
            farm_size,
            livestock_type,
            number_of_workers,
            annual_revenue,
            business_type
        ) VALUES (
            user_record.id,
            user_record.additional_data->>'companyName',
            user_record.additional_data->>'registrationNumber',
            user_record.additional_data->>'taxNumber',
            user_record.additional_data->>'vatNumber',
            COALESCE(user_record.phone, user_record.additional_data->>'phone'),
            user_record.additional_data->>'address',
            COALESCE(user_record.city, user_record.additional_data->>'city'),
            COALESCE(user_record.province, user_record.additional_data->>'province'),
            user_record.postal_code,
            COALESCE(user_record.additional_data->>'country', 'South Africa'),
            user_record.additional_data->>'farmSize',
            user_record.additional_data->>'livestockType',
            CAST(user_record.additional_data->>'numberOfEmployees' AS INTEGER),
            user_record.additional_data->>'annualRevenue',
            user_record.additional_data->>'businessType'
        )
        ON CONFLICT (user_id) DO UPDATE SET
            company_name = EXCLUDED.company_name,
            registration_number = EXCLUDED.registration_number,
            tax_number = EXCLUDED.tax_number,
            vat_number = EXCLUDED.vat_number,
            phone = EXCLUDED.phone,
            address = EXCLUDED.address,
            city = EXCLUDED.city,
            province = EXCLUDED.province,
            postal_code = EXCLUDED.postal_code,
            country = EXCLUDED.country,
            farm_size = EXCLUDED.farm_size,
            livestock_type = EXCLUDED.livestock_type,
            number_of_workers = EXCLUDED.number_of_workers,
            annual_revenue = EXCLUDED.annual_revenue,
            business_type = EXCLUDED.business_type,
            updated_at = NOW();
        
        fields_to_migrate := array_append(fields_to_migrate, 'profile_created');
        
        -- Return migration results
        user_id := user_record.id;
        migrated_fields := fields_to_migrate;
        RETURN NEXT;
    END LOOP;
    
    RETURN;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 6. Create profile completion calculator
-- =====================================================

CREATE OR REPLACE FUNCTION calculate_profile_completion(user_uuid UUID)
RETURNS INTEGER AS $$
DECLARE
    completion_score INTEGER := 0;
    profile_record RECORD;
BEGIN
    -- Get user and profile data
    SELECT 
        u.phone, u.city, u.province, u.address, u.postal_code,
        p.company_name, p.registration_number, p.tax_number, 
        p.farm_size, p.livestock_type, p.business_type,
        p.number_of_workers, p.annual_revenue
    INTO profile_record
    FROM users u
    LEFT JOIN user_profiles p ON u.id = p.user_id
    WHERE u.id = user_uuid;
    
    -- Calculate completion score based on filled fields
    IF profile_record.phone IS NOT NULL AND profile_record.phone != '' THEN
        completion_score := completion_score + 10;
    END IF;
    
    IF profile_record.city IS NOT NULL AND profile_record.city != '' THEN
        completion_score := completion_score + 10;
    END IF;
    
    IF profile_record.province IS NOT NULL AND profile_record.province != '' THEN
        completion_score := completion_score + 10;
    END IF;
    
    IF profile_record.address IS NOT NULL AND profile_record.address != '' THEN
        completion_score := completion_score + 10;
    END IF;
    
    IF profile_record.postal_code IS NOT NULL AND profile_record.postal_code != '' THEN
        completion_score := completion_score + 10;
    END IF;
    
    IF profile_record.company_name IS NOT NULL AND profile_record.company_name != '' THEN
        completion_score := completion_score + 20;
    END IF;
    
    IF profile_record.registration_number IS NOT NULL AND profile_record.registration_number != '' THEN
        completion_score := completion_score + 10;
    END IF;
    
    IF profile_record.tax_number IS NOT NULL AND profile_record.tax_number != '' THEN
        completion_score := completion_score + 10;
    END IF;
    
    IF profile_record.farm_size IS NOT NULL AND profile_record.farm_size != '' THEN
        completion_score := completion_score + 10;
    END IF;
    
    IF profile_record.livestock_type IS NOT NULL AND profile_record.livestock_type != '' THEN
        completion_score := completion_score + 10;
    END IF;
    
    -- Update profile completion score
    UPDATE user_profiles 
    SET profile_completion_score = completion_score, last_profile_update = NOW()
    WHERE user_id = user_uuid;
    
    RETURN completion_score;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 7. Create views for common queries
-- =====================================================

-- View for complete user information
CREATE OR REPLACE VIEW user_complete_info AS
SELECT 
    u.id,
    u.email,
    u.name,
    u.role,
    u.phone,
    u.address,
    u.postal_code,
    u.city,
    u.province,
    u.is_active,
    u.email_verified,
    u.created_at,
    u.updated_at,
    u.last_login_at,
    u.additional_data,
    p.company_name,
    p.registration_number,
    p.tax_number,
    p.vat_number,
    p.farm_size,
    p.livestock_type,
    p.business_type,
    p.number_of_workers,
    p.annual_revenue,
    p.country,
    p.profile_completion_score,
    p.last_profile_update
FROM users u
LEFT JOIN user_profiles p ON u.id = p.user_id;

-- View for registration analytics
CREATE OR REPLACE VIEW registration_analytics AS
SELECT 
    DATE_TRUNC('month', created_at) as month,
    registration_type,
    user_role,
    status,
    COUNT(*) as count,
    COUNT(*) FILTER (WHERE status = 'completed') as completed_count,
    COUNT(*) FILTER (WHERE status = 'failed') as failed_count
FROM registration_attempts
GROUP BY DATE_TRUNC('month', created_at), registration_type, user_role, status
ORDER BY month DESC, registration_type, user_role;

-- =====================================================
-- 8. Success message
-- =====================================================

DO $$
BEGIN
    RAISE NOTICE 'Registration migration completed successfully!';
    RAISE NOTICE 'Run SELECT * FROM migrate_user_registration_data(); to migrate existing user data.';
END $$;
