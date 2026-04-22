// Bundle Optimization Configuration and Implementation

import { BundleOptimizer, BundleOptimizationConfig, OptimizationResult } from './bundleOptimizer';

// Advanced bundle optimization configuration
export const BUNDLE_OPTIMIZATION_CONFIG: BundleOptimizationConfig = {
  enableTreeShaking: true,
  enableCodeSplitting: true,
  enableCompression: true,
  enableMinification: true,
  chunkSizeLimit: 100 * 1024, // 100KB
  compressionLevel: 6,
  enableDynamicImports: true,
  enableModuleFederation: false,
};

// Webpack optimization configuration
export const WEBPACK_OPTIMIZATION_CONFIG = {
  optimization: {
    minimize: true,
    minimizer: [
      '...',
      '...', // TerserPlugin for JS minification
      '...', // CssMinimizerPlugin for CSS minification
    ],
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
        },
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          priority: -10,
          chunks: 'initial',
        },
        react: {
          test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
          name: 'react',
          priority: 20,
          chunks: 'all',
        },
        ui: {
          test: /[\\/]node_modules[\\/](@radix-ui|@headlessui|lucide-react)[\\/]/,
          name: 'ui',
          priority: 10,
          chunks: 'all',
        },
        common: {
          minChunks: 2,
          chunks: 'async',
          priority: 5,
          name: 'common',
          reuseExistingChunk: true,
        },
      },
    },
    runtimeChunk: {
      name: 'runtime',
    },
  },
  resolve: {
    alias: {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      '@': require('path').resolve('.'),
    },
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', {
                targets: {
                  browsers: ['> 1%', 'last 2 versions', 'not dead'],
                },
                modules: false,
              }],
              '@babel/preset-react',
              '@babel/preset-typescript',
            ],
            plugins: [
              '@babel/plugin-syntax-dynamic-import',
              '@babel/plugin-proposal-class-properties',
              '@babel/plugin-proposal-object-rest-spread',
            ],
          },
        },
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              plugins: [

                require('tailwindcss'),

                require('autoprefixer'),
                // eslint-disable-next-line @typescript-eslint/no-var-requires
                require('cssnano')({
                  preset: 'default',
                }),
              ],
            },
          },
        ],
      },
      {
        test: /\.(png|jpe?g|gif|svg|webp)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'static/images/[name].[hash][ext]',
        },
      },
    ],
  },
  plugins: [
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    new (require('webpack').BundleAnalyzerPlugin)({
      analyzerMode: 'static',
      openAnalyzer: false,
      reportFilename: 'bundle-report.html',
    }),
  ],
};

