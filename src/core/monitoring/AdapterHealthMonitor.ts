// src/core/monitoring/AdapterHealthMonitor.ts
// Health monitoring system for all adapters

import type { BaseAdapter } from '../types/adapter';

/**
 * Adapter with health check capability
 */
interface HealthCheckableAdapter {
  getHealth(): Promise<Record<string, unknown>>;
}

/**
 * Adapter with blockchain capability
 */
interface BlockchainAdapter {
  type: string;
  getBlockchainStatus(): Promise<{ success: boolean; data?: unknown; error?: string }>;
}

/**
 * Adapter with authentication capability
 */
interface AuthAdapter {
  type: string;
  getCurrentUser(): Promise<{ success: boolean; data?: unknown; error?: string }>;
}

/**
 * Adapter with lifecycle methods
 */
interface LifecycleAdapter {
  cleanup(): Promise<void>;
  initialize(): Promise<void>;
}

/**
 * Health status of an adapter
 */
export interface AdapterHealthStatus {
  /** Adapter identifier */
  adapterId: string;
  /** Adapter type */
  adapterType: string;
  /** Overall health status */
  status: 'healthy' | 'degraded' | 'unhealthy' | 'unknown';
  /** Last check timestamp */
  lastCheck: number;
  /** Response time in milliseconds */
  responseTime?: number;
  /** Uptime percentage */
  uptime?: number;
  /** Error count */
  errorCount: number;
  /** Success count */
  successCount: number;
  /** Last error message */
  lastError?: string;
  /** Health check details */
  details?: Record<string, unknown>;
  /** Configuration status */
  configValid: boolean;
}

/**
 * Health check result
 */
export interface HealthCheckResult {
  success: boolean;
  responseTime: number;
  details?: Record<string, unknown>;
  error?: string;
}

/**
 * Health monitoring configuration
 */
export interface HealthMonitoringConfig {
  /** Health check interval in milliseconds */
  checkInterval: number;
  /** Timeout for health checks in milliseconds */
  timeout: number;
  /** Number of consecutive failures before marking as unhealthy */
  failureThreshold: number;
  /** Whether to enable automatic recovery */
  enableAutoRecovery: boolean;
  /** Callback for health status changes */
  onStatusChange?: (adapterId: string, status: AdapterHealthStatus) => void;
}

/**
 * Adapter health monitor
 */
export class AdapterHealthMonitor {
  private static instance: AdapterHealthMonitor;
  private adapters = new Map<string, BaseAdapter>();
  private healthStatus = new Map<string, AdapterHealthStatus>();
  private monitoringConfig = new Map<string, HealthMonitoringConfig>();
  private monitoringIntervals = new Map<string, NodeJS.Timeout>();
  private defaultConfig: HealthMonitoringConfig = {
    checkInterval: 30000, // 30 seconds
    timeout: 5000, // 5 seconds
    failureThreshold: 3,
    enableAutoRecovery: true,
  };

  private constructor() {
    // Initialize with empty implementation
  }

  static getInstance(): AdapterHealthMonitor {
    if (!AdapterHealthMonitor.instance) {
      AdapterHealthMonitor.instance = new AdapterHealthMonitor();
    }
    return AdapterHealthMonitor.instance;
  }

  /**
   * Register an adapter for health monitoring
   */
  registerAdapter(
    adapter: BaseAdapter,
    config?: Partial<HealthMonitoringConfig>,
  ): void {
    const adapterId = `${adapter.type}-${adapter.id}`;
    this.adapters.set(adapterId, adapter);

    const monitoringConfig = { ...this.defaultConfig, ...config };
    this.monitoringConfig.set(adapterId, monitoringConfig);

    // Initialize health status
    this.healthStatus.set(adapterId, {
      adapterId,
      adapterType: adapter.type,
      status: 'unknown',
      lastCheck: Date.now(),
      errorCount: 0,
      successCount: 0,
      configValid: this.validateAdapterConfig(adapter),
    });

    // Start monitoring
    this.startMonitoring(adapterId);
  }

  /**
   * Unregister an adapter from health monitoring
   */
  unregisterAdapter(adapterId: string): void {
    this.stopMonitoring(adapterId);
    this.adapters.delete(adapterId);
    this.healthStatus.delete(adapterId);
    this.monitoringConfig.delete(adapterId);
  }

  /**
   * Start monitoring an adapter
   */
  private startMonitoring(adapterId: string): void {
    const config = this.monitoringConfig.get(adapterId);
    if (!config) {
      return;
    }

    // Perform initial health check
    this.performHealthCheck(adapterId);

    // Set up periodic health checks
    const interval = setInterval(() => {
      this.performHealthCheck(adapterId);
    }, config.checkInterval);

    this.monitoringIntervals.set(adapterId, interval);
  }

