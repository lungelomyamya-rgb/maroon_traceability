// src/core/utils/hybridUtils.ts
// Utility functions for hybrid data architecture

import type {
  HybridModeConfig,
  FeatureHybridConfig,
  ModeSwitchRequest,
  ModeSwitchResult,
  HybridAdapterConfig,
} from '../../types/hybrid';
import type {
  AdapterSelectionCriteria,
  AdapterMetadata,
} from '../../types/registry';

/**
 * Default hybrid configuration
 */
export const DEFAULT_HYBRID_CONFIG: HybridModeConfig = {
  mode: 'development',
  features: {
    registration: {
      name: 'registration',
      dataMode: 'real', // Always real - no mock fallback for registration
      primaryAdapter: 'real',
      autoFailover: false, // Never fallback to mock for registration
      healthCheckInterval: 30000,
    },
    auth: {
      name: 'auth',
      dataMode: 'hybrid', // Dual-mode as per requirements
      primaryAdapter: 'real',
      fallbackAdapter: 'mock',
      autoFailover: true,
      healthCheckInterval: 30000,
    },
    // Other features default to mock
    farmer: {
      name: 'farmer',
      dataMode: 'mock',
      primaryAdapter: 'mock',
      autoFailover: false,
      healthCheckInterval: 60000,
    },
    inspector: {
      name: 'inspector',
      dataMode: 'mock',
      primaryAdapter: 'mock',
      autoFailover: false,
      healthCheckInterval: 60000,
    },
    logistics: {
      name: 'logistics',
      dataMode: 'mock',
      primaryAdapter: 'mock',
      autoFailover: false,
      healthCheckInterval: 60000,
    },
    packaging: {
      name: 'packaging',
      dataMode: 'mock',
      primaryAdapter: 'mock',
      autoFailover: false,
      healthCheckInterval: 60000,
    },
    retailer: {
      name: 'retailer',
      dataMode: 'mock',
      primaryAdapter: 'mock',
      autoFailover: false,
      healthCheckInterval: 60000,
    },
  },
  global: {
    defaultDataMode: 'mock',
    healthMonitoring: true,
    globalHealthInterval: 30000,
    defaultTimeout: 5000,
    enableCaching: true,
    defaultCacheTTL: 300000,
    logging: {
      enabled: true,
      level: 'info',
      logAdapterOps: true,
      logHealthChecks: true,
      logModeSwitches: true,
    },
  },
};

/**
 * Feature modes enumeration
 */
export const FEATURE_MODES = {
  MOCK: 'mock',
  REAL: 'real',
  HYBRID: 'hybrid',
} as const;

/**
 * Environment variables for hybrid configuration
 */
export const HYBRID_ENV_VARS = {
  MODE: 'NEXT_PUBLIC_HYBRID_MODE',
  FEATURE_MODES: 'NEXT_PUBLIC_HYBRID_FEATURE_MODES',
  HEALTH_MONITORING: 'NEXT_PUBLIC_HYBRID_HEALTH_MONITORING',
  RUNTIME_SWITCHING: 'NEXT_PUBLIC_HYBRID_RUNTIME_SWITCHING',
  DEFAULT_TIMEOUT: 'NEXT_PUBLIC_HYBRID_DEFAULT_TIMEOUT',
  CACHE_TTL: 'NEXT_PUBLIC_HYBRID_CACHE_TTL',
} as const;

/**
 * Get hybrid configuration from environment
 */
export function getHybridConfigFromEnv(): Partial<HybridModeConfig> {
  const config: Partial<HybridModeConfig> = {};

  // Get global mode
  const mode = process.env[HYBRID_ENV_VARS.MODE] as HybridModeConfig['mode'];
  if (mode) {
    config.mode = mode;
  }

  // Get feature modes
  const featureModesEnv = process.env[HYBRID_ENV_VARS.FEATURE_MODES];
  if (featureModesEnv) {
    try {
      const featureModes = JSON.parse(featureModesEnv);
      if (config.features) {
        Object.assign(config.features, featureModes);
      } else {
        config.features = featureModes;
      }
    } catch (error) {
      console.warn('Failed to parse feature modes from environment:', error);
    }
  }

  // Update global config
  if (config.global) {
    const healthMonitoring = process.env[HYBRID_ENV_VARS.HEALTH_MONITORING];
    if (healthMonitoring) {
      config.global.healthMonitoring = healthMonitoring === 'true';
    }

    const defaultTimeout = process.env[HYBRID_ENV_VARS.DEFAULT_TIMEOUT];
    if (defaultTimeout) {
      config.global.defaultTimeout = parseInt(defaultTimeout, 10);
    }

    const cacheTTL = process.env[HYBRID_ENV_VARS.CACHE_TTL];
    if (cacheTTL) {
      config.global.defaultCacheTTL = parseInt(cacheTTL, 10);
    }
  }

  return config;
}

