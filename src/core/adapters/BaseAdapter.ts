// src/infrastructure/adapters/BaseAdapter.ts
// Abstract base adapter implementation

import type {
  IAdapter,
  AdapterConfig,
  ValidationResult,
  AdapterHealth,
  AdapterCapabilities,
  AdapterMetrics,
} from '../../core/interfaces';
import {
  AdapterError,
  AdapterInitializationError,
  AdapterTransformationError,
  AdapterValidationError,
} from '../../core/interfaces';

/**
 * Abstract base adapter implementation
 * Provides common functionality for all adapters
 */
export abstract class BaseAdapter<TInput, TOutput> implements IAdapter<TInput, TOutput> {
  protected config?: AdapterConfig;
  protected health: AdapterHealth;
  protected metrics: AdapterMetrics;
  protected isInitialized = false;

  constructor(
    public readonly name: string,
    public readonly type: 'mock' | 'real' | 'hybrid',
    public readonly feature: string,
    public readonly priority: number = 1,
    public readonly isActive: boolean = true,
  ) {
    this.health = {
      isHealthy: true,
      lastCheck: new Date(),
      responseTime: 0,
      errorCount: 0,
      uptime: 100,
      status: 'healthy',
      consecutiveFailures: 0,
    };

    this.metrics = {
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
  }

  /**
   * Initialize adapter
   */
  public async initialize(config: AdapterConfig): Promise<void> {
    try {
      this.config = config;
      await this.initializeImpl(config);
      this.isInitialized = true;

      // Update health status
      this.health.isHealthy = true;
      this.health.status = 'healthy';
      this.health.lastCheck = new Date();

      console.log(`Adapter ${this.name} initialized successfully`);
    } catch (error) {
      this.health.isHealthy = false;
      this.health.status = 'unhealthy';
      this.health.consecutiveFailures++;

      throw new AdapterInitializationError(this.name, error as Error);
    }
  }

  /**
   * Transform input data to output format
   */
  public async transform(input: TInput): Promise<TOutput> {
    this.ensureInitialized();

    const startTime = Date.now();

    try {
      // Validate input first
      const validation = await this.validate(input);
      if (!validation.isValid) {
        throw new AdapterValidationError(this.name, validation.errors);
      }

      // Perform transformation
      const result = await this.transformImpl(input);

      // Update metrics
      this.updateMetrics(true, Date.now() - startTime);

      return result;
    } catch (error) {
      this.updateMetrics(false, Date.now() - startTime);

      if (error instanceof AdapterError) {
        throw error;
      }

      throw new AdapterTransformationError(this.name, 'transform', error as Error);
    }
  }

  /**
   * Reverse transform output to input format
   */
  public async reverseTransform(output: TOutput): Promise<TInput> {
    this.ensureInitialized();

    const startTime = Date.now();

    try {
      const result = await this.reverseTransformImpl(output);
      this.updateMetrics(true, Date.now() - startTime);
      return result;
    } catch (error) {
      this.updateMetrics(false, Date.now() - startTime);

      if (error instanceof AdapterError) {
        throw error;
      }

      throw new AdapterTransformationError(this.name, 'reverseTransform', error as Error);
    }
  }

  /**
   * Validate input data
   */
  public async validate(input: TInput): Promise<ValidationResult> {
    this.ensureInitialized();

    try {
      return await this.validateImpl(input);
    } catch (error) {
      return {
        isValid: false,
        errors: [{
          field: 'general',
          message: `Validation error: ${(error as Error).message}`,
          code: 'VALIDATION_ERROR',
          value: input,
        }],
        warnings: [],
      };
    }
  }

  /**
   * Get adapter health status
   */
  public async getHealth(): Promise<AdapterHealth> {
    try {
      await this.performHealthCheck();
      return { ...this.health };
    } catch (_error) {
      this.health.isHealthy = false;
      this.health.status = 'unhealthy';
      this.health.consecutiveFailures++;
      return { ...this.health };
    }
  }

  /**
   * Get adapter capabilities
   */
  public getCapabilities(): AdapterCapabilities {
    return this.getCapabilitiesImpl();
  }

  /**
   * Get adapter metrics
   */
  public async getMetrics(): Promise<AdapterMetrics> {
    // Calculate operations per second
    const now = Date.now();
    const timeSinceLastOp = now - this.metrics.lastOperation.getTime();
    if (timeSinceLastOp > 0) {
      this.metrics.operationsPerSecond = 1000 / timeSinceLastOp;
    }

    return { ...this.metrics };
  }

  /**
   * Cleanup adapter resources
   */
  public async cleanup(): Promise<void> {
    try {
      await this.cleanupImpl();
      this.isInitialized = false;
      console.log(`Adapter ${this.name} cleaned up successfully`);
    } catch (error) {
      console.error(`Error cleaning up adapter ${this.name}:`, error);
    }
  }

  // Abstract methods to be implemented by concrete adapters
  protected abstract initializeImpl(config: AdapterConfig): Promise<void>;
  protected abstract transformImpl(input: TInput): Promise<TOutput>;
  protected abstract reverseTransformImpl(output: TOutput): Promise<TInput>;
  protected abstract validateImpl(input: TInput): Promise<ValidationResult>;
  protected abstract getCapabilitiesImpl(): AdapterCapabilities;
  protected abstract cleanupImpl(): Promise<void>;

  // Optional health check implementation
  protected async performHealthCheck(): Promise<void> {
    // Default implementation - just update timestamp
    this.health.lastCheck = new Date();
    this.health.responseTime = Math.random() * 100; // Simulate response time
  }

  // Helper methods
  protected ensureInitialized(): void {
    if (!this.isInitialized) {
      throw new AdapterError(
        `Adapter ${this.name} is not initialized`,
        'NOT_INITIALIZED',
        this.name,
        'general',
      );
    }
  }

  /**
   * Update adapter metrics
   */
  protected updateMetrics(success: boolean, duration: number): void {
    this.metrics.totalOperations++;
    this.metrics.lastOperation = new Date();

    if (success) {
      this.metrics.successfulOperations++;
    } else {
      this.metrics.failedOperations++;
    }

    // Update response time metrics
    this.metrics.averageResponseTime =
      (this.metrics.averageResponseTime + duration) / 2;
    this.metrics.minResponseTime = Math.min(this.metrics.minResponseTime, duration);
    this.metrics.maxResponseTime = Math.max(this.metrics.maxResponseTime, duration);

    // Update error rate
    this.metrics.errorRate = this.metrics.failedOperations / this.metrics.totalOperations;
  }

  /**
   * Get configuration value
   */
  protected getConfigValue<K extends keyof AdapterConfig>(
    key: K,
  ): AdapterConfig[K] {
    if (!this.config) {
      throw new AdapterError(
        `Adapter ${this.name} configuration not available`,
        'CONFIG_NOT_AVAILABLE',
        this.name,
        'getConfig',
      );
    }

    return this.config[key];
  }

  /**
   * Check if feature is enabled
   */
  protected isFeatureEnabled(feature: string): boolean {
    const featureConfig = this.getConfigValue('featureConfig') as Record<string, boolean> | undefined;
    return featureConfig?.[feature] ?? true;
  }

  /**
   * Log adapter operation
   */
  protected logOperation(operation: string, data?: unknown): void {
    if (this.getConfigValue('featureConfig')?.enableDebugLogging) {
      console.log(`[${this.name}] ${operation}:`, data);
    }
  }

  /**
   * Log adapter error
   */
  protected logError(operation: string, error: Error): void {
    console.error(`[${this.name}] Error in ${operation}:`, error);
    this.health.errorCount++;
  }
}
