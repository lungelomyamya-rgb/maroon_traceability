// src/features/registration/services/RegistrationRepository.ts
// Repository abstraction for registration operations

import { getFinalAdapterConfig } from '../../../config/adapters';
import type {
  RegistrationAdapter,
  AdapterResult,
  AuthUser,
  RegistrationData,
  AdapterConfig,
} from '../../../core/types/adapter';
import { logHybridOperation } from '../../../core/utils/hybridUtils';
import { SupabaseRegistrationAdapter } from '../adapters/SupabaseRegistrationAdapter';

/**
 * Cache entry for registration operations
 */
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

/**
 * Registration Repository
 * Provides clean abstraction with caching, validation, and hybrid support
 */
export class RegistrationRepository {
  private adapter: RegistrationAdapter | null = null;
  private initialized = false;
  private initializing = false;
  private cache = new Map<string, CacheEntry<unknown>>();
  private config: AdapterConfig;
  private static instance: RegistrationRepository | null = null;

  constructor() {
    // Use mock adapter if Supabase is not configured, otherwise use real
    const hasSupabaseConfig = process.env.NEXT_PUBLIC_SUPABASE_URL && 
                            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const adapterType = hasSupabaseConfig ? 'real' : 'mock';
    this.config = getFinalAdapterConfig('registration', adapterType);
  }

  /**
   * Get singleton instance
   */
  static getInstance(): RegistrationRepository {
    if (!RegistrationRepository.instance) {
      console.log('RegistrationRepository: Creating new singleton instance');
      RegistrationRepository.instance = new RegistrationRepository();
    } else {
      console.log('RegistrationRepository: Returning existing singleton instance');
    }
    return RegistrationRepository.instance;
  }

