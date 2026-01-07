// src/types/viewer.ts

export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  status: string;
  farmer: string;
  location: string;
  harvestDate: string;
  certifications: string[];
  images: string[];
  createdAt: string;
  updatedAt: string;
  imageUrl?: string;
  batchNumber?: string;
  origin?: string;
}

export const EVENT_TYPES = {
  PRODUCT_CREATED: 'PRODUCT_CREATED',
  PRODUCT_UPDATED: 'PRODUCT_UPDATED',
  PRODUCT_VERIFIED: 'PRODUCT_VERIFIED',
  PRODUCT_SHIPPED: 'PRODUCT_SHIPPED',
  PRODUCT_RECEIVED: 'PRODUCT_RECEIVED',
  INSPECTION_COMPLETED: 'INSPECTION_COMPLETED',
  CERTIFICATION_GRANTED: 'CERTIFICATION_GRANTED',
  BLOCKCHAIN_UPDATED: 'BLOCKCHAIN_UPDATED',
} as const;

export type EventType = typeof EVENT_TYPES[keyof typeof EVENT_TYPES];
