// src/config/build/webpack.config.js
// Webpack configuration for hybrid mode resolution

const path = require('path');
const { webpack } = require('next/webpack');

/**
 * Webpack configuration for hybrid mode support
 * Resolves adapters and services based on environment
 */
const hybridWebpackConfig = (phase, { defaultConfig }) => {
  // Get current environment
  const environment = process.env.NODE_ENV || 'development';
  const hybridMode = process.env.HYBRID_MODE || 'development';
  
  console.log(`🔧 Building for ${environment} environment with ${hybridMode} hybrid mode`);

  return {
    ...defaultConfig,
    webpack5: true,
    resolve: {
      ...defaultConfig.resolve,
      alias: {
        ...defaultConfig.resolve.alias,
        // Hybrid mode aliases for build-time resolution
        '@/hybrid/adapters': path.resolve(__dirname, '../../infrastructure/adapters'),
        '@/hybrid/repositories': path.resolve(__dirname, '../../infrastructure/repositories'),
        '@/hybrid/services': path.resolve(__dirname, '../../core/services'),
        '@/hybrid/registry': path.resolve(__dirname, '../../core/registry'),
        '@/hybrid/types': path.resolve(__dirname, '../../core/types'),
      },
    },
    plugins: [
      ...defaultConfig.plugins,
      // Define plugin for hybrid mode
      new webpack.DefinePlugin({
        'process.env.HYBRID_MODE': JSON.stringify(hybridMode),
        'process.env.HYBRID_ENVIRONMENT': JSON.stringify(environment),
        'process.env.REGISTRATION_MODE': JSON.stringify(
          environment === 'production' ? 'real' : 'real'
        ),
        'process.env.AUTH_MODE': JSON.stringify(
          environment === 'production' ? 'real' : 'hybrid'
        ),
        // Feature modes based on environment
        'process.env.FEATURE_MODES': JSON.stringify({
          registration: environment === 'production' ? 'real' : 'real',
          authentication: environment === 'production' ? 'real' : 'hybrid',
          farmer: environment === 'production' ? 'real' : 'simulated',
          inspector: environment === 'production' ? 'real' : 'simulated',
          logistics: environment === 'production' ? 'real' : 'simulated',
          packaging: environment === 'production' ? 'real' : 'simulated',
          retailer: environment === 'production' ? 'real' : 'simulated',
          marketplace: environment === 'production' ? 'real' : 'simulated',
          blockchain: environment === 'production' ? 'real' : 'simulated',
        }),
      }),
    ],
    // Optimization based on environment
    optimization: {
      ...defaultConfig.optimization,
      minimize: environment === 'production',
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
          common: {
            name: 'common',
            minChunks: 2,
            chunks: 'all',
            enforce: true,
          },
          hybrid: {
            test: /[\\/]hybrid[\\/]/,
            name: 'hybrid',
            chunks: 'all',
          },
        },
      },
    },
  };
};

module.exports = hybridWebpackConfig;
