// next.config.dev.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  // No 'output: export' for development to support middleware
  trailingSlash: true,
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
    ],
  },
  // Add any other development-specific configurations here
};

module.exports = nextConfig;
