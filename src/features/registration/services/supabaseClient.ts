// src/features/registration/services/supabaseClient.ts
// ONLY Supabase client initialization - the only place Supabase is imported

import { createClient } from '@supabase/supabase-js';

// Environment variables with validation
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

// Debug environment variables
console.log('Supabase Client Debug:', {
  supabaseUrl,
  supabaseAnonKey: supabaseAnonKey ? 'SET' : 'NOT_SET',
  supabaseServiceRoleKey: supabaseServiceRoleKey ? 'SET' : 'NOT_SET',
  nodeEnv: process.env.NODE_ENV,
});

// Validate Supabase URL format
const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Initialize Supabase client (only if properly configured)
export const supabase = supabaseUrl && supabaseAnonKey && isValidUrl(supabaseUrl)
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Helper to check if Supabase is available
export const isSupabaseAvailable = (): boolean => supabase !== null;

// Helper to get authenticated Supabase client (for server-side)
export const getSupabaseAdmin = () => {
  if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error('Supabase admin credentials not configured');
  }

  if (!isValidUrl(supabaseUrl)) {
    throw new Error('Invalid Supabase URL: Must be a valid HTTP or HTTPS URL');
  }

  return createClient(
    supabaseUrl,
    supabaseServiceRoleKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  );
};
