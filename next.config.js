// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**'
      }
    ],
    domains: ['images.unsplash.com', 'avatars.githubusercontent.com'],
  },
  basePath: '/maroon_traceability',
  assetPrefix: '/maroon_traceability',
}

module.exports = nextConfig