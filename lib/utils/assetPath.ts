// lib/utils/assetPath.ts
/**
 * Utility function to get the correct asset path for GitHub Pages
 * This ensures all static assets are properly prefixed with the base path
 */
export function getAssetPath(path: string): string {
  // In production on GitHub Pages, assets need the base path prefix
  if (typeof window !== 'undefined' && window.location.hostname.includes('github.io')) {
    return `/maroon_traceability${path}`;
  }
  
  // For local development, return the path as-is
  return path;
}

/**
 * Get the base URL for the application
 */
export function getBaseUrl(): string {
  if (typeof window !== 'undefined' && window.location.hostname.includes('github.io')) {
    return '/maroon_traceability';
  }
  return '';
}

/**
 * Get the correct navigation path for GitHub Pages
 * This ensures all navigation links are properly prefixed with the base path
 */
export function getNavigationPath(path: string): string {
  const baseUrl = getBaseUrl();
  return `${baseUrl}${path}`;
}
