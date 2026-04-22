// src/core/infrastructure/PerformanceMonitor.ts
// Comprehensive performance monitoring for hybrid architecture


/**
 * Performance metrics interface
 */
export interface PerformanceMetrics {
  operationId: string;
  operation: string;
  feature: string;
  adapter: string;
  mode: string;
  startTime: number;
  endTime: number;
  duration: number;
  success: boolean;
  error?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Browser memory interface
 */
interface BrowserMemory {
  memory: {
    usedJSHeapSize: number;
    totalJSHeapSize: number;
    jsHeapSizeLimit: number;
  };
}

/**
 * Performance callback interface
 */
interface PerformanceCallback {
  (success: boolean, error?: string, metadata?: Record<string, unknown>): void;
}

/**
 * Performance statistics
 */
export interface PerformanceStats {
  totalOperations: number;
  successfulOperations: number;
  failedOperations: number;
  averageDuration: number;
  minDuration: number;
  maxDuration: number;
  operationsByFeature: Record<string, number>;
  operationsByAdapter: Record<string, number>;
  operationsByMode: Record<string, number>;
  errorRate: number;
  successRate: number;
}

/**
 * Performance alert thresholds
 */
export interface PerformanceThresholds {
  maxOperationDuration: number; // ms
  maxErrorRate: number; // percentage
  maxMemoryUsage: number; // MB
  maxCacheSize: number; // entries
}

/**
 * Performance alert
 */
export interface PerformanceAlert {
  id: string;
  type: 'slow_operation' | 'high_error_rate' | 'memory_warning' | 'cache_overflow';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  timestamp: number;
  metrics: Partial<PerformanceMetrics>;
  threshold: number;
  actualValue: number;
}

/**
 * Performance monitoring configuration
 */
export interface PerformanceMonitorConfig {
  enabled: boolean;
  samplingRate: number; // 0.0 to 1.0
  maxMetricsHistory: number;
  alertThresholds: PerformanceThresholds;
  enableRealTimeAlerts: boolean;
  enableAnalytics: boolean;
}

/**
 * Comprehensive Performance Monitor
 * Tracks, analyzes, and alerts on system performance
 */
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private config: PerformanceMonitorConfig;
  private metrics: PerformanceMetrics[] = [];
  private alerts: PerformanceAlert[] = [];
  private subscribers: Set<(alert: PerformanceAlert) => void> = new Set();
  private isMonitoring = false;
  private monitoringInterval: NodeJS.Timeout | null = null;
  private memoryCheckInterval: NodeJS.Timeout | null = null;

  private constructor() {
    this.config = this.getDefaultConfig();
  }

  /**
   * Get singleton instance
   */
  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  /**
   * Configure performance monitoring
   */
  configure(config: Partial<PerformanceMonitorConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Start performance monitoring
   */
  startMonitoring(): void {
    if (this.isMonitoring || !this.config.enabled) {
      return;
    }

    this.isMonitoring = true;

    // Start periodic analysis
    this.monitoringInterval = setInterval(() => {
      this.analyzeMetrics();
    }, 30000); // Every 30 seconds

    // Start memory monitoring
    this.memoryCheckInterval = setInterval(() => {
      this.checkMemoryUsage();
    }, 60000); // Every minute

    console.log('Performance monitoring started');
  }

  /**
   * Stop performance monitoring
   */
  stopMonitoring(): void {
    if (!this.isMonitoring) {
      return;
    }

    this.isMonitoring = false;

    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }

    if (this.memoryCheckInterval) {
      clearInterval(this.memoryCheckInterval);
      this.memoryCheckInterval = null;
    }

    console.log('Performance monitoring stopped');
  }

  /**
   * Record operation performance
   */
  recordOperation(operation: string, feature: string, adapter: string, mode: string): PerformanceTracker {
    if (!this.config.enabled || Math.random() > this.config.samplingRate) {
      return new PerformanceTracker(() => {
      // No-op implementation for disabled monitoring
    });
    }

    const operationId = this.generateOperationId();
    const startTime = Date.now();

    return new PerformanceTracker((success: boolean, error?: string, metadata?: Record<string, unknown>) => {
      const endTime = Date.now();
      const duration = endTime - startTime;

      const metrics: PerformanceMetrics = {
        operationId,
        operation,
        feature,
        adapter,
        mode,
        startTime,
        endTime,
        duration,
        success,
        error,
        metadata,
      };

      this.addMetrics(metrics);

      // Check for immediate alerts
      this.checkImmediateAlerts(metrics);
    });
  }

