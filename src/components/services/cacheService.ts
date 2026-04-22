// src/services/cacheService.ts
// Service worker cache management

export interface CacheConfig {
  version: string;
  cacheName: string;
  maxAge: number; // in milliseconds
  maxSize: number; // in bytes
  strategies: CacheStrategy[];
}

export interface CacheStrategy {
  pattern: string | RegExp;
  strategy: 'cache-first' | 'network-first' | 'stale-while-revalidate' | 'cache-only' | 'network-only';
  maxAge?: number;
  maxEntries?: number;
}

export interface CacheEntry {
  url: string;
  timestamp: number;
  size: number;
  response: Response;
  headers: Record<string, string>;
}

class CacheService {
  private config: CacheConfig;
  private cache: Map<string, CacheEntry> = new Map();
  private isInitialized = false;

  constructor(config: CacheConfig) {
    this.config = config;
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    try {
      // Load existing cache from localStorage if available
      if (typeof window !== 'undefined' && 'localStorage' in window) {
        const cachedData = localStorage.getItem(`cache_${this.config.cacheName}`);
        if (cachedData) {
          const parsed = JSON.parse(cachedData);
          this.cache = new Map(parsed.entries);
        }
      }

      // Clean up expired entries
      await this.cleanupExpiredEntries();

      this.isInitialized = true;
      console.log(`Cache service initialized: ${this.config.cacheName}`);
    } catch (error) {
      console.error('Failed to initialize cache service:', error);
    }
  }

  async get(url: string): Promise<Response | null> {
    const entry = this.cache.get(url);

    if (!entry) {
      return null;
    }

    // Check if entry is expired
    if (Date.now() - entry.timestamp > this.config.maxAge) {
      this.cache.delete(url);
      await this.persistCache();
      return null;
    }

    // Recreate Response object
    const response = new Response(entry.response.body, {
      status: entry.response.status,
      statusText: entry.response.statusText,
      headers: new Headers(entry.headers),
    });

    return response;
  }

  async put(url: string, response: Response): Promise<void> {
    // Check cache size limit
    const responseClone = response.clone();
    const buffer = await responseClone.arrayBuffer();
    const size = buffer.byteLength;

    if (size > this.config.maxSize) {
      console.warn(`Response too large for cache: ${size} bytes`);
      return;
    }

    // Remove oldest entries if cache is full
    await this.ensureCacheSize(size);

    const entry: CacheEntry = {
      url,
      timestamp: Date.now(),
      size,
      response: response,
      headers: Object.fromEntries(response.headers.entries()),
    };

    this.cache.set(url, entry);
    await this.persistCache();
  }

  async delete(url: string): Promise<boolean> {
    const deleted = this.cache.delete(url);
    if (deleted) {
      await this.persistCache();
    }
    return deleted;
  }

  async matchStrategy(url: string): Promise<Response | null> {
    const strategy = this.findStrategy(url);

    switch (strategy?.strategy) {
    case 'cache-first':
      return this.cacheFirst(url);

    case 'network-first':
      return this.networkFirst(url);

    case 'stale-while-revalidate':
      return this.staleWhileRevalidate(url);

    case 'cache-only':
      return this.get(url);

    case 'network-only':
      return this.networkOnly(url);

    default:
      return this.networkFirst(url);
    }
  }

  private async cacheFirst(url: string): Promise<Response | null> {
    // Try cache first
    const cachedResponse = await this.get(url);
    if (cachedResponse) {
      return cachedResponse;
    }

    // Fallback to network
    return this.networkOnly(url);
  }

  private async networkFirst(url: string): Promise<Response | null> {
    try {
      // Try network first
      const response = await fetch(url);

      if (response.ok) {
        await this.put(url, response.clone());
        return response;
      }
    } catch (error) {
      console.warn('Network request failed, trying cache:', error);
    }

    // Fallback to cache
    return this.get(url);
  }

  private async staleWhileRevalidate(url: string): Promise<Response | null> {
    // Get cached version immediately
    const cachedResponse = await this.get(url);

    // Revalidate in background
    this.revalidateInBackground(url);

    return cachedResponse;
  }

  private async networkOnly(url: string): Promise<Response | null> {
    try {
      const response = await fetch(url);
      return response;
    } catch (error) {
      console.error('Network request failed:', error);
      return null;
    }
  }

  private async revalidateInBackground(url: string): Promise<void> {
    try {
      const response = await fetch(url);
      if (response.ok) {
        await this.put(url, response.clone());
      }
    } catch (error) {
      console.warn('Background revalidation failed:', error);
    }
  }

  private findStrategy(url: string): CacheStrategy | undefined {
    return this.config.strategies.find((strategy) => {
      if (typeof strategy.pattern === 'string') {
        return url.includes(strategy.pattern);
      } else {
        return strategy.pattern.test(url);
      }
    });
  }

