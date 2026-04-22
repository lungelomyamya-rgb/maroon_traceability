// src/config/hybrid.ts
// Hybrid mode configuration and feature flags

import type { HybridConfig } from '../core/types/config';

/**
 * Default hybrid configuration
 */

/**
 * Default hybrid configuration
 */
export const DEFAULT_HYBRID_CONFIG: HybridConfig = {
  features: {
    // Registration is always real (requirement)
    registration: {
      feature: 'registration',
      mode: 'real',
      allowRuntimeSwitching: false, // Cannot switch registration mode
      fallbackMode: 'simulated',
      priority: 1,
    },

    // Authentication supports both simulated and real users (requirement)
    authentication: {
      feature: 'authentication',
      mode: 'hybrid',
      allowRuntimeSwitching: true,
      fallbackMode: 'simulated',
      priority: 2,
    },

    // Other features are simulated for now
    farmer: {
      feature: 'farmer',
      mode: 'simulated',
      allowRuntimeSwitching: true,
      fallbackMode: 'simulated',
      priority: 3,
    },

    inspector: {
      feature: 'inspector',
      mode: 'simulated',
      allowRuntimeSwitching: true,
      fallbackMode: 'simulated',
      priority: 4,
    },

    logistics: {
      feature: 'logistics',
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

    blockchain: {
      feature: 'blockchain',
      mode: 'simulated',
      allowRuntimeSwitching: true,
      fallbackMode: 'simulated',
      priority: 9,
    },
  },

  global: {
    allowRuntimeSwitching: true,
    defaultFallbackMode: 'simulated',
    healthCheckInterval: 30000, // 30 seconds
    enableDebugLogging: process.env.NODE_ENV === 'development',
  },

  dataSources: {
    // Registration data source (Supabase)
    registration_supabase: {
      name: 'registration_supabase',
      type: 'real',
      feature: 'registration',
      active: true,
      priority: 1,
      connection: {
        endpoint: process.env.NEXT_PUBLIC_SUPABASE_URL,
        credentials: {
          anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
          serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
        },
        timeout: 10000,
        retry: {
          attempts: 3,
          delay: 1000,
          backoff: 'exponential',
        },
      },
      performance: {
        enableCache: true,
        cacheTTL: 300000, // 5 minutes
        enableCompression: true,
      },
    },

    // Authentication mock data source
    auth_mock: {
      name: 'auth_mock',
      type: 'mock',
      feature: 'authentication',
      active: true,
      priority: 2,
      connection: {
        timeout: 1000,
        retry: {
          attempts: 1,
          delay: 0,
          backoff: 'linear',
        },
      },
      performance: {
        enableCache: true,
        cacheTTL: 60000, // 1 minute
        enableCompression: false,
      },
    },

    // Authentication real data source (Supabase)
    auth_supabase: {
      name: 'auth_supabase',
      type: 'real',
      feature: 'authentication',
      active: true,
      priority: 1,
      connection: {
        endpoint: process.env.NEXT_PUBLIC_SUPABASE_URL,
        credentials: {
          anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
          serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
        },
        timeout: 10000,
        retry: {
          attempts: 3,
          delay: 1000,
          backoff: 'exponential',
        },
      },
      performance: {
        enableCache: true,
        cacheTTL: 300000, // 5 minutes
        enableCompression: true,
      },
    },

    // Farmer mock data source
    farmer_mock: {
      name: 'farmer_mock',
      type: 'mock',
      feature: 'farmer',
      active: true,
      priority: 1,
      connection: {
        timeout: 100,
        retry: {
          attempts: 1,
          delay: 0,
          backoff: 'linear',
        },
      },
      performance: {
        enableCache: true,
        cacheTTL: 30000, // 30 seconds
        enableCompression: false,
      },
    },

    // Inspector mock data source
    inspector_mock: {
      name: 'inspector_mock',
      type: 'mock',
      feature: 'inspector',
      active: true,
      priority: 1,
      connection: {
        timeout: 100,
        retry: {
          attempts: 1,
          delay: 0,
          backoff: 'linear',
        },
      },
      performance: {
        enableCache: true,
        cacheTTL: 30000, // 30 seconds
        enableCompression: false,
      },
    },

    // Logistics mock data source
    logistics_mock: {
      name: 'logistics_mock',
      type: 'mock',
      feature: 'logistics',
      active: true,
      priority: 1,
      connection: {
        timeout: 100,
        retry: {
          attempts: 1,
          delay: 0,
          backoff: 'linear',
        },
      },
      performance: {
        enableCache: true,
        cacheTTL: 30000, // 30 seconds
        enableCompression: false,
      },
    },

    // Packaging mock data source
    packaging_mock: {
      name: 'packaging_mock',
      type: 'mock',
      feature: 'packaging',
      active: true,
      priority: 1,
      connection: {
        timeout: 100,
        retry: {
          attempts: 1,
          delay: 0,
          backoff: 'linear',
        },
      },
      performance: {
        enableCache: true,
        cacheTTL: 30000, // 30 seconds
        enableCompression: false,
      },
    },

    // Retailer mock data source
    retailer_mock: {
      name: 'retailer_mock',
      type: 'mock',
      feature: 'retailer',
      active: true,
      priority: 1,
      connection: {
        timeout: 100,
        retry: {
          attempts: 1,
          delay: 0,
          backoff: 'linear',
        },
      },
      performance: {
        enableCache: true,
        cacheTTL: 30000, // 30 seconds
        enableCompression: false,
      },
    },

    // Marketplace mock data source
    marketplace_mock: {
      name: 'marketplace_mock',
      type: 'mock',
      feature: 'marketplace',
      active: true,
      priority: 1,
      connection: {
        timeout: 100,
        retry: {
          attempts: 1,
          delay: 0,
          backoff: 'linear',
        },
      },
      performance: {
        enableCache: true,
        cacheTTL: 60000, // 1 minute
        enableCompression: false,
      },
    },

    // Blockchain mock data source
    blockchain_mock: {
      name: 'blockchain_mock',
      type: 'mock',
      feature: 'blockchain',
      active: true,
      priority: 1,
      connection: {
        timeout: 100,
        retry: {
          attempts: 1,
          delay: 0,
          backoff: 'linear',
        },
      },
      performance: {
        enableCache: true,
        cacheTTL: 30000, // 30 seconds
        enableCompression: false,
      },
    },
  },
};

/**
 * Feature mode mappings for easy access
 */
export const FEATURE_MODES = {
  REGISTRATION: 'real' as const,
  AUTHENTICATION: 'hybrid' as const,
  FARMER: 'simulated' as const,
  INSPECTOR: 'simulated' as const,
  LOGISTICS: 'simulated' as const,
  PACKAGING: 'simulated' as const,
  RETAILER: 'simulated' as const,
  MARKETPLACE: 'simulated' as const,
  BLOCKCHAIN: 'simulated' as const,
} as const;

/**
 * Environment variable names for hybrid configuration
 */
export const HYBRID_ENV_VARS = {
  // Global settings
  ALLOW_RUNTIME_SWITCHING: 'HYBRID_ALLOW_RUNTIME_SWITCHING',
  DEFAULT_FALLBACK_MODE: 'HYBRID_DEFAULT_FALLBACK_MODE',
  ENABLE_DEBUG_LOGGING: 'HYBRID_ENABLE_DEBUG_LOGGING',
  HEALTH_CHECK_INTERVAL: 'HYBRID_HEALTH_CHECK_INTERVAL',

  // Feature-specific modes
  REGISTRATION_MODE: 'HYBRID_MODE_REGISTRATION',
  AUTHENTICATION_MODE: 'HYBRID_MODE_AUTHENTICATION',
  FARMER_MODE: 'HYBRID_MODE_FARMER',
  INSPECTOR_MODE: 'HYBRID_MODE_INSPECTOR',
  LOGISTICS_MODE: 'HYBRID_MODE_LOGISTICS',
  PACKAGING_MODE: 'HYBRID_MODE_PACKAGING',
  RETAILER_MODE: 'HYBRID_MODE_RETAILER',
  MARKETPLACE_MODE: 'HYBRID_MODE_MARKETPLACE',
  BLOCKCHAIN_MODE: 'HYBRID_MODE_BLOCKCHAIN',

  // Data source settings
  SUPABASE_URL: 'NEXT_PUBLIC_SUPABASE_URL',
  SUPABASE_ANON_KEY: 'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  SUPABASE_SERVICE_ROLE_KEY: 'SUPABASE_SERVICE_ROLE_KEY',
} as const;

/**
 * Get hybrid configuration from environment variables
 */
export function getHybridConfigFromEnv(): Partial<HybridConfig> {
  const config: Partial<HybridConfig> = {
    global: {
      allowRuntimeSwitching: process.env[HYBRID_ENV_VARS.ALLOW_RUNTIME_SWITCHING] !== 'false',
      defaultFallbackMode: (process.env[HYBRID_ENV_VARS.DEFAULT_FALLBACK_MODE] as 'real' | 'simulated') || 'simulated',
      enableDebugLogging: process.env[HYBRID_ENV_VARS.ENABLE_DEBUG_LOGGING] === 'true',
      healthCheckInterval: parseInt(process.env[HYBRID_ENV_VARS.HEALTH_CHECK_INTERVAL] || '30000', 10),
    },
    features: {},
  };

  // Feature-specific modes from environment
  const featureModes = [
    { feature: 'registration', envVar: HYBRID_ENV_VARS.REGISTRATION_MODE },
    { feature: 'authentication', envVar: HYBRID_ENV_VARS.AUTHENTICATION_MODE },
    { feature: 'farmer', envVar: HYBRID_ENV_VARS.FARMER_MODE },
    { feature: 'inspector', envVar: HYBRID_ENV_VARS.INSPECTOR_MODE },
    { feature: 'logistics', envVar: HYBRID_ENV_VARS.LOGISTICS_MODE },
    { feature: 'packaging', envVar: HYBRID_ENV_VARS.PACKAGING_MODE },
    { feature: 'retailer', envVar: HYBRID_ENV_VARS.RETAILER_MODE },
    { feature: 'marketplace', envVar: HYBRID_ENV_VARS.MARKETPLACE_MODE },
    { feature: 'blockchain', envVar: HYBRID_ENV_VARS.BLOCKCHAIN_MODE },
  ];

  featureModes.forEach(({ feature, envVar }) => {
    const mode = process.env[envVar];
    if (mode && ['real', 'simulated', 'hybrid'].includes(mode.toLowerCase())) {
      if (!config.features) {
        config.features = {};
      }
      config.features[feature] = {
        feature,
        mode: mode.toLowerCase() as 'real' | 'simulated' | 'hybrid',
        allowRuntimeSwitching: true,
        fallbackMode: 'simulated',
        priority: 1,
      };
    }
  });

  return config;
}

/**
 * Validate hybrid configuration
 */
export function validateHybridConfig(config: HybridConfig): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Validate required features
  const requiredFeatures = ['registration', 'authentication'];
  requiredFeatures.forEach(feature => {
    if (!config.features[feature]) {
      errors.push(`Required feature '${feature}' is missing from configuration`);
    }
  });

  // Validate registration is always real
  if (config.features.registration?.mode !== 'real') {
    errors.push('Registration feature must be in real mode');
  }

  // Validate authentication supports hybrid
  const authMode = config.features.authentication?.mode;
  if (authMode && !['real', 'simulated', 'hybrid'].includes(authMode)) {
    errors.push(`Authentication mode '${authMode}' is invalid`);
  }

  // Validate data sources
  const registrationSources = Object.values(config.dataSources)
    .filter(ds => ds.feature === 'registration');

  if (registrationSources.length === 0) {
    errors.push('No data sources configured for registration feature');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
