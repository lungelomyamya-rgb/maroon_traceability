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
  },
  reactStrictMode: true,
  trailingSlash: true,
  
  // Fix for static export
  webpack: (config) => {
    if (isProd) {
      config.output.publicPath = `/_next/`;
    }
    return config;
  },
  
  // Generate a static export with the correct paths
  generateBuildId: async () => 'build',
  
  // Don't use distDir when using output: 'export'
  distDir: 'out',
  
  // Fix for static files in subdirectories
  skipTrailingSlashRedirect: true,
};

module.exports = nextConfig;