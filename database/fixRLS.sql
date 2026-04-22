-- Fix RLS policies for user registration
-- This script fixes the restrictive RLS policies that prevent user registration

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Users can insert own profile" ON users;
DROP POLICY IF EXISTS "Enable insert for authentication" ON users;
DROP POLICY IF EXISTS "Enable select for email check" ON users;

-- Create new policies that allow registration
CREATE POLICY "Users can view own profile" ON users
FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update own profile" ON users
FOR UPDATE USING (auth.uid()::text = id::text);

-- Allow public insertion for registration (bypass RLS for new users)
CREATE POLICY "Allow public insert for registration" ON users
FOR INSERT WITH CHECK (true);

-- Allow public select for email availability check
CREATE POLICY "Allow public select for email check" ON users
FOR SELECT USING (true);

-- Ensure RLS is enabled
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Grant necessary permissions
GRANT ALL ON users TO authenticated;
GRANT SELECT, INSERT ON users TO anon;
