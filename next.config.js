// next.config.js
/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';
const repo = 'maroon_traceability';
const basePath = isProd ? `/${repo}` : '';
const assetPrefix = isProd ? `/${repo}/` : '';

/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
  assetPrefix: process.env.NEXT_PUBLIC_BASE_PATH || '',
  legacy: true,
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
    unoptimized: true,
  },
  reactStrictMode: true,
  trailingSlash: true,
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