// src/features/auth/adapters/RealAuthAdapter.ts
// Real Supabase authentication adapter - FIXED VERSION

import { toUniversalUser } from '@/types/types';
import type {
  AuthAdapter,
  AdapterConfig,
  AdapterResult,
  AuthUser,
  UniversalUser,
  RegistrationData,
} from '../../../core/types/adapter';
import type { User } from '@/types/types';
import { supabase, isSupabaseAvailable } from '../../registration/services/supabaseClient';

/**
 * Handle Postgrest errors, especially PGRST116 (no rows found)
 */
function handlePostgrestError(error: any): string | null {
  if (!error) return null;
  
  // Handle PGRST116 - No rows found
  if (error.code === 'PGRST116') {
    return null; // No error, just no data found
  }
  
  // Handle other Postgrest errors
  if (error.code && error.code.startsWith('PGRST')) {
    return `Database error: ${error.message || 'Unknown database error'}`;
  }
  
  // Handle other errors
  return error.message || 'Unknown error';
}

/**
 * Real Supabase authentication adapter
 * Real implementation using Supabase for authentication
 */
export class RealAuthAdapter implements AuthAdapter {
  readonly id = 'real-auth';
  readonly type = 'real' as const;
  readonly isAvailable: boolean;

  constructor(private config?: AdapterConfig) {
    this.isAvailable = isSupabaseAvailable();
  }

  /**
   * Initialize the adapter
   */
  async initialize(): Promise<void> {
    if (!this.isAvailable) {
      throw new Error('Supabase is not available. Check environment configuration.');
    }

    console.log('RealAuthAdapter initialized');
  }

  /**
   * Cleanup adapter resources
   */
  async cleanup(): Promise<void> {
    console.log('RealAuthAdapter cleaned up');
  }

