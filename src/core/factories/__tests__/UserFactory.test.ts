// src/core/factories/__tests__/UserFactory.test.ts
// Comprehensive tests for UserFactory and user normalization

import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { UserFactory } from '../UserFactory';
import { UserNormalizationError } from '../../errors/UserNormalizationError';
import type { AuthUser, MockUser, CompleteUser, UniversalUser } from '@/types/types';
import type { RegistrationData } from '../../types/adapter';

describe('UserFactory', () => {
  describe('fromAuthUser', () => {
    it('should create UniversalUser from valid AuthUser', () => {
      const authUser: AuthUser = {
        id: 'auth_123',
        name: 'John Farmer',
        email: 'john@farm.com',
        role: 'farmer',
        isActive: true,
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z',
        lastLoginAt: '2024-01-20T15:30:00Z',
        emailVerified: true,
      };

      const universalUser = UserFactory.fromAuthUser(authUser, 'api');

      expect(UserFactory.validateUniversalUser(universalUser)).toBe(true);
      expect(universalUser.id).toBe('auth_123');
      expect(universalUser.name).toBe('John Farmer');
      expect(universalUser.email).toBe('john@farm.com');
      expect(universalUser.role).toBe('farmer');
      expect(universalUser.isActive).toBe(true);
      expect(universalUser._source.type).toBe('api');
      expect(universalUser._normalized).toBe(true);
    });

    it('should handle AuthUser with optional fields', () => {
      const authUser: AuthUser = {
        id: 'auth_456',
        name: 'Jane Inspector',
        email: 'jane@inspect.com',
        role: 'inspector',
        isActive: true,
        createdAt: '2024-01-10T10:00:00Z',
        updatedAt: '2024-01-10T10:00:00Z',
        // lastLoginAt and emailVerified are optional
      };

      const universalUser = UserFactory.fromAuthUser(authUser, 'cache');

      expect(UserFactory.validateUniversalUser(universalUser)).toBe(true);
      expect(universalUser.lastLoginAt).toBeUndefined();
      expect(universalUser.emailVerified).toBeUndefined();
      expect(universalUser._source.type).toBe('cache');
    });
  });

  describe('fromMockUser', () => {
    it('should create UniversalUser from MockUser', () => {
      const mockUser: MockUser = {
        id: 'mock_789',
        name: 'Bob Retailer',
        email: 'bob@retail.com',
        role: 'retailer',
        password: 'password123',
        address: { street: '123 Main St' },
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        emailVerified: true,
        // Mock-specific fields
        isMockUser: true,
        mockDataQuality: 'high',
        testScenario: 'retailer-test',
        lastUpdated: '2024-01-01T00:00:00Z',
        preferences: {},
        additionalData: {},
        verificationToken: undefined,
        failedLoginAttempts: 0,
        accountLocked: false,
        lockoutUntil: undefined,
        lastLoginIP: '127.0.0.1',
        loginMethod: 'password',
        mfaEnabled: false,
      };

      const universalUser = UserFactory.fromMockUser(mockUser, 'mock');

      expect(UserFactory.validateUniversalUser(universalUser)).toBe(true);
      expect(universalUser.id).toBe('mock_789');
      expect(universalUser.name).toBe('Bob Retailer');
      expect(universalUser.email).toBe('bob@retail.com');
      expect(universalUser.role).toBe('retailer');
      expect(universalUser.address?.street).toBe('123 Main St');
      expect(universalUser.isActive).toBe(true);
      expect(universalUser.emailVerified).toBe(true);
      expect(universalUser._source.type).toBe('mock');
      expect(universalUser._normalized).toBe(true);
      // Ensure password is not included
      expect('password' in universalUser).toBe(false);
    });

    it('should set default values for MockUser', () => {
      const mockUser: MockUser = {
        id: 'mock_minimal',
        name: 'Minimal User',
        email: 'minimal@test.com',
        role: 'public',
        password: 'password',
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        emailVerified: true,
        // Mock-specific fields
        isMockUser: true,
        mockDataQuality: 'medium',
        testScenario: 'minimal-test',
        lastUpdated: '2024-01-01T00:00:00Z',
        preferences: {},
        additionalData: {},
        verificationToken: undefined,
        failedLoginAttempts: 0,
        accountLocked: false,
        lockoutUntil: undefined,
        lastLoginIP: '127.0.0.1',
        loginMethod: 'password',
        mfaEnabled: false,
      };

      const universalUser = UserFactory.fromMockUser(mockUser);

      expect(universalUser.isActive).toBe(true);
      expect(universalUser.emailVerified).toBe(true);
      expect(universalUser.createdAt).toBeDefined();
      expect(universalUser.updatedAt).toBeDefined();
      expect(universalUser.lastLoginAt).toBeUndefined();
    });
  });

  describe('fromRegistrationData', () => {
    it('should create UniversalUser from RegistrationData', () => {
      const registrationData: RegistrationData = {
        name: 'New User',
        email: 'newuser@example.com',
        password: 'password123',
        role: 'farmer',
        additionalData: { department: 'agriculture' },
      };

      const universalUser = UserFactory.fromRegistrationData(registrationData, 'reg_123', 'api');

      expect(UserFactory.validateUniversalUser(universalUser)).toBe(true);
      expect(universalUser.id).toBe('reg_123');
      expect(universalUser.name).toBe('New User');
      expect(universalUser.email).toBe('newuser@example.com');
      expect(universalUser.role).toBe('farmer');
      expect(universalUser.isActive).toBe(false); // New users start inactive
      expect(universalUser.emailVerified).toBe(false); // Requires verification
      expect(universalUser._source.type).toBe('api');
      expect(universalUser._normalized).toBe(true);
    });
  });

  describe('fromCompleteUser', () => {
    it('should create UniversalUser from CompleteUser', () => {
      const completeUser: CompleteUser = {
        id: 'complete_456',
        name: 'Complete User',
        email: 'complete@example.com',
        role: 'logistics',
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        lastLoginAt: '2024-01-15T12:00:00Z',
        emailVerified: true,
        avatar: 'https://example.com/avatar.jpg',
        address: {
          street: '456 Oak St',
          city: 'Springfield',
          country: 'USA',
        },
        phone: '+1-555-0123',
        permissions: {
          canCreate: false,
          canVerify: false,
          canView: true,
        },
        metadata: {
          department: 'logistics',
          manager: 'John Doe',
        },
      };

      const universalUser = UserFactory.fromCompleteUser(completeUser, 'cache');

      expect(UserFactory.validateUniversalUser(universalUser)).toBe(true);
      expect(universalUser.id).toBe('complete_456');
      expect(universalUser.avatar).toBe('https://example.com/avatar.jpg');
      expect(universalUser.phone).toBe('+1-555-0123');
      expect(universalUser.permissions?.canView).toBe(true);
      expect(universalUser.metadata?.department).toBe('logistics');
      expect(universalUser._source.type).toBe('cache');
      expect(universalUser._normalized).toBe(true);
    });
  });

  describe('validateUniversalUser', () => {
    it('should validate correct UniversalUser', () => {
      const validUser: UniversalUser = {
        id: 'valid_123',
        name: 'Valid User',
        email: 'valid@example.com',
        role: 'farmer',
        _source: {
          type: 'api',
          timestamp: new Date().toISOString(),
        },
        _validation: {
          isValid: true,
          validatedAt: new Date().toISOString(),
        },
        _normalized: true,
      };

      expect(UserFactory.validateUniversalUser(validUser)).toBe(true);
    });

    it('should reject invalid UniversalUser - missing required fields', () => {
      const invalidUser = {
        name: 'Invalid User',
        email: 'invalid@example.com',
        role: 'farmer',
        // Missing id
      };

      expect(UserFactory.validateUniversalUser(invalidUser)).toBe(false);
    });

    it('should reject invalid UniversalUser - wrong field types', () => {
      const invalidUser = {
        id: 123, // Should be string
        name: 'Invalid User',
        email: 'invalid@example.com',
        role: 'farmer',
      };

      expect(UserFactory.validateUniversalUser(invalidUser)).toBe(false);
    });

    it('should reject non-object values', () => {
      expect(UserFactory.validateUniversalUser(null)).toBe(false);
      expect(UserFactory.validateUniversalUser(undefined)).toBe(false);
      expect(UserFactory.validateUniversalUser('string')).toBe(false);
      expect(UserFactory.validateUniversalUser(123)).toBe(false);
    });

    it('should validate with optional fields', () => {
      const userWithOptionals: UniversalUser = {
        id: 'optional_123',
        name: 'Optional User',
        email: 'optional@example.com',
        role: 'inspector',
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        emailVerified: true,
        _source: {
          type: 'api',
          timestamp: new Date().toISOString(),
        },
        _validation: {
          isValid: true,
          validatedAt: new Date().toISOString(),
        },
        _normalized: true,
      };

      expect(UserFactory.validateUniversalUser(userWithOptionals)).toBe(true);
    });

    it('should reject invalid optional field types', () => {
      const invalidUser = {
        id: 'invalid_123',
        name: 'Invalid User',
        email: 'invalid@example.com',
        role: 'farmer',
        isActive: 'true', // Should be boolean
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      };

      expect(UserFactory.validateUniversalUser(invalidUser)).toBe(false);
    });
  });

  describe('mergeUserData', () => {
    it('should merge multiple user data sources', () => {
      const primary = {
        id: 'merged_123',
        name: 'Primary User',
        email: 'primary@example.com',
        role: 'farmer' as const,
      };

      const secondary = {
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      };

      const tertiary = {
        phone: '+1-555-0123',
        address: { street: '123 Main St' },
      };

      const merged = UserFactory.mergeUserData(primary, secondary, tertiary);

      expect(merged).toBeTruthy();
      if (merged) {
        expect(merged.id).toBe('merged_123');
        expect(merged.name).toBe('Primary User');
        expect(merged.isActive).toBe(true);
        expect(merged.phone).toBe('+1-555-0123');
        expect(merged._source.type).toBe('api');
        expect(merged._normalized).toBe(true);
      }
    });

    it('should return null if required fields are missing', () => {
      const incomplete = {
        name: 'Incomplete User',
        role: 'farmer' as const,
        // Missing id, email
      };

      const result = UserFactory.mergeUserData(incomplete);

      expect(result).toBeNull();
    });

    it('should handle empty sources array', () => {
      const primary = {
        id: 'primary_123',
        name: 'Primary User',
        email: 'primary@example.com',
        role: 'farmer' as const,
      };

      const result = UserFactory.mergeUserData(primary);

      expect(result).toBeTruthy();
      expect(result!.id).toBe('primary_123');
    });
  });

  describe('createAnonymousUser', () => {
    it('should create anonymous UniversalUser', () => {
      const anonymousUser = UserFactory.createAnonymousUser();

      expect(UserFactory.validateUniversalUser(anonymousUser)).toBe(true);
      expect(anonymousUser.name).toBe('Anonymous User');
      expect(anonymousUser.email).toBe('anonymous@public.local');
      expect(anonymousUser.role).toBe('public');
      expect(anonymousUser.isActive).toBe(true);
      expect(anonymousUser._source.type).toBe('mock');
      expect(anonymousUser._normalized).toBe(true);
      expect(anonymousUser.id).toMatch(/^anonymous_\d+_[a-z0-9]+$/);
    });

    it('should create unique anonymous users', () => {
      const user1 = UserFactory.createAnonymousUser();
      const user2 = UserFactory.createAnonymousUser();

      expect(user1.id).not.toBe(user2.id);
    });
  });

  describe('sanitizeForUI', () => {
    it('should sanitize user data for UI', () => {
      const userWithSensitiveData: UniversalUser = {
        id: 'sanitize_123',
        name: 'Sanitize User',
        email: 'sanitize@example.com',
        role: 'farmer',
        metadata: {
          department: 'agriculture',
          permissions: ['read', 'write'],
          token: 'secret-token-123',
          password: 'secret-password',
        },
        _source: {
          type: 'api',
          timestamp: new Date().toISOString(),
        },
        _validation: {
          isValid: true,
          validatedAt: new Date().toISOString(),
        },
        _normalized: true,
      };

      const sanitized = UserFactory.sanitizeForUI(userWithSensitiveData);

      expect(sanitized.id).toBe('sanitize_123');
      expect(sanitized.name).toBe('Sanitize User');
      expect(sanitized.metadata).toBeDefined();
      // Only safe data should remain in metadata
      expect(sanitized.metadata?.department).toBe('agriculture');
      expect(sanitized.metadata?.permissions).toEqual(['read', 'write']);
      expect(sanitized.metadata?.token).toBeUndefined();
      expect(sanitized.metadata?.password).toBeUndefined();
    });

    it('should handle user without metadata', () => {
      const userWithoutMetadata: UniversalUser = {
        id: 'no_meta_123',
        name: 'No Metadata User',
        email: 'nometa@example.com',
        role: 'public',
        _source: {
          type: 'api',
          timestamp: new Date().toISOString(),
        },
        _validation: {
          isValid: true,
          validatedAt: new Date().toISOString(),
        },
        _normalized: true,
      };

      const sanitized = UserFactory.sanitizeForUI(userWithoutMetadata);

      expect(sanitized.id).toBe('no_meta_123');
      expect(sanitized.metadata).toBeUndefined();
    });
  });

  describe('Error handling', () => {
    it('should handle edge cases gracefully', () => {
      expect(() => {
        UserFactory.fromAuthUser(null as any, 'api');
      }).toThrow();

      expect(() => {
        UserFactory.fromMockUser(null as any, 'mock');
      }).toThrow();

      expect(() => {
        UserFactory.fromRegistrationData(null as any, 'id', 'api');
      }).toThrow();
    });
  });
});

