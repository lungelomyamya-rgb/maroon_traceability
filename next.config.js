// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: process.env.NODE_ENV === 'production' ? '/maroon_traceability' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/maroon_traceability/' : '',
  reactStrictMode: true,
  images: {
    domains: ['images.unsplash.com'],
  },
  compiler: {
    styledComponents: true,
  },
};

module.exports = nextConfig;