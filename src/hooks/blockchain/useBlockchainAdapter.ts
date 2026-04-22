// hooks/blockchain/useBlockchainAdapter.ts
// Hook for accessing the current blockchain adapter

import { useState, useEffect } from 'react';
import { BlockchainAdapterFactory } from '@/core/adapters/blockchain';
import type { BlockchainAdapter, BlockchainStatus } from '@/core/types/adapter';

/**
 * Hook to get the current blockchain adapter
 * Returns the adapter that is currently active based on configuration
 */
export function useBlockchainAdapter(): BlockchainAdapter {
  // For now, we'll return a default adapter based on environment
  // In the future, this will be determined by the hybrid mode manager
  const mode = process.env.NODE_ENV === 'production' ? 'production' : 'development';

  // Note: In a real implementation, this should be managed by a context provider
  // For now, we'll create a singleton instance
  if (!useBlockchainAdapter.adapter) {
    useBlockchainAdapter.createAdapter(mode);
  }

  if (!useBlockchainAdapter.adapter) {
    throw new Error('Blockchain adapter not initialized');
  }
  return useBlockchainAdapter.adapter;
}

// Static property to store the adapter instance
useBlockchainAdapter.adapter = null as BlockchainAdapter | null;

// Static method to create the adapter
useBlockchainAdapter.createAdapter = async (mode: 'development' | 'staging' | 'production') => {
  useBlockchainAdapter.adapter = await BlockchainAdapterFactory.getAdapter(mode);
  return useBlockchainAdapter.adapter;
};

/**
 * Hook to get blockchain functionality
 * Provides a convenient interface for components to interact with blockchain
 */
export function useBlockchain() {
  const adapter = useBlockchainAdapter();

  return {
    createProductRecord: adapter.createProductRecord.bind(adapter),
    getProductHistory: adapter.getProductHistory.bind(adapter),
    verifyProduct: adapter.verifyProduct.bind(adapter),
    transferOwnership: adapter.transferOwnership.bind(adapter),
    getTransaction: adapter.getTransaction.bind(adapter),
    getBlockchainStatus: adapter.getBlockchainStatus.bind(adapter),
    getAccountBalance: adapter.getAccountBalance.bind(adapter),
    isInitialized: adapter.isAvailable,
  };
}

/**
 * Hook to get blockchain status only
 * Useful when you just need network information without operations
 */
export function useBlockchainStatus() {
  const { getBlockchainStatus } = useBlockchain();
  const [status, setStatus] = useState<BlockchainStatus | null>(null);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const result = await getBlockchainStatus();
        if (result.success && result.data) {
          setStatus(result.data);
        }
      } catch (error) {
        console.error('Failed to fetch blockchain status:', error);
      }
    };

    fetchStatus();

    // Set up polling for status updates
    const interval = setInterval(fetchStatus, 30000); // 30 seconds
    return () => clearInterval(interval);
  }, [getBlockchainStatus]);

  return status;
}

/**
 * Hook to get account balance
 * Useful for wallet-like functionality
 */
export function useAccountBalance(address?: string) {
  const { getAccountBalance } = useBlockchain();
  const [balance, setBalance] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!address) {
      return;
    }

    const fetchBalance = async () => {
      setLoading(true);
      try {
        const result = await getAccountBalance(address);
        if (result.success && result.data) {
          setBalance(result.data);
        }
      } catch (error) {
        console.error('Failed to fetch account balance:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBalance();
  }, [address, getAccountBalance]);

  return { balance, loading };
}
