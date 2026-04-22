// src/features/auth/adapters/MockAuthAdapter.ts
// Mock authentication adapter for simulated users

import type {
  MockUser,
  UniversalUser,
  UserRole,
  Address,
} from '@/types/types';
import {
  validateUserType,
  toUniversalUser,
  createDefaultPermissions,
} from '@/types/types';
import type {
  AuthAdapter,
  AdapterConfig,
  AdapterResult,
  RegistrationData,
} from '../../../core/types/adapter';

// Using consolidated MockUser interface from types/user.ts

/**
 * Mock user data factory for lazy loading
 * Instead of storing all users in memory, we create them on demand
 */
const createMockUser = (id: string, email: string, password: string, name: string, role: UserRole): MockUser => {
  // createDefaultPermissions is now imported at the top of the file

  return {
    id,
    email,
    password,
    name,
    role,
    address: {
      formatted: 'Mock Address',
      street: '123 Mock Street',
      city: 'Mock City',
      state: 'Mock State',
      postalCode: '0000',
      country: 'Mock Country',
    },
    isActive: true,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
    lastLoginAt: '2024-01-20T15:30:00Z',
    emailVerified: true,
    permissions: createDefaultPermissions(role),
    failedLoginAttempts: 0,
    accountLocked: false,
    // Mock fields
    isMockUser: true,
    mockDataQuality: 'high',
    testScenario: 'demo-user',
    lastUpdated: '2024-01-15T10:00:00Z',
    preferences: {},
    additionalData: {},
    verificationToken: undefined,
    lastLoginIP: '127.0.0.1',
    loginMethod: 'password',
    mfaEnabled: false,
  };
};

/**
 * Mock user definitions - lightweight data only
 */
const MOCK_USER_DEFINITIONS = [
  { id: '1', email: 'farmer@example.com', password: 'password', name: 'John Farmer', role: 'farmer' as const },
  { id: '2', email: 'inspector@example.com', password: 'password', name: 'Jane Inspector', role: 'inspector' as const },
  { id: '3', email: 'retailer@example.com', password: 'password', name: 'Bob Retailer', role: 'retailer' as const },
  { id: '4', email: 'packaging@example.com', password: 'password', name: 'Charlie Packaging', role: 'packaging' as const },
  { id: '5', email: 'admin@example.com', password: 'admin123', name: 'Admin User', role: 'admin' as const },
];

/**
 * Lazy user loader for mock users
 */
class MockUserLoader {
  private userCache = new Map<string, MockUser>();

  async getUserByEmail(email: string): Promise<MockUser | null> {
    // Check cache first
    for (const [, user] of this.userCache.entries()) {
      if (user.email.toLowerCase() === email.toLowerCase()) {
        return user;
      }
    }

    // Find user definition
    const userDef = MOCK_USER_DEFINITIONS.find(def =>
      def.email.toLowerCase() === email.toLowerCase(),
    );

    if (!userDef) {
      return null;
    }

    // Create user on demand
    const user = createMockUser(userDef.id, userDef.email, userDef.password, userDef.name, userDef.role);
    this.userCache.set(userDef.id, user);

    return user;
  }

  async getUserById(id: string): Promise<MockUser | null> {
    // Check cache first
    if (this.userCache.has(id)) {
      return this.userCache.get(id) || null;
    }

    // Find user definition
    const userDef = MOCK_USER_DEFINITIONS.find(def => def.id === id);
    if (!userDef) {
      return null;
    }

    // Create user on demand
    const user = createMockUser(userDef.id, userDef.email, userDef.password, userDef.name, userDef.role);
    this.userCache.set(id, user);

    return user;
  }

  clearCache(): void {
    this.userCache.clear();
  }

  getCacheSize(): number {
    return this.userCache.size;
  }
}

const mockUserLoader = new MockUserLoader();

/**
 * Mock authentication adapter
 * Simulated authentication for development and testing
 */
export class MockAuthAdapter implements AuthAdapter {
  readonly id = 'mock-auth';
  readonly type = 'mock' as const;
  readonly isAvailable = true;

  private currentUser: MockUser | null = null;

  constructor(private config?: AdapterConfig) {}

