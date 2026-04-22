// src/core/adapters/blockchain/SimulatedBlockchainAdapter.ts
// Simulated blockchain adapter for development and testing

import type {
  BlockchainAdapter,
  BlockchainRecord,
  TransactionResult,
  VerificationResult,
  BlockchainStatus,
  AdapterResult,
  AdapterConfig,
} from '../../types/adapter';

export interface SimulatedBlockchainConfig extends AdapterConfig {
  /** Network simulation mode */
  network?: 'mainnet' | 'testnet' | 'localhost';
  /** Contract address for simulation */
  contractAddress?: string;
  /** Gas price simulation */
  gasPrice?: string;
  /** Block time simulation in milliseconds */
  blockTime?: number;
}

export class SimulatedBlockchainAdapter implements BlockchainAdapter {
  readonly id = 'simulated-blockchain';
  readonly type = 'mock' as const;
  readonly isAvailable = true;

  private config: SimulatedBlockchainConfig;
  private isInitialized = false;
  private records: Map<string, BlockchainRecord> = new Map();
  private transactions: Map<string, TransactionResult> = new Map();
  private blockNumber = 0;
  private networkStatus: BlockchainStatus;

  constructor(config?: SimulatedBlockchainConfig) {
    this.config = {
      type: 'mock',
      network: 'testnet',
      gasPrice: '20',
      blockTime: 15000, // 15 seconds
      contractAddress: '0x1234567890123456789012345678901234567890',
      ...config,
    };

    this.networkStatus = {
      network: this.config.network || 'unknown',
      blockNumber: 0,
      gasPrice: this.config.gasPrice || '20000000000',
      isConnected: false,
      contractAddress: this.config.contractAddress,
    };
  }

  async initialize(): Promise<void> {
    // Simulate initialization delay
    await this.delay(100);

    this.isInitialized = true;
    this.networkStatus.isConnected = true;
    this.networkStatus.blockNumber = this.blockNumber;

    // Start block mining simulation
    this.startBlockMining();

    console.log(`SimulatedBlockchainAdapter initialized on ${this.config.network}`);
  }

  async cleanup(): Promise<void> {
    this.isInitialized = false;
    this.networkStatus.isConnected = false;
    this.records.clear();
    this.transactions.clear();
    console.log('SimulatedBlockchainAdapter cleaned up');
  }

  private delay(ms: number = 1000): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private startBlockMining(): void {
    setInterval(() => {
      if (this.isInitialized) {
        this.blockNumber++;
        this.networkStatus.blockNumber = this.blockNumber;
        this.networkStatus.lastBlockTime = Date.now();
      }
    }, this.config.blockTime || 15000);
  }

  private generateMockBlockHash(): string {
    return `0x${Math.random().toString(16).substr(2, 64)}`;
  }

  private generateMockTxHash(): string {
    return `0x${Math.random().toString(16).substr(2, 64)}`;
  }

  private calculateTransactionFee(product: Record<string, unknown>): string {
    // Simulate gas calculation based on data size
    const dataSize = JSON.stringify(product).length;
    const gasUnits = dataSize * 10 + 21000; // Base gas + data gas
    const gasPrice = parseInt(this.config.gasPrice || '20000000000');
    return (gasUnits * gasPrice).toString();
  }

  private async simulateTransaction(_operation: string, _data: unknown): Promise<TransactionResult> {
    await this.delay(500); // Simulate network delay

    const txHash = this.generateMockTxHash();
    const blockHash = this.generateMockBlockHash();

    const result: TransactionResult = {
      success: true,
      transactionHash: txHash,
      blockHash,
      gasUsed: '25000',
      blockNumber: this.blockNumber,
      confirmations: 1,
    };

    this.transactions.set(txHash, result);
    return result;
  }

  private validateProductData(product: Record<string, unknown>, farmerName: string, farmerAddress: string): void {
    if (!product.name || !product.category || !farmerName || !farmerAddress) {
      throw new Error('Missing required product data');
    }
  }

