// src/services/performanceService.ts
// Performance monitoring and optimization service

export interface PerformanceMetrics {
  // Core Web Vitals
  fcp?: number; // First Contentful Paint
  lcp?: number; // Largest Contentful Paint
  fid?: number; // First Input Delay
  cls?: number; // Cumulative Layout Shift
  ttfb?: number; // Time to First Byte

  // Custom metrics
  bundleSize?: number;
  renderTime?: number;
  memoryUsage?: number;
  apiResponseTime?: number;

  // User engagement
  pageViews?: number;
  sessionDuration?: number;
  bounceRate?: number;
}

export interface PerformanceConfig {
  enableCoreWebVitals?: boolean;
  enableBundleAnalysis?: boolean;
  enableMemoryMonitoring?: boolean;
  enableUserTracking?: boolean;
  reportingEndpoint?: string;
  sampleRate?: number;
}

class PerformanceService {
  private config: PerformanceConfig;
  private metrics: PerformanceMetrics = {};
  private observers: PerformanceObserver[] = [];
  private isInitialized = false;

  constructor(config: PerformanceConfig = {}) {
    this.config = {
      enableCoreWebVitals: true,
      enableBundleAnalysis: true,
      enableMemoryMonitoring: true,
      enableUserTracking: false,
      sampleRate: 1.0,
      ...config,
    };
  }

  async initialize(): Promise<void> {
    if (this.isInitialized || typeof window === 'undefined') {
      return;
    }

    try {
      // Initialize Core Web Vitals monitoring
      if (this.config.enableCoreWebVitals) {
        this.initializeCoreWebVitals();
      }

      // Initialize bundle size monitoring
      if (this.config.enableBundleAnalysis) {
        this.initializeBundleAnalysis();
      }

      // Initialize memory monitoring
      if (this.config.enableMemoryMonitoring) {
        this.initializeMemoryMonitoring();
      }

      // Initialize user tracking
      if (this.config.enableUserTracking) {
        this.initializeUserTracking();
      }

      this.isInitialized = true;
      console.log('Performance service initialized successfully');
    } catch (error) {
      console.error('Failed to initialize performance service:', error);
    }
  }

