// src/features/registration/services/RegistrationService.ts
// Registration service with business logic and hybrid support

import type {
  AuthUser,
  RegistrationData,
  AdapterResult,
} from '../../../core/types/adapter';
import { logHybridOperation } from '../../../core/utils/hybridUtils';
import { registrationRepository } from './RegistrationRepository';

/**
 * Registration service configuration
 */
interface RegistrationServiceConfig {
  /** Enable email verification requirement */
  requireEmailVerification: boolean;
  /** Maximum registration attempts per hour */
  maxRegistrationAttempts: number;
  /** Account lockout duration in milliseconds */
  accountLockoutDuration: number;
  /** Password requirements */
  passwordRequirements: {
    minLength: number;
    maxLength: number;
    requireUppercase: boolean;
    requireLowercase: boolean;
    requireNumbers: boolean;
    requireSpecialChars: boolean;
  };
  /** Rate limiting */
  rateLimiting: {
    enabled: boolean;
    windowMs: number;
    maxAttempts: number;
  };
}

/**
 * Registration statistics
 */
interface RegistrationStats {
  totalRegistrations: number;
  successfulRegistrations: number;
  failedRegistrations: number;
  averageRegistrationTime: number;
  registrationsByRole: Record<string, number>;
  registrationsByTime: Record<string, number>;
}

/**
 * Default registration service configuration
 */
const DEFAULT_CONFIG: RegistrationServiceConfig = {
  requireEmailVerification: true,
  maxRegistrationAttempts: 5,
  accountLockoutDuration: 900000, // 15 minutes
  passwordRequirements: {
    minLength: 8,
    maxLength: 128,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
  },
  rateLimiting: {
    enabled: true,
    windowMs: 3600000, // 1 hour
    maxAttempts: 3,
  },
};

/**
 * Registration attempt tracking
 */
interface RegistrationAttempt {
  email: string;
  timestamp: number;
  success: boolean;
  ip?: string;
  userAgent?: string;
}

/**
 * Registration Service
 * Provides business logic and orchestration for registration operations
 */
export class RegistrationService {
  private config: RegistrationServiceConfig;
  private registrationAttempts = new Map<string, RegistrationAttempt[]>();
  private stats: RegistrationStats = {
    totalRegistrations: 0,
    successfulRegistrations: 0,
    failedRegistrations: 0,
    averageRegistrationTime: 0,
    registrationsByRole: {},
    registrationsByTime: {},
  };

