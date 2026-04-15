// Production Error Tracking and Monitoring System

import React from 'react';

export interface ErrorContext {
  userId?: string;
  sessionId?: string;
  route?: string;
  userAgent?: string;
  timestamp: number;
  url?: string;
  component?: string;
  action?: string;
  metadata?: Record<string, unknown>;
  source?: string;
  line?: number;
  column?: number;
  promise?: Promise<unknown>;
  duration?: number;
  startTime?: number;
  method?: string;
  status?: number;
  responseTime?: number;
}

export interface ErrorReport {
  id: string;
  message: string;
  stack?: string;
  type: 'javascript' | 'network' | 'react' | 'unhandled' | 'promise' | 'performance';
  severity: 'low' | 'medium' | 'high' | 'critical';
  context: ErrorContext;
  fingerprint?: string;
  occurrences: number;
  firstSeen: number;
  lastSeen: number;
  resolved: boolean;
}

export interface ErrorTrackingConfig {
  enabled: boolean;
  endpoint?: string;
  apiKey?: string;
  sampleRate: number;
  maxErrors: number;
  enableConsoleLog: boolean;
  enableUserTracking: boolean;
  enablePerformanceTracking: boolean;
  environment: 'development' | 'staging' | 'production';
  releaseVersion?: string;
  tags?: Record<string, string>;
}

export interface ErrorTrackingMetrics {
  totalErrors: number;
  errorsByType: Record<string, number>;
  errorsBySeverity: Record<string, number>;
  topErrors: ErrorReport[];
  errorRate: number;
  averageResolutionTime: number;
}

// Default configuration
const DEFAULT_CONFIG: ErrorTrackingConfig = {
  enabled: true,
  sampleRate: 1.0,
  maxErrors: 100,
  enableConsoleLog: true,
  enableUserTracking: true,
  enablePerformanceTracking: true,
  environment: 'production',
  tags: {},
};

export class ErrorTracker {
  private config: ErrorTrackingConfig;
  private errors: Map<string, ErrorReport> = new Map();
  private sessionId: string;
  private userId?: string;
  private isOnline = true;
  
  constructor(config: Partial<ErrorTrackingConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.sessionId = this.generateSessionId();
    this.initialize();
  }

  private initialize(): void {
    if (!this.config.enabled || typeof window === 'undefined') {
      return;
    }

    // Set up global error handlers
    this.setupGlobalErrorHandlers();
    
    // Set up performance monitoring
    if (this.config.enablePerformanceTracking) {
      this.setupPerformanceMonitoring();
    }

    // Track page visibility changes
    this.setupVisibilityTracking();
    
    // Track online/offline status
    this.setupNetworkTracking();
  }

  private setupGlobalErrorHandlers(): void {
    // Handle uncaught JavaScript errors
    window.onerror = (message, source, lineno, colno, error) => {
      this.captureError(error || new Error(String(message)), {
        type: 'unhandled',
        severity: 'critical',
        context: {
          source,
          line: lineno,
          column: colno,
        } as Partial<ErrorContext>,
      });
    };

    // Handle unhandled promise rejections
    window.onunhandledrejection = (event) => {
      this.captureError(event.reason, {
        type: 'promise',
        severity: 'high',
        context: {
          promise: event.promise,
        } as Partial<ErrorContext>,
      });
    };
  }

