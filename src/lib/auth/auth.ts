// src/lib/auth.ts
// Authentication utilities for API routes

import { createClient } from '@supabase/supabase-js';
import { NextRequest } from 'next/server';
import type { UniversalUser } from '@/types/user';

/**
 * Get the current user from the request
 * Extracts and validates JWT token from Authorization header
 */
export async function getCurrentUserFromRequest(request: NextRequest): Promise<UniversalUser | null> {
  try {
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Try to validate with Supabase first
    try {
      const { supabase } = await import('@/features/registration/services/supabaseClient');
      if (supabase) {
        const { data: { user }, error } = await supabase.auth.getUser(token);

        if (!error && user){
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
        const userScopedClient = supabaseUrl && supabaseAnonKey
          ? createClient(supabaseUrl, supabaseAnonKey, {
              global: { headers: { Authorization: `Bearer ${token}`} },
              auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
            })
          : null;

        const { data: profile } = userScopedClient
            ? await userScopedClient
              .from('users')
              .select('role, name, phone, address, city, province, postal_code, additional_data')
              .eq('id', user.id)
              .maybeSingle()
            : { data: null};

          // Convert Supabase user to UniversalUser format
          const universalUser: UniversalUser = {
            id: user.id,
            email: user.email || '',
            name: profile?.name || user.user_metadata?.name || user.email?.split('@')[0] || 'Unknown',
            role: profile?.role || 'public',
            isActive: true,
            emailVerified: Boolean(user.email_confirmed_at),
            createdAt: user.created_at,
            updatedAt: user.updated_at || user.created_at,
            phone: profile?.phone ?? user.phone,
            address: profile?.address ?? user.user_metadata?.address,
            ...(profile?.city ? ({city: profile.city } as Partial<UniversalUser>) : {}),
            ...(profile?.province ? ({ province: profile.province } as Partial<UniversalUser>) : {}),
            ...(profile?.postal_code ? ({ postal_code: profile.postal_code } as Partial<UniversalUser>) : {}),
            ...(profile?.additional_data ? ({ additional_data: profile.additional_data } as Partial<UniversalUser>) : {}),
            _source: {
              type: 'api',
              timestamp: new Date().toISOString(),
            },
            _validation: {
              isValid: true,
              validatedAt: new Date().toISOString(),
            },
            _normalized: true,
          };

          return universalUser;
        } else {
          console.warn('Supabase token validation failed:', error?.message);
        }
      } else {
        console.log('Supabase client not available');
      }
    } catch (supabaseError) {
      console.log('Supabase validation error:', supabaseError);
    }

    // Only Supabase-verified tokens are accepted
    return null;
  } catch (error) {
    console.error('Error getting user from request:', error);
    return null;
  }
}

/**
 * Verify that the user can access the requested profile
 * Users can only access their own profile
 */
export function canAccessProfile(
  currentUser: UniversalUser | null,
  targetUserId: string,
): boolean {
  if (!currentUser) {
    return false;
  }

  // Users can only access their own profile
  return currentUser.id === targetUserId;
}

/**
 * Create a standardized error response
 */
export function createAuthErrorResponse(message: string, status: number = 401) {
  return Response.json(
    {
      error: message,
      code: 'AUTH_ERROR',
      timestamp: new Date().toISOString(),
    },
    { status },
  );
}

/**
 * Create a standardized success response
 */
export function createSuccessResponse<T>(data: T, message?: string) {
  return Response.json({
    success: true,
    data,
    message,
    timestamp: new Date().toISOString(),
  });
}

/**
 * Middleware to check authentication
 */
export async function requireAuth(request: NextRequest): Promise<{
  user: UniversalUser;
  error?: never;
} | {
  user: null;
  error: Response;
}> {
  const user = await getCurrentUserFromRequest(request);

  if (!user) {
    return {
      user: null,
      error: createAuthErrorResponse('Authentication required', 401),
    };
  }

  return { user };
}

/**
 * Middleware to check profile access authorization
 */
export async function requireProfileAccess(
  request: NextRequest,
  targetUserId: string,
): Promise<{
  user: UniversalUser;
  error?: never;
} | {
  user: null;
  error: Response;
}> {
  const authResult = await requireAuth(request);

  if (authResult.error) {
    return authResult;
  }

  const { user } = authResult;

  if (!canAccessProfile(user, targetUserId)) {
    return {
      user: null,
      error: createAuthErrorResponse('Access denied: You can only access your own profile', 403),
    };
  }

  return { user };
}
