// hooks/monitoring/usePerformanceMonitor.ts
// React hooks for performance monitoring

import { useState, useEffect, useCallback, useRef } from 'react';
import { performanceMonitor, type PerformanceMetrics, type PerformanceStats, type PerformanceAlert } from '@/core/monitoring/PerformanceMonitor';

/**
 * Hook for monitoring overall performance
 */
export function usePerformanceMonitor() {
  const [stats, setStats] = useState<PerformanceStats>(performanceMonitor.getStats());
  const [alerts, setAlerts] = useState<PerformanceAlert[]>([]);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [lastUpdate, setLastUpdate] = useState(Date.now());

  useEffect(() => {
    const updateStats = () => {
      const newStats = performanceMonitor.getStats();
      const newAlerts = performanceMonitor.getRecentAlerts(10);
      const newRecommendations = performanceMonitor.getRecommendations();

      setStats(newStats);
      setAlerts(newAlerts);
      setRecommendations(newRecommendations);
      setLastUpdate(Date.now());
    };

    // Initial update
    updateStats();

    // Set up polling for real-time updates
    const intervalId = setInterval(updateStats, 10000); // 10 seconds

    return () => clearInterval(intervalId);
  }, []);

  const recordOperation = useCallback((operation: string, adapterType: string, duration: number, success: boolean, error?: string) => {
    const metric: PerformanceMetrics = {
      operation,
      adapterType,
      timestamp: Date.now(),
      duration,
      success,
      error,
      memoryBefore: performanceMonitor.getMemoryUsage(),
      memoryAfter: performanceMonitor.getMemoryUsage(),
    };

    performanceMonitor.recordMetric(metric);

    // Update stats after recording
    const newStats = performanceMonitor.getStats();
    setStats(newStats);
    setLastUpdate(Date.now());
  }, []);

  return {
    stats,
    alerts,
    recommendations,
    lastUpdate,
    recordOperation,
    isHealthy: stats.successRate > 95 && stats.avgDuration < 1000,
    hasIssues: stats.successRate < 90 || stats.avgDuration > 2000,
  };
}

/**
 * Hook for monitoring a specific operation
 */
export function useOperationMonitor(operation: string, adapterType: string) {
  const [_metrics, _setMetrics] = useState<PerformanceMetrics[]>([]);
  const [stats, setStats] = useState<PerformanceStats>(performanceMonitor.getStats(operation, adapterType));
  const [lastUpdate, setLastUpdate] = useState<number>(Date.now());

  useEffect(() => {
    const updateMetrics = () => {
      const newStats = performanceMonitor.getStats(operation, adapterType);
      setStats(newStats);
      setLastUpdate(Date.now());
    };

    // Initial update
    updateMetrics();

    // Set up polling for real-time updates
    const intervalId = setInterval(updateMetrics, 5000); // 5 seconds for specific operation

    return () => clearInterval(intervalId);
  }, [operation, adapterType]);

  const recordOperation = useCallback((duration: number, success: boolean, error?: string, metadata?: Record<string, unknown>) => {
    const metric: PerformanceMetrics = {
      operation,
      adapterType,
      timestamp: Date.now(),
      duration,
      success,
      error,
      metadata,
      memoryBefore: performanceMonitor.getMemoryUsage(),
      memoryAfter: performanceMonitor.getMemoryUsage(),
    };

    performanceMonitor.recordMetric(metric);

    // Update stats after recording
    const newStats = performanceMonitor.getStats(operation, adapterType);
    setStats(newStats);
    setLastUpdate(Date.now());
  }, [operation, adapterType]);

  return {
    stats,
    recordOperation,
    lastUpdate,
    isHealthy: stats.successRate > 95 && stats.avgDuration < 1000,
    isSlow: stats.avgDuration > 1000,
    hasHighErrorRate: stats.successRate < 90,
    avgDuration: stats.avgDuration,
    successRate: stats.successRate,
    opsPerSecond: stats.opsPerSecond,
  };
}

/**
 * Hook for automatic performance measurement
 */
export function usePerformanceMeasurement(operation: string, adapterType: string) {
  const startTimeRef = useRef<number>(0);
  const [isRunning, setIsRunning] = useState(false);
  const [lastResult, setLastResult] = useState<PerformanceMetrics | null>(null);

  const startMeasurement = useCallback(() => {
    startTimeRef.current = Date.now();
    setIsRunning(true);
  }, []);

  const endMeasurement = useCallback((success: boolean, error?: string, metadata?: Record<string, unknown>) => {
    if (!startTimeRef.current) {
      throw new Error('Measurement not started');
    }

    const duration = Date.now() - startTimeRef.current;
    const metric: PerformanceMetrics = {
      operation,
      adapterType,
      timestamp: startTimeRef.current || Date.now(),
      duration,
      success,
      error,
      metadata,
      memoryBefore: 0, // Would need to be captured at start
      memoryAfter: performanceMonitor.getMemoryUsage(),
    };

    performanceMonitor.recordMetric(metric);
    setLastResult(metric);
    setIsRunning(false);
    startTimeRef.current = 0;

    return metric;
  }, [operation, adapterType]);

  const measureOperation = useCallback(async <T>(
    operationFn: () => Promise<T>,
    metadata?: Record<string, unknown>,
  ): Promise<{ result: T; metric: PerformanceMetrics }> => {
    startMeasurement();

    try {
      const result = await operationFn();
      const metric = endMeasurement(true, undefined, metadata);
      return { result, metric };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      endMeasurement(false, errorMessage, metadata);
      throw error;
    }
  }, [startMeasurement, endMeasurement]);

  return {
    startMeasurement,
    endMeasurement,
    measureOperation,
    isRunning,
    lastResult,
  };
}

