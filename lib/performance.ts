// src/lib/performance.ts
import { useCallback, useMemo, useRef, useEffect, useState } from 'react';

// Performance optimization utilities

// Memoized callback with dependency tracking
export const useStableCallback = <T extends (...args: any[]) => any>(
  callback: T,
  deps: React.DependencyList
): T => {
  return useCallback(callback, deps);
};

// Memoized value with deep comparison
export const useDeepMemo = <T>(factory: () => T, deps: React.DependencyList): T => {
  const ref = useRef<{ deps: React.DependencyList; value: T } | undefined>(undefined);
  
  if (!ref.current || !depsEqual(deps, ref.current.deps)) {
    ref.current = { deps, value: factory() };
  }
  
  return ref.current.value;
};

// Simple deep equality check (for small objects)
function depsEqual(a: React.DependencyList, b: React.DependencyList): boolean {
  if (a === b) return true;
  if (a.length !== b.length) return false;
  
  return a.every((dep, index) => {
    const other = b[index];
    if (dep === other) return true;
    
    // Simple object comparison
    if (typeof dep === 'object' && typeof other === 'object' && dep !== null && other !== null) {
      return JSON.stringify(dep) === JSON.stringify(other);
    }
    
    return false;
  });
}

// Debounced value hook
export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Throttled function hook
export const useThrottle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): T => {
  const inThrottle = useRef(false);
  
  return useCallback(
    ((...args) => {
      if (!inThrottle.current) {
        func(...args);
        inThrottle.current = true;
        setTimeout(() => {
          inThrottle.current = false;
        }, limit);
      }
    }) as T,
    [func, limit]
  );
};

// Virtual scrolling utilities
export const useVirtualScroll = (
  items: any[],
  itemHeight: number,
  containerHeight: number
) => {
  return useMemo(() => {
    const visibleCount = Math.ceil(containerHeight / itemHeight);
    const startIndex = 0; // This would be dynamic based on scroll position
    const endIndex = Math.min(startIndex + visibleCount, items.length);
    
    return {
      visibleItems: items.slice(startIndex, endIndex),
      startIndex,
      endIndex,
      totalHeight: items.length * itemHeight
    };
  }, [items, itemHeight, containerHeight]);
};

// Lazy loading hook
export const useLazyLoad = <T>(
  loader: () => Promise<T>,
  deps: React.DependencyList = []
) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await loader();
      setData(result);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [loader]);

  useEffect(() => {
    load();
  }, deps);

  return { data, loading, error, refetch: load };
};

// Performance monitoring hook
export const usePerformanceMonitor = (componentName: string) => {
  const renderCount = useRef(0);
  const startTime = useRef(Date.now());
  
  useEffect(() => {
    renderCount.current += 1;
    
    if (process.env.NODE_ENV === 'development') {
      const renderTime = Date.now() - startTime.current;
      console.log(
        `${componentName} render #${renderCount.current} took ${renderTime}ms`
      );
    }
    
    startTime.current = Date.now();
  });

  return useMemo(() => ({
    renderCount: renderCount.current,
    getAverageRenderTime: () => {
      // This would be more sophisticated in a real implementation
      return Date.now() - startTime.current;
    }
  }), []);
};

// Optimized array operations
export const useOptimizedArray = <T>(initialArray: T[] = []) => {
  const [array, setArray] = useState<T[]>(initialArray);

  const addItem = useCallback((item: T) => {
    setArray(prev => [...prev, item]);
  }, []);

  const removeItem = useCallback((index: number) => {
    setArray(prev => prev.filter((_, i) => i !== index));
  }, []);

  const updateItem = useCallback((index: number, item: T) => {
    setArray(prev => {
      const newArray = [...prev];
      newArray[index] = item;
      return newArray;
    });
  }, []);

  const clearArray = useCallback(() => {
    setArray([]);
  }, []);

  return {
    array,
    setArray,
    addItem,
    removeItem,
    updateItem,
    clearArray
  };
};

// Memoized selector for large datasets
export const useMemoizedSelector = <T, R>(
  data: T[],
  selector: (items: T[]) => R[],
  deps: React.DependencyList
) => {
  return useMemo(() => selector(data), [data, ...deps]);
};

// Intersection Observer for lazy loading
export const useIntersectionObserver = (
  options: IntersectionObserverInit = {}
) => {
  const [entries, setEntries] = useState<IntersectionObserverEntry[]>([]);
  const [observer, setObserver] = useState<IntersectionObserver | null>(null);

  const ref = useCallback((element: HTMLElement | null) => {
    if (element && !observer) {
      const obs = new IntersectionObserver((entries) => {
        setEntries(entries);
      }, options);
      obs.observe(element);
      setObserver(obs);
    }
  }, [options]);

  useEffect(() => {
    return () => {
      if (observer) {
        observer.disconnect();
      }
    };
  }, [observer]);

  return { ref, entries };
};

// Performance optimized search
export const useOptimizedSearch = <T>(
  items: T[],
  searchFn: (item: T, query: string) => boolean,
  debounceMs: number = 300
) => {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, debounceMs);

  const filteredItems = useMemo(() => {
    if (!debouncedQuery) return items;
    
    return items.filter(item => searchFn(item, debouncedQuery));
  }, [items, debouncedQuery, searchFn]);

  return {
    query,
    setQuery,
    filteredItems,
    isSearching: query !== debouncedQuery
  };
};

// Image lazy loading hook
export const useLazyImage = (src: string) => {
  const [imageSrc, setImageSrc] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = new Image();
            img.src = src;
            img.onload = () => {
              setImageSrc(src);
              setIsLoading(false);
            };
            img.onerror = () => {
              setError(new Error('Failed to load image'));
              setIsLoading(false);
            };
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1 }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [src]);

  return { imgRef, imageSrc, isLoading, error };
};
