// src/core/index.ts
// Core module barrel exports for hybrid data architecture

// Type exports
export type {
  BaseAdapter,
  AuthAdapter,
  RegistrationAdapter,
  DataAdapter,
  AdapterConfig,
  HybridAdapterConfig,
  AdapterResult,
  AdapterFactory,
  DataSourceConfig,
  AuthUser,
  RegistrationData,
  UserRole,
  SearchOptions,
} from './types/adapter';

export type {
  HybridConfig,
  FeatureModeConfig,
  DataSourceConfig as ConfigDataSourceConfig,
  EnvironmentConfig,
  ModeDetectionResult,
  ConfigValidationResult,
  RuntimeConfigState,
  AdapterHealthStatus,
} from './types/config';

// Adapter system exports
export { adapterRegistry } from './adapters/AdapterRegistry';

// ============================================================================
// INFRASTRUCTURE EXPORTS
// ============================================================================

export * from './infrastructure/HybridModeManager';
export * from './infrastructure/HealthMonitor';
export * from './adapters/AdapterRegistry';
export * from './infrastructure/PerformanceMonitor';
export * from './infrastructure/AdvancedCache';
export * from './infrastructure/AnalyticsEngine';

// Configuration exports
export {
  getCurrentEnvironment,
  getEnvironmentConfig,
  getHybridConfigForEnvironment,
  environmentUtils,
} from './config/environment';

// Provider exports
export { DataProvider, dataProvider } from './providers/DataProvider';
export { ConfigProvider, configProvider } from './providers/ConfigProvider';

// Import for utility function
import { adapterRegistry } from './adapters/AdapterRegistry';
import { environmentUtils } from './config/environment';
import { healthMonitor } from './infrastructure/HealthMonitor';
import { hybridModeManager } from './infrastructure/HybridModeManager';
import { configProvider } from './providers/ConfigProvider';
import { dataProvider } from './providers/DataProvider';

// Utility exports
export function createCoreSystem() {
  return {
    dataProvider,
    configProvider,
    adapterRegistry,
    hybridModeManager,
    healthMonitor,
    environmentUtils,
  };
}

// Core system metadata
export const CORE_SYSTEM = {
  VERSION: '1.0.0',
  NAME: 'Hybrid Data Architecture Core',
  DESCRIPTION: 'Core system for managing hybrid data adapters and configurations',
  DEPENDENCIES: ['typescript', 'react'],
  TAGS: ['hybrid', 'adapter', 'configuration', 'data-management'],
} as const;
