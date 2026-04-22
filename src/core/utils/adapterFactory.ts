// src/core/utils/adapterFactory.ts
// Factory pattern for creating and managing adapters

import type {
  AdapterMetadata,
  AdapterSelectionCriteria,
  IAdapterFactory,
} from '../../types/registry';
import type { BaseAdapter, AdapterConfig } from '../types/adapter';
import {
  getAdapterPriority,
  filterAdaptersByCriteria,
  logHybridOperation,
} from './hybridUtils';

/**
 * Adapter factory implementation
 */
export class AdapterFactory implements IAdapterFactory {
  private constructors = new Map<string, new (config?: AdapterConfig) => BaseAdapter>();
  private instances = new Map<string, BaseAdapter>();
  private metadata = new Map<string, AdapterMetadata>();

  /**
   * Register adapter constructor
   */
  register<T extends BaseAdapter>(
    type: string,
    feature: string,
    constructor: new (config?: AdapterConfig) => T,
  ): void {
    const key = `${feature}:${type}`;
    this.constructors.set(key, constructor);

    logHybridOperation('register_adapter', feature, {
      type,
      key,
      constructorName: constructor.name,
    }, 'info');
  }

  /**
   * Create adapter instance
   */
  async create<T extends BaseAdapter>(
    type: string,
    feature: string,
    config?: AdapterConfig,
  ): Promise<T> {
    const key = `${feature}:${type}`;
    const Constructor = this.constructors.get(key);

    if (!Constructor) {
      throw new Error(`No constructor registered for ${key}`);
    }

    try {
      const adapter = new Constructor(config) as T;
      await adapter.initialize();

      // Store instance
      const instanceId = `${feature}-${type}-${Date.now()}`;
      this.instances.set(instanceId, adapter);

      // Create metadata
      const metadata: AdapterMetadata = {
        id: instanceId,
        type: type as 'mock' | 'real' | 'hybrid',
        feature,
        priority: 0,
        active: true,
        health: {
          status: 'unknown',
          errorCount: 0,
        },
        config,
        instance: adapter,
      };

      this.metadata.set(instanceId, metadata);

      logHybridOperation('create_adapter', feature, {
        type,
        instanceId,
        config,
      }, 'info');

      return adapter;
    } catch (error) {
      logHybridOperation('create_adapter_failed', feature, {
        type,
        error: (error as Error).message,
      }, 'error');
      throw error;
    }
  }

  /**
   * Get available adapter types
   */
  getAvailableTypes(): string[] {
    const types = new Set<string>();
    for (const [key] of this.constructors) {
      const [, type] = key.split(':');
      types.add(type);
    }
    return Array.from(types);
  }

  /**
   * Get available features
   */
  getAvailableFeatures(): string[] {
    const features = new Set<string>();
    for (const [key] of this.constructors) {
      const [feature] = key.split(':');
      features.add(feature);
    }
    return Array.from(features);
  }

  /**
   * Get adapter by selection criteria
   */
  async getAdapter(criteria: AdapterSelectionCriteria): Promise<BaseAdapter | null> {
    const candidates = Array.from(this.metadata.values())
      .filter(adapter => filterAdaptersByCriteria([adapter], criteria).length > 0)
      .sort((a, b) => getAdapterPriority(b, criteria.preferredType) - getAdapterPriority(a, criteria.preferredType));

    if (candidates.length === 0) {
      logHybridOperation('get_adapter_not_found', criteria.feature, {
        criteria,
        availableAdapters: Array.from(this.metadata.values()).map(m => ({
          id: m.id,
          feature: m.feature,
          type: m.type,
          active: m.active,
          health: m.health.status,
        })),
      }, 'warn');
      return null;
    }

    const selected = candidates[0];

    logHybridOperation('get_adapter_selected', criteria.feature, {
      selected: {
        id: selected.id,
        type: selected.type,
        priority: selected.priority,
        health: selected.health.status,
      },
      criteria,
    }, 'info');

    return selected.instance || null;
  }

  /**
   * Get adapter by ID
   */
  getAdapterById(id: string): BaseAdapter | null {
    const metadata = this.metadata.get(id);
    return metadata?.instance || null;
  }

  /**
   * Get all metadata
   */
  getAllMetadata(): AdapterMetadata[] {
    return Array.from(this.metadata.values());
  }

  /**
   * Get metadata by feature
   */
  getMetadataByFeature(feature: string): AdapterMetadata[] {
    return Array.from(this.metadata.values()).filter(m => m.feature === feature);
  }

  /**
   * Get metadata by type
   */
  getMetadataByType(type: string): AdapterMetadata[] {
    return Array.from(this.metadata.values()).filter(m => m.type === type);
  }

  /**
   * Update adapter metadata
   */
  updateMetadata(id: string, updates: Partial<AdapterMetadata>): void {
    const metadata = this.metadata.get(id);
    if (metadata) {
      this.metadata.set(id, { ...metadata, ...updates });
    }
  }

