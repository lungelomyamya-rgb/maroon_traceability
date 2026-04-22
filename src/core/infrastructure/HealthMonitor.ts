// src/core/infrastructure/HealthMonitor.ts
// Adapter health monitoring and management system

import { adapterRegistry } from '../adapters/AdapterRegistry';
import type { IService } from '../interfaces/services';
import type { AdapterHealthStatus } from '../types/config';
import { hybridModeManager } from './HybridModeManager';

/**
 * Adapter with health check capability
 */
interface HealthCheckableAdapter {
  healthCheck(): Promise<void>;
}

/**
 * Health trend data
 */
interface HealthTrend {
  status: 'improving' | 'stable' | 'degrading';
  uptime: number;
  averageResponseTime: number;
  errorRate: number;
  lastIncident?: string;
}

/**
 * Health monitoring system for adapters and hybrid modes
 */
export class HealthMonitor implements IService {
  readonly name = 'HealthMonitor';
  readonly version = '1.0.0';
  private static instance: HealthMonitor;
  private isMonitoring: boolean = false;
  private monitoringInterval?: NodeJS.Timeout;
  private healthCallbacks: Set<(status: Record<string, AdapterHealthStatus>) => void> = new Set();
  private lastHealthCheck: Date = new Date();
  private healthHistory: Map<string, AdapterHealthStatus[]> = new Map();

  private constructor() {
    // Private constructor for singleton pattern
  }

  /**
   * Get singleton instance
   */
  static getInstance(): HealthMonitor {
    if (!HealthMonitor.instance) {
      HealthMonitor.instance = new HealthMonitor();
    }
    return HealthMonitor.instance;
  }

  /**
   * Start health monitoring
   */
  startMonitoring(intervalMs: number = 30000): void {
    if (this.isMonitoring) {
      console.warn('Health monitoring is already active');
      return;
    }

    this.isMonitoring = true;
    console.log(`Starting health monitoring with ${intervalMs}ms interval`);

    // Perform initial health check
    this.performHealthCheck();

    // Set up periodic health checks
    this.monitoringInterval = setInterval(() => {
      this.performHealthCheck();
    }, intervalMs);
  }

  /**
   * Stop health monitoring
   */
  stopMonitoring(): void {
    if (!this.isMonitoring) {
      return;
    }

    this.isMonitoring = false;

    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = undefined;
    }