  /**
   * Get performance statistics
   */
  getPerformanceStats(timeRange?: { start: number; end: number }): PerformanceStats {
    const filteredMetrics = this.getFilteredMetrics(timeRange);

    if (filteredMetrics.length === 0) {
      return this.getEmptyStats();
    }

    const successfulOps = filteredMetrics.filter(m => m.success);
    const failedOps = filteredMetrics.filter(m => !m.success);
    const durations = filteredMetrics.map(m => m.duration);

    const operationsByFeature = this.groupBy(filteredMetrics, 'feature');
    const operationsByAdapter = this.groupBy(filteredMetrics, 'adapter');
    const operationsByMode = this.groupBy(filteredMetrics, 'mode');

    return {
      totalOperations: filteredMetrics.length,
      successfulOperations: successfulOps.length,
      failedOperations: failedOps.length,
      averageDuration: durations.reduce((sum, d) => sum + d, 0) / durations.length,
      minDuration: Math.min(...durations),
      maxDuration: Math.max(...durations),
      operationsByFeature,
      operationsByAdapter,
      operationsByMode,
      errorRate: (failedOps.length / filteredMetrics.length) * 100,
      successRate: (successfulOps.length / filteredMetrics.length) * 100,
    };
  }

  /**
   * Get recent alerts
   */
  getAlerts(severity?: 'low' | 'medium' | 'high' | 'critical'): PerformanceAlert[] {
    if (severity) {
      return this.alerts.filter(alert => alert.severity === severity);
    }
    return this.alerts;
  }

  /**
   * Subscribe to performance alerts
   */
  subscribe(callback: (alert: PerformanceAlert) => void): () => void {
    this.subscribers.add(callback);

    return () => {
      this.subscribers.delete(callback);
    };
  }

  /**
   * Get performance trends
   */
  getPerformanceTrends(timeRange: number = 3600000): { // Default 1 hour
    timestamp: number;
    averageDuration: number;
    operationCount: number;
    errorRate: number;
  }[] {
    const now = Date.now();
    const start = now - timeRange;
    const bucketSize = 60000; // 1 minute buckets

    const filteredMetrics = this.metrics.filter(m => m.startTime >= start);
    const buckets = new Map<number, PerformanceMetrics[]>();

    // Group metrics into time buckets
    filteredMetrics.forEach(metric => {
      const bucketTime = Math.floor(metric.startTime / bucketSize) * bucketSize;
      if (!buckets.has(bucketTime)) {
        buckets.set(bucketTime, []);
      }
      const bucket = buckets.get(bucketTime);
      if (bucket) {
        bucket.push(metric);
      }
    });

    // Generate trend data
    return Array.from(buckets.entries())
      .map(([timestamp, bucketMetrics]) => {
        const successfulOps = bucketMetrics.filter(m => m.success);
        const durations = bucketMetrics.map(m => m.duration);

        return {
          timestamp,
          averageDuration: durations.length > 0
            ? durations.reduce((sum, d) => sum + d, 0) / durations.length
            : 0,
          operationCount: bucketMetrics.length,
          errorRate: bucketMetrics.length > 0
            ? ((bucketMetrics.length - successfulOps.length) / bucketMetrics.length) * 100
            : 0,
        };
      })
      .sort((a, b) => a.timestamp - b.timestamp);
  }

  /**
   * Get detailed operation breakdown
   */
  getOperationBreakdown(operation: string): {
    byFeature: Record<string, PerformanceStats>;
    byAdapter: Record<string, PerformanceStats>;
    byMode: Record<string, PerformanceStats>;
    recent: PerformanceMetrics[];
  } {
    const operationMetrics = this.metrics.filter(m => m.operation === operation);

    const byFeature: Record<string, PerformanceStats> = {};
    const byAdapter: Record<string, PerformanceStats> = {};
    const byMode: Record<string, PerformanceStats> = {};

    // Group by feature
    const featureGroups = this.groupBy(operationMetrics, 'feature');
    Object.entries(featureGroups).forEach(([feature, _]) => {
      const featureMetrics = operationMetrics.filter(m => m.feature === feature);
      byFeature[feature] = this.calculateStats(featureMetrics);
    });

    // Group by adapter
    const adapterGroups = this.groupBy(operationMetrics, 'adapter');
    Object.entries(adapterGroups).forEach(([adapter, _count]) => {
      const adapterMetrics = operationMetrics.filter(m => m.adapter === adapter);
      byAdapter[adapter] = this.calculateStats(adapterMetrics);
    });

    // Group by mode
    const modeGroups = this.groupBy(operationMetrics, 'mode');
    Object.entries(modeGroups).forEach(([mode, _count]) => {
      const modeMetrics = operationMetrics.filter(m => m.mode === mode);
      byMode[mode] = this.calculateStats(modeMetrics);
    });

    return {
      byFeature,
      byAdapter,
      byMode,
      recent: operationMetrics.slice(-10), // Last 10 operations
    };
  }

