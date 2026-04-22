#!/usr/bin/env node

// Test Auth Settings Script
// Run with: node scripts/testAuthSettings.cjs

require('dotenv').config({ path: '.env.local' });

const { createClient } = require('@supabase/supabase-js');

console.log('=== Supabase Auth Settings Test ===\n');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.log('ERROR: Missing environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testAuthSettings() {
  try {
    console.log('Testing different registration scenarios...\n');

    // Test 1: Basic signup without email confirmation
    console.log('1. Testing basic signup (no email confirmation)...');
    
    const testEmail1 = `test-basic-${Date.now()}@example.com`;
    const testPassword = 'TestPassword123!';

    const { data: result1, error: error1 } = await supabase.auth.signUp({
      email: testEmail1,
      password: testPassword,
      options: {
        data: {
          name: 'Test User Basic',
          role: 'farmer',
        },
      },
    });

    console.log('Result 1:', { success: !error1, error: error1?.message, user: !!result1.user });

    if (error1) {
      console.log('ERROR 1:', error1.message);
      console.log('Status:', error1.status);
      
      if (error1.status === 500) {
        console.log('\n500 ERROR ANALYSIS:');
        console.log('This is almost certainly an email confirmation setting issue.');
        console.log('\nIMMEDIATE FIX:');
        console.log('1. Go to Supabase Dashboard > Authentication > Settings');
        console.log('2. UNCHECK "Enable email confirmations"');
        console.log('3. Save settings');
        console.log('4. Try registration again');
        
        console.log('\nAlternative: Check if your project has email templates configured');
        console.log('Go to Authentication > Email Templates');
      }
    } else {
      console.log('SUCCESS: Basic signup worked!');
      console.log('User ID:', result1.user?.id);
      console.log('Email confirmed:', result1.user?.email_confirmed_at ? 'YES' : 'NO');
    }

    // Test 2: Try with different password
    console.log('\n2. Testing with simpler password...');
    
    const testEmail2 = `test-simple-${Date.now()}@example.com`;
    const simplePassword = 'password123';

    const { data: _result2, error: error2 } = await supabase.auth.signUp({
      email: testEmail2,
      password: simplePassword,
      options: {
        data: {
          name: 'Test User Simple',
          role: 'farmer',
        },
      },
    });

    console.log('Result 2:', { success: !error2, error: error2?.message });

    // Test 3: Check project settings
    console.log('\n3. Testing project connectivity...');
    
    const { data: _projectData, error: projectError } = await supabase
      .from('_test_connection')
      .select('id')
      .limit(1);

    if (projectError) {
      console.log('Project connection error:', projectError.message);
    } else {
      console.log('Project connection: SUCCESS');
    }

    console.log('\n=== RECOMMENDATIONS ===');
    
    if (error1 && error1.status === 500) {
      console.log('PRIMARY ISSUE: Email confirmation settings');
      console.log('SOLUTION: Disable email confirmation temporarily');
      console.log('LOCATION: Supabase Dashboard > Authentication > Settings');
    } else if (error1) {
      console.log('ISSUE: API key or project permissions');
      console.log('SOLUTION: Check API keys in Supabase Dashboard > Settings > API');
    } else {
      console.log('Auth service appears to be working');
      console.log('Check your frontend registration form');
    }

  } catch (err) {
    console.error('Auth test failed:', err);
  }
}

testAuthSettings().then(() => {
  console.log('\n=== Auth Settings Test Complete ===');
}).catch(console.error);
