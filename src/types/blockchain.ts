// In src/types/blockchain.ts
export interface BlockchainTransaction {
  hash: string;
  from: string;
  to: string;
  value: string;
  timestamp: number;
  status: 'pending' | 'success' | 'failed';
  blockNumber?: number;
  gasUsed?: number;
  transactionFee: number;
  verifications: number;
  description?: string;
}

export interface TransactionResponse {
  success: boolean;
  txHash: string;
  error?: string;
}

export interface SendTransactionParams {
  method: string;
  params: unknown[];
}

export interface BlockchainEvent {
  type: string;
  data: Record<string, unknown>;
  timestamp: number;
  txHash: string;
}

import { ProductCategory } from './product';

export interface BlockchainRecord {
  id: string;
  productName: string;
  category: ProductCategory;
  farmer: string;
  location: string;
  harvestDate: string;
  photos?: string[];
  certifications: string[];
  timestamp: string | number;
  txHash: string;
  verified: boolean;
  status?: 'Certified' | 'In Transit' | 'Delivered';
  batchSize?: string;
  blockHash?: string;
  farmerAddress?: string;
  transactionFee?: number;
  verifications: number;
}
