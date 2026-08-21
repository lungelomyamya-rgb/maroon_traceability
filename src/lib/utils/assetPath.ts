// src/lib/utils/assetPath.ts
// Utility for generating asset paths

/**
 * Generate the correct path for assets
 */
export function assetPath(path: string): string {
  // Remove leading slash if present - assets are served from public directory
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
  return `${basePath}/${cleanPath}`;
}

/**
 * Generate the correct path for assets (alias for consistency)
 */
export function getAssetPath(path: string): string {
  return assetPath(path);
}
