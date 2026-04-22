// src/config/environments/index.ts
// Barrel export for environment configurations

import { developmentConfig } from './development';
import { productionConfig } from './production';
import { stagingConfig } from './staging';

export { developmentConfig, stagingConfig, productionConfig };

// Environment type
export type Environment = 'development' | 'staging' | 'production';

// Get environment configuration
export function getEnvironmentConfig(env: Environment) {
  switch (env) {
  case 'development':
    return developmentConfig;
  case 'staging':
    return stagingConfig;
  case 'production':
    return productionConfig;
  default:
    return developmentConfig;
  }
}

// Current environment
export const currentEnvironment = (process.env.NODE_ENV as Environment) || 'development';
export const currentConfig = getEnvironmentConfig(currentEnvironment);
