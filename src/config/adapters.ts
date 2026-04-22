// src/config/adapters.ts
// Adapter-specific configuration

import type { AdapterConfig } from '../core/types/adapter';
import type { HybridAdapterConfig } from '../types/hybrid';

/**
 * Default adapter configurations
 */
export const DEFAULT_ADAPTER_CONFIGS: Record<string, AdapterConfig> = {
  // Mock adapter configurations
  mock: {
    type: 'mock',
    timeout: 1000,
    retryAttempts: 1,
    enableCache: true,
    options: {
      simulateLatency: true,
      latencyRange: [100, 500],
      errorRate: 0.05, // 5% error rate for testing
    },
  },

  // Real adapter configurations
  real: {
    type: 'real',
    timeout: 10000,
    retryAttempts: 3,
    enableCache: true,
    options: {
      connectionTimeout: 5000,
      readTimeout: 10000,
      retryDelay: 1000,
    },
  },

  // Hybrid adapter configurations
  hybrid: {
    type: 'hybrid',
    timeout: 15000,
    retryAttempts: 5,
    enableCache: true,
    options: {
      failoverTimeout: 5000,
      healthCheckInterval: 30000,
      circuitBreakerThreshold: 5,
    },
  },
};

/**
 * Feature-specific adapter configurations
 */
export const FEATURE_ADAPTER_CONFIGS: Record<string, Record<string, AdapterConfig>> = {
  registration: {
    real: {
      type: 'real',
      timeout: 30000, // Longer timeout for registration
      retryAttempts: 5,
      enableCache: false, // Don't cache registration operations
      options: {
        requireEmailVerification: true,
        passwordStrengthCheck: true,
        accountLockoutThreshold: 5,
      },
    },
  },

  auth: {
    mock: {
      ...DEFAULT_ADAPTER_CONFIGS.mock,
      options: {
        ...DEFAULT_ADAPTER_CONFIGS.mock.options,
        demoUsers: [
          { email: 'admin@demo.com', password: 'admin123', role: 'admin' },
          { email: 'farmer@demo.com', password: 'farmer123', role: 'farmer' },
          { email: 'inspector@demo.com', password: 'inspector123', role: 'inspector' },
          { email: 'logistics@demo.com', password: 'logistics123', role: 'logistics' },
          { email: 'retailer@demo.com', password: 'retailer123', role: 'retailer' },
        ],
        sessionTimeout: 3600000, // 1 hour
      },
    },

    real: {
      ...DEFAULT_ADAPTER_CONFIGS.real,
      timeout: 10000,
      options: {
        ...DEFAULT_ADAPTER_CONFIGS.real.options,
        tokenRefreshThreshold: 300000, // 5 minutes before expiry
        maxSessionDuration: 86400000, // 24 hours
        requireMFA: false, // Can be enabled later
      },
    },

    hybrid: {
      type: 'hybrid',
      timeout: 12000,
      retryAttempts: 3,
      enableCache: true,
      options: {
        primaryMode: 'real',
        fallbackMode: 'mock',
        autoFailover: true,
        healthCheckInterval: 30000,
        circuitBreakerThreshold: 3,
      },
    },
  },

  farmer: {
    mock: {
      ...DEFAULT_ADAPTER_CONFIGS.mock,
      options: {
        ...DEFAULT_ADAPTER_CONFIGS.mock.options,
        mockDataSize: 100,
        includeTestData: true,
      },
    },

    real: {
      ...DEFAULT_ADAPTER_CONFIGS.real,
      options: {
        ...DEFAULT_ADAPTER_CONFIGS.real.options,
        batchSize: 50,
        syncInterval: 60000, // 1 minute
      },
    },
  },

  inspector: {
    mock: {
      ...DEFAULT_ADAPTER_CONFIGS.mock,
      options: {
        ...DEFAULT_ADAPTER_CONFIGS.mock.options,
        inspectionTypes: ['quality', 'compliance', 'safety'],
        autoGenerateReports: true,
      },
    },

    real: {
      ...DEFAULT_ADAPTER_CONFIGS.real,
      options: {
        ...DEFAULT_ADAPTER_CONFIGS.real.options,
        photoUploadEnabled: true,
        gpsTrackingRequired: true,
        offlineModeSupported: true,
      },
    },
  },

  logistics: {
    mock: {
      ...DEFAULT_ADAPTER_CONFIGS.mock,
      options: {
        ...DEFAULT_ADAPTER_CONFIGS.mock.options,
        vehicleTypes: ['truck', 'van', 'motorcycle'],
        routeOptimization: true,
      },
    },

    real: {
      ...DEFAULT_ADAPTER_CONFIGS.real,
      options: {
        ...DEFAULT_ADAPTER_CONFIGS.real.options,
        realTimeTracking: true,
        geofenceEnabled: true,
        temperatureMonitoring: true,
      },
    },
  },

  packaging: {
    mock: {
      ...DEFAULT_ADAPTER_CONFIGS.mock,
      options: {
        ...DEFAULT_ADAPTER_CONFIGS.mock.options,
        packageTypes: ['box', 'crate', 'pallet'],
        labelTemplates: ['standard', 'premium', 'organic'],
      },
    },

    real: {
      ...DEFAULT_ADAPTER_CONFIGS.real,
      options: {
        ...DEFAULT_ADAPTER_CONFIGS.real.options,
        barcodeGeneration: true,
        qrCodeSupport: true,
        labelPrinting: true,
      },
    },
  },

  retailer: {
    mock: {
      ...DEFAULT_ADAPTER_CONFIGS.mock,
      options: {
        ...DEFAULT_ADAPTER_CONFIGS.mock.options,
        storeTypes: ['supermarket', 'corner_store', 'specialty'],
        inventoryTracking: true,
      },
    },

    real: {
      ...DEFAULT_ADAPTER_CONFIGS.real,
      options: {
        ...DEFAULT_ADAPTER_CONFIGS.real.options,
        posIntegration: true,
        inventorySync: true,
        customerLoyalty: true,
      },
    },
  },
};

