// src/types/database.ts
export interface product {
  id: string;
  name: string;
  description: string;
  category: string;        // Added category
  location: string;        // Added location
  harvestDate: string;     // Added harvestDate
  createdAt: string;
  updatedAt?: string;
}

export interface productEvent {
  id: string;
  type: string;
  productId: string;
  timestamp: string;
  data: Record<string, unknown>;
}

export interface queueItem {
  id: string;
  type: string;
  data: unknown;
}