/**
 * Validate hybrid configuration
 */
export function validateHybridConfig(config: Partial<HybridModeConfig>): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Validate mode
  if (config.mode && !['development', 'production', 'test', 'demo'].includes(config.mode)) {
    errors.push(`Invalid mode: ${config.mode}`);
  }

  // Validate feature modes
  if (config.features) {
    for (const [featureName, featureConfig] of Object.entries(config.features)) {
      if (!['mock', 'real', 'hybrid'].includes(featureConfig.dataMode)) {
        errors.push(`Invalid data mode for feature ${featureName}: ${featureConfig.dataMode}`);
      }

      // Check registration is always real
      if (featureName === 'registration' && featureConfig.dataMode !== 'real') {
        errors.push('Registration feature must always use real data mode');
      }

      // Check auth supports hybrid
      if (featureName === 'auth' && !['mock', 'real', 'hybrid'].includes(featureConfig.dataMode)) {
        errors.push('Auth feature must support mock, real, or hybrid modes');
      }

      // Validate hybrid configuration
      if (featureConfig.dataMode === 'hybrid') {
        if (!featureConfig.primaryAdapter) {
          errors.push(`Hybrid feature ${featureName} must specify primary adapter`);
        }
        if (!featureConfig.fallbackAdapter) {
          warnings.push(`Hybrid feature ${featureName} should specify fallback adapter`);
        }
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Create adapter selection criteria from feature configuration
 */
export function createAdapterCriteria(
  feature: string,
  config: FeatureHybridConfig,
  preferredType?: 'mock' | 'real' | 'hybrid',
): AdapterSelectionCriteria {
  const criteria: AdapterSelectionCriteria = {
    feature,
    preferredType: preferredType || config.dataMode,
    minHealth: 'degraded', // Allow degraded but not unhealthy
  };

  // Add specific constraints based on configuration
  if (config.dataMode === 'real') {
    criteria.minHealth = 'healthy';
    criteria.maxResponseTime = 5000; // 5 seconds max for real adapters
  }

  if (config.dataMode === 'hybrid' && config.primaryAdapter) {
    criteria.preferredType = config.primaryAdapter;
  }

  return criteria;
}

/**
 * Create hybrid adapter configuration
 */
export function createHybridAdapterConfig(
  primaryType: 'mock' | 'real',
  fallbackType?: 'mock' | 'real',
  options: Partial<HybridAdapterConfig> = {},
): HybridAdapterConfig {
  return {
    type: 'hybrid',
    primary: {
      type: primaryType,
    },
    fallback: fallbackType ? {
      type: fallbackType,
    } : undefined,
    failover: {
      enabled: !!fallbackType,
      timeout: 5000,
      retryOnFailover: true,
      ...options.failover,
    },
    healthMonitoring: {
      enabled: true,
      interval: 30000,
      unhealthyThreshold: 3,
      ...options.healthMonitoring,
    },
    ...options,
  };
}

/**
 * Validate mode switch request
 */
export function validateModeSwitchRequest(
  request: ModeSwitchRequest,
  currentConfig: Record<string, FeatureHybridConfig>,
): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Check if feature exists
  if (!currentConfig[request.feature]) {
    errors.push(`Feature ${request.feature} not found`);
  }

  // Check if mode is valid
  if (!['mock', 'real', 'hybrid'].includes(request.newMode)) {
    errors.push(`Invalid mode: ${request.newMode}`);
  }

  // Check registration constraint
  if (request.feature === 'registration' && request.newMode !== 'real') {
    errors.push('Registration feature cannot be switched from real mode');
  }

  // Check if mode is actually changing
  const currentMode = currentConfig[request.feature]?.dataMode;
  if (currentMode === request.newMode && !request.force) {
    errors.push(`Feature ${request.feature} is already in ${request.newMode} mode`);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Create mode switch result
 */
export function createModeSwitchResult(
  request: ModeSwitchRequest,
  previousMode: string,
  success: boolean,
  error?: string,
  warnings?: string[],
): ModeSwitchResult {
  return {
    success,
    previousMode: (previousMode || 'mock') as 'mock' | 'real' | 'hybrid',
    newMode: request.newMode,
    affectedAdapters: [`${request.feature}-${request.newMode}`],
    timestamp: new Date(),
    error,
    warnings,
  };
}

/**
 * Get feature mode from configuration
 */
export function getFeatureMode(
  feature: string,
  config: HybridModeConfig,
): 'mock' | 'real' | 'hybrid' {
  return config.features[feature]?.dataMode || config.global.defaultDataMode;
}

/**
 * Set feature mode in configuration
 */
export function setFeatureMode(
  feature: string,
  mode: 'mock' | 'real' | 'hybrid',
  config: HybridModeConfig,
): HybridModeConfig {
  return {
    ...config,
    features: {
      ...config.features,
      [feature]: {
        ...config.features[feature],
        name: feature,
        dataMode: mode,
        // Update primary adapter based on mode
        primaryAdapter: mode === 'hybrid' ? 'real' : mode,
        // Add fallback for hybrid mode
        fallbackAdapter: mode === 'hybrid' ? 'mock' : undefined,
        autoFailover: mode === 'hybrid',
      },
    },
  };
}

/**
 * Check if feature supports hybrid mode
 */
export function supportsHybridMode(feature: string): boolean {
  // Registration is always real, auth supports hybrid, others can be hybrid
  return feature !== 'registration';
}

/**
 * Get adapter priority for selection
 */
export function getAdapterPriority(
  metadata: AdapterMetadata,
  preferredType?: 'mock' | 'real' | 'hybrid',
): number {
  let priority = metadata.priority;

  // Boost priority for preferred type
  if (preferredType && metadata.type === preferredType) {
    priority += 100;
  }

  // Boost priority for healthy adapters
  if (metadata.health.status === 'healthy') {
    priority += 50;
  } else if (metadata.health.status === 'degraded') {
    priority += 25;
  }

  // Boost priority for active adapters
  if (metadata.active) {
    priority += 10;
  }

  return priority;
}

/**
 * Filter adapters by criteria
 */
export function filterAdaptersByCriteria(
  adapters: AdapterMetadata[],
  criteria: AdapterSelectionCriteria,
): AdapterMetadata[] {
  return adapters.filter(adapter => {
    // Feature match
    if (adapter.feature !== criteria.feature) {
      return false;
    }

    // Type preference
    if (criteria.preferredType && adapter.type !== criteria.preferredType) {
      return false;
    }

    // Active status
    if (!adapter.active) {
      return false;
    }

    // Health status
    if (criteria.minHealth) {
      const healthOrder = { healthy: 3, degraded: 2, unhealthy: 1, unknown: 0 };
      if (healthOrder[adapter.health.status] < healthOrder[criteria.minHealth]) {
        return false;
      }
    }

    // Response time
    if (criteria.maxResponseTime && adapter.health.responseTime) {
      if (adapter.health.responseTime > criteria.maxResponseTime) {
        return false;
      }
    }

    // Success rate
    if (criteria.minSuccessRate && adapter.health.successRate) {
      if (adapter.health.successRate < criteria.minSuccessRate) {
        return false;
      }
    }

    // Custom filter
    if (criteria.filter && !criteria.filter(adapter)) {
      return false;
    }

    return true;
  });
}

/**
 * Log hybrid operation
 */
export function logHybridOperation(
  operation: string,
  feature: string,
  details: Record<string, unknown>,
  level: 'debug' | 'info' | 'warn' | 'error' = 'info',
): void {
  const logEntry = {
    timestamp: new Date().toISOString(),
    operation,
    feature,
    details,
    level,
  };

  const logMessage = `[Hybrid:${level.toUpperCase()}] ${operation} for ${feature}: ${JSON.stringify(details)}`;

  switch (level) {
  case 'debug':
    console.debug(logMessage, logEntry);
    break;
  case 'info':
    console.info(logMessage, logEntry);
    break;
  case 'warn':
    console.warn(logMessage, logEntry);
    break;
  case 'error':
    console.error(logMessage, logEntry);
    break;
  }
}
