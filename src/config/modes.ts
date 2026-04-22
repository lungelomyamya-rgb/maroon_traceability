// src/config/modes.ts
// Mode-specific configurations for different deployment scenarios

import type { HybridConfig, FeatureModeConfig } from '../core/types/config';
import { DEFAULT_HYBRID_CONFIG } from './hybrid';

/**
 * Development mode configuration
 */
export const DEVELOPMENT_MODE: HybridConfig = {
  ...DEFAULT_HYBRID_CONFIG,
  features: {
    ...DEFAULT_HYBRID_CONFIG.features,
    // In development, allow more flexibility
    registration: {
      ...DEFAULT_HYBRID_CONFIG.features.registration,
      allowRuntimeSwitching: true, // Allow switching in dev for testing
    },
    authentication: {
      ...DEFAULT_HYBRID_CONFIG.features.authentication,
      mode: 'hybrid', // Test both mock and real
    },
  },
  global: {
    ...DEFAULT_HYBRID_CONFIG.global,
    allowRuntimeSwitching: true,
    enableDebugLogging: true,
    healthCheckInterval: 10000, // 10 seconds for faster feedback
  },
};

/**
 * Production mode configuration
 */
export const PRODUCTION_MODE: HybridConfig = {
  ...DEFAULT_HYBRID_CONFIG,
  features: {
    ...DEFAULT_HYBRID_CONFIG.features,
    // In production, be more strict
    registration: {
      ...DEFAULT_HYBRID_CONFIG.features.registration,
      allowRuntimeSwitching: false, // Never allow switching in production
    },
    authentication: {
      ...DEFAULT_HYBRID_CONFIG.features.authentication,
      mode: 'real', // Use real authentication in production
      allowRuntimeSwitching: false,
    },
  },
  global: {
    ...DEFAULT_HYBRID_CONFIG.global,
    allowRuntimeSwitching: false,
    enableDebugLogging: false,
    healthCheckInterval: 60000, // 1 minute in production
  },
};

/**
 * Test mode configuration
 */
export const TEST_MODE: HybridConfig = {
  ...DEFAULT_HYBRID_CONFIG,
  features: {
    ...DEFAULT_HYBRID_CONFIG.features,
    // In tests, use mock data for consistency
    registration: {
      ...DEFAULT_HYBRID_CONFIG.features.registration,
      mode: 'simulated', // Use mock for testing
      allowRuntimeSwitching: false,
    },
    authentication: {
      ...DEFAULT_HYBRID_CONFIG.features.authentication,
      mode: 'simulated', // Use mock for testing
      allowRuntimeSwitching: false,
    },
    // All other features remain simulated
  },
  global: {
    ...DEFAULT_HYBRID_CONFIG.global,
    allowRuntimeSwitching: false,
    enableDebugLogging: true,
    healthCheckInterval: 5000, // 5 seconds for fast test feedback
  },
};

/**
 * Demo mode configuration (for presentations)
 */
export const DEMO_MODE: HybridConfig = {
  ...DEFAULT_HYBRID_CONFIG,
  features: {
    ...DEFAULT_HYBRID_CONFIG.features,
    // In demo mode, use simulated for everything except registration
    registration: {
      ...DEFAULT_HYBRID_CONFIG.features.registration,
      mode: 'real', // Keep registration real for demo accounts
      allowRuntimeSwitching: false,
    },
    authentication: {
      ...DEFAULT_HYBRID_CONFIG.features.authentication,
      mode: 'simulated', // Use mock for demo users
      allowRuntimeSwitching: false,
    },
  },
  global: {
    ...DEFAULT_HYBRID_CONFIG.global,
    allowRuntimeSwitching: false,
    enableDebugLogging: false,
    healthCheckInterval: 30000,
  },
};

/**
 * CI/CD mode configuration
 */
export const CICD_MODE: HybridConfig = {
  ...DEFAULT_HYBRID_CONFIG,
  features: {
    ...DEFAULT_HYBRID_CONFIG.features,
    // In CI/CD, use mock for speed and reliability
    registration: {
      ...DEFAULT_HYBRID_CONFIG.features.registration,
      mode: 'simulated', // Use mock for CI/CD
      allowRuntimeSwitching: false,
    },
    authentication: {
      ...DEFAULT_HYBRID_CONFIG.features.authentication,
      mode: 'simulated', // Use mock for CI/CD
      allowRuntimeSwitching: false,
    },
  },
  global: {
    ...DEFAULT_HYBRID_CONFIG.global,
    allowRuntimeSwitching: false,
    enableDebugLogging: true,
    healthCheckInterval: 15000, // 15 seconds for CI/CD
  },
};

/**
 * Mode configuration mapping
 */
export const MODE_CONFIGURATIONS: Record<string, HybridConfig> = {
  development: DEVELOPMENT_MODE,
  production: PRODUCTION_MODE,
  test: TEST_MODE,
  demo: DEMO_MODE,
  cicd: CICD_MODE,
} as const;

/**
 * Get configuration for current environment
 */
export function getConfigurationForEnvironment(env?: string): HybridConfig {
  const environment = env || process.env.NODE_ENV || 'development';

  // Check for custom mode override
  const customMode = process.env.HYBRID_MODE;
  if (customMode && MODE_CONFIGURATIONS[customMode]) {
    return MODE_CONFIGURATIONS[customMode];
  }

  // Return environment-specific configuration
  return MODE_CONFIGURATIONS[environment] || DEVELOPMENT_MODE;
}