  private async ensureCacheSize(newEntrySize: number): Promise<void> {
    let currentSize = Array.from(this.cache.values()).reduce((total, entry) => total + entry.size, 0);

    while (currentSize + newEntrySize > this.config.maxSize && this.cache.size > 0) {
      // Remove oldest entry
      const entries = Array.from(this.cache.entries());
      const oldestEntry = entries[0];
      if (oldestEntry) {
        const [url, entry] = oldestEntry;
        this.cache.delete(url);
        currentSize -= entry.size;
      } else {
        break;
      }
    }
  }

  private async cleanupExpiredEntries(): Promise<void> {
    const now = Date.now();
    const expiredEntries: string[] = [];

    const entries = Array.from(this.cache.entries());
    for (const [url, entry] of entries) {
      if (now - entry.timestamp > this.config.maxAge) {
        expiredEntries.push(url);
      }
    }

    for (const url of expiredEntries) {
      this.cache.delete(url);
    }

    if (expiredEntries.length > 0) {
      await this.persistCache();
    }
  }

  private async persistCache(): Promise<void> {
    if (typeof window !== 'undefined' && 'localStorage' in window) {
      try {
        const cacheData = {
          entries: Array.from(this.cache.entries()),
          version: this.config.version,
          timestamp: Date.now(),
        };
        localStorage.setItem(`cache_${this.config.cacheName}`, JSON.stringify(cacheData));
      } catch (error) {
        console.warn('Failed to persist cache:', error);
      }
    }
  }

  async clear(): Promise<void> {
    this.cache.clear();
    await this.persistCache();
  }

  getStats(): {
    size: number;
    entries: number;
    oldestEntry: number | null;
    newestEntry: number | null;
    } {
    const entries = Array.from(this.cache.values()) as CacheEntry[];
    const size = entries.reduce((total, entry) => total + entry.size, 0);

    const timestamps = entries.map((entry) => entry.timestamp);
    const oldestEntry = timestamps.length > 0 ? Math.min(...timestamps) : null;
    const newestEntry = timestamps.length > 0 ? Math.max(...timestamps) : null;

    return {
      size,
      entries: this.cache.size,
      oldestEntry,
      newestEntry,
    };
  }

  async preloadResources(urls: string[]): Promise<void> {
    const preloadPromises = urls.map(async (url) => {
      try {
        const response = await fetch(url);
        if (response.ok) {
          await this.put(url, response);
        }
      } catch (error) {
        console.warn(`Failed to preload ${url}:`, error);
      }
    });

    await Promise.allSettled(preloadPromises);
  }

  cleanup(): void {
    this.cache.clear();
    this.isInitialized = false;
  }
}

// Default cache configuration
const defaultCacheConfig: CacheConfig = {
  version: '1.0.0',
  cacheName: 'maroon-traceability-cache',
  maxAge: 24 * 60 * 60 * 1000, // 24 hours
  maxSize: 50 * 1024 * 1024, // 50MB
  strategies: [
    {
      pattern: '/api/',
      strategy: 'network-first',
      maxAge: 5 * 60 * 1000, // 5 minutes
    },
    {
      pattern: /\.(js|css|png|jpg|jpeg|svg|woff2)$/,
      strategy: 'cache-first',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    },
    {
      pattern: '/_next/static/',
      strategy: 'cache-first',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    },
    {
      pattern: '/',
      strategy: 'stale-while-revalidate',
      maxAge: 10 * 60 * 1000, // 10 minutes
    },
  ],
};

// Singleton instance
let cacheService: CacheService | null = null;

export function getCacheService(config?: Partial<CacheConfig>): CacheService {
  if (!cacheService) {
    const finalConfig = { ...defaultCacheConfig, ...config };
    cacheService = new CacheService(finalConfig);
  }
  return cacheService;
}

// Initialize cache service
export async function initializeCacheService(config?: Partial<CacheConfig>): Promise<CacheService> {
  const service = getCacheService(config);
  await service.initialize();
  return service;
}

// Cache utilities
export const cacheUtils = {
  // Generate cache key
  generateKey(url: string, params?: Record<string, unknown>): string {
    const searchParams = params ? new URLSearchParams(
      Object.fromEntries(
        Object.entries(params).filter(([_, value]) => value !== undefined && value !== null)
          .map(([key, value]) => [key, String(value)]),
      ),
    ).toString() : '';
    return searchParams ? `${url}?${searchParams}` : url;
  },

  // Check if response is cacheable
  isCacheable(response: Response): boolean {
    return response.ok &&
           response.status === 200 &&
           !response.headers.get('cache-control')?.includes('no-store');
  },

  // Extract cache duration from headers
  getCacheDuration(response: Response): number {
    const cacheControl = response.headers.get('cache-control');
    if (!cacheControl) {
      return 0;
    }

    const maxAgeMatch = cacheControl.match(/max-age=(\d+)/);
    if (maxAgeMatch) {
      return parseInt(maxAgeMatch[1], 10) * 1000;
    }

    return 0;
  },
};

export { CacheService };
