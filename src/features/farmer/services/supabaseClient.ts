// src/features/farmer/services/supabaseClient.ts
// Supabase client for farmer feature

import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase environment variables are not set');
}

// Create Supabase client
export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * Check if Supabase is available
 */
export function isSupabaseAvailable(): boolean {
  return !!(supabaseUrl && supabaseAnonKey) && supabase !== null;
}

/**
 * Get Supabase client (throws if not available)
 */
export function getSupabaseClient() {
  if (!supabase) {
    throw new Error('Supabase is not available. Check environment variables.');
  }
  return supabase;
}