  private setupPerformanceMonitoring(): void {
    // Monitor performance metrics
    if ('PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.entryType === 'measure' && entry.duration > 1000) {
              this.captureError(new Error(`Slow operation detected: ${entry.name} took ${entry.duration}ms`), {
                type: 'performance',
                severity: 'medium',
                context: {
                  duration: entry.duration,
                  startTime: entry.startTime,
                } as Partial<ErrorContext>,
              });
            }
          }
        });
        
        observer.observe({ entryTypes: ['measure', 'navigation', 'resource'] });
      } catch (error) {
        console.warn('Performance monitoring not supported:', error);
      }
    }
  }

  private setupVisibilityTracking(): void {
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.trackEvent('page_hidden');
      } else {
        this.trackEvent('page_visible');
      }
    });
  }

  private setupNetworkTracking(): void {
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.trackEvent('network_online');
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
      this.trackEvent('network_offline');
    });
  }

  // Main error capture method
  public captureError(error: Error | string, options: {
    type?: ErrorReport['type'];
    severity?: ErrorReport['severity'];
    context?: Partial<ErrorContext>;
    tags?: Record<string, string>;
  } = {}): string {
    if (!this.config.enabled) {
      return '';
    }

    // Sample errors based on configured rate
    if (Math.random() > this.config.sampleRate) {
      return '';
    }

    const errorObj = typeof error === 'string' ? new Error(error) : error;
    const errorId = this.generateErrorId(errorObj);
    const context = this.buildContext(options.context);
    
    const errorReport: ErrorReport = {
      id: errorId,
      message: errorObj.message,
      stack: errorObj.stack || undefined,
      type: options.type || 'javascript',
      severity: options.severity || this.determineSeverity(errorObj),
      context,
      fingerprint: this.generateFingerprint(errorObj, context),
      occurrences: 1,
      firstSeen: Date.now(),
      lastSeen: Date.now(),
      resolved: false,
    };

    // Update existing error or add new one
    const existing = this.errors.get(errorId);
    if (existing) {
      existing.occurrences++;
      existing.lastSeen = Date.now();
      existing.severity = (Math.max(this.getSeverityWeight(existing.severity), this.getSeverityWeight(errorReport.severity)) > 3 ? 'critical' : Math.max(this.getSeverityWeight(existing.severity), this.getSeverityWeight(errorReport.severity)) > 2 ? 'high' : Math.max(this.getSeverityWeight(existing.severity), this.getSeverityWeight(errorReport.severity)) > 1 ? 'medium' : 'low') as ErrorReport['severity'];
    } else {
      this.errors.set(errorId, errorReport);
      
      // Remove oldest errors if we exceed the limit
      if (this.errors.size > this.config.maxErrors) {
        const oldestId = Array.from(this.errors.entries())
          .sort(([, a], [, b]) => a.firstSeen - b.firstSeen)[0][0];
        this.errors.delete(oldestId);
      }
    }

    // Log to console if enabled
    if (this.config.enableConsoleLog) {
      this.logToConsole(errorReport);
    }

    // Send to monitoring service
    this.sendError(errorReport);

    return errorId;
  }

  // Capture React errors
  public captureReactError(error: Error, errorInfo: React.ErrorInfo): string {
    return this.captureError(error, {
      type: 'react',
      severity: 'high',
      context: {
        component: errorInfo.componentStack || undefined,
        action: 'react_render_error',
      },
    });
  }

  // Capture network errors
  public captureNetworkError(error: Error, request: {
    url: string;
    method: string;
    status?: number;
    responseTime?: number;
  }): string {
    return this.captureError(error, {
      type: 'network',
      severity: this.determineNetworkSeverity(request.status),
      context: {
        url: request.url,
        method: request.method,
        status: request.status,
        responseTime: request.responseTime,
        action: 'network_request',
      } as Partial<ErrorContext>,
    });
  }

  // Set user context
  public setUser(userId: string, userInfo?: Record<string, unknown>): void {
    this.userId = userId;
    if (userInfo) {
      this.trackEvent('user_identified', userInfo);
    }
  }

  // Clear user context
  public clearUser(): void {
    this.userId = undefined;
    this.trackEvent('user_cleared');
  }

  // Track custom events
  public trackEvent(eventName: string, data?: Record<string, unknown>): void {
    if (!this.config.enabled || !this.config.enableUserTracking) {
      return;
    }

    const context = this.buildContext({
      action: eventName,
      metadata: data,
    });

    // Send event to monitoring service
    this.sendEvent({
      name: eventName,
      context,
      timestamp: Date.now(),
    });
  }

  // Get error metrics
  public getMetrics(): ErrorTrackingMetrics {
    const errors = Array.from(this.errors.values());
    const errorsByType: Record<string, number> = {};
    const errorsBySeverity: Record<string, number> = {};

    errors.forEach(error => {
      errorsByType[error.type] = (errorsByType[error.type] || 0) + 1;
      errorsBySeverity[error.severity] = (errorsBySeverity[error.severity] || 0) + 1;
    });

    return {
      totalErrors: errors.length,
      errorsByType,
      errorsBySeverity,
      topErrors: errors
        .sort((a, b) => b.occurrences - a.occurrences)
        .slice(0, 10),
      errorRate: this.calculateErrorRate(),
      averageResolutionTime: this.calculateAverageResolutionTime(),
    };
  }

  // Get specific error
  public getError(errorId: string): ErrorReport | undefined {
    return this.errors.get(errorId);
  }

  // Resolve error
  public resolveError(errorId: string): void {
    const error = this.errors.get(errorId);
    if (error) {
      error.resolved = true;
      this.sendEvent({
        name: 'error_resolved',
        context: error.context,
        timestamp: Date.now(),
        metadata: { errorId },
      });
    }
  }

  // Clear all errors
  public clearErrors(): void {
    this.errors.clear();
  }

  // Private helper methods
  private buildContext(additional?: Partial<ErrorContext>): ErrorContext {
    return {
      userId: this.userId,
      sessionId: this.sessionId,
      route: window.location.pathname,
      userAgent: navigator.userAgent,
      timestamp: Date.now(),
      url: window.location.href,
      ...additional,
    };
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateErrorId(error: Error): string {
    const content = `${error.message}_${error.stack || ''}`;
    return this.hashString(content);
  }

  private generateFingerprint(error: Error, context: ErrorContext): string {
    const content = `${error.message}_${context.route}_${context.component || ''}`;
    return this.hashString(content);
  }

  private hashString(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(36);
  }

  private determineSeverity(error: Error): ErrorReport['severity'] {
    const message = error.message.toLowerCase();
    
    if (message.includes('network') || message.includes('fetch')) {
      return 'medium';
    }
    if (message.includes('critical') || message.includes('fatal')) {
      return 'critical';
    }
    if (message.includes('warning') || message.includes('deprecated')) {
      return 'low';
    }
    
    return 'high';
  }

  private determineNetworkSeverity(status?: number): ErrorReport['severity'] {
    if (!status) {
      return 'medium';
    }
    
    if (status >= 500) {
      return 'critical';
    }
    if (status >= 400) {
      return 'high';
    }
    if (status >= 300) {
      return 'medium';
    }
    
    return 'low';
  }

  private getSeverityWeight(severity: ErrorReport['severity']): number {
    const weights = { low: 1, medium: 2, high: 3, critical: 4 };
    return weights[severity];
  }

  private calculateErrorRate(): number {
    // This would typically be calculated over a time window
    // For now, return a simple rate based on total errors
    return this.errors.size / 100; // Normalized to 0-1
  }

  private calculateAverageResolutionTime(): number {
    const resolvedErrors = Array.from(this.errors.values()).filter((e) => e.resolved);
    if (resolvedErrors.length === 0) {
      return 0;
    }
    
    const totalTime = resolvedErrors.reduce((sum, error) => sum + (error.lastSeen - error.firstSeen), 0);
    return totalTime / resolvedErrors.length;
  }

  private logToConsole(error: ErrorReport): void {
    const logMethod = this.getConsoleMethod(error.severity);
    logMethod.call(console, `[Error Tracker] ${error.type.toUpperCase()}: ${error.message}`, {
      id: error.id,
      severity: error.severity,
      context: error.context,
      occurrences: error.occurrences,
    });
  }

  private getConsoleMethod(severity: ErrorReport['severity']): (...args: unknown[]) => void {
    switch (severity) {
    case 'critical':
    case 'high':
      return console.error;
    case 'medium':
      return console.warn;
    case 'low':
      return console.info;
    default:
      return console.log;
    }
  }

  private async sendError(error: ErrorReport): Promise<void> {
    if (!this.config.endpoint || !this.isOnline) {
      return;
    }

    try {
      const payload = {
        ...error,
        environment: this.config.environment,
        releaseVersion: this.config.releaseVersion,
        tags: this.config.tags,
      };

      await fetch(this.config.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': this.config.apiKey || '',
        },
        body: JSON.stringify(payload),
      });
    } catch (sendError) {
      console.warn('Failed to send error to monitoring service:', sendError);
    }
  }

  private async sendEvent(event: {
    name: string;
    context: ErrorContext;
    timestamp: number;
    metadata?: Record<string, unknown>;
  }): Promise<void> {
    if (!this.config.endpoint || !this.isOnline) {
      return;
    }

    try {
      const payload = {
        ...event,
        environment: this.config.environment,
        releaseVersion: this.config.releaseVersion,
        tags: this.config.tags,
      };

      await fetch(`${this.config.endpoint}/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': this.config.apiKey || '',
        },
        body: JSON.stringify(payload),
      });
    } catch (error) {
      console.warn('Failed to send event to monitoring service:', error);
    }
  }
}

// Global instance
export const errorTracker = new ErrorTracker();

// React Hook for error tracking
export function useErrorTracker(config?: Partial<ErrorTrackingConfig>) {
  const tracker = React.useMemo(() => new ErrorTracker(config), [config]);
  
  React.useEffect(() => {
    return () => {
      // Cleanup if needed
    };
  }, [tracker]);

  return {
    captureError: tracker.captureError.bind(tracker),
    captureReactError: tracker.captureReactError.bind(tracker),
    captureNetworkError: tracker.captureNetworkError.bind(tracker),
    setUser: tracker.setUser.bind(tracker),
    clearUser: tracker.clearUser.bind(tracker),
    trackEvent: tracker.trackEvent.bind(tracker),
    getMetrics: tracker.getMetrics.bind(tracker),
    clearErrors: tracker.clearErrors.bind(tracker),
  };
}
