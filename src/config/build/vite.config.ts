// src/config/build/vite.config.ts
// Vite configuration for hybrid mode resolution

import { resolve } from 'path';

// Mock defineConfig for when vite is not available
const defineConfig = (config: Record<string, unknown>) => config;

/**
 * Vite configuration for hybrid mode support
 * Resolves adapters and services based on environment
 */
export const hybridViteConfig = defineConfig({
  resolve: {
    alias: {
      // Hybrid mode aliases for build-time resolution
      '@/hybrid/adapters': resolve(__dirname, '../../infrastructure/adapters'),
      '@/hybrid/repositories': resolve(__dirname, '../../infrastructure/repositories'),
      '@/hybrid/services': resolve(__dirname, '../../core/services'),
      '@/hybrid/registry': resolve(__dirname, '../../core/registry'),
      '@/hybrid/types': resolve(__dirname, '../../core/types'),
    },
  },
  define: {
    // Get current environment
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
    'process.env.HYBRID_MODE': JSON.stringify(process.env.HYBRID_MODE || 'development'),
    
    // Feature modes based on environment
    'process.env.REGISTRATION_MODE': JSON.stringify(
      process.env.NODE_ENV === 'production' ? 'real' : 'real',
    ),
    'process.env.AUTH_MODE': JSON.stringify(
      process.env.NODE_ENV === 'production' ? 'real' : 'hybrid',
    ),
    'process.env.FEATURE_MODES': JSON.stringify({
      registration: process.env.NODE_ENV === 'production' ? 'real' : 'real',
      authentication: process.env.NODE_ENV === 'production' ? 'real' : 'hybrid',
      farmer: process.env.NODE_ENV === 'production' ? 'real' : 'simulated',
      inspector: process.env.NODE_ENV === 'production' ? 'real' : 'simulated',
      logistics: process.env.NODE_ENV === 'production' ? 'real' : 'simulated',
      packaging: process.env.NODE_ENV === 'production' ? 'real' : 'simulated',
      retailer: process.env.NODE_ENV === 'production' ? 'real' : 'simulated',
      marketplace: process.env.NODE_ENV === 'production' ? 'real' : 'simulated',
      blockchain: process.env.NODE_ENV === 'production' ? 'real' : 'simulated',
    }),
  },
  build: {
    target: 'esnext',
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, '../index.ts'),
      },
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          hybrid: ['@/hybrid/adapters', '@/hybrid/repositories', '@/hybrid/services'],
        },
      },
    },
  },
  server: {
    port: 3000,
    open: false,
  },
  plugins: [
    // Custom plugin for hybrid mode logging
    {
      name: 'hybrid-mode-logger',
      configureServer() {
        const environment = process.env.NODE_ENV || 'development';
        const hybridMode = process.env.HYBRID_MODE || 'development';
        console.log(`🔧 Vite server running in ${environment} mode with ${hybridMode} hybrid configuration`);
      },
    },
  ],
});
