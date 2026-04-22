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
import { supabase, isSupabaseAvailable } from '../../registration/services/supabaseClient';

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

      // Get user profile from database
      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', data.user.id)
        .single();

      if (profileError) {
        console.warn('Failed to fetch user profile:', profileError);
      }

      // Create AuthUser from Supabase data
      const authUser: AuthUser = {
        id: data.user.id,
        email: data.user.email || '',
        name: profile?.name || data.user.user_metadata?.name || data.user.email?.split('@')[0] || 'User',
        role: profile?.role || data.user.user_metadata?.role || 'public',
        isActive: profile?.isActive ?? true,
        createdAt: profile?.createdAt || data.user.created_at,
        updatedAt: profile?.updatedAt || data.user.updated_at,
        lastLoginAt: new Date().toISOString(),
        emailVerified: data.user.email_confirmed_at ? true : false,
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
        isActive: false, // Requires email verification
        createdAt: data.user.created_at,
        updatedAt: data.user.updated_at,
        lastLoginAt: null,
        emailVerified: false,
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

      const authUser: AuthUser = {
        id: profile.id,
        email: profile.email,
        name: profile.name,
        role: profile.role,
        isActive: profile.isActive,
        createdAt: profile.createdAt,
        updatedAt: profile.updatedAt,
        lastLoginAt: profile.lastLoginAt,
        emailVerified: profile.emailVerified,
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
          requiresEmailVerification: true,
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

      // Get user profile from database
      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (profileError) {
        console.warn('Failed to fetch user profile:', profileError);
      }

      const authUser: AuthUser = {
        id: session.user.id,
        email: session.user.email || '',
        name: profile?.name || session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User',
        role: profile?.role || session.user.user_metadata?.role || 'public',
        isActive: profile?.isActive ?? true,
        createdAt: profile?.createdAt || session.user.created_at,
        updatedAt: profile?.updatedAt || session.user.updated_at,
        lastLoginAt: profile?.lastLoginAt,
        emailVerified: session.user.email_confirmed_at ? true : false,
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
