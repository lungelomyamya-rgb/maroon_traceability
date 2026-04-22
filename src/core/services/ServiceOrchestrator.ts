// src/core/services/ServiceOrchestrator.ts
// Service orchestration for hybrid data architecture

import type {
  ServiceHealth,
} from '../interfaces/IHybridService';
import type {
  IService,
} from '../interfaces/services';

/**
 * Service orchestrator
 * Manages service lifecycle and dependencies
 */
export class ServiceOrchestrator implements IService {
  readonly name = 'ServiceOrchestrator';
  readonly version = '1.0.0';
  private services = new Map<string, IService & {
    initialize?: () => Promise<void>;
    cleanup?: () => Promise<void>;
    shutdown?: () => Promise<void>;
    getHealth?: () => Promise<Record<string, ServiceHealth>>;
  }>();
  private serviceStatus = new Map<string, 'running' | 'stopped' | 'error'>();
  private dependencies = new Map<string, string[]>();
  private initializationOrder: string[] = [];

  /**
   * Initialize all services
   */
  async initialize(): Promise<void> {
    console.log('Initializing Service Orchestrator...');

    // Calculate initialization order based on dependencies
    this.calculateInitializationOrder();

    // Initialize services in order
    for (const serviceName of this.initializationOrder) {
      await this.initializeService(serviceName);
    }

    console.log('Service Orchestrator initialized successfully');
  }

  /**
   * Shutdown all services
   */
  async shutdown(): Promise<void> {
    console.log('Shutting down Service Orchestrator...');

    // Shutdown in reverse order
    const reverseOrder = [...this.initializationOrder].reverse();

    for (const serviceName of reverseOrder) {
      await this.shutdownService(serviceName);
    }

    console.log('Service Orchestrator shutdown complete');
  }

  /**
   * Get service status
   */
  getStatus(): Record<string, 'running' | 'stopped' | 'error'> {
    const status: Record<string, 'running' | 'stopped' | 'error'> = {};
    for (const [name, serviceStatus] of this.serviceStatus) {
      status[name] = serviceStatus;
    }
    return status;
  }

  /**
   * Register service
   */
  registerService(name: string, service: IService): void {
    if (this.services.has(name)) {
      console.warn(`Service ${name} is already registered. Overwriting...`);
    }

    this.services.set(name, service);
    this.serviceStatus.set(name, 'stopped');
    console.log(`Registered service: ${name}`);
  }

  /**
   * Register service dependency
   */
  registerDependency(serviceName: string, dependsOn: string[]): void {
    this.dependencies.set(serviceName, dependsOn);
    console.log(`Registered dependencies for ${serviceName}:`, dependsOn);
  }

  /**
   * Get service
   */
  getService<T = IService>(name: string): T | undefined {
    const service = this.services.get(name);
    if (!service) {
      console.warn(`Service ${name} not found`);
      return undefined;
    }

    const status = this.serviceStatus.get(name);
    if (status !== 'running') {
      console.warn(`Service ${name} is not running (status: ${status})`);
    }

    return service as T;
  }

  /**
   * Initialize specific service
   */
  async initializeService(name: string): Promise<void> {
    const service = this.services.get(name);
    if (!service) {
      throw new Error(`Service ${name} not found`);
    }

    const status = this.serviceStatus.get(name);
    if (status === 'running') {
      console.log(`Service ${name} is already running`);
      return;
    }

    try {
      console.log(`Initializing service: ${name}`);

      // Check dependencies
      const deps = this.dependencies.get(name) || [];
      for (const dep of deps) {
        const depStatus = this.serviceStatus.get(dep);
        if (depStatus !== 'running') {
          throw new Error(`Dependency ${dep} is not running for service ${name}`);
        }
      }

      // Initialize service if it has initialize method
      if (service.initialize) {
        await service.initialize();
      }

      this.serviceStatus.set(name, 'running');
      console.log(`Service ${name} initialized successfully`);
    } catch (error) {
      this.serviceStatus.set(name, 'error');
      console.error(`Failed to initialize service ${name}:`, error);
      throw error;
    }
  }

  /**
   * Shutdown specific service
   */
  async shutdownService(name: string): Promise<void> {
    const service = this.services.get(name);
    if (!service) {
      console.warn(`Service ${name} not found for shutdown`);
      return;
    }

    const status = this.serviceStatus.get(name);
    if (status === 'stopped') {
      console.log(`Service ${name} is already stopped`);
      return;
    }

    try {
      console.log(`Shutting down service: ${name}`);

      // Check if other services depend on this one
      const dependents = this.getDependents(name);
      if (dependents.length > 0) {
        console.warn(`Services depend on ${name}:`, dependents);
      }

      // Shutdown service if it has cleanup method
      if (service.cleanup) {
        await service.cleanup();
      } else if (service.shutdown) {
        await service.shutdown();
      }

      this.serviceStatus.set(name, 'stopped');
      console.log(`Service ${name} shutdown successfully`);
    } catch (error) {
      this.serviceStatus.set(name, 'error');
      console.error(`Failed to shutdown service ${name}:`, error);
      throw error;
    }
  }

