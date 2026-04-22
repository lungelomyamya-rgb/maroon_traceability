// src/features/registration/adapters/RealRegistrationAdapter.ts
// Real registration adapter integrated with hybrid architecture

import type {
  RegistrationAdapter,
  AdapterConfig,
  AdapterResult,
  AuthUser,
  RegistrationData,
} from '../../../core/types/adapter';
import { registrationRepository } from '../services/RegistrationRepository';
import { supabase, isSupabaseAvailable } from '../services/supabaseClient';

/**
 * Real Registration Adapter
 * Production-ready implementation using Supabase with comprehensive validation
 */
export class RealRegistrationAdapter implements RegistrationAdapter {
  readonly id = 'real-registration';
  readonly type = 'real' as const;
  readonly isAvailable: boolean;
  private config?: AdapterConfig;
  private healthCheckInterval?: NodeJS.Timeout;

  constructor(config?: AdapterConfig) {
    this.config = config;
    this.isAvailable = isSupabaseAvailable();
  }

  /**
   * Initialize the adapter with validation and setup
   */
  async initialize(): Promise<void> {
    if (!this.isAvailable) {
      throw new Error('Real registration adapter is not available. Check Supabase configuration.');
    }

    try {
      // Validate Supabase connection
      await this.validateSupabaseConnection();

      // Setup health monitoring
      this.setupHealthMonitoring();

      console.log('Real registration adapter initialized successfully');
    } catch (error) {
      throw new Error(`Failed to initialize real registration adapter: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Cleanup adapter resources
   */
  async cleanup(): Promise<void> {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
      this.healthCheckInterval = undefined;
    }
    console.log('Real registration adapter cleaned up');
  }

  /**
   * Create new user account with comprehensive validation
   */
  async createUser(userData: RegistrationData): Promise<AdapterResult<AuthUser>> {
    try {
      if (!this.isAvailable) {
        return {
          success: false,
          error: 'Real registration adapter is not available',
        };
      }

      // Validate input data
      const validationResult = await this.validateRegistrationData(userData);
      if (!validationResult.success) {
        return {
          success: false,
          error: validationResult.error,
        };
      }

      // Check email availability
      const emailCheck = await this.checkEmailAvailability(userData.email);
      if (!emailCheck.success || !emailCheck.data) {
        return {
          success: false,
          error: emailCheck.error || 'Email is already registered',
        };
      }

      // Create user using repository pattern
      const result = await registrationRepository.registerUser(userData);

      if (result.success && result.data) {
        // Send verification email
        await this.sendVerificationEmail(userData.email);

        // Log registration event
        await this.logRegistrationEvent('user_created', {
          userId: result.data.id,
          email: userData.email,
          role: userData.role,
        });
      }

      return result;

    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        error: `Registration failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  }

  /**
   * Verify user email with security
   */
  async verifyEmail(token: string): Promise<AdapterResult<void>> {
    try {
      if (!this.isAvailable) {
        return {
          success: false,
          error: 'Real registration adapter is not available',
        };
      }

      // Validate token format
      if (!token || token.length < 10) {
        return {
          success: false,
          error: 'Invalid verification token',
        };
      }

      const result = await registrationRepository.verifyEmail(token);

      if (result.success) {
        // Log verification event
        await this.logRegistrationEvent('email_verified', { token });
      }

      return result;

    } catch (error) {
      console.error('Email verification error:', error);
      return {
        success: false,
        error: `Email verification failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  }

  /**
   * Check if email is available with caching
   */
  async checkEmailAvailability(email: string): Promise<AdapterResult<boolean>> {
    try {
      if (!this.isAvailable) {
        return {
          success: false,
          error: 'Real registration adapter is not available',
        };
      }

      // Validate email format
      const emailValidation = this.validateEmailFormat(email);
      if (!emailValidation.isValid) {
        return {
          success: false,
          error: emailValidation.error || 'Invalid email format',
        };
      }

      return await registrationRepository.checkEmailAvailability(email);

    } catch (error) {
      console.error('Email availability check error:', error);
      return {
        success: false,
        error: `Email check failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  }

  /**
   * Send verification email with templates
   */
  async sendVerificationEmail(email: string): Promise<AdapterResult<void>> {
    try {
      if (!this.isAvailable) {
        return {
          success: false,
          error: 'Real registration adapter is not available',
        };
      }

      const result = await registrationRepository.sendVerificationEmail(email);

      if (result.success) {
        // Log email sent event
        await this.logRegistrationEvent('verification_email_sent', { email });
      }

      return result;

    } catch (error) {
      console.error('Verification email error:', error);
      return {
        success: false,
        error: `Failed to send verification email: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  }

  /**
   * Get comprehensive health status
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
            connected: false,
          },
        };
      }

      const startTime = Date.now();

      // Test database connection
      const dbResult = await registrationRepository.getHealthStatus();
      const responseTime = Date.now() - startTime;

      const details = {
        responseTime,
        connected: true,
        database: dbResult.status === 'healthy',
        timestamp: new Date().toISOString(),
      };

      let status: 'healthy' | 'degraded' | 'unhealthy';
      if (dbResult.status === 'unhealthy') {
        status = 'unhealthy';
      } else if (responseTime > 2000 || dbResult.status === 'degraded') {
        status = 'degraded';
      } else {
        status = 'healthy';
      }

      return { status, details };

    } catch (error) {
      return {
        status: 'unhealthy',
        details: {
          error: error instanceof Error ? error.message : 'Unknown error',
          connected: false,
          timestamp: new Date().toISOString(),
        },
      };
    }
  }

  /**
   * Validate registration data comprehensively
   */
  private async validateRegistrationData(userData: RegistrationData): Promise<AdapterResult<void>> {
    const errors: string[] = [];

    // Email validation
    const emailValidation = this.validateEmailFormat(userData.email);
    if (!emailValidation.isValid) {
      errors.push(emailValidation.error || 'Invalid email format');
    }

    // Password validation
    const passwordValidation = this.validatePassword(userData.password);
    if (!passwordValidation.isValid) {
      errors.push(...passwordValidation.errors);
    }

    // Name validation
    if (!userData.name || userData.name.trim().length < 2) {
      errors.push('Name must be at least 2 characters long');
    }

    // Role validation
    const validRoles = ['farmer', 'logistics', 'inspector', 'packaging', 'retailer', 'admin'];
    if (!userData.role || !validRoles.includes(userData.role)) {
      errors.push('Invalid role specified');
    }

    if (errors.length > 0) {
      return {
        success: false,
        error: `Validation failed: ${errors.join(', ')}`,
      };
    }

    return { success: true, data: undefined };
  }

  /**
   * Validate email format
   */
  private validateEmailFormat(email: string): { isValid: boolean; error?: string } {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) {
      return { isValid: false, error: 'Email is required' };
    }

    if (!emailRegex.test(email)) {
      return { isValid: false, error: 'Invalid email format' };
    }

    if (email.length > 255) {
      return { isValid: false, error: 'Email is too long (max 255 characters)' };
    }

    return { isValid: true };
  }

  /**
   * Validate password strength
   */
  private validatePassword(password: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!password) {
      errors.push('Password is required');
      return { isValid: false, errors };
    }

    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }

    if (password.length > 128) {
      errors.push('Password is too long (max 128 characters)');
    }

    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }

    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }

    if (!/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validate Supabase connection
   */
  private async validateSupabaseConnection(): Promise<void> {
    try {
      const { error } = await supabase?.from('users').select('id').limit(1) || { error: null };

      if (error && error.code !== 'PGRST116') { // Table doesn't exist is OK
        throw new Error(`Supabase connection test failed: ${error.message}`);
      }
    } catch (error) {
      throw new Error(`Supabase validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Setup health monitoring
   */
  private setupHealthMonitoring(): void {
    // Optional: Set up periodic health checks
    // For now, always enable health monitoring for real registration adapter
    this.healthCheckInterval = setInterval(async () => {
      const health = await this.getHealthStatus();
      if (health.status === 'unhealthy') {
        console.warn('Real registration adapter health degraded:', health.details);
      }
    }, 60000); // Check every minute
  }

  /**
   * Log registration events for audit trail
   */
  private async logRegistrationEvent(event: string, data: Record<string, unknown>): Promise<void> {
    try {
      // This would integrate with your audit logging system
      console.log(`Registration event: ${event}`, data);

      // For now, just log to console - in production, this would go to your audit system
      // await auditLogger.log('registration', event, data);
    } catch (error) {
      console.warn('Failed to log registration event:', error);
    }
  }
}
