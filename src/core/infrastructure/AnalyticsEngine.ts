// src/core/infrastructure/AnalyticsEngine.ts
// Comprehensive analytics and metrics collection system

import type { PerformanceMetrics as _PerformanceMetrics } from './PerformanceMonitor';
import { performanceMonitor as _performanceMonitor } from './PerformanceMonitor';

/**
 * Analytics event types
 */
export type AnalyticsEventType =
  | 'user_action'
  | 'system_event'
  | 'performance_metric'
  | 'business_metric'
  | 'error_event'
  | 'feature_usage'
  | 'adapter_health'
  | 'cache_performance';

/**
 * Analytics event interface
 */
export interface AnalyticsEvent {
  id: string;
  type: AnalyticsEventType;
  timestamp: number;
  feature: string;
  action: string;
  userId?: string;
  sessionId?: string;
  metadata: Record<string, unknown>;
  value?: number;
  tags?: string[];
}

/**
 * Analytics aggregation
 */
export interface AnalyticsAggregation {
  type: 'count' | 'sum' | 'average' | 'min' | 'max' | 'percentile';
  field?: string;
  filters?: Record<string, unknown>;
  timeRange?: { start: number; end: number };
  groupBy?: string[];
}

/**
 * Analytics query result
 */
export interface AnalyticsResult {
  data: unknown[];
  metadata: {
    totalEvents: number;
    timeRange: { start: number; end: number };
    aggregation: AnalyticsAggregation;
    generatedAt: number;
  };
}

/**
 * Analytics configuration
 */
export interface AnalyticsConfig {
  enabled: boolean;
  batchSize: number;
  flushInterval: number;
  retentionPeriod: number; // days
  enableRealTime: boolean;
  enableAggregation: boolean;
  enableExport: boolean;
  storageBackend: 'memory' | 'indexeddb' | 'remote';
}

/**
 * Analytics engine for collecting and analyzing system metrics
 */
export class AnalyticsEngine {
  private static instance: AnalyticsEngine;
  private config: AnalyticsConfig;
  private events: AnalyticsEvent[] = [];
  private subscribers: Set<(event: AnalyticsEvent) => void> = new Set();
  private flushTimer: NodeJS.Timeout | null = null;
  private sessionId: string;
  private isInitialized = false;

  private constructor() {
    this.config = this.getDefaultConfig({});
    this.sessionId = this.generateSessionId();
  }

  /**
   * Get singleton instance
   */
  static getInstance(): AnalyticsEngine {
    if (!AnalyticsEngine.instance) {
      AnalyticsEngine.instance = new AnalyticsEngine();
    }
    return AnalyticsEngine.instance;
  }

  /**
   * Initialize analytics engine
   */
  async initialize(config: Partial<AnalyticsConfig> = {}): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    this.config = { ...this.config, ...config };

    if (!this.config.enabled) {
      console.log('Analytics engine is disabled');
      return;
    }

    // Start flush timer
    this.startFlushTimer();

    // Load existing events from storage
    await this.loadEvents();

