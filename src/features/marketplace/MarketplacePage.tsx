'use client';

import { Marketplace } from './index';

/**
 * Marketplace Page Component
 * 
 * @description Simple wrapper for the main Marketplace component. This follows the
 * feature-first architecture pattern where the app router page is a thin wrapper
 * around the feature component.
 * 
 * @example
 * ```tsx
 * <MarketplacePage />
 * ```
 */
export function MarketplacePage() {
  return <Marketplace />;
}
