// src/core/registry/ServiceRegistry.ts
// Central service management and discovery system

import type {
  IHybridService,
  HybridServiceConfig,
  ServiceCapabilities,
  ServiceHealth,
  ModeSwitchOptions,
  ModeSwitchResult,
  ServiceMetrics,
} from '../interfaces';

/**
 * Service registry for managing all hybrid services in the system
 * Provides centralized service discovery, health monitoring, and lifecycle management
 */
export class ServiceRegistry {
  private static instance: ServiceRegistry;
  private services: Map<string, IHybridService> = new Map();
  private configs: Map<string, HybridServiceConfig> = new Map();
  private healthStatus: Map<string, ServiceHealth> = new Map();
  private metrics: Map<string, ServiceMetrics> = new Map();
  private healthCheckInterval?: NodeJS.Timeout;

  private constructor() {
    this.startHealthMonitoring();
  }

  /**
   * Get singleton instance
   */
  public static getInstance(): ServiceRegistry {
    if (!ServiceRegistry.instance) {
      ServiceRegistry.instance = new ServiceRegistry();
    }
    return ServiceRegistry.instance;
  }

  /**
   * Register a service
   * @param service - Service to register
   * @param config - Service configuration
   */
  public async registerService(
    service: IHybridService,
    config: HybridServiceConfig,
  ): Promise<void> {
    try {
      await service.initialize(config);

      this.services.set(config.name, service);
      this.configs.set(config.name, config);

      // Initialize health status
      this.healthStatus.set(config.name, {
        isHealthy: true,
        overallStatus: 'healthy',
        lastCheck: new Date(),
        responseTime: 0,
        uptime: 100,
        mode: config.defaultMode,
        activeAdapter: `${config.name}-${config.defaultMode}`,
        adapters: {},
        errors: [],
        warnings: [],
      });

      // Initialize metrics
      this.metrics.set(config.name, {
        totalOperations: 0,
        operationsByMode: {
          mock: 0,
          real: 0,
          hybrid: 0,
        },
        successfulOperations: 0,
        failedOperations: 0,
        averageResponseTime: 0,
        operationsPerSecond: 0,
        errorRate: 0,
        uptime: 100,
        lastOperation: new Date(),
        modeSwitches: 0,
        fallbackActivations: 0,
      });

      console.log(`Service registered: ${config.name} (${config.defaultMode})`);
    } catch (error) {
      throw new ServiceRegistrationError(
        config.name,
        error as Error,
      );
    }
  }

  /**
   * Get service by name
   * @param name - Service name
   * @returns Service instance or null if not found
   */
  public getService(name: string): IHybridService | null {
    return this.services.get(name) || null;
  }

  /**
   * Get all services for a feature
   * @param feature - Feature name
   * @returns Array of services for the feature
   */
  public getServicesByFeature(feature: string): IHybridService[] {
    const services: IHybridService[] = [];

    for (const [name, config] of this.configs) {
      if (config.feature === feature) {
        const service = this.services.get(name);
        if (service) {
          services.push(service);
        }
      }
    }

    return services;
  }

  /**
   * Get active service for a feature
   * @param feature - Feature name
   * @returns Active service or null
   */
  public getActiveService(feature: string): IHybridService | null {
    const services = this.getServicesByFeature(feature);

    // Return first service (typically there should be one per feature)
    return services[0] || null;
  }

  /**
   * Unregister a service
   * @param name - Service name
   */
  public async unregisterService(name: string): Promise<void> {
    const service = this.services.get(name);
    if (service) {
      try {
        await service.cleanup();
        this.services.delete(name);
        this.configs.delete(name);
        this.healthStatus.delete(name);
        this.metrics.delete(name);
        console.log(`Service unregistered: ${name}`);
      } catch (error) {
        console.error(`Error unregistering service ${name}:`, error);
      }
    }
  }

  /**
   * Get service health status
   * @param name - Service name
   * @returns Health status or null if not found
   */
  public getServiceHealth(name: string): ServiceHealth | null {
    return this.healthStatus.get(name) || null;
  }

  /**
   * Get all service health statuses
   * @returns Map of service names to health statuses
   */
  public getAllServiceHealth(): Map<string, ServiceHealth> {
    return new Map(this.healthStatus);
  }

  /**
   * Get service metrics
   * @param name - Service name
   * @returns Metrics or null if not found
   */
  public getServiceMetrics(name: string): ServiceMetrics | null {
    return this.metrics.get(name) || null;
  }

  /**
   * Get all service metrics
   * @returns Map of service names to metrics
   */
  public getAllServiceMetrics(): Map<string, ServiceMetrics> {
    return new Map(this.metrics);
  }

  /**
   * Switch service mode
   * @param name - Service name
   * @param mode - New mode
   * @param options - Switch options
   * @returns Switch result
   */
  public async switchServiceMode(
    name: string,
    mode: 'mock' | 'real' | 'hybrid',
    options?: ModeSwitchOptions,
  ): Promise<ModeSwitchResult> {
    const service = this.services.get(name);
    if (!service) {
      throw new ServiceNotFoundError(name);
    }

    try {
      const result = await service.switchMode(mode, options);

      // Update health status
      const health = this.healthStatus.get(name);
      if (health) {
        health.mode = mode;
        health.lastCheck = new Date();
      }

      // Update metrics
      const metrics = this.metrics.get(name);
      if (metrics) {
        metrics.modeSwitches++;
      }

      console.log(`Service ${name} switched to ${mode} mode`);
      return result;
    } catch (error) {
      throw new ServiceModeSwitchError(name, mode, error as Error);
    }
  }