  /**
   * Initialize repository with real Supabase adapter only
   */
  async initialize(): Promise<void> {
    if (this.initialized) {
      console.log('RegistrationRepository: Already initialized, returning');
      return;
    }

    if (this.initializing) {
      console.log('RegistrationRepository: Already initializing, waiting...');
      // Wait for initialization to complete
      while (this.initializing) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      return;
    }

    this.initializing = true;

    try {
      logHybridOperation('initialize_repository', 'registration', {
        adapterType: this.config.type,
        config: this.config,
      }, 'info');

      // Create adapter based on configuration
      if (this.config.type === 'real') {
        console.log('RegistrationRepository: Creating new SupabaseRegistrationAdapter');
        this.adapter = new SupabaseRegistrationAdapter(this.config);
      } else {
        console.log('RegistrationRepository: Creating mock adapter');
        // Import mock adapter dynamically to avoid circular dependencies
        const { MockRegistrationAdapter } = await import('../adapters/MockRegistrationAdapter');
        this.adapter = new MockRegistrationAdapter(this.config);
      }
      console.log('RegistrationRepository: Adapter created:', {
        adapter: !!this.adapter,
        adapterId: this.adapter?.id,
        adapterType: this.adapter?.type,
      });

      console.log('RegistrationRepository: About to initialize adapter, adapter exists:', !!this.adapter);
      console.log('RegistrationRepository: Adapter before init:', {
        adapter: !!this.adapter,
        adapterId: this.adapter?.id,
        adapterType: this.adapter?.type,
        adapterRef: this.adapter,
      });

      await this.adapter.initialize();

      console.log('RegistrationRepository: Adapter initialization completed, checking adapter...');
      console.log('RegistrationRepository: Adapter after init:', {
        adapter: !!this.adapter,
        adapterId: this.adapter?.id,
        adapterType: this.adapter?.type,
        adapterRef: this.adapter,
      });

      this.initialized = true;
      this.initializing = false;

      console.log('RegistrationRepository: Adapter initialized successfully:', {
        adapter: !!this.adapter,
        adapterId: this.adapter?.id,
        adapterType: this.adapter?.type,
        initialized: this.initialized,
      });

      logHybridOperation('repository_initialized', 'registration', {
        adapterId: this.adapter?.id,
        adapterType: this.adapter?.type,
        isAvailable: this.adapter?.isAvailable,
      }, 'info');

    } catch (error) {
      this.initializing = false;
      logHybridOperation('repository_init_failed', 'registration', {
        error: (error as Error).message,
        adapterType: this.config.type,
      }, 'error');

      // No fallback for registration - must use real adapter
      throw new Error(`Registration initialization failed. Supabase configuration required: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Ensure repository is initialized
   */
  private async ensureInitialized(): Promise<void> {
    console.log('RegistrationRepository: ensureInitialized called:', {
      initialized: this.initialized,
      adapter: !!this.adapter,
      adapterId: this.adapter?.id,
      adapterType: this.adapter?.type,
    });

    if (!this.initialized) {
      console.log('RegistrationRepository: Not initialized, calling initialize()');
      await this.initialize();
      console.log('RegistrationRepository: After initialize():', {
        initialized: this.initialized,
        adapter: !!this.adapter,
        adapterId: this.adapter?.id,
        adapterType: this.adapter?.type,
      });
    } else {
      console.log('RegistrationRepository: Already initialized, checking adapter...');
    }

    if (!this.adapter) {
      console.error('RegistrationRepository: Adapter is null after ensureInitialized!');
    }
  }

  /**
   * Register a new user with validation and caching
   */
  async registerUser(userData: RegistrationData): Promise<AdapterResult<AuthUser>> {
    await this.ensureInitialized();

    const startTime = Date.now();

    try {
      logHybridOperation('register_user_start', 'registration', {
        email: userData.email,
        role: userData.role,
      }, 'info');

      if (!this.adapter) {
        return {
          success: false,
          error: 'Registration adapter is not available',
        };
      }

      // Validation
      const validation = this.validateRegistrationData(userData);
      if (!validation.valid) {
        logHybridOperation('register_user_validation_failed', 'registration', {
          email: userData.email,
          errors: validation.errors,
        }, 'warn');

        return {
          success: false,
          error: `Validation failed: ${validation.errors.join(', ')}`,
        };
      }

      // Check cache for email availability (short TTL)
      const cacheKey = `email-availability-${userData.email.toLowerCase()}`;
      const cachedAvailability = this.getCache<boolean>(cacheKey);

      if (cachedAvailability === false) {
        return {
          success: false,
          error: 'Email is already registered',
        };
      }

      // Check email availability if not cached
      let emailAvailable: true | undefined = cachedAvailability;
      if (emailAvailable === undefined) {
        const emailCheck = await this.adapter.checkEmailAvailability(userData.email);
        if (!emailCheck.success) {
          return {
            success: false,
            error: emailCheck.error,
          };
        }
        emailAvailable = emailCheck.data ? true : undefined;

        // Cache result for 5 minutes (only cache true to prevent false positives)
        if (emailAvailable) {
          this.setCache(cacheKey, emailAvailable, 300000);
        }
      }

      if (!emailAvailable) {
        return {
          success: false,
          error: 'Email is already registered',
        };
      }

      // Create user
      const result = await this.adapter.createUser(userData);

      const duration = Date.now() - startTime;

      if (result.success) {
        // Cache negative result for email availability to prevent duplicate registration
        this.setCache(cacheKey, false, 86400000); // 24 hours

        logHybridOperation('register_user_success', 'registration', {
          userId: result.data?.id,
          email: userData.email,
          role: userData.role,
          duration,
          requiresVerification: result.metadata?.requiresEmailVerification,
        }, 'info');
      } else {
        logHybridOperation('register_user_failed', 'registration', {
          email: userData.email,
          error: result.error,
          duration,
        }, 'error');
      }

      return result;

    } catch (error) {
      const duration = Date.now() - startTime;
      logHybridOperation('register_user_error', 'registration', {
        email: userData.email,
        error: (error as Error).message,
        duration,
      }, 'error');

      return {
        success: false,
        error: `Registration failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  }

  /**
   * Verify user email
   */
  async verifyEmail(token: string): Promise<AdapterResult<void>> {
    await this.ensureInitialized();

    if (!this.adapter) {
      return {
        success: false,
        error: 'Registration adapter is not available',
      };
    }

    try {
      const result = await this.adapter.verifyEmail(token);

      if (result.success) {
        console.log('Email verified successfully');
      }

      return result;

    } catch (error) {
      return {
        success: false,
        error: `Email verification failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  }

  /**
   * Check if email is available
   */
  async checkEmailAvailability(email: string): Promise<AdapterResult<boolean>> {
    await this.ensureInitialized();

    console.log('RegistrationRepository: Checking email availability for:', email);
    console.log('RegistrationRepository: Adapter type:', this.adapter?.type);
    console.log('RegistrationRepository: Adapter ID:', this.adapter?.id);

    if (!this.adapter) {
      console.log('RegistrationRepository: No adapter available');
      return {
        success: false,
        error: 'Registration adapter is not available',
      };
    }

    try {
      const result = await this.adapter.checkEmailAvailability(email);
      console.log('RegistrationRepository: Adapter result:', result);
      return result;
    } catch (error) {
      console.error('RegistrationRepository: Error checking email availability:', error);
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
    await this.ensureInitialized();

    if (!this.adapter) {
      return {
        success: false,
        error: 'Registration adapter is not available',
      };
    }

    try {
      const result = await this.adapter.sendVerificationEmail(email);

      if (result.success) {
        console.log('Verification email sent to:', email);
      }

      return result;

    } catch (error) {
      return {
        success: false,
        error: `Failed to send verification email: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  }


  /**
   * Validation with business rules
   */
  private validateRegistrationData(userData: RegistrationData): {
    valid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    // Email validation
    if (!userData.email) {
      errors.push('Email is required');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email)) {
      errors.push('Invalid email format');
    } else if (userData.email.length > 255) {
      errors.push('Email must be less than 255 characters');
    }

    // Password validation
    if (!userData.password) {
      errors.push('Password is required');
    } else {
      if (userData.password.length < 8) {
        errors.push('Password must be at least 8 characters long');
      } else if (userData.password.length > 128) {
        errors.push('Password must be less than 128 characters');
      } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(userData.password)) {
        errors.push('Password must contain at least one uppercase letter, one lowercase letter, and one number');
      } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(userData.password)) {
        errors.push('Password must contain at least one special character');
      }
    }

    // Name validation
    if (!userData.name) {
      errors.push('Name is required');
    } else if (userData.name.length < 2) {
      errors.push('Name must be at least 2 characters long');
    } else if (userData.name.length > 100) {
      errors.push('Name must be less than 100 characters');
    } else if (!/^[a-zA-Z\s'-]+$/.test(userData.name)) {
      errors.push('Name can only contain letters, spaces, hyphens, and apostrophes');
    }

    // Role validation
    if (!userData.role) {
      errors.push('Role is required');
    } else if (!['farmer', 'inspector', 'logistics', 'packaging', 'retailer', 'public', 'government', 'admin'].includes(userData.role)) {
      errors.push('Invalid role specified');
    }

    // Additional data validation
    if (userData.additionalData) {
      if (typeof userData.additionalData !== 'object') {
        errors.push('Additional data must be an object');
      } else if (JSON.stringify(userData.additionalData).length > 1000) {
        errors.push('Additional data is too large (max 1000 characters)');
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Cache operations
   */
  private setCache<T>(key: string, data: T, ttl: number): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    } as CacheEntry<T>);
  }

  /**
   * Get cache entry with proper typing
   */
  private getCache<T = unknown>(key: string): T | undefined {
    const entry = this.cache.get(key) as CacheEntry<T> | undefined;
    if (!entry) {
      return undefined;
    }

    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return undefined;
    }

    return entry.data as T;
  }

  /**
   * Clear cache
   */
  private clearCache(pattern?: string): void {
    if (!pattern) {
      this.cache.clear();
      return;
    }

    for (const key of this.cache.keys()) {
      if (key.includes(pattern)) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Get repository health status with detailed metrics
   */
  async getHealthStatus(): Promise<{
    status: 'healthy' | 'degraded' | 'unhealthy';
    details: Record<string, unknown>;
  }> {
    try {
      if (!this.adapter) {
        return {
          status: 'unhealthy',
          details: {
            error: 'No adapter available',
            initialized: this.initialized,
          },
        };
      }

      // Check if adapter has health status method
      if ('getHealthStatus' in this.adapter) {
        const adapterHealth = await (this.adapter as { getHealthStatus(): Promise<{ status: string; details: Record<string, unknown> }> }).getHealthStatus();

        return {
          status: adapterHealth.status as 'healthy' | 'degraded' | 'unhealthy',
          details: {
            ...adapterHealth.details,
            repository: {
              initialized: this.initialized,
              adapterId: this.adapter?.id,
              adapterType: this.adapter?.type,
              cacheSize: this.cache.size,
              config: this.config,
            },
          },
        };
      }

      // Basic health check
      const startTime = Date.now();
      const emailCheck = await this.adapter.checkEmailAvailability('health-check@example.com');
      const responseTime = Date.now() - startTime;

      return {
        status: emailCheck.success && responseTime < 2000 ? 'healthy' : 'degraded',
        details: {
          responseTime,
          adapterId: this.adapter?.id,
          adapterType: this.adapter?.type,
          initialized: this.initialized,
          cacheSize: this.cache.size,
        },
      };

    } catch (error) {
      return {
        status: 'unhealthy',
        details: {
          error: error instanceof Error ? error.message : 'Unknown error',
          initialized: this.initialized,
        },
      };
    }
  }

  /**
   * Cleanup repository resources
   */
  async cleanup(): Promise<void> {
    console.log('RegistrationRepository: Cleanup called, adapter exists:', !!this.adapter, 'initializing:', this.initializing);

    // Don't cleanup during initialization to prevent race conditions
    if (this.initializing) {
      console.log('RegistrationRepository: Skipping cleanup during initialization');
      return;
    }

    if (this.adapter) {
      await this.adapter.cleanup();
      this.adapter = null;
      console.log('RegistrationRepository: Adapter set to null during cleanup');
    }

    this.clearCache();
    this.initialized = false;

    logHybridOperation('repository_cleanup', 'registration', {
      cleaned: true,
    }, 'info');
  }

  /**
   * Get current adapter information
   */
  getAdapterInfo(): {
    id: string;
    type: string;
    isAvailable: boolean;
    config: AdapterConfig;
  } | null {
    if (!this.adapter) {
      return null;
    }

    return {
      id: this.adapter.id,
      type: this.adapter.type,
      isAvailable: this.adapter.isAvailable,
      config: this.config,
    };
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): {
    size: number;
    keys: string[];
    } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    };
  }

  /**
   * Force refresh of cached data
   */
  async refreshCache(): Promise<void> {
    this.clearCache();
    logHybridOperation('cache_refreshed', 'registration', {
      cleared: true,
    }, 'info');
  }
}

// Singleton instance
export const registrationRepository = RegistrationRepository.getInstance();