  /**
   * Stop monitoring an adapter
   */
  private stopMonitoring(adapterId: string): void {
    const interval = this.monitoringIntervals.get(adapterId);
    if (interval) {
      clearInterval(interval);
      this.monitoringIntervals.delete(adapterId);
    }
  }

  /**
   * Perform a health check on an adapter
   */
  private async performHealthCheck(adapterId: string): Promise<void> {
    const adapter = this.adapters.get(adapterId);
    const config = this.monitoringConfig.get(adapterId);
    const currentStatus = this.healthStatus.get(adapterId);

    if (!adapter || !config || !currentStatus) {
      return;
    }

    const _startTime = Date.now();
    let result: HealthCheckResult;

    try {
      // Perform adapter-specific health check
      result = await this.checkAdapterHealth(adapter, config.timeout);

      // Update statistics
      if (result.success) {
        currentStatus.successCount++;
        currentStatus.errorCount = 0; // Reset error count on success
      } else {
        currentStatus.errorCount++;
      }

      // Update response time
      currentStatus.responseTime = result.responseTime;

      // Update last check time
      currentStatus.lastCheck = Date.now();

      // Update last error if present
      if (result.error) {
        currentStatus.lastError = result.error;
      }

      // Update details
      if (result.details) {
        currentStatus.details = result.details;
      }

      // Determine overall status
      const previousStatus = currentStatus.status;
      currentStatus.status = this.determineHealthStatus(currentStatus, config);

      // Calculate uptime
      currentStatus.uptime = this.calculateUptime(currentStatus);

      // Trigger status change callback if status changed
      if (previousStatus !== currentStatus.status && config.onStatusChange) {
        config.onStatusChange(adapterId, currentStatus);
      }

      // Attempt auto-recovery if enabled and adapter is unhealthy
      if (config.enableAutoRecovery && currentStatus.status === 'unhealthy') {
        this.attemptAutoRecovery(adapterId);
      }

    } catch (error: unknown) {
      // Handle health check failure
      currentStatus.errorCount++;
      currentStatus.lastError = error instanceof Error ? error.message : String(error);
      currentStatus.lastCheck = Date.now();
      currentStatus.status = 'unhealthy';

      if (config.onStatusChange) {
        config.onStatusChange(adapterId, currentStatus);
      }
    }
  }

  /**
   * Check health of a specific adapter
   */
  private async checkAdapterHealth(
    adapter: BaseAdapter,
    timeout: number,
  ): Promise<HealthCheckResult> {
    const startTime = Date.now();

    try {
      // Create a timeout promise
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Health check timeout')), timeout);
      });

      // Perform the actual health check
      const healthCheckPromise = this.performAdapterSpecificHealthCheck(adapter);

      // Race between health check and timeout
      const result = await Promise.race([healthCheckPromise, timeoutPromise]);

