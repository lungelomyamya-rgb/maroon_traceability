-- Maroon Traceability - Simplified Database Schema
-- For simplified registration flow (name, email, role, password only)

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Test connection table for health checks
CREATE TABLE IF NOT EXISTS _test_connection (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert a test row to verify connection
INSERT INTO _test_connection (id) VALUES (uuid_generate_v4()) ON CONFLICT DO NOTHING;

-- Simplified Users table for streamlined registration
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL CHECK (role IN ('farmer', 'inspector', 'logistics', 'packaging', 'retailer', 'public', 'government', 'admin', 'saps', 'viewer')),
  
  -- Contact information
  address TEXT,
  postal_code VARCHAR(20),
  
  -- Account status
  is_active BOOLEAN DEFAULT TRUE,
  email_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login_at TIMESTAMP WITH TIME ZONE,
  
  -- Additional metadata for simplified registration
  additional_data JSONB DEFAULT '{}'::jsonb,
  
  -- Constraints
  CONSTRAINT users_email_check CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  CONSTRAINT users_postal_code_check CHECK (postal_code IS NULL OR postal_code ~* '^[0-9A-Za-z\s-]+$')
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_is_active ON users(is_active);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);

-- Create updated_at trigger
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

-- Row Level Security (RLS) Policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Users can only see their own data
CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (auth.uid() = id);

-- Users can only insert their own data
CREATE POLICY "Users can insert own data" ON users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Users can only update their own data
CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Admins can do everything
CREATE POLICY "Admins have full access" ON users
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Comments for documentation
COMMENT ON TABLE users IS 'Simplified user table for streamlined registration flow';
COMMENT ON COLUMN users.id IS 'Unique identifier for the user';
COMMENT ON COLUMN users.email IS 'User email address (unique)';
COMMENT ON COLUMN users.name IS 'User full name';
COMMENT ON COLUMN users.role IS 'User role in the system';
COMMENT ON COLUMN users.address IS 'Physical address of the user';
COMMENT ON COLUMN users.postal_code IS 'Postal code for physical address';
COMMENT ON COLUMN users.is_active IS 'Whether the user account is active';
COMMENT ON COLUMN users.email_verified IS 'Whether the user email has been verified';
COMMENT ON COLUMN users.additional_data IS 'Additional metadata in JSON format';
