// src/features/auth/adapters/HybridAuthAdapter.ts
// Hybrid authentication adapter bridge

import type { IAdapter } from '../../../core/types/IAdapter';
import type {
  AuthAdapter,
  AdapterConfig,
  AdapterResult,
  UniversalUser,
  RegistrationData,
} from '../../../core/types/adapter';
import { MockAuthAdapter } from './MockAuthAdapter';
import { RealAuthAdapter } from './RealAuthAdapter';

/**
 * Hybrid authentication adapter
 * Bridges between mock and real authentication adapters
 * Supports automatic switching and fallback
 */
export class HybridAuthAdapter implements AuthAdapter, IAdapter<unknown, unknown> {
  readonly id = 'hybrid-auth';
  readonly type = 'hybrid' as const;
  isAvailable = false;
  private mockAdapter: MockAuthAdapter;
  private realAdapter: RealAuthAdapter;
  private currentMode: 'mock' | 'real' = 'mock';
  private fallbackEnabled = true;
  protected config?: AdapterConfig;

  protected health = {
    isHealthy: true,
    lastCheck: new Date(),
    responseTime: 0,
    errorCount: 0,
    uptime: 100,
    status: 'healthy',
    consecutiveFailures: 0,
  };
  protected metrics = {
    totalOperations: 0,
    successfulOperations: 0,
    failedOperations: 0,
    averageResponseTime: 0,
    minResponseTime: Infinity,
    maxResponseTime: 0,
    lastOperation: new Date(),
    operationsPerSecond: 0,
    errorRate: 0,
    cacheHitRate: 0,
  };

  constructor(config?: AdapterConfig & {
    mode?: 'mock' | 'real';
    fallbackEnabled?: boolean;
  }) {
    this.mockAdapter = new MockAuthAdapter();
    this.realAdapter = new RealAuthAdapter();
    this.config = config || { type: 'hybrid' };
    this.fallbackEnabled = config?.fallbackEnabled ?? true;
  }

  /**
   * Initialize adapter
   * @param config - Adapter configuration
   */
  async initialize(config?: AdapterConfig): Promise<void> {
    this.config = config || { type: 'hybrid' };
    this.currentMode = (config as AdapterConfig & { mode?: 'mock' | 'real' })?.mode || 'mock';
    this.fallbackEnabled = (config as AdapterConfig & { fallbackEnabled?: boolean })?.fallbackEnabled ?? true;

    // Initialize both adapters
    try {
      await this.mockAdapter.initialize();
      await this.realAdapter.initialize();
      this.isAvailable = true;
    } catch (error) {
      console.error('Failed to initialize adapters:', error);
      this.isAvailable = false;
    }
  }

  /**
   * Transform input data to output format
   * @param input - Input data to transform
   * @returns Promise resolving to transformed output
   */
  async transform(input: unknown): Promise<AdapterResult<unknown>> {
    // This adapter doesn't transform data, it delegates to active adapter
    return {
      success: true,
      data: input,
    };
  }


  /**
   * Validate input data
   * @param input - Input data to validate
   * @returns Promise resolving to validation result
   */
  async validate(input: unknown): Promise<AdapterResult<boolean>> {
    // Basic validation
    return {
      success: true,
      data: input !== null && input !== undefined,
    };
  }

  /**
   * Get adapter health status
   * @returns Promise resolving to health status
   */
  async getHealth(): Promise<{
    adapterId: string;
    status: 'healthy' | 'unhealthy';
    lastCheck: string;
    metrics: Record<string, unknown>;
    currentMode: string;
    fallbackEnabled: boolean;
  }> {
    // Return combined health of both adapters
    return {
      adapterId: this.id,
      status: this.isAvailable ? 'healthy' : 'unhealthy',
      lastCheck: new Date().toISOString(),
      metrics: this.metrics,
      currentMode: this.currentMode,
      fallbackEnabled: this.fallbackEnabled,
    };
  }

  /**
   * Get the current active adapter
   */
  private getActiveAdapter(): AuthAdapter {
    return this.currentMode === 'mock' ? this.mockAdapter : this.realAdapter;
  }

