// src/features/traceability/types/traceabilityTypes.ts
// Traceability and blockchain types for product tracking

export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  images: string[];
  farmer: {
    name: string;
    location: string;
    certification: string;
  };
  qrCode: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductEvent {
  id: string;
  productId: string;
  type: 'harvest' | 'processing' | 'packaging' | 'shipping' | 'delivery' | 'quality_check';
  timestamp: Date;
  location: string;
  description: string;
  metadata: Record<string, unknown>;
  verified: boolean;
  blockchainHash?: string;
}

export interface TraceabilityQuery {
  productId: string;
  qrCode?: string;
  batchNumber?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
}

export interface TraceabilityResponse {
  product: Product;
  events: ProductEvent[];
  verificationStatus: 'verified' | 'pending' | 'failed';
  blockchainVerified: boolean;
}

// Re-export blockchain types for compatibility
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
}

import { ProductCategory } from '@/types/product';

export interface BlockchainRecord {
  id: string;
  name?: string; // Added for compatibility
  productName?: string;
  description?: string;
  category?: ProductCategory;
  farmer?: string;
  farmerName?: string; 
  farmerId?: string; 
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
