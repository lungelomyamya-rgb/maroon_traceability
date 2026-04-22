// src/core/factories/UserFactory.ts
// Factory pattern for creating UniversalUser objects from any data source

import type { UniversalUser, AuthUser, MockUser, CompleteUser, UserPermissions } from '@/types/types';
import { createDefaultPermissions } from '@/types/types';
import { UserNormalizationError } from '../errors/UserNormalizationError';
import type { RegistrationData } from '../types/adapter';

// Extended source type for factory operations
type UserSource = 'api' | 'cache' | 'mock' | 'localStorage' | 'merged' | 'anonymous';

/**
 * User Factory - Creates UniversalUser objects from various data sources
 * Ensures consistent user objects regardless of data origin
 */
export class UserFactory {
  /**
   * Create UniversalUser from Supabase/Auth data
   */
  static fromAuthUser(authUser: AuthUser, source: 'api' | 'cache' = 'api'): UniversalUser {
    try {
      // Validate required fields
      if (!authUser.id || !authUser.name || !authUser.email || !authUser.role) {
        throw UserNormalizationError.forMissingRequiredField(source, 'auth user data', authUser);
      }

      return {
        id: authUser.id,
        name: authUser.name,
        email: authUser.email,
        role: authUser.role,
        isActive: authUser.isActive,
        createdAt: authUser.createdAt,
        updatedAt: authUser.updatedAt,
        lastLoginAt: authUser.lastLoginAt,
        emailVerified: authUser.emailVerified,
        permissions: (authUser as { permissions?: UserPermissions }).permissions || createDefaultPermissions(authUser.role),
        _source: {
          type: source as 'api' | 'cache' | 'mock' | 'localStorage',
          timestamp: new Date().toISOString(),
        },
        _validation: {
          isValid: true,
          validatedAt: new Date().toISOString(),
        },
        _normalized: true,
      };
    } catch (error) {
      if (error instanceof UserNormalizationError) {
        throw error;
      }
      throw UserNormalizationError.forTransformationFailure(source, 'AuthUser to UniversalUser', error as Error, authUser);
    }
  }

  /**
   * Create UniversalUser from Mock data
   */
  static fromMockUser(mockUser: MockUser, source: UserSource = 'mock'): UniversalUser {
    const { password: _password, ...userWithoutPassword } = mockUser;

    return {
      ...userWithoutPassword,
      isActive: true, // Mock users are always active
      createdAt: new Date().toISOString(), // Mock users get current timestamp
      updatedAt: new Date().toISOString(),
      lastLoginAt: undefined, // Mock users haven't logged in yet
      emailVerified: true, // Mock users are pre-verified
      _source: {
        type: source as 'api' | 'cache' | 'mock' | 'localStorage',
        timestamp: new Date().toISOString(),
      },
      _validation: {
        isValid: true,
        validatedAt: new Date().toISOString(),
      },
      _normalized: true,
    };
  }

  /**
   * Create UniversalUser from Registration data
   */
  static fromRegistrationData(
    registrationData: RegistrationData,
    generatedId: string,
    source: UserSource = 'api',
  ): UniversalUser {
    const now = new Date().toISOString();

    return {
      id: generatedId,
      name: registrationData.name,
      email: registrationData.email,
      role: registrationData.role,
      isActive: false, // New users start inactive until verification
      createdAt: now,
      updatedAt: now,
      emailVerified: false, // Requires email verification
      permissions: createDefaultPermissions(registrationData.role),
      _source: {
        type: source as 'api' | 'cache' | 'mock' | 'localStorage',
        timestamp: new Date().toISOString(),
      },
      _validation: {
        isValid: true,
        validatedAt: new Date().toISOString(),
      },
      _normalized: true,
    };
  }

  /**
   * Create UniversalUser from CompleteUser
   */
  static fromCompleteUser(completeUser: CompleteUser, source: 'api' | 'cache' = 'api'): UniversalUser {
    return {
      ...completeUser,
      _source: {
        type: source as 'api' | 'cache' | 'mock' | 'localStorage',
        timestamp: new Date().toISOString(),
      },
      _validation: {
        isValid: true,
        validatedAt: new Date().toISOString(),
      },
      _normalized: true,
    };
  }

