// src/core/interfaces/index.ts
// Barrel export for all core interfaces

// Repository interfaces
export type {
  IRepository,
  IHybridRepository,
  QueryOptions,
  RepositoryHealth,
  RepositoryStats,
  RepositoryConfig,
} from './IRepository';

export {
  RepositoryError,
  EntityNotFoundError,
  DuplicateEntityError,
  RepositoryConnectionError,
} from './IRepository';

// Adapter interfaces
export type {
  IAdapter,
  IHybridAdapter,
  AdapterConfig,
  ValidationResult,
  ValidationError,
  ValidationWarning,
  AdapterHealth,
  AdapterCapabilities,
  AdapterMetrics,
  FallbackRule,
} from './IAdapter';

export {
  AdapterError,
  AdapterInitializationError,
  AdapterTransformationError,
  AdapterConnectionError,
  AdapterValidationError,
} from './IAdapter';

// Hybrid service interfaces
export type {
  IHybridService,
  HybridServiceConfig,
  ServiceCapabilities,
  ServiceHealth,
  AdapterHealthStatus,
  ModeSwitchOptions,
  ModeSwitchResult,
  ServiceMetrics,
  ServiceError,
  ServiceWarning,
} from './IHybridService';

export {
  HybridServiceError,
  ServiceInitializationError,
  ModeSwitchError,
  OperationExecutionError,
  ServiceHealthCheckError,
} from './IHybridService';

// Service interfaces
export type {
  IService,
  IUserRepository,
  IIdentityService,
  ITokenProvider,
  IEncryptionEngine,
  IStorageService,
  TokenPair,
  CookieOptions,
  AuthResult,
} from './services';
