// src/constants/demoData.ts

import { BlockchainRecord } from '@/types/blockchain';
import { ProductCategory } from '@/types/product';

export const INITIAL_BLOCKCHAIN_RECORDS: BlockchainRecord[] = [
  {
    id: 'BLK001',
    productName: 'Organic Apples',
    category: ProductCategory.FRUITS,
    farmer: 'Green Valley Farm',
    farmerAddress: '0x742d35Cc6634C0532925a3b8D1750B87B02B6C71',
    location: 'Stellenbosch, Western Cape',
    harvestDate: '2025-09-10',
    certifications: ['Organic', 'Fair Trade'],
    batchSize: '500kg',
    blockHash: '0x4f3c2a1b8e7d6c5a9b8e7f6d5c4a3b2c1d0e9f8a',
    timestamp: new Date('2025-09-10T08:30:00Z').getTime(),
    status: 'Certified',
    txHash: '0x4f3c2a1b8e7d6c5a9b8e7f6d5c4a3b2c1d0e9f8a',
    verified: true,
    transactionFee: 0.002,
    verifications: 3,
  },
  {
    id: 'BLK002',
    productName: 'Free-Range Eggs',
    category: ProductCategory.POULTRY,
    farmer: 'Sunrise Poultry',
    farmerAddress: '0x8b3e4d2a1c9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d',
    location: 'Robertson, Western Cape',
    harvestDate: '2025-09-11',
    certifications: ['Free-Range', 'Animal Welfare Approved'],
    batchSize: '1200 eggs',
    blockHash: '0x7e6d5c4b3a2f1e0d9c8b7a6f5e4d3c2b1a0f9e8d',
    timestamp: new Date('2025-09-11T06:15:00Z').getTime(),
    status: 'In Transit',
    txHash: '0x7e6d5c4b3a2f1e0d9c8b7a6f5e4d3c2b1a0f9e8d',
    verified: true,
    transactionFee: 0.0015,
    verifications: 1,
  },
  {
    id: 'BLK003',
    productName: 'Grass-Fed Beef',
    category: ProductCategory.BEEF,
    farmer: 'Karoo Cattle Co.',
    farmerAddress: '0x9c4f5e6d7a8b9c0e1f2a3b4c5d6e7f8a9b0c1d2e',
    location: 'Graaff-Reinet, Eastern Cape',
    harvestDate: '2025-09-12',
    certifications: ['Organic', 'Animal Welfare Approved', 'Sustainable'],
    batchSize: '250kg',
    blockHash: '0x8f7e6d5c4b3a2f1e0d9c8b7a6f5e4d3c2b1a0f9e',
    timestamp: new Date('2025-09-12T10:20:00Z').getTime(),
    status: 'Certified',
    txHash: '0x8f7e6d5c4b3a2f1e0d9c8b7a6f5e4d3c2b1a0f9e',
    verified: true,
    transactionFee: 0.0025,
    verifications: 5,
  },
  {
    id: 'BLK004',
    productName: 'Fresh Spinach',
    category: ProductCategory.VEGETABLES,
    farmer: 'Leafy Greens Farm',
    farmerAddress: '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b',
    location: 'Paarl, Western Cape',
    harvestDate: '2025-09-13',
    certifications: ['Organic', 'Local'],
    batchSize: '150kg',
    blockHash: '0x2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c',
    timestamp: new Date('2025-09-13T07:30:00Z').getTime(),
    status: 'Certified',
    txHash: '0x2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c',
    verified: true,
    transactionFee: 0.0012,
    verifications: 2,
  },
];

export const AVAILABLE_CERTIFICATIONS = [
  'Organic',
  'Fair Trade',
  'Non-GMO',
  'Gluten-Free',
  'Animal Welfare Approved',
  'Sustainable Farming',
  'Local',
  'Natural',
  'Certified Humane',
  'Rainforest Alliance'
];

export const DEMO_USERS = [
  {
    id: 'farmer-001',
    name: 'John Farmer',
    email: 'john@greenvalley.co.za',
    role: 'farmer' as const,
    permissions: {
      canCreate: true,
      canVerify: false,
    },
    address: '0x742d35Cc6634C0532925a3b8D1750B87B02B6C71',
  },
  {
    id: 'retailer-001',
    name: 'Sarah Retailer',
    email: 'sarah@freshmarket.co.za',
    role: 'retailer' as const,
    permissions: {
      canCreate: false,
      canVerify: true,
    },
    address: '0x8b3e4d2a1c9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d',
  },
  {
    id: 'inspector-001',
    name: 'Mike Inspector',
    email: 'mike@inspect.co.za',
    role: 'inspector' as const,
    permissions: {
      canCreate: false,
      canVerify: true,
    },
    address: '0x9c4f5e6d7a8b9c0e1f2a3b4c5d6e7f8a9b0c1d2e',
  },
];

export const INITIAL_BUSINESS_METRICS = {
  totalTransactions: 4,
  totalVerifications: 11,
  monthlyRevenue: 0.0072,
  averageFee: 0.0018,
  lastVerification: new Date('2025-09-13T07:30:00Z').toISOString(),
  activeProducts: 4,
  pendingVerifications: 1,
};
