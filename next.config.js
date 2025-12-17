// next.config.js
/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';
const repo = 'maroon_traceability';
const basePath = isProd ? `/${repo}` : '';

module.exports = {
  output: 'export',
  basePath: basePath,
  assetPrefix: isProd ? `./` : '',
  images: {
    unoptimized: true,
  },
  reactStrictMode: true,
  trailingSlash: true,
  webpack: (config) => {
    config.output.publicPath = './';
    return config;
  },
};