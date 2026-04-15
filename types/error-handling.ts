// Enhanced Error Handling Types
import { ReactNode } from 'react';

// Error severity levels
export type ErrorSeverity = 'low' | 'medium' | 'high' | 'critical';

// Error categories
export type ErrorCategory = 
  | 'network'
  | 'validation'
  | 'authentication'
  | 'authorization'
  | 'database'
  | 'filesystem'
  | 'timeout'
  | 'business'
  | 'system'
  | 'unknown';

// Error codes
export type ErrorCode = 
  // Network errors
  | 'NETWORK_ERROR'
  | 'TIMEOUT_ERROR'
  | 'CONNECTION_ERROR'
  | 'SERVER_ERROR'
  | 'CLIENT_ERROR'
  
  // Authentication errors
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'TOKEN_EXPIRED'
  | 'INVALID_CREDENTIALS'
  | 'SESSION_EXPIRED'
  
  // Validation errors
  | 'VALIDATION_ERROR'
  | 'REQUIRED_FIELD'
  | 'INVALID_FORMAT'
  | 'INVALID_VALUE'
  | 'CONSTRAINT_VIOLATION'
  
  // Database errors
  | 'DATABASE_ERROR'
  | 'NOT_FOUND'
  | 'DUPLICATE_ENTRY'
  | 'FOREIGN_KEY_VIOLATION'
  | 'QUERY_ERROR'
  
  // Business logic errors
  | 'BUSINESS_ERROR'
  | 'INSUFFICIENT_PERMISSIONS'
  | 'RESOURCE_LIMIT_EXCEEDED'
  | 'OPERATION_NOT_ALLOWED'
  | 'DEPENDENCY_ERROR'
  
  // System errors
  | 'SYSTEM_ERROR'
  | 'INTERNAL_ERROR'
  | 'CONFIGURATION_ERROR'
  | 'DEPENDENCY_ERROR'
  | 'UNKNOWN_ERROR';

// Base error interface
export interface BaseError {
  code: ErrorCode;
  message: string;
  details?: string;
  timestamp: number;
  context?: Record<string, unknown>;
  severity: ErrorSeverity;
  category: ErrorCategory;
  stack?: string;
  cause?: Error | BaseError;
  requestId?: string;
  userId?: string;
  sessionId?: string;
  path?: string;
  method?: string;
  statusCode?: number;
  retryable?: boolean;
  userFriendly?: boolean;
  suggestions?: string[];
  metadata?: Record<string, unknown>;
}

// Network error
export interface NetworkError extends BaseError {
  category: 'network';
  networkDetails?: {
    url?: string;
    method?: string;
    statusCode?: number;
    statusText?: string;
    responseTime?: number;
    retryCount?: number;
    timeout?: number;
  };
}

// Validation error
export interface ValidationError extends BaseError {
  category: 'validation';
  validationDetails?: {
    field?: string;
    value?: unknown;
    rule?: string;
    constraints?: Record<string, unknown>;
    errors?: Record<string, string[]>;
  };
}

// Authentication error
export interface AuthenticationError extends BaseError {
  category: 'authentication';
  authDetails?: {
    provider?: string;
    tokenType?: string;
    expiredAt?: string;
    refreshTokenExpired?: boolean;
    mfaRequired?: boolean;
  };
}

// Database error
export interface DatabaseError extends BaseError {
  category: 'database';
  databaseDetails?: {
    query?: string;
    table?: string;
    constraint?: string;
    transactionId?: string;
    connectionId?: string;
  };
}

// Business error
export interface BusinessError extends BaseError {
  category: 'business';
  businessDetails?: {
    businessRule?: string;
    entityType?: string;
    entityId?: string;
    operation?: string;
    permissions?: string[];
  };
}

// Error response wrapper
export interface ErrorResponse {
  success: false;
  error: BaseError;
  timestamp: number;
  requestId: string;
  metadata?: {
    version: string;
    environment: string;
    service: string;
    traceId?: string;
  };
}

// Success response wrapper
export interface SuccessResponse<T = unknown> {
  success: true;
  data: T;
  message?: string;
  timestamp: number;
  requestId: string;
  metadata?: {
    version: string;
    environment: string;
    service: string;
    traceId?: string;
  };
}

// API response type
export type ApiResponse<T = unknown> = SuccessResponse<T> | ErrorResponse;

// Error handler function type
export type ErrorHandler = (error: Error | BaseError) => BaseError;

// Error reporter function type
export type ErrorReporter = (error: BaseError) => void;

// Error recovery function type
export type ErrorRecovery = (error: BaseError) => Promise<boolean>;

// Error boundary state
export interface ErrorBoundaryState {
  hasError: boolean;
  error: BaseError | null;
  errorInfo: React.ErrorInfo | null;
  retryCount: number;
  isRecovering: boolean;
}

// Error boundary props
export interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: BaseError, errorInfo: React.ErrorInfo) => void;
  onReset?: () => void;
  retryLimit?: number;
  showErrorDetails?: boolean;
  enableRetry?: boolean;
}

// Error context
export interface ErrorContext {
  errors: BaseError[];
  addError: (error: BaseError) => void;
  removeError: (id: string) => void;
  clearErrors: () => void;
  getErrorsByCategory: (category: ErrorCategory) => BaseError[];
  getErrorsBySeverity: (severity: ErrorSeverity) => BaseError[];
}

// Error monitoring configuration
export interface ErrorMonitoringConfig {
  enabled: boolean;
  apiKey?: string;
  endpoint?: string;
  environment: string;
  service: string;
  version: string;
  sampleRate?: number;
  ignoreErrors?: ErrorCode[];
  beforeSend?: (error: BaseError) => BaseError | null;
}