  /**
   * Validate UniversalUser structure
   */
  static validateUniversalUser(user: unknown): user is UniversalUser {
    if (!user || typeof user !== 'object') {
      return false;
    }

    const u = user as Record<string, unknown>;

    // Required fields
    if (
      typeof u.id !== 'string' ||
      typeof u.name !== 'string' ||
      typeof u.email !== 'string' ||
      typeof u.role !== 'string'
    ) {
      return false;
    }

    // Optional fields validation
    if (u.isActive !== undefined && typeof u.isActive !== 'boolean') {
      return false;
    }

    if (u.createdAt !== undefined && typeof u.createdAt !== 'string') {
      return false;
    }

    if (u.updatedAt !== undefined && typeof u.updatedAt !== 'string') {
      return false;
    }

    if (u.emailVerified !== undefined && typeof u.emailVerified !== 'boolean') {
      return false;
    }

    return true;
  }

  /**
   * Merge multiple user data sources into UniversalUser
   * Useful for combining data from different services
   */
  static mergeUserData(
    primary: Partial<UniversalUser>,
    ...sources: Partial<UniversalUser>[]
  ): UniversalUser | null {
    const merged: Partial<UniversalUser> = {
      ...primary,
      ...sources.reduce((acc, source) => ({ ...acc, ...source }), {}),
    };

    // Validate required fields
    if (!merged.id || !merged.name || !merged.email || !merged.role) {
      return null;
    }

    // Create UniversalUser with metadata
    const universalUser: UniversalUser = {
      id: merged.id,
      name: merged.name,
      email: merged.email,
      role: merged.role,
      avatar: merged.avatar,
      address: merged.address,
      phone: merged.phone,
      isActive: merged.isActive,
      createdAt: merged.createdAt,
      updatedAt: merged.updatedAt,
      lastLoginAt: merged.lastLoginAt,
      emailVerified: merged.emailVerified,
      permissions: merged.permissions || createDefaultPermissions(merged.role),
      metadata: merged.metadata,
      _normalized: true,
      _source: {
        type: 'api' as const, // Use 'api' as default for merged users
        timestamp: new Date().toISOString(),
      },
      _validation: {
        isValid: true,
        validatedAt: new Date().toISOString(),
      },
    };

    return universalUser;
  }

  /**
   * Create anonymous UniversalUser for public access
   */
  static createAnonymousUser(): UniversalUser {
    const anonymousId = `anonymous_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    return {
      id: anonymousId,
      name: 'Anonymous User',
      email: 'anonymous@public.local',
      role: 'public',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      permissions: createDefaultPermissions('public'),
      _source: {
        type: 'mock' as const, // Anonymous users are treated as mock users
        timestamp: new Date().toISOString(),
      },
      _validation: {
        isValid: true,
        validatedAt: new Date().toISOString(),
      },
      _normalized: true,
    };
  }

  /**
   * Sanitize user data for UI consumption
   * Removes sensitive fields and ensures safe data structure
   */
  static sanitizeForUI(user: UniversalUser): UniversalUser {
    const { metadata, ...sanitizedUser } = user;

    return {
      ...sanitizedUser,
      // Ensure no sensitive data in metadata
      metadata: metadata ? this.sanitizeMetadata(metadata) : undefined,
    };
  }

  /**
   * Sanitize metadata object by removing sensitive information
   */
  private static sanitizeMetadata(metadata: Record<string, unknown>): Record<string, unknown> {
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
      if (this.isSafeDataType(value)) {
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
  private static isSafeDataType(value: unknown): boolean {
    if (typeof value === 'string' ||
        typeof value === 'number' ||
        typeof value === 'boolean' ||
        value === null ||
        value === undefined) {
      return true;
    }

    // Allow arrays of safe types
    if (Array.isArray(value)) {
      return value.every(item => this.isSafeDataType(item));
    }

    return false;
  }
}
