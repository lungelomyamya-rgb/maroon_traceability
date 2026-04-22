// Code Splitting Components and Utilities

import React, { Suspense, lazy } from 'react';
import { performanceMonitor } from './performanceMonitor';

// Loading component for code splitting
export interface LoadingFallbackProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const LoadingFallback: React.FC<LoadingFallbackProps> = ({
  message = 'Loading...',
  size = 'md',
  className = '',
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className={`flex flex-col items-center justify-center p-4 ${className}`}>
      <div className={`animate-spin rounded-full border-2 border-gray-300 border-t-blue-600 ${sizeClasses[size]}`} />
      {message && (
        <p className="mt-2 text-sm text-gray-600">{message}</p>
      )}
    </div>
  );
};

// Error boundary for lazy loaded components
export interface LazyErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  onError?: (error: Error) => void;
}

export class LazyErrorBoundary extends React.Component<
  LazyErrorBoundaryProps,
  { hasError: boolean; error: Error | null }
> {
  constructor(props: LazyErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Lazy loading error:', error, errorInfo);
    this.props.onError?.(error);

    // Record error in performance monitor
    performanceMonitor.addEntry({
      name: 'lazy-loading-error',
      startTime: Date.now(),
      duration: 0,
      type: 'event',
    });
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <div className="text-red-500 mb-4">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13 7c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Failed to load component
          </h3>
          <p className="text-gray-600 mb-4">
            {this.state.error?.message || 'An error occurred while loading this component.'}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Lazy loading wrapper with performance monitoring
export interface LazyWrapperProps {
  loader: () => Promise<{ default: React.ComponentType<Record<string, unknown>> }>;
  fallback?: React.ReactNode;
  errorFallback?: React.ReactNode;
  preload?: boolean;
  delay?: number;
  className?: string;
}

export const LazyWrapper: React.FC<LazyWrapperProps> = ({
  loader,
  fallback = <LoadingFallback />,
  errorFallback,
  preload = false,
  delay = 200,
  className: _className,
}) => {
  const [Component, setComponent] = React.useState<React.ComponentType<Record<string, unknown>> | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);

  // Lazy component
  const LazyComponent = React.useMemo(() => lazy(loader), [loader]);

  // Preload component if requested
  React.useEffect(() => {
    if (preload) {
      const timer = setTimeout(() => {
        setIsLoading(true);
        loader()
          .then(module => {
            setComponent(() => module.default);
            setIsLoading(false);
          })
          .catch(err => {
            setError(err);
            setIsLoading(false);
          });
      }, delay);

      return () => clearTimeout(timer);
    }
    return undefined;
  }, [preload, loader, delay]);

  // Record loading performance
  React.useEffect(() => {
    if (isLoading) {
      performanceMonitor.mark('lazy-component-start');
    }
  }, [isLoading]);

  if (error) {
    return (
      <LazyErrorBoundary
        fallback={errorFallback}
        onError={(err) => setError(err)}
      >
        <div className="text-red-500 p-4">
          Failed to load component: {error.message}
        </div>
      </LazyErrorBoundary>
    );
  }

  return (
    <LazyErrorBoundary>
      <Suspense fallback={fallback}>
        {Component ? <Component /> : <LazyComponent />}
      </Suspense>
    </LazyErrorBoundary>
  );
};

// Lazy loading utilities for different feature areas
export const createLazyComponent = (importFunc: () => Promise<{ default: React.ComponentType<Record<string, unknown>> }>) => {
  const LazyComponent = lazy(importFunc);

  return (props: Record<string, unknown>) => (
    <Suspense fallback={<LoadingFallback />}>
      <LazyComponent {...props} />
    </Suspense>
  );
};

// Route-based code splitting utilities
export const createLazyRoute = <T extends React.ComponentType<Record<string, unknown>>>(
  importFunc: () => Promise<{ default: T }>,
  fallback?: React.ReactNode,
) => {
  const LazyComponent = lazy(importFunc);

  return (props: Record<string, unknown>) => (
    <LazyErrorBoundary>
      <Suspense fallback={fallback || <LoadingFallback />}>
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        <LazyComponent {...(props as any)} />
      </Suspense>
    </LazyErrorBoundary>
  );
};

// Intersection Observer for lazy loading
export const useIntersectionObserver = (
  options: IntersectionObserverInit = {},
) => {
  const [isIntersecting, setIsIntersecting] = React.useState(false);
  const [hasIntersected, setHasIntersected] = React.useState(false);
  const elementRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const element = elementRef.current;
    if (!element) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
        if (entry.isIntersecting && !hasIntersected) {
          setHasIntersected(true);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
        ...options,
      },
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [hasIntersected, options]);

  return { elementRef, isIntersecting, hasIntersected };
};

