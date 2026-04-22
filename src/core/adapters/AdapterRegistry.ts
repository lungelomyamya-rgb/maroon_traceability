// src/core/adapters/AdapterRegistry.ts
// Adapter registry for managing adapter instances

import type { IService } from '../interfaces/services';
import type { BaseAdapter } from '../types/adapter';
import type { AdapterHealthStatus } from '../types/config';

// Adapter constructor type - flexible to handle different config types
type AdapterConstructor = new (...args: unknown[]) => BaseAdapter<unknown, unknown>;

/**
 * Adapter registry for managing adapter instances
 */
class AdapterRegistry implements IService {
  readonly name = 'AdapterRegistry';
  readonly version = '1.0.0';
  private adapters = new Map<string, BaseAdapter<unknown, unknown>>();
  private adapterTypes = new Map<string, AdapterConstructor>();
  private static instance: AdapterRegistry;

  private constructor() {
    // Initialize adapter registry
  }

  static getInstance(): AdapterRegistry {
    if (!AdapterRegistry.instance) {
      AdapterRegistry.instance = new AdapterRegistry();
    }
    return AdapterRegistry.instance;
  }

  /**
   * Register an adapter
   */
  register(adapter: BaseAdapter): void {
    this.adapters.set(adapter.id, adapter);
  }

  /**
   * Register an adapter type
   */
  registerType(id: string, adapterClass: AdapterConstructor): void {
    this.adapterTypes.set(id, adapterClass);
  }

  /**
   * Get an adapter by ID
   */
  get(id: string): BaseAdapter | undefined {
    return this.adapters.get(id);
  }

  /**
   * Get all registered adapters
   */
  getAll(): BaseAdapter<unknown, unknown>[] {
    return Array.from(this.adapters.values());
  }

  /**
   * Get active adapter instances
   */
  getActiveInstances(): Map<string, BaseAdapter<unknown, unknown>> {
    return new Map(this.adapters);
  }

  /**
   * Get available adapter types for a category
   */
  getAvailableAdapters(): Record<string, string[]> {
    const available: Record<string, string[]> = {};
    for (const [category] of this.adapterTypes) {
      // Check if we have instances of this type
      const instances = Array.from(this.adapters.values()).filter(a => a.type === category);
      if (instances.length > 0) {
        available[category] = [category];
      }
    }
    return available;
  }

  /**
   * Create adapter instance by type
   */
  async create(category: string, type: string, config?: unknown): Promise<BaseAdapter<unknown, unknown>> {
    const adapterClass = this.adapterTypes.get(`${category}-${type}`);
    if (!adapterClass) {
      throw new Error(`Adapter type '${type}' not found for category '${category}'`);
    }

    const adapter = new adapterClass(config);
    this.adapters.set(adapter.id, adapter);
    return adapter;
  }

  /**
   * Remove an adapter
   */
  remove(id: string): boolean {
    return this.adapters.delete(id);
  }

  /**
   * Clear all adapters
   */
  clear(): void {
    this.adapters.clear();
  }

  /**
   * Update adapter health status
   */
  updateHealthStatus(adapterId: string, status: string, error?: string): void {
    const adapter = this.adapters.get(adapterId);
    if (adapter) {
      // Store health status in a separate map for tracking
      if (!this.healthStatus) {
        this.healthStatus = new Map();
      }
      this.healthStatus.set(adapterId, { status, error, lastCheck: new Date() });
    }
  }

  private healthStatus = new Map<string, { status: string; error?: string; lastCheck: Date }>();

  /**
   * Check if adapter is healthy
   */
  isHealthy(featureName: string, adapterType: string): boolean {
    const adapterId = `${featureName}-${adapterType}`;
    const health = this.healthStatus.get(adapterId);
    return health ? health.status === 'healthy' : false;
  }

  /**
   * Get health status for all adapters
   */
  getHealthStatus(): Record<string, AdapterHealthStatus> {
    const status: Record<string, AdapterHealthStatus> = {};
    for (const [adapterId, health] of this.healthStatus) {
      status[adapterId] = {
        adapterId,
        status: health.status as 'healthy' | 'degraded' | 'unhealthy',
        lastCheck: health.lastCheck.toISOString(),
      };
    }
    return status;
  }

  /**
   * Get adapter statistics
   */
  getStats(): {
    total: number;
    healthy: number;
    unhealthy: number;
    byType: Record<string, number>;
    activeInstances: number;
    unhealthyAdapters: string[];
  } {
    const adapters = Array.from(this.adapters.values());
    const healthyCount = Array.from(this.healthStatus.values()).filter(h => h.status === 'healthy').length;
    const unhealthyCount = Array.from(this.healthStatus.values()).filter(h => h.status !== 'healthy').length;

    const byType: Record<string, number> = {};
    for (const adapter of adapters) {
      byType[adapter.type] = (byType[adapter.type] || 0) + 1;
    }

    const unhealthyAdapters = Array.from(this.healthStatus.entries())
      .filter(([_, health]) => health.status !== 'healthy')
      .map(([id, _]) => id);

    return {
      total: adapters.length,
      healthy: healthyCount,
      unhealthy: unhealthyCount,
      byType,
      activeInstances: adapters.filter(a => a.isAvailable).length,
      unhealthyAdapters,
    };
  }

  /**
   * Get adapter by criteria
   */
  async getAdapter(criteria: { type: string; available?: boolean }): Promise<BaseAdapter<unknown, unknown> | null> {
    const adapters = Array.from(this.adapters.values());
    return adapters.find(adapter =>
      adapter.type === criteria.type &&
      adapter.isAvailable === criteria.available,
    ) || null;
  }

  /**
   * Get adapter by ID
   */
  getAdapterById(id: string): BaseAdapter<unknown, unknown> | null {
    return this.adapters.get(id) || null;
  }

  /**
   * Register adapter with type and constructor
   */
  registerAdapter(type: string, constructor: AdapterConstructor): void {
    this.adapterTypes.set(type, constructor);
  }
}

export const adapterRegistry = AdapterRegistry.getInstance();
export type { AdapterConstructor };
