// src/config/datasources.ts
// Data source definitions and configurations

import type { DataSourceConfig } from '../core/types/config';

/**
 * Mock data source configurations
 */
export const MOCK_DATA_SOURCES: Record<string, DataSourceConfig> = {
  // Authentication mock data source
  auth_mock: {
    name: 'auth_mock',
    type: 'mock',
    feature: 'authentication',
    active: true,
    priority: 2,
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
};

/**
 * Real data source configurations
 */
export const REAL_DATA_SOURCES: Record<string, DataSourceConfig> = {
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

  // Farmer real data source (future API)
  farmer_api: {
    name: 'farmer_api',
    type: 'real',
    feature: 'farmer',
    active: false, // Not yet implemented
    priority: 1,
    connection: {
      endpoint: process.env.FARMER_API_URL,
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

  // Inspector real data source (future API)
  inspector_api: {
    name: 'inspector_api',
    type: 'real',
    feature: 'inspector',
    active: false, // Not yet implemented
    priority: 1,
    connection: {
      endpoint: process.env.INSPECTOR_API_URL,
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

  // Logistics real data source (future API)
  logistics_api: {
    name: 'logistics_api',
    type: 'real',
    feature: 'logistics',
    active: false, // Not yet implemented
    priority: 1,
    connection: {
      endpoint: process.env.LOGISTICS_API_URL,
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

  // Packaging real data source (future API)
  packaging_api: {
    name: 'packaging_api',
    type: 'real',
    feature: 'packaging',
    active: false, // Not yet implemented
    priority: 1,
    connection: {
      endpoint: process.env.PACKAGING_API_URL,
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

  // Retailer real data source (future API)
  retailer_api: {
    name: 'retailer_api',
    type: 'real',
    feature: 'retailer',
    active: false, // Not yet implemented
    priority: 1,
    connection: {
      endpoint: process.env.RETAILER_API_URL,
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

  // Marketplace real data source (future API)
  marketplace_api: {
    name: 'marketplace_api',
    type: 'real',
    feature: 'marketplace',
    active: false, // Not yet implemented
    priority: 1,
    connection: {
      endpoint: process.env.MARKETPLACE_API_URL,
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

  // Blockchain real data source (future API)
  blockchain_api: {
    name: 'blockchain_api',
    type: 'real',
    feature: 'blockchain',
    active: false, // Not yet implemented
    priority: 1,
    connection: {
      endpoint: process.env.BLOCKCHAIN_API_URL,
      timeout: 15000,
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
};

/**
 * Get data sources by feature
 */
export function getDataSourcesByFeature(feature: string): DataSourceConfig[] {
  const allSources = { ...MOCK_DATA_SOURCES, ...REAL_DATA_SOURCES };
  return Object.values(allSources).filter(source => source.feature === feature);
}

/**
 * Get data sources by type
 */
export function getDataSourcesByType(type: 'mock' | 'real' | 'hybrid'): DataSourceConfig[] {
  const allSources = { ...MOCK_DATA_SOURCES, ...REAL_DATA_SOURCES };
  return Object.values(allSources).filter(source => source.type === type);
}

/**
 * Get active data sources
 */
export function getActiveDataSources(): DataSourceConfig[] {
  const allSources = { ...MOCK_DATA_SOURCES, ...REAL_DATA_SOURCES };
  return Object.values(allSources).filter(source => source.active);
}

/**
 * Get data source by name
 */
export function getDataSourceByName(name: string): DataSourceConfig | null {
  const allSources = { ...MOCK_DATA_SOURCES, ...REAL_DATA_SOURCES };
  return allSources[name] || null;
}

/**
 * Get data sources for hybrid configuration
 */
export function getHybridDataSources(feature: string): {
  primary: DataSourceConfig[];
  fallback: DataSourceConfig[];
} {
  const sources = getDataSourcesByFeature(feature);

  // Sort by priority (higher priority first)
  const sortedSources = sources.sort((a, b) => b.priority - a.priority);

  // Split into primary and fallback
  const primary = sortedSources.filter(source => source.priority <= 2);
  const fallback = sortedSources.filter(source => source.priority > 2);

  return { primary, fallback };
}