  /**
   * Initialize the adapter
   */
  async initialize(): Promise<void> {
    // Mock adapter doesn't need initialization
  }

  /**
   * Cleanup adapter resources
   */
  async cleanup(): Promise<void> {
    this.currentUser = null;
  }

  /**
   * Authenticate user with email and password
   */
  async login(email: string, password: string): Promise<AdapterResult<UniversalUser>> {
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Find user by email using lazy loader
      const user = await mockUserLoader.getUserByEmail(email);

      if (!user) {
        return {
          success: false,
          error: 'Invalid credentials: User not found',
        };
      }

      // Check password (for mock, all users use "password")
      if (password !== 'password') {
        return {
          success: false,
          error: 'Invalid credentials: Incorrect password',
        };
      }

      // Check if user is active
      if (!user.isActive) {
        return {
          success: false,
          error: 'Account is disabled',
        };
      }

      // Update last login time
      user.lastLoginAt = new Date().toISOString();
      this.currentUser = user;

      // Runtime validation with performance monitoring

      // Validate input user data first
      const inputValidation = validateUserType<MockUser>(user, 'MockUser', {
        strict: true,
        includeWarnings: true,
      });

      if (!inputValidation.isValid) {
        return {
          success: false,
          error: `Invalid mock user data: ${inputValidation.errors.join(', ')}`,
          metadata: {
            validationErrors: inputValidation.errors,
            validationWarnings: inputValidation.warnings,
          },
        };
      }

      // Transform to UniversalUser with tracking and performance monitoring
      const universalUser = toUniversalUser(user, 'mock', {
        adapterId: this.id,
      });

      return {
        success: true,
        data: universalUser || undefined,
        metadata: {
          loginTime: user.lastLoginAt,
          isMockUser: true,
          source: 'mock',
        },
      };

    } catch (error) {
      return {
        success: false,
        error: `Login error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  }

  /**
   * Register new user (mock implementation)
   */
  async register(userData: RegistrationData): Promise<AdapterResult<UniversalUser>> {
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800));

      // Check if email already exists
      const existingUser = await mockUserLoader.getUserByEmail(userData.email);

      if (existingUser) {
        return {
          success: false,
          error: 'Email already registered',
        };
      }

      // createDefaultPermissions is already imported at the top of the file

      // Create new user (in real implementation, this would save to database)
      const newUser: MockUser = {
        id: `mock_${Date.now()}`,
        email: userData.email,
        password: userData.password,
        name: userData.name,
        role: userData.role,
        address: {
          formatted: 'User Registered Address',
          street: typeof userData.additionalData?.address === 'string' ? 'Unknown Street' : (userData.additionalData?.address as Address)?.street || 'Unknown Street',
          city: typeof userData.additionalData?.address === 'string' ? 'Unknown City' : (userData.additionalData?.address as Address)?.city || 'Unknown City',
          state: typeof userData.additionalData?.address === 'string' ? 'Unknown State' : (userData.additionalData?.address as Address)?.state || 'Unknown State',
          postalCode: typeof userData.additionalData?.address === 'string' ? '0000' : (userData.additionalData?.address as Address)?.postalCode || '0000',
          country: typeof userData.additionalData?.address === 'string' ? 'Unknown Country' : (userData.additionalData?.address as Address)?.country || 'Unknown Country',
        },
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        lastLoginAt: undefined,
        emailVerified: true, // Auto-verify for mock
        permissions: createDefaultPermissions(userData.role),
        failedLoginAttempts: 0,
        accountLocked: false,
        // Mock-specific fields
        isMockUser: true,
        mockDataQuality: 'high',
        testScenario: 'registered-user',
        lastUpdated: new Date().toISOString(),
        preferences: {},
        additionalData: {},
        verificationToken: undefined,
        lastLoginIP: '127.0.0.1',
        loginMethod: 'password',
        mfaEnabled: false,
      };

      // Store current user (lazy loader handles caching)
      this.currentUser = newUser;

      // Transform to UniversalUser with tracking
      const universalUser = toUniversalUser(newUser, 'mock', {
        adapterId: this.id,
      });

      return {
        success: true,
        data: universalUser || undefined,
        metadata: {
          registrationTime: new Date().toISOString(),
          isMockUser: true,
          requiresEmailVerification: false,
          source: 'mock',
        },
      };

    } catch (error) {
      return {
        success: false,
        error: `Registration error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  }

  /**
   * Logout current user
   */
  async logout(): Promise<AdapterResult<void>> {
    try {
      this.currentUser = null;

      return {
        success: true,
        data: undefined,
        metadata: {
          logoutTime: new Date().toISOString(),
        },
      } as AdapterResult<void>;

    } catch (error) {
      return {
        success: false,
        error: `Logout error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  }

  /**
   * Get current authenticated user
   */
  async getCurrentUser(): Promise<AdapterResult<UniversalUser | null>> {
    try {
      if (!this.currentUser) {
        return {
          success: true,
          data: null,
        } as AdapterResult<UniversalUser | null>;
      }

      const universalUser = toUniversalUser(this.currentUser, 'mock', {
        adapterId: this.id,
      });

      return {
        success: true,
        data: universalUser,
      } as AdapterResult<UniversalUser | null>;

    } catch (error) {
      return {
        success: false,
        error: `Get current user error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  }

  /**
   * Refresh authentication token (mock implementation)
   */
  async refreshToken(): Promise<AdapterResult<string>> {
    try {
      // Mock token refresh - just return a mock token
      const mockToken = `mock_token_${Date.now()}`;

      return {
        success: true,
        data: mockToken,
        metadata: {
          refreshTokenTime: new Date().toISOString(),
          expiresAt: new Date(Date.now() + 3600000).toISOString(), // 1 hour
        },
      } as AdapterResult<string>;

    } catch (error) {
      return {
        success: false,
        error: `Token refresh error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  }

  /**
   * Reset password (mock implementation)
   */
  async resetPassword(email: string): Promise<AdapterResult<void>> {
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 300));

      const user = await mockUserLoader.getUserByEmail(email);

      if (!user) {
        return {
          success: false,
          error: 'Email not found',
        };
      }

      // In a real implementation, this would send a password reset email
      console.log(`Password reset email sent to: ${email}`);

      return {
        success: true,
        data: undefined,
        metadata: {
          resetEmailSent: true,
          email: email,
        },
      };

    } catch (error) {
      return {
        success: false,
        error: `Password reset error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      } as AdapterResult<void>;
    }
  }

  /**
   * Get adapter health status
   */
  async getHealthStatus(): Promise<{
    status: 'healthy' | 'degraded' | 'unhealthy';
    details: Record<string, string | number | boolean | null>;
  }> {
    return {
      status: 'healthy',
      details: {
        adapterId: this.id,
        adapterType: this.type,
        mockUsersCount: MOCK_USER_DEFINITIONS.length,
        cachedUsersCount: mockUserLoader.getCacheSize(),
        currentUser: this.currentUser?.id || null,
        initialized: true,
      },
    };
  }

  /**
   * Get all mock users (for testing purposes)
   */
  static async getMockUsers(): Promise<UniversalUser[]> {
    const users: UniversalUser[] = [];

    for (const userDef of MOCK_USER_DEFINITIONS) {
      const user = createMockUser(userDef.id, userDef.email, userDef.password, userDef.name, userDef.role);
      const universalUser = toUniversalUser(user, 'mock', {
        adapterId: 'mock-adapter',
      });

      if (universalUser) {
        users.push(universalUser);
      }
    }

    return users;
  }

  /**
   * Add mock user (for testing purposes)
   */
  static addMockUser(user: UniversalUser): void {
    // Validate the UniversalUser before adding
    if (!user._validation?.isValid) {
      console.warn('Cannot add invalid user to mock data:', user._validation);
      throw new Error('Cannot add invalid user to mock data');
    }

    // Import createDefaultPermissions for default permissions - already imported at top

    // Create mock user with proper structure
    createMockUser(user.id, user.email, 'password', user.name, user.role);

    console.log(`Added mock user: ${user.id} from source: ${user._source?.type}`);
  }

  /**
   * Clear mock users (for testing purposes)
   */
  static clearMockUsers(): void {
    mockUserLoader.clearCache();
  }
}
