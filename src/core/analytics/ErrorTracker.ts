// src/core/analytics/ErrorTracker.ts
// Comprehensive error tracking and analytics system

import { performanceMonitor } from '../monitoring/PerformanceMonitor';
import type { PerformanceMetrics as _PerformanceMetrics } from '../monitoring/PerformanceMonitor';
import type { BaseAdapter as _BaseAdapter } from '../types/adapter';

/**
 * Error event interface
 */
export interface ErrorEvent {
  /** Unique error ID */
  id: string;
  /** Error type/category */
  type: string;
  /** Error message */
  message: string;
  /** Error stack trace */
  stack?: string;
  /** Timestamp */
  timestamp: number;
  /** Adapter type where error occurred */
  adapterType?: string;
  /** Operation being performed */
  operation?: string;
  /** Error severity */
  severity: 'low' | 'medium' | 'high' | 'critical';
  /** User context */
  userContext?: {
    userId?: string;
    role?: string;
    sessionId?: string;
  };
  /** System context */
  systemContext?: {
    userAgent?: string;
    url?: string;
    referrer?: string;
    memoryUsage?: number;
    connectionType?: string;
  };
  /** Additional metadata */
  metadata?: Record<string, unknown>;
  /** Whether error was recovered */
  recovered?: boolean;
  /** Recovery time in milliseconds */
  recoveryTime?: number;
  /** Alert type (for internal use) */
  alertType?: string;
  /** Alert message (for internal use) */
  alertMessage?: string;
}

/**
 * Error analytics data
 */
export interface ErrorAnalytics {
  /** Total errors in time period */
  totalErrors: number;
  /** Errors by type */
  errorsByType: Record<string, number>;
  /** Errors by severity */
  errorsBySeverity: Record<string, number>;
  /** Errors by adapter */
  errorsByAdapter: Record<string, number>;
  /** Error rate per hour */
  errorRate: number;
  /** Most common errors */
  topErrors: Array<{
    type: string;
    count: number;
    percentage: number;
  }>;
  /** Recovery rate */
  recoveryRate: number;
  /** Average recovery time */
  avgRecoveryTime: number;
  /** Error trends over time */
  trends: Array<{
    timestamp: number;
    count: number;
    severity: string;
  }>;
}

/**
 * Error tracking configuration
 */
export interface ErrorTrackingConfig {
  /** Enable error tracking */
  enabled: boolean;
  /** Error retention period in milliseconds */
  retentionPeriod: number;
  /** Maximum errors to store */
  maxErrors: number;
  /** Sampling rate (0-1) */
  samplingRate: number;
  /** Enable automatic error recovery */
  enableAutoRecovery: boolean;
  /** Alert thresholds */
  thresholds: {
    /** High error rate threshold (errors per minute) */
    highErrorRate: number;
    /** Critical error threshold */
    criticalErrorThreshold: number;
    /** Recovery time threshold */
    recoveryTimeThreshold: number;
  };
  /** Analytics callback */
  onAnalytics?: (analytics: ErrorAnalytics) => void;
  /** Alert callback */
  onAlert?: (error: ErrorEvent) => void;
}

/**
 * Error tracker class
 */
export class ErrorTracker {
  private static instance: ErrorTracker;
  private errors: ErrorEvent[] = [];
  private config: ErrorTrackingConfig = {
    enabled: true,
    retentionPeriod: 24 * 60 * 60 * 1000, // 24 hours
    maxErrors: 10000,
    samplingRate: 1.0, // 100% sampling
    enableAutoRecovery: true,
    thresholds: {
      highErrorRate: 10, // 10 errors per minute
      criticalErrorThreshold: 5, // 5 critical errors
      recoveryTimeThreshold: 5000, // 5 seconds
    },
  };

  private constructor() {
    // Start cleanup interval
    setInterval(() => this.cleanup(), 60000); // Every minute
  }

  static getInstance(): ErrorTracker {
    if (!ErrorTracker.instance) {
      ErrorTracker.instance = new ErrorTracker();
    }
    return ErrorTracker.instance;
  }

  /**
   * Track an error
   */
  trackError(error: ErrorEvent): void {
    if (!this.config.enabled) {
      return;
    }

    // Apply sampling
    if (Math.random() > this.config.samplingRate) {
      return;
    }

    // Add timestamp if not provided
    if (!error.timestamp) {
      error.timestamp = Date.now();
    }

    // Generate ID if not provided
    if (!error.id) {
      error.id = this.generateErrorId(error);
    }

    // Add system context if not provided
    if (!error.systemContext) {
      error.systemContext = this.getSystemContext();
    }

    // Store error
    this.errors.push(error);

    // Check for alerts
    this.checkForAlerts(error);

    // Limit errors storage
    if (this.errors.length > this.config.maxErrors) {
      this.errors = this.errors.slice(-this.config.maxErrors);
    }
  }

