/**
 * Registration Repository Tests
 * Tests both mock and real adapter functionality
 */

import { RegistrationRepository } from '../../src/features/registration/services/RegistrationRepository';
import type { RegistrationData } from '../../src/core/types/adapter';

describe('RegistrationRepository', () => {
  let repository: RegistrationRepository;

  beforeEach(() => {
    repository = new RegistrationRepository();
  });

  afterEach(async () => {
    await repository.cleanup();
  });

  describe('Initialization', () => {
    test('should initialize successfully with mock adapter', async () => {
      await repository.initialize();
      expect(repository.getAdapterInfo()).toBeTruthy();
      expect(repository.getAdapterInfo()?.type).toBe('mock');
    });

    test('should not initialize twice', async () => {
      await repository.initialize();
      await repository.initialize(); // Should not throw
      const health = await repository.getHealthStatus();
      expect(health.status).toBe('healthy');
    });
  });

  describe('Email Availability', () => {
    beforeEach(async () => {
      await repository.initialize();
    });

    test('should check email availability for new email', async () => {
      const result = await repository.checkEmailAvailability('new-test@example.com');
      expect(result.success).toBe(true);
      expect(result.data).toBe(true); // Email should be available
    });

    test('should check email availability for existing email', async () => {
      const testEmail = 'existing-test@example.com';
      
      // First check should be available
      const firstCheck = await repository.checkEmailAvailability(testEmail);
      expect(firstCheck.success).toBe(true);
      expect(firstCheck.data).toBe(true);

      // Register the email
      const registrationData: RegistrationData = {
        email: testEmail,
        password: 'TestPassword123!',
        name: 'Test User',
        role: 'farmer',
      };

      const registerResult = await repository.registerUser(registrationData);
      expect(registerResult.success).toBe(true);

      // Second check should not be available
      const secondCheck = await repository.checkEmailAvailability(testEmail);
      expect(secondCheck.success).toBe(true);
      expect(secondCheck.data).toBe(false);
    });

    test('should handle invalid email format', async () => {
      const result = await repository.checkEmailAvailability('invalid-email');
      expect(result.success).toBe(false);
      expect(result.error).toContain('validation failed');
    });
  });

  describe('User Registration', () => {
    beforeEach(async () => {
      await repository.initialize();
    });

    test('should register a new user successfully', async () => {
      const registrationData: RegistrationData = {
        email: 'new-user@example.com',
        password: 'SecurePassword123!',
        name: 'New User',
        role: 'farmer',
      };

      const result = await repository.registerUser(registrationData);
      expect(result.success).toBe(true);
      expect(result.data).toBeTruthy();
      expect(result.data?.email).toBe(registrationData.email);
      expect(result.data?.name).toBe(registrationData.name);
    });

    test('should validate registration data', async () => {
      const invalidData: RegistrationData = {
        email: '', // Invalid email
        password: '123', // Weak password
        name: '', // Empty name
        role: 'farmer',
      };

      const result = await repository.registerUser(invalidData);
      expect(result.success).toBe(false);
      expect(result.error).toContain('validation failed');
      expect(result.error).toContain('Email is required');
      expect(result.error).toContain('Password must be at least 8 characters');
      expect(result.error).toContain('Name is required');
    });

    test('should handle password requirements', async () => {
      const testData = [
        {
          email: 'test1@example.com',
          password: 'weak', // Too short
          expectedError: 'Password must be at least 8 characters',
        },
        {
          email: 'test2@example.com',
          password: 'alllowercase123', // No uppercase
          expectedError: 'Password must contain at least one uppercase letter',
        },
        {
          email: 'test3@example.com',
          password: 'ALLUPPERCASE123', // No lowercase
          expectedError: 'Password must contain at least one lowercase letter',
        },
        {
          email: 'test4@example.com',
          password: 'NoNumbersHere!', // No numbers
          expectedError: 'Password must contain at least one number',
        },
        {
          email: 'test5@example.com',
          password: 'NoSpecialChar123', // No special character
          expectedError: 'Password must contain at least one special character',
        },
      ];

      for (const test of testData) {
        const registrationData: RegistrationData = {
          email: test.email,
          password: test.password,
          name: 'Test User',
          role: 'farmer',
        };

        const result = await repository.registerUser(registrationData);
        expect(result.success).toBe(false);
        expect(result.error).toContain(test.expectedError);
      }
    });

    test('should handle duplicate registration', async () => {
      const registrationData: RegistrationData = {
        email: 'duplicate@example.com',
        password: 'SecurePassword123!',
        name: 'Duplicate User',
        role: 'farmer',
      };

      // First registration should succeed
      const firstResult = await repository.registerUser(registrationData);
      expect(firstResult.success).toBe(true);

      // Second registration should fail
      const secondResult = await repository.registerUser(registrationData);
      expect(secondResult.success).toBe(false);
      expect(secondResult.error).toContain('already exists');
    });

    test('should validate role', async () => {
      const registrationData: RegistrationData = {
        email: 'invalid-role@example.com',
        password: 'SecurePassword123!',
        name: 'Test User',
        role: 'invalid-role' as any, // Invalid role
      };

      const result = await repository.registerUser(registrationData);
      expect(result.success).toBe(false);
      expect(result.error).toContain('Invalid role specified');
    });
  });

  describe('Email Verification', () => {
    beforeEach(async () => {
      await repository.initialize();
    });

    test('should send verification email', async () => {
      const result = await repository.sendVerificationEmail('test@example.com');
      expect(result.success).toBe(true);
    });

    test('should verify email with token', async () => {
      const token = 'mock-verification-token';
      const result = await repository.verifyEmail(token);
      expect(result.success).toBe(true);
    });

    test('should handle invalid verification token', async () => {
      const result = await repository.verifyEmail('invalid-token');
      expect(result.success).toBe(false);
      expect(result.error).toContain('invalid or expired');
    });
  });

  describe('Health Status', () => {
    test('should return healthy status when initialized', async () => {
      await repository.initialize();
      const health = await repository.getHealthStatus();
      expect(health.status).toBe('healthy');
      expect(health.details.initialized).toBe(true);
    });

    test('should return unhealthy status when not initialized', async () => {
      const health = await repository.getHealthStatus();
      expect(health.status).toBe('unhealthy');
      expect(health.details.initialized).toBe(false);
    });
  });

  describe('Cache Operations', () => {
    beforeEach(async () => {
      await repository.initialize();
    });

    test('should track cache statistics', () => {
      const stats = repository.getCacheStats();
      expect(stats).toHaveProperty('size');
      expect(stats).toHaveProperty('keys');
      expect(Array.isArray(stats.keys)).toBe(true);
    });

    test('should refresh cache', async () => {
      await repository.refreshCache();
      const stats = repository.getCacheStats();
      expect(stats.size).toBe(0);
    });
  });

  describe('Adapter Info', () => {
    test('should return adapter info when initialized', async () => {
      await repository.initialize();
      const info = repository.getAdapterInfo();
      expect(info).toBeTruthy();
      expect(info?.id).toBeTruthy();
      expect(info?.type).toBeTruthy();
      expect(info?.isAvailable).toBe(true);
    });

    test('should return null when not initialized', () => {
      const info = repository.getAdapterInfo();
      expect(info).toBeNull();
    });
  });

  describe('Cleanup', () => {
    test('should cleanup resources properly', async () => {
      await repository.initialize();
      await repository.cleanup();
      
      const health = await repository.getHealthStatus();
      expect(health.status).toBe('unhealthy');
      expect(health.details.initialized).toBe(false);
    });
  });
});

