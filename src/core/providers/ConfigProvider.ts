// src/core/providers/ConfigProvider.ts
// Configuration provider for managing hybrid mode settings

import type {
  HybridConfig,
  FeatureModeConfig,
  DataSourceConfig,
  ModeDetectionResult,
  ConfigValidationResult,
  RuntimeConfigState,
} from '../types/config';

/**
 * Configuration Provider
 * Manages hybrid configuration and mode detection
 */
export class ConfigProvider {
  private static instance: ConfigProvider;
  private config: HybridConfig;
  private runtimeState: RuntimeConfigState;
  private listeners = new Set<(config: HybridConfig) => void>();

  private constructor() {
    this.config = this.getDefaultConfig();
    this.runtimeState = this.createRuntimeState();
  }

  /**
   * Get singleton instance
   */
  static getInstance(): ConfigProvider {
    if (!ConfigProvider.instance) {
      ConfigProvider.instance = new ConfigProvider();
    }
    return ConfigProvider.instance;
  }

  /**
   * Get current configuration
   */
  getConfig(): HybridConfig {
    return { ...this.config };
  }

  /**
   * Get runtime state
   */
  getRuntimeState(): RuntimeConfigState {
    return { ...this.runtimeState };
  }

  /**
   * Update configuration
   */
  updateConfig(newConfig: Partial<HybridConfig>): void {
    const oldConfig = { ...this.config };

    // Merge configuration
    this.config = this.mergeConfig(this.config, newConfig);

    // Update runtime state
    this.runtimeState = this.createRuntimeState();

    // Notify listeners
    this.listeners.forEach(listener => listener(this.config));

    // Log configuration changes
    if (this.config.global.enableDebugLogging) {
      console.log('Configuration updated:', {
        old: oldConfig,
        new: this.config,
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * Get feature mode configuration
   */
  getFeatureMode(feature: string): FeatureModeConfig {
    return this.config.features[feature] || this.getDefaultFeatureMode(feature);
  }

  /**
   * Set feature mode
   */
  setFeatureMode(feature: string, mode: 'real' | 'simulated' | 'hybrid'): void {
    const currentConfig = this.getFeatureMode(feature);

    this.updateConfig({
      features: {
        [feature]: {
          ...currentConfig,
          mode,
          lastUpdated: new Date().toISOString(),
        },
      },
    });
  }

  /**
   * Detect mode for a feature
   */
  detectMode(feature: string): ModeDetectionResult {
    const featureConfig = this.getFeatureMode(feature);

    // Check environment variables first
    const envMode = this.getEnvironmentMode(feature);
    if (envMode) {
      return {
        mode: envMode,
        source: 'environment',
        confidence: 0.9,
        metadata: { environmentVariable: `HYBRID_MODE_${feature.toUpperCase()}` },
      };
    }

    // Use configured mode
    return {
      mode: featureConfig.mode,
      source: 'config',
      confidence: 0.8,
      metadata: { configuredMode: featureConfig.mode },
    };
  }

  /**
   * Get data source configuration
   */
  getDataSourceConfig(name: string): DataSourceConfig | null {
    return this.config.dataSources[name] || null;
  }

  /**
   * Add data source
   */
  addDataSource(config: DataSourceConfig): void {
    this.updateConfig({
      dataSources: {
        [config.name]: config,
      },
    });
  }

  /**
   * Validate configuration
   */
  validateConfig(): ConfigValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Validate global settings
    if (!this.config.global) {
      errors.push('Global configuration is missing');
    }

    // Validate feature configurations
    for (const [feature, config] of Object.entries(this.config.features)) {
      if (!config.mode || !['real', 'simulated', 'hybrid'].includes(config.mode)) {
        errors.push(`Invalid mode for feature ${feature}: ${config.mode}`);
      }

      if (config.mode === 'hybrid' && !config.fallbackMode) {
        warnings.push(`Feature ${feature} is in hybrid mode but has no fallback mode`);
      }
    }

    // Validate data sources
    for (const [name, config] of Object.entries(this.config.dataSources)) {
      if (!config.type || !['mock', 'real', 'hybrid'].includes(config.type)) {
        errors.push(`Invalid data source type for ${name}: ${config.type}`);
      }

      if (config.type === 'real' && !config.connection.endpoint) {
        warnings.push(`Real data source ${name} has no endpoint configured`);
      }
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
      config: this.config,
    };
  }

  /**
   * Subscribe to configuration changes
   */
  subscribe(listener: (config: HybridConfig) => void): () => void {
    this.listeners.add(listener);

    // Return unsubscribe function
    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * Export configuration
   */
  exportConfig(): string {
    return JSON.stringify(this.config, null, 2);
  }

  /**
   * Import configuration
   */
  importConfig(configJson: string): void {
    try {
      const importedConfig = JSON.parse(configJson);
      const validation = this.validateConfig();

      if (validation.valid) {
        this.updateConfig(importedConfig);
      } else {
        throw new Error(`Invalid configuration: ${validation.errors.join(', ')}`);
      }
    } catch (error) {
      throw new Error(`Failed to import configuration: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get default configuration
   */
  private getDefaultConfig(): HybridConfig {
    return {
      features: {
        registration: {
          feature: 'registration',
          mode: 'real',
          allowRuntimeSwitching: false,
          fallbackMode: 'simulated',
          priority: 1,
        },
        authentication: {
          feature: 'authentication',
          mode: 'hybrid',
          allowRuntimeSwitching: true,
          fallbackMode: 'simulated',
          priority: 2,
        },
        farmer: {
          feature: 'farmer',
          mode: 'simulated',
          allowRuntimeSwitching: true,
          fallbackMode: 'simulated',
          priority: 3,
        },
        inspector: {
          feature: 'inspector',
          mode: 'simulated',
          allowRuntimeSwitching: true,
          fallbackMode: 'simulated',
          priority: 4,
        },
        logistics: {
          feature: 'logistics',
          mode: 'simulated',
          allowRuntimeSwitching: true,
          fallbackMode: 'simulated',
          priority: 5,
        },
        packaging: {
          feature: 'packaging',
          mode: 'simulated',
          allowRuntimeSwitching: true,
          fallbackMode: 'simulated',
          priority: 6,
        },
        retailer: {
          feature: 'retailer',
          mode: 'simulated',
          allowRuntimeSwitching: true,
          fallbackMode: 'simulated',
          priority: 7,
        },
      },
      global: {
        allowRuntimeSwitching: true,
        defaultFallbackMode: 'simulated',
        healthCheckInterval: 30000,
        enableDebugLogging: process.env.NODE_ENV === 'development',
      },
      dataSources: {},
    };
  }

  /**
   * Get default feature mode
   */
  private getDefaultFeatureMode(feature: string): FeatureModeConfig {
    return {
      feature,
      mode: 'simulated',
      allowRuntimeSwitching: true,
      fallbackMode: 'simulated',
      priority: 999,
    };
  }

  /**
   * Get environment mode for feature
   */
  private getEnvironmentMode(feature: string): 'real' | 'simulated' | 'hybrid' | null {
    const envVar = `HYBRID_MODE_${feature.toUpperCase()}`;
    const envValue = process.env[envVar];

    if (envValue && ['real', 'simulated', 'hybrid'].includes(envValue.toLowerCase())) {
      return envValue.toLowerCase() as 'real' | 'simulated' | 'hybrid';
    }

    return null;
  }

  /**
   * Merge configurations
   */
  private mergeConfig(base: HybridConfig, update: Partial<HybridConfig>): HybridConfig {
    return {
      ...base,
      ...update,
      features: {
        ...base.features,
        ...(update.features || {}),
      },
      global: {
        ...base.global,
        ...(update.global || {}),
      },
      dataSources: {
        ...base.dataSources,
        ...(update.dataSources || {}),
      },
    };
  }

  /**
   * Create runtime state
   */
  private createRuntimeState(): RuntimeConfigState {
    return {
      config: this.config,
      lastUpdated: new Date().toISOString(),
      version: '1.0.0',
      activeAdapters: {},
      adapterHealth: {},
    };
  }
}

/**
 * Global configuration provider instance
 */
export const configProvider = ConfigProvider.getInstance();
