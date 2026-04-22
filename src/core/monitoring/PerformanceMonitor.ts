// src/core/monitoring/PerformanceMonitor.ts
// Performance monitoring and optimization for adapters

import type { BaseAdapter } from '../types/adapter';

/**
 * Performance metrics interface
 */
export interface PerformanceMetrics {
  /** Operation name */
  operation: string;
  /** Adapter type */
  adapterType: string;
  /** Timestamp */
  timestamp: number;
  /** Duration in milliseconds */
  duration: number;
  /** Success status */
  success: boolean;
  /** Error message if failed */
  error?: string;
  /** Memory usage before operation */
  memoryBefore?: number;
  /** Memory usage after operation */
  memoryAfter?: number;
  /** Additional metadata */
  metadata?: Record<string, unknown>;
}

/**
 * Performance statistics
 */
export interface PerformanceStats {
  /** Total operations */
  totalOperations: number;
  /** Successful operations */
  successfulOperations: number;
  /** Failed operations */
  failedOperations: number;
  /** Average duration */
  avgDuration: number;
  /** Minimum duration */
  minDuration: number;
  /** Maximum duration */
  maxDuration: number;
  /** 95th percentile duration */
  p95Duration: number;
  /** 99th percentile duration */
  p99Duration: number;
  /** Operations per second */
  opsPerSecond: number;
  /** Success rate percentage */
  successRate: number;
  /** Average memory usage */
  avgMemoryUsage: number;
  /** Memory growth rate */
  memoryGrowthRate: number;
}

/**
 * Performance alert
 */
export interface PerformanceAlert {
  /** Alert ID */
  id: string;
  /** Alert type */
  type: 'slow_operation' | 'high_error_rate' | 'memory_leak' | 'performance_degradation';
  /** Alert severity */
  severity: 'low' | 'medium' | 'high' | 'critical';
  /** Alert message */
  message: string;
  /** Timestamp */
  timestamp: number;
  /** Related metrics */
  metrics: PerformanceMetrics;
  /** Alert details */
  details?: Record<string, unknown>;
}

/**
 * Performance monitor configuration
 */
export interface PerformanceMonitorConfig {
  /** Enable performance monitoring */
  enabled: boolean;
  /** Metrics retention period in milliseconds */
  retentionPeriod: number;
  /** Maximum metrics to store */
  maxMetrics: number;
  /** Alert thresholds */
  thresholds: {
    /** Slow operation threshold in milliseconds */
    slowOperationThreshold: number;
    /** High error rate threshold (percentage) */
    highErrorRateThreshold: number;
    /** Memory leak threshold in bytes */
    memoryLeakThreshold: number;
    /** Performance degradation threshold (percentage) */
    performanceDegradationThreshold: number;
  };
  /** Alert callback */
  onAlert?: (alert: PerformanceAlert) => void;
  /** Sampling rate (0-1) */
  samplingRate: number;
}

