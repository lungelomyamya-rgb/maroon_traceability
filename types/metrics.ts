// src/types/metrics.ts
import { ProductCategory } from './product';

export interface BusinessMetrics {
  totalProducts: number;
  totalVerifications: number;
  successfulVerifications: number;
  lastVerification?: string;
  totalInspections: number;
  totalTransactions: number;
  monthlyRevenue: number;
  activeFarms: number;
  connectedRetailers: number;
  averageFee: number;
  productsByCategory: Record<ProductCategory, number>;
  inspectionsByCategory: Record<ProductCategory, {
    total: number;
    passed: number;
    failed: number;
    passRate: number;
  }>;
}

export interface CategoryMetrics {
  category: string;
  count: number;
  percentage: number;
}