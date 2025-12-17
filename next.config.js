// next.config.js
/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';
const repo = 'maroon_traceability';
const basePath = isProd ? `/${repo}` : '';

const nextConfig = {
  output: 'export',
  basePath: basePath,
  assetPrefix: isProd ? `/${repo}/` : '',
  images: {
    unoptimized: true,
    domains: [],
  },
  reactStrictMode: true,
  trailingSlash: true,
  
  // Don't use distDir when using output: 'export'
  // distDir: 'out',
  
  // Fix for static export
  webpack: (config) => {
    if (isProd) {
      config.output.publicPath = `/${repo}/_next/`;
    }
    return config;
  },
};

module.exports = nextConfig;