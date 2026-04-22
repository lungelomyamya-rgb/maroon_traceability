// src/core/adapters/blockchain/index.ts
// Blockchain adapter exports and registration

export { SimulatedBlockchainAdapter } from './SimulatedBlockchainAdapter';
export { RealBlockchainAdapter } from './RealBlockchainAdapter';
export type { SimulatedBlockchainConfig } from './SimulatedBlockchainAdapter';
export type { RealBlockchainConfig } from './RealBlockchainAdapter';

// Adapter registration helper
import type { BlockchainAdapter } from '../../types/adapter';
import { adapterRegistry } from '../AdapterRegistry';
import { RealBlockchainAdapter } from './RealBlockchainAdapter';
import { SimulatedBlockchainAdapter } from './SimulatedBlockchainAdapter';
import type { SimulatedBlockchainConfig as _SimulatedBlockchainConfig } from './SimulatedBlockchainAdapter';

/**
 * Register blockchain adapters with the registry
 */
export function registerBlockchainAdapters(): void {
  // Register simulated blockchain adapter with wrapper to handle config types
  const simulatedAdapter = new SimulatedBlockchainAdapter();
  adapterRegistry.register(simulatedAdapter);

  // Register real blockchain adapter with wrapper to handle config requirements
  const realAdapter = new RealBlockchainAdapter();
  adapterRegistry.register(realAdapter);
}

/**
 * Create blockchain adapter instance
 */
export async function createBlockchainAdapter(
  type: 'simulated' | 'real',
  config?: Record<string, unknown>,
): Promise<BlockchainAdapter> {
  const adapter = await adapterRegistry.create('blockchain', type, config);
  return adapter as BlockchainAdapter;
}

/**
 * Get available blockchain adapters
 */
export function getAvailableBlockchainAdapters(): string[] {
  const adapters = adapterRegistry.getAvailableAdapters();
  return adapters.blockchain || [];
}

/**
 * Blockchain adapter factory for environment-based selection
 */
export class BlockchainAdapterFactory {
  private static adapters = new Map<string, BlockchainAdapter>();

  static async getAdapter(mode: 'development' | 'staging' | 'production'): Promise<BlockchainAdapter> {
    if (this.adapters.has(mode)) {
      const adapter = this.adapters.get(mode);
      if (adapter) {
        return adapter;
      }
    }

    registerBlockchainAdapters();

    switch (mode) {
    case 'development': {
      const devAdapter = await createBlockchainAdapter('simulated');
      this.adapters.set(mode, devAdapter);
      return devAdapter;
    }

    case 'staging': {
      const stagingConfig = {
        rpcUrl: process.env.NEXT_PUBLIC_STAGING_RPC_URL || 'https://staging-rpc.example.com',
        network: 'testnet' as const,
        contractAddress: process.env.NEXT_PUBLIC_STAGING_CONTRACT_ADDRESS || '0x1234567890123456789012345678901234567890',
        type: 'real',
        timeout: 30000,
      };
      const stagingAdapter = await createBlockchainAdapter('real', stagingConfig);
      this.adapters.set(mode, stagingAdapter);
      return stagingAdapter;
    }

    case 'production': {
      const prodConfig = {
        rpcUrl: process.env.NEXT_PUBLIC_RPC_URL || 'https://mainnet.infura.io/v3/YOUR-PROJECT-ID',
        network: 'mainnet' as const,
        contractAddress: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '0x1234567890123456789012345678901234567890',
        type: 'real',
        timeout: 60000,
        gasPrice: '50', // Higher gas price for mainnet
      };
      const prodAdapter = await createBlockchainAdapter('real', prodConfig);
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

// BlockchainAdapterFactory is already exported above
