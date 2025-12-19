// src/types/database.ts
export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;        // Added category
  location: string;        // Added location
  harvestDate: string;     // Added harvestDate
  createdAt: string;
  updatedAt?: string;
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
