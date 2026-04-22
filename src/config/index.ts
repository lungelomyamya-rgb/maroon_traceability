// src/config/index.ts
// Centralized configuration exports

// Core configuration exports
export { env, featureFlags, databaseConfig, apiConfig, blockchainConfig } from './env';
export type { Env } from './env';

// Hybrid configuration exports
export {
  DEFAULT_HYBRID_CONFIG,
  FEATURE_MODES,
  HYBRID_ENV_VARS,
  getHybridConfigFromEnv,
  validateHybridConfig,
} from './hybrid';

// Environment configurations
export {
  developmentConfig,
  stagingConfig,
  productionConfig,
  getEnvironmentConfig,
  currentEnvironment,
  currentConfig,
  type Environment,
} from './environments';

// Build configurations
export {
  hybridWebpackConfig,
  hybridViteConfig,
  getBuildConfig,
  currentBuildTool,
  currentBuildConfig,
  type BuildTool,
} from './build';

// Data source exports
export {
  MOCK_DATA_SOURCES,
  REAL_DATA_SOURCES,
  getDataSourcesByFeature,
  getDataSourcesByType,
  getActiveDataSources,
  getDataSourceByName,
  getHybridDataSources,
} from './datasources';

// Mode configuration exports
export {
  DEVELOPMENT_MODE,
  PRODUCTION_MODE,
  TEST_MODE,
  DEMO_MODE,
  CICD_MODE,
  MODE_CONFIGURATIONS,
  getConfigurationForEnvironment,
  FEATURE_MODE_PRESETS,
  applyPreset,
  validateModeConfig,
  getModeSummary,
} from './modes';

// Import for utility function
import {
  getHybridConfigFromEnv,
  validateHybridConfig,
} from './hybrid';
import {
  getConfigurationForEnvironment,
  applyPreset,
  validateModeConfig,
  getModeSummary,
} from './modes';

// Configuration utilities
export function createConfigurationSystem() {
  return {
    getHybridConfigFromEnv,
    validateHybridConfig,
    getConfigurationForEnvironment,
    applyPreset,
    validateModeConfig,
    getModeSummary,
  };
}

// Configuration system metadata
export const CONFIG_SYSTEM = {
  VERSION: '1.0.0',
  NAME: 'Hybrid Configuration System',
  DESCRIPTION: 'Configuration management for hybrid data architecture',
  DEPENDENCIES: ['typescript', 'zod'],
  TAGS: ['configuration', 'hybrid', 'modes', 'data-sources'],
} as const;
