// src/core/interfaces/IHybridService.ts
// Hybrid service interface for managing hybrid operations

import type { AdapterConfig } from './IAdapter';

/**
 * Operation parameters interface
 */
interface OperationParameters {
  [key: string]: unknown;
}

/**
 * Hybrid service interface for managing dual-mode operations
 * Provides high-level abstraction for hybrid functionality
 */
export interface IHybridService {
  /**
   * Service name/identifier
   */
  readonly name: string;

  /**
   * Current service mode
   */
  readonly mode: 'mock' | 'real' | 'hybrid';

  /**
   * Service capabilities
   */
  readonly capabilities: ServiceCapabilities;

  /**
   * Initialize service
   * @param config - Service configuration
   */
  initialize(config: HybridServiceConfig): Promise<void>;

  /**
   * Execute operation in current mode
   * @param operation - Operation to execute
   * @param params - Operation parameters
   * @returns Promise resolving to operation result
   */
  execute<T>(operation: string, params?: OperationParameters): Promise<T>;

  /**
   * Execute operation with specific mode override
   * @param operation - Operation to execute
   * @param mode - Mode to use for this operation
   * @param params - Operation parameters
   * @returns Promise resolving to operation result
   */
  executeWithMode<T>(operation: string, mode: 'mock' | 'real' | 'hybrid', params?: OperationParameters): Promise<T>;

  /**
   * Get service health status
   * @returns Promise resolving to health status
   */
  getHealth(): Promise<ServiceHealth>;

  /**
   * Switch service mode
   * @param mode - New mode to switch to
   * @param options - Switch options
   * @returns Promise resolving to switch result
   */
  switchMode(mode: 'mock' | 'real' | 'hybrid', options?: ModeSwitchOptions): Promise<ModeSwitchResult>;

  /**
   * Get available operations
   * @returns Array of available operation names
   */
  getAvailableOperations(): string[];

  /**
   * Get service metrics
   * @returns Promise resolving to service metrics
   */
  getMetrics(): Promise<ServiceMetrics>;

  /**
   * Cleanup service resources
   */
  cleanup(): Promise<void>;
}

/**
 * Hybrid service configuration
 */
export interface HybridServiceConfig {
  /** Service name */
  name: string;

  /** Default mode */
  defaultMode: 'mock' | 'real' | 'hybrid';

  /** Feature this service belongs to */
  feature: string;

  /** Mode switching configuration */
  modeSwitching: {
    allowRuntimeSwitching: boolean;
    requireConfirmation: boolean;
    fallbackEnabled: boolean;
    healthCheckBeforeSwitch: boolean;
  };

  /** Adapter configuration */
  adapters: {
    mock: AdapterConfig;
    real: AdapterConfig;
    hybrid?: AdapterConfig;
  };

  /** Performance configuration */
  performance: {
    enableCaching: boolean;
    cacheTTL: number;
    enableMetrics: boolean;
    metricsInterval: number;
  };

  /** Health monitoring configuration */
  health: {
    enabled: boolean;
    checkInterval: number;
    timeout: number;
    retryAttempts: number;
  };
}

/**
 * Service capabilities
 */
export interface ServiceCapabilities {
  supportsMockMode: boolean;
  supportsRealMode: boolean;
  supportsHybridMode: boolean;
  supportsRuntimeSwitching: boolean;
  supportsFallback: boolean;
  supportsHealthMonitoring: boolean;
  supportsMetrics: boolean;
  supportedOperations: string[];
}

/**
 * Service health status
 */
export interface ServiceHealth {
  isHealthy: boolean;
  overallStatus: 'healthy' | 'degraded' | 'unhealthy' | 'unknown';
  lastCheck: Date;
  responseTime: number;
  uptime: number;
  mode: 'mock' | 'real' | 'hybrid';
  activeAdapter: string;
  adapters: {
    [adapterName: string]: AdapterHealthStatus;
  };
  errors: ServiceError[];
  warnings: ServiceWarning[];
}

/**
 * Adapter health status within service
 */