    console.log('Health monitoring stopped');
  }

  /**
   * Perform comprehensive health check
   */
  async performHealthCheck(): Promise<Record<string, AdapterHealthStatus>> {
    const startTime = Date.now();
    const healthStatus: Record<string, AdapterHealthStatus> = {};

    try {
      // Check adapter health
      const adapterHealth = await this.checkAdapterHealth();
      Object.assign(healthStatus, adapterHealth);

      // Check hybrid mode health
      const hybridHealth = await this.checkHybridModeHealth();
      Object.assign(healthStatus, hybridHealth);

      // Update health history
      this.updateHealthHistory(healthStatus);

      // Notify subscribers
      this.notifyHealthCallbacks(healthStatus);

      this.lastHealthCheck = new Date();

      const duration = Date.now() - startTime;
      console.log(`Health check completed in ${duration}ms`);

      return healthStatus;

    } catch (error) {
      console.error('Health check failed:', error);

      // Return error status
      return {
        'health-monitor': {
          adapterId: 'health-monitor',
          status: 'unhealthy',
          lastCheck: new Date().toISOString(),
          error: error instanceof Error ? error.message : 'Unknown error',
          metrics: { checkDuration: Date.now() - startTime },
        },
      };
    }
  }

  /**
   * Check health of all registered adapters
   */
  private async checkAdapterHealth(): Promise<Record<string, AdapterHealthStatus>> {
    const healthStatus: Record<string, AdapterHealthStatus> = {};
    const instances = adapterRegistry.getActiveInstances();

    for (const [adapterKey, adapter] of instances) {
      const startTime = Date.now();

      try {
        // Basic availability check
        const isAvailable = adapter.isAvailable;

        // Perform health check operation (if adapter supports it)
        let responseTime: number | undefined;
        let error: string | undefined;

        if (isAvailable && 'healthCheck' in adapter && typeof (adapter as unknown as HealthCheckableAdapter).healthCheck === 'function') {
          try {
            const healthStartTime = Date.now();
            await (adapter as unknown as HealthCheckableAdapter).healthCheck();
            responseTime = Date.now() - healthStartTime;
          } catch (healthError) {
            error = healthError instanceof Error ? healthError.message : 'Health check failed';
          }
        }

        const status: AdapterHealthStatus = {
          adapterId: adapterKey,
          status: isAvailable ? (error ? 'degraded' : 'healthy') : 'unhealthy',
          lastCheck: new Date().toISOString(),
          responseTime,
          error,
          metrics: {
            checkDuration: Date.now() - startTime,
            availability: isAvailable ? 1 : 0,
          },
        };

        healthStatus[adapterKey] = status;
        adapterRegistry.updateHealthStatus(adapterKey, status.status, error);

      } catch (error) {
        healthStatus[adapterKey] = {
          adapterId: adapterKey,
          status: 'unhealthy',
          lastCheck: new Date().toISOString(),
          error: error instanceof Error ? error.message : 'Unknown error',
          metrics: { checkDuration: Date.now() - startTime },
        };
      }
    }

    return healthStatus;
  }

  /**
   * Check health of hybrid mode configurations
   */
  private async checkHybridModeHealth(): Promise<Record<string, AdapterHealthStatus>> {
    const healthStatus: Record<string, AdapterHealthStatus> = {};
    const config = hybridModeManager.getConfig();

    // Check each feature's hybrid mode health
    for (const [featureName, featureConfig] of Object.entries(config.features)) {
      const startTime = Date.now();

      try {
        const currentMode = hybridModeManager.getMode(featureName);
        const hasRealAdapter = adapterRegistry.isHealthy(featureName, 'real');
        const hasMockAdapter = adapterRegistry.isHealthy(featureName, 'mock');

        let status: 'healthy' | 'degraded' | 'unhealthy';
        let error: string | undefined;

        if (featureConfig.mode === 'real' && !hasRealAdapter) {
          status = 'unhealthy';
          error = 'Real adapter required but not available';
        } else if (featureConfig.mode === 'hybrid' && (!hasRealAdapter && !hasMockAdapter)) {
          status = 'unhealthy';
          error = 'Hybrid mode requires at least one healthy adapter';
        } else if (featureConfig.mode === 'hybrid' && !hasRealAdapter) {
          status = 'degraded';
          error = 'Hybrid mode running with mock adapter only';
        } else {
          status = 'healthy';
        }

        healthStatus[`hybrid-${featureName}`] = {
          adapterId: `hybrid-${featureName}`,
          status,
          lastCheck: new Date().toISOString(),
          error,
          metrics: {
            checkDuration: Date.now() - startTime,
            currentMode: currentMode === 'real' ? 2 : currentMode === 'hybrid' ? 1 : 0,
            hasRealAdapter: hasRealAdapter ? 1 : 0,
            hasMockAdapter: hasMockAdapter ? 1 : 0,
            allowRuntimeSwitching: featureConfig.allowRuntimeSwitching ? 1 : 0,
          },
        };

      } catch (error) {
        healthStatus[`hybrid-${featureName}`] = {
          adapterId: `hybrid-${featureName}`,
          status: 'unhealthy',
          lastCheck: new Date().toISOString(),
          error: error instanceof Error ? error.message : 'Unknown error',
          metrics: { checkDuration: Date.now() - startTime },
        };
      }
    }

    return healthStatus;
  }

  /**
   * Update health history for trend analysis
   */
  private updateHealthHistory(healthStatus: Record<string, AdapterHealthStatus>): void {
    for (const [adapterKey, status] of Object.entries(healthStatus)) {
      if (!this.healthHistory.has(adapterKey)) {
        this.healthHistory.set(adapterKey, []);
      }

      const history = this.healthHistory.get(adapterKey);
      if (history) {
        history.push(status);

        // Keep only last 100 entries per adapter
        if (history.length > 100) {
          history.shift();
        }
      }
    }
  }

  /**
   * Notify health status callbacks
   */
  private notifyHealthCallbacks(healthStatus: Record<string, AdapterHealthStatus>): void {
    for (const callback of this.healthCallbacks) {
      try {
        callback(healthStatus);
      } catch (error) {
        console.error('Error in health status callback:', error);
      }
    }
  }

  /**
   * Subscribe to health status updates
   */
  subscribe(callback: (status: Record<string, AdapterHealthStatus>) => void): () => void {
    this.healthCallbacks.add(callback);

    // Return unsubscribe function
    return () => {
      this.healthCallbacks.delete(callback);
    };
  }

  /**
   * Get current health status
   */
  getCurrentHealth(): Record<string, AdapterHealthStatus> {
    return adapterRegistry.getHealthStatus();
  }

  /**
   * Get health history for an adapter
   */
  getHealthHistory(adapterKey: string): AdapterHealthStatus[] {
    return this.healthHistory.get(adapterKey) || [];
  }

  /**
   * Get health statistics
   */
  getHealthStats(): {
    totalAdapters: number;
    healthyAdapters: number;
    degradedAdapters: number;
    unhealthyAdapters: number;
    lastCheck: Date;
    monitoringActive: boolean;
    uptime: number;
    } {
    const currentHealth = this.getCurrentHealth();
    const healthyCount = Object.values(currentHealth).filter(status => status.status === 'healthy').length;
    const degradedCount = Object.values(currentHealth).filter(status => status.status === 'degraded').length;
    const unhealthyCount = Object.values(currentHealth).filter(status => status.status === 'unhealthy').length;

    return {
      totalAdapters: Object.keys(currentHealth).length,
      healthyAdapters: healthyCount,
      degradedAdapters: degradedCount,
      unhealthyAdapters: unhealthyCount,
      lastCheck: this.lastHealthCheck,
      monitoringActive: this.isMonitoring,
      uptime: Date.now() - this.lastHealthCheck.getTime(),
    };
  }

  /**
   * Get comprehensive health report
   */
  getHealthReport(): {
    summary: ReturnType<typeof HealthMonitor.prototype.getHealthStats>;
    adapters: Record<string, AdapterHealthStatus>;
    hybridModes: Record<string, AdapterHealthStatus>;
    trends: Record<string, {
      status: 'improving' | 'stable' | 'degrading';
      uptime: number;
      lastIncident?: string;
    }>;
    } {
    const currentHealth = this.getCurrentHealth();
    const summary = this.getHealthStats();

    // Separate adapter and hybrid mode health
    const adapters: Record<string, AdapterHealthStatus> = {};
    const hybridModes: Record<string, AdapterHealthStatus> = {};

    for (const [key, status] of Object.entries(currentHealth)) {
      if (key.startsWith('hybrid-')) {
        hybridModes[key] = status;
      } else {
        adapters[key] = status;
      }
    }

    // Calculate trends
    const trends: Record<string, HealthTrend> = {};
    for (const [adapterKey, history] of this.healthHistory) {
      if (history.length < 2) {
        continue;
      }

      const recent = history.slice(-10);
      const healthyCount = recent.filter(h => h.status === 'healthy').length;
      const uptime = (healthyCount / recent.length) * 100;

      let status: 'improving' | 'stable' | 'degrading';
      if (healthyCount >= 8) {
        status = 'improving';
      } else if (healthyCount >= 5) {
        status = 'stable';
      } else {
        status = 'degrading';
      }

      const lastIncident = recent.find(h => h.status !== 'healthy')?.lastCheck;

      trends[adapterKey] = {
        status,
        uptime: Number(uptime.toFixed(2)),
        averageResponseTime: recent.reduce((sum, h) => sum + (h.responseTime || 0), 0) / recent.length,
        errorRate: ((recent.length - healthyCount) / recent.length) * 100,
        lastIncident,
      };
    }

    return {
      summary,
      adapters,
      hybridModes,
      trends,
    };
  }

  /**
   * Force health check for specific adapter
   */
  async checkSpecificAdapterHealth(adapterKey: string): Promise<AdapterHealthStatus> {
    const parts = adapterKey.split('/');
    const _type = parts[0];
    const _name = parts[1];
    const adapter = adapterRegistry.get(adapterKey);

    if (!adapter) {
      return {
        adapterId: adapterKey,
        status: 'unhealthy',
        lastCheck: new Date().toISOString(),
        error: 'Adapter not found',
      };
    }

    const startTime = Date.now();

    try {
      const isAvailable = adapter.isAvailable;
      const responseTime = Date.now() - startTime;

      const status: AdapterHealthStatus = {
        adapterId: adapterKey,
        status: isAvailable ? 'healthy' : 'unhealthy',
        lastCheck: new Date().toISOString(),
        responseTime,
        metrics: { checkDuration: responseTime },
      };

      adapterRegistry.updateHealthStatus(adapterKey, status.status);
      return status;

    } catch (error) {
      const status: AdapterHealthStatus = {
        adapterId: adapterKey,
        status: 'unhealthy',
        lastCheck: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
        metrics: { checkDuration: Date.now() - startTime },
      };

      adapterRegistry.updateHealthStatus(adapterKey, status.status, status.error);
      return status;
    }
  }

  /**
   * Cleanup resources
   */
  cleanup(): void {
    this.stopMonitoring();
    this.healthCallbacks.clear();
    this.healthHistory.clear();
  }
}

/**
 * Global health monitor instance
 */
export const healthMonitor = HealthMonitor.getInstance();
