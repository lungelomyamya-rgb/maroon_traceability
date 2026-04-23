// src/app/api/users/[id]/profile/route.ts
// API route for user profile management

import { NextRequest, NextResponse } from 'next/server';
import { UniversalUser } from '@/types/user';
import { 
  getCurrentUserFromRequest, 
  canAccessProfile, 
  createAuthErrorResponse, 
  createSuccessResponse,
  requireProfileAccess 
} from '@/lib/auth';

// API routes will work on Vercel serverless functions
/**
 * GET /api/users/[id]/profile
 * Get user profile by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: targetUserId } = await params;

    // Authenticate and authorize the request
    const authResult = await requireProfileAccess(request, targetUserId);
    
    if (authResult.error) {
      return authResult.error;
    }

    // Get user from authenticated user (from Supabase)
    const user = authResult.user;
    
    if (!user) {
      return createAuthErrorResponse('User not found', 404);
    }

    return createSuccessResponse(user, 'Profile retrieved successfully');
  } catch (error) {
    console.error('Profile GET error:', error);
    return createAuthErrorResponse('Internal server error', 500);
  }
}

/**
 * PATCH /api/users/[id]/profile
 * Update user profile
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: targetUserId } = await params;

    // Authenticate and authorize the request
    const authResult = await requireProfileAccess(request, targetUserId);
    
    if (authResult.error) {
      return authResult.error;
    }

    const body = await request.json();

    // Validate input data
    const { name, email, phone, address, postal_code } = body;
    
    if (name && (typeof name !== 'string' || name.trim().length < 2)) {
      return createAuthErrorResponse('Name must be at least 2 characters long', 400);
    }

    if (email && (typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))) {
      return createAuthErrorResponse('Please enter a valid email address', 400);
    }

    if (phone && (typeof phone !== 'string' || !/^[+]?[\d\s\-()]+$/.test(phone))) {
      return createAuthErrorResponse('Please enter a valid phone number', 400);
    }

    if (postal_code && (typeof postal_code !== 'string' || !/^[a-zA-Z0-9\s-]{3,10}$/.test(postal_code))) {
      return createAuthErrorResponse('Please enter a valid postal code', 400);
    }

    // Get existing user from authenticated user (from Supabase)
    const existingUser = authResult.user;
    
    if (!existingUser) {
      return createAuthErrorResponse('User not found', 404);
    }

    // Update user data
    const updatedUser: Partial<UniversalUser> = {
      ...existingUser,
      name: name?.trim() || existingUser.name,
      email: email?.trim() || existingUser.email,
      phone: phone !== undefined ? phone : existingUser.phone,
      address: address !== undefined ? address : existingUser.address,
      ...(postal_code !== undefined && { postal_code } as any),
      updatedAt: new Date().toISOString(),
    };

    // Update the Supabase database
    try {
      const { getSupabaseAdmin } = await import('@/features/registration/services/supabaseClient');
      
      console.log('Using admin client for profile update');
      
      // Use admin client to bypass RLS policies
      const supabaseAdmin = getSupabaseAdmin();
      
      console.log('Updating user profile in database:', {
        targetUserId,
        updateData: {
          name: updatedUser.name,
          email: updatedUser.email,
          phone: updatedUser.phone,
          address: updatedUser.address,
          postal_code: (updatedUser as any).postal_code,
        }
      });

      // Update user profile in Supabase using admin client
      const { data, error } = await supabaseAdmin
        .from('users')
        .update({
          name: updatedUser.name,
          email: updatedUser.email,
          address: updatedUser.address,
          postal_code: (updatedUser as any).postal_code,
          updated_at: new Date().toISOString(),
        })
        .eq('id', targetUserId)
        .select()
        .single();

      if (error) {
        console.error('Supabase update error:', error);
        console.error('Error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        return createAuthErrorResponse(`Database update failed: ${error.message}`, 500);
      }

      if (!data) {
        return createAuthErrorResponse('Profile update failed: No data returned', 500);
      }

      console.log('Profile successfully updated in Supabase for user:', targetUserId);
      
      // Convert Supabase result back to UniversalUser format
      const resultUser: UniversalUser = {
        id: data.id,
        email: data.email,
        name: data.name,
        role: data.role,
        isActive: data.is_active,
        emailVerified: data.email_verified,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        phone: undefined, // Phone not stored in database
        address: data.address,
        ...(data.postal_code && { postal_code: data.postal_code } as any),
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

      return createSuccessResponse(resultUser, 'Profile updated successfully');
    } catch (dbError) {
      console.error('Database connection error:', dbError);
      return createAuthErrorResponse('Database connection failed', 500);
    }
  } catch (error) {
    console.error('Profile PATCH error:', error);
    return createAuthErrorResponse('Internal server error', 500);
  }
}

/**
 * PUT /api/users/[id]/profile
 * Replace entire user profile
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: targetUserId } = await params;

    // Authenticate and authorize the request
    const authResult = await requireProfileAccess(request, targetUserId);
    
    if (authResult.error) {
      return authResult.error;
    }

    const body = await request.json();

    // Validate that required fields are present
    if (!body.name || typeof body.name !== 'string') {
      return createAuthErrorResponse('Name is required', 400);
    }

    if (!body.email || typeof body.email !== 'string') {
      return createAuthErrorResponse('Email is required', 400);
    }

    // Validate email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
      return createAuthErrorResponse('Please enter a valid email address', 400);
    }

    // Update user data
    const updatedUser: Partial<UniversalUser> = {
      ...body,
      id: targetUserId,
      updatedAt: new Date().toISOString(),
    };

    // Update the Supabase database
    try {
      const { getSupabaseAdmin } = await import('@/features/registration/services/supabaseClient');
      
      // Use admin client to bypass RLS policies
      const supabaseAdmin = getSupabaseAdmin();

      // Update user profile in Supabase using admin client
      const { data, error } = await supabaseAdmin
        .from('users')
        .update({
          name: body.name,
          email: body.email,
          address: body.address,
          postal_code: body.postal_code,
          updated_at: new Date().toISOString(),
        })
        .eq('id', targetUserId)
        .select()
        .single();

      if (error) {
        console.error('Supabase update error:', error);
        console.error('Error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        return createAuthErrorResponse(`Database update failed: ${error.message}`, 500);
      }

      if (!data) {
        return createAuthErrorResponse('Profile update failed: No data returned', 500);
      }

      console.log('Profile successfully replaced in Supabase for user:', targetUserId);
      
      // Convert Supabase result back to UniversalUser format
      const resultUser: UniversalUser = {
        id: data.id,
        email: data.email,
        name: data.name,
        role: data.role,
        isActive: data.is_active,
        emailVerified: data.email_verified,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        phone: undefined, // Phone not stored in database
        address: data.address,
        ...(data.postal_code && { postal_code: data.postal_code } as any),
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

      return createSuccessResponse(resultUser, 'Profile replaced successfully');
    } catch (dbError) {
      console.error('Database connection error:', dbError);
      return createAuthErrorResponse('Database connection failed', 500);
    }
  } catch (error) {
    console.error('Profile PUT error:', error);
    return createAuthErrorResponse('Internal server error', 500);
  }
}
