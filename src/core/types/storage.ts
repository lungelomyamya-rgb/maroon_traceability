// src/core/types/storage.ts
// Storage adapter interface for abstracting storage implementations

/**
 * Base storage adapter interface
 */
export interface StorageAdapter {
  /** Adapter identifier */
  readonly id: string;
  /** Storage type */
  readonly type: 'localStorage' | 'indexedDB' | 'memory' | 'sessionStorage';
  /** Whether the storage is available */
  readonly isAvailable: boolean;
  /** Initialize the storage adapter */
  initialize(): Promise<void>;
  /** Cleanup storage resources */
  cleanup(): Promise<void>;

  // Basic operations
  set(key: string, value: unknown): Promise<void>;
  get(key: string): Promise<unknown>;
  remove(key: string): Promise<void>;
  clear(): Promise<void>;

  // Advanced operations
  exists(key: string): Promise<boolean>;
  keys(): Promise<string[]>;
  size(): Promise<number>;

  // Batch operations
  setMultiple(items: Record<string, unknown>): Promise<void>;
  getMultiple(keys: string[]): Promise<Record<string, unknown>>;
  removeMultiple(keys: string[]): Promise<void>;
}

/**
 * Storage adapter configuration
 */
export interface StorageConfig {
  /** Storage type */
  type: 'localStorage' | 'indexedDB' | 'memory' | 'sessionStorage';
  /** Database name for IndexedDB */
  dbName?: string;
  /** Store name for IndexedDB */
  storeName?: string;
  /** Version for IndexedDB */
  version?: number;
  /** Prefix for keys */
  keyPrefix?: string;
  /** TTL for items in milliseconds */
  defaultTTL?: number;
  /** Maximum storage size in bytes */
  maxSize?: number;
}

/**
 * Storage item with metadata
 */
export interface StorageItem<T = unknown> {
  value: T;
  timestamp: number;
  expiresAt?: number;
  metadata?: Record<string, unknown>;
}

/**
 * Storage statistics
 */
export interface StorageStats {
  totalItems: number;
  totalSize: number;
  usedSpace: number;
  availableSpace?: number;
  oldestItem?: string;
  newestItem?: string;
}
