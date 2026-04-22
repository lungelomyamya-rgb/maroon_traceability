// __tests__/types/UserTypeConsistency.test.ts
// Tests for type consistency across different user types

import { toUniversalUser, toUIUser, isUniversalUser } from '@/types/types';
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

describe('User Type Consistency', () => {
  describe('UniversalUser transformation consistency', () => {
    it('should create consistent UniversalUser from different sources', () => {
      const mockUniversal = toUniversalUser(validMockUser, 'mock');
      const authUniversal = toUniversalUser(validAuthUser, 'api');
      
      // Both should have the same interface structure
      expect(mockUniversal?.id).toBeDefined();
      expect(authUniversal?.id).toBeDefined();
      expect(mockUniversal?.name).toBeDefined();
      expect(authUniversal?.name).toBeDefined();
      expect(mockUniversal?.email).toBeDefined();
      expect(authUniversal?.email).toBeDefined();
      expect(mockUniversal?.role).toBeDefined();
      expect(authUniversal?.role).toBeDefined();
      
      // Both should have the same metadata structure
      expect(mockUniversal?._source).toBeDefined();
      expect(authUniversal?._source).toBeDefined();
      expect(mockUniversal?._validation).toBeDefined();
      expect(authUniversal?._validation).toBeDefined();
      expect(mockUniversal?._normalized).toBe(true);
      expect(authUniversal?._normalized).toBe(true);
    });

    it('should preserve source information correctly', () => {
      const mockUniversal = toUniversalUser(validMockUser, 'mock');
      const authUniversal = toUniversalUser(validAuthUser, 'api');
      
      expect(mockUniversal?._source?.type).toBe('mock');
      expect(authUniversal?._source?.type).toBe('api');
      expect(mockUniversal?._source?.timestamp).toBeDefined();
      expect(authUniversal?._source?.timestamp).toBeDefined();
    });
  });

  describe('UIUser transformation consistency', () => {
    it('should create consistent UIUser from different sources', () => {
      const mockUI = toUIUser(validMockUser);
      const authUI = toUIUser(validAuthUser);
      
      // Both should have the same interface structure
      expect(mockUI?.id).toBeDefined();
      expect(authUI?.id).toBeDefined();
      expect(mockUI?.name).toBeDefined();
      expect(authUI?.name).toBeDefined();
      expect(mockUI?.email).toBeDefined();
      expect(authUI?.email).toBeDefined();
      expect(mockUI?.role).toBeDefined();
      expect(authUI?.role).toBeDefined();
      
      // Both should have computed properties
      expect(mockUI?.displayName).toBeDefined();
      expect(authUI?.displayName).toBeDefined();
      expect(mockUI?.initials).toBeDefined();
      expect(authUI?.initials).toBeDefined();
      expect(mockUI?.roleDisplay).toBeDefined();
      expect(authUI?.roleDisplay).toBeDefined();
      expect(mockUI?.statusColor).toBeDefined();
      expect(authUI?.statusColor).toBeDefined();
    });

    it('should generate consistent computed properties', () => {
      const mockUI = toUIUser(validMockUser);
      const authUI = toUIUser(validAuthUser);
      
      // Check computed properties are generated correctly
      expect(mockUI?.displayName).toBe('John Farmer');
      expect(authUI?.displayName).toBe('Jane Inspector');
      expect(mockUI?.initials).toBe('JF');
      expect(authUI?.initials).toBe('JI');
      expect(mockUI?.roleDisplay).toBe('Farmer');
      expect(authUI?.roleDisplay).toBe('Inspector');
    });
  });

  describe('Type guard consistency', () => {
    it('should correctly identify UniversalUser types', () => {
      const mockUniversal = toUniversalUser(validMockUser, 'mock');
      const authUniversal = toUniversalUser(validAuthUser, 'api');
      const mockUI = toUIUser(validMockUser);
      
      expect(isUniversalUser(mockUniversal)).toBe(true);
      expect(isUniversalUser(authUniversal)).toBe(true);
      expect(isUniversalUser(mockUI)).toBe(false);
      expect(isUniversalUser(validMockUser)).toBe(false);
      expect(isUniversalUser(validAuthUser)).toBe(false);
    });
  });

  describe('Data consistency across transformations', () => {
    it('should maintain core data integrity', () => {
      const originalData = validMockUser;
      const universalUser = toUniversalUser(originalData, 'mock');
      const uiUser = toUIUser(originalData);
      
      // Core data should be preserved
      expect(universalUser?.id).toBe(originalData.id);
      expect(uiUser?.id).toBe(originalData.id);
      expect(universalUser?.name).toBe(originalData.name);
      expect(uiUser?.name).toBe(originalData.name);
      expect(universalUser?.email).toBe(originalData.email);
      expect(uiUser?.email).toBe(originalData.email);
      expect(universalUser?.role).toBe(originalData.role);
      expect(uiUser?.role).toBe(originalData.role);
    });

    it('should handle role-based transformations consistently', () => {
      const farmerUI = toUIUser({ ...validMockUser, role: 'farmer' as const });
      const inspectorUI = toUIUser({ ...validMockUser, role: 'inspector' as const });
      const retailerUI = toUIUser({ ...validMockUser, role: 'retailer' as const });
      
      expect(farmerUI?.roleDisplay).toBe('Farmer');
      expect(inspectorUI?.roleDisplay).toBe('Inspector');
      expect(retailerUI?.roleDisplay).toBe('Retailer');
      
      expect(farmerUI?.roleColor).toBeDefined();
      expect(inspectorUI?.roleColor).toBeDefined();
      expect(retailerUI?.roleColor).toBeDefined();
    });
  });

  describe('Error handling consistency', () => {
    it('should handle invalid data consistently', () => {
      const invalidUser = { ...validMockUser, id: '' };
      
      // Should still create UniversalUser but with validation issues
      const universalUser = toUniversalUser(invalidUser, 'mock');
      expect(universalUser).toBeDefined();
      expect(universalUser?._validation?.isValid).toBe(false);
      
      // Should still create UIUser even with invalid data
      const uiUser = toUIUser(invalidUser);
      expect(uiUser).toBeDefined();
    });
  });
});
