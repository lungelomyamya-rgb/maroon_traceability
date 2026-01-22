// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configure for static export for GitHub Pages (required for static hosting)
  // Disable output export in development to support middleware
  ...(process.env.NODE_ENV !== 'development' && {
    output: 'export',
  }),
  trailingSlash: true,
  // Fix manifest and icon paths for GitHub Pages
  generateBuildId: () => 'build',
  // Disable image optimization for static export
  images: {
    unoptimized: true
  },
  // Set base path for GitHub Pages (only in production)
  basePath: process.env.NODE_ENV === 'development' ? '' : (process.env.NEXT_PUBLIC_BASE_PATH || ''),
  // Set asset prefix for GitHub Pages (only in production)
  assetPrefix: process.env.NODE_ENV === 'development' ? '' : (process.env.NEXT_PUBLIC_BASE_PATH || '')
}

module.exports = nextConfig