/**
 * Hybrid adapter configurations
 */
export const HYBRID_ADAPTER_CONFIGS: Record<string, HybridAdapterConfig> = {
  auth: {
    type: 'hybrid',
    primary: {
      type: 'real',
      config: FEATURE_ADAPTER_CONFIGS.auth.real,
    },
    fallback: {
      type: 'mock',
      config: FEATURE_ADAPTER_CONFIGS.auth.mock,
    },
    failover: {
      enabled: true,
      timeout: 5000,
      retryOnFailover: true,
    },
    healthMonitoring: {
      enabled: true,
      interval: 30000,
      unhealthyThreshold: 3,
    },
  },

  farmer: {
    type: 'hybrid',
    primary: {
      type: 'real',
      config: FEATURE_ADAPTER_CONFIGS.farmer.real,
    },
    fallback: {
      type: 'mock',
      config: FEATURE_ADAPTER_CONFIGS.farmer.mock,
    },
    failover: {
      enabled: true,
      timeout: 10000,
      retryOnFailover: true,
    },
    healthMonitoring: {
      enabled: true,
      interval: 60000,
      unhealthyThreshold: 5,
    },
  },

  inspector: {
    type: 'hybrid',
    primary: {
      type: 'real',
      config: FEATURE_ADAPTER_CONFIGS.inspector.real,
    },
    fallback: {
      type: 'mock',
      config: FEATURE_ADAPTER_CONFIGS.inspector.mock,
    },
    failover: {
      enabled: true,
      timeout: 8000,
      retryOnFailover: true,
    },
    healthMonitoring: {
      enabled: true,
      interval: 45000,
      unhealthyThreshold: 4,
    },
  },

  logistics: {
    type: 'hybrid',
    primary: {
      type: 'real',
      config: FEATURE_ADAPTER_CONFIGS.logistics.real,
    },
    fallback: {
      type: 'mock',
      config: FEATURE_ADAPTER_CONFIGS.logistics.mock,
    },
    failover: {
      enabled: true,
      timeout: 12000,
      retryOnFailover: true,
    },
    healthMonitoring: {
      enabled: true,
      interval: 30000,
      unhealthyThreshold: 3,
    },
  },

  packaging: {
    type: 'hybrid',
    primary: {
      type: 'real',
      config: FEATURE_ADAPTER_CONFIGS.packaging.real,
    },
    fallback: {
      type: 'mock',
      config: FEATURE_ADAPTER_CONFIGS.packaging.mock,
    },
    failover: {
      enabled: true,
      timeout: 6000,
      retryOnFailover: true,
    },
    healthMonitoring: {
      enabled: true,
      interval: 60000,
      unhealthyThreshold: 5,
    },
  },

  retailer: {
    type: 'hybrid',
    primary: {
      type: 'real',
      config: FEATURE_ADAPTER_CONFIGS.retailer.real,
    },
    fallback: {
      type: 'mock',
      config: FEATURE_ADAPTER_CONFIGS.retailer.mock,
    },
    failover: {
      enabled: true,
      timeout: 7000,
      retryOnFailover: true,
    },
    healthMonitoring: {
      enabled: true,
      interval: 45000,
      unhealthyThreshold: 4,
    },
  },
};

