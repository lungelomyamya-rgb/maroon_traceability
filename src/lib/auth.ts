// src/lib/auth.ts
// Authentication utilities for API routes

import { NextRequest } from 'next/server';
import { TokenProvider } from '@/features/auth/services/TokenProvider';
import { StorageService } from '@/features/auth/services/StorageService';
import type { UniversalUser } from '@/types/user';

/**
 * Get the current user from the request
 * Extracts and validates JWT token from Authorization header
 */
export async function getCurrentUserFromRequest(request: NextRequest): Promise<UniversalUser | null> {
  try {
    const authHeader = request.headers.get('authorization');
    
    console.log('Auth header:', authHeader ? 'Present' : 'Missing');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('Invalid or missing Bearer token');
      return null;
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    console.log('Token extracted, length:', token.length);
    console.log('Validating token from request header');
    
    // Try to validate with Supabase first
    try {
      const { supabase } = await import('@/features/registration/services/supabaseClient');
      if (supabase) {
        console.log('Attempting Supabase token validation');
        const { data: { user }, error } = await supabase.auth.getUser(token);
        
        if (!error && user) {
          console.log('Supabase token validation successful for user:', user.id);
          
          // Convert Supabase user to UniversalUser format
          const universalUser: UniversalUser = {
            id: user.id,
            email: user.email || '',
            name: user.user_metadata?.name || user.email?.split('@')[0] || 'Unknown',
            role: user.user_metadata?.role || 'public',
            isActive: true,
            emailVerified: user.email_confirmed_at ? true : false,
            createdAt: user.created_at,
            updatedAt: user.updated_at || user.created_at,
            phone: user.phone,
            address: user.user_metadata?.address,
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
          
          console.log('UniversalUser created:', {
            id: universalUser.id,
            email: universalUser.email,
            role: universalUser.role
          });
          
          return universalUser;
        } else {
          console.log('Supabase token validation failed:', error?.message);
          console.log('Supabase error details:', error);
        }
      } else {
        console.log('Supabase client not available');
      }
    } catch (supabaseError) {
      console.log('Supabase validation error:', supabaseError);
      console.log('Falling back to custom token validation');
    }
    
    // Fallback to custom token provider for demo accounts
    const storageService = new StorageService();
    const tokenProvider = new TokenProvider(storageService);
    
    // Get user from token
    const user = await tokenProvider.getCurrentUserFromToken();
    
    return user;
  } catch (error) {
    console.error('Error getting user from request:', error);
    return null;
  }
}

/**
 * Verify that the user can access the requested profile
 * Users can only access their own profile (except admins)
 */
export function canAccessProfile(
  currentUser: UniversalUser | null, 
  targetUserId: string
): boolean {
  if (!currentUser) {
    return false;
  }

  // Admins can access any profile
  if (currentUser.role === 'admin' || currentUser.role === 'government') {
    return true;
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
    { status }
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
  targetUserId: string
): Promise<{
  user: UniversalUser;
  error?: never;
} | {
  user: null;
  error: Response;
}> {
  const authResult = await requireAuth(request);
  
  if (authResult.error) {
    console.log('Auth failed in requireProfileAccess');
    return authResult;
  }

  const { user } = authResult;
  
  console.log('Profile access check:', {
    authenticatedUserId: user.id,
    targetUserId,
    userRole: user.role,
    canAccess: canAccessProfile(user, targetUserId)
  });

  if (!canAccessProfile(user, targetUserId)) {
    return {
      user: null,
      error: createAuthErrorResponse('Access denied: You can only access your own profile', 403),
    };
  }

  return { user };
}
