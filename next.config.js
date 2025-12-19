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
  images: {
    unoptimized: true,
  },
  reactStrictMode: true,
  trailingSlash: true,
  // Disable Turbopack and use Webpack
  experimental: {
    // Add any experimental features here if needed
  },
  // Explicitly use Webpack
  webpack: (config, { isServer }) => {
    if (isProd && !isServer) {
      config.output.publicPath = `${assetPrefix}_next/`;
    }
    return config;
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