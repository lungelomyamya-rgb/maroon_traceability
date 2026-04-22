// src/core/services/HealthMonitor.ts
// Health monitoring for adapters and services

import { BaseAdapter } from '../adapters';
import type {
  AdapterHealth,
  AdapterMetrics,
} from '../interfaces';
import type { IService } from '../interfaces/services';

// Define interfaces that aren't exported
interface IHealthMonitor {
  start(): void;
  stop(): void;
  registerAdapter(adapterId: string, adapter: BaseAdapter<unknown, unknown>, config?: { checkInterval?: number }): void;
  unregisterAdapter(adapterId: string): void;
  checkHealth(adapterId: string): Promise<AdapterHealth>;
  getAllHealth(): Record<string, AdapterHealth>;
  getMetrics(adapterId: string): AdapterMetrics | undefined;
  getAllMetrics(): Record<string, AdapterMetrics>;
  getSystemHealth(): {
    systemHealth: string;
    activeFeatures: string[];
    totalAdapters: number;
    healthyAdapters: number;
    currentMode: string;
    lastHealthCheck: Date;
    metrics: {
      totalOperations: number;
      averageResponseTime: number;
      errorRate: number;
      uptime: number;
    };
  };
  recordSuccess(adapterId: string, responseTime: number): void;
  recordFailure(adapterId: string, error: Error, responseTime: number): void;
  onHealthChange(callback: (adapterId: string, health: AdapterHealth) => void): () => void;
}

interface HybridSystemStatus {
  systemHealth: string;
  activeFeatures: string[];
  totalAdapters: number;
  healthyAdapters: number;
  currentMode: string;
  lastHealthCheck: Date;
  metrics: {
    totalOperations: number;
    averageResponseTime: number;
    errorRate: number;
    uptime: number;
  };
}

/**
 * Health monitor for adapters and services
 * Tracks performance, availability, and system health
 */
export class HealthMonitor implements IHealthMonitor, IService {
  readonly name = 'HealthMonitor';
  readonly version = '1.0.0';
  private healthStatus = new Map<string, AdapterHealth>();
  private metrics = new Map<string, AdapterMetrics>();
  private eventListeners = new Map<string, Set<Function>>();
  private healthCheckInterval?: NodeJS.Timeout;
  private isRunning = false;
  private config: {
    checkInterval: number;
    unhealthyThreshold: number;
    metricsRetentionPeriod: number;
  };

  constructor(config = {}) {
    this.config = {
      checkInterval: 30000, // 30 seconds
      unhealthyThreshold: 3, // 3 consecutive failures
      metricsRetentionPeriod: 3600000, // 1 hour
      ...config,
    };
  }

  /**
   * Start health monitoring
   */
  start(): void {
    if (this.isRunning) {
      console.log('Health monitor is already running');
      return;
    }

    console.log('Starting health monitor...');
    this.isRunning = true;

    this.healthCheckInterval = setInterval(() => {
      this.performHealthChecks();
    }, this.config.checkInterval);

    console.log('Health monitor started');
  }

  /**
   * Stop health monitoring
   */
  stop(): void {
    if (!this.isRunning) {
      console.log('Health monitor is not running');
      return;
    }

    console.log('Stopping health monitor...');
    this.isRunning = false;

    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
      this.healthCheckInterval = undefined;
    }

