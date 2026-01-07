// src/contexts/ProductContext.tsx
'use client';

import React, { createContext, useContext, useState, ReactNode, useMemo } from 'react';
import { BlockchainRecord } from '@/types/blockchain';
import { CreateProduct, Product, ProductCategory, ProductStatus } from '@/types/product';
import { BusinessMetrics } from '@/types/metrics';
import { createBlockchainRecord, incrementVerification } from '@/lib/blockchain';
import { INITIAL_METRICS } from '@/lib/constants';

// Re-export ProductCategory for other components
export { ProductCategory } from '@/types/product';

interface ProductContextType {
  blockchainRecords: BlockchainRecord[];
  businessMetrics: BusinessMetrics;
  selectedProduct: BlockchainRecord | null;
  selectedCategory: ProductCategory | 'All';
  searchQuery: string;
  addProduct: (product: CreateProduct, farmerName?: string) => void;
  verifyProduct: (productId: string) => void;
  setSelectedProduct: (product: BlockchainRecord | null) => void;
  setSelectedCategory: (category: ProductCategory | 'All') => void;
  setSearchQuery: (query: string) => void;
  filteredRecords: BlockchainRecord[];
  categoryStats: Record<ProductCategory, number>;
  products: Product[],
  isLoading?: boolean;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

const INITIAL_RECORDS: BlockchainRecord[] = [
  {
    id: 'BLK001',
    productName: 'Organic Apples',
    description: 'Fresh organic apples from Green Valley Farm',
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
    description: 'Fresh free-range eggs from happy chickens',
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
    description: 'Fresh beef from happy beef',
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
    description: 'Fresh spinach from Green Valley Farm',
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

export function ProductProvider({ children }: { children: ReactNode }) {
  const [blockchainRecords, setBlockchainRecords] = useState<BlockchainRecord[]>(INITIAL_RECORDS);
  const [businessMetrics, setBusinessMetrics] = useState<BusinessMetrics>(INITIAL_METRICS);
  const [selectedProduct, setSelectedProduct] = useState<BlockchainRecord | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const products = useMemo(() => {
    return blockchainRecords.map(record => ({
      id: record.id,
      name: record.productName || 'Unknown Product',
      description: `${record.category} product from ${record.location || 'Unknown Location'}`,
      category: record.category || ProductCategory.FRUITS,
      location: record.location || 'Unknown Location',
      harvestDate: record.timestamp ? new Date(record.timestamp).toISOString() : new Date().toISOString(),
      batchSize: 'Standard',
      photos: [],
      certifications: record.verified ? ['Verified'] : [],
      status: (record.verified ? 'verified' : 'pending') as ProductStatus,
      verifications: record.verifications || 0,
      createdAt: record.timestamp ? new Date(record.timestamp).toISOString() : new Date().toISOString(),
      lastVerified: record.timestamp ? new Date(record.timestamp).toISOString() : null,
      farmerName: record.farmer || 'Unknown Farmer'
    }));
  }, [blockchainRecords]);

  // Filter records based on category and search
  const filteredRecords = useMemo(() => {
    let filtered = blockchainRecords;

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(record => record.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(record =>
        (record.productName?.toLowerCase().includes(query)) ||
        (record.farmer?.toLowerCase().includes(query)) ||
        (record.location?.toLowerCase().includes(query)) ||
        (record.category?.toLowerCase().includes(query))
      );
    }

    return filtered;
  }, [blockchainRecords, selectedCategory, searchQuery]);

  // Calculate category statistics
  const categoryStats = useMemo<Record<ProductCategory, number>>(() => {
    const stats = {} as Record<ProductCategory, number>;

    // Initialize all categories with 0
    const allCategories: ProductCategory[] = [
      ProductCategory.FRUITS, ProductCategory.VEGETABLES, ProductCategory.BEEF, 
      ProductCategory.POULTRY, ProductCategory.PORK, ProductCategory.LAMB, 
      ProductCategory.GOAT, ProductCategory.FISH
    ];
    allCategories.forEach(cat => {
      stats[cat] = 0;
    });
    
    // Count records per category
    blockchainRecords.forEach(record => {
      if (record.category && record.category in stats) {
        stats[record.category as ProductCategory]++;
      }
    });
    
    return stats;
  }, [blockchainRecords]);

  const verifyProduct = async (productId: string) => {
    try {
      // In a real app, you would call your blockchain function here:
      // const result = await incrementVerification(productId);
      
      // For now, we'll simulate a successful verification
      const verificationResult = { success: true };
      
      if (verificationResult.success) {
        // Update blockchain records with new verification
        setBlockchainRecords(prevRecords => 
          prevRecords.map(record => {
            if (record.id === productId) {
              return {
                ...record,
                verifications: (record.verifications || 0) + 1,
                lastVerified: new Date().toISOString(),
                verifiedBy: 'retailer',
              };
            }
            return record;
          })
        );

        // Update business metrics
        setBusinessMetrics(prev => ({
          ...prev,
          totalVerifications: (prev.totalVerifications || 0) + 1,
          lastVerification: new Date().toISOString(),
        }));

        // Show success message
        // In a real app, you might want to use a toast notification here
        console.log(`Successfully verified product ${productId}`);
      } else {
        console.error('Failed to verify product on the blockchain');
      }
    } catch (error) {
      console.error('Error verifying product:', error);
    }
  };

  const addProduct = (product: CreateProduct, farmerName?: string) => {
    const newRecord = createBlockchainRecord(product, blockchainRecords.length, farmerName);
    
    setBlockchainRecords((prev) => [...prev, newRecord]);
    setBusinessMetrics((prev) => ({
      ...prev,
      totalTransactions: prev.totalTransactions + 1,
      monthlyRevenue: prev.monthlyRevenue + prev.averageFee,
    }));
  };

  return (
    <ProductContext.Provider
      value={{
        blockchainRecords,
        businessMetrics,
        selectedProduct,
        selectedCategory,
        searchQuery,
        products,
        addProduct,
        verifyProduct,
        setSelectedProduct,
        setSelectedCategory,
        setSearchQuery,
        filteredRecords,
        categoryStats,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts(): ProductContextType {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
}