  async createProductRecord(
    product: Record<string, unknown>,
    farmerName: string,
    farmerAddress: string,
  ): Promise<AdapterResult<BlockchainRecord>> {
    if (!this.isInitialized) {
      return {
        success: false,
        error: 'Blockchain adapter not initialized',
      };
    }

    try {
      // Validate input data
      this.validateProductData(product, farmerName, farmerAddress);

      // Create blockchain record
      const record: BlockchainRecord = {
        id: `BLK${Date.now()}`,
        productName: String(product.name || ''),
        description: String(product.description || ''),
        category: String(product.category || ''),
        farmer: farmerName,
        farmerAddress,
        location: String(product.location || ''),
        harvestDate: String(product.harvestDate || new Date().toISOString()),
        certifications: Array.isArray(product.certifications) ? product.certifications : [],
        batchSize: typeof product.batchSize === 'number' ? product.batchSize : 1,
        photos: Array.isArray(product.photos) ? product.photos : [],
        blockHash: this.generateMockBlockHash(),
        timestamp: Date.now(),
        status: 'Certified',
        txHash: this.generateMockTxHash(),
        verified: false,
        verifications: 0,
        transactionFee: this.calculateTransactionFee(product),
      };

      // Simulate blockchain transaction
      const txResult = await this.simulateTransaction('createProduct', record);

      if (!txResult.success) {
        return {
          success: false,
          error: txResult.error || 'Transaction failed',
        };
      }

      // Update record with transaction details
      record.txHash = txResult.transactionHash || '';
      record.blockHash = txResult.blockHash || '';

      // Store record
      this.records.set(record.id, record);

      return {
        success: true,
        data: record,
        metadata: {
          transactionHash: txResult.transactionHash,
        },
      };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create product record';
      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  async getProductHistory(productId: string): Promise<AdapterResult<BlockchainRecord[]>> {
    if (!this.isInitialized) {
      return {
        success: false,
        error: 'Blockchain adapter not initialized',
      };
    }

    try {
      const record = this.records.get(productId);
      if (!record) {
        return {
          success: true,
          data: [],
        };
      }

      // In a real implementation, this would fetch the full transaction history
      // For simulation, we return the single record
      return {
        success: true,
        data: [record],
      };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to get product history';
      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  async verifyProduct(
    productId: string,
    verifierName: string,
    verifierAddress: string,
  ): Promise<AdapterResult<VerificationResult>> {
    if (!this.isInitialized) {
      return {
        success: false,
        error: 'Blockchain adapter not initialized',
      };
    }

    try {
      const record = this.records.get(productId);
      if (!record) {
        return {
          success: false,
          error: 'Product not found',
        };
      }

      // Simulate verification transaction
      const txResult = await this.simulateTransaction('verifyProduct', {
        productId,
        verifierName,
        verifierAddress,
      });

      if (!txResult.success) {
        return {
          success: false,
          error: txResult.error || 'Verification transaction failed',
        };
      }

      // Update record
      record.verifications += 1;
      record.verified = record.verifications > 0;

      const verificationResult: VerificationResult = {
        success: true,
        newVerificationCount: record.verifications,
        timestamp: new Date().toISOString(),
        verifiedBy: verifierName,
        transactionHash: txResult.transactionHash || '',
        verificationScore: Math.min(record.verifications * 10, 100),
      };

      return {
        success: true,
        data: verificationResult,
        metadata: {
          transactionHash: txResult.transactionHash,
          verificationScore: verificationResult.verificationScore,
        },
      };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to verify product';
      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  async transferOwnership(
    productId: string,
    fromAddress: string,
    toAddress: string,
    transferData: Record<string, unknown>,
  ): Promise<AdapterResult<TransactionResult>> {
    if (!this.isInitialized) {
      return {
        success: false,
        error: 'Blockchain adapter not initialized',
      };
    }

    try {
      const record = this.records.get(productId);
      if (!record) {
        return {
          success: false,
          error: 'Product not found',
        };
      }

      // Simulate ownership transfer
      const txResult = await this.simulateTransaction('transferOwnership', {
        productId,
        fromAddress,
        toAddress,
        transferData,
      });

      if (!txResult.success) {
        return {
          success: false,
          error: txResult.error || 'Transfer transaction failed',
        };
      }

      // Update record (in real implementation, this would be handled by smart contract)
      const updatedRecord = {
        ...record,
        farmerAddress: toAddress,
        txHash: txResult.transactionHash || 'unknown',
        blockHash: txResult.blockHash || 'unknown',
      };

      this.records.set(productId, updatedRecord);

      return {
        success: true,
        data: txResult,
      };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to transfer ownership';
      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  async getTransaction(transactionHash: string): Promise<AdapterResult<TransactionResult>> {
    if (!this.isInitialized) {
      return {
        success: false,
        error: 'Blockchain adapter not initialized',
      };
    }

    try {
      const transaction = this.transactions.get(transactionHash);
      if (!transaction) {
        return {
          success: false,
          error: 'Transaction not found',
        };
      }

      return {
        success: true,
        data: transaction,
      };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to get transaction';
      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  async getBlockchainStatus(): Promise<AdapterResult<BlockchainStatus>> {
    if (!this.isInitialized) {
      return {
        success: false,
        error: 'Blockchain adapter not initialized',
      };
    }

    try {
      return {
        success: true,
        data: { ...this.networkStatus },
      };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to get blockchain status';
      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  async getAccountBalance(address: string): Promise<AdapterResult<string>> {
    if (!this.isInitialized) {
      return {
        success: false,
        error: 'Blockchain adapter not initialized',
      };
    }

    try {
      // Simulate balance check
      const balance = (Math.random() * 1000).toFixed(4);
      return {
        success: true,
        data: balance,
        metadata: {
          address,
          unit: 'ETH',
          timestamp: Date.now(),
        },
      };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to get account balance';
      return {
        success: false,
        error: errorMessage,
      };
    }
  }
}
