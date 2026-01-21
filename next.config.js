// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Use standard build for deployment
  trailingSlash: true,
  // Fix manifest and icon paths
  generateBuildId: () => 'build',
  // Disable image optimization for compatibility
  images: {
    unoptimized: true
  },
  // Set base path for deployment (will be set via environment variable)
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
  // Set asset prefix for deployment
  assetPrefix: process.env.NEXT_PUBLIC_BASE_PATH || ''
}

module.exports = nextConfig