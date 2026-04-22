#!/usr/bin/env node

// Test Supabase Auth directly
// Run with: node scripts/testSupabaseAuth.cjs

require('dotenv').config({ path: '.env.local' });

const { createClient } = require('@supabase/supabase-js');

console.log('=== Supabase Auth Test ===\n');

// Get environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('Environment check:');
console.log('URL:', supabaseUrl ? 'SET' : 'NOT_SET');
console.log('Anon Key:', supabaseAnonKey ? 'SET' : 'NOT_SET');

if (!supabaseUrl || !supabaseAnonKey) {
  console.log('ERROR: Missing environment variables');
  process.exit(1);
}

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey);

console.log('\n1. Testing basic client creation...');
console.log('Client created successfully');

console.log('\n2. Testing auth service...');
const testEmail = `test-auth-${Date.now()}@example.com`;
const testPassword = 'TestPassword123!';

console.log(`Testing registration with: ${testEmail}`);

async function testAuth() {
  try {
    // Test signup
    const { data, error } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
      options: {
        data: {
          name: 'Test User',
          role: 'farmer',
        },
      },
    });

    console.log('\nSignup result:');
    console.log('Data:', data);
    console.log('Error:', error);

    if (error) {
      console.log('\nError Analysis:');
      console.log('Status:', error.status);
      console.log('Message:', error.message);
      
      if (error.status === 500) {
        console.log('\n500 Error Analysis:');
        console.log('This is typically a Supabase service issue.');
        console.log('Possible causes:');
        console.log('1. Email confirmation settings');
        console.log('2. Supabase project configuration');
        console.log('3. Invalid API keys');
        console.log('4. Supabase service outage');
      } else if (error.status === 401) {
        console.log('\n401 Error Analysis:');
        console.log('API key is invalid or expired.');
        console.log('Check your Supabase project settings.');
      } else if (error.status === 403) {
        console.log('\n403 Error Analysis:');
        console.log('API key does not have permission.');
        console.log('Check RLS policies and API key permissions.');
      }
    } else {
      console.log('\nSUCCESS: Auth signup worked!');
      console.log('User ID:', data.user?.id);
      console.log('Email confirmed:', data.user?.email_confirmed_at ? 'YES' : 'NO');
    }

  } catch (err) {
    console.error('Exception occurred:', err);
  }
}

testAuth().then(() => {
  console.log('\n=== Auth Test Complete ===');
}).catch(console.error);
