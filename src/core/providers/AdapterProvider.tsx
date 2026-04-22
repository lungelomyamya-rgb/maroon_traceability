// src/core/providers/AdapterProvider.tsx
// React provider for adapter dependency injection

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { AdapterSelectionCriteria } from '../../types/registry';
import { adapterRegistry, type AdapterConstructor } from '../adapters/AdapterRegistry';
import { healthMonitor } from '../services/HealthMonitor';
import { serviceOrchestrator } from '../services/ServiceOrchestrator';
import type { BaseAdapter, AdapterConfig } from '../types/adapter';
import type { AdapterHealthStatus } from '../types/config';

/**
 * Registry statistics interface
 */
interface RegistryStats {
  total: number;
  healthy: number;
  unhealthy: number;
  byType: Record<string, number>;
  activeInstances: number;
  unhealthyAdapters: string[];
}

/**
 * Adapter provider context value
 */
interface AdapterContextValue {
  /** Get adapter by criteria */
  getAdapter: (criteria: AdapterSelectionCriteria) => Promise<BaseAdapter | null>;
  /** Get adapter by ID */
  getAdapterById: (id: string) => BaseAdapter | null;
  /** Register adapter constructor */
  registerAdapter: <T extends BaseAdapter>(
    type: string,
    feature: string,
    constructor: new (config?: AdapterConfig) => T
  ) => void;
  /** Create adapter instance */
  createAdapter: <T extends BaseAdapter>(
    type: string,
    feature: string,
    config?: AdapterConfig
  ) => Promise<T>;
  /** Get registry stats */
  getRegistryStats: () => RegistryStats;
  /** Get health status */
  getHealthStatus: () => Record<string, AdapterHealthStatus>;
  /** Is initialized */
  isInitialized: boolean;
  /** Initialization error */
  initializationError: Error | null;
}

/**
 * Adapter context
 */
const AdapterContext = createContext<AdapterContextValue | null>(null);

/**
 * Props for AdapterProvider
 */
interface AdapterProviderProps {
  children: React.ReactNode;
  config?: {
    autoInitialize?: boolean;
    enableHealthMonitoring?: boolean;
    _registryConfig?: Record<string, unknown>;
  };
}

/**
 * Adapter Provider Component
 */
export const AdapterProvider: React.FC<AdapterProviderProps> = ({
  children,
  config = {},
}) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [initializationError, setInitializationError] = useState<Error | null>(null);

  const {
    autoInitialize = true,
    enableHealthMonitoring = true,
    _registryConfig = {},
  } = config;

  /**
   * Initialize the adapter system
   */
  const initialize = useCallback(async () => {
    try {
      console.log('Initializing Adapter Provider...');

      // Register services with orchestrator
      serviceOrchestrator.registerService('adapterRegistry', adapterRegistry);
      serviceOrchestrator.registerService('healthMonitor', healthMonitor);

      // Set up dependencies
      serviceOrchestrator.registerDependency('healthMonitor', ['adapterRegistry']);

      // Initialize services in order
      await serviceOrchestrator.initialize();

      // Start health monitoring if enabled
      if (enableHealthMonitoring) {
        healthMonitor.start();
      }

      setIsInitialized(true);
      console.log('Adapter Provider initialized successfully');
    } catch (error) {
      const err = error as Error;
      setInitializationError(err);
      console.error('Failed to initialize Adapter Provider:', err);
    }
  }, [enableHealthMonitoring]);

  /**
   * Get adapter by criteria
   */
  const getAdapter = useCallback(async (
    criteria: AdapterSelectionCriteria,
  ): Promise<BaseAdapter | null> => {
    if (!isInitialized) {
      console.warn('Adapter system not initialized');
      return null;
    }

    try {
      // Transform criteria to match registry format
      const registryCriteria = {
        type: criteria.feature,
        available: true,
      };
      return await adapterRegistry.getAdapter(registryCriteria);
    } catch (error) {
      console.error('Failed to get adapter:', error);
      return null;
    }
  }, [isInitialized]);

  /**
   * Get adapter by ID
   */
  const getAdapterById = useCallback((id: string): BaseAdapter | null => {
    if (!isInitialized) {
      console.warn('Adapter system not initialized');
      return null;
    }

    return adapterRegistry.getAdapterById(id);
  }, [isInitialized]);

  /**
   * Register adapter constructor
   */
  const registerAdapter = useCallback(<T extends BaseAdapter>(
    type: string,
    feature: string,
    constructor: new (config?: AdapterConfig) => T,
  ): void => {
    // Use constructor directly with type assertion
    adapterRegistry.registerAdapter(type, constructor as AdapterConstructor);
  }, []);

  /**
   * Create adapter instance
   */
  const createAdapter = useCallback(async <T extends BaseAdapter>(
    type: string,
    feature: string,
    config?: AdapterConfig,
  ): Promise<T> => {
    if (!isInitialized) {
      throw new Error('Adapter system not initialized');
    }

    return adapterRegistry.create(type, feature, config) as unknown as T;
  }, [isInitialized]);

  /**
   * Get registry stats
   */
  const getRegistryStats = useCallback((): RegistryStats => {
    if (!isInitialized) {
      return {
        total: 0,
        healthy: 0,
        unhealthy: 0,
        byType: {},
        activeInstances: 0,
        unhealthyAdapters: [],
      };
    }

    const stats = adapterRegistry.getStats();
    // Transform the returned stats to match RegistryStats interface
    return {
      total: stats.total,
      healthy: stats.healthy,
      unhealthy: stats.unhealthy,
      byType: {},
      activeInstances: stats.total,
      unhealthyAdapters: [],
    };
  }, [isInitialized]);

  /**
   * Get health status
   */
  const getHealthStatus = useCallback((): Record<string, AdapterHealthStatus> => {
    if (!isInitialized) {
      return {};
    }

    const healthData = healthMonitor.getAllHealth();
    // Transform AdapterHealth to AdapterHealthStatus
    const result: Record<string, AdapterHealthStatus> = {};
    for (const [id, health] of Object.entries(healthData)) {
      result[id] = {
        adapterId: id,
        status: health.isHealthy ? 'healthy' : 'unhealthy',
        lastCheck: health.lastCheck.toISOString(),
        responseTime: health.responseTime,
      };
    }
    return result;
  }, [isInitialized]);

  /**
   * Initialize on mount if auto-initialize is enabled
   */
  useEffect(() => {
    if (autoInitialize && !isInitialized && !initializationError) {
      initialize();
    }
  }, [autoInitialize, isInitialized, initializationError, initialize]);

  /**
   * Cleanup on unmount
   */
  useEffect(() => {
    return () => {
      if (enableHealthMonitoring) {
        healthMonitor.stop();
      }
    };
  }, [enableHealthMonitoring]);

  const contextValue: AdapterContextValue = {
    getAdapter,
    getAdapterById,
    registerAdapter,
    createAdapter,
    getRegistryStats,
    getHealthStatus,
    isInitialized,
    initializationError,
  };

  return (
    <AdapterContext.Provider value={contextValue}>
      {children}
    </AdapterContext.Provider>
  );
};