// Lazy loading component with intersection observer
export const LazyIntersection: React.FC<{
  children: React.ReactNode;
  fallback?: React.ReactNode;
  rootMargin?: string;
  threshold?: number;
}> = ({
  children,
  fallback = <LoadingFallback />,
  rootMargin = '50px',
  threshold = 0.1,
}) => {
  const { elementRef, hasIntersected } = useIntersectionObserver({
    rootMargin,
    threshold,
  });

  return (
    <div ref={elementRef}>
      {hasIntersected ? (
        <Suspense fallback={fallback}>
          {children}
        </Suspense>
      ) : (
        fallback
      )}
    </div>
  );
};

// Performance monitoring for code splitting
export const useCodeSplittingMetrics = () => {
  const [metrics, setMetrics] = React.useState({
    loadedComponents: 0,
    failedComponents: 0,
    averageLoadTime: 0,
    totalLoadTime: 0,
  });

  const recordComponentLoad = React.useCallback((componentName: string, loadTime: number, success: boolean) => {
    performanceMonitor.addEntry({
      name: componentName,
      startTime: Date.now() - loadTime,
      duration: loadTime,
      type: 'measure',
    });

    setMetrics(prev => ({
      loadedComponents: success ? prev.loadedComponents + 1 : prev.loadedComponents,
      failedComponents: !success ? prev.failedComponents + 1 : prev.failedComponents,
      averageLoadTime: (prev.totalLoadTime + loadTime) / (prev.loadedComponents + prev.failedComponents + 1),
      totalLoadTime: prev.totalLoadTime + loadTime,
    }));
  }, []);

  return { metrics, recordComponentLoad };
};

// Bundle size monitoring utilities
export const bundleSizeMonitor = {
  // Get current bundle size (approximation)
  getBundleSize: async (): Promise<{ size: number; gzipped: number }> => {
    if (typeof window === 'undefined') {
      return { size: 0, gzipped: 0 };
    }

    try {
      const response = await fetch(window.location.href);
      const text = await response.text();
      const size = new Blob([text]).size;

      // Approximate gzipped size (rough estimation)
      const gzipped = Math.round(size * 0.3);

      return { size, gzipped };
    } catch (error) {
      console.warn('Failed to get bundle size:', error);
      return { size: 0, gzipped: 0 };
    }
  },

  // Monitor resource loading performance
  getResourceMetrics: () => {
    if (typeof window === 'undefined') {
      return { totalResources: 0, totalSize: 0, averageLoadTime: 0 };
    }

    const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
    const totalResources = resources.length;
    const totalSize = resources.reduce((sum, resource) => sum + (resource.transferSize || 0), 0);
    const averageLoadTime = resources.reduce((sum, resource) => sum + resource.duration, 0) / totalResources;

    return { totalResources, totalSize, averageLoadTime };
  },

  // Get memory usage
  getMemoryUsage: () => {
    if (typeof window === 'undefined' || !('memory' in performance)) {
      return { used: 0, total: 0, limit: 0 };
    }

    const memory = (performance as { memory?: { usedJSHeapSize: number; totalJSHeapSize: number; jsHeapSizeLimit: number } }).memory;
    if (!memory) {
      return { used: 0, total: 0, limit: 0 };
    }
    return {
      used: memory.usedJSHeapSize,
      total: memory.totalJSHeapSize,
      limit: memory.jsHeapSizeLimit,
    };
  },
};

// Preloading utilities
export const preloadComponent = (importFunc: () => Promise<{ default: React.ComponentType<Record<string, unknown>> }>) => {
  return importFunc();
};

export const preloadRoute = (routePath: string) => {
  if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
    const requestIdleCallback = (window as { requestIdleCallback?: (callback: () => void) => void }).requestIdleCallback;
    if (requestIdleCallback) {
      requestIdleCallback(() => {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = routePath;
        document.head.appendChild(link);
      });
    }
  }
};

