// In src/types/api.ts

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