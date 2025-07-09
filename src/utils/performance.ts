// Performance optimization utilities
import React, { useCallback, useMemo, useRef, useEffect, useState } from 'react';

// Image optimization and lazy loading
export const optimizeImageUrl = (url: string, width?: number, height?: number, quality: number = 80): string => {
  // In production, this would integrate with a CDN service like Cloudinary or ImageKit
  const params = new URLSearchParams();
  
  if (width) params.append('w', width.toString());
  if (height) params.append('h', height.toString());
  params.append('q', quality.toString());
  params.append('f', 'auto'); // Auto format selection
  
  // For now, return original URL. In production, prepend CDN URL
  return url;
};

// Lazy loading hook for images
export const useLazyLoading = (threshold: number = 0.1) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true);
          observer.disconnect();
        }
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isIntersecting };
};

// Debounce hook for search and input optimization
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

// Throttle hook for scroll and resize events
export const useThrottle = <T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T => {
  const lastRun = useRef(Date.now());

  return useCallback(
    ((...args) => {
      if (Date.now() - lastRun.current >= delay) {
        callback(...args);
        lastRun.current = Date.now();
      }
    }) as T,
    [callback, delay]
  );
};

// Virtual scrolling for large lists
export const useVirtualScrolling = (
  items: any[],
  itemHeight: number,
  containerHeight: number
) => {
  const [scrollTop, setScrollTop] = useState(0);
  
  const visibleItems = useMemo(() => {
    const startIndex = Math.floor(scrollTop / itemHeight);
    const endIndex = Math.min(
      startIndex + Math.ceil(containerHeight / itemHeight) + 1,
      items.length
    );
    
    return {
      startIndex,
      endIndex,
      items: items.slice(startIndex, endIndex),
      totalHeight: items.length * itemHeight,
      offsetY: startIndex * itemHeight
    };
  }, [items, itemHeight, containerHeight, scrollTop]);

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  return { visibleItems, handleScroll };
};

// Memoization utilities
export const createMemoizedSelector = <T, R>(
  selector: (state: T) => R,
  equalityFn?: (a: R, b: R) => boolean
) => {
  let lastArgs: T;
  let lastResult: R;

  return (state: T): R => {
    if (lastArgs === undefined || !equalityFn?.(selector(state), lastResult)) {
      lastArgs = state;
      lastResult = selector(state);
    }
    return lastResult;
  };
};

// Bundle splitting and code splitting utilities
export const loadComponent = (importFn: () => Promise<any>) => {
  return React.lazy(() => 
    importFn().catch(() => ({
      default: () => React.createElement('div', null, 'Error loading component')
    }))
  );
};

// Performance monitoring
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, number[]> = new Map();

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  startTiming(label: string): void {
    performance.mark(`${label}-start`);
  }

  endTiming(label: string): number {
    performance.mark(`${label}-end`);
    performance.measure(label, `${label}-start`, `${label}-end`);
    
    const measure = performance.getEntriesByName(label)[0];
    const duration = measure.duration;
    
    if (!this.metrics.has(label)) {
      this.metrics.set(label, []);
    }
    this.metrics.get(label)!.push(duration);
    
    // Clean up
    performance.clearMarks(`${label}-start`);
    performance.clearMarks(`${label}-end`);
    performance.clearMeasures(label);
    
    return duration;
  }

  getAverageTime(label: string): number {
    const times = this.metrics.get(label) || [];
    return times.length > 0 ? times.reduce((a, b) => a + b, 0) / times.length : 0;
  }

  getMetrics(): Record<string, { average: number; count: number; latest: number }> {
    const result: Record<string, { average: number; count: number; latest: number }> = {};
    
    this.metrics.forEach((times, label) => {
      result[label] = {
        average: times.reduce((a, b) => a + b, 0) / times.length,
        count: times.length,
        latest: times[times.length - 1] || 0
      };
    });
    
    return result;
  }
}

// React performance hook
export const usePerformanceMonitor = (label: string) => {
  const monitor = PerformanceMonitor.getInstance();
  
  useEffect(() => {
    monitor.startTiming(label);
    return () => {
      monitor.endTiming(label);
    };
  }, [label, monitor]);
};

// Cache management
class CacheManager {
  private cache: Map<string, { data: any; timestamp: number; ttl: number }> = new Map();

  set(key: string, data: any, ttl: number = 5 * 60 * 1000): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  get(key: string): any | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }

  cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key);
      }
    }
  }
}

export const cacheManager = new CacheManager();

// Automatic cache cleanup every 5 minutes
setInterval(() => {
  cacheManager.cleanup();
}, 5 * 60 * 1000);

// Resource preloading
export const preloadResource = (url: string, type: 'image' | 'script' | 'style' = 'image'): Promise<void> => {
  return new Promise((resolve, reject) => {
    let element: HTMLImageElement | HTMLLinkElement | HTMLScriptElement;

    switch (type) {
      case 'image':
        element = new Image();
        (element as HTMLImageElement).src = url;
        break;
      case 'script':
        element = document.createElement('script');
        (element as HTMLScriptElement).src = url;
        document.head.appendChild(element);
        break;
      case 'style':
        element = document.createElement('link');
        (element as HTMLLinkElement).rel = 'stylesheet';
        (element as HTMLLinkElement).href = url;
        document.head.appendChild(element);
        break;
    }

    element.onload = () => resolve();
    element.onerror = () => reject(new Error(`Failed to load ${type}: ${url}`));
  });
};

// Critical resource hints
export const addResourceHints = () => {
  // DNS prefetch for external domains
  const dnsPrefetch = [
    'https://images.pexels.com',
    'https://fonts.googleapis.com',
    'https://api.stripe.com'
  ];

  dnsPrefetch.forEach(domain => {
    const link = document.createElement('link');
    link.rel = 'dns-prefetch';
    link.href = domain;
    document.head.appendChild(link);
  });

  // Preconnect to critical origins
  const preconnect = [
    'https://fonts.gstatic.com'
  ];

  preconnect.forEach(origin => {
    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = origin;
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  });
};

// Web Vitals monitoring
export const measureWebVitals = () => {
  // Largest Contentful Paint
  new PerformanceObserver((list) => {
    const entries = list.getEntries();
    const lastEntry = entries[entries.length - 1];
    console.log('LCP:', lastEntry.startTime);
  }).observe({ entryTypes: ['largest-contentful-paint'] });

  // First Input Delay
  new PerformanceObserver((list) => {
    const entries = list.getEntries();
    entries.forEach((entry) => {
      console.log('FID:', entry.processingStart - entry.startTime);
    });
  }).observe({ entryTypes: ['first-input'] });

  // Cumulative Layout Shift
  let clsValue = 0;
  new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (!entry.hadRecentInput) {
        clsValue += entry.value;
        console.log('CLS:', clsValue);
      }
    }
  }).observe({ entryTypes: ['layout-shift'] });
};

// Initialize performance monitoring
if (typeof window !== 'undefined') {
  addResourceHints();
  measureWebVitals();
}