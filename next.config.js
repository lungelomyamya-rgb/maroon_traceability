// next.config.js
/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';
const repo = 'maroon_traceability';
const basePath = isProd ? `/${repo}` : '';
const assetPrefix = isProd ? `/${repo}/` : '';

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverExternalPackages: ['lucide-react']
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**'
      }
    ],
    domains: ['images.unsplash.com', 'avatars.githubusercontent.com'],
  },
  webpack: (config, { isServer }) => {
    // Custom webpack config
    return {
      ...config,
      resolve: {
        alias: {
          '@': './src',
        },
      },
      output: isProd && !isServer ? { publicPath: `${assetPrefix}_next/` } : config.output,
    }
  },
  // Suppress console warnings
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
  // Disable dev warnings
  devIndicators: {
    buildActivity: false,
    buildActivityPosition: 'bottom-right',
  },
};

module.exports = nextConfig;