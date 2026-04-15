// src/types/common.ts
// Common type definitions for use across the application

// Generic JSON types
export type JsonValue = 
  | string 
  | number 
  | boolean 
  | null
  | JsonArray
  | JsonObject;

export interface JsonObject {
  [key: string]: JsonValue;
}

export interface JsonArray extends Array<JsonValue> {}

// Generic record type
export type GenericRecord<T = unknown> = Record<string, T>;

// API Response types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Form types
export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'select' | 'textarea' | 'checkbox' | 'radio';
  required?: boolean;
  placeholder?: string;
  options?: Array<{ value: string; label: string }>;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    message?: string;
  };
}

// Table types
export interface TableColumn<T = unknown> {
  key?: keyof T | string;
  label: string;
  header?: string;
  sortable?: boolean;
  filterable?: boolean;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
  accessor?: (row: T) => React.ReactNode;
}

// Filter types
export interface FilterOption {
  value: string;
  label: string;
  count?: number;
}

export interface SearchParams {
  query?: string;
  filters?: Record<string, string | string[]>;
  sort?: string;
  order?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

// Event types
export interface BaseEvent {
  id: string;
  timestamp: string;
  type: string;
  source: string;
}

// Utility types
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type ArrayElement<T> = T extends (infer U)[] ? U : never;

export type PromiseValue<T> = T extends Promise<infer U> ? U : never;

// Status types
export type Status = 'pending' | 'loading' | 'success' | 'error';

export type LoadingState<T = unknown> = {
  status: Status;
  data?: T;
  error?: string;
};

// Selection types
export interface SelectionState<T> {
  selected: Set<T>;
  lastSelected?: T;
  isAllSelected: boolean;
  isPartiallySelected: boolean;
}
