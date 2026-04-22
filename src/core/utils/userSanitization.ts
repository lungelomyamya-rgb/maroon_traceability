// src/core/utils/userSanitization.ts
// Utilities for sanitizing user data for UI consumption

import type { UniversalUser } from '@/types/types';

/**
 * Sanitize user data for UI consumption
 * Removes sensitive fields and ensures safe data structure
 */
export function sanitizeUserForUI(user: UniversalUser): UniversalUser {
  const { metadata, ...sanitizedUser } = user;

  return {
    ...sanitizedUser,
    // Ensure no sensitive data in metadata
    metadata: metadata ? sanitizeMetadata(metadata) : undefined,
  };
}

/**
 * Sanitize metadata object by removing sensitive information
 */
function sanitizeMetadata(metadata: Record<string, unknown>): Record<string, unknown> {
  const sensitiveFields = [
    'password',
    'token',
    'secret',
    'key',
    'auth',
    'credential',
    'private',
    'confidential',
    'sensitive',
  ];

  const sanitized: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(metadata)) {
    // Check if key contains sensitive information
    const keyLower = key.toLowerCase();
    const isSensitive = sensitiveFields.some(field => keyLower.includes(field));

    if (isSensitive) {
      // Skip sensitive fields
      continue;
    }

    // Only include safe data types
    if (isSafeDataType(value)) {
      sanitized[key] = value;
    } else {
      // Convert complex objects to safe string representation
      sanitized[key] = '[Complex Data]';
    }
  }

  return sanitized;
}

/**
 * Check if data type is safe for UI consumption
 */
function isSafeDataType(value: unknown): boolean {
  if (typeof value === 'string' ||
      typeof value === 'number' ||
      typeof value === 'boolean' ||
      value === null ||
      value === undefined) {
    return true;
  }

  // Allow arrays of safe types
  if (Array.isArray(value)) {
    return value.every(item => isSafeDataType(item));
  }

  return false;
}

/**
 * Create a safe user object for public display
 * Removes all potentially sensitive information
 */
export function createSafePublicUser(user: UniversalUser): Partial<UniversalUser> {
  return {
    id: user.id,
    name: user.name,
    role: user.role,
    avatar: user.avatar,
    // Only include non-sensitive fields
    ...(user.isActive && { isActive: user.isActive }),
    ...(user.createdAt && { createdAt: user.createdAt }),
    _source: user._source,
    _normalized: user._normalized,
  };
}

/**
 * Sanitize user object for logging
 * Removes sensitive fields but preserves debugging information
 */
export function sanitizeUserForLogging(user: UniversalUser): Record<string, unknown> {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    isActive: user.isActive,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    lastLoginAt: user.lastLoginAt,
    emailVerified: user.emailVerified,
    _source: user._source,
    _normalized: user._normalized,
    // Include safe metadata only
    metadata: user.metadata ? sanitizeMetadata(user.metadata) : undefined,
    // Include permissions but not sensitive data
    permissions: user.permissions,
  };
}

/**
 * Sanitize user object for analytics/tracking
 * Removes personally identifiable information but preserves useful analytics data
 */
export function sanitizeUserForAnalytics(user: UniversalUser): Record<string, unknown> {
  return {
    // Remove PII
    id: hashUserId(user.id), // Hash user ID for privacy
    role: user.role,
    isActive: user.isActive,
    createdAt: user.createdAt,
    emailVerified: user.emailVerified,
    _source: user._source,
    // Include role-based analytics
    permissions: user.permissions,
    // Include safe metadata only
    metadata: user.metadata ? sanitizeMetadata(user.metadata) : undefined,
  };
}

/**
 * Hash user ID for privacy-preserving analytics
 */
function hashUserId(userId: string): string {
  // Simple hash function for demonstration
  // In production, use a proper cryptographic hash
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    const char = userId.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return `hashed_${Math.abs(hash)}`;
}

/**
 * Validate if user data is safe for UI consumption
 */
export function isSafeForUI(user: UniversalUser): boolean {
  // Check for sensitive data in metadata
  if (user.metadata) {
    const metadataStr = JSON.stringify(user.metadata).toLowerCase();
    const sensitivePatterns = [
      'password',
      'token',
      'secret',
      'key',
      'auth',
      'credential',
      'private',
      'confidential',
    ];

    for (const pattern of sensitivePatterns) {
      if (metadataStr.includes(pattern)) {
        return false;
      }
    }
  }

  // Check for safe data types in metadata
  if (user.metadata) {
    for (const value of Object.values(user.metadata)) {
      if (!isSafeDataType(value)) {
        return false;
      }
    }
  }

  return true;
}

/**
 * Remove source tracking for production UI
 * Useful when you don't want to expose data source information to users
 */
export function removeSourceTracking(user: UniversalUser): UniversalUser {
  const { _source, _normalized, ...userWithoutTracking } = user;

  return {
    ...userWithoutTracking,
    _source: {
      type: 'api', // Use 'api' as default for sanitized users
      timestamp: new Date().toISOString(),
    },
    _validation: {
      isValid: true,
      validatedAt: new Date().toISOString(),
    },
    _normalized: true, // Keep normalized flag but remove original source
  };
}

/**
 * Create a minimal user object for dropdowns/selects
 * Only includes essential display fields
 */
export function createMinimalUser(user: UniversalUser): { id: string; name: string; role: string } {
  return {
    id: user.id,
    name: user.name,
    role: user.role,
  };
}
