// src/features/auth/application/DualAuthService.ts
// Dual-Auth strategy for login (registration results + hardcoded Demo account)

import { toUniversalUser, type DataSourceType } from '@/types/types';
import type { AdapterResult , UniversalUser, RegistrationData } from '@/core/types/adapter';

/**
 * Demo account credentials for immediate presentation
 */
const DEMO_ACCOUNTS = {
  admin: {
    email: 'admin@demo.com',
    password: 'admin123',
    userData: {
      id: 'demo-admin-001',
      name: 'Demo Admin',
      email: 'admin@demo.com',
      role: 'admin' as const,
      isActive: true,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
      emailVerified: true,
    },
  },
  farmer: {
    email: 'farmer@demo.com',
    password: 'farmer123',
    userData: {
      id: 'demo-farmer-001',
      name: 'Demo Farmer',
      email: 'farmer@demo.com',
      role: 'farmer' as const,
      isActive: true,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
      emailVerified: true,
    },
  },
  inspector: {
    email: 'inspector@demo.com',
    password: 'inspector123',
    userData: {
      id: 'demo-inspector-001',
      name: 'Demo Inspector',
      email: 'inspector@demo.com',
      role: 'inspector' as const,
      isActive: true,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
      emailVerified: true,
    },
  },
  retailer: {
    email: 'retailer@demo.com',
    password: 'retailer123',
    userData: {
      id: 'demo-retailer-001',
      name: 'Demo Retailer',
      email: 'retailer@demo.com',
      role: 'retailer' as const,
      isActive: true,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
      emailVerified: true,
    },
  },
};

/**
 * In-memory storage for registered users (simulating registration results)
 */
const registeredUsers = new Map<string, { email: string; password: string; name: string; role: string }>();

/**
 * Dual-Auth Service
 * Implements dual authentication strategy:
 * 1. Accepts results from registration feature
 * 2. Provides hardcoded demo accounts for immediate presentation
 */
export class DualAuthService {
  private static instance: DualAuthService;

  private constructor() {} // eslint-disable-line @typescript-eslint/no-empty-function

  /**
   * Validate registration data at runtime
   */
  private validateRegistrationData(data: unknown): data is RegistrationData {
    const obj = data as Record<string, unknown>;
    return (
      typeof data === 'object' &&
      data !== null &&
      'email' in data &&
      typeof obj.email === 'string' &&
      'password' in data &&
      typeof obj.password === 'string' &&
      'name' in data &&
      typeof obj.name === 'string' &&
      'role' in data &&
      typeof obj.role === 'string' &&
      ('additionalData' in data === false || typeof obj.additionalData === 'object')
    );
  }

  static getInstance(): DualAuthService {
    if (!DualAuthService.instance) {
      DualAuthService.instance = new DualAuthService();
    }
    return DualAuthService.instance;
  }

  /**
   * Register a user (simulates registration feature result)
   */
  async register(userData: RegistrationData): Promise<AdapterResult<UniversalUser>> {
    try {
      // Validate registration data
      if (!this.validateRegistrationData(userData)) {
        return {
          success: false,
          error: 'REGISTRATION_FAILED: Invalid registration data format',
        };
      }

      // Store registered user
      registeredUsers.set(userData.email, userData);

      // Convert to UniversalUser
      const universalUser = toUniversalUser(userData, 'mock' as DataSourceType);

      if (!universalUser) {
        return {
          success: false,
          error: 'REGISTRATION_FAILED: Failed to create universal user',
        };
      }

      return {
        success: true,
        data: universalUser,
        error: undefined,
      };
    } catch (_error) {
      return {
        success: false,
        error: 'REGISTRATION_FAILED: Failed to register user',
      };
    }
  }

  /**
   * Login with dual-auth strategy
   * First checks registered users, then demo accounts
   */
  async login(email: string, password: string): Promise<AdapterResult<UniversalUser>> {
    try {
      // Strategy 1: Check registered users first
      const registeredUser = registeredUsers.get(email);
      if (registeredUser && registeredUser.password === password) {
        const universalUser = toUniversalUser(registeredUser, 'mock' as DataSourceType);

        if (!universalUser) {
          return {
            success: false,
            error: 'LOGIN_FAILED: Failed to create universal user',
          };
        }

        return {
          success: true,
          data: universalUser,
          error: undefined,
        };
      }

      // Strategy 2: Check demo accounts
      const demoAccount = Object.values(DEMO_ACCOUNTS).find(
        account => account.email === email && account.password === password,
      );

      if (demoAccount) {
        const universalUser = toUniversalUser(demoAccount.userData, 'mock' as DataSourceType);

        if (!universalUser) {
          return {
            success: false,
            error: 'LOGIN_FAILED: Failed to create universal user',
          };
        }

        return {
          success: true,
          data: universalUser,
          error: undefined,
        };
      }

      // No matching account found
      return {
        success: false,
        error: 'INVALID_CREDENTIALS: Invalid email or password',
      };

    } catch (_error) {
      return {
        success: false,
        error: 'LOGIN_FAILED: Login failed due to server error',
      };
    }
  }

  /**
   * Get current user (simplified - in real app would use session/token)
   */
  async getCurrentUser(): Promise<AdapterResult<UniversalUser | undefined>> {
    // For demo purposes, return demo admin
    const adminUser = DEMO_ACCOUNTS.admin.userData;
    const universalUser = toUniversalUser(adminUser, 'mock' as DataSourceType);

    if (!universalUser) {
      return {
        success: false,
        error: 'GET_USER_FAILED: Failed to create universal user',
      };
    }

    return {
      success: true,
      data: universalUser,
    };
  }

  /**
   * Logout user
   */
  async logout(): Promise<AdapterResult<void>> {
    return {
      success: true,
      data: undefined,
    };
  }

  /**
   * Get available demo accounts for UI display
   */
  getDemoAccounts() {
    return Object.entries(DEMO_ACCOUNTS).map(([key, account]) => ({
      role: key,
      email: account.email,
      password: account.password,
      displayName: account.userData.name,
    }));
  }

  /**
   * Check if email exists (for registration validation)
   */
  async checkEmailExists(email: string): Promise<boolean> {
    return registeredUsers.has(email) ||
           Object.values(DEMO_ACCOUNTS).some(account => account.email === email);
  }

  /**
   * Get all registered users count
   */
  getRegisteredUsersCount(): number {
    return registeredUsers.size;
  }
}

/**
 * Export singleton instance
 */
export const dualAuthService = DualAuthService.getInstance();
