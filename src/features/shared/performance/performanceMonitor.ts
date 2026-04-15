// Performance Monitoring System

import { performance } from 'perf_hooks';

import React from 'react';

// Performance metrics interface
export interface PerformanceMetrics {
  // Core Web Vitals
  fcp?: number; // First Contentful Paint
  lcp?: number; // Largest Contentful Paint
  fid?: number; // First Input Delay
  cls?: number; // Cumulative Layout Shift
  ttfb?: number; // Time to First Byte
  
  // Custom metrics
  pageLoadTime?: number;
  componentRenderTime?: number;
  apiResponseTime?: number;
  bundleLoadTime?: number;
  
  // Memory metrics
  memoryUsage?: number;
  heapSize?: number;
  
  // Network metrics
  resourceLoadTime?: number;
  totalResources?: number;
  totalSize?: number;
  
  // User interaction metrics
  interactionTime?: number;
  scrollPerformance?: number;
  clickResponseTime?: number;
}

// Performance entry interface
export interface PerformanceEntry {
  name: string;
  startTime: number;
  duration: number;
  type: 'navigation' | 'resource' | 'paint' | 'layout-shift' | 'event' | 'measure';
  value?: number;
}

// Performance monitoring configuration
export interface PerformanceConfig {
  enabled: boolean;
  sampleRate: number;
  maxEntries: number;
  reportEndpoint?: string;
  reportInterval: number;
  enableWebVitals: boolean;
  enableCustomMetrics: boolean;
  enableMemoryMonitoring: boolean;
  enableNetworkMonitoring: boolean;
}

// Default performance configuration
const DEFAULT_CONFIG: PerformanceConfig = {
  enabled: true,
  sampleRate: 1.0,
  maxEntries: 100,
  reportInterval: 30000, // 30 seconds
  enableWebVitals: true,
  enableCustomMetrics: true,
  enableMemoryMonitoring: true,
  enableNetworkMonitoring: true,
};

// Performance Monitor Class
export class PerformanceMonitor {
  private config: PerformanceConfig;
  private entries: PerformanceEntry[] = [];
  private observers: PerformanceObserver[] = [];
  private metrics: PerformanceMetrics = {};
  private isMonitoring = false;
  private reportTimer?: NodeJS.Timeout;

