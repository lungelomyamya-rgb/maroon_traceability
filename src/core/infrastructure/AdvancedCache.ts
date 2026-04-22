// src/core/infrastructure/AdvancedCache.ts
// Advanced caching system with TTL, invalidation, and performance optimization

/**
 * Cache entry with metadata
 */
export interface CacheEntry<T> {
  data: T | CompressedData;
  createdAt: number;
  lastAccessed: number;
  accessCount: number;
  ttl: number; // Time to live in milliseconds
  tags: string[];
  size: number; // Estimated size in bytes
}

/**
 * Compressed data interface
 */
interface CompressedData {
  _compressed: true;
  data: string;
}

/**
 * Cache invalidation strategy
 */
export type InvalidationStrategy =
  | 'ttl'           // Time-based expiration
  | 'lru'           // Least recently used
  | 'lfu'           // Least frequently used
  | 'size'          // Size-based eviction
  | 'tag'           // Tag-based invalidation
  | 'manual';       // Manual invalidation

/**
 * Cache configuration
 */
export interface CacheConfig {
  maxSize: number;        // Maximum number of entries
  maxMemory: number;      // Maximum memory usage in MB
  defaultTTL: number;     // Default TTL in milliseconds
  cleanupInterval: number; // Cleanup interval in milliseconds
  enableStats: boolean;    // Enable statistics tracking
  invalidationStrategy: InvalidationStrategy;
  enableCompression: boolean;
}

/**
 * Cache statistics
 */
export interface CacheStats {
  hits: number;
  misses: number;
  sets: number;
  deletes: number;
  evictions: number;
  totalSize: number;
  totalMemory: number;
  hitRate: number;
  averageAccessTime: number;
  entriesByTag: Record<string, number>;
}

/**
 * Cache invalidation rule
 */
export interface InvalidationRule {
  id: string;
  pattern: string | RegExp;
  tags?: string[];
  ttl?: number;
  condition?: (key: string, entry: CacheEntry<unknown>) => boolean;
}

/**
 * Advanced Cache with multiple eviction strategies and performance optimization
 */
export class AdvancedCache {
  private cache = new Map<string, CacheEntry<unknown>>();
  private config: CacheConfig;
  private stats: CacheStats;
  private cleanupTimer: NodeJS.Timeout | null = null;
  private invalidationRules: InvalidationRule[] = [];
  private compressionEnabled: boolean;

  constructor(config: Partial<CacheConfig> = {}) {
    this.config = this.getDefaultConfig(config);
    this.stats = this.getEmptyStats();
    this.compressionEnabled = this.config.enableCompression;

    this.startCleanupTimer();
  }

  /**
   * Get value from cache
   */
  async get<T>(key: string): Promise<T | null> {
    const startTime = Date.now();
    const entry = this.cache.get(key);

    if (!entry) {
      this.stats.misses++;
      this.updateStats();
      return null;
    }

    // Check TTL expiration
    if (this.isExpired(entry)) {
      this.cache.delete(key);
      this.stats.misses++;
      this.stats.evictions++;
      this.updateStats();
      return null;
    }

    // Update access statistics
    entry.lastAccessed = Date.now();
    entry.accessCount++;

    this.stats.hits++;
    this.updateStats();

    const accessTime = Date.now() - startTime;
    this.updateAverageAccessTime(accessTime);

    return this.decompressData(entry.data as T);
  }

  /**
   * Set value in cache
   */
  async set<T>(key: string, data: T, options: {
    ttl?: number;
    tags?: string[];
    priority?: 'high' | 'normal' | 'low';
  } = {}): Promise<void> {
    const ttl = options.ttl || this.config.defaultTTL;
    const tags = options.tags || [];
    const size = this.estimateSize(data);

    // Check if we need to make space
    await this.ensureSpace(size);

    const entry: CacheEntry<T> = {
      data: this.compressData(data),
      createdAt: Date.now(),
      lastAccessed: Date.now(),
      accessCount: 1,
      ttl,
      tags,
      size,
    };

    this.cache.set(key, entry);
    this.stats.sets++;
    this.stats.totalSize += size;
    this.updateStats();
  }

  /**
   * Delete value from cache
   */
  async delete(key: string): Promise<boolean> {
    const entry = this.cache.get(key);
    if (!entry) {
      return false;
    }

    this.cache.delete(key);
    this.stats.deletes++;
    this.stats.totalSize -= entry.size;
    this.updateStats();

    return true;
  }