// Error logging configuration
export interface ErrorLoggingConfig {
  enabled: boolean;
  level: 'error' | 'warn' | 'info' | 'debug';
  format: 'json' | 'text';
  includeStackTrace?: boolean;
  includeContext?: boolean;
  maxLogSize?: number;
  retentionDays?: number;
}

// Error recovery configuration
export interface ErrorRecoveryConfig {
  enabled: boolean;
  maxRetries?: number;
  retryDelay?: number;
  backoffMultiplier?: number;
  retryableErrors?: ErrorCode[];
  retryableCategories?: ErrorCategory[];
  customRecovery?: Record<ErrorCode, ErrorRecovery>;
}

// Error handling configuration
export interface ErrorHandlingConfig {
  monitoring?: ErrorMonitoringConfig;
  logging?: ErrorLoggingConfig;
  recovery?: ErrorRecoveryConfig;
  globalHandlers?: Record<ErrorCategory, ErrorHandler>;
  reporters?: ErrorReporter[];
}

// Error factory functions
export interface ErrorFactory {
  createNetworkError: (message: string, details?: Partial<NetworkError>) => NetworkError;
  createValidationError: (message: string, details?: Partial<ValidationError>) => ValidationError;
  createAuthenticationError: (message: string, details?: Partial<AuthenticationError>) => AuthenticationError;
  createDatabaseError: (message: string, details?: Partial<DatabaseError>) => DatabaseError;
  createBusinessError: (message: string, details?: Partial<BusinessError>) => BusinessError;
  createGenericError: (message: string, details?: Partial<BaseError>) => BaseError;
}

// Error utilities
export interface ErrorUtils {
  isNetworkError: (error: BaseError) => error is NetworkError;
  isValidationError: (error: BaseError) => error is ValidationError;
  isAuthenticationError: (error: BaseError) => error is AuthenticationError;
  isDatabaseError: (error: BaseError) => error is DatabaseError;
  isBusinessError: (error: BaseError) => error is BusinessError;
  isRetryable: (error: BaseError) => boolean;
  getUserFriendlyMessage: (error: BaseError) => string;
  getErrorSuggestions: (error: BaseError) => string[];
  serializeError: (error: BaseError) => string;
  deserializeError: (serialized: string) => BaseError;
}

// Error reporting interface
export interface ErrorReportingService {
  report: (error: BaseError) => Promise<void>;
  reportBatch: (errors: BaseError[]) => Promise<void>;
  getMetrics: () => ErrorMetrics;
  clear: () => void;
}

// Error metrics
export interface ErrorMetrics {
  totalErrors: number;
  errorsByCategory: Record<ErrorCategory, number>;
  errorsBySeverity: Record<ErrorSeverity, number>;
  errorsByCode: Record<ErrorCode, number>;
  errorRate: number;
  averageResponseTime: number;
  lastError?: BaseError;
}

// Error notification interface
export interface ErrorNotification {
  title: string;
  message: string;
  type: 'error' | 'warning' | 'info';
  duration?: number;
  action?: {
    label: string;
    handler: () => void;
  };
  dismissible?: boolean;
}

// Error toast interface
export interface ErrorToast {
  id: string;
  message: string;
  type: 'error' | 'warning' | 'info' | 'success';
  duration?: number;
  action?: {
    label: string;
    handler: () => void;
  };
  persist?: boolean;
}

// Error tracking interface
export interface ErrorTracker {
  track: (error: BaseError, context?: Record<string, unknown>) => void;
  trackUserAction: (action: string, properties?: Record<string, unknown>) => void;
  trackPerformance: (metric: string, value: number, properties?: Record<string, unknown>) => void;
  setUser: (id: string, properties?: Record<string, unknown>) => void;
  setContext: (key: string, value: unknown) => void;
  clearContext: (key?: string) => void;
}

// Error recovery strategies
export interface RecoveryStrategy {
  name: string;
  canHandle: (error: BaseError) => boolean;
  recover: (error: BaseError) => Promise<boolean>;
  maxRetries?: number;
  delay?: number;
}

// Error recovery manager
export interface ErrorRecoveryManager {
  registerStrategy: (strategy: RecoveryStrategy) => void;
  unregisterStrategy: (name: string) => void;
  attemptRecovery: (error: BaseError) => Promise<boolean>;
  getAvailableStrategies: (error: BaseError) => RecoveryStrategy[];
}

// Error boundary hook return type
export interface UseErrorBoundaryReturn {
  error: BaseError | null;
  errorInfo: React.ErrorInfo | null;
  resetError: () => void;
  retry: () => void;
  isRecovering: boolean;
  retryCount: number;
}

// Error logging hook return type
export interface UseErrorLoggerReturn {
  logError: (error: Error | BaseError, context?: Record<string, unknown>) => void;
  logWarning: (message: string, context?: Record<string, unknown>) => void;
  logInfo: (message: string, context?: Record<string, unknown>) => void;
  clearLogs: () => void;
  getLogs: () => BaseError[];
}

// Error monitoring hook return type
export interface UseErrorMonitoringReturn {
  errors: BaseError[];
  addError: (error: BaseError) => void;
  removeError: (id: string) => void;
  clearErrors: () => void;
  getErrorsByCategory: (category: ErrorCategory) => BaseError[];
  getErrorsBySeverity: (severity: ErrorSeverity) => BaseError[];
  hasErrors: boolean;
  errorCount: number;
}
