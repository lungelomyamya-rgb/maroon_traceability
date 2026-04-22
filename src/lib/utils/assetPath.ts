// src/lib/utils/assetPath.ts
// Utility for generating asset paths

/**
 * Generate the correct path for assets
 */
export function assetPath(path: string): string {
  // Remove leading slash if present and add /assets prefix
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `/assets/${cleanPath}`;
}

/**
 * Generate the correct path for assets (alias for consistency)
 */
export function getAssetPath(path: string): string {
  return assetPath(path);
}