  /**
   * Clear cache by pattern or tags
   */
  async clear(pattern?: string | RegExp, tags?: string[]): Promise<number> {
    let deletedCount = 0;
    const keysToDelete: string[] = [];

    for (const [key, entry] of this.cache.entries()) {
      let shouldDelete = false;

      // Pattern matching
      if (pattern) {
        if (pattern instanceof RegExp) {
          shouldDelete = pattern.test(key);
        } else {
          shouldDelete = key.includes(pattern);
        }
      }

      // Tag matching
      if (!shouldDelete && tags) {
        shouldDelete = tags.some(tag => entry.tags.includes(tag));
      }

      // Clear all if no criteria provided
      if (!pattern && !tags) {
        shouldDelete = true;
      }

      if (shouldDelete) {
        keysToDelete.push(key);
      }
    }

    // Delete entries
    keysToDelete.forEach(key => {
      const entry = this.cache.get(key);
      if (entry) {
        this.stats.totalSize -= entry.size;
      }
      this.cache.delete(key);
      deletedCount++;
    });

    this.stats.deletes += deletedCount;
    this.updateStats();

    return deletedCount;
  }

  /**
   * Check if key exists and is not expired
   */
  async has(key: string): Promise<boolean> {
    const entry = this.cache.get(key);
    if (!entry) {
      return false;
    }

    if (this.isExpired(entry)) {
      this.cache.delete(key);
      this.stats.misses++;
      this.stats.evictions++;
      this.updateStats();
      return false;
    }

    return true;
  }

  /**
   * Get cache statistics
   */
  getStats(): CacheStats {
    return { ...this.stats };
  }

  /**
   * Add invalidation rule
   */
  addInvalidationRule(rule: InvalidationRule): void {
    this.invalidationRules.push(rule);
  }

  /**
   * Remove invalidation rule
   */
  removeInvalidationRule(ruleId: string): boolean {
    const index = this.invalidationRules.findIndex(rule => rule.id === ruleId);
    if (index !== -1) {
      this.invalidationRules.splice(index, 1);
      return true;
    }
    return false;
  }

  /**
   * Apply invalidation rules
   */
  async applyInvalidationRules(): Promise<number> {
    let invalidatedCount = 0;
    const keysToInvalidate: string[] = [];

    for (const [key, entry] of this.cache.entries()) {
      for (const rule of this.invalidationRules) {
        let shouldInvalidate = false;

        // Pattern matching
        if (rule.pattern instanceof RegExp) {
          shouldInvalidate = rule.pattern.test(key);
        } else if (typeof rule.pattern === 'string') {
          shouldInvalidate = key.includes(rule.pattern);
        }

        // Tag matching
        if (!shouldInvalidate && rule.tags) {
          shouldInvalidate = rule.tags.some(tag => entry.tags.includes(tag));
        }

        // Custom condition
        if (!shouldInvalidate && rule.condition) {
          shouldInvalidate = rule.condition(key, entry);
        }

        // TTL override
        if (shouldInvalidate && rule.ttl) {
          entry.ttl = rule.ttl;
          shouldInvalidate = this.isExpired(entry);
        }

        if (shouldInvalidate) {
          keysToInvalidate.push(key);
          break; // Apply only one rule per entry
        }
      }
    }

    // Invalidate entries
    keysToInvalidate.forEach(key => {
      const entry = this.cache.get(key);
      if (entry) {
        this.stats.totalSize -= entry.size;
      }
      this.cache.delete(key);
      invalidatedCount++;
    });

    this.stats.evictions += invalidatedCount;
    this.updateStats();

    return invalidatedCount;
  }

  /**
   * Get entries by tag
   */
  async getByTag<T>(tag: string): Promise<Array<{ key: string; value: T }>> {
    const results: Array<{ key: string; value: T }> = [];

    for (const [key, entry] of this.cache.entries()) {
      if (entry.tags.includes(tag) && !this.isExpired(entry)) {
        results.push({
          key,
          value: this.decompressData(entry.data as T),
        });
      }
    }

    return results;
  }

  /**
   * Warm up cache with data
   */
  async warmUp<T>(entries: Array<{
    key: string;
    data: T;
    ttl?: number;
    tags?: string[];
  }>): Promise<void> {
    for (const entry of entries) {
      await this.set(entry.key, entry.data, {
        ttl: entry.ttl,
        tags: entry.tags,
      });
    }
  }