  constructor(config: Partial<RegistrationServiceConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  /**
   * Initialize registration service
   */
  async initialize(): Promise<void> {
    try {
      logHybridOperation('service_initialize', 'registration', {
        config: this.config,
      }, 'info');

      await registrationRepository.initialize();

      // Clean up old registration attempts
      this.cleanupOldAttempts();

      logHybridOperation('service_initialized', 'registration', {
        repositoryHealth: await registrationRepository.getHealthStatus(),
      }, 'info');

    } catch (error) {
      logHybridOperation('service_init_failed', 'registration', {
        error: (error as Error).message,
      }, 'error');
      throw error;
    }
  }

  /**
   * Register user with business logic validation
   */
  async registerUser(userData: RegistrationData, context?: {
    ip?: string;
    userAgent?: string;
  }): Promise<AdapterResult<AuthUser>> {
    const startTime = Date.now();

    try {
      logHybridOperation('service_register_start', 'registration', {
        email: userData.email,
        role: userData.role,
        context,
      }, 'info');

      // Business logic validations
      const businessValidation = this.validateBusinessRules(userData, context);
      if (!businessValidation.valid) {
        return {
          success: false,
          error: `Business validation failed: ${businessValidation.errors.join(', ')}`,
        };
      }

      // Rate limiting check
      const rateLimitCheck = this.checkRateLimit(userData.email);
      if (!rateLimitCheck.allowed) {
        return {
          success: false,
          error: rateLimitCheck.reason || 'Rate limit exceeded',
        };
      }

      // Track registration attempt
      this.trackRegistrationAttempt(userData.email, false, context);

      // Perform registration
      const result = await registrationRepository.registerUser(userData);

      const duration = Date.now() - startTime;

      if (result.success) {
        // Update successful registration tracking
        this.trackRegistrationAttempt(userData.email, true, context);
        this.updateStats(true, userData.role, duration);

        logHybridOperation('service_register_success', 'registration', {
          userId: result.data?.id,
          email: userData.email,
          role: userData.role,
          duration,
        }, 'info');

        // Send welcome email (business logic)
        if (result.data) {
          await this.sendWelcomeEmail(userData.email, result.data);
        }

      } else {
        // Update failed registration tracking
        this.updateStats(false, userData.role, duration);

        logHybridOperation('service_register_failed', 'registration', {
          email: userData.email,
          error: result.error,
          duration,
        }, 'error');
      }

      return result;

    } catch (error) {
      const duration = Date.now() - startTime;
      this.updateStats(false, userData.role, duration);

      logHybridOperation('service_register_error', 'registration', {
        email: userData.email,
        error: (error as Error).message,
        duration,
      }, 'error');

      return {
        success: false,
        error: `Registration service error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  }

  /**
   * Get registration service status with detailed metrics
   */
  async getServiceStatus(): Promise<{
    initialized: boolean;
    config: RegistrationServiceConfig;
    stats: RegistrationStats;
    repository: { status: string; details: Record<string, unknown> } | { error: string };
    health: 'healthy' | 'degraded' | 'unhealthy';
  }> {
    try {
      const repositoryHealth = await registrationRepository.getHealthStatus();

      return {
        initialized: true,
        config: this.config,
        stats: this.stats,
        repository: repositoryHealth,
        health: repositoryHealth.status,
      };

    } catch (error) {
      return {
        initialized: false,
        config: this.config,
        stats: this.stats,
        repository: { error: (error as Error).message },
        health: 'unhealthy',
      };
    }
  }

  /**
   * Get registration statistics
   */
  getStats(): RegistrationStats {
    return { ...this.stats };
  }

  /**
   * Reset statistics
   */
  resetStats(): void {
    this.stats = {
      totalRegistrations: 0,
      successfulRegistrations: 0,
      failedRegistrations: 0,
      averageRegistrationTime: 0,
      registrationsByRole: {},
      registrationsByTime: {},
    };

    logHybridOperation('service_stats_reset', 'registration', {
      reset: true,
    }, 'info');
  }

  /**
   * Validate business rules for registration
   */
  private validateBusinessRules(
    userData: RegistrationData,
    context?: { ip?: string; userAgent?: string },
  ): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Business rule: Check for disposable email domains
    if (this.isDisposableEmail(userData.email)) {
      errors.push('Disposable email addresses are not allowed');
    }

    // Business rule: Check for suspicious registration patterns
    if (context && this.isSuspiciousRegistration(userData, context)) {
      errors.push('Registration pattern detected as suspicious');
    }

    // Business rule: Role-based validation
    if (userData.role === 'admin' && !this.isAdminRegistrationAllowed()) {
      errors.push('Admin registration requires special approval');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Check rate limiting for registration attempts
   */
  private checkRateLimit(email: string): { allowed: boolean; reason?: string } {
    if (!this.config.rateLimiting.enabled) {
      return { allowed: true };
    }

    const now = Date.now();
    const windowStart = now - this.config.rateLimiting.windowMs;
    const attempts = this.registrationAttempts.get(email) || [];

    const recentAttempts = attempts.filter(
      attempt => attempt.timestamp > windowStart,
    );

    if (recentAttempts.length >= this.config.rateLimiting.maxAttempts) {
      return {
        allowed: false,
        reason: 'Too many registration attempts. Please try again later.',
      };
    }

    return { allowed: true };
  }

  /**
   * Track registration attempt
   */
  private trackRegistrationAttempt(
    email: string,
    success: boolean,
    context?: { ip?: string; userAgent?: string },
  ): void {
    const attempts = this.registrationAttempts.get(email) || [];
    attempts.push({
      email,
      timestamp: Date.now(),
      success,
      ip: context?.ip,
      userAgent: context?.userAgent,
    });

    this.registrationAttempts.set(email, attempts);
  }

  /**
   * Clean up old registration attempts
   */
  private cleanupOldAttempts(): void {
    const cutoffTime = Date.now() - this.config.accountLockoutDuration;

    for (const [email, attempts] of this.registrationAttempts) {
      const recentAttempts = attempts.filter(
        attempt => attempt.timestamp > cutoffTime,
      );

      if (recentAttempts.length !== attempts.length) {
        this.registrationAttempts.set(email, recentAttempts);
      }
    }
  }

  /**
   * Update registration statistics
   */
  private updateStats(success: boolean, role: string, duration: number): void {
    this.stats.totalRegistrations++;

    if (success) {
      this.stats.successfulRegistrations++;
    } else {
      this.stats.failedRegistrations++;
    }

    // Update average registration time
    const totalTime = this.stats.averageRegistrationTime * (this.stats.totalRegistrations - 1) + duration;
    this.stats.averageRegistrationTime = totalTime / this.stats.totalRegistrations;

    // Update role statistics
    this.stats.registrationsByRole[role] = (this.stats.registrationsByRole[role] || 0) + 1;

    // Update time statistics (hourly)
    const hour = new Date().getHours().toString();
    this.stats.registrationsByTime[hour] = (this.stats.registrationsByTime[hour] || 0) + 1;
  }

  /**
   * Check if email is from disposable domain
   */
  private isDisposableEmail(email: string): boolean {
    const disposableDomains = [
      '10minutemail.com', 'tempmail.org', 'guerrillamail.com',
      'mailinator.com', 'throwaway.email', 'yopmail.com',
    ];

    const domain = email.split('@')[1]?.toLowerCase();
    return disposableDomains.includes(domain);
  }

  /**
   * Check if registration pattern is suspicious
   */
  private isSuspiciousRegistration(
    userData: RegistrationData,
    context?: { ip?: string; userAgent?: string },
  ): boolean {
    // This would be much more sophisticated in a real implementation
    // Using IP reputation, user agent analysis, etc.

    if (!context) {
      return false;
    }

    // Simple heuristic checks
    const suspiciousPatterns = [
      /test/i.test(userData.email),
      /admin/i.test(userData.name),
      /bot/i.test(context.userAgent || ''),
    ];

    return suspiciousPatterns.some(pattern => pattern);
  }

  /**
   * Check if admin registration is allowed
   */
  private isAdminRegistrationAllowed(): boolean {
    // In a real implementation, this might check environment variables,
    // database flags, or other business rules
    return process.env.NODE_ENV === 'development';
  }

  /**
   * Send welcome email
   */
  private async sendWelcomeEmail(email: string, user: AuthUser): Promise<void> {
    // This would integrate with an email service
    logHybridOperation('welcome_email_sent', 'registration', {
      email,
      userId: user.id,
      role: user.role,
    }, 'info');
  }

  /**
   * Cleanup service resources
   */
  async cleanup(): Promise<void> {
    await registrationRepository.cleanup();
    this.registrationAttempts.clear();
    this.resetStats();

    logHybridOperation('service_cleanup', 'registration', {
      cleaned: true,
    }, 'info');
  }
}

// Default service instance
export const registrationService = new RegistrationService();

/**
 * Initialize registration service (legacy compatibility)
 */
export async function initializeRegistrationService(): Promise<void> {
  await registrationService.initialize();
}

/**
 * Get registration service status (legacy compatibility)
 */
export async function getRegistrationServiceStatus(): Promise<{
    initialized: boolean;
    config: RegistrationServiceConfig;
    stats: RegistrationStats;
    repository: unknown;
    health: 'healthy' | 'degraded' | 'unhealthy';
  }> {
  return await registrationService.getServiceStatus();
}
