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

// Import blockchain types from unified types for consistency
import { BlockchainTransaction, TransactionResponse, SendTransactionParams, BlockchainEvent, BlockchainRecord } from '@/types/blockchain';
import { ProductCategory as _ProductCategory } from '@/types/product';

// Re-export for backward compatibility
export type { BlockchainTransaction, TransactionResponse, SendTransactionParams, BlockchainEvent, BlockchainRecord };
