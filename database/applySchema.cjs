#!/usr/bin/env node

// Apply Database Schema Script
// This script helps you apply the database schema correctly

require('dotenv').config({ path: '.env.local' });

console.log('=== Database Schema Application Guide ===\n');

console.log('The 500 error "Database error saving new user" indicates');
console.log('that Supabase Auth cannot create users in your database.\n');

console.log('IMMEDIATE ACTIONS REQUIRED:\n');

console.log('1. Go to your Supabase Dashboard:');
console.log('   https://lzgglzgdgkgrxzbjevzy.supabase.co\n');

console.log('2. Navigate to: SQL Editor\n');

console.log('3. Run these scripts in order:\n');

console.log('   FIRST - Run this to create basic tables:');
console.log('   ======================================');
console.log(`-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Test connection table
CREATE TABLE IF NOT EXISTS _test_connection (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL CHECK (role IN ('farmer', 'inspector', 'logistics', 'packaging', 'retailer', 'public', 'government', 'admin', 'saps', 'viewer')),
  user_type VARCHAR(50) NOT NULL CHECK (user_type IN ('individual', 'commercial', 'smme', 'retailer', 'professional', 'enterprise')),
  registration_type VARCHAR(50) NOT NULL CHECK (registration_type IN ('individual', 'commercial', 'smme', 'retailer', 'professional', 'enterprise')),
  is_active BOOLEAN DEFAULT FALSE,
  email_verified BOOLEAN DEFAULT FALSE,
  is_approved BOOLEAN DEFAULT FALSE,
  company_name VARCHAR(255),
  registration_number VARCHAR(100),
  tax_number VARCHAR(100),
  vat_number VARCHAR(100),
  contact_person VARCHAR(255),
  phone VARCHAR(50),
  address TEXT,
  city VARCHAR(100),
  province VARCHAR(100),
  postal_code VARCHAR(20),
  country VARCHAR(100) DEFAULT 'South Africa',
  farm_size VARCHAR(50),
  livestock_type VARCHAR(100),
  number_of_employees VARCHAR(50),
  annual_revenue VARCHAR(50),
  business_type VARCHAR(100),
  number_of_members VARCHAR(50),
  plan VARCHAR(50) DEFAULT 'basic' CHECK (plan IN ('basic', 'professional', 'enterprise')),
  subscription_status VARCHAR(50) DEFAULT 'trial' CHECK (subscription_status IN ('trial', 'active', 'expired', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login_at TIMESTAMP WITH TIME ZONE,
  additional_data JSONB DEFAULT '{}'::jsonb,
  CONSTRAINT users_email_check CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$'),
  CONSTRAINT users_phone_check CHECK (phone IS NULL OR phone ~* '^[0-9+\\-\\s()]+$')
);`);

console.log('\n   SECOND - Run this to fix RLS policies:');
console.log('   ======================================');
console.log(`-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Users can insert own profile" ON users;

-- Create proper policies
CREATE POLICY "Users can view own profile" ON users
FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update own profile" ON users
FOR UPDATE USING (auth.uid()::text = id::text);

-- CRITICAL: Allow Supabase Auth to create users
CREATE POLICY "Allow authenticated insert" ON users
FOR INSERT WITH CHECK (auth.role() = 'authenticated' OR auth.uid()::text = id::text);

-- Allow public select for email availability
CREATE POLICY "Allow public select for email check" ON users
FOR SELECT USING (true);`);

console.log('\n4. After applying schema, test again:');
console.log('   npm run test:supabase-auth');

console.log('\n5. If still failing, check Supabase Auth settings:');
console.log('   - Go to Authentication > Settings');
console.log('   - Try disabling "Enable email confirmations" temporarily');
console.log('   - Check Site URL: http://localhost:3000');

console.log('\n=== Schema Application Guide Complete ===');