  /**
   * Track error from exception
   */
  trackException(
    error: Error,
    type: string,
    adapterType?: string,
    operation?: string,
    severity: ErrorEvent['severity'] = 'medium',
    metadata?: Record<string, unknown>,
  ): void {
    const errorEvent: ErrorEvent = {
      id: this.generateErrorId({ type, timestamp: Date.now() }),
      type,
      message: error.message,
      stack: error.stack,
      timestamp: Date.now(),
      adapterType,
      operation,
      severity,
      systemContext: this.getSystemContext(),
      metadata,
    };

    this.trackError(errorEvent);
  }

  /**
   * Mark error as recovered
   */
  markRecovered(errorId: string, recoveryTime?: number): void {
    const error = this.errors.find(e => e.id === errorId);
    if (error) {
      error.recovered = true;
      error.recoveryTime = recoveryTime || Date.now() - error.timestamp;
    }
  }

  /**
   * Get error analytics
   */
  getAnalytics(timeWindow?: number): ErrorAnalytics {
    const now = Date.now();
    const window = timeWindow || 60 * 60 * 1000; // 1 hour default
    const cutoff = now - window;

    const recentErrors = this.errors.filter(e => e.timestamp >= cutoff);

    // Calculate analytics
    const totalErrors = recentErrors.length;
    const errorsByType = this.groupBy(recentErrors, 'type');
    const errorsBySeverity = this.groupBy(recentErrors, 'severity');
    const errorsByAdapter = this.groupBy(recentErrors, 'adapterType');
    const errorRate = totalErrors / (window / 60000); // errors per minute

    // Calculate top errors
    const topErrors = Object.entries(errorsByType)
      .map(([type, count]) => ({
        type,
        count,
        percentage: (count / totalErrors) * 100,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Calculate recovery metrics
    const recoveredErrors = recentErrors.filter(e => e.recovered);
    const recoveryRate = totalErrors > 0 ? (recoveredErrors.length / totalErrors) * 100 : 0;
    const avgRecoveryTime = recoveredErrors.length > 0
      ? recoveredErrors.reduce((sum, e) => sum + (e.recoveryTime || 0), 0) / recoveredErrors.length
      : 0;

    // Calculate trends
    const trends = this.calculateErrorTrends(recentErrors);

    const analytics: ErrorAnalytics = {
      totalErrors,
      errorsByType,
      errorsBySeverity,
      errorsByAdapter,
      errorRate,
      topErrors,
      recoveryRate,
      avgRecoveryTime,
      trends,
    };

    // Trigger analytics callback
    if (this.config.onAnalytics) {
      this.config.onAnalytics(analytics);
    }

    return analytics;
  }

  /**
   * Get recent errors
   */
  getRecentErrors(limit: number = 50): ErrorEvent[] {
    return this.errors
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, limit);
  }

  /**
   * Get errors by type
   */
  getErrorsByType(type: string, limit?: number): ErrorEvent[] {
    const filtered = this.errors.filter(e => e.type === type);
    const sorted = filtered.sort((a, b) => b.timestamp - a.timestamp);
    return limit ? sorted.slice(0, limit) : sorted;
  }

  /**
   * Get errors by severity
   */
  getErrorsBySeverity(severity: ErrorEvent['severity'], limit?: number): ErrorEvent[] {
    const filtered = this.errors.filter(e => e.severity === severity);
    const sorted = filtered.sort((a, b) => b.timestamp - a.timestamp);
    return limit ? sorted.slice(0, limit) : sorted;
  }

  /**
   * Get error patterns
   */
  getErrorPatterns(): Array<{
    pattern: string;
    count: number;
    description: string;
  }> {
    const patterns = new Map<string, number>();

    // Analyze error patterns
    this.errors.forEach(error => {
      // Common patterns
      if (error.message.includes('timeout')) {
        patterns.set('timeout_errors', (patterns.get('timeout_errors') || 0) + 1);
      }
      if (error.message.includes('network')) {
        patterns.set('network_errors', (patterns.get('network_errors') || 0) + 1);
      }
      if (error.message.includes('validation')) {
        patterns.set('validation_errors', (patterns.get('validation_errors') || 0) + 1);
      }
      if (error.message.includes('permission')) {
        patterns.set('permission_errors', (patterns.get('permission_errors') || 0) + 1);
      }
      if (error.adapterType) {
        const key = `${error.adapterType}_errors`;
        patterns.set(key, (patterns.get(key) || 0) + 1);
      }
    });

    return Array.from(patterns.entries())
      .map(([pattern, count]) => ({
        pattern,
        count,
        description: this.describePattern(pattern),
      }))
      .sort((a, b) => b.count - a.count);
  }

  /**
   * Update configuration
   */
  updateConfig(config: Partial<ErrorTrackingConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Get current configuration
   */
  getConfig(): ErrorTrackingConfig {
    return { ...this.config };
  }

  /**
   * Export error data
   */
  exportData(): {
    errors: ErrorEvent[];
    config: ErrorTrackingConfig;
    } {
    return {
      errors: [...this.errors],
      config: { ...this.config },
    };
  }

  /**
   * Clear all error data
   */
  clearData(): void {
    this.errors = [];
  }

  // Private methods

  private generateErrorId(error: Partial<ErrorEvent>): string {
    const base = `${error.type || 'error'}-${error.timestamp || Date.now()}`;
    const hash = this.simpleHash(JSON.stringify(error));
    return `${base}-${hash}`;
  }

  private simpleHash(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(16);
  }

  private getSystemContext(): ErrorEvent['systemContext'] {
    return {
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
      url: typeof window !== 'undefined' ? window.location.href : undefined,
      referrer: typeof document !== 'undefined' ? document.referrer : undefined,
      memoryUsage: performanceMonitor.getMemoryUsage(),
      connectionType: typeof navigator !== 'undefined' && 'connection' in navigator
        ? (navigator as { connection?: { effectiveType?: string } }).connection?.effectiveType
        : undefined,
    };
  }

  private groupBy<T>(array: T[], key: keyof T): Record<string, number> {
    return array.reduce((groups, item) => {
      const groupKey = String(item[key] || 'unknown');
      groups[groupKey] = (groups[groupKey] || 0) + 1;
      return groups;
    }, {} as Record<string, number>);
  }

  private calculateErrorTrends(errors: ErrorEvent[]): Array<{
    timestamp: number;
    count: number;
    severity: string;
  }> {
    // Group errors by 15-minute intervals
    const interval = 15 * 60 * 1000; // 15 minutes
    const grouped = new Map<number, ErrorEvent[]>();

    errors.forEach(error => {
      const timeKey = Math.floor(error.timestamp / interval) * interval;
      if (!grouped.has(timeKey)) {
        grouped.set(timeKey, []);
      }
      const timeGroup = grouped.get(timeKey);
      if (timeGroup) {
        timeGroup.push(error);
      }
    });

    return Array.from(grouped.entries())
      .map(([timestamp, group]) => ({
        timestamp,
        count: group.length,
        severity: this.getWorstSeverity(group),
      }))
      .sort((a, b) => a.timestamp - b.timestamp);
  }

  private getWorstSeverity(errors: ErrorEvent[]): string {
    const severityOrder: Record<string, number> = { critical: 4, high: 3, medium: 2, low: 1 };
    return errors.reduce((worst, error) => {
      const severityLevel = severityOrder[error.severity] || 0;
      const worstLevel = severityOrder[worst] || 0;
      return severityLevel > worstLevel ? error.severity : worst;
    }, 'low');
  }

  private describePattern(pattern: string): string {
    const descriptions: Record<string, string> = {
      timeout_errors: 'Operations are timing out, possibly due to network issues or slow services',
      network_errors: 'Network connectivity problems affecting API calls',
      validation_errors: 'Input validation failures, possibly due to invalid user input',
      permission_errors: 'Access control issues, users lacking required permissions',
    };

    if (pattern.endsWith('_errors')) {
      const adapterType = pattern.replace('_errors', '');
      return `Errors occurring in ${adapterType} adapter`;
    }

    return descriptions[pattern] || 'Unknown error pattern';
  }

  private checkForAlerts(error: ErrorEvent): void {
    const alerts: Array<{
      type: 'high_error_rate' | 'critical_error' | 'recovery_time';
      message: string;
    }> = [];

    // Check for critical errors
    if (error.severity === 'critical') {
      alerts.push({
        type: 'critical_error',
        message: `Critical error detected: ${error.type}`,
      });
    }

    // Check for high error rate
    const recentErrors = this.errors.filter(e =>
      e.timestamp > Date.now() - 60000, // Last minute
    );

    if (recentErrors.length >= this.config.thresholds.highErrorRate) {
      alerts.push({
        type: 'high_error_rate',
        message: `High error rate: ${recentErrors.length} errors in last minute`,
      });
    }

    // Check for critical error threshold
    const criticalErrors = recentErrors.filter(e => e.severity === 'critical');
    if (criticalErrors.length >= this.config.thresholds.criticalErrorThreshold) {
      alerts.push({
        type: 'critical_error',
        message: `Critical error threshold exceeded: ${criticalErrors.length} critical errors`,
      });
    }

    // Trigger alert callbacks
    alerts.forEach(alert => {
      if (this.config.onAlert) {
        this.config.onAlert({
          ...error,
          alertType: alert.type,
          alertMessage: alert.message,
        });
      }
    });
  }

  private cleanup(): void {
    const cutoff = Date.now() - this.config.retentionPeriod;

    // Remove old errors
    this.errors = this.errors.filter(e => e.timestamp > cutoff);
  }
}

// Export singleton instance
export const errorTracker = ErrorTracker.getInstance();
