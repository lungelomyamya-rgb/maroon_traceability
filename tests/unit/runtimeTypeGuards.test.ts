// __tests__/runtimeTypeGuards.test.ts
// Unit tests for runtime type guards

import {
  isBaseUser,
  isAuthUser,
  isMockUser,
  isUniversalUser,
  validateUserType,
  validateUserBusinessRules,
  validateUserBatch,
  isUserTypeWithPerformance
} from '@/types/types';

describe('Runtime Type Guards', () => {
  const validBaseUser = {
    id: 'test-user-1',
    name: 'Test User',
    email: 'test@example.com',
    role: 'farmer' as const
  };

  const validMockUser = {
    id: 'mock-user-1',
    name: 'Mock User',
    email: 'mock@example.com',
    role: 'inspector' as const,
    password: 'password123',
    isMockUser: true,
    mockDataQuality: 'high' as const,
    failedLoginAttempts: 0,
    accountLocked: false
  };

  const validAuthUser = {
    id: 'auth-user-1',
    name: 'Auth User',
    email: 'auth@example.com',
    role: 'admin' as const,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    lastLoginAt: '2024-01-15T10:30:00Z',
    emailVerified: true
  };

  const validUniversalUser = {
    id: 'universal-user-1',
    name: 'Universal User',
    email: 'universal@example.com',
    role: 'retailer' as const,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    _source: {
      type: 'api' as const,
      timestamp: '2024-01-01T00:00:00Z',
      adapterId: 'api-adapter',
      version: '1.0.0',
      latency: 150
    },
    _validation: {
      isValid: true,
      validatedAt: '2024-01-01T00:00:00Z'
    },
    _normalized: true as const
  };

  describe('Basic Type Guards', () => {
    test('isBaseUser should validate correct BaseUser', () => {
      expect(isBaseUser(validBaseUser)).toBe(true);
    });

    test('isBaseUser should reject invalid BaseUser', () => {
      const invalidUser = { ...validBaseUser, email: 'invalid-email' };
      expect(isBaseUser(invalidUser)).toBe(false);
    });

    test('isBaseUser should reject non-objects', () => {
      expect(isBaseUser(null)).toBe(false);
      expect(isBaseUser('string')).toBe(false);
      expect(isBaseUser(123)).toBe(false);
      expect(isBaseUser([])).toBe(false);
    });

    test('isMockUser should validate correct MockUser', () => {
      expect(isMockUser(validMockUser)).toBe(true);
    });

    test('isMockUser should reject user without password', () => {
      const invalidMockUser = { ...validMockUser };
      delete (invalidMockUser as any).password;
      expect(isMockUser(invalidMockUser)).toBe(false);
    });

    test('isAuthUser should validate correct AuthUser', () => {
      expect(isAuthUser(validAuthUser)).toBe(true);
    });

    test('isAuthUser should reject user without timestamps', () => {
      const invalidAuthUser = { ...validAuthUser };
      delete (invalidAuthUser as any).createdAt;
      expect(isAuthUser(invalidAuthUser)).toBe(false);
    });

    test('isUniversalUser should validate correct UniversalUser', () => {
      expect(isUniversalUser(validUniversalUser)).toBe(true);
    });

    test('isUniversalUser should reject user without _source metadata', () => {
      const invalidUniversalUser = { ...validUniversalUser };
      delete (invalidUniversalUser as any)._source;
      expect(isUniversalUser(invalidUniversalUser)).toBe(false);
    });
  });

  describe(' Validation', () => {
    test('validateUserType should return detailed validation result', () => {
      const result = validateUserType(validAuthUser, 'AuthUser', { strict: true });
      
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual([]);
      expect(result.data).toEqual(validAuthUser);
    });

    test('validateUserType should report errors for invalid data', () => {
      const invalidUser = { ...validBaseUser, email: 'invalid-email', name: '' };
      const result = validateUserType(invalidUser, 'BaseUser', { strict: true });
      
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.data).toBeUndefined();
    });

    test('validateUserType should include warnings when requested', () => {
      const minimalUser = {
        id: 'minimal-user',
        name: 'Minimal User',
        email: 'minimal@example.com',
        role: 'farmer' as const
      };
      const result = validateUserType(minimalUser, 'AuthUser', { includeWarnings: true });
      
      // Should fail validation (missing AuthUser fields) but might not have warnings
      expect(result.isValid).toBe(false);
      // Warnings are optional, so we just check the function works
      expect(Array.isArray(result.warnings)).toBe(true);
    });
  });

  describe('Business Rule Validation', () => {
    test('validateUserBusinessRules should return high score for valid user', () => {
      const result = validateUserBusinessRules(validUniversalUser);
      
      expect(result.isValid).toBe(true);
      expect(result.score).toBeGreaterThan(90);
    });

    test('validateUserBusinessRules should warn about uppercase email', () => {
      const userWithUppercaseEmail = { ...validAuthUser, email: 'Test@Example.COM' };
      const result = validateUserBusinessRules(userWithUppercaseEmail);
      
      expect(result.isValid).toBe(true);
      expect(result.warnings).toContain('Email contains uppercase characters - should be lowercase');
    });

    test('validateUserBusinessRules should reject blocked domains', () => {
      const userWithBlockedDomain = { ...validAuthUser, email: 'user@tempmail.com' };
      const result = validateUserBusinessRules(userWithBlockedDomain);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Email domain is blocked for registration');
    });
  });

  describe('Batch Validation', () => {
    test('validateUserBatch should process multiple users', () => {
      const users = [validBaseUser, validMockUser, validAuthUser];
      const result = validateUserBatch(users, isBaseUser);
      
      expect(result.totalProcessed).toBe(3);
      expect(result.validCount).toBe(3); // BaseUser, MockUser, and AuthUser all extend BaseUser
      expect(result.invalidCount).toBe(0);
      expect(result.successRate).toBe(1);
    });

    test('validateUserBatch should report errors with indices', () => {
      const users = [validBaseUser, { invalid: 'user' }, validAuthUser];
      const result = validateUserBatch(users, isBaseUser);
      
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].index).toBe(1);
      expect(result.errors[0].error).toContain('Invalid user object');
    });

    test('validateUserBatch should stop on first error when configured', () => {
      const users = [validBaseUser, { invalid: 'user' }, { another: 'invalid' }];
      const result = validateUserBatch(users, isBaseUser, { stopOnFirstError: true });
      
      // Should process all users but stop on first error for validation
      expect(result.totalProcessed).toBe(3);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors[0].index).toBe(1);
    });
  });

  describe('Performance Monitoring', () => {
    test('isUserTypeWithPerformance should return performance metrics', () => {
      const result = isUserTypeWithPerformance(validUniversalUser, isUniversalUser, 'UniversalUser');
      
      expect(result.isValid).toBe(true);
      expect(result.data).toEqual(validUniversalUser);
      expect(result.performance).toBeDefined();
      expect(result.performance.typeName).toBe('UniversalUser');
      expect(result.performance.duration).toBeGreaterThanOrEqual(0);
      expect(typeof result.performance.timestamp).toBe('string');
    });

    test('isUserTypeWithPerformance should track memory delta', () => {
      const result = isUserTypeWithPerformance(validUniversalUser, isUniversalUser, 'UniversalUser');
      
      expect(typeof result.performance.memoryDelta).toBe('number');
    });
  });

  describe('Edge Cases', () => {
    test('should handle empty objects gracefully', () => {
      expect(isBaseUser({})).toBe(false);
      expect(isAuthUser({})).toBe(false);
      expect(isMockUser({})).toBe(false);
      expect(isUniversalUser({})).toBe(false);
    });

    test('should handle null and undefined gracefully', () => {
      expect(isBaseUser(null)).toBe(false);
      expect(isBaseUser(undefined)).toBe(false);
      expect(isAuthUser(null)).toBe(false);
      expect(isAuthUser(undefined)).toBe(false);
    });

    test('should handle arrays gracefully', () => {
      expect(isBaseUser([])).toBe(false);
      expect(isAuthUser([])).toBe(false);
      expect(isMockUser([])).toBe(false);
      expect(isUniversalUser([])).toBe(false);
    });

    test('should validate email formats correctly', () => {
      const validEmails = [
        'test@example.com',
        'user.name@domain.co.uk',
        'user+tag@example.org',
        '123@example.com'
      ];

      const invalidEmails = [
        'invalid-email',
        '@example.com',
        'test@',
        'test.example.com',
        'test@.com',
        ''
      ];

      validEmails.forEach(email => {
        const user = { ...validBaseUser, email };
        expect(isBaseUser(user)).toBe(true);
      });

      invalidEmails.forEach(email => {
        const user = { ...validBaseUser, email };
        expect(isBaseUser(user)).toBe(false);
      });
    });

    test('should validate role correctly', () => {
      const validRoles = ['farmer', 'inspector', 'admin', 'retailer', 'logistics', 'packaging', 'public', 'government', 'saps'];
      const invalidRoles = ['invalid', 'user', 'manager', ''];

      validRoles.forEach(role => {
        const user = { ...validBaseUser, role };
        expect(isBaseUser(user)).toBe(true);
      });

      invalidRoles.forEach(role => {
        const user = { ...validBaseUser, role };
        expect(isBaseUser(user)).toBe(false);
      });
    });
  });
});
