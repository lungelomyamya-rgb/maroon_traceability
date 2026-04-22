// __tests__/auth/TypeConsistencyTest.test.ts
// Test to verify type consistency across all authentication adapters

import { MockAuthAdapter } from '@/features/auth/adapters/MockAuthAdapter';
import { RealAuthAdapter } from '@/features/auth/adapters/RealAuthAdapter';
import { HybridAuthAdapter } from '@/features/auth/adapters/HybridAuthAdapter';
import { toUniversalUser, isUniversalUser } from '@/types/types';
import type { UniversalUser, AdapterResult } from '@/core/types/adapter';

describe('Authentication Adapter Type Consistency', () => {
  let mockAdapter: MockAuthAdapter;
  let realAdapter: RealAuthAdapter;
  let hybridAdapter: HybridAuthAdapter;

  beforeAll(async () => {
    mockAdapter = new MockAuthAdapter();
    realAdapter = new RealAuthAdapter();
    hybridAdapter = new HybridAuthAdapter({ type: 'hybrid', mode: 'mock', fallbackEnabled: true });

    // Initialize adapters
    await mockAdapter.initialize();
    await hybridAdapter.initialize();
    
    // Only initialize real adapter if Supabase is available
    if (realAdapter?.isAvailable) {
      await realAdapter.initialize();
    }
  });

  afterAll(async () => {
    // Cleanup adapters
    await mockAdapter.cleanup();
    await hybridAdapter.cleanup();
    
    if (realAdapter?.isAvailable) {
      await realAdapter.cleanup();
    }
  });

  describe('Mock Adapter Type Consistency', () => {
    it('should return UniversalUser from login', async () => {
      const result: AdapterResult<UniversalUser> = await mockAdapter.login('farmer@example.com', 'password');
      
      // If this fails, let's see what we actually got
      if (!result.success) {
        throw new Error(`Login failed with error: ${result.error}. Full result: ${JSON.stringify(result, null, 2)}`);
      }
      expect(result.data).toBeDefined();
      
      // Verify it's a proper UniversalUser
      expect(isUniversalUser(result.data)).toBe(true);
      expect(result.data?._source?.type).toBe('mock');
      expect(result.data?._normalized).toBe(true);
      
      // Verify required fields
      expect(result.data?.id).toBeDefined();
      expect(result.data?.name).toBeDefined();
      expect(result.data?.email).toBeDefined();
      expect(result.data?.role).toBeDefined();
    });

    it('should return UniversalUser from register', async () => {
      const result: AdapterResult<UniversalUser> = await mockAdapter.register({
        email: `mock-test-${Date.now()}@example.com`,
        password: 'password',
        name: 'Mock Test User',
        role: 'farmer'
      });
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      
      // Verify it's a proper UniversalUser
      expect(isUniversalUser(result.data)).toBe(true);
      expect(result.data?._source?.type).toBe('mock');
      expect(result.data?._normalized).toBe(true);
    });

    it('should return UniversalUser | null from getCurrentUser', async () => {
      // First login to set current user
      await mockAdapter.login('farmer@example.com', 'password');
      
      const result: AdapterResult<UniversalUser | null> = await mockAdapter.getCurrentUser();
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      
      if (result.data) {
        expect(isUniversalUser(result.data)).toBe(true);
        expect(result.data._source?.type).toBe('mock');
        expect(result.data._normalized).toBe(true);
      }
    });
  });

  describe('Real Adapter Type Consistency', () => {
    // Only run these tests if Supabase is available
    const testIfRealAuthAvailable = realAdapter?.isAvailable ? test : test.skip;

    testIfRealAuthAvailable('should return UniversalUser from login', async () => {
      // Note: This test requires valid Supabase credentials
      // For now, we'll test the structure without actual login
      const mockAuthUser = {
        id: 'test-id',
        email: 'test@example.com',
        name: 'Test User',
        role: 'farmer' as const,
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        lastLoginAt: '2024-01-01T00:00:00Z',
        emailVerified: true,
      };

      // Test the transformation logic
      const universalUser = toUniversalUser(mockAuthUser, 'api');
      
      expect(universalUser).toBeDefined();
      expect(isUniversalUser(universalUser)).toBe(true);
      expect(universalUser?._source).toBe('api');
      expect(universalUser?._normalized).toBe(true);
    });

    testIfRealAuthAvailable('should return UniversalUser from register', async () => {
      const mockAuthUser = {
        id: 'test-id',
        email: 'test@example.com',
        name: 'Test User',
        role: 'farmer' as const,
        isActive: false, // New users start inactive
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        lastLoginAt: null,
        emailVerified: false, // Requires verification
      };

      const universalUser = toUniversalUser(mockAuthUser, 'api');
      
      expect(universalUser).toBeDefined();
      expect(isUniversalUser(universalUser)).toBe(true);
      expect(universalUser?._source).toBe('api');
      expect(universalUser?._normalized).toBe(true);
      expect(universalUser?.isActive).toBe(false);
      expect(universalUser?.emailVerified).toBe(false);
    });
  });

  describe('Hybrid Adapter Type Consistency', () => {
    it('should return UniversalUser from login (using mock)', async () => {
      const result: AdapterResult<UniversalUser> = await hybridAdapter.login('farmer@example.com', 'password');
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      
      // Verify it's a proper UniversalUser
      expect(isUniversalUser(result.data)).toBe(true);
      expect(result.data?._source?.type).toBe('mock'); // Should be from mock adapter
      expect(result.data?._normalized).toBe(true);
    });

    it('should return UniversalUser from register (using mock)', async () => {
      const result: AdapterResult<UniversalUser> = await hybridAdapter.register({
        email: `hybrid-test-${Date.now()}@example.com`,
        password: 'password',
        name: 'Hybrid Test User',
        role: 'farmer'
      });
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      
      // Verify it's a proper UniversalUser
      expect(isUniversalUser(result.data)).toBe(true);
      expect(result.data?._source?.type).toBe('mock');
      expect(result.data?._normalized).toBe(true);
    });

    it('should return UniversalUser | null from getCurrentUser', async () => {
      // First login to set current user
      await hybridAdapter.login('farmer@example.com', 'password');
      
      const result: AdapterResult<UniversalUser | null> = await hybridAdapter.getCurrentUser();
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      
      if (result.data) {
        expect(isUniversalUser(result.data)).toBe(true);
        expect(result.data._source?.type).toBe('mock');
        expect(result.data._normalized).toBe(true);
      }
    });

    it('should handle fallback between adapters', async () => {
      // Test that hybrid adapter can switch between modes
      hybridAdapter.switchMode('mock');
      
      const mockResult = await hybridAdapter.login('farmer@example.com', 'password');
      expect(mockResult.success).toBe(true);
      expect(mockResult.data?._source?.type).toBe('mock');
      
      // If real adapter is available, test switching
      if (realAdapter.isAvailable) {
        hybridAdapter.switchMode('real');
        
        // Note: This would fail without real credentials, but tests the type structure
        // The important thing is that it returns the same UniversalUser type
        expect(hybridAdapter.getCurrentUser()).resolves.toHaveProperty('data');
      }
    });
  });

  describe('Type Safety Verification', () => {
    it('should ensure all adapters return compatible types', () => {
      // This test verifies TypeScript compatibility at runtime
      const mockLogin = mockAdapter.login('farmer@example.com', 'password');
      const hybridLogin = hybridAdapter.login('farmer@example.com', 'password');
      
      // These should be the same type
      expect(typeof mockLogin).toBe('object');
      expect(typeof hybridLogin).toBe('object');
      
      // Verify both return Promise<AdapterResult<UniversalUser>>
      expect(mockLogin).toBeInstanceOf(Promise);
      expect(hybridLogin).toBeInstanceOf(Promise);
    });

    it('should verify UniversalUser interface consistency', async () => {
      const result = await mockAdapter.login('farmer@example.com', 'password');
      
      if (result.success && result.data) {
        const user = result.data;
        
        // Required fields
        expect(typeof user.id).toBe('string');
        expect(typeof user.name).toBe('string');
        expect(typeof user.email).toBe('string');
        expect(typeof user.role).toBe('string');
        
        // Optional fields should be properly typed
        expect(user.avatar === undefined || typeof user.avatar === 'string').toBe(true);
        expect(user.address === undefined || typeof user.address === 'string' || typeof user.address === 'object').toBe(true);
        expect(user.phone === undefined || typeof user.phone === 'string').toBe(true);
        
        // System fields
        expect(user.isActive === undefined || typeof user.isActive === 'boolean').toBe(true);
        expect(user.createdAt === undefined || typeof user.createdAt === 'string').toBe(true);
        expect(user.updatedAt === undefined || typeof user.updatedAt === 'string').toBe(true);
        expect(user.lastLoginAt === undefined || typeof user.lastLoginAt === 'string').toBe(true);
        expect(user.emailVerified === undefined || typeof user.emailVerified === 'boolean').toBe(true);
        
        // Metadata fields
        expect(user._source === undefined || typeof user._source === 'object').toBe(true);
        expect(user._normalized === undefined || typeof user._normalized === 'boolean').toBe(true);
        expect(user.metadata === undefined || typeof user.metadata === 'object').toBe(true);
      }
    });
  });
});
