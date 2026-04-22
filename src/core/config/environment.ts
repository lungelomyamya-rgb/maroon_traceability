// src/core/config/environment.ts
// Environment-specific hybrid configuration management

import { DEFAULT_HYBRID_CONFIG } from '../../config/hybrid';
import type { HybridConfig, FeatureModeConfig } from '../types/config';

/**
 * Environment-specific hybrid configurations
 */
export const ENVIRONMENT_CONFIGS: Record<string, Partial<HybridConfig>> = {
  development: {
    global: {
      allowRuntimeSwitching: true,
      defaultFallbackMode: 'simulated',
      healthCheckInterval: 30000,
      enableDebugLogging: true,
    },
    features: {
      authentication: {
        feature: 'authentication',
        mode: 'hybrid',
        allowRuntimeSwitching: true,
        fallbackMode: 'simulated',
        priority: 2,
      },
      registration: {
        feature: 'registration',
        mode: 'real',
        allowRuntimeSwitching: false,
        fallbackMode: 'simulated',
        priority: 1,
      },
      farmer: {
        feature: 'farmer',
        mode: 'simulated',
        allowRuntimeSwitching: true,
        fallbackMode: 'simulated',
        priority: 3,
      },
      logistics: {
        feature: 'logistics',
        mode: 'simulated',
        allowRuntimeSwitching: true,
        fallbackMode: 'simulated',
        priority: 4,
      },
      inspector: {
        feature: 'inspector',
        mode: 'simulated',
        allowRuntimeSwitching: true,
        fallbackMode: 'simulated',
        priority: 5,
      },
      packaging: {
        feature: 'packaging',
        mode: 'simulated',
        allowRuntimeSwitching: true,
        fallbackMode: 'simulated',
        priority: 6,
      },
      retailer: {
        feature: 'retailer',
        mode: 'simulated',
        allowRuntimeSwitching: true,
        fallbackMode: 'simulated',
        priority: 7,
      },
      marketplace: {
        feature: 'marketplace',
        mode: 'simulated',
        allowRuntimeSwitching: true,
        fallbackMode: 'simulated',
        priority: 8,
      },
    },
  },
  staging: {
    global: {
      allowRuntimeSwitching: true,
      defaultFallbackMode: 'simulated',
      healthCheckInterval: 30000,
      enableDebugLogging: true,
    },
    features: {
      authentication: {
        feature: 'authentication',
        mode: 'hybrid',
        allowRuntimeSwitching: true,
        fallbackMode: 'simulated',
        priority: 2,
      },
      registration: {
        feature: 'registration',
        mode: 'real',
        allowRuntimeSwitching: false,
        fallbackMode: 'simulated',
        priority: 1,
      },
      farmer: {
        feature: 'farmer',
        mode: 'hybrid',
        allowRuntimeSwitching: true,
        fallbackMode: 'simulated',
        priority: 3,
      },
      logistics: {
        feature: 'logistics',
        mode: 'simulated',
        allowRuntimeSwitching: true,
        fallbackMode: 'simulated',
        priority: 4,
      },
      inspector: {
        feature: 'inspector',
        mode: 'simulated',
        allowRuntimeSwitching: true,
        fallbackMode: 'simulated',
        priority: 5,
      },
      packaging: {
        feature: 'packaging',
        mode: 'simulated',
        allowRuntimeSwitching: true,
        fallbackMode: 'simulated',
        priority: 6,
      },
      retailer: {
        feature: 'retailer',
        mode: 'simulated',
        allowRuntimeSwitching: true,
        fallbackMode: 'simulated',
        priority: 7,
      },
      marketplace: {
        feature: 'marketplace',
        mode: 'simulated',
        allowRuntimeSwitching: true,
        fallbackMode: 'simulated',
        priority: 8,
      },
    },
  },
  production: {
    global: {
      allowRuntimeSwitching: false,
      defaultFallbackMode: 'real',
      healthCheckInterval: 60000,
      enableDebugLogging: false,
    },
    features: {
      authentication: {
        feature: 'authentication',
        mode: 'real',
        allowRuntimeSwitching: false,
        fallbackMode: 'simulated',
        priority: 2,
      },
      registration: {
        feature: 'registration',
        mode: 'real',
        allowRuntimeSwitching: false,
        fallbackMode: 'simulated',
        priority: 1,
      },
      farmer: {
        feature: 'farmer',
        mode: 'real',
        allowRuntimeSwitching: false,
        fallbackMode: 'simulated',
        priority: 3,
      },
      logistics: {
        feature: 'logistics',
        mode: 'real',
        allowRuntimeSwitching: false,
        fallbackMode: 'simulated',
        priority: 4,
      },
      inspector: {
        feature: 'inspector',
        mode: 'real',
        allowRuntimeSwitching: false,
        fallbackMode: 'simulated',
        priority: 5,
      },
      packaging: {
        feature: 'packaging',
        mode: 'real',
        allowRuntimeSwitching: false,
        fallbackMode: 'simulated',
        priority: 6,
      },
      retailer: {
        feature: 'retailer',
        mode: 'real',
        allowRuntimeSwitching: false,
        fallbackMode: 'simulated',
        priority: 7,
      },
      marketplace: {
        feature: 'marketplace',
        mode: 'real',
        allowRuntimeSwitching: false,
        fallbackMode: 'simulated',
        priority: 8,
      },
    },
  },
  test: {
    global: {
      allowRuntimeSwitching: true,
      defaultFallbackMode: 'simulated',
      healthCheckInterval: 1000,
      enableDebugLogging: false,
    },
    features: {
      authentication: {
        feature: 'authentication',
        mode: 'simulated',
        allowRuntimeSwitching: true,
        fallbackMode: 'simulated',
        priority: 2,
      },
      registration: {
        feature: 'registration',
        mode: 'simulated',
        allowRuntimeSwitching: true,
        fallbackMode: 'simulated',
        priority: 1,
      },
      farmer: {
        feature: 'farmer',
        mode: 'simulated',
        allowRuntimeSwitching: true,
        fallbackMode: 'simulated',
        priority: 3,
      },
      logistics: {
        feature: 'logistics',
        mode: 'simulated',
        allowRuntimeSwitching: true,
        fallbackMode: 'simulated',
        priority: 4,
      },
      inspector: {
        feature: 'inspector',
        mode: 'simulated',
        allowRuntimeSwitching: true,
        fallbackMode: 'simulated',
        priority: 5,
      },
      packaging: {
        feature: 'packaging',
        mode: 'simulated',
        allowRuntimeSwitching: true,
        fallbackMode: 'simulated',
        priority: 6,
      },
      retailer: {
        feature: 'retailer',
        mode: 'simulated',
        allowRuntimeSwitching: true,
        fallbackMode: 'simulated',
        priority: 7,
      },
      marketplace: {
        feature: 'marketplace',
        mode: 'simulated',
        allowRuntimeSwitching: true,
        fallbackMode: 'simulated',
        priority: 8,
      },
    },
  },
};

