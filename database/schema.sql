-- Maroon Traceability - Safe Database Schema
-- Supabase PostgreSQL Schema with IF NOT EXISTS handling

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Test connection table for health checks
CREATE TABLE IF NOT EXISTS _test_connection (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert a test row to verify connection
INSERT INTO _test_connection (id) VALUES (uuid_generate_v4()) ON CONFLICT DO NOTHING;

-- Users table for storing user profiles
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL CHECK (role IN ('farmer', 'inspector', 'logistics', 'packaging', 'retailer', 'public', 'government', 'admin', 'saps', 'viewer')),
  
  -- User type classification
  user_type VARCHAR(50) NOT NULL CHECK (user_type IN ('individual', 'commercial', 'smme', 'retailer', 'professional', 'enterprise')),
  registration_type VARCHAR(50) NOT NULL CHECK (registration_type IN ('individual', 'commercial', 'smme', 'retailer', 'professional', 'enterprise')),
  
  -- Account status
  is_active BOOLEAN DEFAULT FALSE,
  email_verified BOOLEAN DEFAULT FALSE,
  is_approved BOOLEAN DEFAULT FALSE,
  
  -- Business information (optional)
  company_name VARCHAR(255),
  registration_number VARCHAR(100),
  tax_number VARCHAR(100),
  vat_number VARCHAR(100),
  contact_person VARCHAR(255),
  
  -- Contact information
  phone VARCHAR(50),
  address TEXT,
  city VARCHAR(100),
  province VARCHAR(100),
  postal_code VARCHAR(20),
  country VARCHAR(100) DEFAULT 'South Africa',
  
  -- Farm/Business details
  farm_size VARCHAR(50),
  livestock_type VARCHAR(100),
  number_of_employees VARCHAR(50),
  annual_revenue VARCHAR(50),
  business_type VARCHAR(100),
  number_of_members VARCHAR(50),
  
  -- Subscription/Plan information
  plan VARCHAR(50) DEFAULT 'basic' CHECK (plan IN ('basic', 'professional', 'enterprise')),
  subscription_status VARCHAR(50) DEFAULT 'trial' CHECK (subscription_status IN ('trial', 'active', 'expired', 'cancelled')),
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login_at TIMESTAMP WITH TIME ZONE,
  
  -- Additional metadata (JSON)
  additional_data JSONB DEFAULT '{}'::jsonb,
  
  -- Constraints
  CONSTRAINT users_email_check CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  CONSTRAINT users_phone_check CHECK (phone IS NULL OR phone ~* '^[0-9+\-\s()]+$')
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_user_type ON users(user_type);
CREATE INDEX IF NOT EXISTS idx_users_is_active ON users(is_active);
CREATE INDEX IF NOT EXISTS idx_users_email_verified ON users(email_verified);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);

-- Create updated_at trigger (safe version)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop trigger if exists and recreate
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at 
BEFORE UPDATE ON users 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Registration attempts table for tracking
CREATE TABLE IF NOT EXISTS registration_attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) NOT NULL,
  user_data JSONB NOT NULL,
  status VARCHAR(50) NOT NULL CHECK (status IN ('pending', 'completed', 'failed', 'cancelled')),
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  
  CONSTRAINT registration_attempts_email_check CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

CREATE INDEX IF NOT EXISTS idx_registration_attempts_email ON registration_attempts(email);
CREATE INDEX IF NOT EXISTS idx_registration_attempts_status ON registration_attempts(status);
CREATE INDEX IF NOT EXISTS idx_registration_attempts_created_at ON registration_attempts(created_at);

-- Email verification tokens table
CREATE TABLE IF NOT EXISTS email_verification_tokens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) NOT NULL,
  token VARCHAR(255) UNIQUE NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  used_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT email_verification_tokens_email_check CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

CREATE INDEX IF NOT EXISTS idx_email_verification_tokens_email ON email_verification_tokens(email);
CREATE INDEX IF NOT EXISTS idx_email_verification_tokens_token ON email_verification_tokens(token);
CREATE INDEX IF NOT EXISTS idx_email_verification_tokens_expires_at ON email_verification_tokens(expires_at);

