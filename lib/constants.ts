// src/lib/constants.ts

import { ProductCategory } from '@/types/product';

export const INITIAL_METRICS = {
  totalProducts: 0,
  totalVerifications: 0,
  successfulVerifications: 0,
  lastVerification: undefined,
  totalInspections: 0,
  totalTransactions: 0,
  monthlyRevenue: 0,
  activeFarms: 0,
  connectedRetailers: 0,
  averageFee: 0.002,
  productsByCategory: {} as Record<ProductCategory, number>,
  inspectionsByCategory: {} as Record<ProductCategory, {
    total: number;
    passed: number;
    failed: number;
    passRate: number;
  }>,
  systemUptime: Date.now(),
  lastActivity: new Date().toISOString()
};

export const CATEGORY_COLORS: Record<ProductCategory, { bg: string; text: string; icon: any }> = {
  [ProductCategory.FRUITS]: { bg: 'bg-green-100', text: 'text-green-800', icon: '🍎' },
  [ProductCategory.VEGETABLES]: { bg: 'bg-emerald-100', text: 'text-emerald-800', icon: '🥬' },
  [ProductCategory.BEEF]: { bg: 'bg-red-100', text: 'text-red-800', icon: '🥩' },
  [ProductCategory.POULTRY]: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: '🐔' },
  [ProductCategory.PORK]: { bg: 'bg-pink-100', text: 'text-pink-800', icon: '🥓' },
  [ProductCategory.LAMB]: { bg: 'bg-purple-100', text: 'text-purple-800', icon: '🐑' },
  [ProductCategory.GOAT]: { bg: 'bg-orange-100', text: 'text-orange-800', icon: '🐐' },
  [ProductCategory.FISH]: { bg: 'bg-blue-100', text: 'text-blue-800', icon: '🐟' },
};

export const eventTypes = [
  { value: 'planting', label: 'Planting' },
  { value: 'growth', label: 'Growth Monitoring' },
  { value: 'harvest', label: 'Harvest' },
  { value: 'quality-inspection', label: 'Quality Inspection' },
  { value: 'packaging', label: 'Packaging' },
  { value: 'transport', label: 'Transport' },
  { value: 'delivery', label: 'Delivery' },
  { value: 'verification', label: 'Verification' },
];

export const eventTypeValues = eventTypes.map(type => type.value) as [string, ...string[]];
