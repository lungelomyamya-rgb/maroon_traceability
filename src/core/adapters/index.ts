// src/core/adapters/index.ts
// Barrel export for core adapters

export * from './blockchain';
export { adapterRegistry } from './AdapterRegistry';
export { BaseAdapter } from './BaseAdapter';
export { MockAdapter } from './MockAdapter';

// Re-export adapter types for convenience
export type {
  AuthAdapter,
  RegistrationAdapter,
  DataAdapter,
  AdapterConfig,
  AdapterResult,
  AdapterFactory,
  HybridAdapterConfig,
  AuthUser,
  RegistrationData,
  UserRole,
  SearchOptions,
  DataSourceConfig,
} from '../types/adapter';