      return {
        success: true,
        responseTime: Date.now() - startTime,
        details: result,
      };

    } catch (error: unknown) {
      return {
        success: false,
        responseTime: Date.now() - startTime,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  /**
   * Perform adapter-specific health check
   */
  private async performAdapterSpecificHealthCheck(adapter: BaseAdapter): Promise<Record<string, unknown>> {
    const details: Record<string, unknown> = {
      isAvailable: adapter.isAvailable,
      type: adapter.type,
      id: adapter.id,
    };

    // Try to call adapter-specific health check methods if they exist
    if ('getHealth' in adapter && typeof adapter.getHealth === 'function') {
      try {
        const health = await (adapter as HealthCheckableAdapter).getHealth();
        details.adapterHealth = health;
      } catch (error) {
        details.adapterHealthError = error instanceof Error ? error.message : String(error);
      }
    }

    // For blockchain adapters, check network status
    if ((adapter as unknown as BlockchainAdapter).type === 'blockchain' && 'getBlockchainStatus' in adapter) {
      try {
        const status = await (adapter as unknown as BlockchainAdapter).getBlockchainStatus();
        details.blockchainStatus = status.success ? status.data : status.error;
      } catch (error) {
        details.blockchainStatusError = error instanceof Error ? error.message : String(error);
      }
    }

    // For auth adapters, check if we can get current user
    if ((adapter as unknown as AuthAdapter).type === 'auth' && 'getCurrentUser' in adapter) {
      try {
        const user = await (adapter as unknown as AuthAdapter).getCurrentUser();
        details.authCheck = user.success ? 'ok' : user.error;
      } catch (error) {
        details.authCheckError = error instanceof Error ? error.message : String(error);
      }
    }

    return details;
  }

  /**
   * Determine overall health status based on metrics
   */
  private determineHealthStatus(
    status: AdapterHealthStatus,
    config: HealthMonitoringConfig,
  ): 'healthy' | 'degraded' | 'unhealthy' | 'unknown' {
    if (status.errorCount >= config.failureThreshold) {
      return 'unhealthy';
    }

    if (status.errorCount > 0) {
      return 'degraded';
    }

    if (status.successCount === 0) {
      return 'unknown';
    }

    // Check response time
    if (status.responseTime && status.responseTime > 10000) { // 10 seconds
      return 'degraded';
    }

    return 'healthy';
  }

  /**
   * Calculate uptime percentage
   */
  private calculateUptime(status: AdapterHealthStatus): number {
    const total = status.successCount + status.errorCount;
    if (total === 0) {
      return 0;
    }
    return (status.successCount / total) * 100;
  }

  /**
   * Validate adapter configuration
   */
  private validateAdapterConfig(adapter: BaseAdapter): boolean {
    try {
      // Basic validation - adapter should have required properties
      return !!(adapter.id && adapter.type && adapter.isAvailable !== undefined);
    } catch {
      return false;
    }
  }

  /**
   * Attempt automatic recovery for unhealthy adapters
   */
  private async attemptAutoRecovery(adapterId: string): Promise<void> {
    const adapter = this.adapters.get(adapterId);
    if (!adapter) {
      return;
    }

    try {
      console.log(`Attempting auto-recovery for adapter ${adapterId}`);

      // Try to reinitialize the adapter
      if ('cleanup' in adapter && typeof adapter.cleanup === 'function') {
        await (adapter as unknown as LifecycleAdapter).cleanup();
      }

      if ('initialize' in adapter && typeof adapter.initialize === 'function') {
        await (adapter as unknown as LifecycleAdapter).initialize();
      }

      console.log(`Auto-recovery completed for adapter ${adapterId}`);
    } catch (error: unknown) {
      console.error(`Auto-recovery failed for adapter ${adapterId}:`, error instanceof Error ? error.message : String(error));
    }
  }

  /**
   * Get health status for all adapters
   */
  getAllHealthStatus(): AdapterHealthStatus[] {
    return Array.from(this.healthStatus.values());
  }

  /**
   * Get health status for a specific adapter
   */
  getHealthStatus(adapterId: string): AdapterHealthStatus | undefined {
    return this.healthStatus.get(adapterId);
  }

  /**
   * Get unhealthy adapters
   */
  getUnhealthyAdapters(): AdapterHealthStatus[] {
    return this.getAllHealthStatus().filter(
      status => status.status === 'unhealthy' || status.status === 'degraded',
    );
  }

  /**
   * Get overall system health summary
   */
  getSystemHealthSummary(): {
    total: number;
    healthy: number;
    degraded: number;
    unhealthy: number;
    unknown: number;
    overall: 'healthy' | 'degraded' | 'unhealthy';
    } {
    const allStatus = this.getAllHealthStatus();

    const summary = {
      total: allStatus.length,
      healthy: allStatus.filter(s => s.status === 'healthy').length,
      degraded: allStatus.filter(s => s.status === 'degraded').length,
      unhealthy: allStatus.filter(s => s.status === 'unhealthy').length,
      unknown: allStatus.filter(s => s.status === 'unknown').length,
      overall: 'healthy' as 'healthy' | 'degraded' | 'unhealthy',
    };

    // Determine overall system health
    if (summary.unhealthy > 0) {
      summary.overall = 'unhealthy';
    } else if (summary.degraded > 0 || summary.unknown > 0) {
      summary.overall = 'degraded';
    } else {
      summary.overall = 'healthy';
    }

    return summary;
  }

  /**
   * Update monitoring configuration for an adapter
   */
  updateMonitoringConfig(adapterId: string, config: Partial<HealthMonitoringConfig>): void {
    const currentConfig = this.monitoringConfig.get(adapterId);
    if (currentConfig) {
      const newConfig = { ...currentConfig, ...config };
      this.monitoringConfig.set(adapterId, newConfig);

      // Restart monitoring with new config
      this.stopMonitoring(adapterId);
      this.startMonitoring(adapterId);
    }
  }

  /**
   * Force a health check for an adapter
   */
  async forceHealthCheck(adapterId: string): Promise<AdapterHealthStatus> {
    await this.performHealthCheck(adapterId);
    const healthStatus = this.healthStatus.get(adapterId);
    return healthStatus || {
      adapterId,
      adapterType: 'unknown',
      status: 'unknown',
      lastCheck: Date.now(),
      errorCount: 0,
      successCount: 0,
      configValid: false,
    };
  }

  /**
   * Cleanup all monitoring
   */
  cleanup(): void {
    // Stop all monitoring intervals
    for (const [adapterId] of this.monitoringIntervals) {
      this.stopMonitoring(adapterId);
    }

    // Clear all data
    this.adapters.clear();
    this.healthStatus.clear();
    this.monitoringConfig.clear();
    this.monitoringIntervals.clear();
  }
}

// Export singleton instance
export const adapterHealthMonitor = AdapterHealthMonitor.getInstance();