  /**
   * Get the fallback adapter
   */
  private getFallbackAdapter(): AuthAdapter {
    return this.currentMode === 'mock' ? this.realAdapter : this.mockAdapter;
  }

  /**
   * Execute operation with fallback
   */
  private async executeWithFallback<T>(
    operation: (adapter: AuthAdapter) => Promise<AdapterResult<T>>,
  ): Promise<AdapterResult<T>> {
    try {
      // Try with current adapter
      const result = await operation(this.getActiveAdapter());

      if (result.success) {
        return result;
      }

      // If fallback is enabled and current adapter failed, try fallback
      if (this.fallbackEnabled && this.currentMode !== 'mock') {
        console.warn(`Primary adapter (${this.currentMode}) failed, trying fallback...`);
        const fallbackResult = await operation(this.getFallbackAdapter());

        if (fallbackResult.success) {
          return {
            ...fallbackResult,
            metadata: {
              ...fallbackResult.metadata,
              fallbackUsed: true,
              originalError: result.error,
            },
          };
        }
      }

      return result;

    } catch (error) {
      // Try fallback on exception
      if (this.fallbackEnabled && this.currentMode !== 'mock') {
        console.warn(`Primary adapter (${this.currentMode}) threw exception, trying fallback...`);
        try {
          return await operation(this.getFallbackAdapter());
        } catch (fallbackError) {
          return {
            success: false,
            error: `Both adapters failed: Primary: ${error instanceof Error ? error.message : 'Unknown'}, Fallback: ${fallbackError instanceof Error ? fallbackError.message : 'Unknown'}`,
          };
        }
      }

      return {
        success: false,
        error: `Operation failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  }


  /**
   * Cleanup adapter resources
   */
  async cleanup(): Promise<void> {
    try {
      await this.mockAdapter.cleanup();
      await this.realAdapter.cleanup();
      console.log('HybridAuthAdapter cleaned up');
    } catch (error) {
      console.warn('Failed to cleanup adapters:', error);
    }
  }

  /**
   * Authenticate user with email and password
   */
  async login(email: string, password: string): Promise<AdapterResult<UniversalUser>> {
    return this.executeWithFallback(adapter => adapter.login(email, password));
  }

  /**
   * Register new user
   */
  async register(userData: RegistrationData): Promise<AdapterResult<UniversalUser>> {
    return this.executeWithFallback(adapter => adapter.register(userData));
  }

  /**
   * Logout current user
   */
  async logout(): Promise<AdapterResult<void>> {
    return this.executeWithFallback(adapter => adapter.logout());
  }

  /**
   * Get current authenticated user
   */
  async getCurrentUser(): Promise<AdapterResult<UniversalUser | null>> {
    return this.executeWithFallback(adapter => adapter.getCurrentUser());
  }

  /**
   * Refresh authentication token
   */
  async refreshToken(): Promise<AdapterResult<string>> {
    return this.executeWithFallback(adapter => adapter.refreshToken());
  }

  /**
   * Reset password
   */
  async resetPassword(email: string): Promise<AdapterResult<void>> {
    return this.executeWithFallback(adapter => adapter.resetPassword(email));
  }


  /**
   * Switch authentication mode
   */
  switchMode(mode: 'mock' | 'real'): void {
    if (mode !== this.currentMode) {
      console.log(`Switching authentication mode from ${this.currentMode} to ${mode}`);
      this.currentMode = mode;
    }
  }

  /**
   * Get current mode
   */
  getCurrentMode(): 'mock' | 'real' {
    return this.currentMode;
  }

  /**
   * Enable/disable fallback
   */
  setFallbackEnabled(enabled: boolean): void {
    this.fallbackEnabled = enabled;
    console.log(`Fallback ${enabled ? 'enabled' : 'disabled'}`);
  }

  /**
   * Get fallback status
   */
  isFallbackEnabled(): boolean {
    return this.fallbackEnabled;
  }

  /**
   * Get mock adapter (for testing)
   */
  getMockAdapter(): MockAuthAdapter {
    return this.mockAdapter;
  }

  /**
   * Get real adapter (for testing)
   */
  getRealAdapter(): RealAuthAdapter {
    return this.realAdapter;
  }
}