-- User sessions table (optional, for session management)
CREATE TABLE IF NOT EXISTS user_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  session_token VARCHAR(255) UNIQUE NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_accessed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ip_address INET,
  user_agent TEXT
);

CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_session_token ON user_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_user_sessions_expires_at ON user_sessions(expires_at);

-- Row Level Security (RLS) policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE registration_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_verification_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;

-- Users table policies - Fixed for registration flow
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Users can insert own profile" ON users;
DROP POLICY IF EXISTS "Allow public insert for registration" ON users;
DROP POLICY IF EXISTS "Allow public select for email check" ON users;

CREATE POLICY "Users can view own profile" ON users
FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update own profile" ON users
FOR UPDATE USING (auth.uid()::text = id::text);

CREATE POLICY "Users can insert own profile" ON users
FOR INSERT WITH CHECK (auth.uid()::text = id::text);

-- Allow public insertion for registration (bypass RLS for new users)
CREATE POLICY "Allow public insert for registration" ON users
FOR INSERT WITH CHECK (true);

-- Allow public select for email availability check
CREATE POLICY "Allow public select for email check" ON users
FOR SELECT USING (true);

-- Registration attempts policies (public for insertion, authenticated for viewing)
DROP POLICY IF EXISTS "Anyone can insert registration attempts" ON registration_attempts;
DROP POLICY IF EXISTS "Authenticated users can view registration attempts" ON registration_attempts;

CREATE POLICY "Anyone can insert registration attempts" ON registration_attempts
FOR INSERT WITH CHECK (true);

CREATE POLICY "Authenticated users can view registration attempts" ON registration_attempts
FOR SELECT USING (auth.role() = 'authenticated');

-- Email verification tokens policies
DROP POLICY IF EXISTS "Anyone can insert email verification tokens" ON email_verification_tokens;
DROP POLICY IF EXISTS "Anyone can view email verification tokens" ON email_verification_tokens;

CREATE POLICY "Anyone can insert email verification tokens" ON email_verification_tokens
FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can view email verification tokens" ON email_verification_tokens
FOR SELECT USING (true);

-- User sessions policies
DROP POLICY IF EXISTS "Users can manage own sessions" ON user_sessions;

CREATE POLICY "Users can manage own sessions" ON user_sessions
FOR ALL USING (auth.uid()::text = user_id::text);

-- Functions for user management
CREATE OR REPLACE FUNCTION public.get_user_by_email(user_email VARCHAR(255))
RETURNS TABLE (
  id UUID,
  email VARCHAR(255),
  name VARCHAR(255),
  role VARCHAR(50),
  user_type VARCHAR(50),
  is_active BOOLEAN,
  email_verified BOOLEAN,
  created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    u.id,
    u.email,
    u.name,
    u.role,
    u.user_type,
    u.is_active,
    u.email_verified,
    u.created_at
  FROM users u
  WHERE u.email = get_user_by_email.user_email;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check email availability
CREATE OR REPLACE FUNCTION public.is_email_available(user_email VARCHAR(255))
RETURNS BOOLEAN AS $$
BEGIN
  RETURN NOT EXISTS (
    SELECT 1 FROM users WHERE email = is_email_available.user_email
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to create user with profile
CREATE OR REPLACE FUNCTION public.create_user_with_profile(
  user_email VARCHAR(255),
  user_name VARCHAR(255),
  user_role VARCHAR(50),
  user_user_type VARCHAR(50),
  user_registration_type VARCHAR(50),
  user_password_hash VARCHAR(255),
  user_additional_data JSONB DEFAULT '{}'::jsonb
)
RETURNS UUID AS $$
DECLARE
  new_user_id UUID;
BEGIN
  INSERT INTO users (
    email,
    name,
    role,
    user_type,
    registration_type,
    additional_data
  ) VALUES (
    user_email,
    user_name,
    user_role,
    user_user_type,
    user_registration_type,
    user_additional_data
  ) RETURNING id INTO new_user_id;
  
  RETURN new_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Comments for documentation
COMMENT ON TABLE users IS 'Main user profiles table for Maroon Traceability System';
COMMENT ON TABLE registration_attempts IS 'Track registration attempts and their status';
COMMENT ON TABLE email_verification_tokens IS 'Store email verification tokens';
COMMENT ON TABLE user_sessions IS 'User session management';
