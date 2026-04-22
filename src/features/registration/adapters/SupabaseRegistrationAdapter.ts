// src/features/registration/adapters/SupabaseRegistrationAdapter.ts
// Real Supabase implementation for registration

import type {
  RegistrationAdapter,
  AdapterConfig,
  AdapterResult,
  AuthUser,
  RegistrationData,
} from '../../../core/types/adapter';
import { supabase, isSupabaseAvailable } from '../services/supabaseClient';

/**
 * Supabase Registration Adapter
 * Real implementation using Supabase for user registration
 */
export class SupabaseRegistrationAdapter implements RegistrationAdapter {
  readonly id = 'supabase-registration';
  readonly type = 'real' as const;
  readonly isAvailable: boolean;

  constructor(private config?: AdapterConfig) {
    this.isAvailable = isSupabaseAvailable();
  }

  /**
   * Initialize the adapter
   */
  async initialize(): Promise<void> {
    console.log('SupabaseRegistrationAdapter: Initializing...', {
      isAvailable: this.isAvailable,
      supabaseExists: !!supabase,
      config: this.config,
    });

    if (!this.isAvailable) {
      console.error('SupabaseRegistrationAdapter: Supabase is not available');
      throw new Error('Supabase is not available. Check environment configuration.');
    }

    // Test Supabase connection
    try {
      console.log('SupabaseRegistrationAdapter: Testing connection...');
      const { error } = await supabase?.from('_test_connection').select('id').limit(1) || { error: null };
      console.log('SupabaseRegistrationAdapter: Connection test result:', { error });

      if (error && error.code !== 'PGRST116') { // Table doesn't exist is OK
        console.error('SupabaseRegistrationAdapter: Connection failed:', error);
        throw new Error(`Supabase connection failed: ${error.message}`);
      }

      console.log('SupabaseRegistrationAdapter: Initialization successful');
    } catch (error) {
      console.error('SupabaseRegistrationAdapter: Initialization failed:', error);
      throw new Error(`Failed to initialize Supabase registration adapter: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Cleanup adapter resources
   */
  async cleanup(): Promise<void> {
    // No specific cleanup needed for Supabase client
  }

  /**
   * Create new user account
   */
  async createUser(userData: RegistrationData): Promise<AdapterResult<AuthUser>> {
    try {
      if (!this.isAvailable) {
        throw new Error('Supabase is not available');
      }

      const { email, password, name, role, additionalData } = userData;

      // Create user in Supabase Auth
      const authResponse = await supabase?.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role,
            ...additionalData,
          },
        },
      });

      if (!authResponse) {
        return {
          success: false,
          error: 'Registration failed: Supabase auth not available',
        };
      }

      const { data: authData, error: authError } = authResponse;

      if (authError) {
        return {
          success: false,
          error: `Registration failed: ${authError.message}`,
        };
      }

      if (!authData.user) {
        return {
          success: false,
          error: 'Registration failed: No user data returned',
        };
      }

      // Create user profile in database - matching schema field names
      const userProfile = {
        id: authData.user.id,
        email: authData.user?.email || email,
        name,
        role,
        user_type: additionalData?.userType || 'individual', // Default user type
        registration_type: additionalData?.registrationType || 'individual', // Default registration type
        is_active: false, // Requires email verification - matches schema field name
        email_verified: false, // Matches schema field name
        created_at: new Date().toISOString(), // Matches schema field name
        updated_at: new Date().toISOString(), // Matches schema field name
        last_login_at: null, // Matches schema field name
        additional_data: additionalData || {}, // Store additional data in JSONB field
      };

      let profileData: AuthUser | null = null;
      let profileError: { message: string } | null = null;

      try {
        if (!supabase) {
          profileError = { message: 'Supabase not available' };
        } else {
          console.log('SupabaseRegistrationAdapter: Creating user profile with data:', userProfile);
          const result = await supabase
            .from('users')
            .insert(userProfile)
            .select()
            .single();

          console.log('SupabaseRegistrationAdapter: Profile creation result:', result);

          if (result && result.data && !result.error) {
            // Transform database record to AuthUser interface
            profileData = {
              id: result.data.id,
              email: result.data.email,
              name: result.data.name,
              role: result.data.role,
              isActive: result.data.is_active,
              createdAt: result.data.created_at,
              updatedAt: result.data.updated_at,
              emailVerified: result.data.email_verified,
              lastLoginAt: result.data.last_login_at,
            };
            profileError = null;
          } else {
            console.error('SupabaseRegistrationAdapter: Profile creation failed:', result?.error);
            profileError = result?.error || { message: 'Failed to create user profile' };
          }
        }
      } catch (error) {
        console.error('SupabaseRegistrationAdapter: Profile creation exception:', error);
        profileError = { message: error instanceof Error ? error.message : 'Unknown error' };
      }

      if (profileError) {
        // Try to rollback auth user
        await supabase?.auth.admin.deleteUser(authData.user.id);
        return {
          success: false,
          error: `Failed to create user profile: ${profileError.message}`,
        };
      }

      if (!profileData) {
        return {
          success: false,
          error: 'Failed to create user profile: No data returned',
        };
      }

      // Send verification email
      await this.sendVerificationEmail(email);

      const resultUser: AuthUser = {
        id: profileData.id,
        email: profileData.email,
        name: profileData.name,
        role: profileData.role,
        isActive: profileData.isActive,
        createdAt: profileData.createdAt,
        updatedAt: profileData.updatedAt,
        emailVerified: profileData.emailVerified,
        lastLoginAt: profileData.lastLoginAt,
      };

      return {
        success: true,
        data: resultUser,
        metadata: {
          requiresEmailVerification: true,
          userId: authData.user.id,
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
   * Verify user email
   */
  async verifyEmail(token: string): Promise<AdapterResult<void>> {
    try {
      if (!this.isAvailable) {
        throw new Error('Supabase is not available');
      }

      if (!supabase) {
        return {
          success: false,
          error: 'Supabase is not available',
        };
      }

      const { error } = await supabase.auth.verifyOtp({
        token,
        type: 'signup',
        email: '', // Email is not required for token verification
      });

      if (error) {
        return {
          success: false,
          error: `Email verification failed: ${error.message}`,
        };
      }

      // Update user profile to mark as verified
      if (!supabase) {
        return {
          success: false,
          error: 'Supabase is not available',
        };
      }

      const { data: userData } = await supabase.auth.getUser();
      if (userData.user) {
        const { error } = await supabase
          .from('users')
          .update({
            email_verified: true, // Matches schema field name
            is_active: true, // Matches schema field name
            updated_at: new Date().toISOString(), // Matches schema field name
          })
          .eq('id', userData.user.id);

        if (error) {
          console.error('SupabaseRegistrationAdapter: Failed to update user verification status:', error);
        }
      }

      return {
        success: true,
        data: undefined,
      };

    } catch (error) {
      return {
        success: false,
        error: `Email verification error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  }

  /**
   * Check if email is available
   */
  async checkEmailAvailability(email: string): Promise<AdapterResult<boolean>> {
    try {
      if (!this.isAvailable) {
        throw new Error('Supabase is not available');
      }

      if (!supabase) {
        return {
          success: false,
          error: 'Supabase is not available',
        };
      }

      // Use direct table access since RLS policies are properly configured
      const { data, error } = await supabase
        .from('users')
        .select('id')
        .eq('email', email)
        .limit(1);

      if (error) {
        console.error('Email availability check failed:', error);
        return {
          success: false,
          error: `Email availability check failed: ${error.message}`,
        };
      }

      const isAvailable = !data || data.length === 0;
      return { success: true, data: isAvailable };

    } catch (error) {
      return {
        success: false,
        error: `Email availability check failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  }

  /**
   * Send verification email
   */
  async sendVerificationEmail(email: string): Promise<AdapterResult<void>> {
    try {
      if (!this.isAvailable) {
        throw new Error('Supabase is not available');
      }

      if (!supabase) {
        return {
          success: false,
          error: 'Supabase is not available',
        };
      }

      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
      });

      if (error) {
        return {
          success: false,
          error: `Failed to send verification email: ${error.message}`,
        };
      }

      return {
        success: true,
        data: undefined,
      };

    } catch (error) {
      return {
        success: false,
        error: `Verification email error: ${error instanceof Error ? error.message : 'Unknown error'}`,
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
          details: { error: 'Supabase is not available' },
        };
      }

      const startTime = Date.now();
      if (!supabase) {
        return {
          status: 'unhealthy',
          details: { error: 'Supabase is not available' },
        };
      }

      const { error } = await supabase.from('users').select('id').limit(1);
      const responseTime = Date.now() - startTime;

      if (error) {
        return {
          status: 'unhealthy',
          details: { error: error.message, responseTime },
        };
      }

      return {
        status: responseTime < 1000 ? 'healthy' : 'degraded',
        details: { responseTime, connected: true },
      };

    } catch (error) {
      return {
        status: 'unhealthy',
        details: {
          error: error instanceof Error ? error.message : 'Unknown error',
          connected: false,
        },
      };
    }
  }
}
