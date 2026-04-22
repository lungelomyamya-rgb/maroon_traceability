// hooks/analytics/useErrorTracker.ts
// React hooks for error tracking and analytics

import { useState, useEffect, useCallback } from 'react';
import { errorTracker, type ErrorEvent, type ErrorAnalytics } from '@/src/core/analytics/ErrorTracker';

/**
 * Hook for tracking errors and getting analytics
 */
export function useErrorTracker() {
  const [analytics, setAnalytics] = useState<ErrorAnalytics>(errorTracker.getAnalytics());
  const [recentErrors, setRecentErrors] = useState<ErrorEvent[]>(errorTracker.getRecentErrors(10));
  const [lastUpdate, setLastUpdate] = useState(Date.now());

  useEffect(() => {
    const updateData = () => {
      const newAnalytics = errorTracker.getAnalytics();
      const newRecentErrors = errorTracker.getRecentErrors(10);

      setAnalytics(newAnalytics);
      setRecentErrors(newRecentErrors);
      setLastUpdate(Date.now());
    };

    // Initial update
    updateData();

    // Set up polling for real-time updates
    const interval = setInterval(updateData, 15000); // 15 seconds

    return () => clearInterval(interval);
  }, []);

  const trackError = useCallback((
    error: Error,
    type: string,
    adapterType?: string,
    operation?: string,
    severity: ErrorEvent['severity'] = 'medium',
    metadata?: Record<string, unknown>,
  ) => {
    errorTracker.trackException(error, type, adapterType, operation, severity, metadata);

    // Update state after tracking
    const newRecentErrors = errorTracker.getRecentErrors(10);
    setRecentErrors(newRecentErrors);
    setLastUpdate(Date.now());
  }, []);

  const trackErrorEvent = useCallback((errorEvent: ErrorEvent) => {
    errorTracker.trackError(errorEvent);

    // Update state after tracking
    const newRecentErrors = errorTracker.getRecentErrors(10);
    setRecentErrors(newRecentErrors);
    setLastUpdate(Date.now());
  }, []);

  const markRecovered = useCallback((errorId: string, recoveryTime?: number) => {
    errorTracker.markRecovered(errorId, recoveryTime);

    // Update state after marking as recovered
    const newAnalytics = errorTracker.getAnalytics();
    setAnalytics(newAnalytics);
    setLastUpdate(Date.now());
  }, []);

  return {
    analytics,
    recentErrors,
    lastUpdate,
    trackError,
    trackErrorEvent,
    markRecovered,
    errorRate: analytics.errorRate,
    totalErrors: analytics.totalErrors,
    recoveryRate: analytics.recoveryRate,
    hasErrors: analytics.totalErrors > 0,
    hasCriticalErrors: analytics.errorsBySeverity.critical > 0,
    avgRecoveryTime: analytics.avgRecoveryTime,
  };
}

/**
 * Hook for tracking errors in a specific adapter
 */
export function useAdapterErrorTracker(adapterType: string) {
  const [adapterErrors, setAdapterErrors] = useState<ErrorEvent[]>([]);
  const [adapterAnalytics, setAdapterAnalytics] = useState<ErrorAnalytics>(errorTracker.getAnalytics());
  const [lastUpdate, setLastUpdate] = useState(Date.now());

  useEffect(() => {
    const updateAdapterData = () => {
      const newAdapterErrors = errorTracker.getErrorsByType(adapterType, 10);
      const newAnalytics = errorTracker.getAnalytics();

      setAdapterErrors(newAdapterErrors);
      setAdapterAnalytics(newAnalytics);
      setLastUpdate(Date.now());
    };

    // Initial update
    updateAdapterData();

    // Set up polling for real-time updates
    const interval = setInterval(updateAdapterData, 10000); // 10 seconds

    return () => clearInterval(interval);
  }, [adapterType]);

  const trackAdapterError = useCallback((
    error: Error,
    operation: string,
    severity: ErrorEvent['severity'] = 'medium',
    metadata?: Record<string, unknown>,
  ) => {
    errorTracker.trackException(error, `${adapterType}_error`, adapterType, operation, severity, metadata);

    // Update state after tracking
    const newAdapterErrors = errorTracker.getErrorsByType(adapterType, 10);
    setAdapterErrors(newAdapterErrors);
    setLastUpdate(Date.now());
  }, [adapterType]);

  return {
    adapterErrors,
    adapterAnalytics,
    lastUpdate,
    trackAdapterError,
    errorCount: adapterErrors.length,
    hasErrors: adapterErrors.length > 0,
    recentError: adapterErrors[0] || null,
    avgSeverity: calculateAverageSeverity(adapterErrors),
  };
}

/**
 * Hook for error patterns analysis
 */
