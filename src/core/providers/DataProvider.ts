// src/core/providers/DataProvider.ts
// Data provider factory for managing adapters and data sources

import type {
  BaseAdapter,
  AdapterFactory,
  AdapterConfig,
  HybridAdapterConfig,
  AuthAdapter,
  RegistrationData,
} from '../types/adapter';
import type { AdapterHealthStatus } from '../types/config';

/**
 * Data Provider Factory
 * Manages creation and lifecycle of data adapters
 */
export class DataProvider implements AdapterFactory {
  private static instance: DataProvider;
  private adapters = new Map<string, Map<string, new (config?: AdapterConfig) => BaseAdapter>>();
  private instances = new Map<string, BaseAdapter>();
  private configs = new Map<string, AdapterConfig>();

  private constructor() {} // eslint-disable-line @typescript-eslint/no-empty-function

  /**
   * Get singleton instance
   */
  static getInstance(): DataProvider {
    if (!DataProvider.instance) {
      DataProvider.instance = new DataProvider();
    }
    return DataProvider.instance;
  }

  /**
   * Register adapter implementation
   */
  register<T extends BaseAdapter>(
    type: string,
    name: string,
    implementation: new (config?: AdapterConfig) => T,
  ): void {
    if (!this.adapters.has(type)) {
      this.adapters.set(type, new Map());
    }
    const adapterMap = this.adapters.get(type);
    if (adapterMap) {
      adapterMap.set(name, implementation);
    }
  }

  /**
   * Create adapter instance
   */
  async create<T extends BaseAdapter>(
    type: string,
    name: string,
    config?: AdapterConfig,
  ): Promise<T> {
    const key = `${type}.${name}`;

    // Check if instance already exists
    if (this.instances.has(key)) {
      return this.instances.get(key) as T;
    }

    // Get adapter implementation
    const typeAdapters = this.adapters.get(type);
    if (!typeAdapters || !typeAdapters.has(name)) {
      throw new Error(`Adapter not found: ${type}.${name}`);
    }

    // Create instance
    const AdapterClass = typeAdapters.get(name);
    if (!AdapterClass) {
      throw new Error(`Adapter class not found: ${type}.${name}`);
    }
    const instance = new AdapterClass(config);

    // Store config and instance
    if (config) {
      this.configs.set(key, config);
    }

    this.instances.set(key, instance);

    // Initialize adapter
    await instance.initialize();

    return instance as T;
  }

  /**
   * Get existing adapter instance
   */
  get<T extends BaseAdapter>(type: string, name: string): T | null {
    const key = `${type}.${name}`;
    return this.instances.get(key) as T || null;
  }

  /**
   * Get adapter configuration
   */
  getConfig(type: string, name: string): AdapterConfig | undefined {
    const key = `${type}.${name}`;
    return this.configs.get(key);
  }

  /**
   * Create hybrid adapter from multiple sources
   */
  async createHybrid<T extends BaseAdapter>(
    type: string,
    sources: Array<{ name: string; config?: AdapterConfig; priority?: number }>,
    hybridConfig?: HybridAdapterConfig,
  ): Promise<T> {
    // Sort sources by priority (higher priority first)
    const sortedSources = sources.sort((a, b) => (b.priority || 0) - (a.priority || 0));

    // Create adapter instances
    const adapters: T[] = [];
    for (const source of sortedSources) {
      try {
        const adapter = await this.create<T>(type, source.name, source.config);
        adapters.push(adapter);
      } catch (error) {
        console.warn(`Failed to create adapter ${type}.${source.name}:`, error);
        if (hybridConfig?.autoFailover !== false) {
          continue; // Try next source
        } else {
          throw error;
        }
      }
    }

    if (adapters.length === 0) {
      throw new Error(`No adapters available for hybrid ${type}`);
    }

    // Create hybrid adapter wrapper
    return this.createHybridWrapper(adapters, hybridConfig) as T;
  }

  /**
   * Create hybrid adapter wrapper
   */
  private createHybridWrapper<T extends BaseAdapter>(
    adapters: T[],
    config?: HybridAdapterConfig,
  ): BaseAdapter {
    const primaryAdapter = adapters[0];
    const fallbackAdapters = adapters.slice(1);

    return {
      id: `hybrid.${primaryAdapter.id}`,
      type: 'hybrid',
      get isAvailable() {
        return primaryAdapter.isAvailable || fallbackAdapters.some(a => a.isAvailable);
      },

      async initialize(): Promise<void> {
        // Initialize all adapters
        await Promise.all(adapters.map(adapter => adapter.initialize()));
      },

      async cleanup(): Promise<void> {
        // Cleanup all adapters
        await Promise.all(adapters.map(adapter => adapter.cleanup()));
      },

      // Proxy methods to primary adapter with fallback
      async login(email: string, password: string) {
        if ('login' in primaryAdapter) {
          try {
            return await (primaryAdapter as unknown as AuthAdapter).login(email, password);
          } catch (error) {
            if (config?.autoFailover !== false) {
              for (const fallback of fallbackAdapters) {
                if ('login' in fallback && fallback.isAvailable) {
                  try {
                    return await (fallback as unknown as AuthAdapter).login(email, password);
                  } catch (fallbackError) {
                    console.warn('Fallback adapter failed:', fallbackError);
                    continue;
                  }
                }
              }
            }
            throw error;
          }
        }
        throw new Error('Method not supported');
      },

      async register(userData: RegistrationData) {
        if ('register' in primaryAdapter) {
          try {
            return await (primaryAdapter as unknown as AuthAdapter).register(userData);
          } catch (error) {
            if (config?.autoFailover !== false) {
              for (const fallback of fallbackAdapters) {
                if ('register' in fallback && fallback.isAvailable) {
                  try {
                    return await (fallback as unknown as AuthAdapter).register(userData);
                  } catch (fallbackError) {
                    console.warn('Fallback adapter failed:', fallbackError);
                    continue;
                  }
                }
              }
            }
            throw error;
          }
        }
        throw new Error('Method not supported');
      },

      // Add other methods as needed...
    } as BaseAdapter;
  }

  /**
   * Get available adapters
   */
  getAvailableAdapters(): Record<string, string[]> {
    const result: Record<string, string[]> = {};

    for (const [type, adapters] of this.adapters.entries()) {
      result[type] = Array.from(adapters.keys());
    }

    return result;
  }

  /**
   * Cleanup all adapters
   */
  async cleanup(): Promise<void> {
    const cleanupPromises = Array.from(this.instances.values()).map(
      adapter => adapter.cleanup().catch(error =>
        console.warn('Error cleaning up adapter:', error),
      ),
    );

    await Promise.all(cleanupPromises);

    this.instances.clear();
    this.configs.clear();
  }

  /**
   * Get health status of all adapters
   */
  async getHealthStatus(): Promise<Record<string, AdapterHealthStatus>> {
    const health: Record<string, AdapterHealthStatus> = {};

    for (const [key, adapter] of this.instances.entries()) {
      try {
        // Basic health check - adapter is available
        health[key] = {
          adapterId: key,
          status: adapter.isAvailable ? 'healthy' : 'unhealthy',
          lastCheck: new Date().toISOString(),
        } as AdapterHealthStatus;
      } catch (error) {
        health[key] = {
          adapterId: key,
          status: 'unhealthy',
          lastCheck: new Date().toISOString(),
          error: error instanceof Error ? error.message : 'Unknown error',
        };
      }
    }

    return health;
  }
}

/**
 * Global data provider instance
 */
export const dataProvider = DataProvider.getInstance();
