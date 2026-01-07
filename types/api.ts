// In src/types/api.ts
import { product } from './database';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  queued?: boolean;
}

export interface CreateProductResponse {
  id: string;
  queued?: boolean;
}