export function useErrorPatterns() {
  const [patterns, setPatterns] = useState<Array<{
    pattern: string;
    count: number;
    description: string;
  }>>([]);
  const [lastUpdate, setLastUpdate] = useState(Date.now());

  useEffect(() => {
    const updatePatterns = () => {
      const newPatterns = errorTracker.getErrorPatterns();
      setPatterns(newPatterns);
      setLastUpdate(Date.now());
    };

    // Initial update
    updatePatterns();

    // Set up polling for real-time updates
    const interval = setInterval(updatePatterns, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, []);

  return {
    patterns,
    lastUpdate,
    topPattern: patterns[0] || null,
    hasPatterns: patterns.length > 0,
    patternCount: patterns.length,
  };
}

/**
 * Hook for error trends analysis
 */
export function useErrorTrends(timeWindow?: number) {
  const [trends, setTrends] = useState<ErrorAnalytics['trends']>([]);
  const [lastUpdate, setLastUpdate] = useState(Date.now());

  useEffect(() => {
    const updateTrends = () => {
      const analytics = errorTracker.getAnalytics(timeWindow);
      setTrends(analytics.trends);
      setLastUpdate(Date.now());
    };

    // Initial update
    updateTrends();

    // Set up polling for real-time updates
    const interval = setInterval(updateTrends, 60000); // 1 minute

    return () => clearInterval(interval);
  }, [timeWindow]);

  return {
    trends,
    lastUpdate,
    trendCount: trends.length,
    isIncreasing: trends.length > 1 && trends[trends.length - 1].count > trends[trends.length - 2].count,
    isDecreasing: trends.length > 1 && trends[trends.length - 1].count < trends[trends.length - 2].count,
    peakTime: trends.length > 0 ? Math.max(...trends.map(t => t.count)) : 0,
  };
}

/**
 * Hook for error recovery tracking
 */
export function useErrorRecovery() {
  const [recoveryStats, setRecoveryStats] = useState({
    totalRecoveries: 0,
    avgRecoveryTime: 0,
    recoveryRate: 0,
  });
  const [lastUpdate, setLastUpdate] = useState(Date.now());

  useEffect(() => {
    const updateRecoveryStats = () => {
      const analytics = errorTracker.getAnalytics();
      setRecoveryStats({
        totalRecoveries: analytics.recoveryRate > 0 ? Math.round(analytics.totalErrors * (analytics.recoveryRate / 100)) : 0,
        avgRecoveryTime: analytics.avgRecoveryTime,
        recoveryRate: analytics.recoveryRate,
      });
      setLastUpdate(Date.now());
    };

    // Initial update
    updateRecoveryStats();

    // Set up polling for real-time updates
    const interval = setInterval(updateRecoveryStats, 20000); // 20 seconds

    return () => clearInterval(interval);
  }, []);

  const trackRecovery = useCallback((errorId: string, recoveryTime: number) => {
    errorTracker.markRecovered(errorId, recoveryTime);

    // Update stats after tracking recovery
    const newAnalytics = errorTracker.getAnalytics();
    setRecoveryStats({
      totalRecoveries: newAnalytics.recoveryRate > 0 ? Math.round(newAnalytics.totalErrors * (newAnalytics.recoveryRate / 100)) : 0,
      avgRecoveryTime: newAnalytics.avgRecoveryTime,
      recoveryRate: newAnalytics.recoveryRate,
    });
    setLastUpdate(Date.now());
  }, []);

  return {
    recoveryStats,
    lastUpdate,
    trackRecovery,
    isHealthy: recoveryStats.recoveryRate > 80,
    needsAttention: recoveryStats.recoveryRate < 50,
    avgRecoveryTime: recoveryStats.avgRecoveryTime,
  };
}

/**
 * Hook for error severity analysis
 */
export function useErrorSeverity() {
  const [severityStats, setSeverityStats] = useState<Record<string, number>>({
    low: 0,
    medium: 0,
    high: 0,
    critical: 0,
  });
  const [lastUpdate, setLastUpdate] = useState(Date.now());

  useEffect(() => {
    const updateSeverityStats = () => {
      const analytics = errorTracker.getAnalytics();
      setSeverityStats(analytics.errorsBySeverity);
      setLastUpdate(Date.now());
    };

    // Initial update
    updateSeverityStats();

    // Set up polling for real-time updates
    const interval = setInterval(updateSeverityStats, 10000); // 10 seconds

    return () => clearInterval(interval);
  }, []);

  return {
    severityStats,
    lastUpdate,
    totalErrors: Object.values(severityStats).reduce((sum, count) => sum + count, 0),
    hasCriticalErrors: severityStats.critical > 0,
    hasHighErrors: severityStats.high > 0,
    criticalErrorRatio: severityStats.totalErrors > 0 ? (severityStats.critical / severityStats.totalErrors) * 100 : 0,
    worstSeverity: getWorstSeverity(severityStats),
  };
}

// Helper functions

function calculateAverageSeverity(errors: ErrorEvent[]): number {
  if (errors.length === 0) {
    return 0;
  }

  const severityValues = { low: 1, medium: 2, high: 3, critical: 4 };
  const total = errors.reduce((sum, error) => sum + (severityValues[error.severity] || 1), 0);
  return total / errors.length;
}

function getWorstSeverity(severityStats: Record<string, number>): string {
  if (severityStats.critical > 0) {
    return 'critical';
  }
  if (severityStats.high > 0) {
    return 'high';
  }
  if (severityStats.medium > 0) {
    return 'medium';
  }
  if (severityStats.low > 0) {
    return 'low';
  }
  return 'none';
}