  private initializeCoreWebVitals(): void {
    // First Contentful Paint
    this.observePerformanceEntry('paint', (entries) => {
      const fcpEntry = entries.find((entry) => entry.name === 'first-contentful-paint');
      if (fcpEntry) {
        this.metrics.fcp = fcpEntry.startTime;
      }
    });

    // Largest Contentful Paint
    this.observePerformanceEntry('largest-contentful-paint', (entries) => {
      const lcpEntry = entries[entries.length - 1]; // Get the last LCP entry
      if (lcpEntry) {
        this.metrics.lcp = lcpEntry.startTime;
      }
    });

    // First Input Delay
    this.observePerformanceEntry('first-input', (entries) => {
      const fidEntry = entries[0];
      if (fidEntry && 'processingStart' in fidEntry) {
        this.metrics.fid = (fidEntry as PerformanceEventTiming & { processingStart?: number }).processingStart - fidEntry.startTime;
      }
    });

    // Cumulative Layout Shift
    let clsValue = 0;
    this.observePerformanceEntry('layout-shift', (entries) => {
      for (const entry of entries) {
        if (!(entry as PerformanceEntry & { hadRecentInput?: boolean; value?: number }).hadRecentInput) {
          clsValue += (entry as PerformanceEntry & { value?: number }).value || 0;
        }
      }
      this.metrics.cls = clsValue;
    });

    // Time to First Byte
    if ('navigation' in performance) {
      const navEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navEntry) {
        this.metrics.ttfb = navEntry.responseStart - navEntry.requestStart;
      }
    }
  }

  private initializeBundleAnalysis(): void {
    // Monitor bundle size and loading performance
    if ('navigation' in performance) {
      const navEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;

      // Calculate approximate bundle size based on transferred data
      const transferSize = navEntry.transferSize || 0;
      this.metrics.bundleSize = transferSize;

      // Calculate render time
      this.metrics.renderTime = navEntry.loadEventEnd - navEntry.loadEventStart;
    }
  }

  private initializeMemoryMonitoring(): void {
    // Monitor memory usage (if available)
    if ('memory' in performance) {
      const memory = (performance as Performance & { memory?: { usedJSHeapSize: number } }).memory;
      this.metrics.memoryUsage = memory?.usedJSHeapSize || 0;
    }
  }

  private initializeUserTracking(): void {
    // Track page views
    this.metrics.pageViews = 1;

    // Track session duration
    const sessionStart = Date.now();

    // Update session duration on page unload
    const updateSessionDuration = () => {
      this.metrics.sessionDuration = Date.now() - sessionStart;
      this.reportMetrics();
    };

    window.addEventListener('beforeunload', updateSessionDuration);
  }

  private observePerformanceEntry(type: string, callback: (entries: PerformanceEntry[]) => void): void {
    try {
      const observer = new PerformanceObserver((list) => {
        callback(list.getEntries());
      });

      observer.observe({ type, buffered: true });
      this.observers.push(observer);
    } catch (error) {
      console.warn(`Failed to observe ${type}:`, error);
    }
  }

  getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  async reportMetrics(): Promise<void> {
    if (this.config.reportingEndpoint && Math.random() < (this.config.sampleRate || 1.0)) {
      try {
        await fetch(this.config.reportingEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            timestamp: new Date().toISOString(),
            url: window.location.href,
            userAgent: navigator.userAgent,
            metrics: this.metrics,
          }),
        });
      } catch (error) {
        console.warn('Failed to report metrics:', error);
      }
    }
  }

  // Performance optimization methods
  optimizeImages(): void {
    // Lazy load images that are not in viewport
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          const src = img.dataset.src;
          if (src) {
            img.src = src;
            img.removeAttribute('data-src');
            imageObserver.unobserve(img);
          }
        }
      });
    });

    images.forEach((img) => imageObserver.observe(img));
  }

  optimizeFonts(): void {
    // Preload critical fonts
    const fontLinks = document.querySelectorAll('link[rel="preload"][as="font"]');
    fontLinks.forEach((link) => {
      const font = new FontFace('custom-font', `url(${(link as HTMLLinkElement).href})`);
      font.load().then(() => {
        document.fonts.add(font);
      });
    });
  }

  optimizeBundle(): void {
    // Dynamic import for non-critical components
    // This would be implemented in specific components
    console.log('Bundle optimization suggestions:');
    console.log('- Use dynamic imports for heavy components');
    console.log('- Implement code splitting for routes');
    console.log('- Use tree shaking for unused code');
  }

  // Performance scoring
  getPerformanceScore(): number {
    const metrics = this.getMetrics();
    let score = 100;

    // Deduct points for poor Core Web Vitals
    if (metrics.fcp && metrics.fcp > 1800) {
      score -= 10;
    } // Poor FCP
    if (metrics.lcp && metrics.lcp > 2500) {
      score -= 15;
    } // Poor LCP
    if (metrics.fid && metrics.fid > 100) {
      score -= 10;
    } // Poor FID
    if (metrics.cls && metrics.cls > 0.25) {
      score -= 15;
    } // Poor CLS
    if (metrics.ttfb && metrics.ttfb > 800) {
      score -= 10;
    } // Poor TTFB

    // Deduct points for large bundle size
    if (metrics.bundleSize && metrics.bundleSize > 1024 * 1024) {
      score -= 10;
    } // > 1MB

    // Deduct points for high memory usage
    if (metrics.memoryUsage && metrics.memoryUsage > 50 * 1024 * 1024) {
      score -= 10;
    } // > 50MB

    return Math.max(0, score);
  }

  cleanup(): void {
    // Clean up performance observers
    this.observers.forEach((observer) => observer.disconnect());
    this.observers = [];
    this.isInitialized = false;
  }
}

// Singleton instance
let performanceService: PerformanceService | null = null;

export function getPerformanceService(config?: PerformanceConfig): PerformanceService {
  if (!performanceService) {
    performanceService = new PerformanceService(config);
  }
  return performanceService;
}

// Initialize performance monitoring
export async function initializePerformanceMonitoring(config?: PerformanceConfig): Promise<void> {
  const service = getPerformanceService(config);
  await service.initialize();
}

// Performance optimization utilities
export const performanceUtils = {
  // Debounce function for performance
  debounce<T extends (...args: unknown[]) => unknown>(
    func: T,
    wait: number,
  ): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  },

  // Throttle function for performance
  throttle<T extends (...args: unknown[]) => unknown>(
    func: T,
    limit: number,
  ): (...args: Parameters<T>) => void {
    let inThrottle: boolean;
    return (...args: Parameters<T>) => {
      if (!inThrottle) {
        func(...args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  },

  // Memoize function for performance
  memoize<T extends (...args: unknown[]) => unknown>(func: T): T {
    const cache = new Map();
    return ((...args: Parameters<T>) => {
      const key = JSON.stringify(args);
      if (cache.has(key)) {
        return cache.get(key);
      }
      const result = func(...args);
      cache.set(key, result);
      return result;
    }) as T;
  },
};

export { PerformanceService };
