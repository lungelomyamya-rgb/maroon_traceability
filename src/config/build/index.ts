// src/config/build/index.ts
// Barrel export for build configurations

import { hybridViteConfig } from './vite.config';
import hybridWebpackConfig from './webpack.config';

export { hybridWebpackConfig, hybridViteConfig };

// Build type
export type BuildTool = 'webpack' | 'vite' | 'next';

// Get build configuration
export function getBuildConfig(tool: BuildTool) {
  switch (tool) {
  case 'webpack':
    return hybridWebpackConfig;
  case 'vite':
    return hybridViteConfig;
  case 'next':
  default:
    return hybridWebpackConfig; // Default to webpack
  }
}

// Current build tool
export const currentBuildTool = (process.env.BUILD_TOOL as BuildTool) || 'next';
export const currentBuildConfig = getBuildConfig(currentBuildTool);
