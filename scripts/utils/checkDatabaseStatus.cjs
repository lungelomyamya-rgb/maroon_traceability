#!/usr/bin/env node

// Check Database Status Script
// Run with: node scripts/checkDatabaseStatus.cjs

require('dotenv').config({ path: '.env.local' });

const { createClient } = require('@supabase/supabase-js');

console.log('=== Database Status Check ===\n');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.log('ERROR: Missing environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkDatabaseStatus() {
  try {
    console.log('1. Checking users table existence...');
    
    // Check if users table exists and has structure
    const { data: _tableInfo, error: tableError } = await supabase
      .from('users')
      .select('*')
      .limit(0);
    
    if (tableError) {
      console.log('ERROR: Cannot access users table:', tableError.message);
      console.log('This means the table might not exist or RLS policies are blocking access');
    } else {
      console.log('SUCCESS: Users table is accessible');
    }

    console.log('\n2. Checking RLS policies...');
    
    // Try to check current policies (this might fail due to permissions)
    try {
      const { data: policies, error: policyError } = await supabase
        .from('pg_policies')
        .select('*')
        .eq('tablename', 'users');
      
      if (policyError) {
        console.log('Cannot check policies (expected):', policyError.message);
      } else {
        console.log('Current policies:', policies);
      }
    } catch (err) {
      console.log('Policy check failed (expected):', err.message);
    }

    console.log('\n3. Testing email availability check...');
    
    // Test the email availability function that our registration uses
    const { data: emailCheck, error: emailError } = await supabase
      .from('users')
      .select('id')
      .eq('email', 'test-status-check@example.com')
      .limit(1);
    
    if (emailError) {
      console.log('ERROR: Email availability check failed:', emailError.message);
      console.log('This is the core issue - RLS policies are blocking the check');
    } else {
      const isAvailable = !emailCheck || emailCheck.length === 0;
      console.log('SUCCESS: Email availability check works');
      console.log('test-status-check@example.com available:', isAvailable);
    }

    console.log('\n4. Testing basic auth service...');
    
    // Test if we can at least call the auth service
    const { data: authData, error: authError } = await supabase.auth.getUser();
    
    if (authError && authError.message.includes('Invalid JWT')) {
      console.log('SUCCESS: Auth service is working (expected JWT error for unauthenticated user)');
    } else if (authError) {
      console.log('WARNING: Unexpected auth error:', authError.message);
    } else {
      console.log('Auth service response:', authData);
    }

    console.log('\n5. Recommendations...');
    
    if (tableError) {
      console.log('ACTION REQUIRED: Apply the database schema');
      console.log('The users table may not exist or has wrong structure');
    } else if (emailError) {
      console.log('ACTION REQUIRED: Fix RLS policies');
      console.log('The policies are blocking email availability checks');
      console.log('Try this in Supabase SQL Editor:');
      console.log('DROP POLICY IF EXISTS "Allow public select for email check" ON users;');
      console.log('CREATE POLICY "Allow public select for email check" ON users FOR SELECT USING (true);');
    } else {
      console.log('Database appears to be configured correctly');
      console.log('If registration still fails, the issue might be:');
      console.log('1. Supabase Auth settings (email confirmation)');
      console.log('2. API key permissions');
      console.log('3. Supabase service status');
    }

    console.log('\n6. Next test to run...');
    console.log('npm run test:supabase-auth');

  } catch (err) {
    console.error('Database check failed:', err);
  }
}

checkDatabaseStatus().then(() => {
  console.log('\n=== Database Status Check Complete ===');
}).catch(console.error);