  /**
   * Restart service
   */
  async restartService(name: string): Promise<void> {
    console.log(`Restarting service: ${name}`);
    await this.shutdownService(name);
    await this.initializeService(name);
    console.log(`Service ${name} restarted successfully`);
  }

  /**
   * Get service health
   */
  async getServiceHealth(name: string): Promise<{
    status: string;
    message?: string;
    responseTime?: number;
    successRate?: number;
    uptime?: number;
  }> {
    const service = this.services.get(name);
    if (!service) {
      return { status: 'not_found', message: `Service ${name} not found` };
    }

    const serviceStatus = this.serviceStatus.get(name);

    // If service has health check method
    if (service.getHealth) {
      try {
        const healthRecord = await service.getHealth();
        // Get the first health entry or use a default
        const healthKey = Object.keys(healthRecord)[0];
        const health = healthKey ? healthRecord[healthKey] : {
          isHealthy: false,
          overallStatus: 'unknown' as const,
          lastCheck: new Date(),
          responseTime: 0,
          uptime: 0,
          mode: 'mock' as const,
          activeAdapter: 'unknown',
          adapters: {},
          errors: [],
          warnings: [],
        };

        return {
          status: serviceStatus || 'unknown',
          message: health.isHealthy ? 'Service is healthy' : 'Service is unhealthy',
          responseTime: Number(health.responseTime) || 0,
          successRate: Number(health.uptime) || 0,
          uptime: Number(health.uptime) || 0,
        };
      } catch (error) {
        return {
          status: 'error',
          message: error instanceof Error ? error.message : 'Unknown error occurred',
        };
      }
    }

    return {
      status: serviceStatus || 'unknown',
      message: 'Health check not available',
    };
  }

  /**
   * Get all services health
   */
  async getAllServicesHealth(): Promise<Record<string, {
    status: string;
    message?: string;
    responseTime?: number;
    successRate?: number;
    uptime?: number;
  }>> {
    const health: Record<string, {
      status: string;
      message?: string;
      responseTime?: number;
      successRate?: number;
      uptime?: number;
    }> = {};

    for (const name of this.services.keys()) {
      health[name] = await this.getServiceHealth(name);
    }

    return health;
  }

  /**
   * Calculate initialization order based on dependencies
   */
  private calculateInitializationOrder(): void {
    const visited = new Set<string>();
    const visiting = new Set<string>();
    const order: string[] = [];

    const visit = (serviceName: string): void => {
      if (visiting.has(serviceName)) {
        throw new Error(`Circular dependency detected involving ${serviceName}`);
      }

      if (visited.has(serviceName)) {
        return;
      }

      visiting.add(serviceName);

      const deps = this.dependencies.get(serviceName) || [];
      for (const dep of deps) {
        visit(dep);
      }

      visiting.delete(serviceName);
      visited.add(serviceName);
      order.push(serviceName);
    };

    for (const serviceName of this.services.keys()) {
      visit(serviceName);
    }

    this.initializationOrder = order;
    console.log('Service initialization order:', order);
  }

  /**
   * Get services that depend on a given service
   */
  private getDependents(serviceName: string): string[] {
    const dependents: string[] = [];

    for (const [name, deps] of this.dependencies) {
      if (deps.includes(serviceName)) {
        dependents.push(name);
      }
    }

    return dependents;
  }

  /**
   * Get service information
   */
  getServiceInfo(): Record<string, {
    status: 'running' | 'stopped' | 'error';
    dependencies: string[];
    dependents: string[];
    hasInitialize: boolean;
    hasCleanup: boolean;
    hasShutdown: boolean;
    hasGetHealth: boolean;
  }> {
    const info: Record<string, {
      status: 'running' | 'stopped' | 'error';
      dependencies: string[];
      dependents: string[];
      hasInitialize: boolean;
      hasCleanup: boolean;
      hasShutdown: boolean;
      hasGetHealth: boolean;
    }> = {};

    for (const [name, service] of this.services) {
      info[name] = {
        status: this.serviceStatus.get(name) || 'stopped',
        dependencies: this.dependencies.get(name) || [],
        dependents: this.getDependents(name),
        hasInitialize: !!service.initialize,
        hasCleanup: !!service.cleanup,
        hasShutdown: !!service.shutdown,
        hasGetHealth: !!service.getHealth,
      };
    }

    return info;
  }
}

// Global service orchestrator instance
export const serviceOrchestrator = new ServiceOrchestrator();
