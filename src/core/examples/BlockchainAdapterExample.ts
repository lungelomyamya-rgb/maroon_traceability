// src/core/examples/BlockchainAdapterExample.ts
// Example of how to switch between blockchain adapters

import { registerBlockchainAdapters, createBlockchainAdapter } from '../adapters/blockchain';
import type { RealBlockchainConfig } from '../adapters/blockchain/RealBlockchainAdapter';
import type { SimulatedBlockchainConfig } from '../adapters/blockchain/SimulatedBlockchainAdapter';
import type { BlockchainAdapter } from '../types/adapter';

/**
 * Example: Initialize adapters and switch between them
 */
export async function demonstrateBlockchainAdapterSwitching() {
  console.log('=== Blockchain Adapter Demonstration ===');

  // Register all available adapters
  registerBlockchainAdapters();

  // Example 1: Use simulated adapter (default)
  console.log('\n1. Using Simulated Blockchain Adapter:');
  const simulatedAdapter = await createBlockchainAdapter('simulated');
  console.log('Adapter ID:', simulatedAdapter.id);
  console.log('Adapter Type:', simulatedAdapter.type);

  // Test product creation with simulated adapter
  const productData = {
    name: 'Organic Tomatoes',
    category: 'Vegetables',
    description: 'Fresh organic tomatoes from local farm',
    location: 'Stellenbosch, Western Cape',
    harvestDate: '2024-01-15',
    batchSize: 100,
  };

  const createResult = await simulatedAdapter.createProductRecord(
    productData,
    'John Farmer',
    '0x1234567890123456789012345678901234567890',
  );

  console.log('Product Creation Result:', createResult.success ? 'SUCCESS' : 'FAILED');
  if (createResult.success && createResult.data) {
    console.log('Product ID:', createResult.data.id);
    console.log('Transaction Hash:', createResult.data.txHash);
  }

  // Example 2: Switch to real adapter
  console.log('\n2. Switching to Real Blockchain Adapter:');
  const realConfig: RealBlockchainConfig = {
    rpcUrl: 'https://mainnet.infura.io/v3/YOUR-PROJECT-ID',
    network: 'mainnet',
    contractAddress: '0x1234567890123456789012345678901234567890',
    type: 'real',
    timeout: 60000,
    gasPrice: '50',
  };

  try {
    const realAdapter = await createBlockchainAdapter('real', realConfig as unknown as Record<string, unknown>);
    console.log('Adapter ID:', realAdapter.id);
    console.log('Adapter Type:', realAdapter.type);
    console.log('Network:', realConfig.network);

    // Note: This would fail in demo mode without real blockchain connection
    console.log('Real blockchain adapter ready for production use');
  } catch (_error) {
    console.log('Real blockchain adapter requires valid RPC configuration');
  }

  // Example 3: Environment-based adapter selection
  console.log('\n3. Environment-Based Adapter Selection:');
  const isDevelopment = process.env.NODE_ENV === 'development';
  const isProduction = process.env.NODE_ENV === 'production';

  let adapter;
  if (isDevelopment) {
    adapter = await createBlockchainAdapter('simulated');
    console.log('Development mode: Using simulated blockchain');
  } else if (isProduction) {
    adapter = await createBlockchainAdapter('real', realConfig as unknown as Record<string, unknown>);
    console.log('Production mode: Using real blockchain');
  } else {
    adapter = await createBlockchainAdapter('simulated');
    console.log('Default: Using simulated blockchain');
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
 * Example: Product traceability workflow
 */
export async function demonstrateProductTraceability() {
  console.log('=== Product Traceability Workflow ===');

  registerBlockchainAdapters();

  // Use simulated adapter for demo
  const adapter = await createBlockchainAdapter('simulated');
  await adapter.initialize();

  try {
    // Step 1: Create product record
    console.log('\n1. Creating product record...');
    const product = {
      name: 'Premium Coffee Beans',
      category: 'Coffee',
      description: 'Single-origin coffee beans from Ethiopian highlands',
      location: 'Ethiopian Highlands',
      harvestDate: '2024-02-01',
      batchSize: 500,
    };

    const createResult = await adapter.createProductRecord(
      product,
      'Coffee Farmer Co-op',
      '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
    );

    if (!createResult.success || !createResult.data) {
      throw new Error('Failed to create product record');
    }

    const productId = createResult.data.id;
    console.log('Product created with ID:', productId);

    // Step 2: Verify product
    console.log('\n2. Verifying product...');
    const verifyResult = await adapter.verifyProduct(
      productId,
      'Quality Inspector',
      '0x1234567890123456789012345678901234567890',
    );

    console.log('Verification Result:', verifyResult.success ? 'SUCCESS' : 'FAILED');
    if (verifyResult.success && verifyResult.data) {
      console.log('Verification Count:', verifyResult.data.newVerificationCount);
      console.log('Verified By:', verifyResult.data.verifiedBy);
    }

    // Step 3: Get product history
    console.log('\n3. Getting product history...');
    const historyResult = await adapter.getProductHistory(productId);

    console.log('History Result:', historyResult.success ? 'SUCCESS' : 'FAILED');
    if (historyResult.success && historyResult.data) {
      console.log('Records Found:', historyResult.data.length);
      historyResult.data.forEach((record) => {
        console.log(`- ${record.productName} (${record.status})`);
      });
    }

    // Step 4: Transfer ownership
    console.log('\n4. Transferring ownership...');
    const transferResult = await adapter.transferOwnership(
      productId,
      '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
      '0x1234567890123456789012345678901234567890',
      {
        transferType: 'sale',
        price: '2.5 ETH',
        timestamp: Date.now(),
      },
    );

    console.log('Transfer Result:', transferResult.success ? 'SUCCESS' : 'FAILED');
    if (transferResult.success && transferResult.data) {
      console.log('Transaction Hash:', transferResult.data.transactionHash);
    }

    // Step 5: Get blockchain status
    console.log('\n5. Getting blockchain status...');
    const statusResult = await adapter.getBlockchainStatus();

    console.log('Status Result:', statusResult.success ? 'SUCCESS' : 'FAILED');
    if (statusResult.success && statusResult.data) {
      console.log('Network:', statusResult.data.network);
      console.log('Block Number:', statusResult.data.blockNumber);
      console.log('Gas Price:', statusResult.data.gasPrice);
      console.log('Is Connected:', statusResult.data.isConnected);
    }

  } catch (error: unknown) {
    console.error('Traceability workflow failed:', error instanceof Error ? error.message : String(error));
  } finally {
    await adapter.cleanup();
  }

  console.log('\n=== Traceability Workflow Complete ===');
}

/**
 * Example: Configuration-based adapter switching
 */
export class BlockchainServiceFactory {
  private static adapters = new Map<string, BlockchainAdapter>();

  static async getAdapter(mode: 'development' | 'staging' | 'production'): Promise<BlockchainAdapter> {
    const adapter = this.adapters.get(mode);
    if (adapter) {
      return adapter;
    }

    registerBlockchainAdapters();

    switch (mode) {
    case 'development': {
      const devAdapter = await createBlockchainAdapter('simulated');
      this.adapters.set(mode, devAdapter);
      return devAdapter;
    }

    case 'staging': {
      const stagingConfig: SimulatedBlockchainConfig = {
        network: 'testnet',
        gasPrice: '10',
        blockTime: 5000, // Faster blocks for testing
        type: 'mock',
      };
      const stagingAdapter = await createBlockchainAdapter('simulated', stagingConfig as unknown as Record<string, unknown>);
      this.adapters.set(mode, stagingAdapter);
      return stagingAdapter;
    }

    case 'production': {
      const prodConfig: RealBlockchainConfig = {
        rpcUrl: process.env.NEXT_PUBLIC_RPC_URL || 'https://mainnet.infura.io/v3/YOUR-PROJECT-ID',
        network: 'mainnet',
        contractAddress: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '0x1234567890123456789012345678901234567890',
        type: 'real',
        timeout: 60000,
        gasPrice: '50',
      };
      const prodAdapter = await createBlockchainAdapter('real', prodConfig as unknown as Record<string, unknown>);
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

// BlockchainServiceFactory is already exported above
