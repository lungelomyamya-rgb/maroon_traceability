// src/types/blockchain.ts
import { ProductCategory } from './product';

export interface BlockchainRecord {
  id: string;
  productName: string;
  category: ProductCategory;
  farmer: string;
  farmerAddress: string;
  location: string;
  harvestDate: string;
  certifications: string[];
  batchSize: string;
  blockHash: string;
  timestamp: string;
  status: 'Certified' | 'In Transit' | 'Delivered';
  transactionFee: number;
  verifications: number;
  description?: string;
}