describe('UserFactory Integration Tests', () => {
  describe('Data Source Consistency', () => {
    it('should create consistent UniversalUser from different sources', () => {
      // Same user data from different sources
      const baseUserData = {
        id: 'consistency_123',
        name: 'Consistency User',
        email: 'consistency@example.com',
        role: 'farmer' as const,
      };

      const authUser: AuthUser = {
        ...baseUserData,
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      };

      const mockUser: MockUser = {
        ...baseUserData,
        password: 'password',
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        emailVerified: true,
        // Mock-specific fields
        isMockUser: true,
        mockDataQuality: 'high',
        testScenario: 'consistency-test',
        lastUpdated: '2024-01-01T00:00:00Z',
        preferences: {},
        additionalData: {},
        verificationToken: undefined,
        failedLoginAttempts: 0,
        accountLocked: false,
        lockoutUntil: undefined,
        lastLoginIP: '127.0.0.1',
        loginMethod: 'password',
        mfaEnabled: false,
      };

      const registrationData: RegistrationData = {
        name: baseUserData.name,
        email: baseUserData.email,
        password: 'password',
        role: baseUserData.role,
      };

      const fromAuth = UserFactory.fromAuthUser(authUser, 'api');
      const fromMock = UserFactory.fromMockUser(mockUser, 'mock');
      const fromRegistration = UserFactory.fromRegistrationData(registrationData, 'consistency_123', 'api');

      // All should be valid UniversalUser objects
      expect(UserFactory.validateUniversalUser(fromAuth)).toBe(true);
      expect(UserFactory.validateUniversalUser(fromMock)).toBe(true);
      expect(UserFactory.validateUniversalUser(fromRegistration)).toBe(true);

      // Core fields should be consistent
      expect(fromAuth.id).toBe(fromMock.id);
      expect(fromAuth.id).toBe(fromRegistration.id);
      expect(fromAuth.name).toBe(fromMock.name);
      expect(fromAuth.name).toBe(fromRegistration.name);
      expect(fromAuth.email).toBe(fromMock.email);
      expect(fromAuth.email).toBe(fromRegistration.email);
      expect(fromAuth.role).toBe(fromMock.role);
      expect(fromAuth.role).toBe(fromRegistration.role);

      // Source tracking should be different
      expect(fromAuth._source.type).toBe('api');
      expect(fromMock._source.type).toBe('mock');
      expect(fromRegistration._source.type).toBe('api');
    });
  });

  describe('Performance Tests', () => {
    it('should handle bulk user creation efficiently', () => {
      const startTime = Date.now();
      
      const users = Array.from({ length: 1000 }, (_, index) => {
        const mockUser: MockUser = {
          id: `bulk_${index}`,
          name: `Bulk User ${index}`,
          email: `bulk${index}@example.com`,
          role: 'farmer' as const,
          password: 'password',
          isActive: true,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
          emailVerified: true,
          // Mock-specific fields
          isMockUser: true,
          mockDataQuality: 'high',
          testScenario: 'bulk-test',
          lastUpdated: '2024-01-01T00:00:00Z',
          preferences: {},
          additionalData: {},
          verificationToken: undefined,
          failedLoginAttempts: 0,
          accountLocked: false,
          lockoutUntil: undefined,
          lastLoginIP: '127.0.0.1',
          loginMethod: 'password',
          mfaEnabled: false,
        };
        
        return UserFactory.fromMockUser(mockUser, 'mock');
      });

      const endTime = Date.now();
      const duration = endTime - startTime;

      expect(users).toHaveLength(1000);
      expect(users.every(UserFactory.validateUniversalUser)).toBe(true);
      expect(duration).toBeLessThan(1000); // Should complete within 1 second
    });
  });
});
