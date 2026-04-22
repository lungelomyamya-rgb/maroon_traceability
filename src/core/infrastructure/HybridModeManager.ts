// src/core/infrastructure/HybridModeManager.ts
// Runtime hybrid mode management and switching

import { DEFAULT_HYBRID_CONFIG, getHybridConfigFromEnv } from '../../config/hybrid';
import { adapterRegistry } from '../adapters/AdapterRegistry';
import type { HybridConfig, ModeDetectionResult } from '../types/config';

/**
 * Runtime hybrid mode manager
 * Handles mode switching, detection, and configuration management
 */
export class HybridModeManager {
  private static instance: HybridModeManager;
  private config: HybridConfig;
  private modeCache: Map<string, ModeDetectionResult> = new Map();
  private subscribers: Set<(feature: string, mode: string) => void> = new Set();
  private healthCheckInterval?: NodeJS.Timeout;

  private constructor() {
    // Load configuration from environment and defaults
    const envConfig = getHybridConfigFromEnv();
    this.config = this.mergeConfigs(DEFAULT_HYBRID_CONFIG, envConfig);

    // Start health monitoring
    this.startHealthMonitoring();
  }

  /**
   * Get singleton instance
   */
  static getInstance(): HybridModeManager {
    if (!HybridModeManager.instance) {
      HybridModeManager.instance = new HybridModeManager();
    }
    return HybridModeManager.instance;
  }

  /**
   * Get current mode for a feature
   */
  getMode(feature: string): 'real' | 'simulated' | 'hybrid' {
    const featureConfig = this.config.features[feature];
    if (!featureConfig) {
      console.warn(`Feature '${feature}' not found in configuration, defaulting to simulated`);
      return 'simulated';
    }

    // Check cache first
    const cached = this.modeCache.get(feature);
    if (cached && this.isCacheValid(cached)) {
      return cached.mode;
    }

    // Detect mode
    const detection = this.detectMode(feature);
    this.modeCache.set(feature, detection);

    return detection.mode;
  }

  /**
   * Set mode for a feature (if runtime switching is allowed)
   */
  setMode(feature: string, mode: 'real' | 'simulated' | 'hybrid'): boolean {
    const featureConfig = this.config.features[feature];
    if (!featureConfig) {
      throw new Error(`Feature '${feature}' not found in configuration`);
    }

    if (!featureConfig.allowRuntimeSwitching) {
      console.warn(`Runtime switching not allowed for feature: ${feature}`);
      return false;
    }

    // Validate mode transition
    if (!this.isValidModeTransition(feature, mode)) {
      console.warn(`Invalid mode transition for feature ${feature}: ${featureConfig.mode} -> ${mode}`);
      return false;
    }

    // Update configuration
    featureConfig.mode = mode;
    featureConfig.lastUpdated = new Date().toISOString();

    // Clear cache
    this.modeCache.delete(feature);

    // Notify subscribers
    this.notifySubscribers(feature, mode);

    console.log(`Feature '${feature}' mode changed to: ${mode}`);
    return true;
  }

  /**
   * Detect mode for a feature based on various factors
   */
  private detectMode(feature: string): ModeDetectionResult {
    const featureConfig = this.config.features[feature];

    // 1. Check explicit configuration
    if (featureConfig.mode) {
      return {
        mode: featureConfig.mode,
        source: 'config',
        confidence: 100,
        metadata: { configured: true },
      };
    }

    // 2. Check environment variables
    const envMode = this.getModeFromEnvironment(feature);
    if (envMode) {
      return {
        mode: envMode,
        source: 'environment',
        confidence: 90,
        metadata: { envVar: this.getEnvVarForFeature(feature) },
      };
    }

    // 3. Check adapter availability
    const adapterMode = this.getModeFromAdapters(feature);
    if (adapterMode) {
      return {
        mode: adapterMode,
        source: 'runtime',
        confidence: 80,
        metadata: { adapterBased: true },
      };
    }

    // 4. Use fallback mode
    return {
      mode: featureConfig.fallbackMode || this.config.global.defaultFallbackMode,
      source: 'fallback',
      confidence: 50,
      metadata: { fallback: true },
    };
  }

  /**
   * Get mode from environment variables
   */
  private getModeFromEnvironment(feature: string): 'real' | 'simulated' | 'hybrid' | null {
    const envVar = this.getEnvVarForFeature(feature);
    const envValue = process.env[envVar];

    if (!envValue) {
      return null;
    }

    const normalized = envValue.toLowerCase();
    if (['real', 'simulated', 'hybrid'].includes(normalized)) {
      return normalized as 'real' | 'simulated' | 'hybrid';
    }

    return null;
  }

  /**
   * Get mode based on adapter availability
   */
  private getModeFromAdapters(feature: string): 'real' | 'simulated' | 'hybrid' | null {
    const realAdapter = adapterRegistry.get(`${feature}-real`);
    const mockAdapter = adapterRegistry.get(`${feature}-mock`);

    if (realAdapter?.isAvailable && mockAdapter?.isAvailable) {
      return 'hybrid';
    }

    if (realAdapter?.isAvailable) {
      return 'real';
    }

    if (mockAdapter?.isAvailable) {
      return 'simulated';
    }

    return null;
  }