  /**
   * Export performance data
   */
  exportData(format: 'json' | 'csv' = 'json'): string {
    if (format === 'json') {
      return JSON.stringify({
        metrics: this.metrics,
        alerts: this.alerts,
        stats: this.getPerformanceStats(),
        exportedAt: new Date().toISOString(),
      }, null, 2);
    }

    // CSV format
    const headers = ['operationId', 'operation', 'feature', 'adapter', 'mode', 'startTime', 'endTime', 'duration', 'success', 'error'];
    const csvRows = [headers.join(',')];

    this.metrics.forEach(metric => {
      const row = [
        metric.operationId,
        metric.operation,
        metric.feature,
        metric.adapter,
        metric.mode,
        metric.startTime,
        metric.endTime,
        metric.duration,
        metric.success,
        metric.error || '',
      ];
      csvRows.push(row.join(','));
    });

    return csvRows.join('\n');
  }

  /**
   * Clear performance data
   */
  clearData(): void {
    this.metrics = [];
    this.alerts = [];
    console.log('Performance data cleared');
  }

  /**
   * Get current monitoring status
   */
  getMonitoringStatus(): {
    isActive: boolean;
    config: PerformanceMonitorConfig;
    metricsCount: number;
    alertsCount: number;
    memoryUsage: number;
    } {
    return {
      isActive: this.isMonitoring,
      config: this.config,
      metricsCount: this.metrics.length,
      alertsCount: this.alerts.length,
      memoryUsage: this.getMemoryUsage(),
    };
  }

  /**
   * Private methods
   */

  private addMetrics(metrics: PerformanceMetrics): void {
    this.metrics.push(metrics);

    // Maintain history limit
    if (this.metrics.length > this.config.maxMetricsHistory) {
      this.metrics = this.metrics.slice(-this.config.maxMetricsHistory);
    }
  }

