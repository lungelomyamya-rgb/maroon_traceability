// src/core/examples/AuthAdapterExample.ts
// Example of how to switch between authentication adapters

import { registerAuthAdapters, createAuthAdapter } from '../../features/auth/adapters';
import type { AdapterConfig, AuthAdapter } from '../types/adapter';

/**
 * Example: Initialize adapters and switch between them
 */
export async function demonstrateAdapterSwitching() {
  // Register all available adapters
  registerAuthAdapters();

  console.log('=== Authentication Adapter Demonstration ===');

  // Example 1: Use simulated adapter (default)
  console.log('\n1. Using Simulated Adapter:');
  const simulatedAdapter = await createAuthAdapter('simulated');
  console.log('Adapter ID:', simulatedAdapter.id);
  console.log('Adapter Type:', simulatedAdapter.type);

  // Test login with simulated adapter
  const loginResult = await simulatedAdapter.login('john@farm.com', 'password123');
  console.log('Login Result:', loginResult.success ? 'SUCCESS' : 'FAILED');
  if (loginResult.success) {
    console.log('User:', loginResult.data?.name);
  }

  // Example 2: Switch to real adapter
  console.log('\n2. Switching to Real Adapter:');
  const realConfig: AdapterConfig = {
    type: 'real',
    timeout: 5000,
    baseUrl: 'https://api.example.com',
    options: {
      endpoints: {
        login: '/api/v1/auth/login',
        register: '/api/v1/auth/register',
        logout: '/api/v1/auth/logout',
        refresh: '/api/v1/auth/refresh',
        resetPassword: '/api/v1/auth/reset-password',
        getCurrentUser: '/api/v1/auth/me',
      },
    },
  };

  try {
    const realAdapter = await createAuthAdapter('real');
    console.log('Adapter ID:', realAdapter.id);
    console.log('Adapter Type:', realAdapter.type);
    console.log('Base URL:', realConfig.baseUrl);

    // Note: This would fail in demo mode without real API
    console.log('Real adapter ready for production use');
  } catch (_error) {
    console.log('Real adapter requires valid API configuration');
  }

  // Example 3: Environment-based adapter selection
  console.log('\n3. Environment-Based Adapter Selection:');
  const isDevelopment = process.env.NODE_ENV === 'development';
  const isProduction = process.env.NODE_ENV === 'production';

  let adapter;
  if (isDevelopment) {
    adapter = await createAuthAdapter('simulated');
    console.log('Development mode: Using simulated adapter');
  } else if (isProduction) {
    adapter = await createAuthAdapter('real');
    console.log('Production mode: Using real adapter');
  } else {
    adapter = await createAuthAdapter('simulated');
    console.log('Default: Using simulated adapter');
  }

  console.log('Selected adapter:', adapter.id);

  // Cleanup
  await simulatedAdapter.cleanup();
  if (adapter !== simulatedAdapter) {
    await adapter.cleanup();
  }

  console.log('\n=== Demonstration Complete ===');
}

/**
 * Example: Configuration-based adapter switching
 */
export class AuthAdapterFactory {
  private static adapters = new Map<string, AuthAdapter>();

  static async getAdapter(mode: 'development' | 'staging' | 'production'): Promise<AuthAdapter> {
    if (this.adapters.has(mode)) {
      const adapter = this.adapters.get(mode);
      if (adapter) {
        return adapter;
      }
    }

    registerAuthAdapters();

    switch (mode) {
    case 'development': {
      const devAdapter = await createAuthAdapter('simulated');
      this.adapters.set(mode, devAdapter);
      return devAdapter;
    }

    case 'staging': {
      const _stagingConfig: AdapterConfig = {
        type: 'real',
        timeout: 10000,
        baseUrl: 'https://staging-api.example.com',
      };
      const stagingAdapter = await createAuthAdapter('real');
      this.adapters.set(mode, stagingAdapter);
      return stagingAdapter;
    }

    case 'production': {
      const _prodConfig: AdapterConfig = {
        type: 'real',
        timeout: 5000,
        baseUrl: 'https://api.example.com',
        options: {
          autoRefresh: true,
        },
      };
      const prodAdapter = await createAuthAdapter('real');
      this.adapters.set(mode, prodAdapter);
      return prodAdapter;
    }

    default:
      throw new Error(`Unknown mode: ${mode}`);
    }
  }

  static async cleanup(): Promise<void> {
    for (const adapter of this.adapters.values()) {
      await adapter.cleanup();
    }
    this.adapters.clear();
  }
}

// AuthAdapterFactory is already exported above
