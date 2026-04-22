// next.config.unified.js
/** @type {import('next').NextConfig} */

const isDev = process.env.NODE_ENV === 'development';
const isTest = process.env.NODE_ENV === 'test';

const nextConfig = {
  // Base configuration
  trailingSlash: true,
  
  // Environment-specific output configuration
  ...(isDev ? {} : {
    output: 'export',
    generateBuildId: () => 'build',
  }),
  
  // Image configuration
  images: {
    unoptimized: true,
    // Add remote patterns for development
    ...(isDev && {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: '**',
        },
        {
          protocol: 'https',
          hostname: 'images.unsplash.com',
        },
        {
          protocol: 'https',
          hostname: 'avatars.githubusercontent.com',
        }
      ],
    }),
  },
  
  // GitHub Pages configuration (only in production)
  ...(isDev ? {} : {
    basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
    assetPrefix: process.env.NEXT_PUBLIC_BASE_PATH || '',
  }),
  
  // Performance optimizations (merged from performance config)
  experimental: {
    optimizeCss: true,
    optimizePackageImports: [
      'lucide-react',
      'react-icons',
      '@radix-ui/react-icons',
    ],
  },

  // Webpack configuration with performance optimizations
  webpack: (config, { dev, isServer }) => {
    // Add bundle analyzer in development
    if (!isServer && dev) {
      config.plugins.push(
        require('@next/bundle-analyzer')({
          analyzerMode: 'server',
          analyzerPort: 8888,
          openAnalyzer: true,
        })
      );
    }

    // Code splitting optimizations
    config.optimization = {
      ...config.optimization,
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true,
            enforce: true,
          },
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
            priority: -10,
            reuseExistingChunk: true,
            enforce: true,
          },
          common: {
            name: 'common',
            minChunks: 2,
            chunks: 'all',
            priority: -15,
            reuseExistingChunk: true,
            enforce: true,
          },
        },
      },
    };

    // Performance optimizations
    if (!dev) {
      // Add compression for production
      config.plugins.push(
        require('compression-webpack-plugin')({
          algorithm: 'gzip',
          test: /\.(js|css|html|svg)$/,
          threshold: 10240,
          minRatio: 0.8,
        })
      );
    }

    return config;
  },

  // Additional optimizations
  ...(isDev ? {} : {
    // Production-specific optimizations
    poweredByHeader: false,
    compress: true,
  }),

  // Development-specific configurations
  ...(isDev && {
    // Allow cross-origin requests for development
    allowedDevOrigins: ['127.0.0.1'],
    
    // Development logging
    onDemandEntries: {
      pagesBufferLength: 2,
    },
    
    // Development-specific headers
    headers: async () => [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
        ],
      },
    ],
  }),

  // Test-specific configurations
  ...(isTest && {
    // Disable optimizations for testing
    optimizeCss: false,
    experimental: {
      optimizePackageImports: false,
    },
  }),
};

export default nextConfig;
