// src/app/api/users/[id]/profile/route.ts
// API route for user profile management

import { NextRequest } from 'next/server';
import {
  createAuthErrorResponse,
  createSuccessResponse,
  requireProfileAccess,
} from '@/lib/auth/auth';
import { getSupabaseAdmin } from '@/lib/server/supabaseAdmin';
import { RegistrationValidation } from '@/lib/validation/registrationValidation';
import { UniversalUser } from '@/types/user';

function readAdditionalData(value: unknown): Record<string, unknown> {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }

  if (typeof value === 'string') {
    try {
      const parsed: unknown = JSON.parse(value);
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
        return parsed as Record<string, unknown>;
      }
    } catch {
      return {};
    }
  }

  return {};
}

// API routes will work on Vercel serverless functions
/**
 * GET /api/users/[id]/profile
 * Get user profile by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
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
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: targetUserId } = await params;

    // Authenticate and authorize the request
    const authResult = await requireProfileAccess(request, targetUserId);

    if (authResult.error) {
      return authResult.error;
    }

    const body = await request.json();

    // Email is the login identity in Supabase Auth, so this route does not change it
    const { name, phone, address, postal_code, city, province, additional_data } = body;

    if (name && (typeof name !== 'string' || name.trim().length < 2)) {
      return createAuthErrorResponse('Name must be at least 2 characters long', 400);
    }

    // Same rules as the register forms. Empty values are allowed: both fields are optional here.
    if (phone) {
      const phoneError =
        typeof phone === 'string'
          ? RegistrationValidation.validatePhone(phone)
          : 'Please enter a valid phone number';
      if (phoneError) {
      return createAuthErrorResponse(phoneError, 400);
      }
    }

    if (postal_code) {
      const postalError =
        typeof postal_code === 'string'
          ? RegistrationValidation.validatePostalCode(postal_code)
          : 'Please enter a valid postal code';
      if (postalError) {
      return createAuthErrorResponse(postalError, 400);
      }
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
      phone: phone !== undefined ? phone : existingUser.phone,
      address: address !== undefined ? address : existingUser.address,
      ...(postal_code !== undefined
          ? ({ postal_code } as Partial<UniversalUser>)
          : {}),
      updatedAt: new Date().toISOString(),
    };

    // Update the Supabase database
    try {

      // Use admin client to bypass RLS policies
      const supabaseAdmin = getSupabaseAdmin();

      // Update user profile in Supabase using admin client
      const { data: existingProfile } = await supabaseAdmin
        .from('users')
        .select('additional_data')
        .eq('id', targetUserId)
        .maybeSingle();

      const mergedAdditionalData = {
        ...readAdditionalData(existingProfile?.additional_data),
        ...readAdditionalData(additional_data),
      };

      delete mergedAdditionalData.phone;
      delete mergedAdditionalData.address;
      delete mergedAdditionalData.city;
      delete mergedAdditionalData.province;
      delete mergedAdditionalData.postalCode;

      const { data, error } = await supabaseAdmin
        .from('users')
        .update({
          name: updatedUser.name,
          phone: typeof phone === 'string' ? phone : updatedUser.phone,
          address: updatedUser.address,
          city: typeof city === 'string' ? city : undefined,
          province: typeof province === 'string' ? province : undefined,
          postal_code: (updatedUser as { postal_code?: string}).postal_code,
          additional_data: mergedAdditionalData,
          updated_at: new Date().toISOString(),
        })
        .eq('id', targetUserId)
        .select()
        .single();

      if (error) {
        console.error('Supabase update error:', error.code, error.message);
        return createAuthErrorResponse('Profile update failed', 500);
      }

      if (!data) {
        return createAuthErrorResponse('Profile update failed: No data returned', 500);
      }

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
        phone: data.phone,
        ...(data.city ? ({ city: data.city } as Partial<UniversalUser>) : {}),
        ...(data.province ? ({ province: data.province } as Partial<UniversalUser>) : {}),
        ...(data.additional_data ? ({ additional_data: data.additional_data } as Partial<UniversalUser>) : {}),
        address: data.address,
        ...(data.postal_code
          ?({ postal_code: data.postal_code } as Partial<UniversalUser>)
          : {}),
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
