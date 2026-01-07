// src/types/product.ts

// 1. Product Categories
export enum ProductCategory {
  FRUITS = 'Fruit',
  VEGETABLES = 'Veg',
  BEEF = 'Beef',
  POULTRY = 'Poultry',
  PORK = 'Pork',
  LAMB = 'Lamb',
  GOAT = 'Goat',
  FISH = 'Fish'
}

// 2. Status Types
export type ProductStatus = 'pending' | 'verified' | 'rejected';
export type VerificationStatus = 'verified' | 'failed' | 'expired' | 'already_verified';
export type InspectionStatus = 'pending' | 'passed' | 'failed';

// 3. Metadata and Related Types
export interface ProductMetadata {
  organic?: boolean;
  weight?: string;
  // Add other known metadata fields here
  [key: string]: unknown; // Keep flexibility for additional fields
}

export interface VerificationMetadata {
  ipAddress?: string;
  userAgent?: string;
  location: string;
}

// 4. Core Product Types
export interface ProductBase {
  id: string;
  name: string;
  description: string;
  category: ProductCategory;
  location: string;
  harvestDate: string; // ISO date string
  batchSize: string;
  photos: string[];
  certifications: string[];
  status: ProductStatus;
  verifications: number;
  createdAt: string; // ISO date string
  updatedAt?: string; // ISO date string
  transactionFee?: number;
  blockHash?: string;
  farmerAddress?: string;
  farmerId?: string;
  farmerName?: string;
  metadata?: ProductMetadata;
  lastVerified?: string | null; // ISO date string
}

export interface Product extends ProductBase {}

// 5. DTOs for API Operations
export interface CreateProduct {
  name: string;
  description: string;
  category: ProductCategory;
  location: string;
  harvestDate: string; // ISO date string
  batchSize: string;
  photos?: string[];
  certifications?: string[];
  metadata?: ProductMetadata;
}

export interface UpdateProduct extends Partial<CreateProduct> {
  id: string;
  status?: ProductStatus;
}

// 6. View-Specific Types
export interface ProductDisplay extends Omit<Product, 'name'> {
  productName: string; // For backward compatibility
  verificationCount: number;
}

export interface ProductModalData extends Omit<Product, 'name'> {
  productName: string;
  transactionFee?: number;
  blockHash?: string;
  farmerAddress?: string;
}

// 7. Event and Verification Types
export interface ProductEvent {
  id: string;
  type: string;
  productId: string;
  timestamp: string; // ISO date string
  data: Record<string, unknown>;
}

export interface VerificationData {
  notes?: string;
  location?: string;
}

export interface VerificationRecord {
  id: string;
  productId: string;
  verifiedAt: string; // ISO date string
  verifiedBy: string;
  status: VerificationStatus;
  notes?: string;
  metadata?: VerificationMetadata;
}

export interface VerificationResult {
  success: boolean;
  record?: VerificationRecord;
  error?: string;
  message?: string;
  statusCode?: number;
}

// 8. Inspection Types
export interface Inspection {
  id: string;
  productId: string;
  productName: string;
  category: ProductCategory;
  status: InspectionStatus;
  inspector: string;
  scheduledDate: string; // ISO date string
  completedDate?: string; // ISO date string
  notes?: string;
  issues?: string[];
}

// 9. Queue Item for Background Processing
export interface QueueItem<T = unknown> {
  id: string;
  type: string;
  data: T;
  createdAt: string; // ISO date string
  retryCount?: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  error?: string;
}

// 10. Type Guards
export function isProductStatus(status: string): status is ProductStatus {
  return ['pending', 'verified', 'rejected'].includes(status);
}

export function isProductCategory(category: string): category is ProductCategory {
  return Object.values(ProductCategory).includes(category as ProductCategory);
}