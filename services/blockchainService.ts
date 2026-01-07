// src/services/blockchainService.ts

import { BlockchainRecord } from '@/types/blockchain';
import { CreateProduct } from '@/types/product';
import { ErrorHandler, AppError } from '../lib/errorHandler';

export interface BlockchainServiceConfig {
  network: 'mainnet' | 'testnet' | 'localhost';
  contractAddress?: string;
  rpcUrl?: string;
}

export interface TransactionResult {
  success: boolean;
  transactionHash?: string;
  blockHash?: string;
  error?: string;
  gasUsed?: string;
}

export interface VerificationResult {
  success: boolean;
  newVerificationCount: number;
  timestamp: string;
  verifiedBy: string;
  transactionHash?: string;
}

export class BlockchainService {
  private config: BlockchainServiceConfig;
  private isInitialized = false;

  constructor(config: BlockchainServiceConfig) {
    this.config = config;
  }

  async initialize(): Promise<void> {
    try {
      // Initialize blockchain connection
      // This would connect to actual blockchain in production
      console.log(`Initializing blockchain service on ${this.config.network}`);
      
      // Simulate initialization
      await new Promise(resolve => setTimeout(resolve, 100));
      
      this.isInitialized = true;
      console.log('Blockchain service initialized successfully');
    } catch (error) {
      throw ErrorHandler.handleBlockchainError(error, 'initialize');
    }
  }

  async createProductRecord(
    product: CreateProduct,
    farmerName: string,
    farmerAddress: string
  ): Promise<BlockchainRecord> {
    if (!this.isInitialized) {
      throw ErrorHandler.handleBlockchainError(
        new Error('Blockchain service not initialized'),
        'createProductRecord'
      );
    }

    try {
      // Validate input data
      this.validateProductData(product, farmerName, farmerAddress);

      // Create blockchain record
      const record: BlockchainRecord = {
        id: `BLK${Date.now()}`,
        productName: product.name,
        description: product.description,
        category: product.category,
        farmer: farmerName,
        farmerAddress,
        location: product.location,
        harvestDate: product.harvestDate,
        certifications: product.certifications || [],
        batchSize: product.batchSize,
        photos: product.photos || [],
        blockHash: this.generateMockBlockHash(),
        timestamp: Date.now(),
        status: 'Certified',
        txHash: this.generateMockTxHash(),
        verified: false,
        transactionFee: this.calculateTransactionFee(product),
        verifications: 0,
      };

      // Simulate blockchain transaction
      const txResult = await this.simulateTransaction('createProduct', record);
      
      if (!txResult.success) {
        throw new Error(txResult.error || 'Transaction failed');
      }

      // Update record with transaction details
      record.txHash = txResult.transactionHash;
      record.blockHash = txResult.blockHash;
      record.status = 'Certified';

      return record;
    } catch (error) {
      throw ErrorHandler.handleBlockchainError(error, 'createProductRecord');
    }
  }

  async verifyProduct(
    productId: string,
    verifierRole: string
  ): Promise<VerificationResult> {
    if (!this.isInitialized) {
      throw ErrorHandler.handleBlockchainError(
        new Error('Blockchain service not initialized'),
        'verifyProduct'
      );
    }

    try {
      // Validate inputs
      if (!productId || !verifierRole) {
        throw ErrorHandler.handleValidationError(
          'Product ID and verifier role are required',
          'verifyProduct'
        );
      }

      // Simulate verification transaction
      const txResult = await this.simulateTransaction('verifyProduct', {
        productId,
        verifierRole,
        timestamp: Date.now(),
      });

      if (!txResult.success) {
        throw new Error(txResult.error || 'Verification failed');
      }

      return {
        success: true,
        newVerificationCount: 1, // In real implementation, would fetch current count + 1
        timestamp: new Date().toISOString(),
        verifiedBy: verifierRole,
        transactionHash: txResult.transactionHash,
      };
    } catch (error) {
      throw ErrorHandler.handleBlockchainError(error, 'verifyProduct');
    }
  }

