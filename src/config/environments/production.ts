// src/config/environments/production.ts
// Production environment configuration

import type { HybridConfig } from '../../core/types';

/**
 * Production environment hybrid configuration
 */
export const productionConfig: HybridConfig = {
  features: {
    // Registration is always real (requirement)
    registration: {
      feature: 'registration',
      mode: 'real',
      allowRuntimeSwitching: false, // Cannot switch registration mode
      fallbackMode: 'simulated',
      priority: 1,
    },

    // Authentication is real-only in production (requirement)
    authentication: {
      feature: 'authentication',
      mode: 'real', // Real only in production
      allowRuntimeSwitching: false, // No runtime switching in production
      fallbackMode: 'simulated',
      priority: 2,
    },

    // Most features are real in production
    farmer: {
      feature: 'farmer',
      mode: 'real', // Real data in production
      allowRuntimeSwitching: false, // No runtime switching in production
      fallbackMode: 'simulated',
      priority: 3,
    },

    inspector: {
      feature: 'inspector',
      mode: 'real', // Real data in production
      allowRuntimeSwitching: false,
      fallbackMode: 'simulated',
      priority: 4,
    },

    logistics: {
      feature: 'logistics',
      mode: 'real', // Real data in production
      allowRuntimeSwitching: false,
      fallbackMode: 'simulated',
      priority: 5,
    },

    packaging: {
      feature: 'packaging',
      mode: 'real', // Real data in production
      allowRuntimeSwitching: false,
      fallbackMode: 'simulated',
      priority: 6,
    },

    retailer: {
      feature: 'retailer',
      mode: 'real', // Real data in production
      allowRuntimeSwitching: false,
      fallbackMode: 'simulated',
      priority: 7,
    },

    marketplace: {
      feature: 'marketplace',
      mode: 'real', // Real data in production
      allowRuntimeSwitching: false,
      fallbackMode: 'simulated',
      priority: 8,
    },

    blockchain: {
      feature: 'blockchain',
      mode: 'real', // Real blockchain in production
      allowRuntimeSwitching: false,
      fallbackMode: 'simulated',
      priority: 9,
    },
  },

  global: {
    allowRuntimeSwitching: false, // No runtime switching in production
    defaultFallbackMode: 'simulated',
    healthCheckInterval: 60000, // 1 minute in production
    enableDebugLogging: false, // No debug logging in production
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
        timeout: 15000, // Longer timeout in production
        retry: {
          attempts: 5,
          delay: 2000,
          backoff: 'exponential',
        },
      },
      performance: {
        enableCache: true,
        cacheTTL: 600000, // 10 minutes in production
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
        timeout: 15000,
        retry: {
          attempts: 5,
          delay: 2000,
          backoff: 'exponential',
        },
      },
      performance: {
        enableCache: true,
        cacheTTL: 600000, // 10 minutes
        enableCompression: true,
      },
    },

    // Production data sources
    farmer_production: {
      name: 'farmer_production',
      type: 'real',
      feature: 'farmer',
      active: true,
      priority: 1,
      connection: {
        endpoint: process.env.NEXT_PUBLIC_PRODUCTION_API_URL,
        timeout: 10000,
        retry: {
          attempts: 3,
          delay: 3000,
          backoff: 'exponential',
        },
      },
      performance: {
        enableCache: true,
        cacheTTL: 300000, // 5 minutes
        enableCompression: true,
      },
    },

    inspector_production: {
      name: 'inspector_production',
      type: 'real',
      feature: 'inspector',
      active: true,
      priority: 1,
      connection: {
        endpoint: process.env.NEXT_PUBLIC_PRODUCTION_API_URL,
        timeout: 10000,
        retry: {
          attempts: 3,
          delay: 3000,
          backoff: 'exponential',
        },
      },
      performance: {
        enableCache: true,
        cacheTTL: 300000, // 5 minutes
        enableCompression: true,
      },
    },

    logistics_production: {
      name: 'logistics_production',
      type: 'real',
      feature: 'logistics',
      active: true,
      priority: 1,
      connection: {
        endpoint: process.env.NEXT_PUBLIC_PRODUCTION_API_URL,
        timeout: 10000,
        retry: {
          attempts: 3,
          delay: 3000,
          backoff: 'exponential',
        },
      },
      performance: {
        enableCache: true,
        cacheTTL: 300000, // 5 minutes
        enableCompression: true,
      },
    },

    packaging_production: {
      name: 'packaging_production',
      type: 'real',
      feature: 'packaging',
      active: true,
      priority: 1,
      connection: {
        endpoint: process.env.NEXT_PUBLIC_PRODUCTION_API_URL,
        timeout: 10000,
        retry: {
          attempts: 3,
          delay: 3000,
          backoff: 'exponential',
        },
      },
      performance: {
        enableCache: true,
        cacheTTL: 300000, // 5 minutes
        enableCompression: true,
      },
    },

    retailer_production: {
      name: 'retailer_production',
      type: 'real',
      feature: 'retailer',
      active: true,
      priority: 1,
      connection: {
        endpoint: process.env.NEXT_PUBLIC_PRODUCTION_API_URL,
        timeout: 10000,
        retry: {
          attempts: 3,
          delay: 3000,
          backoff: 'exponential',
        },
      },
      performance: {
        enableCache: true,
        cacheTTL: 300000, // 5 minutes
        enableCompression: true,
      },
    },

    marketplace_production: {
      name: 'marketplace_production',
      type: 'real',
      feature: 'marketplace',
      active: true,
      priority: 1,
      connection: {
        endpoint: process.env.NEXT_PUBLIC_PRODUCTION_API_URL,
        timeout: 10000,
        retry: {
          attempts: 3,
          delay: 3000,
          backoff: 'exponential',
        },
      },
      performance: {
        enableCache: true,
        cacheTTL: 300000, // 5 minutes
        enableCompression: true,
      },
    },

    blockchain_production: {
      name: 'blockchain_production',
      type: 'real',
      feature: 'blockchain',
      active: true,
      priority: 1,
      connection: {
        endpoint: process.env.NEXT_PUBLIC_BLOCKCHAIN_RPC_URL,
        timeout: 20000, // Longer timeout for blockchain
        retry: {
          attempts: 5,
          delay: 5000,
          backoff: 'exponential',
        },
      },
      performance: {
        enableCache: false, // No caching for blockchain
        cacheTTL: 0,
        enableCompression: false,
      },
    },
  },
};
