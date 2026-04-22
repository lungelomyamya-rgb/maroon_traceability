// src/infrastructure/repositories/MockRepository.ts
// Mock repository implementation for testing and development

import type {
  QueryOptions,
  RepositoryConfig,
} from '../../core/interfaces';
import { BaseRepository } from './BaseRepository';

/**
 * Mock repository implementation
 * Uses in-memory storage for testing and development
 */
export class MockRepository<T extends { id: ID }, ID = string> extends BaseRepository<T, ID> {
  private data: Map<ID, T> = new Map();
  private nextId: ID;

  constructor(config: RepositoryConfig, initialData: T[] = []) {
    super(config);

    // Initialize with mock data
    initialData.forEach(item => {
      this.data.set(item.id, item);
    });

    // Generate next ID (simplified)
    this.nextId = this.generateNextId(initialData);
  }

  /**
   * Find entity by ID
   */
  protected async findByIdImpl(id: ID): Promise<T | null> {
    // Perform a simple operation to check connectivity
    await this.countImpl();
    await this.simulateDelay();

    const entity = this.data.get(id);
    return entity || null;
  }

  /**
   * Find all entities
   */
  protected async findAllImpl(options?: QueryOptions<T>): Promise<T[]> {
    await this.simulateDelay();

    let results = Array.from(this.data.values());

    // Apply filtering
    if (options?.filter) {
      results = this.applyFilter(results, options.filter);
    }

    // Apply sorting
    if (options?.sort) {
      results = this.applySorting(results, options.sort);
    }

    // Apply pagination
    if (options?.pagination) {
      results = this.applyPagination(results, options.pagination);
    }

    // Apply field selection
    if (options?.select) {
      results = this.applyFieldSelection(results, options.select);
    }

    return results;
  }

  /**
   * Find entities matching criteria
   */
  protected async findManyImpl(
    criteria: Partial<T>,
    options?: QueryOptions<T>,
  ): Promise<T[]> {
    await this.simulateDelay();

    let results = Array.from(this.data.values()).filter(item =>
      this.matchesCriteria(item, criteria),
    );

    // Apply additional options
    if (options?.filter) {
      results = this.applyFilter(results, options.filter);
    }

    if (options?.sort) {
      results = this.applySorting(results, options.sort);
    }

    if (options?.pagination) {
      results = this.applyPagination(results, options.pagination);
    }

    return results;
  }

  /**
   * Find first entity matching criteria
   */
  protected async findOneImpl(criteria: Partial<T>): Promise<T | null> {
    await this.simulateDelay();

    const results = Array.from(this.data.values()).find(item =>
      this.matchesCriteria(item, criteria),
    );

    return results || null;
  }

  /**
   * Create new entity
   */
  protected async createImpl(data: Omit<T, 'id'>): Promise<T> {
    await this.simulateDelay();

    const newId = this.generateNextId(Array.from(this.data.values()));
    const newEntity = { ...data, id: newId } as T;

    this.data.set(newId, newEntity);
    this.nextId = this.incrementId(newId);

    return newEntity;
  }

  /**
   * Update existing entity
   */
  protected async updateImpl(id: ID, data: Partial<T>): Promise<T> {
    await this.simulateDelay();

    const existing = this.data.get(id);
    if (!existing) {
      throw new Error(`Entity with ID ${String(id)} not found`);
    }

    const updated = { ...existing, ...data };
    this.data.set(id, updated);

    return updated;
  }

  /**
   * Delete entity by ID
   */
  protected async deleteImpl(id: ID): Promise<boolean> {
    await this.simulateDelay();

    const deleted = this.data.delete(id);
    return deleted;
  }

  /**
   * Count entities matching criteria
   */
  protected async countImpl(criteria?: Partial<T>): Promise<number> {
    await this.simulateDelay();

    if (!criteria) {
      return this.data.size;
    }

    const results = Array.from(this.data.values()).filter(item =>
      this.matchesCriteria(item, criteria),
    );

    return results.length;
  }

  /**
   * Check if entity exists
   */
  protected async existsImpl(id: ID): Promise<boolean> {
    await this.simulateDelay();
    return this.data.has(id);
  }