  constructor(config: Partial<PerformanceConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  // Start performance monitoring
  start(): void {
    if (this.isMonitoring || !this.config.enabled) {
      return;
    }

    this.isMonitoring = true;
    this.setupObservers();
    this.startReporting();
    
    // Record initial metrics
    this.recordNavigationMetrics();
    this.recordMemoryMetrics();
  }

  // Stop performance monitoring
  stop(): void {
    if (!this.isMonitoring) {
      return;
    }

    this.isMonitoring = false;
    this.disconnectObservers();
    
    if (this.reportTimer) {
      clearInterval(this.reportTimer);
      this.reportTimer = undefined;
    }
  }

  // Setup performance observers
  private setupObservers(): void {
    if (typeof window === 'undefined') {
      return;
    }

    // Web Vitals observer
    if (this.config.enableWebVitals) {
      this.setupWebVitalsObserver();
    }

    // Resource loading observer
    if (this.config.enableNetworkMonitoring) {
      this.setupResourceObserver();
    }

    // Layout shift observer
    if (this.config.enableWebVitals) {
      this.setupLayoutShiftObserver();
    }

    // Event timing observer
    if (this.config.enableCustomMetrics) {
      this.setupEventTimingObserver();
    }
  }

  // Setup Web Vitals observer
  private setupWebVitalsObserver(): void {
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.name === 'first-contentful-paint') {
            this.metrics.fcp = entry.startTime;
          } else if (entry.name === 'largest-contentful-paint') {
            this.metrics.lcp = entry.startTime;
          }
        });
      });
      
      observer.observe({ entryTypes: ['paint'] });
      this.observers.push(observer);
    } catch (error) {
      console.warn('Web Vitals observer not supported:', error);
    }
  }

  // Setup resource loading observer
  private setupResourceObserver(): void {
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          this.addEntry({
            name: entry.name,
            startTime: entry.startTime,
            duration: entry.duration,
            type: 'resource',
          });
        });
      });
      
      observer.observe({ entryTypes: ['resource'] });
      this.observers.push(observer);
    } catch (error) {
      console.warn('Resource observer not supported:', error);
    }
  }

  // Setup layout shift observer
  private setupLayoutShiftObserver(): void {
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          const layoutEntry = entry as unknown as PerformanceEntry & { hadRecentInput?: boolean; value?: number };
          if (!layoutEntry.hadRecentInput && layoutEntry.value) {
            this.metrics.cls = (this.metrics.cls || 0) + layoutEntry.value;
          }
        });
      });
      
      observer.observe({ entryTypes: ['layout-shift'] });
      this.observers.push(observer);
    } catch (error) {
      console.warn('Layout shift observer not supported:', error);
    }
  }

  // Setup event timing observer
  private setupEventTimingObserver(): void {
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          this.addEntry({
            name: entry.name,
            startTime: entry.startTime,
            duration: entry.duration,
            type: 'event',
            value: (entry as unknown as PerformanceEntry & { processingStart?: number }).processingStart,
          });
        });
      });
      
      observer.observe({ entryTypes: ['event'] });
      this.observers.push(observer);
    } catch (error) {
      console.warn('Event timing observer not supported:', error);
    }
  }

  // Record navigation metrics
  private recordNavigationMetrics(): void {
    if (typeof window === 'undefined') {
      return;
    }

    const navigationEntries = (performance.getEntriesByType as (type: string) => PerformanceNavigationTiming[])('navigation');
    const navigation = navigationEntries[0];
    if (navigation) {
      this.metrics.pageLoadTime = navigation.loadEventEnd - navigation.fetchStart;
      this.metrics.ttfb = navigation.responseStart - navigation.requestStart;
    }
  }

  // Record memory metrics
  private recordMemoryMetrics(): void {
    if (this.config.enableMemoryMonitoring && 'memory' in performance) {
      const memory = (performance as { memory?: { usedJSHeapSize: number; totalJSHeapSize: number } }).memory;
      if (memory) {
        this.metrics.memoryUsage = memory.usedJSHeapSize;
        this.metrics.heapSize = memory.totalJSHeapSize;
      }
    }
  }

  // Add performance entry
  addEntry(entry: PerformanceEntry): void {
    if (this.entries.length >= this.config.maxEntries) {
      this.entries.shift();
    }
    this.entries.push(entry);
  }

  // Start periodic reporting
  private startReporting(): void {
    if (this.config.reportEndpoint) {
      this.reportTimer = setInterval(() => {
        this.reportMetrics();
      }, this.config.reportInterval);
    }
  }

  // Report metrics to server
  private async reportMetrics(): Promise<void> {
    if (!this.config.reportEndpoint) {
      return;
    }

    try {
      const metrics = this.getCurrentMetrics();
      const response = await fetch(this.config.reportEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(metrics),
      });

      if (!response.ok) {
        console.warn('Failed to report performance metrics');
      }
    } catch (error) {
      console.warn('Error reporting performance metrics:', error);
    }
  }

  // Get current metrics
  getCurrentMetrics(): PerformanceMetrics {
    this.recordMemoryMetrics();
    
    // Calculate additional metrics
    const resourceEntries = this.entries.filter(e => e.type === 'resource');
    const totalResources = resourceEntries.length;
    const totalSize = resourceEntries.reduce((sum, entry) => sum + entry.duration, 0);
    const avgLoadTime = totalResources > 0 ? totalSize / totalResources : 0;

    return {
      ...this.metrics,
      totalResources,
      resourceLoadTime: avgLoadTime,
    };
  }

  // Disconnect all observers
  private disconnectObservers(): void {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
  }

  // Measure custom performance
  measure(name: string, fn: () => void | Promise<void>): void | Promise<void> {
    const startTime = performance.now();
    
    const result = fn();
    
    if (result instanceof Promise) {
      return result.then(() => {
        const endTime = performance.now();
        this.addEntry({
          name,
          startTime,
          duration: endTime - startTime,
          type: 'measure',
        });
      });
    } else {
      const endTime = performance.now();
      this.addEntry({
        name,
        startTime,
        duration: endTime - startTime,
        type: 'measure',
      });
    }
  }

  // Mark performance point
  mark(name: string): void {
    performance.mark(name);
  }

  // Measure between marks
  measureBetween(name: string, startMark: string, endMark: string): void {
    try {
      performance.measure(name, startMark, endMark);
      const measure = performance.getEntriesByName(name, 'measure')[0];
      if (measure) {
        this.addEntry({
          name,
          startTime: measure.startTime,
          duration: measure.duration,
          type: 'measure',
        });
      }
    } catch (error) {
      console.warn('Failed to measure between marks:', error);
    }
  }

  // Get performance entries
  getEntries(type?: PerformanceEntry['type']): PerformanceEntry[] {
    if (type) {
      return this.entries.filter(entry => entry.type === type);
    }
    return [...this.entries];
  }

  // Clear entries
  clearEntries(): void {
    this.entries = [];
  }

  // Get performance summary
  getSummary(): {
    metrics: PerformanceMetrics;
    entries: PerformanceEntry[];
    isMonitoring: boolean;
    } {
    return {
      metrics: this.getCurrentMetrics(),
      entries: this.getEntries(),
      isMonitoring: this.isMonitoring,
    };
  }
}