/**
 * Integration Tests - These would test with real Supabase if available
 * Run with: npm test -- --testNamePattern="Integration"
 */
describe('RegistrationRepository Integration Tests', () => {
  let repository: RegistrationRepository;

  beforeEach(() => {
    repository = new RegistrationRepository();
  });

  afterEach(async () => {
    await repository.cleanup();
  });

  // Skip these tests by default unless specifically running integration tests
  describe.skip('Real Supabase Integration', () => {
    test('should work with real Supabase adapter', async () => {
      // This test would only run if Supabase is properly configured
      // and environment variables are set
      
      await repository.initialize();
      const info = repository.getAdapterInfo();
      
      // If real adapter is being used
      if (info?.type === 'real') {
        expect(info.id).toBe('supabase-registration');
        
        // Test actual email availability check
        const result = await repository.checkEmailAvailability('integration-test@example.com');
        expect(result.success).toBe(true);
      }
    });
  });
});

/**
 * Performance Tests
 */
describe('RegistrationRepository Performance', () => {
  let repository: RegistrationRepository;

  beforeEach(async () => {
    repository = new RegistrationRepository();
    await repository.initialize();
  });

  afterEach(async () => {
    await repository.cleanup();
  });

  test('should handle multiple concurrent requests', async () => {
    const promises = Array.from({ length: 10 }, (_, i) =>
      repository.checkEmailAvailability(`perf-test-${i}@example.com`)
    );

    const results = await Promise.all(promises);
    expect(results).toHaveLength(10);
    results.forEach((result: any) => {
      expect(result.success).toBe(true);
    });
  });

  test('should complete operations within reasonable time', async () => {
    const startTime = Date.now();
    
    await repository.checkEmailAvailability('speed-test@example.com');
    
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    // Should complete within 1 second for mock adapter
    expect(duration).toBeLessThan(1000);
  });
});
