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

import { ProductCategory } from '@/types/product';

export interface BlockchainRecord {
  id: string;
  name?: string; // Added for compatibility
  productName?: string;
  description?: string;
  category?: ProductCategory;
  farmer?: string;
  farmerName?: string; // Added for compatibility
  farmerId?: string; // Added for compatibility
  location?: string;
  harvestDate?: string;
  photos?: string[];
  certifications?: string[];
  timestamp?: string | number;
  txHash?: string;
  verified?: boolean;
  status?: 'Certified' | 'In Transit' | 'Delivered' | 'pending' | 'verified' | 'rejected' | 'draft' | 'published'; // Expanded status options
  batchSize?: string;
  blockHash?: string;
  farmerAddress?: string;
  transactionFee?: number;
  verifications?: number;
  isPublic?: boolean;
  createdAt?: string; // Added for compatibility
  updatedAt?: string; // Added for compatibility
  metadata?: Record<string, unknown>; // Added for compatibility
  qrCode?: string; // Added for compatibility
  batchNumber?: string; // Added for compatibility
  origin?: string; // Added for compatibility
  verificationCount?: number; // Added for compatibility
  lastVerified?: string | null; // Added for compatibility
}
