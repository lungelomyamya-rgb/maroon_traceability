/**
 * Server-side Supabase registration (service role).
 * Avoids browser CORS / client auth issues on production deployments.
 */

import type { AuthUser, RegistrationData } from '@/core/types/adapter';
import { getSupabaseAdmin } from '@/features/registration/services/supabaseClient';
import { isSelfServiceRole } from '@/lib/auth/selfServiceRoles';

function validateRegistrationData(userData: RegistrationData): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!userData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email)) {
    errors.push('Valid email is required');
  }
  if (!userData.password || userData.password.length < 8) {
    errors.push('Password must be at least 8 characters');
  }
  if (!userData.name || userData.name.length < 2) {
    errors.push('Name is required');
  }
  if (!userData.role || !isSelfServiceRole(userData.role)) {
    errors.push('Role must be farmer, inspector, logistics, packaging, retailer, or public');
  }

  return { valid: errors.length === 0, errors };
}

export async function registerUserWithSupabase(
  userData: RegistrationData,
): Promise<{ success: true; data: AuthUser } | { success: false; error: string; status?: number }> {
  const validation = validateRegistrationData(userData);
  if (!validation.valid) {
    return { success: false, error: validation.errors.join(', '), status: 400 };
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!supabaseUrl || !serviceKey) {
    return {
      success: false,
      error: 'Server registration is not configured (missing Supabase URL or service role key).',
      status: 503,
    };
  }

  const { email, password, name, role, additionalData } = userData;
  let admin;

  try {
    admin = getSupabaseAdmin();
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Supabase admin client unavailable',
      status: 503,
    };
  }

  const { role: ignoredAdditionalRole, ...safeAdditionalData } = additionalData ?? {};
  void ignoredAdditionalRole;

  const { data: authData, error: authError } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      name,
      role,
      ...safeAdditionalData,
    },
  });

  if (authError) {
    const message = authError.message.includes('already registered')
      ? 'Email is already registered'
      : authError.message;
    return { success: false, error: message, status: 400 };
  }

  if (!authData.user) {
    return { success: false, error: 'Registration failed: no user returned from Supabase', status: 500 };
  }

  const extractedFields = additionalData
    ? {
        phone: additionalData.phone,
        address: additionalData.address,
        city: additionalData.city,
        province: additionalData.province,
        postal_code: additionalData.postalCode,
      }
    : {};

  const userProfile = {
    id: authData.user.id,
    email: authData.user.email ?? email,
    name,
    role,
    is_active: true,
    email_verified: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    last_login_at: new Date().toISOString(),
    phone: extractedFields.phone ?? null,
    address: extractedFields.address ?? null,
    city: extractedFields.city ?? null,
    province: extractedFields.province ?? null,
    postal_code: extractedFields.postal_code ?? null,
    additional_data: additionalData
      ? {
          ...additionalData,
          phone: undefined,
          address: undefined,
          city: undefined,
          province: undefined,
          postalCode: undefined,
        }
      : {},
  };

  const { data: profileRow, error: profileError } = await admin
    .from('users')
    .insert(userProfile)
    .select()
    .single();

  if (profileError || !profileRow) {
    await admin.auth.admin.deleteUser(authData.user.id);
    return {
      success: false,
      error: profileError?.message ?? 'Failed to create user profile',
      status: 500,
    };
  }

  const authUser: AuthUser = {
    id: profileRow.id,
    email: profileRow.email,
    name: profileRow.name,
    role: profileRow.role,
    isActive: profileRow.is_active,
    createdAt: profileRow.created_at,
    updatedAt: profileRow.updated_at,
    emailVerified: profileRow.email_verified,
    lastLoginAt: profileRow.last_login_at,
  };

  return { success: true, data: authUser };
}
