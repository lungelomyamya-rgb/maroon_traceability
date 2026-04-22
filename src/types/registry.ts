// src/types/registry.ts
// Type definitions for the adapter registry system

import type { BaseAdapter, AdapterConfig } from '../core/types/adapter';

/**
 * Adapter registry configuration
 */
export interface RegistryConfig {
  /** Default timeout for adapter operations */
  defaultTimeout?: number;
  /** Health check interval in milliseconds */
  healthCheckInterval?: number;
  /** Maximum retry attempts for failed operations */
  maxRetryAttempts?: number;
  /** Whether to enable adapter caching */
  enableCaching?: boolean;
  /** Cache TTL in milliseconds */
  cacheTTL?: number;
}

/**
 * Adapter metadata for registry
 */
export interface AdapterMetadata {
  /** Adapter identifier */
  id: string;
  /** Adapter type (mock, real, hybrid) */
  type: 'mock' | 'real' | 'hybrid';
  /** Feature this adapter belongs to */
  feature: string;
  /** Adapter priority for hybrid selection */
  priority: number;
  /** Whether adapter is currently active */
  active: boolean;
  /** Adapter health status */
  health: AdapterHealth;
  /** Last health check timestamp */
  lastHealthCheck?: Date;
  /** Adapter configuration */
  config?: AdapterConfig;
  /** Adapter instance */
  instance?: BaseAdapter;
}

/**
 * Adapter health status
 */
export interface AdapterHealth {
  /** Overall health status */
  status: 'healthy' | 'degraded' | 'unhealthy' | 'unknown';
  /** Response time in milliseconds */
  responseTime?: number;
  /** Success rate percentage */
  successRate?: number;
  /** Error count */
  errorCount: number;
  /** Last error message */
  lastError?: string;
  /** Last error timestamp */
  lastErrorTime?: Date;
  /** Uptime percentage */
  uptime?: number;
}

/**
 * Registry statistics
 */
export interface RegistryStats {
  /** Total registered adapters */
  totalAdapters: number;
  /** Active adapters count */
  activeAdapters: number;
  /** Healthy adapters count */
  healthyAdapters: number;
  /** Adapters by feature */
  adaptersByFeature: Record<string, number>;
  /** Adapters by type */
  adaptersByType: Record<string, number>;
  /** Average response time */
  averageResponseTime?: number;
  /** Overall system health */
  systemHealth: 'healthy' | 'degraded' | 'unhealthy';
}

/**
 * Adapter selection criteria
 */
export interface AdapterSelectionCriteria {
  /** Feature name */
  feature: string;
  /** Preferred adapter type */
  preferredType?: 'mock' | 'real' | 'hybrid';
  /** Minimum health status */
  minHealth?: AdapterHealth['status'];
  /** Maximum response time */
  maxResponseTime?: number;
  /** Minimum success rate */
  minSuccessRate?: number;
  /** Custom filter function */
  filter?: (metadata: AdapterMetadata) => boolean;
}

/**
 * Adapter factory interface
 */
export interface IAdapterFactory {
  /** Create adapter instance */
  create<T extends BaseAdapter>(
    type: string,
    feature: string,
    config?: AdapterConfig
  ): Promise<T>;
  /** Register adapter constructor */
  register<T extends BaseAdapter>(
    type: string,
    feature: string,
    constructor: new (config?: AdapterConfig) => T
  ): void;
  /** Get available adapter types */
  getAvailableTypes(): string[];
  /** Get available features */
  getAvailableFeatures(): string[];
}

/**
 * Health monitor interface
 */
export interface IHealthMonitor {
  /** Start health monitoring */
  start(): void;
  /** Stop health monitoring */
  stop(): void;
  /** Check adapter health */
  checkHealth(adapterId: string): Promise<AdapterHealth>;
  /** Get health status for all adapters */
  getAllHealth(): Record<string, AdapterHealth>;
  /** Subscribe to health changes */
  onHealthChange(
    callback: (adapterId: string, health: AdapterHealth) => void
  ): () => void;
}

/**
 * Service orchestrator interface
 */
export interface IServiceOrchestrator {
  /** Initialize all services */
  initialize(): Promise<void>;
  /** Shutdown all services */
  shutdown(): Promise<void>;
  /** Get service status */
  getStatus(): Record<string, 'running' | 'stopped' | 'error'>;
  /** Register service */
  registerService(name: string, service: unknown): void;
  /** Get service */
  getService<T = unknown>(name: string): T | undefined;
}

/**
 * Registry events
 */
export interface RegistryEvents {
  'adapter:registered': (metadata: AdapterMetadata) => void;
  'adapter:unregistered': (adapterId: string) => void;
  'adapter:health-changed': (adapterId: string, health: AdapterHealth) => void;
  'adapter:activated': (adapterId: string) => void;
  'adapter:deactivated': (adapterId: string) => void;
  'registry:initialized': () => void;
  'registry:shutdown': () => void;
}

/**
 * Adapter cache entry
 */
export interface AdapterCacheEntry<T = unknown> {
  /** Cached data */
  data: T;
  /** Cache timestamp */
  timestamp: Date;
  /** TTL in milliseconds */
  ttl: number;
  /** Cache key */
  key: string;
}

/**
 * Registry error types
 */
export class RegistryError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly adapterId?: string,
    public readonly feature?: string,
  ) {
    super(message);
    this.name = 'RegistryError';
  }
}

/**
 * Adapter not found error
 */
export class AdapterNotFoundError extends RegistryError {
  constructor(adapterId: string, feature?: string) {
    super(
      `Adapter not found: ${adapterId}${feature ? ` for feature: ${feature}` : ''}`,
      'ADAPTER_NOT_FOUND',
      adapterId,
      feature,
    );
  }
}

/**
 * Adapter creation error
 */
export class AdapterCreationError extends RegistryError {
  constructor(adapterId: string, cause: Error) {
    super(
      `Failed to create adapter: ${adapterId}. Cause: ${cause.message}`,
      'ADAPTER_CREATION_FAILED',
      adapterId,
    );
    this.cause = cause;
  }
}

/**
 * Health check error
 */
export class HealthCheckError extends RegistryError {
  constructor(adapterId: string, cause: Error) {
    super(
      `Health check failed for adapter: ${adapterId}. Cause: ${cause.message}`,
      'HEALTH_CHECK_FAILED',
      adapterId,
    );
    this.cause = cause;
  }
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
  currentMode: 'development' | 'production' | 'test' | 'demo';
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
