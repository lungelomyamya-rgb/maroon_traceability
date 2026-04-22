#!/usr/bin/env node

// Deep Diagnostic Script
// Run with: node scripts/deepDiagnostic.cjs

require('dotenv').config({ path: '.env.local' });

const { createClient } = require('@supabase/supabase-js');

console.log('=== Deep Supabase Diagnostic ===\n');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.log('ERROR: Missing environment variables');
  process.exit(1);
}

const _supabase = createClient(supabaseUrl, supabaseAnonKey);

async function deepDiagnostic() {
  try {
    console.log('1. Testing API key permissions...');
    
    // Test with a simple REST API call
    const fetch = require('node-fetch');
    
    const restApiTest = await fetch(`${supabaseUrl}/rest/v1/_test_connection?limit=1`, {
      headers: {
        'apikey': supabaseAnonKey,
        'Authorization': `Bearer ${supabaseAnonKey}`
      }
    });
    
    console.log('REST API Status:', restApiTest.status);
    if (restApiTest.status === 200) {
      console.log('SUCCESS: API key has REST API access');
    } else {
      console.log('ERROR: API key permissions issue');
      const errorText = await restApiTest.text();
      console.log('Error details:', errorText);
    }

    console.log('\n2. Testing Auth API directly...');
    
    // Test auth API directly
    const authTest = await fetch(`${supabaseUrl}/auth/v1/settings`, {
      headers: {
        'apikey': supabaseAnonKey,
        'Authorization': `Bearer ${supabaseAnonKey}`
      }
    });
    
    console.log('Auth API Status:', authTest.status);
    if (authTest.status === 200) {
      const authSettings = await authTest.json();
      console.log('Auth settings:', {
        disable_signup: authSettings.disable_signup,
        external_url: authSettings.external_url,
        site_url: authSettings.site_url
      });
    } else {
      console.log('ERROR: Auth API access issue');
      const errorText = await authTest.text();
      console.log('Error details:', errorText);
    }

    console.log('\n3. Testing minimal signup...');
    
    // Test with minimal data
    const minimalSignup = await fetch(`${supabaseUrl}/auth/v1/signup`, {
      method: 'POST',
      headers: {
        'apikey': supabaseAnonKey,
        'Authorization': `Bearer ${supabaseAnonKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: `minimal-${Date.now()}@test.com`,
        password: 'test123456',
        data: {
          role: 'farmer'
        }
      })
    });
    
    console.log('Minimal signup status:', minimalSignup.status);
    const minimalResult = await minimalSignup.json();
    console.log('Minimal signup result:', minimalResult);

    if (minimalSignup.status === 500) {
      console.log('\n500 ERROR ANALYSIS:');
      console.log('This is a Supabase internal error. Possible causes:');
      console.log('1. Database triggers failing');
      console.log('2. User table constraints violated');
      console.log('3. Supabase service issue');
      console.log('4. Invalid user metadata schema');
      
      console.log('\nIMMEDIATE ACTIONS:');
      console.log('A. Check Supabase project status (any outages?)');
      console.log('B. Try creating user manually in Supabase Dashboard');
      console.log('C. Check if there are database triggers on users table');
    }

    console.log('\n4. Testing with service role key...');
    
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (serviceKey) {
      const serviceClient = createClient(supabaseUrl, serviceKey, {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      });
      
      const serviceTest = await serviceClient.auth.admin.listUsers();
      console.log('Service role access:', serviceTest.data ? 'SUCCESS' : 'FAILED');
      
      if (serviceTest.data) {
        console.log('Current users count:', serviceTest.data.users.length);
      }
    } else {
      console.log('Service role key not available');
    }

    console.log('\n5. Project health check...');
    
    // Check project health
    const healthCheck = await fetch(`${supabaseUrl}/rest/v1/`, {
      headers: {
        'apikey': supabaseAnonKey
      }
    });
    
    console.log('Project health status:', healthCheck.status);
    if (healthCheck.status === 200) {
      console.log('SUCCESS: Project is healthy');
    } else {
      console.log('WARNING: Project may have issues');
    }

    console.log('\n=== DIAGNOSTIC SUMMARY ===');
    
    if (minimalSignup.status === 500) {
      console.log('PRIMARY ISSUE: Supabase internal 500 error');
      console.log('NEXT STEPS:');
      console.log('1. Check Supabase Dashboard > Settings > General for any warnings');
      console.log('2. Look at Database > Functions for any failing triggers');
      console.log('3. Try temporarily removing user metadata from signup');
      console.log('4. Contact Supabase support if this persists');
    } else if (minimalSignup.status === 400) {
      console.log('ISSUE: Request format or validation error');
      console.log('Check the error details above');
    } else if (minimalSignup.status === 200) {
      console.log('SUCCESS: Auth API is working');
      console.log('The issue might be in your frontend code');
    }

  } catch (err) {
    console.error('Deep diagnostic failed:', err);
  }
}

deepDiagnostic().then(() => {
  console.log('\n=== Deep Diagnostic Complete ===');
}).catch(console.error);
