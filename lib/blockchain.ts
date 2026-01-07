// src/lib/blockchain.ts
import { BlockchainRecord } from '@/types/blockchain';
import { CreateProduct } from '@/types/product';
import { generateBlockHash, generateAddress, generateBlockId } from './utils';

type TransactionParam = string | number | boolean | Record<string, unknown> | TransactionParam[];

export function createBlockchainRecord(
  product: CreateProduct,
  currentRecordsLength: number,
  farmerName: string = 'Current Farm'
): BlockchainRecord {
  return {
    id: generateBlockId(currentRecordsLength),
    productName: product.name,  // Map name to productName
    category: product.category,
    location: product.location,
    description: product.description || '',
    harvestDate: product.harvestDate,
    batchSize: product.batchSize,
    certifications: product.certifications || [],
    farmer: farmerName,
    farmerAddress: generateAddress(),
    blockHash: generateBlockHash(),
    txHash: generateBlockHash(),
    verified: true,
    timestamp: Date.now(),
    status: 'Certified',
    transactionFee: Math.random() * 0.005 + 0.001,
    verifications: 1,
  };
}

export function incrementVerification(record: BlockchainRecord): BlockchainRecord {
  return {
    ...record,
    verifications: (record.verifications || 0) + 1,
  };
}

export const mockBlockchain = {
  async sendTransaction(method: string, params: TransactionParam[]) {
    console.log('Mock blockchain transaction:', { method, params });
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate block time
    
    // Simulate random failures (10% chance)
    if (Math.random() < 0.1) {
      throw new Error('Blockchain transaction failed (simulated)');
    }
    
    return {
      hash: `0x${Math.random().toString(16).substr(2, 64)}`,
      blockNumber: Math.floor(Math.random() * 10000),
    };
  },
};