#!/usr/bin/env node

// Supabase Diagnostic Script
// Run with: npm run diagnose:supabase

import { supabase } from '../../src/features/registration/services/supabaseClient';

// Helper function
const isSupabaseAvailable = (): boolean => supabase !== null;

async function diagnoseSupabase() {
  console.log('=== Supabase Diagnostic Tool ===\n');

  // 1. Check basic connectivity
  console.log('1. Checking Supabase availability...');
  console.log('Supabase available:', isSupabaseAvailable());
  console.log('Supabase client exists:', !!supabase);

  if (!supabase) {
    console.error('ERROR: Supabase client not initialized');
    console.log('Check your environment variables:');
    console.log('- NEXT_PUBLIC_SUPABASE_URL');
    console.log('- NEXT_PUBLIC_SUPABASE_ANON_KEY');
    return;
  }

  // 2. Test database connection
  console.log('\n2. Testing database connection...');
  try {
    const { data, error } = await supabase
      .from('_test_connection')
      .select('id')
      .limit(1);

    if (error) {
      console.error('Database connection error:', error);
    } else {
      console.log('Database connection: SUCCESS');
      console.log('Test data:', data);
    }
  } catch (err) {
    console.error('Database connection exception:', err);
  }

  // 3. Test users table access
  console.log('\n3. Testing users table access...');
  try {
    const { data, error } = await supabase
      .from('users')
      .select('id')
      .limit(1);

    if (error) {
      console.error('Users table access error:', error);
      console.log('This might be due to RLS policies - expected if table is empty');
    } else {
      console.log('Users table access: SUCCESS');
      console.log('Sample data:', data);
    }
  } catch (err) {
    console.error('Users table access exception:', err);
  }

  // 4. Test email availability function
  console.log('\n4. Testing email availability function...');
  try {
    const { data, error } = await supabase
      .from('users')
      .select('id')
      .eq('email', 'test-diagnostic@example.com')
      .limit(1);

    if (error) {
      console.error('Email availability check error:', error);
    } else {
      const isAvailable = !data || data.length === 0;
      console.log('Email availability check: SUCCESS');
      console.log('test-diagnostic@example.com available:', isAvailable);
    }
  } catch (err) {
    console.error('Email availability check exception:', err);
  }

  // 5. Test auth service (read-only)
  console.log('\n5. Testing Supabase Auth service...');
  try {
    // Test getting current user (should be null for unauthenticated)
    const { data, error } = await supabase.auth.getUser();

    if (error) {
      console.error('Auth service error:', error);
    } else {
      console.log('Auth service: SUCCESS');
      console.log('Current user:', data.user || 'None (expected)');
    }
  } catch (err) {
    console.error('Auth service exception:', err);
  }

  // 6. Check environment variables
  console.log('\n6. Environment variables check...');
  const envVars = {
    'NEXT_PUBLIC_SUPABASE_URL': process.env.NEXT_PUBLIC_SUPABASE_URL,
    'NEXT_PUBLIC_SUPABASE_ANON_KEY': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'SET' : 'NOT_SET',
    'SUPABASE_SERVICE_ROLE_KEY': process.env.SUPABASE_SERVICE_ROLE_KEY ? 'SET' : 'NOT_SET',
    'NODE_ENV': process.env.NODE_ENV,
  };

  console.log('Environment variables:', envVars);

  // 7. Recommendations
  console.log('\n7. Recommendations...');

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.log('ERROR: Missing required environment variables');
    console.log('Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY');
  }

  if (process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('your-supabase-url')) {
    console.log('ERROR: Using placeholder values in environment variables');
    console.log('Please replace with actual Supabase project values');
  }

  console.log('\nIf registration still fails with 500 errors:');
  console.log('1. Check Supabase project settings > Authentication > Email templates');
  console.log('2. Ensure email confirmation is enabled or disabled as needed');
  console.log('3. Verify Site URL and redirect URLs in Supabase settings');
  console.log('4. Check if your Supabase project is active and not suspended');
  console.log('5. Try creating a user manually in Supabase dashboard to test auth');

  console.log('\n=== Diagnostic Complete ===');
}

// Run the diagnostic
diagnoseSupabase().catch(console.error);
