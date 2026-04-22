// src/core/interfaces/IRepository.ts
// Base repository interface for all data access

/**
 * Base repository interface that all repositories must implement
 * Provides standard CRUD operations and query capabilities
 */
export interface IRepository<T, ID = string> {
  /**
   * Find entity by ID
   * @param id - Entity identifier
   * @returns Promise resolving to entity or null if not found
   */
  findById(id: ID): Promise<T | null>;

  /**
   * Find all entities
   * @param options - Query options (pagination, filtering, sorting)
   * @returns Promise resolving to array of entities
   */
  findAll(options?: QueryOptions<T>): Promise<T[]>;

  /**
   * Find entities matching criteria
   * @param criteria - Search criteria
   * @param options - Query options
   * @returns Promise resolving to array of matching entities
   */
  findMany(criteria: Partial<T>, options?: QueryOptions<T>): Promise<T[]>;

  /**
   * Find first entity matching criteria
   * @param criteria - Search criteria
   * @returns Promise resolving to entity or null if not found
   */
  findOne(criteria: Partial<T>): Promise<T | null>;

  /**
   * Create new entity
   * @param data - Entity data to create
   * @returns Promise resolving to created entity
   */
  create(data: Omit<T, 'id'>): Promise<T>;

  /**
   * Update existing entity
   * @param id - Entity identifier
   * @param data - Partial entity data to update
   * @returns Promise resolving to updated entity
   */
  update(id: ID, data: Partial<T>): Promise<T>;

  /**
   * Delete entity by ID
   * @param id - Entity identifier
   * @returns Promise resolving to boolean indicating success
   */
  delete(id: ID): Promise<boolean>;

  /**
   * Count entities matching criteria
   * @param criteria - Search criteria (optional)
   * @returns Promise resolving to count of matching entities
   */
  count(criteria?: Partial<T>): Promise<number>;

  /**
   * Check if entity exists
   * @param id - Entity identifier
   * @returns Promise resolving to boolean indicating existence
   */
  exists(id: ID): Promise<boolean>;
}

/**
 * Query options for repository operations
 */
export interface QueryOptions<T> {
  /** Pagination options */
  pagination?: {
    page?: number;
    limit?: number;
    offset?: number;
  };

  /** Sorting options */
  sort?: {
    field: keyof T;
    direction: 'asc' | 'desc';
  }[];

  /** Field selection */
  select?: (keyof T)[];

  /** Include relationships */
  include?: string[];

  /** Filtering options */
  filter?: {
    search?: string;
    searchFields?: (keyof T)[];
    dateRange?: {
      field: keyof T;
      start: Date;
      end: Date;
    };
  };
}

/**
 * Repository with additional hybrid-specific methods
 */
export interface IHybridRepository<T, ID = string> extends IRepository<T, ID> {
  /**
   * Get repository mode (mock, real, hybrid)
   */
  getMode(): 'mock' | 'real' | 'hybrid';

  /**
   * Set repository mode
   */
  setMode(mode: 'mock' | 'real' | 'hybrid'): void;

  /**
   * Get repository health status
   */
  getHealth(): Promise<RepositoryHealth>;

  /**
   * Switch to fallback mode if primary fails
   */
  switchToFallback(): Promise<void>;

  /**
   * Get repository statistics
   */
  getStats(): Promise<RepositoryStats>;
}

/**
 * Repository health status
 */
export interface RepositoryHealth {
  isHealthy: boolean;
  lastCheck: Date;
  responseTime: number;
  errorCount: number;
  uptime: number;
  mode: 'mock' | 'real' | 'hybrid';
  activeAdapter: string;
}

/**
 * Repository statistics
 */
export interface RepositoryStats {
  totalOperations: number;
  successfulOperations: number;
  failedOperations: number;
  averageResponseTime: number;
  lastOperation: Date;
  cacheHitRate: number;
  activeConnections: number;
}

/**
 * Repository configuration
 */
export interface RepositoryConfig {
  mode: 'mock' | 'real' | 'hybrid';
  fallbackEnabled: boolean;
  cacheEnabled: boolean;
  cacheTTL: number;
  timeout: number;
  retryAttempts: number;
  retryDelay: number;
  healthCheckInterval: number;
}

/**
 * Base repository error
 */
export class RepositoryError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly operation: string,
    public readonly entityId?: string,
  ) {
    super(message);
    this.name = 'RepositoryError';
  }
}

/**
 * Entity not found error
 */
export class EntityNotFoundError extends RepositoryError {
  constructor(entityType: string, entityId: string) {
    super(
      `${entityType} with ID ${entityId} not found`,
      'ENTITY_NOT_FOUND',
      'findById',
      entityId,
    );
    this.name = 'EntityNotFoundError';
  }
}

/**
 * Duplicate entity error
 */
export class DuplicateEntityError extends RepositoryError {
  constructor(entityType: string, field: string, value: unknown) {
    super(
      `${entityType} with ${field} ${value} already exists`,
      'DUPLICATE_ENTITY',
      'create',
    );
    this.name = 'DuplicateEntityError';
  }
}

/**
 * Repository connection error
 */
export class RepositoryConnectionError extends RepositoryError {
  constructor(message: string) {
    super(
      `Repository connection error: ${message}`,
      'CONNECTION_ERROR',
      'connection',
    );
    this.name = 'RepositoryConnectionError';
  }
}
