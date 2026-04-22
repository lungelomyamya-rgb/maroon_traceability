// src/core/registry/AdapterRegistry.ts
// Central adapter management and registration system

import type {
  IAdapter,
  IHybridAdapter,
  AdapterConfig,
  AdapterHealth,
  AdapterMetrics,
  FallbackRule,
} from '../interfaces';
import type { IService } from '../interfaces/services';

/**
 * Adapter registry for managing all adapters in the system
 * Provides centralized adapter discovery, health monitoring, and lifecycle management
 */
export class AdapterRegistry implements IService {
  readonly name = 'AdapterRegistry';
  readonly version = '1.0.0';
  private static instance: AdapterRegistry;
  private adapters: Map<string, IAdapter<unknown, unknown>> = new Map();
  private hybridAdapters: Map<string, IHybridAdapter<unknown, unknown>> = new Map();
  private healthStatus: Map<string, AdapterHealth> = new Map();
  private metrics: Map<string, AdapterMetrics> = new Map();
  private healthCheckInterval?: NodeJS.Timeout;

  private constructor() {
    this.startHealthMonitoring();
  }

  /**
   * Get singleton instance
   */
  public static getInstance(): AdapterRegistry {
    if (!AdapterRegistry.instance) {
      AdapterRegistry.instance = new AdapterRegistry();
    }
    return AdapterRegistry.instance;
  }

  /**
   * Register an adapter
   * @param adapter - Adapter to register
   * @param config - Adapter configuration
   */
  public async registerAdapter<TInput, TOutput>(
    adapter: IAdapter<TInput, TOutput>,
    config: AdapterConfig,
  ): Promise<void> {
    try {
      await adapter.initialize(config);

      this.adapters.set(config.name, adapter);

      if (adapter.type === 'hybrid') {
        this.hybridAdapters.set(config.name, adapter as IHybridAdapter<TInput, TOutput>);
      }

      // Initialize health status
      this.healthStatus.set(config.name, {
        isHealthy: true,
        lastCheck: new Date(),
        responseTime: 0,
        errorCount: 0,
        uptime: 100,
        status: 'healthy',
        consecutiveFailures: 0,
      });

      // Initialize metrics
      this.metrics.set(config.name, {
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
      });

      console.log(`Adapter registered: ${config.name} (${adapter.type})`);
    } catch (error) {
      throw new AdapterRegistrationError(
        config.name,
        error as Error,
      );
    }
  }

  /**
   * Get adapter by name
   * @param name - Adapter name
   * @returns Adapter instance or null if not found
   */
  public getAdapter<TInput, TOutput>(name: string): IAdapter<TInput, TOutput> | null {
    return this.adapters.get(name) as IAdapter<TInput, TOutput> || null;
  }

  /**
   * Get hybrid adapter by name
   * @param name - Hybrid adapter name
   * @returns Hybrid adapter instance or null if not found
   */
  public getHybridAdapter<TInput, TOutput>(name: string): IHybridAdapter<TInput, TOutput> | null {
    return this.hybridAdapters.get(name) as IHybridAdapter<TInput, TOutput> || null;
  }

  /**
   * Get all adapters for a feature
   * @param feature - Feature name
   * @returns Array of adapters for the feature
   */
  public getAdaptersByFeature(feature: string): IAdapter<unknown, unknown>[] {
    const adapters: IAdapter<unknown, unknown>[] = [];

    for (const [_name, adapter] of this.adapters) {
      if (adapter.feature === feature) {
        adapters.push(adapter);
      }
    }

    return adapters.sort((a, b) => a.priority - b.priority);
  }

  /**
   * Get active adapter for a feature
   * @param feature - Feature name
   * @param mode - Preferred mode (mock, real, hybrid)
   * @returns Active adapter or null
   */
  public getActiveAdapter(feature: string, mode?: 'mock' | 'real' | 'hybrid'): IAdapter<unknown, unknown> | null {
    const adapters = this.getAdaptersByFeature(feature);

    if (mode) {
      const modeAdapter = adapters.find(adapter => adapter.type === mode);
      if (modeAdapter && modeAdapter.isActive) {
        return modeAdapter;
      }
    }

    // Return first active adapter (highest priority)
    return adapters.find(adapter => adapter.isActive) || null;
  }

  /**
   * Unregister an adapter
   * @param name - Adapter name
   */
  public async unregisterAdapter(name: string): Promise<void> {
    const adapter = this.adapters.get(name);
    if (adapter) {
      try {
        await adapter.cleanup();
        this.adapters.delete(name);
        this.hybridAdapters.delete(name);
        this.healthStatus.delete(name);
        this.metrics.delete(name);
        console.log(`Adapter unregistered: ${name}`);
      } catch (error) {
        console.error(`Error unregistering adapter ${name}:`, error);
      }
    }
  }

  /**
   * Get adapter health status
   * @param name - Adapter name
   * @returns Health status or null if not found
   */
  public getAdapterHealth(name: string): AdapterHealth | null {
    return this.healthStatus.get(name) || null;
  }

  /**
   * Get all adapter health statuses
   * @returns Map of adapter names to health statuses
   */
  public getAllAdapterHealth(): Map<string, AdapterHealth> {
    return new Map(this.healthStatus);
  }

  /**
   * Get adapter metrics
   * @param name - Adapter name
   * @returns Metrics or null if not found
   */
  public getAdapterMetrics(name: string): AdapterMetrics | null {
    return this.metrics.get(name) || null;
  }

