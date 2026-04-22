// __tests__/types/UserFactory.test.ts
// Tests for UniversalUser type safety and transformation

import { 
  toUniversalUser,
  validateUserType,
  isUniversalUser
} from '@/types/types';
import { 
  UniversalUser,
  BaseUser,
  MockUser,
  AuthUser,
  DataSourceType,
  SourceMetadata,
  ValidationMetadata
} from '@/types/types';

const validBaseUser: BaseUser = {
  id: 'user-123',
  name: 'John Doe',
  email: 'john@example.com',
  role: 'farmer' as const,
};

const validMockUser: MockUser = {
  ...validBaseUser,
  password: 'password123',
  address: {
    formatted: '123 Main St',
    street: '123 Main St',
    city: 'Test City',
    state: 'Test State',
    postalCode: '12345',
    country: 'Test Country',
  },
  isActive: true,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
  emailVerified: true,
  // Mock-specific fields
  isMockUser: true,
  mockDataQuality: 'high',
  testScenario: 'test-user',
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

const validAuthUser: AuthUser = {
  ...validBaseUser,
  isActive: true,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
  emailVerified: true,
};

describe('UniversalUser Type Safety', () => {
  describe('toUniversalUser transformation', () => {
    it('should transform BaseUser to UniversalUser', () => {
      const universalUser = toUniversalUser(validBaseUser, 'mock');
      
      expect(universalUser).toBeDefined();
      expect(universalUser?.id).toBe('user-123');
      expect(universalUser?.name).toBe('John Doe');
      expect(universalUser?.email).toBe('john@example.com');
      expect(universalUser?.role).toBe('farmer');
      expect(universalUser?._source?.type).toBe('mock');
    });

    it('should transform MockUser to UniversalUser', () => {
      const universalUser = toUniversalUser(validMockUser, 'mock');
      
      expect(universalUser).toBeDefined();
      expect(universalUser?.id).toBe('user-123');
      expect(universalUser?.name).toBe('John Doe');
      expect(universalUser?.email).toBe('john@example.com');
      expect(universalUser?.role).toBe('farmer');
      expect(universalUser?._source?.type).toBe('mock');
    });

    it('should transform AuthUser to UniversalUser', () => {
      const universalUser = toUniversalUser(validAuthUser, 'api');
      
      expect(universalUser).toBeDefined();
      expect(universalUser?.id).toBe('user-123');
      expect(universalUser?.name).toBe('John Doe');
      expect(universalUser?.email).toBe('john@example.com');
      expect(universalUser?.role).toBe('farmer');
      expect(universalUser?._source?.type).toBe('api');
    });
  });

  describe('validateUserType', () => {
    it('should validate UniversalUser correctly', () => {
      const universalUser = toUniversalUser(validMockUser, 'mock');
      const validation = validateUserType(universalUser, 'UniversalUser');
      
      expect(validation.isValid).toBe(true);
      expect(validation.errors).toHaveLength(0);
    });

    it('should detect invalid user data', () => {
      const invalidUser = { ...validBaseUser, id: '' };
      const validation = validateUserType(invalidUser, 'BaseUser');
      
      expect(validation.isValid).toBe(false);
      expect(validation.errors.length).toBeGreaterThan(0);
    });
  });

  describe('isUniversalUser type guard', () => {
    it('should identify UniversalUser correctly', () => {
      const universalUser = toUniversalUser(validMockUser, 'mock');
      
      expect(isUniversalUser(universalUser)).toBe(true);
      expect(isUniversalUser(validBaseUser)).toBe(false);
      expect(isUniversalUser(validMockUser)).toBe(false);
      expect(isUniversalUser(validAuthUser)).toBe(false);
    });
  });

  describe('UniversalUser structure validation', () => {
    it('should have required _source metadata', () => {
      const universalUser = toUniversalUser(validMockUser, 'mock');
      
      expect(universalUser?._source).toBeDefined();
      expect(universalUser?._source?.type).toBe('mock');
      expect(universalUser?._source?.timestamp).toBeDefined();
    });

    it('should have validation metadata', () => {
      const universalUser = toUniversalUser(validMockUser, 'mock');
      
      expect(universalUser?._validation).toBeDefined();
      expect(universalUser?._validation?.isValid).toBe(true);
    });

    it('should be marked as normalized', () => {
      const universalUser = toUniversalUser(validMockUser, 'mock');
      
      expect(universalUser?._normalized).toBe(true);
    });
  });
});
