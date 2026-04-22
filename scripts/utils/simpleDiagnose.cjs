#!/usr/bin/env node

// Simple Environment and Configuration Diagnostic
// Run with: node scripts/simpleDiagnose.cjs

// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' });

console.log('=== Simple Supabase Diagnostic ===\n');

// Check environment variables
console.log('1. Environment Variables Check:');
const envVars = {
  'NEXT_PUBLIC_SUPABASE_URL': process.env.NEXT_PUBLIC_SUPABASE_URL,
  'NEXT_PUBLIC_SUPABASE_ANON_KEY': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'SET' : 'NOT_SET',
  'SUPABASE_SERVICE_ROLE_KEY': process.env.SUPABASE_SERVICE_ROLE_KEY ? 'SET' : 'NOT_SET',
  'NODE_ENV': process.env.NODE_ENV,
};

console.log('Environment variables:', envVars);

// Validate environment
console.log('\n2. Environment Validation:');
if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  console.log('ERROR: NEXT_PUBLIC_SUPABASE_URL is not set');
} else if (process.env.NEXT_PUBLIC_SUPABASE_URL.includes('your-supabase-url')) {
  console.log('ERROR: Using placeholder URL - please replace with actual Supabase URL');
} else {
  console.log('SUCCESS: NEXT_PUBLIC_SUPABASE_URL is set');
}

if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  console.log('ERROR: NEXT_PUBLIC_SUPABASE_ANON_KEY is not set');
} else if (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.includes('your-anon-key')) {
  console.log('ERROR: Using placeholder anon key - please replace with actual Supabase anon key');
} else {
  console.log('SUCCESS: NEXT_PUBLIC_SUPABASE_ANON_KEY is set');
}

// Test basic HTTP connectivity
console.log('\n3. Basic Connectivity Test:');
if (process.env.NEXT_PUBLIC_SUPABASE_URL && !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('your-supabase-url')) {
  const https = require('https');
  
  try {
    const url = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL);
    const options = {
      hostname: url.hostname,
      port: url.port || 443,
      path: '/rest/v1/',
      method: 'HEAD',
      timeout: 5000
    };

    const req = https.request(options, (res) => {
      console.log(`HTTP Status: ${res.statusCode}`);
      if (res.statusCode === 200) {
        console.log('SUCCESS: Supabase URL is reachable');
      } else {
        console.log('WARNING: Unexpected HTTP status');
      }
    });

    req.on('error', (err) => {
      console.log('ERROR: Cannot reach Supabase URL:', err.message);
    });

    req.on('timeout', () => {
      console.log('ERROR: Connection timeout');
      req.destroy();
    });

    req.end();
  } catch (err) {
    console.log('ERROR: Invalid URL format:', err.message);
  }
} else {
  console.log('SKIP: Cannot test connectivity - URL not properly configured');
}

// Recommendations
console.log('\n4. Recommendations:');

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  console.log('- Set up environment variables in .env.local file');
  console.log('- Get values from Supabase project settings');
}

if (process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('your-supabase-url')) {
  console.log('- Replace placeholder values with actual Supabase credentials');
}

console.log('- Check Supabase project is active and not suspended');
console.log('- Verify API keys are correct and have proper permissions');
console.log('- Ensure email confirmation settings match your needs');

console.log('\n5. Next Steps:');
console.log('1. Fix any environment variable issues above');
console.log('2. Run: npm run test:simple-registration');
console.log('3. If still failing, check Supabase dashboard for errors');

console.log('\n=== Diagnostic Complete ===');