  /**
   * Get all adapter metrics
   * @returns Map of adapter names to metrics
   */
  public getAllAdapterMetrics(): Map<string, AdapterMetrics> {
    return new Map(this.metrics);
  }

  /**
   * Switch hybrid adapter mode
   * @param name - Hybrid adapter name
   * @param mode - New mode
   */
  public async switchHybridAdapterMode(name: string, mode: 'primary' | 'fallback' | 'hybrid'): Promise<void> {
    const hybridAdapter = this.hybridAdapters.get(name);
    if (!hybridAdapter) {
      throw new AdapterNotFoundError(name, 'hybrid');
    }

    try {
      await hybridAdapter.switchToAdapter(mode);
      console.log(`Hybrid adapter ${name} switched to ${mode} mode`);
    } catch (error) {
      throw new AdapterModeSwitchError(name, mode, error as Error);
    }
  }

  /**
   * Configure fallback rules for hybrid adapter
   * @param name - Hybrid adapter name
   * @param rules - Fallback rules
   */
  public configureFallbackRules(name: string, rules: FallbackRule[]): void {
    const hybridAdapter = this.hybridAdapters.get(name);
    if (!hybridAdapter) {
      throw new AdapterNotFoundError(name, 'hybrid');
    }

    hybridAdapter.configureFallbackRules(rules);
    console.log(`Fallback rules configured for hybrid adapter: ${name}`);
  }

  /**
   * Get registry statistics
   * @returns Registry statistics
   */
  public getRegistryStats(): RegistryStats {
    const totalAdapters = this.adapters.size;
    const hybridAdapters = this.hybridAdapters.size;
    const healthyAdapters = Array.from(this.healthStatus.values())
      .filter(health => health.isHealthy).length;
    const unhealthyAdapters = totalAdapters - healthyAdapters;

    return {
      totalAdapters,
      hybridAdapters,
      healthyAdapters,
      unhealthyAdapters,
      healthCheckInterval: this.healthCheckInterval ? 30000 : 0, // 30 seconds
      lastHealthCheck: new Date(),
    };
  }

  /**
   * Perform health check on all adapters
   */
  public async performHealthCheck(): Promise<void> {
    const healthPromises = Array.from(this.adapters.entries()).map(
      async ([name, adapter]) => {
        try {
          const health = await adapter.getHealth();
          this.healthStatus.set(name, health);

          // Update metrics
          const metrics = this.metrics.get(name);
          if (metrics) {
            metrics.totalOperations++;
            if (health.isHealthy) {
              metrics.successfulOperations++;
            } else {
              metrics.failedOperations++;
            }
            metrics.averageResponseTime =
              (metrics.averageResponseTime + health.responseTime) / 2;
            metrics.lastOperation = new Date();
            metrics.errorRate = metrics.failedOperations / metrics.totalOperations;
          }
        } catch (error) {
          // Mark as unhealthy if health check fails
          const currentHealth = this.healthStatus.get(name);
          if (currentHealth) {
            this.healthStatus.set(name, {
              ...currentHealth,
              isHealthy: false,
              status: 'unhealthy',
              lastError: (error as Error).message,
              consecutiveFailures: currentHealth.consecutiveFailures + 1,
              lastCheck: new Date(),
            });
          }
        }
      },
    );

    await Promise.all(healthPromises);
  }

  /**
   * Start health monitoring
   */
  private startHealthMonitoring(): void {
    this.healthCheckInterval = setInterval(
      () => this.performHealthCheck(),
      30000, // 30 seconds
    );
  }

  /**
   * Stop health monitoring
   */
  public stopHealthMonitoring(): void {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
      this.healthCheckInterval = undefined;
    }
  }

  /**
   * Cleanup registry
   */
  public async cleanup(): Promise<void> {
    this.stopHealthMonitoring();

    const cleanupPromises = Array.from(this.adapters.entries()).map(
      async ([name, adapter]) => {
        try {
          await adapter.cleanup();
        } catch (error) {
          console.error(`Error cleaning up adapter ${name}:`, error);
        }
      },
    );

    await Promise.all(cleanupPromises);

    this.adapters.clear();
    this.hybridAdapters.clear();
    this.healthStatus.clear();
    this.metrics.clear();
  }
}

/**
 * Registry statistics
 */
export interface RegistryStats {
  totalAdapters: number;
  hybridAdapters: number;
  healthyAdapters: number;
  unhealthyAdapters: number;
  healthCheckInterval: number;
  lastHealthCheck: Date;
}

/**
 * Adapter registration error
 */
export class AdapterRegistrationError extends Error {
  constructor(
    public readonly adapterName: string,
    public readonly cause: Error,
  ) {
    super(`Failed to register adapter ${adapterName}: ${cause.message}`);
    this.name = 'AdapterRegistrationError';
  }
}

/**
 * Adapter not found error
 */
export class AdapterNotFoundError extends Error {
  constructor(
    public readonly adapterName: string,
    public readonly type?: string,
  ) {
    super(`Adapter ${adapterName}${type ? ` (${type})` : ''} not found`);
    this.name = 'AdapterNotFoundError';
  }
}

/**
 * Adapter mode switch error
 */
export class AdapterModeSwitchError extends Error {
  constructor(
    public readonly adapterName: string,
    public readonly targetMode: string,
    public readonly cause: Error,
  ) {
    super(`Failed to switch adapter ${adapterName} to ${targetMode}: ${cause.message}`);
    this.name = 'AdapterModeSwitchError';
  }
}

// Export singleton instance
export const adapterRegistry = AdapterRegistry.getInstance();
