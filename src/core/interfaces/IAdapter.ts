// src/core/interfaces/IAdapter.ts
// Base adapter interface for hybrid data sources

import type { UniversalUser } from '@/types/types';

/**
 * Base adapter interface for all hybrid adapters
 * Provides abstraction layer between application and data sources
 */
export interface IAdapter<TInput, TOutput> {
  /**
   * Adapter name/identifier
   */
  readonly name: string;

  /**
   * Adapter type (mock, real, hybrid)
   */
  readonly type: 'mock' | 'real' | 'hybrid';

  /**
   * Feature this adapter belongs to
   */
  readonly feature: string;

  /**
   * Adapter priority (lower number = higher priority)
   */
  readonly priority: number;

  /**
   * Whether adapter is currently active
   */
  readonly isActive: boolean;

  /**
   * Initialize adapter
   * @param config - Adapter configuration
   */
  initialize(config: AdapterConfig): Promise<void>;

  /**
   * Transform input data to output format
   * @param input - Input data to transform
   * @returns Promise resolving to transformed output
   */
  transform(input: TInput): Promise<TOutput>;

  /**
   * Reverse transform output to input format
   * @param output - Output data to reverse transform
   * @returns Promise resolving to transformed input
   */
  reverseTransform(output: TOutput): Promise<TInput>;

  /**
   * Validate input data
   * @param input - Input data to validate
   * @returns Promise resolving to validation result
   */
  validate(input: TInput): Promise<ValidationResult>;

  /**
   * Get adapter health status
   * @returns Promise resolving to health status
   */
  getHealth(): Promise<AdapterHealth>;

  /**
   * Cleanup adapter resources
   */
  cleanup(): Promise<void>;

  /**
   * Get adapter capabilities
   */
  getCapabilities(): AdapterCapabilities;
}

/**
 * Hybrid adapter interface with fallback support
 */
export interface IHybridAdapter<TInput, TOutput> extends IAdapter<TInput, TOutput> {
  /**
   * Primary adapter (usually real)
   */
  readonly primaryAdapter: IAdapter<TInput, TOutput>;

  /**
   * Fallback adapter (usually mock)
   */
  readonly fallbackAdapter: IAdapter<TInput, TOutput>;

  /**
   * Current active mode
   */
  readonly currentMode: 'primary' | 'fallback' | 'hybrid';

  /**
   * Enable/disable fallback mode
   */
  setFallbackEnabled(enabled: boolean): void;

  /**
   * Force switch to specific adapter
   */
  switchToAdapter(adapterName: string): Promise<void>;

  /**
   * Get performance metrics
   */
  getMetrics(): Promise<AdapterMetrics>;

  /**
   * Configure automatic fallback rules
   */
  configureFallbackRules(rules: FallbackRule[]): void;
}

/**
 * Adapter configuration
 */
export interface AdapterConfig {
  /** Adapter name */
  name: string;

  /** Feature this adapter belongs to */
  feature: string;

  /** Adapter type */
  type: 'mock' | 'real' | 'hybrid';

  /** Connection configuration */
  connection: {
    endpoint?: string;
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

  /** Hybrid-specific configuration */
  hybrid?: {
    fallbackEnabled: boolean;
    fallbackThreshold: number;
    healthCheckInterval: number;
    autoSwitchEnabled: boolean;
  };

  /** Feature-specific configuration */
  featureConfig?: Record<string, unknown>;
}

/**
 * Validation result
 */
export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

/**
 * Validation error
 */
export interface ValidationError {
  field: string;
  message: string;
  code: string;
  value?: unknown;
}

/**
 * Validation warning
 */
export interface ValidationWarning {
  field: string;
  message: string;
  code: string;
  value?: unknown;
}

/**
 * Adapter health status
 */
export interface AdapterHealth {
  isHealthy: boolean;
  lastCheck: Date;
  responseTime: number;
  errorCount: number;
  uptime: number;
  status: 'healthy' | 'degraded' | 'unhealthy' | 'unknown';
  lastError?: string;
  consecutiveFailures: number;
}

/**
 * Adapter capabilities
 */
export interface AdapterCapabilities {
  supportsCaching: boolean;
  supportsCompression: boolean;
  supportsStreaming: boolean;
  supportsBatching: boolean;
  supportsTransactions: boolean;
  supportsRealTime: boolean;
  maxConnections: number;
  supportedOperations: string[];
}

/**
 * Adapter performance metrics
 */
export interface AdapterMetrics {
  totalOperations: number;
  successfulOperations: number;
  failedOperations: number;
  averageResponseTime: number;
  minResponseTime: number;
  maxResponseTime: number;
  lastOperation: Date;
  operationsPerSecond: number;
  errorRate: number;
  cacheHitRate: number;
}

/**
 * Fallback rule configuration
 */
export interface FallbackRule {
  condition: 'error-rate' | 'response-time' | 'consecutive-errors' | 'health-check';
  threshold: number;
  action: 'switch-to-fallback' | 'retry-primary' | 'alert-only';
  enabled: boolean;
  cooldownPeriod?: number;
}

/**
 * Base adapter error
 */
export class AdapterError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly adapterName: string,
    public readonly operation: string,
  ) {
    super(message);
    this.name = 'AdapterError';
  }
}

