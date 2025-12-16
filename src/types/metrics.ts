// src/types/metrics.ts
export interface BusinessMetrics {
  totalTransactions: number;
  monthlyRevenue: number;
  activeFarms: number;
  connectedRetailers: number;
  averageFee: number;
  totalVerifications: number;
  lastVerification?: string;
}

export interface CategoryMetrics {
  category: string;
  count: number;
  percentage: number;
}