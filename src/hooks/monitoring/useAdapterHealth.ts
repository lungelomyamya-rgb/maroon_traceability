// hooks/monitoring/useAdapterHealth.ts
// React hooks for adapter health monitoring

import { useState, useEffect, useCallback } from 'react';
import { adapterHealthMonitor, type AdapterHealthStatus, type HealthMonitoringConfig } from '@/core/monitoring/AdapterHealthMonitor';

/**
 * Hook for monitoring overall adapter health
 */
export function useAdapterHealth() {
  const [healthStatus, setHealthStatus] = useState<AdapterHealthStatus[]>([]);
  const [systemHealth, setSystemHealth] = useState(adapterHealthMonitor.getSystemHealthSummary());
  const [lastUpdate, setLastUpdate] = useState(Date.now());

  useEffect(() => {
    const updateHealthStatus = () => {
      const status = adapterHealthMonitor.getAllHealthStatus();
      const system = adapterHealthMonitor.getSystemHealthSummary();

      setHealthStatus(status);
      setSystemHealth(system);
      setLastUpdate(Date.now());
    };

    // Initial update
    updateHealthStatus();

    // Set up polling for real-time updates
    const interval = setInterval(updateHealthStatus, 10000); // 10 seconds

    return () => clearInterval(interval);
  }, []);

  const forceHealthCheck = useCallback(async (adapterId?: string) => {
    if (adapterId) {
      await adapterHealthMonitor.forceHealthCheck(adapterId);
    } else {
      // Force health check for all adapters
      const allStatus = adapterHealthMonitor.getAllHealthStatus();
      await Promise.all(
        allStatus.map(status => adapterHealthMonitor.forceHealthCheck(status.adapterId)),
      );
    }

    // Update state after forcing health check
    const status = adapterHealthMonitor.getAllHealthStatus();
    const system = adapterHealthMonitor.getSystemHealthSummary();

    setHealthStatus(status);
    setSystemHealth(system);
    setLastUpdate(Date.now());
  }, []);

  return {
    healthStatus,
    systemHealth,
    lastUpdate,
    forceHealthCheck,
    isHealthy: systemHealth.overall === 'healthy',
    hasIssues: systemHealth.overall !== 'healthy',
  };
}

/**
 * Hook for monitoring a specific adapter's health
 */
export function useSpecificAdapterHealth(adapterId: string) {
  const [healthStatus, setHealthStatus] = useState<AdapterHealthStatus | undefined>();
  const [lastUpdate, setLastUpdate] = useState(Date.now());

  useEffect(() => {
    const updateHealthStatus = () => {
      const status = adapterHealthMonitor.getHealthStatus(adapterId);
      setHealthStatus(status);
      setLastUpdate(Date.now());
    };

    // Initial update
    updateHealthStatus();

    // Set up polling for real-time updates
    const interval = setInterval(updateHealthStatus, 5000); // 5 seconds for specific adapter

    return () => clearInterval(interval);
  }, [adapterId]);

  const forceHealthCheck = useCallback(async () => {
    await adapterHealthMonitor.forceHealthCheck(adapterId);

    // Update state after forcing health check
    const status = adapterHealthMonitor.getHealthStatus(adapterId);
    setHealthStatus(status);
    setLastUpdate(Date.now());
  }, [adapterId]);

  return {
    healthStatus,
    lastUpdate,
    forceHealthCheck,
    isHealthy: healthStatus?.status === 'healthy',
    isUnhealthy: healthStatus?.status === 'unhealthy',
    isDegraded: healthStatus?.status === 'degraded',
    isUnknown: healthStatus?.status === 'unknown',
    uptime: healthStatus?.uptime || 0,
    responseTime: healthStatus?.responseTime,
  };
}

/**
 * Hook for getting unhealthy adapters
 */
export function useUnhealthyAdapters() {
  const [unhealthyAdapters, setUnhealthyAdapters] = useState<AdapterHealthStatus[]>([]);
  const [lastUpdate, setLastUpdate] = useState(Date.now());

  useEffect(() => {
    const updateUnhealthyAdapters = () => {
      const unhealthy = adapterHealthMonitor.getUnhealthyAdapters();
      setUnhealthyAdapters(unhealthy);
      setLastUpdate(Date.now());
    };

    // Initial update
    updateUnhealthyAdapters();

    // Set up polling for real-time updates
    const interval = setInterval(updateUnhealthyAdapters, 15000); // 15 seconds

    return () => clearInterval(interval);
  }, []);

  const retryAll = useCallback(async () => {
    // Force health check on all unhealthy adapters
    await Promise.all(
      unhealthyAdapters.map(adapter => adapterHealthMonitor.forceHealthCheck(adapter.adapterId)),
    );

    // Update state after retry
    const unhealthy = adapterHealthMonitor.getUnhealthyAdapters();
    setUnhealthyAdapters(unhealthy);
    setLastUpdate(Date.now());
  }, [unhealthyAdapters]);

  return {
    unhealthyAdapters,
    lastUpdate,
    retryAll,
    hasUnhealthy: unhealthyAdapters.length > 0,
    unhealthyCount: unhealthyAdapters.length,
  };
}

/**
 * Hook for health monitoring configuration
 */
export function useHealthMonitoringConfig() {
  const [configs, setConfigs] = useState<Record<string, unknown>>({});

  const updateConfig = useCallback((adapterId: string, config: Partial<HealthMonitoringConfig>) => {
    adapterHealthMonitor.updateMonitoringConfig(adapterId, config);
    setConfigs(prev => ({ ...prev, [adapterId]: config }));
  }, []);

  return {
    configs,
    updateConfig,
  };
}