/**
 * Hook to use adapter context
 */
export const useAdapters = (): AdapterContextValue => {
  const context = useContext(AdapterContext);
  if (!context) {
    throw new Error('useAdapters must be used within an AdapterProvider');
  }
  return context;
};

/**
 * Hook to get adapter for specific feature
 */
export const useFeatureAdapter = (
  feature: string,
  preferredType?: 'mock' | 'real' | 'hybrid',
) => {
  const { getAdapter } = useAdapters();
  const [adapter, setAdapter] = useState<BaseAdapter | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadAdapter = async () => {
      try {
        setLoading(true);
        setError(null);

        const criteria: AdapterSelectionCriteria = {
          feature,
          preferredType,
          minHealth: 'healthy',
        };

        const result = await getAdapter(criteria);
        setAdapter(result);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    loadAdapter();
  }, [feature, preferredType, getAdapter]);

  return { adapter, loading, error };
};

/**
 * Hook to get adapter health
 */
export const useAdapterHealth = (adapterId?: string) => {
  const { getHealthStatus } = useAdapters();
  const [health, setHealth] = useState<Record<string, AdapterHealthStatus>>({});

  const refreshHealth = useCallback(() => {
    const healthStatus = getHealthStatus();
    if (adapterId) {
      setHealth(prev => ({
        ...prev,
        [adapterId]: healthStatus[adapterId] || {
          status: 'unknown',
          lastCheck: new Date().toISOString(),
          errorCount: 0,
          successCount: 0,
        },
      }));
    } else {
      setHealth(healthStatus);
    }
  }, [adapterId, getHealthStatus]);

  useEffect(() => {
    refreshHealth();

    // Set up health change listener
    const unsubscribe = healthMonitor.onHealthChange((id, _healthData) => {
      if (!adapterId || id === adapterId) {
        refreshHealth();
      }
    });

    return unsubscribe;
  }, [adapterId, refreshHealth]);

  return { health, refreshHealth };
};

/**
 * Hook to get registry statistics
 */
export const useRegistryStats = () => {
  const { getRegistryStats } = useAdapters();
  const [stats, setStats] = useState<RegistryStats | null>(null);

  const refreshStats = useCallback(() => {
    const registryStats = getRegistryStats();
    setStats(registryStats);
  }, [getRegistryStats]);

  useEffect(() => {
    refreshStats();
  }, [refreshStats]);

  return { stats, refreshStats };
};

export default AdapterProvider;