  private generateOperationId(): string {
    return `perf_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private getFilteredMetrics(timeRange?: { start: number; end: number }): PerformanceMetrics[] {
    if (!timeRange) {
      return this.metrics;
    }

    return this.metrics.filter(m =>
      m.startTime >= timeRange.start && m.startTime <= timeRange.end,
    );
  }

  private getEmptyStats(): PerformanceStats {
    return {
      totalOperations: 0,
      successfulOperations: 0,
      failedOperations: 0,
      averageDuration: 0,
      minDuration: 0,
      maxDuration: 0,
      operationsByFeature: {},
      operationsByAdapter: {},
      operationsByMode: {},
      errorRate: 0,
      successRate: 0,
    };
  }

  private groupBy(metrics: PerformanceMetrics[], key: keyof PerformanceMetrics): Record<string, number> {
    return metrics.reduce((groups, metric) => {
      const value = metric[key] as string;
      groups[value] = (groups[value] || 0) + 1;
      return groups;
    }, {} as Record<string, number>);
  }

  private calculateStats(metrics: PerformanceMetrics[]): PerformanceStats {
    if (metrics.length === 0) {
      return this.getEmptyStats();
    }

    const successfulOps = metrics.filter(m => m.success);
    const durations = metrics.map(m => m.duration);

    return {
      totalOperations: metrics.length,
      successfulOperations: successfulOps.length,
      failedOperations: metrics.length - successfulOps.length,
      averageDuration: durations.reduce((sum, d) => sum + d, 0) / durations.length,
      minDuration: Math.min(...durations),
      maxDuration: Math.max(...durations),
      operationsByFeature: this.groupBy(metrics, 'feature'),
      operationsByAdapter: this.groupBy(metrics, 'adapter'),
      operationsByMode: this.groupBy(metrics, 'mode'),
      errorRate: ((metrics.length - successfulOps.length) / metrics.length) * 100,
      successRate: (successfulOps.length / metrics.length) * 100,
    };
  }

  private checkImmediateAlerts(metrics: PerformanceMetrics): void {
    if (!this.config.enableRealTimeAlerts) {
      return;
    }

    // Check for slow operation
    if (metrics.duration > this.config.alertThresholds.maxOperationDuration) {
      this.createAlert({
        type: 'slow_operation',
        severity: metrics.duration > this.config.alertThresholds.maxOperationDuration * 2 ? 'high' : 'medium',
        message: `Slow operation detected: ${metrics.operation} took ${metrics.duration}ms`,
        metrics,
        threshold: this.config.alertThresholds.maxOperationDuration,
        actualValue: metrics.duration,
      });
    }
  }

  private analyzeMetrics(): void {
    const stats = this.getPerformanceStats();

    // Check error rate
    if (stats.errorRate > this.config.alertThresholds.maxErrorRate) {
      this.createAlert({
        type: 'high_error_rate',
        severity: stats.errorRate > this.config.alertThresholds.maxErrorRate * 1.5 ? 'critical' : 'high',
        message: `High error rate detected: ${stats.errorRate.toFixed(2)}%`,
        metrics: {}, // No specific metrics for system-wide alerts
        threshold: this.config.alertThresholds.maxErrorRate,
        actualValue: stats.errorRate,
      });
    }
  }

  private checkMemoryUsage(): void {
    const memoryUsage = this.getMemoryUsage();

    if (memoryUsage > this.config.alertThresholds.maxMemoryUsage) {
      this.createAlert({
        type: 'memory_warning',
        severity: memoryUsage > this.config.alertThresholds.maxMemoryUsage * 1.2 ? 'critical' : 'high',
        message: `High memory usage detected: ${memoryUsage.toFixed(2)}MB`,
        metrics: {}, // No specific metrics for system-wide alerts
        threshold: this.config.alertThresholds.maxMemoryUsage,
        actualValue: memoryUsage,
      });
    }
  }

  private createAlert(alert: Omit<PerformanceAlert, 'id' | 'timestamp'>): void {
    const fullAlert: PerformanceAlert = {
      ...alert,
      id: this.generateOperationId(),
      timestamp: Date.now(),
    };

    this.alerts.push(fullAlert);

    // Maintain alert history limit
    if (this.alerts.length > 1000) {
      this.alerts = this.alerts.slice(-1000);
    }

    // Notify subscribers
    this.subscribers.forEach(callback => {
      try {
        callback(fullAlert);
      } catch (error) {
        console.warn('Error in performance alert subscriber:', error);
      }
    });
  }

  private getMemoryUsage(): number {
    if (typeof process !== 'undefined' && process.memoryUsage) {
      const usage = process.memoryUsage();
      return usage.heapUsed / 1024 / 1024; // Convert to MB
    }

    // Browser environment - approximate
    if (typeof performance !== 'undefined' && (performance as unknown as BrowserMemory).memory) {
      const memory = (performance as unknown as BrowserMemory).memory;
      return memory.usedJSHeapSize / 1024 / 1024;
    }

    return 0;
  }

  private getDefaultConfig(): PerformanceMonitorConfig {
    return {
      enabled: true,
      samplingRate: 1.0, // Sample all operations
      maxMetricsHistory: 10000,
      alertThresholds: {
        maxOperationDuration: 5000, // 5 seconds
        maxErrorRate: 5.0, // 5%
        maxMemoryUsage: 512, // 512MB
        maxCacheSize: 10000, // 10k entries
      },
      enableRealTimeAlerts: true,
      enableAnalytics: true,
    };
  }
}

/**
 * Performance tracker for individual operations
 */
export class PerformanceTracker {
  private onComplete: PerformanceCallback;

  constructor(onComplete: PerformanceCallback) {
    this.onComplete = onComplete;
  }

  /**
   * Mark operation as successful
   */
  success(metadata?: Record<string, unknown>): void {
    this.onComplete(true, undefined, metadata);
  }

  /**
   * Mark operation as failed
   */
  error(error: string, metadata?: Record<string, unknown>): void {
    this.onComplete(false, error, metadata);
  }

  /**
   * Complete operation with custom result
   */
  complete(success: boolean, error?: string, metadata?: Record<string, unknown>): void {
    this.onComplete(success, error, metadata);
  }
}

// Export singleton instance
export const performanceMonitor = PerformanceMonitor.getInstance();
