// __tests__/types/UserTransformer.test.ts
// Tests for UserTransformer type safety and transformation logic

// Transformation tests now use unified types from user.ts
import { toUniversalUser, toUIUser } from '@/types/types';
import type { 
  MockUser, 
  AuthUser, 
  CompleteUser, 
  UIUser,
  UniversalUser
} from '@/types/types';

const validMockUser: MockUser = {
  id: '1',
  name: 'John Farmer',
  email: 'john@farm.com',
  role: 'farmer' as const,
  password: 'password123',
  address: {
    formatted: '123 Farm Rd',
    street: '123 Farm Rd',
    city: 'Farmville',
    state: 'Agriculture',
    postalCode: '12345',
    country: 'Farm Country',
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
  id: '2',
  name: 'Jane Inspector',
  email: 'jane@inspect.gov',
  role: 'inspector' as const,
  isActive: true,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
  emailVerified: true,
};

describe('UserTransformer', () => {
  describe('toUniversalUser transformation', () => {
    it('should transform MockUser to UniversalUser', () => {
      const universalUser = toUniversalUser(validMockUser, 'mock');
      
      expect(universalUser).toBeDefined();
      expect(universalUser?.id).toBe('1');
      expect(universalUser?.name).toBe('John Farmer');
      expect(universalUser?.email).toBe('john@farm.com');
      expect(universalUser?.role).toBe('farmer');
      expect(universalUser?._source?.type).toBe('mock');
    });

    it('should transform AuthUser to UniversalUser', () => {
      const universalUser = toUniversalUser(validAuthUser, 'api');
      
      expect(universalUser).toBeDefined();
      expect(universalUser?.id).toBe('2');
      expect(universalUser?.name).toBe('Jane Inspector');
      expect(universalUser?.email).toBe('jane@inspect.gov');
      expect(universalUser?.role).toBe('inspector');
      expect(universalUser?._source?.type).toBe('api');
    });
  });

  describe('toUIUser transformation', () => {
    it('should transform MockUser to UIUser', () => {
      const uiUser = toUIUser(validMockUser);
      
      expect(uiUser).toBeDefined();
      expect(uiUser?.id).toBe('1');
      expect(uiUser?.name).toBe('John Farmer');
      expect(uiUser?.email).toBe('john@farm.com');
      expect(uiUser?.role).toBe('farmer');
      expect(uiUser?.displayName).toBe('John Farmer');
      expect(uiUser?.initials).toBe('JF');
      expect(uiUser?.roleDisplay).toBe('Farmer');
    });

    it('should transform AuthUser to UIUser', () => {
      const uiUser = toUIUser(validAuthUser);
      
      expect(uiUser).toBeDefined();
      expect(uiUser?.id).toBe('2');
      expect(uiUser?.name).toBe('Jane Inspector');
      expect(uiUser?.email).toBe('jane@inspect.gov');
      expect(uiUser?.role).toBe('inspector');
      expect(uiUser?.displayName).toBe('Jane Inspector');
      expect(uiUser?.initials).toBe('JI');
      expect(uiUser?.roleDisplay).toBe('Inspector');
    });
  });

  describe('Unified transformation functions', () => {
    it('should have toUniversalUser function available', () => {
      expect(toUniversalUser).toBeDefined();
      expect(typeof toUniversalUser).toBe('function');
    });
  });

  describe('Type consistency', () => {
    it('should maintain type consistency across transformations', () => {
      const universalUser = toUniversalUser(validMockUser, 'mock');
      const uiUser = toUIUser(validMockUser);
      
      // Both should have the same basic user data
      expect(universalUser?.id).toBe(uiUser?.id);
      expect(universalUser?.name).toBe(uiUser?.name);
      expect(universalUser?.email).toBe(uiUser?.email);
      expect(universalUser?.role).toBe(uiUser?.role);
    });

    it('should preserve source metadata in UniversalUser', () => {
      const universalUser = toUniversalUser(validMockUser, 'mock');
      
      expect(universalUser?._source?.type).toBe('mock');
      expect(universalUser?._source?.timestamp).toBeDefined();
    });

    it('should include validation metadata in UniversalUser', () => {
      const universalUser = toUniversalUser(validMockUser, 'mock');
      
      expect(universalUser?._validation?.isValid).toBe(true);
      expect(universalUser?._validation).toBeDefined();
    });
  });
});