  /**
   * Get entity name for error messages
   */
  protected getEntityName(): string {
    return this.constructor.name.replace('Repository', '');
  }

  /**
   * Generate next ID
   */
  private generateNextId(existingData: T[]): ID {
    if (existingData.length === 0) {
      return '1' as ID; // Default starting ID
    }

    // Find max ID and increment
    const maxId = Math.max(
      ...existingData.map(item => parseInt(String(item.id), 10)),
    );

    return String(maxId + 1) as ID;
  }

  /**
   * Increment ID
   */
  private incrementId(currentId: ID): ID {
    const nextId = parseInt(String(currentId), 10) + 1;
    return String(nextId) as ID;
  }

  /**
   * Simulate network delay
   */
  private async simulateDelay(): Promise<void> {
    const delay = Math.random() * 100 + 50; // 50-150ms delay
    await new Promise(resolve => setTimeout(resolve, delay));
  }

  /**
   * Check if entity matches criteria
   */
  private matchesCriteria(entity: T, criteria: Partial<T>): boolean {
    return Object.entries(criteria).every(([key, value]) => {
      const entityValue = (entity as Record<string, unknown>)[key];

      if (typeof value === 'string' && typeof entityValue === 'string') {
        return entityValue.toLowerCase().includes(value.toLowerCase());
      }

      return entityValue === value;
    });
  }

  /**
   * Apply filter to results
   */
  private applyFilter(
    results: T[],
    filter: QueryOptions<T>['filter'],
  ): T[] {
    if (!filter) {
      return results;
    }

    return results.filter(item => {
      // Search filter
      if (filter.search && filter.searchFields) {
        const searchLower = filter.search.toLowerCase();
        return filter.searchFields.some(field => {
          const value = (item as Record<keyof T, unknown>)[field];
          return typeof value === 'string' &&
                 value.toLowerCase().includes(searchLower);
        });
      }

      // Date range filter
      if (filter.dateRange) {
        const fieldValue = (item as Record<keyof T, unknown>)[filter.dateRange.field];
        if (fieldValue instanceof Date) {
          return fieldValue >= filter.dateRange.start &&
                 fieldValue <= filter.dateRange.end;
        }
      }

      return true;
    });
  }

  /**
   * Apply sorting to results
   */
  private applySorting(
    results: T[],
    sort: QueryOptions<T>['sort'],
  ): T[] {
    if (!sort || sort.length === 0) {
      return results;
    }

    return [...results].sort((a, b) => {
      for (const { field, direction } of sort) {
        const aValue = (a as Record<keyof T, unknown>)[field];
        const bValue = (b as Record<keyof T, unknown>)[field];

        if (aValue < bValue) {
          return direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return direction === 'asc' ? 1 : -1;
        }
      }
      return 0;
    });
  }

  /**
   * Apply pagination to results
   */
  private applyPagination(
    results: T[],
    pagination: QueryOptions<T>['pagination'],
  ): T[] {
    if (!pagination) {
      return results;
    }

    const { page = 1, limit = 10, offset = 0 } = pagination;
    const startIndex = offset || (page - 1) * limit;
    const endIndex = startIndex + limit;

    return results.slice(startIndex, endIndex);
  }

  /**
   * Apply field selection to results
   */
  private applyFieldSelection(
    results: T[],
    select: QueryOptions<T>['select'],
  ): T[] {
    if (!select) {
      return results;
    }

    return results.map(item => {
      const selected: Partial<T> = {};
      select.forEach(field => {
        selected[field] = (item as Record<keyof T, unknown>)[field] as T[keyof T];
      });
      return selected as T;
    });
  }

  /**
   * Clear all data (for testing)
   */
  public clear(): void {
    this.data.clear();
  }

  /**
   * Get all data (for testing)
   */
  public getAllData(): T[] {
    return Array.from(this.data.values());
  }

  /**
   * Load data (for testing)
   */
  public loadData(data: T[]): void {
    this.data.clear();
    data.forEach(item => {
      this.data.set(item.id, item);
    });
    this.nextId = this.generateNextId(data);
  }
}
