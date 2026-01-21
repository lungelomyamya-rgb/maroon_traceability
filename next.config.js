// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configure for static export for GitHub Pages (required for static hosting)
  output: 'export',
  trailingSlash: true,
  // Fix manifest and icon paths for GitHub Pages
  generateBuildId: () => 'build',
  // Disable image optimization for static export
  images: {
    unoptimized: true
  },
  // Set base path for GitHub Pages (will be set via environment variable)
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
  // Set asset prefix for GitHub Pages
  assetPrefix: process.env.NEXT_PUBLIC_BASE_PATH || ''
}

module.exports = nextConfig