  /**
   * Export cache data
   */
  export(): Array<{
    key: string;
    data: unknown;
    metadata: Omit<CacheEntry<unknown>, 'data'>;
  }> {
    const exported = [];

    for (const [key, entry] of this.cache.entries()) {
      if (!this.isExpired(entry)) {
        exported.push({
          key,
          data: this.decompressData(entry.data),
          metadata: {
            createdAt: entry.createdAt,
            lastAccessed: entry.lastAccessed,
            accessCount: entry.accessCount,
            ttl: entry.ttl,
            tags: entry.tags,
            size: entry.size,
          },
        });
      }
    }

    return exported;
  }

  /**
   * Import cache data
   */
  async import(data: Array<{
    key: string;
    data: unknown;
    metadata: Omit<CacheEntry<unknown>, 'data'>;
  }>): Promise<void> {
    for (const item of data) {
      const entry: CacheEntry<unknown> = {
        data: this.compressData(item.data),
        ...item.metadata,
      };

      this.cache.set(item.key, entry);
    }

    this.updateStats();
  }

  /**
   * Destroy cache and cleanup resources
   */
  destroy(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
      this.cleanupTimer = null;
    }

    this.cache.clear();
    this.invalidationRules = [];
    this.stats = this.getEmptyStats();
  }

  /**
   * Private methods
   */

  private isExpired(entry: CacheEntry<unknown>): boolean {
    return Date.now() - entry.createdAt > entry.ttl;
  }

  private async ensureSpace(requiredSize: number): Promise<void> {
    // Check memory limit
    if (this.stats.totalMemory + requiredSize > this.config.maxMemory * 1024 * 1024) {
      await this.evictByMemory(requiredSize);
      return;
    }

    // Check size limit
    if (this.cache.size >= this.config.maxSize) {
      await this.evictByStrategy();
    }
  }

  private async evictByStrategy(): Promise<void> {
    switch (this.config.invalidationStrategy) {
    case 'lru':
      await this.evictLRU();
      break;
    case 'lfu':
      await this.evictLFU();
      break;
    case 'size':
      await this.evictBySize();
      break;
    case 'tag':
      await this.evictByTags();
      break;
    case 'ttl':
      await this.evictExpired();
      break;
    default:
      await this.evictLRU();
    }
  }

  private async evictByMemory(requiredSize: number): Promise<void> {
    const entries = Array.from(this.cache.entries());
    entries.sort((a, b) => {
      // Sort by least recently used
      return a[1].lastAccessed - b[1].lastAccessed;
    });

    let freedMemory = 0;
    for (const [key, entry] of entries) {
      this.cache.delete(key);
      this.stats.totalSize -= entry.size;
      this.stats.evictions++;
      freedMemory += entry.size;

      if (freedMemory >= requiredSize) {
        break;
      }
    }

    this.updateStats();
  }

  private async evictLRU(): Promise<void> {
    const entries = Array.from(this.cache.entries());
    entries.sort((a, b) => {
      return a[1].lastAccessed - b[1].lastAccessed;
    });

    // Remove 10% of entries
    const toRemove = Math.ceil(this.config.maxSize * 0.1);
    for (let i = 0; i < toRemove && i < entries.length; i++) {
      const [key, entry] = entries[i];
      this.cache.delete(key);
      this.stats.totalSize -= entry.size;
      this.stats.evictions++;
    }

    this.updateStats();
  }

  private async evictLFU(): Promise<void> {
    const entries = Array.from(this.cache.entries());
    entries.sort((a, b) => {
      return a[1].accessCount - b[1].accessCount;
    });

    // Remove 10% of entries
    const toRemove = Math.ceil(this.config.maxSize * 0.1);
    for (let i = 0; i < toRemove && i < entries.length; i++) {
      const [key, entry] = entries[i];
      this.cache.delete(key);
      this.stats.totalSize -= entry.size;
      this.stats.evictions++;
    }

    this.updateStats();
  }

  private async evictBySize(): Promise<void> {
    const entries = Array.from(this.cache.entries());
    entries.sort((a, b) => {
      return b[1].size - a[1].size; // Remove largest first
    });

    // Remove 10% of entries
    const toRemove = Math.ceil(this.config.maxSize * 0.1);
    for (let i = 0; i < toRemove && i < entries.length; i++) {
      const [key, entry] = entries[i];
      this.cache.delete(key);
      this.stats.totalSize -= entry.size;
      this.stats.evictions++;
    }

    this.updateStats();
  }

  private async evictByTags(): Promise<void> {
    // Remove entries with least used tags
    const tagCounts = new Map<string, number>();

    for (const entry of this.cache.values()) {
      for (const tag of entry.tags) {
        tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
      }
    }

    const sortedTags = Array.from(tagCounts.entries())
      .sort((a, b) => a[1] - b[1])
      .slice(0, 5); // Remove entries with 5 least used tags

    for (const [tag] of sortedTags) {
      await this.clear(undefined, [tag]);
    }
  }

  private async evictExpired(): Promise<void> {
    const expiredKeys: string[] = [];

    for (const [key, entry] of this.cache.entries()) {
      if (this.isExpired(entry)) {
        expiredKeys.push(key);
      }
    }

    for (const key of expiredKeys) {
      const entry = this.cache.get(key);
      if (entry) {
        this.stats.totalSize -= entry.size;
      }
      this.cache.delete(key);
      this.stats.evictions++;
    }

    this.updateStats();
  }

  private startCleanupTimer(): void {
    this.cleanupTimer = setInterval(() => {
      this.evictExpired();
      this.applyInvalidationRules();
    }, this.config.cleanupInterval);
  }

  private updateStats(): void {
    this.stats.totalMemory = this.stats.totalSize;
    this.stats.hitRate = this.stats.hits + this.stats.misses > 0
      ? (this.stats.hits / (this.stats.hits + this.stats.misses)) * 100
      : 0;

    // Update tag statistics
    const tagCounts = new Map<string, number>();
    for (const entry of this.cache.values()) {
      for (const tag of entry.tags) {
        tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
      }
    }
    this.stats.entriesByTag = Object.fromEntries(tagCounts);
  }

  private updateAverageAccessTime(accessTime: number): void {
    const totalOperations = this.stats.hits + this.stats.misses;
    this.stats.averageAccessTime =
      (this.stats.averageAccessTime * (totalOperations - 1) + accessTime) / totalOperations;
  }

  private estimateSize(data: unknown): number {
    // Rough estimation of data size in bytes
    if (data === null || data === undefined) {
      return 0;
    }

    if (typeof data === 'string') {
      return data.length * 2; // UTF-16
    }

    if (typeof data === 'number') {
      return 8; // 64-bit number
    }

    if (typeof data === 'boolean') {
      return 4;
    }

    if (typeof data === 'object') {
      return JSON.stringify(data).length * 2;
    }

    return 100; // Default estimation
  }

  private compressData<T>(data: T): T | CompressedData {
    if (!this.compressionEnabled) {
      return data;
    }

    // Simple compression simulation - in real implementation, use actual compression
    try {
      const serialized = JSON.stringify(data);
      if (serialized.length > 1000) {
        // For large data, simulate compression
        return { _compressed: true, data: serialized.substring(0, 100) } as CompressedData;
      }
    } catch (_error) {
      // Fallback to original data
    }

    return data;
  }

  private decompressData<T>(data: T): T {
    if (!this.compressionEnabled) {
      return data;
    }

    // Check if data is compressed
    if (data && typeof data === 'object' && (data as unknown as CompressedData)._compressed) {
      try {
        // Simulate decompression
        return JSON.parse((data as unknown as CompressedData).data) as T;
      } catch (_error) {
        // Fallback to original data
        return data;
      }
    }

    return data;
  }

  private getDefaultConfig(config: Partial<CacheConfig>): CacheConfig {
    return {
      maxSize: 1000,
      maxMemory: 512, // 512MB
      defaultTTL: 300000, // 5 minutes
      cleanupInterval: 60000, // 1 minute
      enableStats: true,
      invalidationStrategy: 'lru',
      enableCompression: false,
      ...config,
    };
  }

  private getEmptyStats(): CacheStats {
    return {
      hits: 0,
      misses: 0,
      sets: 0,
      deletes: 0,
      evictions: 0,
      totalSize: 0,
      totalMemory: 0,
      hitRate: 0,
      averageAccessTime: 0,
      entriesByTag: {},
    };
  }
}

// Export singleton instance
export const advancedCache = new AdvancedCache();