export interface AdapterHealthStatus {
  isHealthy: boolean;
  status: 'healthy' | 'degraded' | 'unhealthy' | 'unknown';
  lastCheck: Date;
  responseTime: number;
  consecutiveFailures: number;
  lastError?: string;
}

/**
 * Mode switch options
 */
export interface ModeSwitchOptions {
  /** Force switch even if unhealthy */
  force?: boolean;

  /** Reason for switching */
  reason?: string;

  /** Whether to validate before switching */
  validateBeforeSwitch?: boolean;

  /** Whether to persist the change */
  persist?: boolean;

  /** Timeout for switch operation */
  timeout?: number;
}

/**
 * Mode switch result
 */
export interface ModeSwitchResult {
  success: boolean;
  previousMode: string;
  newMode: string;
  affectedAdapters: string[];
  timestamp: Date;
  duration: number;
  warnings?: string[];
  error?: string;
  rollbackAvailable: boolean;
}

/**
 * Service metrics
 */
export interface ServiceMetrics {
  totalOperations: number;
  operationsByMode: {
    mock: number;
    real: number;
    hybrid: number;
  };
  successfulOperations: number;
  failedOperations: number;
  averageResponseTime: number;
  operationsPerSecond: number;
  errorRate: number;
  uptime: number;
  lastOperation: Date;
  modeSwitches: number;
  fallbackActivations: number;
}

/**
 * Service error
 */
export interface ServiceError {
  timestamp: Date;
  code: string;
  message: string;
  operation?: string;
  adapter?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  resolved: boolean;
}

/**
 * Service warning
 */
export interface ServiceWarning {
  timestamp: Date;
  code: string;
  message: string;
  operation?: string;
  adapter?: string;
  severity: 'info' | 'warning';
  acknowledged: boolean;
}

/**
 * Base hybrid service error
 */
export class HybridServiceError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly serviceName: string,
    public readonly operation?: string,
  ) {
    super(message);
    this.name = 'HybridServiceError';
  }
}

/**
 * Service initialization error
 */
export class ServiceInitializationError extends HybridServiceError {
  constructor(serviceName: string, cause: Error) {
    super(
      `Failed to initialize service ${serviceName}: ${cause.message}`,
      'SERVICE_INITIALIZATION_ERROR',
      serviceName,
    );
    this.name = 'ServiceInitializationError';
    this.cause = cause;
  }

  readonly cause: Error;
}

/**
 * Mode switch error
 */
export class ModeSwitchError extends HybridServiceError {
  public readonly fromMode: string;
  public readonly toMode: string;
  public readonly cause: Error;

  constructor(
    serviceName: string,
    fromMode: string,
    toMode: string,
    cause: Error,
  ) {
    super(
      `Failed to switch service ${serviceName} from ${fromMode} to ${toMode}: ${cause.message}`,
      'MODE_SWITCH_ERROR',
      serviceName,
      'switchMode',
    );
    this.name = 'ModeSwitchError';
    this.fromMode = fromMode;
    this.toMode = toMode;
    this.cause = cause;
  }
}

/**
 * Operation execution error
 */
export class OperationExecutionError extends HybridServiceError {
  public readonly operation: string;
  public readonly mode: string;
  public readonly cause: Error;

  constructor(
    serviceName: string,
    operation: string,
    mode: string,
    cause: Error,
  ) {
    super(
      `Failed to execute operation ${operation} in ${mode} mode for service ${serviceName}: ${cause.message}`,
      'OPERATION_EXECUTION_ERROR',
      serviceName,
      operation,
    );
    this.name = 'OperationExecutionError';
    this.operation = operation;
    this.mode = mode;
    this.cause = cause;
  }
}

/**
 * Service health check error
 */
export class ServiceHealthCheckError extends HybridServiceError {
  constructor(serviceName: string, cause: Error) {
    super(
      `Health check failed for service ${serviceName}: ${cause.message}`,
      'HEALTH_CHECK_ERROR',
      serviceName,
      'getHealth',
    );
    this.name = 'ServiceHealthCheckError';
    this.cause = cause;
  }

  readonly cause: Error;
}
