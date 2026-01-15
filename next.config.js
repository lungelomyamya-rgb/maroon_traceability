// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Only use export mode in production
  ...(process.env.NODE_ENV === 'production' ? {
    output: 'export',
    trailingSlash: true,
    distDir: 'out',
    basePath: '/maroon_traceability',
    assetPrefix: '/maroon_traceability',
    // Ensure images work correctly in production
    images: {
      unoptimized: true,
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
      ]
    }
  } : {
    // Development mode
    trailingSlash: true
  }),
  // Fix manifest and icon paths for GitHub Pages
  generateBuildId: () => 'build'
}

module.exports = nextConfig