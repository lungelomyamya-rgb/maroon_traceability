// src/core/config/AdapterManager.ts
// Centralized configuration management for adapter selection

import type { AdapterConfig } from '../types/adapter';

/**
 * Environment-based configuration
 */
export interface EnvironmentConfig {
  /** Environment name */
  environment: 'development' | 'staging' | 'production';
  /** Adapter configurations by type */
  adapters: {
    auth: AdapterConfig;
    blockchain: AdapterConfig;
    database: AdapterConfig;
    analytics: AdapterConfig;
    cache: AdapterConfig;
  };
  /** Feature flags */
  features: {
    enableMockAdapters: boolean;
    enableRealAdapters: boolean;
    enableHybridMode: boolean;
    enableHealthMonitoring: boolean;
    enablePerformanceTracking: boolean;
  };
  /** Logging configuration */
  logging: {
    level: 'debug' | 'info' | 'warn' | 'error';
    enableConsole: boolean;
    enableRemote: boolean;
  };
}

/**
 * Adapter configuration factory
 */
export class AdapterConfigManager {
  private static instance: AdapterConfigManager;
  private config: EnvironmentConfig;
  private configCache = new Map<string, unknown>();

  private constructor() {
    this.config = this.loadConfiguration();
  }

  static getInstance(): AdapterConfigManager {
    if (!AdapterConfigManager.instance) {
      AdapterConfigManager.instance = new AdapterConfigManager();
    }
    return AdapterConfigManager.instance;
  }

  /**
   * Load configuration from environment and defaults
   */
  private loadConfiguration(): EnvironmentConfig {
    const nodeEnv = process.env.NODE_ENV;
    const environment = (nodeEnv === 'test' ? 'development' : nodeEnv) as 'development' | 'staging' | 'production' || 'development';

    const baseConfig = {
      environment,
      adapters: this.getAdapterConfigs(environment),
      features: this.getFeatureFlags(environment),
      logging: this.getLoggingConfigForEnvironment(environment),
    };

    return baseConfig;
  }

  /**
   * Get adapter configurations for specific environment
   */
  private getAdapterConfigs(environment: string): EnvironmentConfig['adapters'] {
    switch (environment) {
    case 'development':
      return {
        auth: {
          type: 'mock',
          timeout: 5000,
          enableCache: false,
        },
        blockchain: {
          type: 'mock',
          network: 'testnet',
          gasPrice: '10',
          blockTime: 5000,
          timeout: 10000,
          enableCache: false,
        },
        database: {
          type: 'mock',
          enableCache: false,
        },
        analytics: {
          type: 'mock',
          enableCache: false,
        },
        cache: {
          type: 'memory',
          enableCache: true,
        },
      };

    case 'staging':
      return {
        auth: {
          type: 'real',
          baseUrl: process.env.NEXT_PUBLIC_STAGING_API_URL || 'https://staging-api.example.com',
          timeout: 10000,
          enableCache: true,
          retryAttempts: 3,
        },
        blockchain: {
          type: 'mock',
          network: 'testnet',
          gasPrice: '15',
          blockTime: 8000,
          timeout: 15000,
          enableCache: true,
          rpcUrl: process.env.NEXT_PUBLIC_STAGING_RPC_URL,
          contractAddress: process.env.NEXT_PUBLIC_STAGING_CONTRACT_ADDRESS,
        },
        database: {
          type: 'real',
          enableCache: true,
          retryAttempts: 2,
        },
        analytics: {
          type: 'real',
          enableCache: true,
          endpoint: process.env.NEXT_PUBLIC_STAGING_ANALYTICS_URL,
        },
        cache: {
          type: 'indexeddb',
          enableCache: true,
        },
      };

    case 'production':
      return {
        auth: {
          type: 'real',
          baseUrl: process.env.NEXT_PUBLIC_API_URL || 'https://api.example.com',
          timeout: 15000,
          enableCache: true,
          retryAttempts: 5,
        },
        blockchain: {
          type: 'real',
          network: 'mainnet',
          gasPrice: '50',
          blockTime: 15000,
          timeout: 30000,
          enableCache: true,
          rpcUrl: process.env.NEXT_PUBLIC_RPC_URL || 'https://mainnet.infura.io/v3/YOUR-PROJECT-ID',
          contractAddress: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '0x1234567890123456789012345678901234567890',
        },
        database: {
          type: 'real',
          enableCache: true,
          retryAttempts: 3,
        },
        analytics: {
          type: 'real',
          enableCache: true,
          endpoint: process.env.NEXT_PUBLIC_ANALYTICS_URL,
        },
        cache: {
          type: 'indexeddb',
          enableCache: true,
        },
      };

    default:
      return this.getAdapterConfigs('development');
    }
  }

  /**
   * Get feature flags for specific environment
   */
  private getFeatureFlags(environment: string): EnvironmentConfig['features'] {
    switch (environment) {
    case 'development':
      return {
        enableMockAdapters: true,
        enableRealAdapters: false,
        enableHybridMode: false,
        enableHealthMonitoring: true,
        enablePerformanceTracking: false,
      };

    case 'staging':
      return {
        enableMockAdapters: true,
        enableRealAdapters: true,
        enableHybridMode: true,
        enableHealthMonitoring: true,
        enablePerformanceTracking: true,
      };

    case 'production':
      return {
        enableMockAdapters: false,
        enableRealAdapters: true,
        enableHybridMode: false,
        enableHealthMonitoring: true,
        enablePerformanceTracking: true,
      };

    default:
      return this.getFeatureFlags('development');
    }
  }

