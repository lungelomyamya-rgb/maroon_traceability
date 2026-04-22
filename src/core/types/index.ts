// src/core/types/index.ts
// Barrel export for core types

// Hybrid types
export type {
  HybridMode,
  FeatureModeConfig,
  DataSourceConfig,
  HybridConfig,
  HybridContextState,
  ModeSwitchRequest,
  ModeSwitchResult,
  HybridSystemStatus,
  CustomErrorContext,
  HybridOperationOptions,
  HybridOperationResult,
  FeatureHealthStatus,
  HybridPerformanceMetrics,
  HybridConfigValidationResult,
  FeatureCapabilities,
  HybridEventType,
  HybridEvent,
  HybridEventListener,
  IHybridEventEmitter,
} from './hybrid';

// Registry types
export type {
  RegistryItemStatus,
  RegistryItemType,
  BaseRegistryItem,
  RegistryQueryOptions,
  RegistryQueryResult,
  RegistryStatistics,
  RegistryEventType,
  RegistryEvent,
  RegistryConfig,
  RegistryHealthCheckResult,
  RegistryHealthIssue,
  RegistryCleanupResult,
  RegistryBackupConfig,
  RegistryBackupResult,
  RegistryRestoreResult,
} from './registry';