/**
 * Get current environment
 */
export function getCurrentEnvironment(): string {
  // Check environment variables in order of precedence
  if (typeof window !== 'undefined') {
    // Browser environment
    return (window as { __HYBRID_ENV__?: string }).__HYBRID_ENV__ ||
           process.env.NODE_ENV ||
           'development';
  } else {
    // Server environment
    return process.env.NODE_ENV ||
           process.env.HYBRID_ENV ||
           'development';
  }
}

/**
 * Get environment-specific configuration
 */
export function getEnvironmentConfig(env?: string): Partial<HybridConfig> {
  const environment = env || getCurrentEnvironment();
  return ENVIRONMENT_CONFIGS[environment] || ENVIRONMENT_CONFIGS.development;
}

/**
 * Merge environment config with default config
 */
export function mergeEnvironmentConfig(
  baseConfig: HybridConfig,
  envConfig: Partial<HybridConfig>,
): HybridConfig {
  return {
    ...baseConfig,
    ...envConfig,
    global: {
      ...baseConfig.global,
      ...envConfig.global,
    },
    features: {
      ...baseConfig.features,
      ...envConfig.features,
    },
    dataSources: {
      ...baseConfig.dataSources,
      ...envConfig.dataSources,
    },
  };
}

/**
 * Get final hybrid configuration for current environment
 */
export function getHybridConfigForEnvironment(env?: string): HybridConfig {
  const environment = env || getCurrentEnvironment();
  const envConfig = getEnvironmentConfig(environment);
  return mergeEnvironmentConfig(DEFAULT_HYBRID_CONFIG, envConfig);
}

/**
 * Environment validation
 */
export function validateEnvironment(env: string): boolean {
  return Object.keys(ENVIRONMENT_CONFIGS).includes(env);
}

/**
 * Environment-specific feature overrides
 */
export function getFeatureOverrides(feature: string, env?: string): Partial<FeatureModeConfig> | undefined {
  const config = getEnvironmentConfig(env);
  return config.features?.[feature];
}

/**
 * Check if feature should use real mode in current environment
 */
export function shouldUseRealMode(feature: string, env?: string): boolean {
  const override = getFeatureOverrides(feature, env);
  return override?.mode === 'real';
}

/**
 * Check if feature allows runtime switching in current environment
 */
export function allowsRuntimeSwitching(feature: string, env?: string): boolean {
  const override = getFeatureOverrides(feature, env);
  return override?.allowRuntimeSwitching ?? true;
}

/**
 * Get fallback mode for feature in current environment
 */
export function getFallbackMode(feature: string, env?: string): 'real' | 'simulated' {
  const override = getFeatureOverrides(feature, env);
  return override?.fallbackMode ?? 'simulated';
}

/**
 * Environment-specific adapter configurations
 */
export function getAdapterConfig(adapterType: string, adapterName: string, env?: string) {
  const config = getEnvironmentConfig(env);
  const dataSourceKey = `${adapterType}_${adapterName}`;
  return config.dataSources?.[dataSourceKey];
}

/**
 * Check if adapter is enabled in current environment
 */
export function isAdapterEnabled(adapterType: string, adapterName: string, env?: string): boolean {
  const adapterConfig = getAdapterConfig(adapterType, adapterName, env);
  return adapterConfig?.active ?? false;
}

/**
 * Environment detection utilities
 */
export const environmentUtils = {
  getCurrentEnvironment,
  getEnvironmentConfig,
  getHybridConfigForEnvironment,
  validateEnvironment,
  shouldUseRealMode,
  allowsRuntimeSwitching,
  getFallbackMode,
  isAdapterEnabled,
  getFeatureOverrides,
  getAdapterConfig,
};
