// src/types/hybrid.ts
// Type definitions for hybrid data architecture

import type { AdapterHealth } from '../core/interfaces';
import type { AdapterConfig } from '../core/types/adapter';

/**
 * Hybrid mode configuration
 */
export interface HybridModeConfig {
  /** Current hybrid mode */
  mode: 'development' | 'production' | 'test' | 'demo';
  /** Feature-specific configurations */
  features: Record<string, FeatureHybridConfig>;
  /** Global hybrid settings */
  global: GlobalHybridConfig;
}

/**
 * Feature-specific hybrid configuration
 */
export interface FeatureHybridConfig {
  /** Feature name */
  name: string;
  /** Data mode for this feature */
  dataMode: 'mock' | 'real' | 'hybrid';
  /** Primary adapter type */
  primaryAdapter?: 'mock' | 'real';
  /** Fallback adapter type */
  fallbackAdapter?: 'mock' | 'real';
  /** Auto-failover enabled */
  autoFailover?: boolean;
  /** Health check interval */
  healthCheckInterval?: number;
  /** Retry configuration */
  retryConfig?: RetryConfig;
  /** Cache configuration */
  cacheConfig?: CacheConfig;
}

/**
 * Global hybrid configuration
 */
export interface GlobalHybridConfig {
  /** Default data mode for new features */
  defaultDataMode: 'mock' | 'real' | 'hybrid';
  /** Health monitoring enabled */
  healthMonitoring: boolean;
  /** Global health check interval */
  globalHealthInterval: number;
  /** Default timeout for operations */
  defaultTimeout: number;
  /** Enable adapter caching */
  enableCaching: boolean;
  /** Default cache TTL */
  defaultCacheTTL: number;
  /** Logging configuration */
  logging: LoggingConfig;
}

/**
 * Retry configuration
 */
export interface RetryConfig {
  /** Maximum retry attempts */
  maxAttempts: number;
  /** Base delay between retries */
  baseDelay: number;
  /** Maximum delay */
  maxDelay: number;
  /** Exponential backoff enabled */
  exponentialBackoff: boolean;
  /** Retry condition function */
  retryCondition?: (error: Error) => boolean;
}

/**
 * Cache configuration
 */
export interface CacheConfig {
  /** Enable caching */
  enabled: boolean;
  /** TTL in milliseconds */
  ttl: number;
  /** Maximum cache size */
  maxSize?: number;
  /** Cache strategy */
  strategy: 'lru' | 'fifo' | 'lfu';
}

/**
 * Logging configuration
 */
export interface LoggingConfig {
  /** Enable logging */
  enabled: boolean;
  /** Log level */
  level: 'debug' | 'info' | 'warn' | 'error';
  /** Log adapter operations */
  logAdapterOps: boolean;
  /** Log health checks */
  logHealthChecks: boolean;
  /** Log mode switches */
  logModeSwitches: boolean;
}

/**
 * Hybrid context state
 */
export interface HybridContextState {
  /** Current hybrid mode */
  mode: HybridModeConfig['mode'];
  /** Feature modes */
  featureModes: Record<string, 'mock' | 'real' | 'hybrid'>;
  /** Runtime mode switching enabled */
  runtimeSwitching: boolean;
  /** Health monitoring status */
  healthMonitoring: boolean;
  /** Last mode switch timestamp */
  lastModeSwitch?: Date;
}

/**
 * Mode switch request
 */
export interface ModeSwitchRequest {
  /** Feature to switch (or 'global' for all) */
  feature: string;
  /** New mode */
  newMode: FeatureHybridConfig['dataMode'];
  /** Reason for switch */
  reason?: string;
  /** Force switch even if adapter is unhealthy */
  force?: boolean;
}

/**
 * Mode switch result
 */
export interface ModeSwitchResult {
  /** Switch successful */
  success: boolean;
  /** Previous mode */
  previousMode: FeatureHybridConfig['dataMode'];
  /** New mode */
  newMode: FeatureHybridConfig['dataMode'];
  /** Affected adapters */
  affectedAdapters: string[];
  /** Switch timestamp */
  timestamp: Date;
  /** Error if switch failed */
  error?: string;
  /** Warnings during switch */
  warnings?: string[];
}

/**
 * Hybrid adapter configuration
 */
export interface HybridAdapterConfig extends AdapterConfig {
  /** Primary adapter configuration */
  primary: {
    type: 'mock' | 'real';
    config?: AdapterConfig;
  };
  /** Fallback adapter configuration */
  fallback?: {
    type: 'mock' | 'real';
    config?: AdapterConfig;
  };
  /** Failover configuration */
  failover: {
    /** Auto-failover enabled */
    enabled: boolean;
    /** Failover condition */
    condition?: (error: Error) => boolean;
    /** Failover timeout */
    timeout?: number;
    /** Retry on failover */
    retryOnFailover: boolean;
  };
  /** Health monitoring */
  healthMonitoring: {
    /** Enable health checks */
    enabled: boolean;
    /** Check interval */
    interval: number;
    /** Unhealthy threshold */
    unhealthyThreshold: number;
  };
}

/**
 * Adapter performance metrics
 */
export interface AdapterMetrics {
  /** Adapter identifier */
  adapterId: string;
  /** Total operations */
  totalOperations: number;
  /** Successful operations */
  successfulOperations: number;
  /** Failed operations */
  failedOperations: number;
  /** Average response time */
  averageResponseTime: number;
  /** Last operation timestamp */
  lastOperation?: Date;
  /** Operations per minute */
  operationsPerMinute: number;
  /** Error rate percentage */
  errorRate: number;
  /** Uptime percentage */
  uptime: number;
}

/**
 * Hybrid system status
 */
export interface HybridSystemStatus {
  /** Overall system health */
  systemHealth: 'healthy' | 'degraded' | 'unhealthy';
  /** Active features */
  activeFeatures: string[];
  /** Total adapters */
  totalAdapters: number;
  /** Healthy adapters */
  healthyAdapters: number;
  /** Current mode */
  currentMode: HybridModeConfig['mode'];
  /** Last health check */
  lastHealthCheck?: Date;
  /** System metrics */
  metrics: {
    totalOperations: number;
    averageResponseTime: number;
    errorRate: number;
    uptime: number;
  };
}

/**
 * Hybrid events
 */
export interface HybridEvents {
  'mode:switch': (request: ModeSwitchRequest, result: ModeSwitchResult) => void;
  'adapter:failover': (adapterId: string, from: string, to: string) => void;
  'health:changed': (adapterId: string, health: AdapterHealth) => void;
  'system:status': (status: HybridSystemStatus) => void;
}

/**
 * Hybrid error types
 */
export class HybridError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly feature?: string,
    public readonly adapterId?: string,
  ) {
    super(message);
    this.name = 'HybridError';
  }
}

/**
 * Mode switch error
 */
export class ModeSwitchError extends HybridError {
  constructor(
    feature: string,
    fromMode: string,
    toMode: string,
    cause: Error,
  ) {
    super(
      `Failed to switch mode for feature ${feature} from ${fromMode} to ${toMode}: ${cause.message}`,
      'MODE_SWITCH_FAILED',
      feature,
    );
    this.cause = cause;
  }
}

/**
 * Adapter failover error
 */
export class AdapterFailoverError extends HybridError {
  constructor(
    adapterId: string,
    feature: string,
    cause: Error,
  ) {
    super(
      `Adapter failover failed for ${adapterId} in feature ${feature}: ${cause.message}`,
      'ADAPTER_FAILOVER_FAILED',
      feature,
      adapterId,
    );
    this.cause = cause;
  }
}