  /**
   * Execute operation on service
   * @param serviceName - Service name
   * @param operation - Operation to execute
   * @param params - Operation parameters
   * @returns Operation result
   */
  public async executeOperation<T>(
    serviceName: string,
    operation: string,
    params?: Record<string, unknown>,
  ): Promise<T> {
    const service = this.services.get(serviceName);
    if (!service) {
      throw new ServiceNotFoundError(serviceName);
    }

    try {
      const startTime = Date.now();
      const result = await service.execute<T>(operation, params);
      const duration = Date.now() - startTime;

      // Update metrics
      this.updateServiceMetrics(serviceName, true, duration);

      return result;
    } catch (error) {
      this.updateServiceMetrics(serviceName, false, 0);
      throw error;
    }
  }

  /**
   * Execute operation with specific mode
   * @param serviceName - Service name
   * @param operation - Operation to execute
   * @param mode - Mode to use
   * @param params - Operation parameters
   * @returns Operation result
   */
  public async executeOperationWithMode<T>(
    serviceName: string,
    operation: string,
    mode: 'mock' | 'real' | 'hybrid',
    params?: unknown,
  ): Promise<T> {
    const service = this.services.get(serviceName);
    if (!service) {
      throw new ServiceNotFoundError(serviceName);
    }

    try {
      const startTime = Date.now();
      const result = await service.executeWithMode<T>(operation, mode, params as Record<string, unknown>) as T;
      const duration = Date.now() - startTime;

      // Update metrics
      this.updateServiceMetrics(serviceName, true, duration);

      return result;
    } catch (error) {
      this.updateServiceMetrics(serviceName, false, 0);
      throw error;
    }
  }

  /**
   * Get available operations for service
   * @param serviceName - Service name
   * @returns Array of operation names
   */
  public getAvailableOperations(serviceName: string): string[] {
    const service = this.services.get(serviceName);
    if (!service) {
      throw new ServiceNotFoundError(serviceName);
    }

    return service.getAvailableOperations();
  }

  /**
   * Get service capabilities
   * @param serviceName - Service name
   * @returns Service capabilities
   */
  public getServiceCapabilities(serviceName: string): ServiceCapabilities | null {
    const service = this.services.get(serviceName);
    return service?.capabilities || null;
  }

  /**
   * Get registry statistics
   * @returns Registry statistics
   */
  public getRegistryStats(): ServiceRegistryStats {
    const totalServices = this.services.size;
    const healthyServices = Array.from(this.healthStatus.values())
      .filter(health => health.isHealthy).length;
    const unhealthyServices = totalServices - healthyServices;

    const modeDistribution = {
      mock: 0,
      real: 0,
      hybrid: 0,
    };

    for (const service of this.services.values()) {
      modeDistribution[service.mode]++;
    }

    return {
      totalServices,
      healthyServices,
      unhealthyServices,
      modeDistribution,
      healthCheckInterval: this.healthCheckInterval ? 30000 : 0, // 30 seconds
      lastHealthCheck: new Date(),
    };
  }

  /**
   * Perform health check on all services
   */
  public async performHealthCheck(): Promise<void> {
    const healthPromises = Array.from(this.services.entries()).map(
      async ([name, service]) => {
        try {
          const health = await service.getHealth();
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
              overallStatus: 'unhealthy',
              lastCheck: new Date(),
              errors: [
                ...currentHealth.errors,
                {
                  timestamp: new Date(),
                  code: 'HEALTH_CHECK_FAILED',
                  message: (error as Error).message,
                  severity: 'high',
                  resolved: false,
                },
              ],
            });
          }
        }
      },
    );

    await Promise.all(healthPromises);
  }

  /**
   * Update service metrics
   */
  private updateServiceMetrics(serviceName: string, success: boolean, duration: number): void {
    const metrics = this.metrics.get(serviceName);
    if (metrics) {
      metrics.totalOperations++;
      if (success) {
        metrics.successfulOperations++;
      } else {
        metrics.failedOperations++;
      }

      metrics.averageResponseTime = (metrics.averageResponseTime + duration) / 2;
      metrics.lastOperation = new Date();
      metrics.errorRate = metrics.failedOperations / metrics.totalOperations;
    }
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

    const cleanupPromises = Array.from(this.services.entries()).map(
      async ([name, service]) => {
        try {
          await service.cleanup();
        } catch (error) {
          console.error(`Error cleaning up service ${name}:`, error);
        }
      },
    );

    await Promise.all(cleanupPromises);

    this.services.clear();
    this.configs.clear();
    this.healthStatus.clear();
    this.metrics.clear();
  }
}

/**
 * Service registry statistics
 */
export interface ServiceRegistryStats {
  totalServices: number;
  healthyServices: number;
  unhealthyServices: number;
  modeDistribution: {
    mock: number;
    real: number;
    hybrid: number;
  };
  healthCheckInterval: number;
  lastHealthCheck: Date;
}

/**
 * Service registration error
 */
export class ServiceRegistrationError extends Error {
  constructor(
    public readonly serviceName: string,
    public readonly cause: Error,
  ) {
    super(`Failed to register service ${serviceName}: ${cause.message}`);
    this.name = 'ServiceRegistrationError';
  }
}

/**
 * Service not found error
 */
export class ServiceNotFoundError extends Error {
  constructor(public readonly serviceName: string) {
    super(`Service ${serviceName} not found`);
    this.name = 'ServiceNotFoundError';
  }
}

/**
 * Service mode switch error
 */
export class ServiceModeSwitchError extends Error {
  constructor(
    public readonly serviceName: string,
    public readonly targetMode: string,
    public readonly cause: Error,
  ) {
    super(`Failed to switch service ${serviceName} to ${targetMode}: ${cause.message}`);
    this.name = 'ServiceModeSwitchError';
  }
}

// Export singleton instance
export const serviceRegistry = ServiceRegistry.getInstance();
