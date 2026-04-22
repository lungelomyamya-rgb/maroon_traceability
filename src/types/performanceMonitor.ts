// src/types/PerformanceMonitor.ts
// Lightweight performance monitoring for development only

export interface UserTransformMetrics {
  transformTime: number;
  sourceType: string;
  timestamp: number;
  userId?: string;
}

/**
 * Lightweight performance monitor for user transformations
 * Only active in development mode to avoid production overhead
 */
export class PerformanceMonitor {
  private static metrics: UserTransformMetrics[] = [];
  private static maxMetrics = 100; // Keep only recent metrics

  /**
   * Record a user transformation metric
   */
  static recordTransform(
    transformTime: number,
    sourceType: string,
    userId?: string,
  ): void {
    if (process.env.NODE_ENV !== 'development') {
      return; // Skip in production
    }

    const metric: UserTransformMetrics = {
      transformTime,
      sourceType,
      timestamp: Date.now(),
      userId,
    };

    this.metrics.push(metric);

    // Keep only recent metrics to prevent memory leaks
    if (this.metrics.length > this.maxMetrics) {
      this.metrics.shift();
    }

    // Warn about slow transformations
    if (transformTime > 10) {
      console.warn(`🐌 Slow user transformation: ${transformTime}ms (${sourceType})`);
    }
  }

  /**
   * Get average transformation time by source type
   */
  static getAverageBySource(): Record<string, number> {
    if (process.env.NODE_ENV !== 'development') {
      return {};
    }

    const totals: Record<string, { total: number; count: number }> = {};

    for (const metric of this.metrics) {
      if (!totals[metric.sourceType]) {
        totals[metric.sourceType] = { total: 0, count: 0 };
      }
      totals[metric.sourceType].total += metric.transformTime;
      totals[metric.sourceType].count += 1;
    }

    const averages: Record<string, number> = {};
    for (const [source, data] of Object.entries(totals)) {
      averages[source] = data.total / data.count;
    }

    return averages;
  }

  /**
   * Get recent performance summary
   */
  static getSummary(): {
    totalTransforms: number;
    averageTime: number;
    slowestTransform: number;
    bySource: Record<string, number>;
    } {
    if (process.env.NODE_ENV !== 'development') {
      return {
        totalTransforms: 0,
        averageTime: 0,
        slowestTransform: 0,
        bySource: {},
      };
    }

    const totalTransforms = this.metrics.length;
    const averageTime = totalTransforms > 0
      ? this.metrics.reduce((sum, m) => sum + m.transformTime, 0) / totalTransforms
      : 0;
    const slowestTransform = totalTransforms > 0
      ? Math.max(...this.metrics.map(m => m.transformTime))
      : 0;

    return {
      totalTransforms,
      averageTime,
      slowestTransform,
      bySource: this.getAverageBySource(),
    };
  }

  /**
   * Clear all metrics
   */
  static clear(): void {
    this.metrics = [];
  }

  /**
   * Log performance summary to console
   */
  static logSummary(): void {
    if (process.env.NODE_ENV !== 'development') {
      return;
    }

    const summary = this.getSummary();
    console.log('📊 User Transformation Performance Summary:');
    console.log(`Total transforms: ${summary.totalTransforms}`);
    console.log(`Average time: ${summary.averageTime.toFixed(2)}ms`);
    console.log(`Slowest transform: ${summary.slowestTransform}ms`);
    console.log('By source type:', summary.bySource);
  }
}