  /**
   * Authenticate user with email and password
   * FIXED: Now returns UniversalUser for type consistency
   */
  async login(email: string, password: string): Promise<AdapterResult<UniversalUser>> {
    try {
      if (!this.isAvailable) {
        throw new Error('Supabase is not available');
      }

      if (!supabase) {
        throw new Error('Supabase client is not available');
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return {
          success: false,
          error: `Login failed: ${error.message}`,
        };
      }

      if (!data.user || !data.session) {
        return {
          success: false,
          error: 'Login failed: Invalid response from Supabase',
        };
      }

      // Get user profile from database - use maybeSingle() to handle missing profiles
      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', data.user.id)
        .maybeSingle();

      if (profileError) {
        const errorMessage = handlePostgrestError(profileError);
        if (errorMessage) {
          console.warn('Failed to fetch user profile:', errorMessage);
        } else {
          console.log('No existing user profile found during login (PGRST116 handled gracefully)');
        }
      }

      // If no profile exists, create one from auth user metadata
      let userProfile = profile;
      if (!profile && data.user) {
        console.log('No user profile found during login, creating from auth metadata');
        userProfile = {
          id: data.user.id,
          email: data.user.email || '',
          name: data.user.user_metadata?.name || data.user.email?.split('@')[0] || 'User',
          role: data.user.user_metadata?.role || 'public',
          isActive: true,
          createdAt: data.user.created_at,
          updatedAt: data.user.updated_at,
          lastLoginAt: new Date().toISOString(),
          emailVerified: data.user.email_confirmed_at ? true : false,
        };

        // Try to create the missing profile
        try {
          const { data: newProfile, error: insertError } = await supabase
            .from('users')
            .insert({
              id: userProfile.id,
              email: userProfile.email,
              name: userProfile.name,
              role: userProfile.role,
              // Mandatory fields
              phone: userProfile.phone || '',
              address: userProfile.address || '',
              city: userProfile.city || '',
              province: userProfile.province || '',
              postal_code: userProfile.postal_code || '',
              is_active: userProfile.isActive,
              email_verified: userProfile.emailVerified,
              created_at: userProfile.createdAt,
              updated_at: userProfile.updatedAt,
              last_login_at: userProfile.lastLoginAt,
            })
            .select()
            .single();

          if (insertError) {
            console.warn('Failed to create missing user profile during login:', insertError);
          } else {
            console.log('Successfully created missing user profile during login');
            userProfile = newProfile;
          }
        } catch (error) {
          console.warn('Exception creating missing user profile during login:', error);
        }
      }

      // Create User from Supabase data
      const authUser: User = {
        id: data.user.id,
        email: data.user.email || '',
        name: userProfile?.name || data.user.user_metadata?.name || data.user.email?.split('@')[0] || 'User',
        role: userProfile?.role || data.user.user_metadata?.role || 'public',
        // Map database fields to Address object
        address: userProfile?.address ? {
          street: userProfile.address || '',
          city: userProfile.city || '',
          state: userProfile.province || '',
          postalCode: userProfile.postal_code || '',
          formatted: `${userProfile.address || ''}, ${userProfile.city || ''}, ${userProfile.province || ''} ${userProfile.postal_code || ''}`
        } : undefined,
        // Use database phone field directly
        phone: userProfile?.phone || '',
        isActive: userProfile?.isActive ?? true,
        createdAt: userProfile?.createdAt || data.user.created_at,
        updatedAt: userProfile?.updatedAt || data.user.updated_at,
        lastLoginAt: new Date().toISOString(),
        emailVerified: data.user.email_confirmed_at ? true : false,
        // Add metadata for profile screen compatibility with all database fields
        metadata: {
          // Direct database fields
          phone: userProfile?.phone || '',
          address: userProfile?.address || '',
          city: userProfile?.city || '',
          province: userProfile?.province || '',
          postalCode: userProfile?.postal_code || '',
          // Additional fields from database additional_data
          ...(userProfile as any)?.additional_data || {},
        },
      };

      // Normalize to UniversalUser with tracking
      const startTime = Date.now();
      const universalUser = toUniversalUser(authUser, 'api', {
        adapterId: this.id,
        version: '1.0.0',
        latency: Date.now() - startTime,
        retryCount: 0,
      });

      if (!universalUser) {
        return {
          success: false,
          error: 'Failed to normalize user data',
        };
      }

      // Verify user validation
      if (!universalUser._validation.isValid) {
        console.warn('Real user validation warnings:', universalUser._validation.warnings);

        // In production, you might want to reject users with validation issues
        if (process.env.NODE_ENV === 'production' && universalUser._validation.invalidFields) {
          return {
            success: false,
            error: `User validation failed: ${universalUser._validation.invalidFields.join(', ')}`,
          };
        }
      }

      return {
        success: true,
        data: universalUser,
        metadata: {
          loginTime: authUser.lastLoginAt,
          sessionExpiresAt: data.session.expires_at,
          isRealUser: true,
          source: 'api',
          validationWarnings: universalUser._validation.warnings,
        },
      };

    } catch (error) {
      return {
        success: false,
        error: `Login error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  }

  /**
   * Register new user
   * FIXED: Now returns UniversalUser for type consistency
   */
  async register(userData: RegistrationData): Promise<AdapterResult<UniversalUser>> {
    try {
      if (!this.isAvailable) {
        throw new Error('Supabase is not available');
      }

      if (!supabase) {
        throw new Error('Supabase client is not available');
      }

      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            name: userData.name,
            role: userData.role,
            ...userData.additionalData,
          },
        },
      });

      if (error) {
        return {
          success: false,
          error: `Registration failed: ${error.message}`,
        };
      }

      if (!data.user || !data.session) {
        return {
          success: false,
          error: 'Registration failed: Invalid response from Supabase',
        };
      }

      // Create user profile in database
      const userProfile = {
        id: data.user.id,
        email: data.user.email || '',
        name: userData.name,
        role: userData.role,
        isActive: true, // Active immediately - no email verification required
        createdAt: data.user.created_at,
        updatedAt: data.user.updated_at,
        lastLoginAt: new Date().toISOString(), // Set initial login time
        emailVerified: true, // Mark as verified - skipping email verification
      };

      const { data: profile, error: profileError } = await supabase
        .from('users')
        .insert(userProfile)
        .select()
        .single();

      if (profileError) {
        // Try to rollback auth user
        if (supabase && data.user?.id) {
          await supabase.auth.admin.deleteUser(data.user.id);
        }

        return {
          success: false,
          error: `Failed to create user profile: ${profileError.message}`,
        };
      }

      const authUser: User = {
        id: profile.id,
        email: profile.email,
        name: profile.name,
        role: profile.role,
        // Map database fields to Address object
        address: profile.address ? {
          street: profile.address || '',
          city: profile.city || '',
          state: profile.province || '',
          postalCode: profile.postal_code || '',
          formatted: `${profile.address || ''}, ${profile.city || ''}, ${profile.province || ''} ${profile.postal_code || ''}`
        } : undefined,
        // Use database phone field directly
        phone: profile.phone || '',
        isActive: profile.isActive,
        createdAt: profile.createdAt,
        updatedAt: profile.updatedAt,
        lastLoginAt: profile.lastLoginAt,
        emailVerified: profile.emailVerified,
        // Add metadata for profile screen compatibility with all database fields
        metadata: {
          // Direct database fields
          phone: profile.phone || '',
          address: profile.address || '',
          city: profile.city || '',
          province: profile.province || '',
          postalCode: profile.postal_code || '',
          // Additional fields from database additional_data
          ...(profile as any)?.additional_data || {},
        },
      };

      // Normalize to UniversalUser with tracking
      const startTime = Date.now();
      const universalUser = toUniversalUser(authUser, 'api', {
        adapterId: this.id,
        version: '1.0.0',
        latency: Date.now() - startTime,
        retryCount: 0,
      });

      if (!universalUser) {
        return {
          success: false,
          error: 'Failed to normalize user data',
        };
      }

      // Verify user validation
      if (!universalUser._validation.isValid) {
        console.warn('Real user validation warnings:', universalUser._validation.warnings);

        // For registration, be more strict about validation
        if (universalUser._validation.invalidFields) {
          return {
            success: false,
            error: `User registration validation failed: ${universalUser._validation.invalidFields.join(', ')}`,
          };
        }
      }

      return {
        success: true,
        data: universalUser,
        metadata: {
          registrationTime: authUser.createdAt,
          requiresEmailVerification: false, // No email verification required
          userId: authUser.id,
          source: 'api',
          validationWarnings: universalUser._validation.warnings,
        },
      };

    } catch (error) {
      return {
        success: false,
        error: `Registration error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  }

  /**
   * Logout current user
   */
  async logout(): Promise<AdapterResult<void>> {
    try {
      if (!this.isAvailable) {
        throw new Error('Supabase is not available');
      }

      if (!supabase) {
        throw new Error('Supabase client is not available');
      }

      const { error } = await supabase.auth.signOut();

      if (error) {
        return {
          success: false,
          error: `Logout failed: ${error.message}`,
        };
      }

      return {
        success: true,
        data: undefined,
        metadata: {
          logoutTime: new Date().toISOString(),
        },
      };

    } catch (error) {
      return {
        success: false,
        error: `Logout error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  }

  /**
   * Get current authenticated user
   * FIXED: Now returns UniversalUser for type consistency
   */
  async getCurrentUser(): Promise<AdapterResult<UniversalUser | null>> {
    try {
      if (!this.isAvailable) {
        throw new Error('Supabase is not available');
      }

      if (!supabase) {
        throw new Error('Supabase client is not available');
      }

      const { data: { session }, error } = await supabase.auth.getSession();

      if (error) {
        return {
          success: false,
          error: `Get current user error: ${error.message}`,
        };
      }

      if (!session?.user) {
        return {
          success: true,
          data: null,
        };
      }

      // Get user profile from database - use maybeSingle() to handle missing profiles
      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', session.user.id)
        .maybeSingle();

      if (profileError) {
        const errorMessage = handlePostgrestError(profileError);
        if (errorMessage) {
          console.warn('Failed to fetch user profile:', errorMessage);
        } else {
          console.log('No existing user profile found (PGRST116 handled gracefully)');
        }
      }

      // If no profile exists, create one from auth user metadata
      let userProfile = profile;
      if (!profile && session.user) {
        console.log('No user profile found, creating from auth metadata');
        userProfile = {
          id: session.user.id,
          email: session.user.email || '',
          name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User',
          role: session.user.user_metadata?.role || 'public',
          // Mandatory fields - will need to be filled in by user during profile completion
          phone: session.user.user_metadata?.phone || '',
          address: session.user.user_metadata?.address || '',
          city: session.user.user_metadata?.city || '',
          province: session.user.user_metadata?.province || '',
          postal_code: session.user.user_metadata?.postal_code || '',
          isActive: true,
          createdAt: session.user.created_at,
          updatedAt: session.user.updated_at,
          lastLoginAt: new Date().toISOString(),
          emailVerified: session.user.email_confirmed_at ? true : false,
        };

        // Try to create the missing profile
        try {
          const { data: newProfile, error: insertError } = await supabase
            .from('users')
            .insert({
              id: userProfile.id,
              email: userProfile.email,
              name: userProfile.name,
              role: userProfile.role,
              // Mandatory fields
              phone: userProfile.phone || '',
              address: userProfile.address || '',
              city: userProfile.city || '',
              province: userProfile.province || '',
              postal_code: userProfile.postal_code || '',
              is_active: userProfile.isActive,
              email_verified: userProfile.emailVerified,
              created_at: userProfile.createdAt,
              updated_at: userProfile.updatedAt,
              last_login_at: userProfile.lastLoginAt,
            })
            .select()
            .single();

          if (insertError) {
            console.warn('Failed to create missing user profile:', insertError);
          } else {
            console.log('Successfully created missing user profile');
            userProfile = newProfile;
          }
        } catch (error) {
          console.warn('Exception creating missing user profile:', error);
        }
      }

      const authUser: User = {
        id: session.user.id,
        email: session.user.email || '',
        name: userProfile?.name || session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User',
        role: userProfile?.role || session.user.user_metadata?.role || 'public',
        // Map database fields to Address object
        address: userProfile?.address ? {
          street: userProfile.address || '',
          city: userProfile.city || '',
          state: userProfile.province || '',
          postalCode: userProfile.postal_code || '',
          formatted: `${userProfile.address || ''}, ${userProfile.city || ''}, ${userProfile.province || ''} ${userProfile.postal_code || ''}`
        } : undefined,
        // Use database phone field directly
        phone: userProfile?.phone || '',
        isActive: userProfile?.isActive ?? true,
        createdAt: userProfile?.createdAt || session.user.created_at,
        updatedAt: userProfile?.updatedAt || session.user.updated_at,
        lastLoginAt: userProfile?.lastLoginAt,
        emailVerified: session.user.email_confirmed_at ? true : false,
        // Add metadata for profile screen compatibility with all database fields
        metadata: {
          // Direct database fields
          phone: userProfile?.phone || '',
          address: userProfile?.address || '',
          city: userProfile?.city || '',
          province: userProfile?.province || '',
          postalCode: userProfile?.postal_code || '',
          // Additional fields from database additional_data
          ...(userProfile as any)?.additional_data || {},
        },
      };

      // Normalize to UniversalUser with tracking
      const startTime = Date.now();
      const universalUser = toUniversalUser(authUser, 'api', {
        adapterId: this.id,
        version: '1.0.0',
        latency: Date.now() - startTime,
        retryCount: 0,
      });

      if (!universalUser) {
        return {
          success: false,
          error: 'Failed to normalize user data',
        };
      }

      // Verify user validation
      if (!universalUser._validation.isValid) {
        console.warn('Current user validation warnings:', universalUser._validation.warnings);
      }

      return {
        success: true,
        data: universalUser,
      };

    } catch (error) {
      return {
        success: false,
        error: `Get current user error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  }

  /**
   * Refresh authentication token
   */
  async refreshToken(): Promise<AdapterResult<string>> {
    try {
      if (!this.isAvailable) {
        throw new Error('Supabase is not available');
      }

      if (!supabase) {
        throw new Error('Supabase client is not available');
      }

      const { data, error } = await supabase.auth.refreshSession();

      if (error) {
        return {
          success: false,
          error: `Token refresh failed: ${error.message}`,
        };
      }

      if (!data.session?.access_token) {
        return {
          success: false,
          error: 'No access token in refreshed session',
        };
      }

      return {
        success: true,
        data: data.session.access_token,
        metadata: {
          refreshTokenTime: new Date().toISOString(),
          expiresAt: data.session.expires_at,
        },
      };

    } catch (error) {
      return {
        success: false,
        error: `Token refresh error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  }

  /**
   * Reset password
   */
  async resetPassword(email: string): Promise<AdapterResult<void>> {
    try {
      if (!this.isAvailable) {
        throw new Error('Supabase is not available');
      }

      if (!supabase) {
        throw new Error('Supabase client is not available');
      }

      const { error } = await supabase.auth.resetPasswordForEmail(email);

      if (error) {
        return {
          success: false,
          error: `Password reset failed: ${error.message}`,
        };
      }

      return {
        success: true,
        data: undefined,
        metadata: {
          resetEmailSent: true,
          email: email,
        },
      };

    } catch (error) {
      return {
        success: false,
        error: `Password reset error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  }

  /**
   * Get adapter health status
   */
  async getHealthStatus(): Promise<{
    status: 'healthy' | 'degraded' | 'unhealthy';
    details: Record<string, unknown>;
  }> {
    try {
      if (!this.isAvailable) {
        return {
          status: 'unhealthy',
          details: {
            error: 'Supabase is not available',
            adapterId: this.id,
            adapterType: this.type,
          },
        };
      }

      if (!supabase) {
        return {
          status: 'unhealthy',
          details: {
            error: 'Supabase client is not available',
            adapterId: this.id,
            adapterType: this.type,
          },
        };
      }

      const startTime = Date.now();
      const { error } = await supabase
        .from('users')
        .select('id')
        .limit(1);

      const responseTime = Date.now() - startTime;

      if (error) {
        return {
          status: 'unhealthy',
          details: {
            error: error.message,
            responseTime,
            adapterId: this.id,
            adapterType: this.type,
          },
        };
      }

      return {
        status: responseTime < 1000 ? 'healthy' : 'degraded',
        details: {
          responseTime,
          connected: true,
          adapterId: this.id,
          adapterType: this.type,
        },
      };

    } catch (error) {
      return {
        status: 'unhealthy',
        details: {
          error: error instanceof Error ? error.message : 'Unknown error',
          adapterId: this.id,
          adapterType: this.type,
        },
      };
    }
  }
}
