// src/infrastructure/repositories/BaseRepository.ts
// Abstract base repository implementation

import type {
  IRepository,
  QueryOptions,
  RepositoryHealth,
  RepositoryStats,
  RepositoryConfig,
} from '../../core/interfaces';
import {
  RepositoryError,
  EntityNotFoundError,
  DuplicateEntityError,
  RepositoryConnectionError,
} from '../../core/interfaces';

/**
 * Abstract base repository implementation
 * Provides common functionality for all repositories
 */
export abstract class BaseRepository<T, ID = string> implements IRepository<T, ID> {
  protected config: RepositoryConfig;
  protected health: RepositoryHealth;
  protected stats: RepositoryStats;
  protected cache: Map<string, { data: T; timestamp: number }> = new Map();

  constructor(config: RepositoryConfig) {
    this.config = config;
    this.health = {
      isHealthy: true,
      lastCheck: new Date(),
      responseTime: 0,
      errorCount: 0,
      uptime: 100,
      mode: config.mode,
      activeAdapter: `${config.mode}-adapter`,
    };
    this.stats = {
      totalOperations: 0,
      successfulOperations: 0,
      failedOperations: 0,
      averageResponseTime: 0,
      lastOperation: new Date(),
      cacheHitRate: 0,
      activeConnections: 0,
    };
  }

  /**
   * Find entity by ID
   */
  public async findById(id: ID): Promise<T | null> {
    const startTime = Date.now();

    try {
      // Check cache first
      if (this.config.cacheEnabled) {
        const cached = this.cache.get(this.getCacheKey('findById', id));
        if (cached && this.isCacheValid(cached.timestamp)) {
          this.updateStats(true, Date.now() - startTime, true);
          return cached.data;
        }
      }

      const result = await this.findByIdImpl(id);

      // Update cache
      if (this.config.cacheEnabled && result) {
        this.cache.set(this.getCacheKey('findById', id), {
          data: result,
          timestamp: Date.now(),
        });
      }

      this.updateStats(true, Date.now() - startTime);
      return result;
    } catch (error) {
      this.updateStats(false, Date.now() - startTime);
      throw this.handleError(error as Error, 'findById');
    }
  }

  /**
   * Find all entities
   */
  public async findAll(options?: QueryOptions<T>): Promise<T[]> {
    const startTime = Date.now();

    try {
      const result = await this.findAllImpl(options);
      this.updateStats(true, Date.now() - startTime);
      return result;
    } catch (error) {
      this.updateStats(false, Date.now() - startTime);
      throw this.handleError(error as Error, 'findAll');
    }
  }

  /**
   * Find entities matching criteria
   */
  public async findMany(
    criteria: Partial<T>,
    options?: QueryOptions<T>,
  ): Promise<T[]> {
    const startTime = Date.now();

    try {
      const result = await this.findManyImpl(criteria, options);
      this.updateStats(true, Date.now() - startTime);
      return result;
    } catch (error) {
      this.updateStats(false, Date.now() - startTime);
      throw this.handleError(error as Error, 'findMany');
    }
  }

  /**
   * Find first entity matching criteria
   */
  public async findOne(criteria: Partial<T>): Promise<T | null> {
    const startTime = Date.now();

    try {
      const result = await this.findOneImpl(criteria);
      this.updateStats(true, Date.now() - startTime);
      return result;
    } catch (error) {
      this.updateStats(false, Date.now() - startTime);
      throw this.handleError(error as Error, 'findOne');
    }
  }

  /**
   * Create new entity
   */
  public async create(data: Omit<T, 'id'>): Promise<T> {
    const startTime = Date.now();

    try {
      // Check for duplicates
      if (await this.existsByCriteria(data as Partial<T>)) {
        throw new DuplicateEntityError(
          this.getEntityName(),
          'data',
          data,
        );
      }

      const result = await this.createImpl(data);

      // Invalidate cache
      this.invalidateCache('create');

      this.updateStats(true, Date.now() - startTime);
      return result;
    } catch (error) {
      this.updateStats(false, Date.now() - startTime);
      throw this.handleError(error as Error, 'create');
    }
  }

  /**
   * Update existing entity
   */
  public async update(id: ID, data: Partial<T>): Promise<T> {
    const startTime = Date.now();

    try {
      // Check if entity exists
      const existing = await this.findById(id);
      if (!existing) {
        throw new EntityNotFoundError(this.getEntityName(), String(id));
      }

      const result = await this.updateImpl(id, data);

      // Update cache
      if (this.config.cacheEnabled) {
        this.cache.set(this.getCacheKey('findById', id), {
          data: result,
          timestamp: Date.now(),
        });
      }

      this.updateStats(true, Date.now() - startTime);
      return result;
    } catch (error) {
      this.updateStats(false, Date.now() - startTime);
      throw this.handleError(error as Error, 'update');
    }
  }

