// src/features/auth/adapters/index.ts
// Barrel exports for authentication adapters

import type { AuthAdapter } from '@/src/core/types/adapter';
import { HybridAuthAdapter } from './HybridAuthAdapter';
import { MockAuthAdapter } from './MockAuthAdapter';
import { RealAuthAdapter } from './RealAuthAdapter';

// Registry for available adapters
const adapterRegistry = new Map<string, () => AuthAdapter>();

// Register adapters
adapterRegistry.set('mock', () => new MockAuthAdapter());
adapterRegistry.set('real', () => new RealAuthAdapter());
adapterRegistry.set('hybrid', () => new HybridAuthAdapter({
  type: 'hybrid',
  mode: 'mock',
  fallbackEnabled: true,
}));

/**
 * Register all authentication adapters
 */
export function registerAuthAdapters(): void {
  console.log('Authentication adapters registered:', Array.from(adapterRegistry.keys()));
}

/**
 * Create an authentication adapter by type
 */
export async function createAuthAdapter(type: string): Promise<AuthAdapter> {
  const adapterFactory = adapterRegistry.get(type);
  if (!adapterFactory) {
    throw new Error(`Unknown adapter type: ${type}`);
  }

  const adapter = adapterFactory();

  // Initialize adapter if needed
  if ('initialize' in adapter && typeof adapter.initialize === 'function') {
    await adapter.initialize();
  }

  return adapter;
}

// Export adapter classes
export { MockAuthAdapter, RealAuthAdapter, HybridAuthAdapter };

// Export types
export type { AuthAdapter };