    console.log('Health monitor stopped');
  }

  /**
   * Register adapter for monitoring
   */
  registerAdapter(
    adapterId: string,
    _adapter: BaseAdapter<unknown, unknown>,
    _config?: { checkInterval?: number },
  ): void {
    // Initialize health status
    const health: AdapterHealth = {
      isHealthy: false,
      lastCheck: new Date(),
      responseTime: 0,
      errorCount: 0,
      uptime: 0,
      status: 'unknown',
      consecutiveFailures: 0,
    };

    this.healthStatus.set(adapterId, health);

    // Initialize metrics
    const metrics: AdapterMetrics = {
      totalOperations: 0,
      successfulOperations: 0,
      failedOperations: 0,
      averageResponseTime: 0,
      minResponseTime: 0,
      maxResponseTime: 0,
      lastOperation: new Date(),
      operationsPerSecond: 0,
      errorRate: 0,
      cacheHitRate: 0,
    };

    this.metrics.set(adapterId, metrics);

    console.log(`Registered adapter for health monitoring: ${adapterId}`);
  }

  /**
   * Unregister adapter
   */
  unregisterAdapter(adapterId: string): void {
    this.healthStatus.delete(adapterId);
    this.metrics.delete(adapterId);
    console.log(`Unregistered adapter from health monitoring: ${adapterId}`);
  }

  /**
   * Check adapter health
   */
  async checkHealth(adapterId: string): Promise<AdapterHealth> {
    const currentHealth = this.healthStatus.get(adapterId);
    if (!currentHealth) {
      throw new Error(`Adapter ${adapterId} not registered for health monitoring`);
    }

    const startTime = Date.now();
    let health: AdapterHealth = { ...currentHealth };

    try {
      // Perform health check based on adapter capabilities
      health = await this.performAdapterHealthCheck(adapterId);
    } catch (error) {
      health.status = 'unhealthy';
      health.lastError = (error as Error).message;
      health.lastCheck = new Date();
      health.errorCount++;
    }

    const responseTime = Date.now() - startTime;
    health.responseTime = responseTime;

    // Update metrics
    this.updateMetrics(adapterId, health, responseTime);

    // Store updated health
    this.healthStatus.set(adapterId, health);

    // Emit health change event
    this.emit('health:changed', adapterId, health);

    return health;
  }

  /**
   * Get health status for all adapters
   */
  getAllHealth(): Record<string, AdapterHealth> {
    const result: Record<string, AdapterHealth> = {};
    for (const [id, health] of this.healthStatus) {
      result[id] = { ...health };
    }
    return result;
  }

  /**
   * Get metrics for adapter
   */
  getMetrics(adapterId: string): AdapterMetrics | undefined {
    return this.metrics.get(adapterId);
  }

  /**
   * Get all metrics
   */
  getAllMetrics(): Record<string, AdapterMetrics> {
    const result: Record<string, AdapterMetrics> = {};
    for (const [id, metrics] of this.metrics) {
      result[id] = { ...metrics };
    }
    return result;
  }

  /**
   * Get system health status
   */
  getSystemHealth(): HybridSystemStatus {
    const healthData = this.getAllHealth();
    const metricsData = this.getAllMetrics();
    const adapters = Object.values(healthData);

    const healthyAdapters = adapters.filter(a => a.status === 'healthy').length;
    const totalAdapters = adapters.length;

    const totalOperations = Object.values(metricsData)
      .reduce((sum, m) => sum + m.totalOperations, 0);

    const averageResponseTime = Object.values(metricsData)
      .filter(m => m.averageResponseTime > 0)
      .reduce((sum, m, _, arr) => sum + m.averageResponseTime / arr.length, 0);

    const totalErrors = Object.values(metricsData)
      .reduce((sum, m) => sum + m.failedOperations, 0);

    const errorRate = totalOperations > 0 ? (totalErrors / totalOperations) * 100 : 0;

    const systemHealth = healthyAdapters === totalAdapters ? 'healthy' :
      healthyAdapters > totalAdapters / 2 ? 'degraded' : 'unhealthy';

    return {
      systemHealth,
      activeFeatures: this.getActiveFeatures(),
      totalAdapters,
      healthyAdapters,
      currentMode: 'development', // This should come from config
      lastHealthCheck: new Date(),
      metrics: {
        totalOperations,
        averageResponseTime,
        errorRate,
        uptime: this.calculateSystemUptime(),
      },
    };
  }

  /**
   * Record operation success
   */
  recordSuccess(adapterId: string, responseTime: number): void {
    const metrics = this.metrics.get(adapterId);
    if (!metrics) {
      return;
    }

    metrics.totalOperations++;
    metrics.successfulOperations++;
    metrics.lastOperation = new Date();

    this.updateAverageResponseTime(metrics, responseTime);
    this.updateOperationsPerMinute(metrics);
    this.updateErrorRate(metrics);
  }

  /**
   * Record operation failure
   */
  recordFailure(adapterId: string, error: Error, responseTime: number): void {
    const metrics = this.metrics.get(adapterId);
    if (!metrics) {
      return;
    }

    metrics.totalOperations++;
    metrics.failedOperations++;
    metrics.lastOperation = new Date();

    this.updateAverageResponseTime(metrics, responseTime);
    this.updateOperationsPerMinute(metrics);
    this.updateErrorRate(metrics);

    // Update health status
    const health = this.healthStatus.get(adapterId);
    if (health) {
      health.lastError = error.message;
      health.lastCheck = new Date();
      health.errorCount++;

      if (health.errorCount >= this.config.unhealthyThreshold) {
        health.status = 'unhealthy';
      }

      this.healthStatus.set(adapterId, health);
      this.emit('health:changed', adapterId, health);
    }
  }

  /**
   * Subscribe to health changes
   */
  onHealthChange(
    callback: (adapterId: string, health: AdapterHealth) => void,
  ): () => void {
    this.addEventListener('health:changed', callback);
    return () => this.removeEventListener('health:changed', callback);
  }

  /**
   * Perform health checks for all registered adapters
   */
  private async performHealthChecks(): Promise<void> {
    const adapterIds = Array.from(this.healthStatus.keys());

    for (const adapterId of adapterIds) {
      try {
        await this.checkHealth(adapterId);
      } catch (error) {
        console.error(`Health check failed for ${adapterId}:`, error);
      }
    }
  }

  /**
   * Perform health check for specific adapter
   */
  private async performAdapterHealthCheck(adapterId: string): Promise<AdapterHealth> {
    // This is a simplified implementation
    // In a real system, you would call the adapter's health check method

    const health = this.healthStatus.get(adapterId);
    if (!health) {
      throw new Error(`Adapter ${adapterId} not registered for health monitoring`);
    }

    // Simulate health check
    const isHealthy = Math.random() > 0.1; // 90% success rate for demo

    return {
      ...health,
      status: isHealthy ? 'healthy' : 'degraded',
      isHealthy: isHealthy,
      lastCheck: new Date(),
    };
  }

  /**
   * Update adapter metrics
   */
  private updateMetrics(
    adapterId: string,
    health: AdapterHealth,
    responseTime: number,
  ): void {
    const metrics = this.metrics.get(adapterId);
    if (!metrics) {
      return;
    }

    this.updateAverageResponseTime(metrics, responseTime);
    this.updateOperationsPerMinute(metrics);
    this.updateErrorRate(metrics);
    this.updateUptime(metrics, health);
  }

  /**
   * Update average response time
   */
  private updateAverageResponseTime(metrics: AdapterMetrics, responseTime: number): void {
    if (metrics.totalOperations === 0) {
      metrics.averageResponseTime = responseTime;
    } else {
      metrics.averageResponseTime =
        (metrics.averageResponseTime * (metrics.totalOperations - 1) + responseTime) /
        metrics.totalOperations;
    }
  }

  /**
   * Update operations per minute
   */
  private updateOperationsPerMinute(metrics: AdapterMetrics): void {
    const _now = Date.now();
    // const oneMinuteAgo = now - 60000; // Unused variable - commented out

    // This is simplified - in reality you'd track operation timestamps
    metrics.operationsPerSecond = metrics.totalOperations / 60; // Rough estimate
  }

  /**
   * Update error rate
   */
  private updateErrorRate(metrics: AdapterMetrics): void {
    if (metrics.totalOperations === 0) {
      metrics.errorRate = 0;
    } else {
      metrics.errorRate = (metrics.failedOperations / metrics.totalOperations) * 100;
    }
  }

  /**
   * Update uptime
   */
  private updateUptime(_metrics: AdapterMetrics, _health: AdapterHealth): void {
    // Simplified uptime calculation
    // uptime is already part of AdapterMetrics interface
  }

  /**
   * Calculate system uptime
   */
  private calculateSystemUptime(): number {
    const allMetrics = Array.from(this.metrics.values());
    if (allMetrics.length === 0) {
      return 100;
    }

    // Use error rate to calculate uptime approximation
    const avgErrorRate = allMetrics.reduce((sum, m) => sum + m.errorRate, 0) / allMetrics.length;
    return Math.max(0, 100 - avgErrorRate);
  }

  /**
      features.add(feature);
    }
  }

  return Array.from(features);
  /**
   * Event handling
   */
  private addEventListener(event: string, listener: Function): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, new Set());
    }
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.add(listener);
    }
  }

  private removeEventListener(event: string, listener: Function): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.delete(listener);
    }
  }

  /**
   * Get active features from all registered adapters
   */
  private getActiveFeatures(): string[] {
    const features: string[] = [];
    for (const [adapterId, health] of this.healthStatus) {
      if (health.status === 'healthy') {
        features.push(`${adapterId}-monitoring`);
      }
    }
    return features;
  }

  private emit(event: string, ..._args: unknown[]): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      for (const listener of listeners) {
        try {
          listener(..._args);
        } catch (error) {
          console.error('Error in health monitor event listener:', error);
        }
      }
    }
  }
}

// Global health monitor instance
export const healthMonitor = new HealthMonitor();