/**
 * Hook for performance trends
 */
export function usePerformanceTrends(operation?: string, timeWindow?: number) {
  const [trends, setTrends] = useState({
    timestamps: [] as number[],
    durations: [] as number[],
    successRates: [] as number[],
  });
  const [lastUpdate, setLastUpdate] = useState(Date.now());

  useEffect(() => {
    const updateTrends = () => {
      const newTrends = performanceMonitor.getTrends(operation, timeWindow);
      setTrends(newTrends);
      setLastUpdate(Date.now());
    };

    // Initial update
    updateTrends();

    // Set up polling for real-time updates
    const interval = setInterval(updateTrends, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [operation, timeWindow]);

  return {
    trends,
    lastUpdate,
    avgDuration: trends.durations.length > 0
      ? trends.durations.reduce((sum, d) => sum + d, 0) / trends.durations.length
      : 0,
    avgSuccessRate: trends.successRates.length > 0
      ? trends.successRates.reduce((sum, r) => sum + r, 0) / trends.successRates.length
      : 0,
    isImproving: trends.durations.length > 1
      ? trends.durations[trends.durations.length - 1] < trends.durations[trends.durations.length - 2]
      : false,
    isDegrading: trends.durations.length > 1
      ? trends.durations[trends.durations.length - 1] > trends.durations[trends.durations.length - 2] * 1.2
      : false,
  };
}

/**
 * Hook for performance alerts
 */
export function usePerformanceAlerts() {
  const [alerts, setAlerts] = useState<PerformanceAlert[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const updateAlerts = () => {
      const newAlerts = performanceMonitor.getRecentAlerts(50);
      const newUnreadCount = newAlerts.filter(alert =>
        alert.timestamp > Date.now() - 60000, // Last minute
      ).length;

      setAlerts(newAlerts);
      setUnreadCount(newUnreadCount);
    };

    // Initial update
    updateAlerts();

    // Set up polling for real-time updates
    const interval = setInterval(updateAlerts, 15000); // 15 seconds

    return () => clearInterval(interval);
  }, []);

  const markAsRead = useCallback(() => {
    setUnreadCount(0);
  }, []);

  const getAlertsByType = useCallback((type: PerformanceAlert['type']) => {
    return alerts.filter(alert => alert.type === type);
  }, [alerts]);

  const getAlertsBySeverity = useCallback((severity: PerformanceAlert['severity']) => {
    return alerts.filter(alert => alert.severity === severity);
  }, [alerts]);

  return {
    alerts,
    unreadCount,
    markAsRead,
    getAlertsByType,
    getAlertsBySeverity,
    hasCriticalAlerts: alerts.some(alert => alert.severity === 'critical'),
    hasHighAlerts: alerts.some(alert => alert.severity === 'high'),
    recentAlerts: alerts.slice(0, 10),
  };
}

/**
 * Hook for performance optimization recommendations
 */
interface PerformanceReport {
  adapterType: string;
  currentStats: PerformanceStats;
  recommendations: string[];
  optimizationPotential: 'high' | 'medium' | 'low';
}

export function usePerformanceOptimization(adapterType: string) {
  const [report, setReport] = useState<PerformanceReport | null>(null);
  const [lastUpdate, setLastUpdate] = useState(Date.now());

  useEffect(() => {
    const updateReport = () => {
      // This would need to be implemented in the performance monitor
      // For now, we'll use the general recommendations
      const recommendations = performanceMonitor.getRecommendations();
      const stats = performanceMonitor.getStats(undefined, adapterType);

      setReport({
        adapterType,
        currentStats: stats,
        recommendations,
        optimizationPotential: stats.avgDuration > 1000 ? 'high' : stats.avgDuration > 500 ? 'medium' : 'low',
      });
      setLastUpdate(Date.now());
    };

    // Initial update
    updateReport();

    // Set up polling for real-time updates
    const interval = setInterval(updateReport, 60000); // 1 minute

    return () => clearInterval(interval);
  }, [adapterType]);

  return {
    report,
    lastUpdate,
    recommendations: report?.recommendations || [],
    optimizationPotential: report?.optimizationPotential || 'low',
    hasRecommendations: (report?.recommendations?.length || 0) > 0,
  };
}