/**
 * Feature mode presets for quick switching
 */
export const FEATURE_MODE_PRESETS = {
  // All real mode (for production testing)
  ALL_REAL: {
    registration: { mode: 'real' as const },
    authentication: { mode: 'real' as const },
    farmer: { mode: 'real' as const },
    inspector: { mode: 'real' as const },
    logistics: { mode: 'real' as const },
    packaging: { mode: 'real' as const },
    retailer: { mode: 'real' as const },
    marketplace: { mode: 'real' as const },
    blockchain: { mode: 'real' as const },
  },

  // All simulated mode (for development)
  ALL_SIMULATED: {
    registration: { mode: 'simulated' as const },
    authentication: { mode: 'simulated' as const },
    farmer: { mode: 'simulated' as const },
    inspector: { mode: 'simulated' as const },
    logistics: { mode: 'simulated' as const },
    packaging: { mode: 'simulated' as const },
    retailer: { mode: 'simulated' as const },
    marketplace: { mode: 'simulated' as const },
    blockchain: { mode: 'simulated' as const },
  },

  // Hybrid mode (for testing)
  ALL_HYBRID: {
    registration: { mode: 'hybrid' as const },
    authentication: { mode: 'hybrid' as const },
    farmer: { mode: 'hybrid' as const },
    inspector: { mode: 'hybrid' as const },
    logistics: { mode: 'hybrid' as const },
    packaging: { mode: 'hybrid' as const },
    retailer: { mode: 'hybrid' as const },
    marketplace: { mode: 'hybrid' as const },
    blockchain: { mode: 'hybrid' as const },
  },

  // Default hybrid configuration
  DEFAULT_HYBRID: {
    registration: { mode: 'real' as const },
    authentication: { mode: 'hybrid' as const },
    farmer: { mode: 'simulated' as const },
    inspector: { mode: 'simulated' as const },
    logistics: { mode: 'simulated' as const },
    packaging: { mode: 'simulated' as const },
    retailer: { mode: 'simulated' as const },
    marketplace: { mode: 'simulated' as const },
    blockchain: { mode: 'simulated' as const },
  },
} as const;

/**
 * Apply preset to configuration
 */
export function applyPreset(
  baseConfig: HybridConfig,
  preset: keyof typeof FEATURE_MODE_PRESETS,
): HybridConfig {
  const presetConfig = FEATURE_MODE_PRESETS[preset];

  const updatedFeatures: Record<string, FeatureModeConfig> = {};

  Object.entries(presetConfig).forEach(([feature, modeConfig]) => {
    updatedFeatures[feature] = {
      ...baseConfig.features[feature],
      ...modeConfig,
      feature,
      allowRuntimeSwitching: baseConfig.features[feature]?.allowRuntimeSwitching ?? true,
      fallbackMode: baseConfig.features[feature]?.fallbackMode ?? 'simulated',
      priority: baseConfig.features[feature]?.priority ?? 1,
    };
  });

  return {
    ...baseConfig,
    features: {
      ...baseConfig.features,
      ...updatedFeatures,
    },
  };
}

/**
 * Validate mode configuration
 */
export function validateModeConfig(config: HybridConfig): {
  valid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check required features
  const requiredFeatures = ['registration', 'authentication'];
  requiredFeatures.forEach(feature => {
    if (!config.features[feature]) {
      errors.push(`Required feature '${feature}' is missing`);
    }
  });

  // Validate registration mode
  const registrationMode = config.features.registration?.mode;
  if (registrationMode && !['real', 'simulated', 'hybrid'].includes(registrationMode)) {
    errors.push(`Registration mode '${registrationMode}' is invalid`);
  }

  // Validate authentication mode
  const authMode = config.features.authentication?.mode;
  if (authMode && !['real', 'simulated', 'hybrid'].includes(authMode)) {
    errors.push(`Authentication mode '${authMode}' is invalid`);
  }

  // Check for inconsistent configurations
  Object.entries(config.features).forEach(([feature, config]) => {
    if (config.mode === 'hybrid' && !config.fallbackMode) {
      warnings.push(`Feature '${feature}' is in hybrid mode but has no fallback mode`);
    }

    if (config.mode === 'real' && !config.allowRuntimeSwitching) {
      // This is normal for production, but warn in development
      if (process.env.NODE_ENV === 'development') {
        warnings.push(`Feature '${feature}' is in real mode but doesn't allow runtime switching`);
      }
    }
  });

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Get mode summary for debugging
 */
export function getModeSummary(config: HybridConfig): {
  totalFeatures: number;
  realFeatures: number;
  simulatedFeatures: number;
  hybridFeatures: number;
  featuresByMode: Record<string, string>;
} {
  const features = Object.entries(config.features);
  const realFeatures = features.filter(([, config]) => config.mode === 'real').length;
  const simulatedFeatures = features.filter(([, config]) => config.mode === 'simulated').length;
  const hybridFeatures = features.filter(([, config]) => config.mode === 'hybrid').length;

  const featuresByMode: Record<string, string> = {};
  features.forEach(([feature, config]) => {
    featuresByMode[feature] = config.mode;
  });

  return {
    totalFeatures: features.length,
    realFeatures,
    simulatedFeatures,
    hybridFeatures,
    featuresByMode,
  };
}
