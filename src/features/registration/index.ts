// src/features/registration/index.ts
// Registration feature barrel export

/**
 * @fileoverview Registration Feature - User registration and onboarding
 * @version 1.0.0
 * @author Maroon Traceability Team
 * @description 
 * Registration system with Supabase integration and user management.
 * Currently includes Supabase client services with plans for future component expansion.
 * 
 * @example
 * ```typescript
 * import { registrationAPI } from '@/features/registration';
 * 
 * // Use Supabase services
 * const { supabase, isSupabaseAvailable } = registrationAPI;
 * 
 * // Check Supabase availability
 * if (isSupabaseAvailable()) {
 *   // Use Supabase functionality
 * }
 * ```
 */

// ============================================================================
// SERVICES EXPORTS
// ============================================================================

/**
 * Supabase client services for registration and authentication
 * @namespace SupabaseServices
 * @example
 * ```typescript
 * import { supabase, isSupabaseAvailable } from '@/features/registration';
 * 
 * // Check if Supabase is available
 * if (isSupabaseAvailable()) {
 *   const { data, error } = await supabase
 *     .from('users')
 *     .select('*');
 * }
 * ```
 */
export { supabase, isSupabaseAvailable, getSupabaseAdmin } from './services/supabaseClient';

// ============================================================================
// IMPORTS FOR API OBJECT
// ============================================================================

import { supabase, isSupabaseAvailable, getSupabaseAdmin } from './services/supabaseClient';

// ============================================================================
// PUBLIC API
// ============================================================================

/**
 * Registration Feature Public API
 * Provides clean, type-safe access to registration functionality
 * 
 * @namespace RegistrationAPI
 * @example
 * ```typescript
 * import { registrationAPI } from '@/features/registration';
 * 
 * // Use Supabase services
 * const { supabase, isSupabaseAvailable } = registrationAPI;
 * 
 * // Check Supabase availability
 * if (isSupabaseAvailable()) {
 *   // Use Supabase functionality
 * }
 * ```
 */
export const registrationAPI = {
  // Supabase Services
  supabase,
  isSupabaseAvailable,
  getSupabaseAdmin,
} as const;

// ============================================================================
// FEATURE METADATA
// ============================================================================

/**
 * Registration feature metadata
 * @readonly
 * @enum {string}
 */
export const REGISTRATION_FEATURE = {
  /** Feature version */
  VERSION: '1.0.0',
  /** Feature name */
  NAME: 'Registration',
  /** Feature description */
  DESCRIPTION: 'Registration system with Supabase integration and user management',
  /** Feature dependencies */
  DEPENDENCIES: ['react', 'next', 'typescript', 'supabase'],
  /** Feature tags */
  TAGS: ['registration', 'onboarding', 'user-management', 'supabase'],
} as const;

// ============================================================================
// RE-EXPORTS FOR CONVENIENCE
// ============================================================================

/**
 * Default export - Supabase client
 * @default
 * @example
 * ```typescript
 * import supabase from '@/features/registration';
 * 
 * // Use Supabase directly
 * const { data, error } = await supabase
 *   .from('users')
 *   .select('*');
 * ```
 */
export { supabase as default } from './services/supabaseClient';
