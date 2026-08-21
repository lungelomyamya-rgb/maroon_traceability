-- =============================================================================
-- Maroon Traceability — canonical schema baseline
-- Captured from live Supabase: 2026-08-21
-- App requires: public.users, public._test_connection
-- Other live tables (profiles, user_profiles, registration_attempts) are
-- documented in docs/setup/schema-inventory.md and are NOT required to run the app.
-- Apply on an EMPTY project via Supabase SQL Editor.
-- See docs/setup/database-migrations.md
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Health-check table
CREATE TABLE IF NOT EXISTS _test_connection (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO _test_connection (id)
VALUES (uuid_generate_v4())
ON CONFLICT DO NOTHING;

-- Primary app user table (aligned with live columns; nullable contact fields)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL
    CHECK (role IN (
      'farmer', 'inspector', 'logistics', 'packaging', 'retailer',
      'public', 'government', 'admin', 'saps', 'viewer'
    )),
  is_active BOOLEAN DEFAULT TRUE,
  email_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_login_at TIMESTAMPTZ,
  additional_data JSONB DEFAULT '{}'::jsonb,
  address TEXT,
  postal_code VARCHAR(20),
  user_type VARCHAR(50),
  registration_type VARCHAR(50),
  phone VARCHAR(50),
  city VARCHAR(100),
  province VARCHAR(50)
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_is_active ON users(is_active);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);
CREATE INDEX IF NOT EXISTS idx_users_city ON users(city);
CREATE INDEX IF NOT EXISTS idx_users_province ON users(province);

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Target policies for NEW projects (stricter than current live legacy set)
DROP POLICY IF EXISTS "Service role full access" ON users;
CREATE POLICY "Service role full access" ON users
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Users can view own data" ON users;
CREATE POLICY "Users can view own data" ON users
  FOR SELECT
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own data" ON users;
CREATE POLICY "Users can insert own data" ON users
  FOR INSERT
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own data" ON users;
CREATE POLICY "Users can update own data" ON users
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

COMMENT ON TABLE users IS 'Primary user profiles for Maroon Traceability (app reads/writes this table)';
COMMENT ON TABLE _test_connection IS 'Connectivity / health check table';