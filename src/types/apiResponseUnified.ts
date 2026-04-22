// src/types/APIResponseUnified.ts
// Unified API Response interface - single source of truth

import type { UserPermissions, CompleteUser } from './user';

/**
 * Unified API User Response interface
 * This is the ONLY API response interface that should be used
 * Ensures perfect consistency between API responses and mock data
 */
export interface UnifiedAPIUserResponse {
  user: CompleteUser;
  token?: string;
  refreshToken?: string;
  permissions?: UserPermissions;
  sessionExpiresAt?: string;
  requiresEmailVerification?: boolean;

  // API metadata
  responseTime?: number;
  apiVersion?: string;
  requestId?: string;
  rateLimit?: {
    remaining: number;
    reset: number;
  };
}

/**
 * Type guard for UnifiedAPIUserResponse
 */
export function isUnifiedAPIUserResponse(obj: unknown): obj is UnifiedAPIUserResponse {
  if (typeof obj !== 'object' || obj === null) {
    return false;
  }

  const response = obj as Record<string, unknown>;

  // Check for required user field
  if (!response.user || typeof response.user !== 'object') {
    return false;
  }

  // Validate optional fields
  const validStringFields = [
    'token', 'refreshToken', 'sessionExpiresAt', 'apiVersion', 'requestId',
  ];

  const validBooleanFields = [
    'requiresEmailVerification',
  ];

  // Check string fields
  for (const field of validStringFields) {
    if (response[field] !== undefined && typeof response[field] !== 'string') {
      return false;
    }
  }

  // Check boolean fields
  for (const field of validBooleanFields) {
    if (response[field] !== undefined && typeof response[field] !== 'boolean') {
      return false;
    }
  }

  // Check rate limit if present
  if (response.rateLimit !== undefined) {
    const rateLimit = response.rateLimit as Record<string, unknown>;
    if (typeof rateLimit !== 'object' || rateLimit === null) {
      return false;
    }

    if (
      (rateLimit.remaining !== undefined && typeof rateLimit.remaining !== 'number') ||
      (rateLimit.reset !== undefined && typeof rateLimit.reset !== 'number')
    ) {
      return false;
    }
  }

  return true;
}

/**
 * Generic API Response interface
 */
export interface ApiResponse<T = unknown> {
  data: T;
  success: boolean;
  message?: string;
  error?: string;
  timestamp?: string;
  requestId?: string;
}

/**
 * Paginated API Response interface
 */
export interface PaginatedResponse<T = unknown> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

/**
 * Transform UnifiedAPIUserResponse to UserContract
 */
export function apiToContract(apiResponse: UnifiedAPIUserResponse): CompleteUser {
  return {
    ...apiResponse.user,
    metadata: {
      source: 'api',
      lastSyncAt: new Date().toISOString(),
      ...apiResponse.user.metadata,
    },
  };
}