/**
 * Performance monitor class
 */
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: PerformanceMetrics[] = [];
  private config: PerformanceMonitorConfig = {
    enabled: true,
    retentionPeriod: 24 * 60 * 60 * 1000, // 24 hours
    maxMetrics: 10000,
    thresholds: {
      slowOperationThreshold: 1000, // 1 second
      highErrorRateThreshold: 10, // 10%
      memoryLeakThreshold: 50 * 1024 * 1024, // 50MB
      performanceDegradationThreshold: 20, // 20%
    },
    samplingRate: 1.0, // 100% sampling
  };
  private alertHistory: PerformanceAlert[] = [];
  private baselineStats: Map<string, PerformanceStats> = new Map();

  private constructor() {
    // Start cleanup interval
    setInterval(() => this.cleanup(), 60000); // Every minute
  }

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  /**
   * Record a performance metric
   */
  recordMetric(metric: PerformanceMetrics): void {
    if (!this.config.enabled) {
      return;
    }

    // Apply sampling
    if (Math.random() > this.config.samplingRate) {
      return;
    }

    // Add timestamp if not provided
    if (!metric.timestamp) {
      metric.timestamp = Date.now();
    }

    // Add memory usage if not provided
    if (metric.memoryBefore === undefined) {
      metric.memoryBefore = this.getMemoryUsage();
    }
    if (metric.memoryAfter === undefined) {
      metric.memoryAfter = this.getMemoryUsage();
    }

    // Store metric
    this.metrics.push(metric);

    // Check for alerts
    this.checkForAlerts(metric);

    // Limit metrics storage
    if (this.metrics.length > this.config.maxMetrics) {
      this.metrics = this.metrics.slice(-this.config.maxMetrics);
    }
  }

  /**
   * Start performance measurement for an operation
   */
  startMeasurement(operation: string, adapterType: string): () => PerformanceMetrics {
    const startTime = Date.now();
    const memoryBefore = this.getMemoryUsage();

    return (): PerformanceMetrics => {
      const endTime = Date.now();
      const memoryAfter = this.getMemoryUsage();
      const duration = endTime - startTime;

      const metric: PerformanceMetrics = {
        operation,
        adapterType,
        timestamp: startTime,
        duration,
        success: true,
        memoryBefore,
        memoryAfter,
      };

      this.recordMetric(metric);
      return metric;
    };
  }

  /**
   * Record a failed operation
   */
  recordFailure(operation: string, adapterType: string, error: string, duration?: number): void {
    const metric: PerformanceMetrics = {
      operation,
      adapterType,
      timestamp: Date.now(),
      duration: duration || 0,
      success: false,
      error,
      memoryBefore: this.getMemoryUsage(),
      memoryAfter: this.getMemoryUsage(),
    };

    this.recordMetric(metric);
  }

  /**
   * Get performance statistics for a specific operation
   */
  getStats(operation?: string, adapterType?: string, _timeWindow?: number): PerformanceStats {
    const filteredMetrics = this.metrics.filter(metric => {
      if (operation && metric.operation !== operation) {
        return false;
      }
      if (adapterType && metric.adapterType !== adapterType) {
        return false;
      }
      return true;
    });

    if (filteredMetrics.length === 0) {
      return this.getEmptyStats();
    }

    const durations = filteredMetrics.map(m => m.duration);
    const sortedDurations = durations.sort((a, b) => a - b);
    const successfulMetrics = filteredMetrics.filter(m => m.success);
    const memoryUsages = filteredMetrics
      .filter(m => m.memoryBefore !== undefined && m.memoryAfter !== undefined)
      .map(m => (m.memoryAfter || 0) - (m.memoryBefore || 0));

    const stats: PerformanceStats = {
      totalOperations: filteredMetrics.length,
      successfulOperations: successfulMetrics.length,
      failedOperations: filteredMetrics.length - successfulMetrics.length,
      avgDuration: durations.reduce((sum, d) => sum + d, 0) / durations.length,
      minDuration: Math.min(...durations),
      maxDuration: Math.max(...durations),
      p95Duration: sortedDurations[Math.floor(sortedDurations.length * 0.95)],
      p99Duration: sortedDurations[Math.floor(sortedDurations.length * 0.99)],
      opsPerSecond: this.calculateOpsPerSecond(filteredMetrics),
      successRate: (successfulMetrics.length / filteredMetrics.length) * 100,
      avgMemoryUsage: memoryUsages.length > 0 ? memoryUsages.reduce((sum, m) => sum + m, 0) / memoryUsages.length : 0,
      memoryGrowthRate: this.calculateMemoryGrowthRate(filteredMetrics),
    };

    return stats;
  }

  /**
   * Get performance trends over time
   */
  getTrends(operation?: string, timeWindow?: number): {
    timestamps: number[];
    durations: number[];
    successRates: number[];
  } {
    const now = Date.now();
    const window = timeWindow || 60 * 60 * 1000; // 1 hour default
    const cutoff = now - window;

    const filteredMetrics = this.metrics
      .filter(metric => metric.timestamp >= cutoff)
      .filter(metric => !operation || metric.operation === operation)
      .sort((a, b) => a.timestamp - b.timestamp);

    // Group metrics by time intervals (5 minutes)
    const interval = 5 * 60 * 1000; // 5 minutes
    const grouped = new Map<number, PerformanceMetrics[]>();

    filteredMetrics.forEach(metric => {
      const timeKey = Math.floor(metric.timestamp / interval) * interval;
      if (!grouped.has(timeKey)) {
        grouped.set(timeKey, []);
      }
      const group = grouped.get(timeKey);
      if (group) {
        group.push(metric);
      }
    });

    const timestamps = Array.from(grouped.keys());
    const durations = Array.from(grouped.values()).map(group =>
      group.reduce((sum, m) => sum + m.duration, 0) / group.length,
    );
    const successRates = Array.from(grouped.values()).map(group =>
      (group.filter(m => m.success).length / group.length) * 100,
    );

    return { timestamps, durations, successRates };
  }

  /**
   * Get recent alerts
   */
  getRecentAlerts(limit: number = 50): PerformanceAlert[] {
    return this.alertHistory
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, limit);
  }

  /**
   * Get performance recommendations
   */
  getRecommendations(): string[] {
    const recommendations: string[] = [];
    const stats = this.getStats();

    // Check success rate
    if (stats.successRate < 95) {
      recommendations.push(`Low success rate detected (${stats.successRate.toFixed(1)}%). Consider investigating error patterns.`);
    }

    // Check average duration
    if (stats.avgDuration > this.config.thresholds.slowOperationThreshold) {
      recommendations.push(`Average operation duration (${stats.avgDuration.toFixed(0)}ms) exceeds threshold. Consider optimization.`);
    }

    // Check memory usage
    if (stats.memoryGrowthRate > this.config.thresholds.memoryLeakThreshold) {
      recommendations.push('High memory growth rate detected. Potential memory leak.');
    }

    // Check performance degradation
    const recentStats = this.getStats(undefined, undefined, 60 * 60 * 1000); // Last hour
    if (recentStats.avgDuration > stats.avgDuration * 1.2) {
      recommendations.push(`Performance degradation detected. Recent operations are ${(recentStats.avgDuration / stats.avgDuration).toFixed(1)}x slower than average.`);
    }

    return recommendations;
  }

  /**
   * Optimize adapter performance
   */
  optimizeAdapter(adapter: BaseAdapter): OptimizationReport {
    const adapterType = adapter.type;
    const stats = this.getStats(undefined, adapterType);
    const recommendations: string[] = [];

    // Analyze performance patterns
    const slowOperations = this.metrics
      .filter(m => m.adapterType === adapterType && m.duration > this.config.thresholds.slowOperationThreshold)
      .sort((a, b) => b.duration - a.duration)
      .slice(0, 5);

    if (slowOperations.length > 0) {
      recommendations.push(`Focus on optimizing these slow operations: ${slowOperations.map(o => o.operation).join(', ')}`);
    }

    // Check error patterns
    const errorOperations = this.metrics
      .filter(m => m.adapterType === adapterType && !m.success)
      .reduce((acc, m) => {
        const key = m.error || 'Unknown error';
        acc[key] = (acc[key] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

    const commonErrors = Object.entries(errorOperations)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3);

    if (commonErrors.length > 0) {
      recommendations.push(`Common errors to address: ${commonErrors.map(([error, count]) => `${error} (${count} times)`).join(', ')}`);
    }

    // Memory optimization suggestions
    if (stats.memoryGrowthRate > 0) {
      recommendations.push('Consider implementing memory pooling or reducing object allocations.');
    }

    // Concurrency suggestions
    if (stats.opsPerSecond < 10) {
      recommendations.push('Consider implementing batching or parallel processing for better throughput.');
    }

    return {
      adapterType,
      currentStats: stats,
      recommendations,
      optimizationPotential: this.calculateOptimizationPotential(stats),
    };
  }

  /**
   * Update configuration
   */
  updateConfig(config: Partial<PerformanceMonitorConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Get current configuration
   */
  getConfig(): PerformanceMonitorConfig {
    return { ...this.config };
  }

  /**
   * Export performance data
   */
  exportData(): {
    metrics: PerformanceMetrics[];
    alerts: PerformanceAlert[];
    config: PerformanceMonitorConfig;
    } {
    return {
      metrics: [...this.metrics],
      alerts: [...this.alertHistory],
      config: { ...this.config },
    };
  }

  /**
   * Clear all performance data
   */
  clearData(): void {
    this.metrics = [];
    this.alertHistory = [];
    this.baselineStats.clear();
  }

  // Private methods

  getMemoryUsage(): number {
    if (typeof performance !== 'undefined' && 'memory' in performance) {
      const perfMemory = performance as Performance & {
        memory: {
          usedJSHeapSize: number;
        };
      };
      return perfMemory.memory.usedJSHeapSize;
    }
    return 0;
  }

  private calculateOpsPerSecond(metrics: PerformanceMetrics[]): number {
    if (metrics.length < 2) {
      return 0;
    }

    const timeSpan = metrics[metrics.length - 1].timestamp - metrics[0].timestamp;
    return (metrics.length / timeSpan) * 1000;
  }

  private calculateMemoryGrowthRate(metrics: PerformanceMetrics[]): number {
    const memoryMetrics = metrics.filter(m => m.memoryBefore !== undefined && m.memoryAfter !== undefined);
    if (memoryMetrics.length < 2) {
      return 0;
    }

    const first = memoryMetrics[0];
    const last = memoryMetrics[memoryMetrics.length - 1];
    const timeSpan = last.timestamp - first.timestamp;
    const memoryGrowth = (last.memoryAfter || 0) - (last.memoryBefore || 0) - ((first.memoryAfter || 0) - (first.memoryBefore || 0));

    return (memoryGrowth / timeSpan) * 1000; // bytes per second
  }

  private getEmptyStats(): PerformanceStats {
    return {
      totalOperations: 0,
      successfulOperations: 0,
      failedOperations: 0,
      avgDuration: 0,
      minDuration: 0,
      maxDuration: 0,
      p95Duration: 0,
      p99Duration: 0,
      opsPerSecond: 0,
      successRate: 0,
      avgMemoryUsage: 0,
      memoryGrowthRate: 0,
    };
  }

  private calculateOptimizationPotential(stats: PerformanceStats): 'low' | 'medium' | 'high' {
    let score = 0;

    // Success rate impact
    if (stats.successRate < 90) {
      score += 3;
    } else if (stats.successRate < 95) {
      score += 2;
    } else if (stats.successRate < 99) {
      score += 1;
    }

    // Duration impact
    if (stats.avgDuration > 2000) {
      score += 3;
    } else if (stats.avgDuration > 1000) {
      score += 2;
    } else if (stats.avgDuration > 500) {
      score += 1;
    }

    // Memory impact
    if (stats.memoryGrowthRate > 1000000) {
      score += 3;
      // 1MB/s
    } else if (stats.memoryGrowthRate > 500000) {
      score += 2;
      // 500KB/s
    } else if (stats.memoryGrowthRate > 100000) {
      score += 1;
      // 100KB/s
    }

    if (score >= 7) {
      return 'high';
    }
    if (score >= 4) {
      return 'medium';
    }
    return 'low';
  }

  private checkForAlerts(metric: PerformanceMetrics): void {
    const alerts: PerformanceAlert[] = [];

    // Slow operation alert
    if (metric.duration > this.config.thresholds.slowOperationThreshold) {
      alerts.push({
        id: `slow-${metric.operation}-${Date.now()}`,
        type: 'slow_operation',
        severity: metric.duration > this.config.thresholds.slowOperationThreshold * 2 ? 'high' : 'medium',
        message: `Slow operation detected: ${metric.operation} took ${metric.duration}ms`,
        timestamp: Date.now(),
        metrics: metric,
      });
    }

    // Check error rate
    const recentMetrics = this.metrics.filter(m =>
      m.adapterType === metric.adapterType &&
      m.timestamp > Date.now() - 60000, // Last minute
    );

    if (recentMetrics.length >= 10) {
      const errorRate = (recentMetrics.filter(m => !m.success).length / recentMetrics.length) * 100;
      if (errorRate > this.config.thresholds.highErrorRateThreshold) {
        alerts.push({
          id: `error-rate-${metric.adapterType}-${Date.now()}`,
          type: 'high_error_rate',
          severity: errorRate > 50 ? 'critical' : 'high',
          message: `High error rate detected: ${errorRate.toFixed(1)}% for ${metric.adapterType}`,
          timestamp: Date.now(),
          metrics: metric,
          details: { errorRate, recentOperations: recentMetrics.length },
        });
      }
    }

    // Memory leak alert
    if (metric.memoryBefore !== undefined && metric.memoryAfter !== undefined) {
      const memoryGrowth = metric.memoryAfter - metric.memoryBefore;
      if (memoryGrowth > this.config.thresholds.memoryLeakThreshold) {
        alerts.push({
          id: `memory-leak-${metric.operation}-${Date.now()}`,
          type: 'memory_leak',
          severity: 'high',
          message: `Potential memory leak detected: ${(memoryGrowth / 1024 / 1024).toFixed(1)}MB growth`,
          timestamp: Date.now(),
          metrics: metric,
          details: { memoryGrowth },
        });
      }
    }

    // Trigger alert callbacks
    alerts.forEach(alert => {
      this.alertHistory.push(alert);
      if (this.config.onAlert) {
        this.config.onAlert(alert);
      }
    });

    // Limit alert history
    if (this.alertHistory.length > 1000) {
      this.alertHistory = this.alertHistory.slice(-1000);
    }
  }

  private cleanup(): void {
    const cutoff = Date.now() - this.config.retentionPeriod;

    // Remove old metrics
    this.metrics = this.metrics.filter(m => m.timestamp > cutoff);

    // Remove old alerts
    this.alertHistory = this.alertHistory.filter(a => a.timestamp > cutoff);
  }
}

/**
 * Optimization report interface
 */
export interface OptimizationReport {
  /** Adapter type */
  adapterType: string;
  /** Current performance statistics */
  currentStats: PerformanceStats;
  /** Optimization recommendations */
  recommendations: string[];
  /** Optimization potential */
  optimizationPotential: 'low' | 'medium' | 'high';
}

// Export singleton instance
export const performanceMonitor = PerformanceMonitor.getInstance();