// Global performance monitor instance
export const performanceMonitor = new PerformanceMonitor();

// Performance monitoring hooks
export function usePerformanceMonitor(config?: Partial<PerformanceConfig>) {
  const monitor = React.useMemo(() => new PerformanceMonitor(config), [config]);
  
  React.useEffect(() => {
    monitor.start();
    return () => monitor.stop();
  }, [monitor]);

  return monitor;
}

// Performance decorator for components
export function withPerformanceMonitoring<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  componentName?: string,
): React.ComponentType<P> {
  const displayName = componentName || WrappedComponent.displayName || WrappedComponent.name || 'Component';
  
  return function PerformanceMonitoredComponent(props: P) {
    const monitor = React.useMemo(() => new PerformanceMonitor(), []);
    
    React.useEffect(() => {
      monitor.start();
      return () => monitor.stop();
    }, [monitor]);

    React.useEffect(() => {
      monitor.measure(`${displayName}-render`, () => {
        // Component render happens here
      });
    }, [monitor]); // displayName is stable and doesn't need to be a dependency

    return React.createElement(WrappedComponent, props);
  };
}

// Performance utilities
export const performanceUtils = {
  // Measure function execution time
  measureAsync: async <T>(name: string, fn: () => Promise<T>): Promise<T> => {
    const start = performance.now();
    const result = await fn();
    const end = performance.now();
    
    performanceMonitor.addEntry({
      name,
      startTime: start,
      duration: end - start,
      type: 'measure',
    });
    
    return result;
  },

  // Measure synchronous function execution time
  measure: <T>(name: string, fn: () => T): T => {
    const start = performance.now();
    const result = fn();
    const end = performance.now();
    
    performanceMonitor.addEntry({
      name,
      startTime: start,
      duration: end - start,
      type: 'measure',
    });
    
    return result;
  },

  // Create performance mark
  mark: (name: string) => {
    performanceMonitor.mark(name);
  },

  // Measure between marks
  measureBetween: (name: string, startMark: string, endMark: string) => {
    performanceMonitor.measureBetween(name, startMark, endMark);
  },

  // Get current performance metrics
  getMetrics: () => performanceMonitor.getCurrentMetrics(),

  // Get performance summary
  getSummary: () => performanceMonitor.getSummary(),
};
