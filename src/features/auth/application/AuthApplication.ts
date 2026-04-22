// src/features/auth/application/AuthApplication.ts
//  authentication application integrated with hybrid architecture

import { healthMonitor } from '@/core/infrastructure/HealthMonitor';
import { hybridModeManager } from '@/core/infrastructure/HybridModeManager';
import type { IAdapter } from '@/core/interfaces/IAdapter';
import { adapterRegistry } from '@/core/registry/AdapterRegistry';
import type { AdapterResult , UniversalUser, RegistrationData } from '@/core/types/adapter';
import { toUniversalUser } from '@/types/types';
import { HybridAuthAdapter } from '../adapters/HybridAuthAdapter';

/**
 *  Authentication Application Service
 * Orchestrates authentication workflows with hybrid architecture integration
 */
export class AuthApplication {
  private hybridAdapter: HybridAuthAdapter;
  private initialized = false;

  /**
   * Get the hybrid adapter instance (for testing purposes)
   */
  getHybridAdapter(): HybridAuthAdapter {
    return this.hybridAdapter;
  }

  constructor() {
    this.hybridAdapter = new HybridAuthAdapter({
      type: 'hybrid',
      mode: 'mock',
      fallbackEnabled: true,
    });
  }

  /**
   * Initialize the authentication application with hybrid architecture
   */
  async initialize(): Promise<void> {
    if (this.initialized) {
      return;
    }

    try {
      // Initialize hybrid adapter
      await this.hybridAdapter.initialize();

      // Register adapters with the global registry
      await this.registerAdapters();

      // Setup health monitoring
      await this.setupHealthMonitoring();

      this.initialized = true;
      // Authentication Application initialized successfully

    } catch (error) {
      // Failed to initialize Authentication Application:
      throw new Error(`Initialization failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Authenticate user with credentials
   */
  async authenticateUser(credentials: {
    email: string;
    password: string;
    rememberMe?: boolean;
  }): Promise<AdapterResult<UniversalUser>> {
    await this.ensureInitialized();

    const startTime = Date.now();

    try {
      // Starting user authentication:

      // Step 1: Validate input credentials
      const validation = this.validateCredentials(credentials);
      if (!validation.isValid) {
        return {
          success: false,
          error: `Validation failed: ${validation.errors.join(', ')}`,
        };
      }

      // Step 2: Check hybrid mode and health
      const currentMode = hybridModeManager.getMode('authentication');
      const healthStatus = await this.getAuthAdapterHealth();

      if (healthStatus.status === 'unhealthy') {
        // Attempt fallback to mock if real adapter is unhealthy
        if (currentMode === 'real' && this.hybridAdapter.isFallbackEnabled()) {
          // Real auth adapter unhealthy, falling back to mock
          this.hybridAdapter.switchMode('mock');
        } else {
          return {
            success: false,
            error: 'Authentication service is currently unavailable. Please try again later.',
          };
        }
      }

      // Step 3: Authenticate using hybrid adapter
      const result = await this.hybridAdapter.login(credentials.email, credentials.password);

      const duration = Date.now() - startTime;

      if (result.success && result.data) {
        // Step 4: Log authentication event
        await this.logAuthEvent('user_authenticated', {
          userId: result.data.id,
          email: credentials.email,
          mode: currentMode,
          duration,
          adapterId: this.hybridAdapter.getCurrentMode() === 'mock' ? 'mock-auth' : 'real-auth',
        });

        // User authenticated successfully:
        return {
          success: true,
          data: result.data ? toUniversalUser(result.data, 'api') || undefined : undefined,
          metadata: {
            ...result.metadata,
            processingTime: duration,
            adapterUsed: this.hybridAdapter.getCurrentMode() === 'mock' ? 'mock-auth' : 'real-auth',
            hybridMode: currentMode,
            fallbackUsed: this.hybridAdapter.getCurrentMode() !== currentMode,
          },
        };
      } else {
        await this.logAuthEvent('authentication_failed', {
          email: credentials.email,
          error: result.error,
          duration,
          mode: currentMode,
        });

        return {
          success: false,
          error: result.error,
          metadata: result.metadata,
        };
      }

    } catch (error) {
      const duration = Date.now() - startTime;
      // Authentication failed:

      await this.logAuthEvent('authentication_error', {
        email: credentials.email,
        error: error instanceof Error ? error.message : 'Unknown error',
        duration,
      });

      return {
        success: false,
        error: `Authentication failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  }

  /**
   * Register new user
   */
  async registerUser(userData: RegistrationData): Promise<AdapterResult<UniversalUser>> {
    await this.ensureInitialized();

    const startTime = Date.now();

    try {
      // Starting user registration:

      // Step 1: Validate registration data
      const validation = this.validateRegistrationData(userData);
      if (!validation.isValid) {
        return {
          success: false,
          error: `Validation failed: ${validation.errors.join(', ')}`,
        };
      }

      // Step 2: Check hybrid mode (registration should use real mode)
      const currentMode = hybridModeManager.getMode('authentication');
      if (currentMode === 'hybrid' || currentMode === 'simulated') {
        // Registration requires real mode, switching to real mode
        this.hybridAdapter.switchMode('real');
      }

      // Step 3: Register using hybrid adapter
      const result = await this.hybridAdapter.register(userData);

      const duration = Date.now() - startTime;

      if (result.success && result.data) {
        // Step 4: Log registration event
        await this.logAuthEvent('user_registered', {
          userId: result.data.id,
          email: userData.email,
          role: userData.role,
          mode: currentMode,
          duration: duration,
          adapterId: this.hybridAdapter.getCurrentMode() === 'mock' ? 'mock-auth' : 'real-auth',
        });

        // User registered successfully:
        return {
          success: true,
          data: result.data ? toUniversalUser(result.data, 'api') || undefined : undefined,
          metadata: {
            ...result.metadata,
            processingTime: duration,
            adapterUsed: this.hybridAdapter.getCurrentMode() === 'mock' ? 'mock-auth' : 'real-auth',
            hybridMode: currentMode,
          },
        };
      } else {
        await this.logAuthEvent('registration_failed', {
          email: userData.email,
          error: result.error,
          duration,
          mode: currentMode,
        });

        return {
          success: false,
          error: result.error,
          metadata: result.metadata,
        };
      }

    } catch (error) {
      const duration = Date.now() - startTime;
      // Registration failed:

      await this.logAuthEvent('registration_error', {
        email: userData.email,
        error: error instanceof Error ? error.message : 'Unknown error',
        duration,
      });

      return {
        success: false,
        error: `Registration failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  }

  /**
   * Logout user
   */
  async logoutUser(userId: string): Promise<AdapterResult<void>> {
    await this.ensureInitialized();

    const startTime = Date.now();

    try {
      // Starting user logout:

      const result = await this.hybridAdapter.logout();
      const duration = Date.now() - startTime;

      if (result.success) {
        await this.logAuthEvent('user_logged_out', {
          userId,
          duration,
          adapterId: this.hybridAdapter.getCurrentMode() === 'mock' ? 'mock-auth' : 'real-auth',
        });

        // User logged out successfully:
      }

      return result;

    } catch (error) {
      const duration = Date.now() - startTime;
      // Logout failed:

      await this.logAuthEvent('logout_error', {
        userId,
        error: error instanceof Error ? error.message : 'Unknown error',
        duration,
      });

      return {
        success: false,
        error: `Logout failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  }

  /**
   * Get current user
   */
  async getCurrentUser(): Promise<AdapterResult<UniversalUser | null>> {
    await this.ensureInitialized();

    try {
      const result = await this.hybridAdapter.getCurrentUser();

      if (result.success) {
        await this.logAuthEvent('current_user_retrieved', {
          userId: result.data?.id || 'anonymous',
          adapterId: this.hybridAdapter.getCurrentMode() === 'mock' ? 'mock-auth' : 'real-auth',
        });
      }

      return {
        ...result,
        data: result.data ? toUniversalUser(result.data, 'api') || undefined : null,
      };

    } catch (error) {
      // Failed to get current user:

      return {
        success: false,
        error: `Failed to get current user: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  }

  /**
   * Switch authentication mode
   */
  async switchMode(mode: 'mock' | 'real'): Promise<AdapterResult<void>> {
    await this.ensureInitialized();

    try {
      // Switching authentication mode:

      this.hybridAdapter.switchMode(mode);

      await this.logAuthEvent('mode_switched', {
        from: this.hybridAdapter.getCurrentMode(),
        to: mode,
        adapterId: this.hybridAdapter.getCurrentMode() === 'mock' ? 'mock-auth' : 'real-auth',
      });

      // Update hybrid mode manager
      await hybridModeManager.setMode('authentication', mode as 'real' | 'hybrid' | 'simulated'); // Type cast for compatibility

        // Authentication mode switched successfully:

      return { success: true, data: undefined };

    } catch (error) {
      // Failed to switch authentication mode:

      return {
        success: false,
        error: `Failed to switch mode: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  }

  /**
   * Get authentication system health and status
   */
  async getSystemHealth(): Promise<{
    authentication: { status: string; details: Record<string, unknown> };
    hybrid: { mode: string; allowSwitching: boolean };
    adapters: Record<string, unknown>;
    overall: 'healthy' | 'degraded' | 'unhealthy';
  }> {
    await this.ensureInitialized();

    try {
      // Get authentication adapter health
      const authHealth = await this.getAuthAdapterHealth();

      // Get hybrid mode status
      const hybridMode = hybridModeManager.getMode('authentication');
      const allowSwitching = hybridModeManager.getMode('authentication') !== 'real'; // Simplified check

      // Get adapter registry health
      const healthStatus = adapterRegistry.getAdapterHealth('auth');

      // Determine overall health
      let overall: 'healthy' | 'degraded' | 'unhealthy';
      if (authHealth.status === 'unhealthy') {
        overall = 'unhealthy';
      } else if (authHealth.status === 'degraded') {
        overall = 'degraded';
      } else {
        overall = 'healthy';
      }

      return {
        authentication: authHealth,
        hybrid: {
          mode: hybridMode,
          allowSwitching,
        },
        adapters: (healthStatus || {}) as Record<string, unknown>,
        overall,
      };

    } catch (error) {
      // Failed to get system health:
      return {
        authentication: { status: 'unhealthy', details: { error: error instanceof Error ? error.message : 'Unknown error' } },
        hybrid: { mode: 'unknown', allowSwitching: false },
        adapters: {},
        overall: 'unhealthy',
      };
    }
  }

  /**
   * Get authentication statistics
   */
  async getAuthStatistics(): Promise<AdapterResult<{
    totalAuthentications: number;
    recentAuthentications: number;
    authenticationsByMode: Record<string, number>;
    averageProcessingTime: number;
    successRate: number;
    healthStatus: string;
    currentMode: string;
  }>> {
    await this.ensureInitialized();

    try {
      // This would integrate with your analytics system
      // For now, return mock data with real health status
      const health = await this.getAuthAdapterHealth();

      return {
        success: true,
        data: {
          totalAuthentications: 5000,
          recentAuthentications: 150,
          authenticationsByMode: {
            real: 3500,
            mock: 1200,
            hybrid: 300,
          },
          averageProcessingTime: 800,
          successRate: 0.98,
          healthStatus: health.status,
          currentMode: this.hybridAdapter.getCurrentMode(),
        },
        metadata: {
          retrievedAt: new Date().toISOString(),
        },
      };

    } catch (error) {
      // Failed to get authentication statistics:
      return {
        success: false,
        error: `Failed to get statistics: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  }

  /**
   * Ensure application is initialized
   */
  private async ensureInitialized(): Promise<void> {
    if (!this.initialized) {
      await this.initialize();
    }
  }

  /**
   * Register adapters with the global registry
   */
  private async registerAdapters(): Promise<void> {
    // Register hybrid authentication adapter
    await adapterRegistry.registerAdapter(new HybridAuthAdapter() as unknown as IAdapter<unknown, unknown>, {
  name: 'authentication',
  type: 'hybrid',
  feature: 'auth',
  connection: { timeout: 5000, retry: { attempts: 3, delay: 1000, backoff: 'exponential' } },
  performance: { enableCache: true, cacheTTL: 300, enableCompression: false },
});
    // Authentication adapters registered with global registry
  }

  /**
   * Setup health monitoring
   */
  private async setupHealthMonitoring(): Promise<void> {
    // Subscribe to health monitor updates
    healthMonitor.subscribe((healthStatus) => {
      const authHealth = healthStatus['authentication/hybrid'];
      if (authHealth && authHealth.status === 'unhealthy') {
        // Authentication adapter health degraded:
      }
    });

    // Start health monitoring if not already running
    if (!healthMonitor.getHealthStats().monitoringActive) {
      healthMonitor.startMonitoring(30000); // Check every 30 seconds
    }
  }

  /**
   * Get authentication adapter health
   */
  private async getAuthAdapterHealth(): Promise<{ status: string; details: Record<string, unknown> }> {
    try {
      const health = await this.hybridAdapter.getHealth();
      // Structure the health object to match expected interface
      return {
        status: health.status || 'unknown',
        details: {
          adapterId: health.adapterId || 'hybrid-auth',
          lastCheck: health.lastCheck || new Date().toISOString(),
          metrics: health.metrics || {},
          currentMode: health.currentMode || 'unknown',
          fallbackEnabled: health.fallbackEnabled || false,
        },
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        details: { error: error instanceof Error ? error.message : 'Unknown error' },
      };
    }
  }

  /**
   * Validate authentication credentials
   */
  private validateCredentials(credentials: {
    email: string;
    password: string;
    rememberMe?: boolean;
  }): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Email validation
    const emailValidation = this.validateEmailFormat(credentials.email);
    if (!emailValidation.isValid) {
      errors.push(emailValidation.error || 'Invalid email format');
    }

    // Password validation
    if (!credentials.password) {
      errors.push('Password is required');
    } else if (credentials.password.length < 1) {
      errors.push('Password cannot be empty');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validate registration data
   */
  private validateRegistrationData(userData: RegistrationData): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Email validation
    const emailValidation = this.validateEmailFormat(userData.email);
    if (!emailValidation.isValid) {
      errors.push(emailValidation.error || 'Invalid email format');
    }

    // Password validation
    if (!userData.password) {
      errors.push('Password is required');
    } else if (userData.password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }

    // Name validation
    if (!userData.name || userData.name.trim().length < 2) {
      errors.push('Name must be at least 2 characters long');
    }

    // Role validation
    const validRoles = ['farmer', 'inspector', 'logistics', 'packaging', 'retailer', 'admin'];
    if (!userData.role || !validRoles.includes(userData.role)) {
      errors.push('Invalid role specified');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
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
   * Log authentication events to hybrid system
   */
  private async logAuthEvent(_event: string, _data: Record<string, unknown>): Promise<void> {
    try {
      // This would integrate with your audit logging system
      // Authentication event:
      // For now, just log to console - in production, this would go to your audit system
      // await auditLogger.log('authentication', _event, _data);
    } catch (_error) {
      // Failed to log authentication event:
    }
  }

  /**
   * Cleanup application resources
   */
  async cleanup(): Promise<void> {
    try {
      await this.hybridAdapter.cleanup();
      this.initialized = false;
      // Authentication Application cleaned up
    } catch (_error) {
      // Failed to cleanup Authentication Application:
    }
  }
}

// Singleton instance
export const authApplication = new AuthApplication();