  /**
   * Get logging configuration for specific environment (private helper)
   */
  private getLoggingConfigForEnvironment(environment: string): EnvironmentConfig['logging'] {
    switch (environment) {
    case 'development':
      return {
        level: 'debug',
        enableConsole: true,
        enableRemote: false,
      };

    case 'staging':
      return {
        level: 'info',
        enableConsole: true,
        enableRemote: true,
      };

    case 'production':
      return {
        level: 'warn',
        enableConsole: false,
        enableRemote: true,
      };

    default:
      return this.getLoggingConfigForEnvironment('development');
    }
  }

  /**
   * Get current environment configuration
   */
  getCurrentConfig(): EnvironmentConfig {
    return this.config;
  }

  /**
   * Get adapter configuration by type
   */
  getAdapterConfig<T extends keyof EnvironmentConfig['adapters']>(
    adapterType: T,
  ): EnvironmentConfig['adapters'][T] {
    return this.config.adapters[adapterType];
  }

  /**
   * Get feature flag
   */
  getFeatureFlag<K extends keyof EnvironmentConfig['features']>(
    feature: K,
  ): EnvironmentConfig['features'][K] {
    return this.config.features[feature];
  }

  /**
   * Get logging configuration
   */
  getLoggingConfig(): EnvironmentConfig['logging'] {
    return this.config.logging;
  }

  /**
   * Check if mock adapters are enabled
   */
  isMockAdaptersEnabled(): boolean {
    return this.config.features.enableMockAdapters;
  }

  /**
   * Check if real adapters are enabled
   */
  isRealAdaptersEnabled(): boolean {
    return this.config.features.enableRealAdapters;
  }

  /**
   * Check if hybrid mode is enabled
   */
  isHybridModeEnabled(): boolean {
    return this.config.features.enableHybridMode;
  }

  /**
   * Get adapter type for specific service
   */
  getAdapterType(service: keyof EnvironmentConfig['adapters']): 'mock' | 'real' | 'hybrid' | 'memory' | 'indexeddb' {
    const config = this.getAdapterConfig(service);
    return config.type as 'mock' | 'real' | 'hybrid' | 'memory' | 'indexeddb';
  }

  /**
   * Update configuration at runtime
   */
  updateConfig(updates: Partial<EnvironmentConfig>): void {
    this.config = { ...this.config, ...updates };
    this.clearCache();
  }

  /**
   * Update adapter configuration
   */
  updateAdapterConfig<T extends keyof EnvironmentConfig['adapters']>(
    adapterType: T,
    updates: Partial<EnvironmentConfig['adapters'][T]>,
  ): void {
    this.config.adapters[adapterType] = {
      ...this.config.adapters[adapterType],
      ...updates,
    };
    this.clearCache();
  }

  /**
   * Update feature flag
   */
  updateFeatureFlag<K extends keyof EnvironmentConfig['features']>(
    feature: K,
    value: EnvironmentConfig['features'][K],
  ): void {
    this.config.features[feature] = value;
    this.clearCache();
  }

  /**
   * Cache configuration result
   */
  cache<T>(key: string, value: T): void {
    this.configCache.set(key, value);
  }

  /**
   * Get cached configuration result
   */
  getCached<T>(key: string): T | undefined {
    return this.configCache.get(key) as T | undefined;
  }

  /**
   * Clear configuration cache
   */
  clearCache(): void {
    this.configCache.clear();
  }

  /**
   * Validate configuration
   */
  validateConfig(): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Validate required environment variables
    if (this.config.environment === 'production') {
      if (!process.env.NEXT_PUBLIC_API_URL) {
        errors.push('NEXT_PUBLIC_API_URL is required in production');
      }
      if (!process.env.NEXT_PUBLIC_RPC_URL) {
        errors.push('NEXT_PUBLIC_RPC_URL is required in production');
      }
      if (!process.env.NEXT_PUBLIC_CONTRACT_ADDRESS) {
        errors.push('NEXT_PUBLIC_CONTRACT_ADDRESS is required in production');
      }
    }

    // Validate adapter configurations
    Object.entries(this.config.adapters).forEach(([type, config]) => {
      if (config.type === 'real' && !config.timeout) {
        errors.push(`Real adapter for ${type} requires timeout configuration`);
      }
    });

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Export configuration as JSON
   */
  exportConfig(): string {
    return JSON.stringify(this.config, null, 2);
  }

  /**
   * Import configuration from JSON
   */
  importConfig(configJson: string): void {
    try {
      const config = JSON.parse(configJson) as EnvironmentConfig;
      this.config = config;
      this.clearCache();
    } catch (_error) {
      throw new Error('Invalid configuration JSON');
    }
  }
}

// Export singleton instance
export const adapterConfigManager = AdapterConfigManager.getInstance();