/**
 * Adapter initialization error
 */
export class AdapterInitializationError extends AdapterError {
  constructor(adapterName: string, cause: Error) {
    super(
      `Failed to initialize adapter ${adapterName}: ${cause.message}`,
      'INITIALIZATION_ERROR',
      adapterName,
      'initialize',
    );
    this.name = 'AdapterInitializationError';
    this.cause = cause;
  }

  readonly cause: Error;
}

/**
 * Adapter transformation error
 */
export class AdapterTransformationError extends AdapterError {
  constructor(adapterName: string, operation: string, cause: Error) {
    super(
      `Transformation error in adapter ${adapterName}: ${cause.message}`,
      'TRANSFORMATION_ERROR',
      adapterName,
      operation,
    );
    this.name = 'AdapterTransformationError';
    this.cause = cause;
  }

  readonly cause: Error;
}

/**
 * Adapter connection error
 */
export class AdapterConnectionError extends AdapterError {
  constructor(adapterName: string, endpoint: string, cause: Error) {
    super(
      `Connection error in adapter ${adapterName} to ${endpoint}: ${cause.message}`,
      'CONNECTION_ERROR',
      adapterName,
      'connect',
    );
    this.name = 'AdapterConnectionError';
    this.cause = cause;
  }

  readonly cause: Error;
}

/**
 * Adapter validation error
 */
export class AdapterValidationError extends AdapterError {
  constructor(adapterName: string, validationErrors: ValidationError[]) {
    const message = validationErrors.map(e => `${e.field}: ${e.message}`).join(', ');
    super(
      `Validation error in adapter ${adapterName}: ${message}`,
      'VALIDATION_ERROR',
      adapterName,
      'validate',
    );
    this.name = 'AdapterValidationError';
    this.validationErrors = validationErrors;
  }

  readonly validationErrors: ValidationError[];
}

/**
 * Authentication adapter interface
 */
export interface IAuthAdapter {
  /**
   * Initialize the adapter
   */
  initialize(): Promise<void>;

  /**
   * Cleanup adapter resources
   */
  cleanup(): Promise<void>;

  /**
   * Get adapter health status
   */
  getHealth(): Promise<AdapterHealth>;

  /**
   * Get adapter type
   */
  readonly type: string;

  /**
   * Get adapter ID
   */
  readonly id: string;

  /**
   * Authenticate user with email and password
   */
  login(email: string, password: string): Promise<AuthResult>;

  /**
   * Register new user
   */
  register(userData: RegistrationData): Promise<AuthResult>;

  /**
   * Logout current user
   */
  logout(): Promise<void>;

  /**
   * Get current authenticated user
   */
  getCurrentUser(): Promise<AuthResult>;

  /**
   * Refresh authentication token
   */
  refreshToken(): Promise<AuthResult>;

  /**
   * Reset password
   */
  resetPassword(email: string): Promise<void>;

  /**
   * Change password
   */
  changePassword(oldPassword: string, newPassword: string): Promise<void>;
}

/**
 * Authentication result
 */
export interface AuthResult {
  success: boolean;
  data?: UniversalUser;
  error?: string;
  token?: string;
}

/**
 * Registration data
 */
export interface RegistrationData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