  /**
   * Activate adapter
   */
  async activateAdapter(id: string): Promise<void> {
    const metadata = this.metadata.get(id);
    if (!metadata) {
      throw new Error(`Adapter ${id} not found`);
    }

    if (metadata.instance && 'initialize' in metadata.instance && typeof metadata.instance.initialize === 'function') {
      await metadata.instance.initialize();
    }

    this.updateMetadata(id, { active: true });

    logHybridOperation('activate_adapter', metadata.feature, {
      id,
      type: metadata.type,
    }, 'info');
  }

  /**
   * Deactivate adapter
   */
  async deactivateAdapter(id: string): Promise<void> {
    const metadata = this.metadata.get(id);
    if (!metadata) {
      throw new Error(`Adapter ${id} not found`);
    }

    if (metadata.instance && 'cleanup' in metadata.instance && typeof metadata.instance.cleanup === 'function') {
      await metadata.instance.cleanup();
    }

    this.updateMetadata(id, { active: false });

    logHybridOperation('deactivate_adapter', metadata.feature, {
      id,
      type: metadata.type,
    }, 'info');
  }

  /**
   * Remove adapter
   */
  async removeAdapter(id: string): Promise<void> {
    const metadata = this.metadata.get(id);
    if (!metadata) {
      return;
    }

    // Cleanup adapter
    if (metadata.instance) {
      try {
        if (typeof metadata.instance.cleanup === 'function') {
          await metadata.instance.cleanup();
        }
      } catch (error) {
        logHybridOperation('cleanup_adapter_failed', metadata.feature, {
          id,
          error: (error as Error).message,
        }, 'warn');
      }
    }

    // Remove from storage
    this.instances.delete(id);
    this.metadata.delete(id);

    logHybridOperation('remove_adapter', metadata.feature, {
      id,
      type: metadata.type,
    }, 'info');
  }

  /**
   * Clear all adapters
   */
  async clearAll(): Promise<void> {
    const ids = Array.from(this.metadata.keys());

    for (const id of ids) {
      await this.removeAdapter(id);
    }

    logHybridOperation('clear_all_adapters', 'system', {
      clearedCount: ids.length,
    }, 'info');
  }

  /**
   * Get factory statistics
   */
  getStats(): {
    totalAdapters: number;
    activeAdapters: number;
    constructorsByType: Record<string, number>;
    instancesByFeature: Record<string, number>;
    instancesByType: Record<string, number>;
    } {
    const metadata = Array.from(this.metadata.values());
    const activeAdapters = metadata.filter(m => m.active).length;

    const constructorsByType: Record<string, number> = {};
    for (const [key] of this.constructors) {
      const [, type] = key.split(':');
      constructorsByType[type] = (constructorsByType[type] || 0) + 1;
    }

    const instancesByFeature: Record<string, number> = {};
    const instancesByType: Record<string, number> = {};

    for (const m of metadata) {
      instancesByFeature[m.feature] = (instancesByFeature[m.feature] || 0) + 1;
      instancesByType[m.type] = (instancesByType[m.type] || 0) + 1;
    }

    return {
      totalAdapters: metadata.length,
      activeAdapters,
      constructorsByType,
      instancesByFeature,
      instancesByType,
    };
  }

  /**
   * Create adapter with retry logic
   */
  async createWithRetry<T extends BaseAdapter>(
    type: string,
    feature: string,
    config?: AdapterConfig,
    maxRetries: number = 3,
    retryDelay: number = 1000,
  ): Promise<T> {
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await this.create<T>(type, feature, config);
      } catch (error) {
        lastError = error as Error;

        logHybridOperation('create_adapter_retry', feature, {
          type,
          attempt,
          maxRetries,
          error: lastError.message,
        }, 'warn');

        if (attempt < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, retryDelay * attempt));
        }
      }
    }

    throw lastError || new Error('Failed to create adapter after retries');
  }

  /**
   * Create adapter pool for load balancing
   */
  async createPool<T extends BaseAdapter>(
    type: string,
    feature: string,
    poolSize: number,
    config?: AdapterConfig,
  ): Promise<T[]> {
    const adapters: T[] = [];

    for (let i = 0; i < poolSize; i++) {
      try {
        const adapter = await this.create<T>(type, feature, config);
        adapters.push(adapter);
      } catch (error) {
        logHybridOperation('create_pool_failed', feature, {
          type,
          poolIndex: i,
          poolSize,
          error: (error as Error).message,
        }, 'error');
      }
    }

    logHybridOperation('create_pool', feature, {
      type,
      poolSize,
      actualSize: adapters.length,
    }, 'info');

    return adapters;
  }
}

// Global adapter factory instance
export const adapterFactory = new AdapterFactory();

/**
 * Convenience function to register adapter
 */
export function registerAdapter<T extends BaseAdapter>(
  type: string,
  feature: string,
  constructor: new (config?: AdapterConfig) => T,
): void {
  adapterFactory.register(type, feature, constructor);
}

/**
 * Convenience function to create adapter
 */
export function createAdapter<T extends BaseAdapter>(
  type: string,
  feature: string,
  config?: AdapterConfig,
): Promise<T> {
  return adapterFactory.create<T>(type, feature, config);
}

/**
 * Convenience function to get adapter
 */
export function getAdapter(
  criteria: AdapterSelectionCriteria,
): Promise<BaseAdapter | null> {
  return adapterFactory.getAdapter(criteria);
}
