// next.config.js
/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';
const repository = 'maroon_traceability';

const nextConfig = {
  output: 'export',
  basePath: isProd ? `/${repository}` : '',
  assetPrefix: isProd ? `/${repository}/` : '',
  images: {
    unoptimized: true,
  },
  reactStrictMode: true,
  compiler: {
    styledComponents: true,
  },
  // Ensure the export includes all static assets
  trailingSlash: true,
  // Disable the static optimization for now to ensure all pages are generated
  experimental: {
    appDir: true,
  },
  // Ensure the export includes all static assets
  generateBuildId: async () => 'build',
};

// For GitHub Pages
if (isProd) {
  nextConfig.assetPrefix = `/${repository}/`;
  nextConfig.basePath = `/${repository}`;
}

module.exports = nextConfig;