// src/core/types/config.ts
// Configuration types for hybrid data architecture

/**
 * Feature mode configuration
 */
export interface FeatureModeConfig {
  /** Feature identifier */
  feature: string;
  /** Current mode */
  mode: 'real' | 'simulated' | 'hybrid';
  /** Whether mode can be switched at runtime */
  allowRuntimeSwitching: boolean;
  /** Fallback mode if primary fails */
  fallbackMode?: 'real' | 'simulated';
  /** Priority for hybrid mode */
  priority?: number;
  /** Last updated timestamp */
  lastUpdated?: string;
}

/**
 * Global hybrid configuration
 */
export interface HybridConfig {
  /** Feature-specific configurations */
  features: Record<string, FeatureModeConfig>;
  /** Global settings */
  global: {
    /** Allow runtime mode switching */
    allowRuntimeSwitching: boolean;
    /** Default fallback behavior */
    defaultFallbackMode: 'real' | 'simulated';
    /** Health check interval in milliseconds */
    healthCheckInterval: number;
    /** Enable debug logging */
    enableDebugLogging: boolean;
  };
  /** Data source configurations */
  dataSources: Record<string, DataSourceConfig>;
}

/**
 * Data source configuration
 */
export interface DataSourceConfig {
  /** Data source name */
  name: string;
  /** Data source type */
  type: 'mock' | 'real' | 'hybrid';
  /** Associated feature */
  feature: string;
  /** Whether this source is active */
  active: boolean;
  /** Priority for hybrid sources */
  priority: number;
  /** Connection configuration */
  connection: {
    /** Connection string or endpoint */
    endpoint?: string;
    /** Authentication credentials */
    credentials?: Record<string, string>;
    /** Connection timeout in milliseconds */
    timeout?: number;
    /** Retry configuration */
    retry?: {
      attempts: number;
      delay: number;
      backoff: 'linear' | 'exponential';
    };
  };
  /** Performance configuration */
  performance?: {
    /** Enable caching */
    enableCache: boolean;
    /** Cache TTL in milliseconds */
    cacheTTL?: number;
    /** Enable compression */
    enableCompression: boolean;
  };
}

/**
 * Environment-specific configuration
 */
export interface EnvironmentConfig {
  /** Current environment */
  environment: 'development' | 'staging' | 'production' | 'test';
  /** Feature flags */
  featureFlags: Record<string, boolean>;
  /** Hybrid configuration */
  hybrid: HybridConfig;
  /** Logging configuration */
  logging: {
    /** Log level */
    level: 'debug' | 'info' | 'warn' | 'error';
    /** Enable console logging */
    enableConsole: boolean;
    /** Enable remote logging */
    enableRemote: boolean;
    /** Remote logging endpoint */
    remoteEndpoint?: string;
  };
}

/**
 * Mode detection result
 */
export interface ModeDetectionResult {
  /** Detected mode */
  mode: 'real' | 'simulated' | 'hybrid';
  /** Detection source */
  source: 'environment' | 'config' | 'runtime' | 'fallback';
  /** Confidence level */
  confidence: number;
  /** Additional metadata */
  metadata?: Record<string, unknown>;
}

/**
 * Adapter health status
 */
export interface AdapterHealthStatus {
  /** Adapter identifier */
  adapterId: string;
  /** Health status */
  status: 'healthy' | 'degraded' | 'unhealthy';
  /** Last health check timestamp */
  lastCheck: string;
  /** Response time in milliseconds */
  responseTime?: number;
  /** Error message if unhealthy */
  error?: string;
  /** Additional metrics */
  metrics?: Record<string, number>;
}

/**
 * Configuration validation result
 */
export interface ConfigValidationResult {
  /** Whether configuration is valid */
  valid: boolean;
  /** Validation errors */
  errors: string[];
  /** Validation warnings */
  warnings: string[];
  /** Validated configuration */
  config?: HybridConfig;
}

/**
 * Runtime configuration state
 */
export interface RuntimeConfigState {
  /** Current configuration */
  config: HybridConfig;
  /** Last updated timestamp */
  lastUpdated: string;
  /** Configuration version */
  version: string;
  /** Active adapters */
  activeAdapters: Record<string, string>;
  /** Health status of adapters */
  adapterHealth: Record<string, AdapterHealthStatus>;
}
