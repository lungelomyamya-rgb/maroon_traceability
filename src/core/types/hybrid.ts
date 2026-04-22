// src/core/types/hybrid.ts
// Unified hybrid type definitions

/**
 * Hybrid mode types
 */
export type HybridMode = 'mock' | 'real' | 'hybrid' | 'simulated';

/**
 * Feature mode configuration
 */
export interface FeatureModeConfig {
  /** Feature name */
  feature: string;
  /** Current mode */
  mode: HybridMode;
  /** Allow runtime switching */
  allowRuntimeSwitching: boolean;
  /** Fallback mode if primary fails */
  fallbackMode: HybridMode;
  /** Feature priority (lower number = higher priority) */
  priority: number;
}

/**
 * Data source configuration
 */
export interface DataSourceConfig {
  /** Data source name */
  name: string;
  /** Data source type */
  type: 'mock' | 'real';
  /** Feature this data source belongs to */
  feature: string;
  /** Whether data source is active */
  active: boolean;
  /** Data source priority */
  priority: number;
  /** Connection configuration */
  connection: {
    endpoint?: string;
    credentials?: Record<string, string>;
    timeout: number;
    retry: {
      attempts: number;
      delay: number;
      backoff: 'linear' | 'exponential';
    };
  };
  /** Performance configuration */
  performance: {
    enableCache: boolean;
    cacheTTL: number;
    enableCompression: boolean;
  };
}

/**
 * Hybrid system configuration
 */
export interface HybridConfig {
  /** Feature mode configurations */
  features: Record<string, FeatureModeConfig>;
  /** Global configuration */
  global: {
    allowRuntimeSwitching: boolean;
    defaultFallbackMode: HybridMode;
    healthCheckInterval: number;
    enableDebugLogging: boolean;
  };
  /** Data source configurations */
  dataSources: Record<string, DataSourceConfig>;
}

/**
 * Hybrid context state
 */
export interface HybridContextState {
  /** Global mode */
  mode: 'development' | 'staging' | 'production';
  /** Feature-specific modes */
  featureModes: Record<string, HybridMode>;
  /** Runtime switching enabled */
  runtimeSwitching: boolean;
  /** Health monitoring enabled */
  healthMonitoring: boolean;
  /** Last mode switch timestamp */
  lastModeSwitch?: Date;
}

/**
 * Mode switch request
 */
export interface ModeSwitchRequest {
  /** Feature to switch */
  feature: string;
  /** New mode */
  newMode: HybridMode;
  /** Switch reason */
  reason?: string;
  /** Force switch even if unhealthy */
  force?: boolean;
}

/**
 * Mode switch result
 */
export interface ModeSwitchResult {
  /** Switch success */
  success: boolean;
  /** Previous mode */
  previousMode: HybridMode;
  /** New mode */
  newMode: HybridMode;
  /** Affected adapters */
  affectedAdapters: string[];
  /** Switch timestamp */
  timestamp: Date;
  /** Warnings during switch */
  warnings?: string[];
  /** Error if switch failed */
  error?: string;
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
  currentMode: string;
  /** Last health check */
  lastHealthCheck: Date;
  /** System metrics */
  metrics: {
    totalOperations: number;
    averageResponseTime: number;
    errorRate: number;
    uptime: number;
  };
}

/**
 * Custom error context for hybrid operations
 */
export interface CustomErrorContext {
  /** Feature name */
  feature?: string;
  /** Operation being performed */
  operation?: string;
  /** Current mode */
  mode?: HybridMode;
  /** Additional context data */
  [key: string]: unknown;
}

/**
 * Hybrid operation options
 */
export interface HybridOperationOptions {
  /** Force specific mode */
  mode?: HybridMode;
  /** Timeout in milliseconds */
  timeout?: number;
  /** Retry attempts */
  retryAttempts?: number;
  /** Fallback enabled */
  fallbackEnabled?: boolean;
  /** Operation context */
  context?: CustomErrorContext;
}

/**
 * Hybrid operation result
 */
export interface HybridOperationResult<T> {
  /** Operation success */
  success: boolean;
  /** Result data */
  data?: T;
  /** Error if operation failed */
  error?: string;
  /** Mode used for operation */
  mode: HybridMode;
  /** Operation duration */
  duration: number;
  /** Timestamp */
  timestamp: Date;
  /** Warnings during operation */
  warnings?: string[];
}

/**
 * Feature health status
 */
export interface FeatureHealthStatus {
  /** Feature name */
  feature: string;
  /** Overall health */
  isHealthy: boolean;
  /** Current mode */
  currentMode: HybridMode;
  /** Active adapters */
  activeAdapters: string[];
  /** Last health check */
  lastCheck: Date;
  /** Response time */
  responseTime: number;
  /** Error count */
  errorCount: number;
  /** Uptime percentage */
  uptime: number;
}

/**
 * Hybrid performance metrics
 */
export interface HybridPerformanceMetrics {
  /** Total operations */
  totalOperations: number;
  /** Operations by mode */
  operationsByMode: Record<HybridMode, number>;
  /** Successful operations */
  successfulOperations: number;
  /** Failed operations */
  failedOperations: number;
  /** Average response time */
  averageResponseTime: number;
  /** Operations per second */
  operationsPerSecond: number;
  /** Error rate */
  errorRate: number;
  /** Mode switches */
  modeSwitches: number;
  /** Fallback activations */
  fallbackActivations: number;
  /** Cache hit rate */
  cacheHitRate: number;
}

/**
 * Hybrid configuration validation result
 */
export interface HybridConfigValidationResult {
  /** Configuration is valid */
  valid: boolean;
  /** Validation errors */
  errors: string[];
  /** Validation warnings */
  warnings: string[];
  /** Required features missing */
  missingFeatures: string[];
  /** Invalid data sources */
  invalidDataSources: string[];
}

/**
 * Feature capabilities
 */
export interface FeatureCapabilities {
  /** Supports mock mode */
  supportsMock: boolean;
  /** Supports real mode */
  supportsReal: boolean;
  /** Supports hybrid mode */
  supportsHybrid: boolean;
  /** Supports runtime switching */
  supportsRuntimeSwitching: boolean;
  /** Supports fallback */
  supportsFallback: boolean;
  /** Required data sources */
  requiredDataSources: string[];
  /** Optional data sources */
  optionalDataSources: string[];
}

/**
 * Hybrid event types
 */
export type HybridEventType =
  | 'mode-switch'
  | 'adapter-registered'
  | 'adapter-unregistered'
  | 'health-check'
  | 'fallback-activated'
  | 'error'
  | 'warning';

/**
 * Hybrid event
 */
export interface HybridEvent {
  /** Event type */
  type: HybridEventType;
  /** Event timestamp */
  timestamp: Date;
  /** Feature name */
  feature?: string;
  /** Event data */
  data: Record<string, unknown>;
  /** Event severity */
  severity: 'low' | 'medium' | 'high' | 'critical';
}

/**
 * Hybrid event listener
 */
export type HybridEventListener = (event: HybridEvent) => void;

/**
 * Hybrid event emitter interface
 */
export interface IHybridEventEmitter {
  /** Add event listener */
  on(eventType: HybridEventType, listener: HybridEventListener): void;
  /** Remove event listener */
  off(eventType: HybridEventType, listener: HybridEventListener): void;
  /** Emit event */
  emit(event: HybridEvent): void;
  /** Remove all listeners */
  removeAllListeners(): void;
}
