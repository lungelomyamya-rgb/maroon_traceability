// src/types/product.ts
export type ProductCategory = 
  | 'Fruit' 
  | 'Veg' 
  | 'Beef' 
  | 'Poultry' 
  | 'Pork' 
  | 'Lamb' 
  | 'Goat' 
  | 'Fish';

export interface NewProduct {
  productName: string;
  category: ProductCategory;
  location: string;
  harvestDate: string;
  certifications: string[];
  batchSize: string;
  description: string;
  photos?: string[];
}

export interface Product {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt?: string;
  transactionFee?: number;  // Make it optional if it can be undefined
  verifications: number;
}

export interface ProductEvent {
  id: string;
  type: string;
  productId: string;
  timestamp: string;
  data: Record<string, unknown>;
}

export interface QueueItem {
  id: string;
  type: string;
  data: unknown;
}