    this.isInitialized = true;
    console.log('Analytics engine initialized');
  }

  /**
   * Track an event
   */
  track(event: Omit<AnalyticsEvent, 'id' | 'timestamp'>): void {
    if (!this.config.enabled || !this.isInitialized) {
      return;
    }

    const fullEvent: AnalyticsEvent = {
      ...event,
      id: this.generateEventId(),
      timestamp: Date.now(),
      sessionId: this.sessionId,
    };

    this.events.push(fullEvent);

    // Notify subscribers for real-time analytics
    if (this.config.enableRealTime) {
      this.subscribers.forEach(subscriber => {
        try {
          subscriber(fullEvent);
        } catch (error) {
          console.warn('Error in analytics subscriber:', error);
        }
      });
    }

    // Auto-flush if batch size reached
    if (this.events.length >= this.config.batchSize) {
      this.flushEvents();
    }
  }

  /**
   * Track user action
   */
  trackUserAction(feature: string, action: string, metadata: Record<string, unknown> = {}): void {
    this.track({
      type: 'user_action',
      feature,
      action,
      metadata,
      tags: ['user', 'action'],
    });
  }

  /**
   * Track system event
   */
  trackSystemEvent(feature: string, action: string, metadata: Record<string, unknown> = {}): void {
    this.track({
      type: 'system_event',
      feature,
      action,
      metadata,
      tags: ['system', 'event'],
    });
  }

  /**
   * Track performance metric
   */
  trackPerformanceMetric(feature: string, action: string, value: number, metadata: Record<string, unknown> = {}): void {
    this.track({
      type: 'performance_metric',
      feature,
      action,
      value,
      metadata,
      tags: ['performance', 'metric'],
    });
  }

  /**
   * Track business metric
   */
  trackBusinessMetric(feature: string, action: string, value: number, metadata: Record<string, unknown> = {}): void {
    this.track({
      type: 'business_metric',
      feature,
      action,
      value,
      metadata,
      tags: ['business', 'metric'],
    });
  }

  /**
   * Track error event
   */
  trackError(feature: string, error: string, metadata: Record<string, unknown> = {}): void {
    this.track({
      type: 'error_event',
      feature,
      action: 'error_occurred',
      metadata: { ...metadata, error },
      tags: ['error', 'system'],
    });
  }

  /**
   * Track feature usage
   */
  trackFeatureUsage(feature: string, action: string, userId?: string, metadata: Record<string, unknown> = {}): void {
    this.track({
      type: 'feature_usage',
      feature,
      action,
      userId,
      metadata,
      tags: ['feature', 'usage'],
    });
  }

  /**
   * Track adapter health
   */
  trackAdapterHealth(feature: string, adapter: string, status: string, metadata: Record<string, unknown> = {}): void {
    this.track({
      type: 'adapter_health',
      feature,
      action: 'health_check',
      metadata: { ...metadata, adapter, status },
      tags: ['adapter', 'health'],
    });
  }

  /**
   * Track cache performance
   */
  trackCachePerformance(feature: string, action: string, hitRate: number, metadata: Record<string, unknown> = {}): void {
    this.track({
      type: 'cache_performance',
      feature,
      action,
      value: hitRate,
      metadata: { ...metadata, hitRate },
      tags: ['cache', 'performance'],
    });
  }

  /**
   * Query analytics data
   */
  async query(aggregation: AnalyticsAggregation): Promise<AnalyticsResult> {
    if (!this.isInitialized) {
      throw new Error('Analytics engine not initialized');
    }

    const filteredEvents = this.filterEvents(aggregation);
    const aggregatedData = this.aggregateData(filteredEvents, aggregation);

    const timeRange = aggregation.timeRange || this.getTimeRange(filteredEvents);

    return {
      data: aggregatedData,
      metadata: {
        totalEvents: filteredEvents.length,
        timeRange,
        aggregation,
        generatedAt: Date.now(),
      },
    };
  }

  /**
   * Get real-time metrics
   */
  getRealTimeMetrics(): {
    eventsPerSecond: number;
    activeUsers: number;
    topFeatures: Array<{ feature: string; count: number }>;
    errorRate: number;
    averageResponseTime: number;
    } {
    const now = Date.now();
    const lastMinute = now - 60000;
    const recentEvents = this.events.filter(e => e.timestamp >= lastMinute);

    const eventsPerSecond = recentEvents.length / 60;
    const activeUsers = new Set(recentEvents.filter(e => e.userId).map(e => e.userId ?? '')).size;

    const featureCounts = new Map<string, number>();
    recentEvents.forEach(e => {
      featureCounts.set(e.feature, (featureCounts.get(e.feature) || 0) + 1);
    });

    const topFeatures = Array.from(featureCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([feature, count]) => ({ feature, count }));

    const errorEvents = recentEvents.filter(e => e.type === 'error_event');
    const errorRate = recentEvents.length > 0 ? (errorEvents.length / recentEvents.length) * 100 : 0;

    const performanceEvents = recentEvents.filter(e => e.type === 'performance_metric' && e.value);
    const averageResponseTime = performanceEvents.length > 0
      ? performanceEvents.reduce((sum, e) => sum + (e.value || 0), 0) / performanceEvents.length
      : 0;

    return {
      eventsPerSecond,
      activeUsers,
      topFeatures,
      errorRate,
      averageResponseTime,
    };
  }

  /**
   * Get feature analytics
   */
  async getFeatureAnalytics(feature: string, timeRange?: { start: number; end: number }): Promise<{
    totalEvents: number;
    uniqueUsers: number;
    topActions: Array<{ action: string; count: number }>;
    errorRate: number;
    averagePerformance: number;
    usageTrend: Array<{ timestamp: number; count: number }>;
  }> {
    const filteredEvents = this.events.filter(e =>
      e.feature === feature &&
      (!timeRange || (e.timestamp >= timeRange.start && e.timestamp <= timeRange.end)),
    );

    const uniqueUsers = new Set(filteredEvents.filter(e => e.userId).map(e => e.userId ?? '')).size;

    const actionCounts = new Map<string, number>();
    filteredEvents.forEach(e => {
      actionCounts.set(e.action, (actionCounts.get(e.action) || 0) + 1);
    });

    const topActions = Array.from(actionCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([action, count]) => ({ action, count }));

    const errorEvents = filteredEvents.filter(e => e.type === 'error_event');
    const errorRate = filteredEvents.length > 0 ? (errorEvents.length / filteredEvents.length) * 100 : 0;

    const performanceEvents = filteredEvents.filter(e => e.type === 'performance_metric' && e.value);
    const averagePerformance = performanceEvents.length > 0
      ? performanceEvents.reduce((sum, e) => sum + (e.value || 0), 0) / performanceEvents.length
      : 0;

    // Generate usage trend (hourly buckets)
    const usageTrend = this.generateUsageTrend(filteredEvents);

    return {
      totalEvents: filteredEvents.length,
      uniqueUsers,
      topActions,
      errorRate,
      averagePerformance,
      usageTrend,
    };
  }

  /**
   * Export analytics data
   */
  async exportData(format: 'json' | 'csv' = 'json'): Promise<string> {
    if (!this.isInitialized) {
      throw new Error('Analytics engine not initialized');
    }

    if (format === 'json') {
      return JSON.stringify({
        events: this.events,
        metadata: {
          totalEvents: this.events.length,
          sessionId: this.sessionId,
          exportedAt: new Date().toISOString(),
        },
      }, null, 2);
    }

    // CSV format
    const headers = ['id', 'type', 'timestamp', 'feature', 'action', 'userId', 'sessionId', 'value', 'tags'];
    const csvRows = [headers.join(',')];

    this.events.forEach(event => {
      const row = [
        event.id,
        event.type,
        event.timestamp,
        event.feature,
        event.action,
        event.userId || '',
        event.sessionId || '',
        event.value || '',
        event.tags?.join(';') || '',
      ];
      csvRows.push(row.join(','));
    });

    return csvRows.join('\n');
  }

  /**
   * Subscribe to real-time events
   */
  subscribe(callback: (event: AnalyticsEvent) => void): () => void {
    this.subscribers.add(callback);

    return () => {
      this.subscribers.delete(callback);
    };
  }

  /**
   * Clear analytics data
   */
  clearData(): void {
    this.events = [];
    console.log('Analytics data cleared');
  }

  /**
   * Get analytics status
   */
  getStatus(): {
    isActive: boolean;
    config: AnalyticsConfig;
    eventsCount: number;
    subscribersCount: number;
    sessionId: string;
    } {
    return {
      isActive: this.isInitialized,
      config: this.config,
      eventsCount: this.events.length,
      subscribersCount: this.subscribers.size,
      sessionId: this.sessionId,
    };
  }

  /**
   * Shutdown analytics engine
   */
  async shutdown(): Promise<void> {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
      this.flushTimer = null;
    }

    // Flush remaining events
    await this.flushEvents();

    // Save events to storage
    await this.saveEvents();

    this.isInitialized = false;
    console.log('Analytics engine shutdown');
  }

  /**
   * Private methods
   */

  private startFlushTimer(): void {
    this.flushTimer = setInterval(() => {
      this.flushEvents();
    }, this.config.flushInterval);
  }

  private async flushEvents(): Promise<void> {
    if (this.events.length === 0) {
      return;
    }

    const eventsToFlush = this.events.splice(0, this.config.batchSize);

    try {
      // In a real implementation, send to analytics service
      console.log(`Flushing ${eventsToFlush.length} analytics events`);

      // Store events locally for backup
      if (this.config.storageBackend !== 'remote') {
        await this.saveEvents();
      }
    } catch (error) {
      console.error('Failed to flush analytics events:', error);
      // Put events back in queue for retry
      this.events.unshift(...eventsToFlush);
    }
  }

  private filterEvents(aggregation: AnalyticsAggregation): AnalyticsEvent[] {
    let filtered = [...this.events];

    // Apply time range filter
    if (aggregation.timeRange) {
      const { start, end } = aggregation.timeRange;
      filtered = filtered.filter(e =>
        e.timestamp >= start &&
        e.timestamp <= end,
      );
    }

    // Apply custom filters
    if (aggregation.filters) {
      filtered = filtered.filter(e => {
        return Object.entries(aggregation.filters || {}).every(([key, value]) => {
          const eventValue = (e as unknown as Record<string, unknown>)[key];
          if (Array.isArray(value)) {
            return value.includes(eventValue);
          }
          return eventValue === value;
        });
      });
    }

    return filtered;
  }

  private aggregateData(events: AnalyticsEvent[], aggregation: AnalyticsAggregation): unknown[] {
    if (!this.config.enableAggregation || events.length === 0) {
      return events;
    }

    switch (aggregation.type) {
    case 'count':
      return this.aggregateCount(events, aggregation);
    case 'sum':
      return this.aggregateSum(events, aggregation);
    case 'average':
      return this.aggregateAverage(events, aggregation);
    case 'min':
      return this.aggregateMin(events, aggregation);
    case 'max':
      return this.aggregateMax(events, aggregation);
    case 'percentile':
      return this.aggregatePercentile(events, aggregation);
    default:
      return events;
    }
  }

  private aggregateCount(events: AnalyticsEvent[], aggregation: AnalyticsAggregation): unknown[] {
    if (aggregation.groupBy && aggregation.groupBy.length > 0) {
      const grouped = new Map<string, AnalyticsEvent[]>();

      events.forEach(event => {
        const key = (aggregation.groupBy || []).map(field => (event as unknown as Record<string, unknown>)[field]).join('|');
        if (!grouped.has(key)) {
          grouped.set(key, []);
        }
        const group = grouped.get(key);
        if (group) {
          group.push(event);
        }
      });

      return Array.from(grouped.entries()).map(([key, group]) => ({
        key,
        count: group.length,
        group: aggregation.groupBy,
      }));
    }

    return [{ count: events.length }];
  }

  private aggregateSum(events: AnalyticsEvent[], _aggregation: AnalyticsAggregation): unknown[] {
    const values = events
      .map(e => e.value)
      .filter(v => v !== undefined && typeof v === 'number');

    if (values.length === 0) {
      return [{ sum: 0 }];
    }

    const sum = values.reduce((acc, val) => acc + val, 0);
    return [{ sum, count: values.length }];
  }

  private aggregateAverage(events: AnalyticsEvent[], _aggregation: AnalyticsAggregation): unknown[] {
    const values = events
      .map(e => e.value)
      .filter(v => v !== undefined && typeof v === 'number');

    if (values.length === 0) {
      return [{ average: 0 }];
    }

    const sum = values.reduce((acc, val) => acc + val, 0);
    const average = sum / values.length;
    return [{ average, count: values.length }];
  }

  private aggregateMin(events: AnalyticsEvent[], _aggregation: AnalyticsAggregation): unknown[] {
    const values = events
      .map(e => e.value)
      .filter(v => v !== undefined && typeof v === 'number');

    if (values.length === 0) {
      return [{ min: 0 }];
    }

    const min = Math.min(...values);
    return [{ min, count: values.length }];
  }

  private aggregateMax(events: AnalyticsEvent[], _aggregation: AnalyticsAggregation): unknown[] {
    const values = events
      .map(e => e.value)
      .filter(v => v !== undefined && typeof v === 'number');

    if (values.length === 0) {
      return [{ max: 0 }];
    }

    const max = Math.max(...values);
    return [{ max, count: values.length }];
  }

  private aggregatePercentile(events: AnalyticsEvent[], _aggregation: AnalyticsAggregation): unknown[] {
    const values = events
      .map(e => e.value)
      .filter(v => v !== undefined && typeof v === 'number')
      .sort((a, b) => a - b);

    if (values.length === 0) {
      return [{ percentile: 0 }];
    }

    const percentile = 95; // Default to 95th percentile
    const index = Math.floor((percentile / 100) * values.length);
    const value = values[Math.min(index, values.length - 1)];

    return [{ percentile: value, count: values.length }];
  }

  private getTimeRange(events: AnalyticsEvent[]): { start: number; end: number } {
    if (events.length === 0) {
      const now = Date.now();
      return { start: now - 3600000, end: now }; // Default 1 hour
    }

    const timestamps = events.map(e => e.timestamp);
    return {
      start: Math.min(...timestamps),
      end: Math.max(...timestamps),
    };
  }

  private generateUsageTrend(events: AnalyticsEvent[]): Array<{ timestamp: number; count: number }> {
    const bucketSize = 3600000; // 1 hour buckets
    const buckets = new Map<number, number>();

    events.forEach(event => {
      const bucketTime = Math.floor(event.timestamp / bucketSize) * bucketSize;
      buckets.set(bucketTime, (buckets.get(bucketTime) || 0) + 1);
    });

    return Array.from(buckets.entries())
      .map(([timestamp, count]) => ({ timestamp, count }))
      .sort((a, b) => a.timestamp - b.timestamp);
  }

  private generateEventId(): string {
    return `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private async loadEvents(): Promise<void> {
    // In a real implementation, load from storage backend
    // For now, start with empty events
    this.events = [];
  }

  private async saveEvents(): Promise<void> {
    // In a real implementation, save to storage backend
    // For now, just log
    console.log(`Saved ${this.events.length} analytics events`);
  }

  private getDefaultConfig(config: Partial<AnalyticsConfig>): AnalyticsConfig {
    return {
      enabled: true,
      batchSize: 100,
      flushInterval: 30000, // 30 seconds
      retentionPeriod: 30, // 30 days
      enableRealTime: true,
      enableAggregation: true,
      enableExport: true,
      storageBackend: 'memory',
      ...config,
    };
  }
}

// Export singleton instance
export const analyticsEngine = AnalyticsEngine.getInstance();