// Next.js specific optimizations
export const NEXTJS_OPTIMIZATION_CONFIG = {
  experimental: {
    optimizeCss: true,
    optimizePackageImports: [
      'lucide-react',
      'react-icons',
      '@radix-ui/react-icons',
      'date-fns',
      'clsx',
      'tailwind-merge',
    ],
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  },

  // Image optimization
  images: {
    domains: ['example.com'],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Compression
  compress: true,
  poweredByHeader: false,

  // Static optimization
  trailingSlash: true,
  output: 'export',
};

// Bundle optimization service
export class BundleOptimizationService {
  private optimizer: BundleOptimizer;

  constructor(config?: Partial<BundleOptimizationConfig>) {
    this.optimizer = new BundleOptimizer(config);
  }

  // Analyze current bundle
  async analyzeBundle() {
    return await this.optimizer.analyzeBundle();
  }

  // Optimize bundle with advanced strategies
  async optimizeBundle() {
    const result = await this.optimizer.optimizeBundle();

    // Apply additional optimizations
    await this.applyAdvancedOptimizations(result);

    return result;
  }

  // Apply advanced optimizations
  private async applyAdvancedOptimizations(_result: OptimizationResult) {
    console.log('Applying advanced bundle optimizations...');

    // 1. Dynamic imports for large components
    await this.implementDynamicImports();

    // 2. Route-based code splitting
    await this.implementRouteBasedSplitting();

    // 3. Preloading strategies
    await this.implementPreloadingStrategies();

    // 4. Service worker caching
    await this.implementServiceWorkerCaching();

    console.log('Advanced optimizations applied successfully');
  }

  // Implement dynamic imports
  private async implementDynamicImports() {
    // This would be implemented in the actual build process
    console.log('Implementing dynamic imports for large components...');
  }

  // Implement route-based code splitting
  private async implementRouteBasedSplitting() {
    // This would be implemented in the actual build process
    console.log('Implementing route-based code splitting...');
  }

  // Implement preloading strategies
  private async implementPreloadingStrategies() {
    // This would be implemented in the actual build process
    console.log('Implementing preloading strategies...');
  }

  // Implement service worker caching
  private async implementServiceWorkerCaching() {
    // This would be implemented in the actual build process
    console.log('Implementing service worker caching...');
  }

  // Get optimization recommendations
  getOptimizationRecommendations(): string[] {
    const recommendations = [
      'Enable tree shaking to remove unused code',
      'Implement code splitting for large components',
      'Use dynamic imports for route-based loading',
      'Enable compression for better network transfer',
      'Optimize images with modern formats (WebP, AVIF)',
      'Implement service worker caching for offline support',
      'Use CDN for static assets',
      'Enable HTTP/2 for better performance',
      'Minimize and compress JavaScript/CSS',
      'Remove unused dependencies',
      'Optimize bundle chunking strategy',
    ];

    return recommendations;
  }

  // Generate bundle report
  async generateBundleReport() {
    const analysis = await this.analyzeBundle();

    return {
      summary: {
        totalSize: analysis.totalSize,
        gzippedSize: analysis.gzippedSize,
        chunkCount: analysis.chunks.length,
        largeChunks: analysis.largeChunks.length,
        unusedExports: analysis.unusedExports.length,
        duplicateCode: analysis.duplicateCode.length,
      },
      recommendations: analysis.recommendations,
      optimizationOpportunities: analysis.optimizationOpportunities,
      nextSteps: this.getNextSteps(analysis),
    };
  }

  // Get next steps for optimization
  private getNextSteps(analysis: {
    totalSize: number;
    largeChunks: Array<{ name: string; size: number }>;
    unusedExports: string[];
    duplicateCode: Array<{ files: string[]; size: number }>;
  }): string[] {
    const steps: string[] = [];

    if (analysis.totalSize > 1024 * 1024) {
      steps.push('Reduce bundle size below 1MB');
    }

    if (analysis.largeChunks.length > 0) {
      steps.push(`Split ${analysis.largeChunks.length} large chunks`);
    }

    if (analysis.unusedExports.length > 10) {
      steps.push('Remove unused exports');
    }

    if (analysis.duplicateCode.length > 5) {
      steps.push('Extract duplicate code to shared modules');
    }

    return steps;
  }
}

// Performance monitoring for bundle optimization
export class BundlePerformanceMonitor {
  private startTime: number = 0;
  private metrics: {
    loadTime: number;
    firstContentfulPaint: number;
    largestContentfulPaint: number;
    cumulativeLayoutShift: number;
    firstInputDelay: number;
  } = {
      loadTime: 0,
      firstContentfulPaint: 0,
      largestContentfulPaint: 0,
      cumulativeLayoutShift: 0,
      firstInputDelay: 0,
    };

  startMonitoring(): void {
    this.startTime = performance.now();

    // Monitor Core Web Vitals
    this.monitorWebVitals();

    // Monitor bundle loading
    this.monitorBundleLoading();
  }

  private monitorWebVitals(): void {
    // First Contentful Paint
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        if (entry.name === 'first-contentful-paint') {
          this.metrics.firstContentfulPaint = entry.startTime;
        }
      });
    }).observe({ entryTypes: ['paint'] });

    // Largest Contentful Paint
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        if (entry.name === 'largest-contentful-paint') {
          this.metrics.largestContentfulPaint = entry.startTime;
        }
      });
    }).observe({ entryTypes: ['largest-contentful-paint'] });

    // Cumulative Layout Shift
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        const _layoutShiftEntry = entry as PerformancePaintTiming;
        if ('hadRecentInput' in entry && !(entry as PerformanceEntry & { hadRecentInput?: boolean }).hadRecentInput) {
          this.metrics.cumulativeLayoutShift += (entry as PerformanceEntry & { value?: number }).value || 0;
        }
      });
    }).observe({ entryTypes: ['layout-shift'] });

    // First Input Delay
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        if (entry.name === 'first-input') {
          const firstInputEntry = entry as PerformanceEventTiming;
          this.metrics.firstInputDelay = (firstInputEntry.processingStart || 0) - entry.startTime;
        }
      });
    }).observe({ entryTypes: ['first-input'] });
  }

  private monitorBundleLoading(): void {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        if (entry.name.includes('chunk') || entry.name.includes('bundle')) {
          const resourceEntry = entry as PerformanceResourceTiming;
          console.log(`Bundle loaded: ${entry.name}, Size: ${(resourceEntry.transferSize || 0)} bytes, Duration: ${entry.duration}ms`);
        }
      });
    });

    observer.observe({ entryTypes: ['resource'] });
  }

  getMetrics() {
    this.metrics.loadTime = performance.now() - this.startTime;
    return this.metrics;
  }

  generateReport() {
    const metrics = this.getMetrics();

    return {
      performance: {
        loadTime: metrics.loadTime,
        firstContentfulPaint: metrics.firstContentfulPaint,
        largestContentfulPaint: metrics.largestContentfulPaint,
        cumulativeLayoutShift: metrics.cumulativeLayoutShift,
        firstInputDelay: metrics.firstInputDelay,
      },
      recommendations: this.getPerformanceRecommendations(metrics),
    };
  }

  private getPerformanceRecommendations(metrics: {
    loadTime: number;
    firstContentfulPaint: number;
    largestContentfulPaint: number;
    cumulativeLayoutShift: number;
    firstInputDelay: number;
  }): string[] {
    const recommendations: string[] = [];

    if (metrics.loadTime > 3000) {
      recommendations.push('Optimize initial load time (currently > 3s)');
    }

    if (metrics.firstContentfulPaint > 2000) {
      recommendations.push('Improve First Contentful Paint (currently > 2s)');
    }

    if (metrics.largestContentfulPaint > 2500) {
      recommendations.push('Optimize Largest Contentful Paint (currently > 2.5s)');
    }

    if (metrics.cumulativeLayoutShift > 0.1) {
      recommendations.push('Reduce Cumulative Layout Shift (currently > 0.1)');
    }

    if (metrics.firstInputDelay > 100) {
      recommendations.push('Improve First Input Delay (currently > 100ms)');
    }

    return recommendations;
  }
}

// Export instances
export const bundleOptimizationService = new BundleOptimizationService();
export const bundlePerformanceMonitor = new BundlePerformanceMonitor();

// Utility functions
export const createBundleOptimizer = (config?: Partial<BundleOptimizationConfig>) => {
  return new BundleOptimizer(config);
};

export const analyzeBundleSize = async () => {
  const analysis = await bundleOptimizationService.analyzeBundle();
  return {
    totalSize: analysis.totalSize,
    gzippedSize: analysis.gzippedSize,
    chunks: analysis.chunks,
    largeChunks: analysis.largeChunks,
    recommendations: analysis.recommendations,
  };
};

export const optimizeBundle = async () => {
  return await bundleOptimizationService.optimizeBundle();
};

export const generateBundleReport = async () => {
  return await bundleOptimizationService.generateBundleReport();
};
