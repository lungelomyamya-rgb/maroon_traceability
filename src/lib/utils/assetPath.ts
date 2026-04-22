// src/lib/utils/assetPath.ts
// Utility for generating asset paths

/**
 * Generate the correct path for assets
 */
export function assetPath(path: string): string {
  // Remove leading slash if present - assets are served from public directory
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;

  // Check if we're on GitHub Pages and add base path
  const isGitHubPages = typeof window !== 'undefined' &&
    window.location.hostname.includes('github.io');

  const basePath = isGitHubPages ? '/maroon_traceability' : '';

  return `${basePath}/${cleanPath}`;
}

/**
 * Generate the correct path for assets (alias for consistency)
 */
export function getAssetPath(path: string): string {
  return assetPath(path);
}