  /**
   * Delete entity by ID
   */
  public async delete(id: ID): Promise<boolean> {
    const startTime = Date.now();

    try {
      const result = await this.deleteImpl(id);

      // Remove from cache
      this.cache.delete(this.getCacheKey('findById', id));
      this.invalidateCache('delete');

      this.updateStats(true, Date.now() - startTime);
      return result;
    } catch (error) {
      this.updateStats(false, Date.now() - startTime);
      throw this.handleError(error as Error, 'delete');
    }
  }

  /**
   * Count entities matching criteria
   */
  public async count(criteria?: Partial<T>): Promise<number> {
    const startTime = Date.now();

    try {
      const result = await this.countImpl(criteria);
      this.updateStats(true, Date.now() - startTime);
      return result;
    } catch (error) {
      this.updateStats(false, Date.now() - startTime);
      throw this.handleError(error as Error, 'count');
    }
  }

  /**
   * Check if entity exists
   */
  public async exists(id: ID): Promise<boolean> {
    const startTime = Date.now();

    try {
      const result = await this.existsImpl(id);
      this.updateStats(true, Date.now() - startTime);
      return result;
    } catch (error) {
      this.updateStats(false, Date.now() - startTime);
      throw this.handleError(error as Error, 'exists');
    }
  }

  /**
   * Get repository health status
   */
  public async getHealth(): Promise<RepositoryHealth> {
    try {
      await this.performHealthCheck();
      return { ...this.health };
    } catch (_error) {
      this.health.isHealthy = false;
      this.health.errorCount++;
      return { ...this.health };
    }
  }

  /**
   * Get repository statistics
   */
  public async getStats(): Promise<RepositoryStats> {
    return { ...this.stats };
  }

  // Abstract methods to be implemented by concrete repositories
  protected abstract findByIdImpl(id: ID): Promise<T | null>;
  protected abstract findAllImpl(options?: QueryOptions<T>): Promise<T[]>;
  protected abstract findManyImpl(criteria: Partial<T>, options?: QueryOptions<T>): Promise<T[]>;
  protected abstract findOneImpl(criteria: Partial<T>): Promise<T | null>;
  protected abstract createImpl(data: Omit<T, 'id'>): Promise<T>;
  protected abstract updateImpl(id: ID, data: Partial<T>): Promise<T>;
  protected abstract deleteImpl(id: ID): Promise<boolean>;
  protected abstract countImpl(criteria?: Partial<T>): Promise<number>;
  protected abstract existsImpl(id: ID): Promise<boolean>;

  // Helper methods
  protected abstract getEntityName(): string;

  /**
   * Check if entity exists by criteria
   */
  protected async existsByCriteria(criteria: Partial<T>): Promise<boolean> {
    const entity = await this.findOne(criteria);
    return entity !== null;
  }

  /**
   * Get cache key
   */
  protected getCacheKey(operation: string, id: ID | string): string {
    return `${this.constructor.name}:${operation}:${String(id)}`;
  }

  /**
   * Check if cache entry is valid
   */
  protected isCacheValid(timestamp: number): boolean {
    return Date.now() - timestamp < this.config.cacheTTL;
  }

  /**
   * Invalidate cache
   */
  protected invalidateCache(operation: string): void {
    if (operation === 'create' || operation === 'delete') {
      // Clear all cache for create/delete operations
      this.cache.clear();
    }
  }

  /**
   * Update repository statistics
   */
  protected updateStats(success: boolean, duration: number, cacheHit = false): void {
    this.stats.totalOperations++;
    this.stats.lastOperation = new Date();

    if (success) {
      this.stats.successfulOperations++;
    } else {
      this.stats.failedOperations++;
    }

    // Update average response time
    this.stats.averageResponseTime =
      (this.stats.averageResponseTime + duration) / 2;

    // Update cache hit rate
    if (cacheHit) {
      this.stats.cacheHitRate =
        (this.stats.cacheHitRate + 1) / this.stats.totalOperations;
    }
  }

  /**
   * Handle repository errors
   */
  protected handleError(error: Error, operation: string): RepositoryError {
    this.health.errorCount++;

    if (error instanceof RepositoryError) {
      return error;
    }

    // Convert common errors to repository errors
    if (error.message.includes('not found')) {
      return new EntityNotFoundError(this.getEntityName(), 'unknown');
    }

    if (error.message.includes('duplicate') || error.message.includes('already exists')) {
      return new DuplicateEntityError(this.getEntityName(), 'unknown', error);
    }

    if (error.message.includes('connection') || error.message.includes('network')) {
      return new RepositoryConnectionError(error.message);
    }

    return new RepositoryError(error.message, 'UNKNOWN_ERROR', operation);
  }

  /**
   * Perform health check
   */
  protected async performHealthCheck(): Promise<void> {
    const startTime = Date.now();

    try {
      // Perform a simple operation to check connectivity
      await this.count();

      this.health.isHealthy = true;
      this.health.responseTime = Date.now() - startTime;
      this.health.lastCheck = new Date();
    } catch (error) {
      this.health.isHealthy = false;
      this.health.errorCount++;
      this.health.lastCheck = new Date();
      throw error;
    }
  }
}