  async getProductHistory(productId: string): Promise<BlockchainRecord[]> {
    if (!this.isInitialized) {
      throw ErrorHandler.handleBlockchainError(
        new Error('Blockchain service not initialized'),
        'getProductHistory'
      );
    }

    try {
      // In a real implementation, this would query the blockchain
      // For now, return empty array as placeholder
      return [];
    } catch (error) {
      throw ErrorHandler.handleBlockchainError(error, 'getProductHistory');
    }
  }

  async getTransactionStatus(txHash: string): Promise<TransactionResult> {
    try {
      // Simulate transaction status check
      await new Promise(resolve => setTimeout(resolve, 50));
      
      return {
        success: true,
        transactionHash: txHash,
        blockHash: this.generateMockBlockHash(),
      };
    } catch (error) {
      throw ErrorHandler.handleBlockchainError(error, 'getTransactionStatus');
    }
  }

  private validateProductData(
    product: CreateProduct,
    farmerName: string,
    farmerAddress: string
  ): void {
    if (!product.name || product.name.trim().length < 2) {
      throw ErrorHandler.handleValidationError(
        'Product name must be at least 2 characters',
        'name'
      );
    }

    if (!product.description || product.description.trim().length < 10) {
      throw ErrorHandler.handleValidationError(
        'Description must be at least 10 characters',
        'description'
      );
    }

    if (!farmerName || farmerName.trim().length < 2) {
      throw ErrorHandler.handleValidationError(
        'Farmer name is required',
        'farmerName'
      );
    }

    if (!farmerAddress || !this.isValidAddress(farmerAddress)) {
      throw ErrorHandler.handleValidationError(
        'Invalid farmer address',
        'farmerAddress'
      );
    }

    if (!product.harvestDate) {
      throw ErrorHandler.handleValidationError(
        'Harvest date is required',
        'harvestDate'
      );
    }
  }

  private isValidAddress(address: string): boolean {
    // Basic Ethereum address validation
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  }

  private calculateTransactionFee(product: CreateProduct): number {
    // Simulate gas calculation based on product data size
    const baseFee = 0.001;
    const dataComplexity = JSON.stringify(product).length;
    return baseFee + (dataComplexity * 0.000001);
  }

  private generateMockBlockHash(): string {
    return '0x' + Array.from({ length: 64 }, () => 
      Math.floor(Math.random() * 16).toString(16)
    ).join('');
  }

  private generateMockTxHash(): string {
    return '0x' + Array.from({ length: 66 }, () => 
      Math.floor(Math.random() * 16).toString(16)
    ).join('');
  }

  private async simulateTransaction(
    operation: string,
    data: any
  ): Promise<TransactionResult> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 200 + Math.random() * 800));

    // Simulate occasional failures (5% failure rate for demo)
    if (Math.random() < 0.05) {
      return {
        success: false,
        error: `Simulated transaction failure for ${operation}`,
      };
    }

    return {
      success: true,
      transactionHash: this.generateMockTxHash(),
      blockHash: this.generateMockBlockHash(),
      gasUsed: (21000 + Math.floor(Math.random() * 100000)).toString(),
    };
  }

  getConfig(): BlockchainServiceConfig {
    return { ...this.config };
  }

  isReady(): boolean {
    return this.isInitialized;
  }
}

// Singleton instance for the application
let blockchainService: BlockchainService | null = null;

export function getBlockchainService(): BlockchainService {
  if (!blockchainService) {
    const config: BlockchainServiceConfig = {
      network: process.env.NEXT_PUBLIC_BLOCKCHAIN_NETWORK as any || 'localhost',
      contractAddress: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
      rpcUrl: process.env.NEXT_PUBLIC_RPC_URL,
    };
    
    blockchainService = new BlockchainService(config);
  }
  
  return blockchainService;
}

// Initialize the service on app startup
export async function initializeBlockchainService(): Promise<void> {
  const service = getBlockchainService();
  await service.initialize();
}