/**
 * Get adapter configuration for feature and type
 */
export function getAdapterConfig(
  feature: string,
  type: string,
): AdapterConfig | undefined {
  return FEATURE_ADAPTER_CONFIGS[feature]?.[type];
}

/**
 * Get hybrid adapter configuration for feature
 */
export function getHybridAdapterConfig(
  feature: string,
): HybridAdapterConfig | undefined {
  return HYBRID_ADAPTER_CONFIGS[feature];
}

/**
 * Get default adapter configuration for type
 */
export function getDefaultAdapterConfig(type: string): AdapterConfig | undefined {
  return DEFAULT_ADAPTER_CONFIGS[type];
}

/**
 * Merge adapter configurations
 */
export function mergeAdapterConfigs(
  base: AdapterConfig,
  override: Partial<AdapterConfig>,
): AdapterConfig {
  return {
    ...base,
    ...override,
    options: {
      ...base.options,
      ...override.options,
    },
  };
}

/**
 * Validate adapter configuration
 */
export function validateAdapterConfig(
  config: AdapterConfig,
): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!config.type) {
    errors.push('Adapter type is required');
  }

  if (config.timeout !== undefined && config.timeout <= 0) {
    errors.push('Timeout must be positive');
  }

  if (config.retryAttempts !== undefined && config.retryAttempts < 0) {
    errors.push('Retry attempts cannot be negative');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Environment-specific adapter overrides
 */
export function getEnvironmentAdapterOverrides(): Record<string, Partial<AdapterConfig>> {
  const overrides: Record<string, Partial<AdapterConfig>> = {};

  // Development overrides
  if (process.env.NODE_ENV === 'development') {
    overrides.mock = {
      options: {
        simulateLatency: false, // No latency in development
        errorRate: 0, // No errors in development
      },
    };

    overrides.real = {
      timeout: 30000, // Longer timeout for development
      retryAttempts: 1, // Fewer retries in development
    };
  }

  // Production overrides
  if (process.env.NODE_ENV === 'production') {
    overrides.mock = {
      enableCache: false, // No caching for mock in production
    };

    overrides.real = {
      retryAttempts: 5, // More retries in production
      enableCache: true,
    };

    overrides.hybrid = {
      retryAttempts: 7, // Even more retries for hybrid in production
    };
  }

  // Test overrides
  if (process.env.NODE_ENV === 'test') {
    overrides.mock = {
      timeout: 100, // Very fast timeout for tests
      retryAttempts: 0, // No retries in tests
      enableCache: false, // No caching in tests
      options: {
        simulateLatency: false,
        errorRate: 0,
      },
    };
  }

  return overrides;
}

/**
 * Apply environment overrides to adapter configuration
 */
export function applyEnvironmentOverrides(
  feature: string,
  type: string,
  config: AdapterConfig,
): AdapterConfig {
  const overrides = getEnvironmentAdapterOverrides();
  const typeOverride = overrides[type];

  if (typeOverride) {
    return mergeAdapterConfigs(config, typeOverride);
  }

  return config;
}

/**
 * Get final adapter configuration with all overrides applied
 */
export function getFinalAdapterConfig(
  feature: string,
  type: string,
): AdapterConfig {
  const baseConfig = getAdapterConfig(feature, type) || getDefaultAdapterConfig(type) || DEFAULT_ADAPTER_CONFIGS[type];

  if (!baseConfig) {
    throw new Error(`No configuration found for ${feature}:${type}`);
  }

  return applyEnvironmentOverrides(feature, type, baseConfig);
}
