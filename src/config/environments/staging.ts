// src/config/environments/staging.ts
// Staging environment configuration

import type { HybridConfig } from '../../core/types';

/**
 * Staging environment hybrid configuration
 */
export const stagingConfig: HybridConfig = {
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
      mode: 'hybrid', // Dual-mode as per requirements
      allowRuntimeSwitching: true,
      fallbackMode: 'simulated',
      priority: 2,
    },

    // Some features start to use real data in staging
    farmer: {
      feature: 'farmer',
      mode: 'real', // Real data in staging
      allowRuntimeSwitching: true,
      fallbackMode: 'simulated',
      priority: 3,
    },

    inspector: {
      feature: 'inspector',
      mode: 'real', // Real data in staging
      allowRuntimeSwitching: true,
      fallbackMode: 'simulated',
      priority: 4,
    },

    // Other features remain simulated
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
    enableDebugLogging: true,
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

    // Real data sources for staging
    farmer_staging: {
      name: 'farmer_staging',
      type: 'real',
      feature: 'farmer',
      active: true,
      priority: 1,
      connection: {
        endpoint: process.env.NEXT_PUBLIC_STAGING_API_URL,
        timeout: 5000,
        retry: {
          attempts: 2,
          delay: 2000,
          backoff: 'exponential',
        },
      },
      performance: {
        enableCache: true,
        cacheTTL: 120000, // 2 minutes
        enableCompression: true,
      },
    },

    inspector_staging: {
      name: 'inspector_staging',
      type: 'real',
      feature: 'inspector',
      active: true,
      priority: 1,
      connection: {
        endpoint: process.env.NEXT_PUBLIC_STAGING_API_URL,
        timeout: 5000,
        retry: {
          attempts: 2,
          delay: 2000,
          backoff: 'exponential',
        },
      },
      performance: {
        enableCache: true,
        cacheTTL: 120000, // 2 minutes
        enableCompression: true,
      },
    },

    // Mock data sources for other features
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