  /**
   * Get environment variable name for feature
   */
  private getEnvVarForFeature(feature: string): string {
    const envVarMap: Record<string, string> = {
      registration: 'HYBRID_MODE_REGISTRATION',
      authentication: 'HYBRID_MODE_AUTHENTICATION',
      farmer: 'HYBRID_MODE_FARMER',
      inspector: 'HYBRID_MODE_INSPECTOR',
      logistics: 'HYBRID_MODE_LOGISTICS',
      packaging: 'HYBRID_MODE_PACKAGING',
      retailer: 'HYBRID_MODE_RETAILER',
      marketplace: 'HYBRID_MODE_MARKETPLACE',
      blockchain: 'HYBRID_MODE_BLOCKCHAIN',
    };

    return envVarMap[feature] || `HYBRID_MODE_${feature.toUpperCase()}`;
  }

  /**
   * Validate mode transition
   */
  private isValidModeTransition(feature: string, newMode: string): boolean {
    const _featureConfig = this.config.features[feature];

    // Registration must always be real
    if (feature === 'registration' && newMode !== 'real') {
      return false;
    }

    // Authentication supports all modes
    if (feature === 'authentication') {
      return ['real', 'simulated', 'hybrid'].includes(newMode);
    }

    // Other features support real or simulated
    return ['real', 'simulated'].includes(newMode);
  }

  /**
   * Check if cache entry is still valid
   */
  private isCacheValid(detection: ModeDetectionResult): boolean {
    const cacheTimeout = 30000; // 30 seconds
    const timestamp = detection.metadata?.timestamp;
    if (typeof timestamp !== 'string' && typeof timestamp !== 'number') {
      return false;
    }
    const cacheTime = new Date(timestamp).getTime();
    return Date.now() - cacheTime < cacheTimeout;
  }

  /**
   * Merge configuration objects
   */
  private mergeConfigs(base: HybridConfig, override: Partial<HybridConfig>): HybridConfig {
    return {
      ...base,
      ...override,
      features: {
        ...base.features,
        ...(override.features || {}),
      },
      dataSources: {
        ...base.dataSources,
        ...(override.dataSources || {}),
      },
      global: {
        ...base.global,
        ...(override.global || {}),
      },
    };
  }

  /**
   * Start health monitoring for adapters
   */
  private startHealthMonitoring(): void {
    if (!this.config.global.enableDebugLogging) {
      return;
    }

    this.healthCheckInterval = setInterval(() => {
      this.performHealthChecks();
    }, this.config.global.healthCheckInterval);
  }

  /**
   * Perform health checks on all adapters
   */
  private performHealthChecks(): void {
    const healthStatus = adapterRegistry.getHealthStatus();

    for (const [adapterKey, status] of Object.entries(healthStatus)) {
      if (status.status === 'unhealthy') {
        console.warn(`Adapter ${adapterKey} is unhealthy:`, status.error);

        // Try to recover hybrid modes
        this.handleAdapterFailure(adapterKey);
      }
    }
  }

  /**
   * Handle adapter failure by switching to fallback
   */
  private handleAdapterFailure(adapterKey: string): void {
    const [feature, type] = adapterKey.split('/');

    if (type === 'real' && this.getMode(feature) === 'real') {
      const fallback = this.config.features[feature]?.fallbackMode;
      if (fallback && fallback !== 'real') {
        console.log(`Switching feature ${feature} from real to ${fallback} due to adapter failure`);
        this.setMode(feature, fallback);
      }
    }
  }

  /**
   * Subscribe to mode changes
   */
  subscribe(callback: (feature: string, mode: string) => void): () => void {
    this.subscribers.add(callback);

    // Return unsubscribe function
    return () => {
      this.subscribers.delete(callback);
    };
  }

  /**
   * Notify subscribers of mode changes
   */
  private notifySubscribers(feature: string, mode: string): void {
    for (const callback of this.subscribers) {
      try {
        callback(feature, mode);
      } catch (error) {
        console.error('Error in mode change subscriber:', error);
      }
    }
  }

  /**
   * Get current configuration
   */
  getConfig(): HybridConfig {
    return { ...this.config };
  }

  /**
   * Update configuration
   */
  updateConfig(newConfig: Partial<HybridConfig>): void {
    this.config = this.mergeConfigs(this.config, newConfig);

    // Clear mode cache to force re-detection
    this.modeCache.clear();

    console.log('Hybrid configuration updated');
  }

  /**
   * Get all feature modes
   */
  getAllModes(): Record<string, string> {
    const modes: Record<string, string> = {};

    for (const feature of Object.keys(this.config.features)) {
      modes[feature] = this.getMode(feature);
    }

    return modes;
  }

  /**
   * Get feature statistics
   */
  getStats(): {
    totalFeatures: number;
    realFeatures: number;
    simulatedFeatures: number;
    hybridFeatures: number;
    availableAdapters: number;
    unhealthyAdapters: number;
    } {
    const modes = this.getAllModes();
    const registryStats = adapterRegistry.getStats();

    return {
      totalFeatures: Object.keys(modes).length,
      realFeatures: Object.values(modes).filter(mode => mode === 'real').length,
      simulatedFeatures: Object.values(modes).filter(mode => mode === 'simulated').length,
      hybridFeatures: Object.values(modes).filter(mode => mode === 'hybrid').length,
      availableAdapters: registryStats.activeInstances,
      unhealthyAdapters: registryStats.unhealthyAdapters.length,
    };
  }

  /**
   * Cleanup resources
   */
  cleanup(): void {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
    }

    this.subscribers.clear();
    this.modeCache.clear();
  }
}

/**
 * Global hybrid mode manager instance
 */
export const hybridModeManager = HybridModeManager.getInstance();
