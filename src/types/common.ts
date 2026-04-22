// Common utility types used across the application

export type JsonValue = string | number | boolean | null | JsonObject | JsonArray;
export interface JsonObject {
  [key: string]: JsonValue;
}
export type JsonArray = Array<JsonValue>
export type GenericRecord = Record<string, unknown>;

// Date formatting utilities
export interface DateFormatOptions {
  format?: 'short' | 'medium' | 'long' | 'full';
  locale?: string;
  includeTime?: boolean;
}

// Common status types
export type Status = 'active' | 'inactive' | 'pending' | 'archived';
export type Priority = 'low' | 'medium' | 'high' | 'urgent';

// Pagination types
export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Search and filter types
export interface SearchParams {
  query?: string;
  filters?: Record<string, unknown>;
  pagination?: PaginationParams;
}

// API response wrapper
export interface ApiWrapper<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  meta?: {
    timestamp?: string;
    requestId?: string;
    pagination?: PaginationMeta;
  };
}
