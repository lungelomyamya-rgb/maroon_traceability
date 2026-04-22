// src/lib/utils/assetPath.ts
// Utility for generating asset paths

/**
 * Generate the correct path for assets
 */
export function assetPath(path: string): string {
  // Remove leading slash if present - assets are served from public directory
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `/${cleanPath}`;
}

/**
 * Generate the correct path for assets (alias for consistency)
 */
export function getAssetPath(path: string): string {
  return assetPath(path);
}
