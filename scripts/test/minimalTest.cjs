#!/usr/bin/env node

// Minimal Test Script
// Tests signup without any metadata that might cause issues

require('dotenv').config({ path: '.env.local' });

const { createClient } = require('@supabase/supabase-js');

console.log('=== Minimal Supabase Test ===\n');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function minimalTest() {
  try {
    console.log('Testing signup with NO metadata...');
    
    const testEmail = `minimal-${Date.now()}@test.com`;
    const testPassword = 'password123';
    
    console.log(`Email: ${testEmail}`);
    console.log(`Password: ${testPassword}`);
    
    // Test 1: Signup with NO metadata at all
    const { data: result1, error: error1 } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword
      // NO options.data - this might be causing the issue
    });
    
    console.log('\nTest 1 - No metadata:');
    console.log('Success:', !error1);
    console.log('Error:', error1?.message);
    console.log('User ID:', result1.user?.id);
    console.log('Email confirmed:', result1.user?.email_confirmed_at ? 'YES' : 'NO');
    
    if (!error1) {
      console.log('\nSUCCESS! The issue was with metadata in signup.');
      console.log('Your registration adapter needs to be updated to NOT include metadata during initial signup.');
      
      console.log('\nFIX NEEDED:');
      console.log('In SupabaseRegistrationAdapter.createUser(), remove the options.data parameter');
      console.log('Create the user profile in the database separately after auth signup succeeds');
      
      return;
    }
    
    // Test 2: Try with minimal metadata
    console.log('\n' + '='.repeat(50));
    console.log('Testing with minimal metadata...');
    
    const testEmail2 = `minimal2-${Date.now()}@test.com`;
    
    const { data: result2, error: error2 } = await supabase.auth.signUp({
      email: testEmail2,
      password: testPassword,
      options: {
        data: {} // Empty metadata
      }
    });
    
    console.log('\nTest 2 - Empty metadata:');
    console.log('Success:', !error2);
    console.log('Error:', error2?.message);
    console.log('User ID:', result2.user?.id);
    
    if (!error2) {
      console.log('\nSUCCESS! Empty metadata works.');
      console.log('The issue is with specific metadata fields.');
    }
    
    // Test 3: Try with just name
    console.log('\n' + '='.repeat(50));
    console.log('Testing with only name metadata...');
    
    const testEmail3 = `minimal3-${Date.now()}@test.com`;
    
    const { data: result3, error: error3 } = await supabase.auth.signUp({
      email: testEmail3,
      password: testPassword,
      options: {
        data: {
          name: 'Test User'
        }
      }
    });
    
    console.log('\nTest 3 - Only name:');
    console.log('Success:', !error3);
    console.log('Error:', error3?.message);
    console.log('User ID:', result3.user?.id);
    
    if (!error3) {
      console.log('\nSUCCESS! Name metadata works.');
      console.log('The issue might be with the "role" field or other specific fields.');
    }
    
    console.log('\n=== ANALYSIS ===');
    
    if (error1 && error2 && error3) {
      console.log('ALL TESTS FAILED - This is a Supabase configuration issue');
      console.log('Error ID from previous test: 9f042dec503b3517-JNB');
      console.log('\nNEXT STEPS:');
      console.log('1. Go to Supabase Dashboard > Database > Functions');
      console.log('2. Check for any triggers on the auth.users table');
      console.log('3. Look for any database functions that might be failing');
      console.log('4. Try creating a user manually in the Supabase Dashboard');
      console.log('5. If manual creation works, the issue is with the API call format');
      
      console.log('\nTEMPORARY WORKAROUND:');
      console.log('1. Disable user creation in your app temporarily');
      console.log('2. Create users manually in Supabase Dashboard');
      console.log('3. Implement login functionality');
      console.log('4. Contact Supabase support with error ID: 9f042dec503b3517-JNB');
    } else if (!error1) {
      console.log('SOLUTION FOUND: Remove metadata from signup');
      console.log('Update your registration adapter to not pass options.data');
    } else if (!error2) {
      console.log('SOLUTION FOUND: Use empty metadata');
      console.log('Pass empty object {} instead of user data');
    } else if (!error3) {
      console.log('SOLUTION FOUND: Only pass name field');
      console.log('Remove role and other fields from metadata');
    }

  } catch (err) {
    console.error('Minimal test failed:', err);
  }
}

minimalTest().then(() => {
  console.log('\n=== Minimal Test Complete ===');
}).catch(console.error);
