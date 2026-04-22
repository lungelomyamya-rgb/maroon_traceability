#!/usr/bin/env node

// Fix Profiles Table Script
// Creates the missing profiles table that Supabase expects

require('dotenv').config({ path: '.env.local' });

console.log('=== Creating Profiles Table ===\n');

const { createClient: _createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.log('ERROR: Missing environment variables');
  process.exit(1);
}

console.log('SQL to run in Supabase Dashboard > SQL Editor:\n');
console.log('=' .repeat(80));

console.log(`
-- Create the profiles table that Supabase Auth expects
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  updated_at TIMESTAMP WITH TIME ZONE,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  website TEXT,
  
  -- Add your custom fields here
  email TEXT,
  name TEXT,
  role TEXT,
  user_type TEXT,
  registration_type TEXT,
  is_active BOOLEAN DEFAULT FALSE,
  email_verified BOOLEAN DEFAULT FALSE,
  is_approved BOOLEAN DEFAULT FALSE,
  company_name TEXT,
  registration_number TEXT,
  tax_number TEXT,
  vat_number TEXT,
  contact_person TEXT,
  phone TEXT,
  address TEXT,
  city TEXT,
  province TEXT,
  postal_code TEXT,
  country TEXT DEFAULT 'South Africa',
  farm_size TEXT,
  livestock_type TEXT,
  number_of_employees TEXT,
  annual_revenue TEXT,
  business_type TEXT,
  number_of_members TEXT,
  plan TEXT DEFAULT 'basic',
  subscription_status TEXT DEFAULT 'trial',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login_at TIMESTAMP WITH TIME ZONE,
  additional_data JSONB DEFAULT '{}'::jsonb
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own profile" ON profiles
FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update own profile" ON profiles
FOR UPDATE USING (auth.uid()::text = id::text);

CREATE POLICY "Allow authenticated insert" ON profiles
FOR INSERT WITH CHECK (auth.role() = 'authenticated' OR auth.uid()::text = id::text);

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, role, user_type, registration_type)
  VALUES (
    new.id,
    new.email,
    new.raw_user_meta_data->>'name',
    new.raw_user_meta_data->>'role',
    new.raw_user_meta_data->>'user_type',
    new.raw_user_meta_data->>'registration_type'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create profile on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
`);

console.log('=' .repeat(80));
console.log('\nINSTRUCTIONS:');
console.log('1. Go to Supabase Dashboard');
console.log('2. Navigate to SQL Editor');
console.log('3. Copy and paste the SQL above');
console.log('4. Run the script');
console.log('5. Test registration again');

console.log('\nAfter running this SQL, registration should work!');
console.log('The profiles table will be automatically populated when users sign up.');
