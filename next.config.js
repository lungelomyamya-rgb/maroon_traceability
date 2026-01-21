// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable export mode to allow dynamic routes to work
  trailingSlash: true,
  // Fix manifest and icon paths for GitHub Pages
  generateBuildId: () => 'build'
}

module.exports = nextConfig