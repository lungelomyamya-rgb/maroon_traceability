// src/features/auth/services/LoginService.ts
// Separate login service supporting both real authentication and demo accounts

import { toUniversalUser, type DataSourceType } from '@/types/types';
import { getFinalAdapterConfig } from '@/config/adapters';
import type { AdapterResult, UniversalUser } from '@/core/types/adapter';
import { logHybridOperation } from '@/core/utils/hybridUtils';

/**
 * Interface for real authentication adapter
 */
interface IRealAuthAdapter {
  initialize(): Promise<void>;
  login(email: string, password: string): Promise<AdapterResult<UniversalUser>>;
  logout(): Promise<AdapterResult<void>>;
  getCurrentUser(): Promise<AdapterResult<UniversalUser | null>>;
}

/**
 * Demo account credentials for testing
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
} as const;

type DemoAccountKey = keyof typeof DEMO_ACCOUNTS;

/**
 * Login Service
 * Handles both real authentication and demo account login
 */
export class LoginService {
  private static instance: LoginService;
  private realAuthAdapter: IRealAuthAdapter | null = null;
  private initialized = false;

  private constructor() {
    // Private constructor for singleton pattern
  }

  static getInstance(): LoginService {
    if (!LoginService.instance) {
      LoginService.instance = new LoginService();
    }
    return LoginService.instance;
  }

  /**
   * Initialize the login service
   */
  async initialize(): Promise<void> {
    if (this.initialized) {
      return;
    }

    try {
      // Initialize real auth adapter for production authentication
      const authConfig = getFinalAdapterConfig('auth', 'real');

      // Import and initialize the real auth adapter
      const { RealAuthAdapter } = await import('../adapters/RealAuthAdapter');
      this.realAuthAdapter = new RealAuthAdapter(authConfig);

      await this.realAuthAdapter.initialize();
      this.initialized = true;

      logHybridOperation('login_service_initialized', 'auth', {
        realAdapterAvailable: !!this.realAuthAdapter,
      }, 'info');

    } catch (error) {
      logHybridOperation('login_service_init_failed', 'auth', {
        error: (error as Error).message,
      }, 'error');

      // Still allow demo accounts even if real auth fails
      this.initialized = true;
    }
  }

  /**
   * Login with email and password
   * First tries demo accounts, then real authentication
   */
  async login(email: string, password: string): Promise<AdapterResult<UniversalUser>> {
    await this.ensureInitialized();

    try {
      // First check if it's a demo account
      const demoResult = this.tryDemoLogin(email, password);
      if (demoResult.success) {
        logHybridOperation('demo_login_success', 'auth', {
          email,
          role: demoResult.data?.role,
        }, 'info');
        return demoResult;
      }

      // If not demo, try real authentication
      if (this.realAuthAdapter) {
        const realResult = await this.realAuthAdapter.login(email, password);

        if (realResult.success) {
          logHybridOperation('real_login_success', 'auth', {
            email,
            userId: realResult.data?.id,
          }, 'info');
          return realResult;
        }
      }

      // Both demo and real login failed
      logHybridOperation('login_failed', 'auth', {
        email,
        reason: 'invalid_credentials',
      }, 'warn');

      return {
        success: false,
        error: 'Invalid email or password',
      };

    } catch (error) {
      logHybridOperation('login_error', 'auth', {
        email,
        error: (error as Error).message,
      }, 'error');

      return {
        success: false,
        error: 'Login failed. Please try again.',
      };
    }
  }

  /**
   * Login with demo account specifically
   */
  async demoLogin(accountKey: DemoAccountKey): Promise<AdapterResult<UniversalUser>> {
    await this.ensureInitialized();

    const demoAccount = DEMO_ACCOUNTS[accountKey];
    if (!demoAccount) {
      return {
        success: false,
        error: 'Invalid demo account',
      };
    }

    try {
      const universalUser = toUniversalUser(demoAccount.userData, 'mock' as DataSourceType);

      if (!universalUser) {
        return {
          success: false,
          error: 'Failed to transform demo user data',
        };
      }

      logHybridOperation('demo_login_success', 'auth', {
        accountKey,
        email: demoAccount.email,
        role: demoAccount.userData.role,
      }, 'info');

      return {
        success: true,
        data: universalUser,
        metadata: {
          isDemoAccount: true,
          demoAccountKey: accountKey,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: `Demo login failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  }

  /**
   * Get available demo accounts
   */
  getDemoAccounts(): Array<{
    key: DemoAccountKey;
    email: string;
    name: string;
    role: string;
  }> {
    return Object.entries(DEMO_ACCOUNTS).map(([key, account]) => ({
      key: key as DemoAccountKey,
      email: account.email,
      name: account.userData.name,
      role: account.userData.role,
    }));
  }

  /**
   * Check if email is a demo account
   */
  isDemoAccount(email: string): boolean {
    return Object.values(DEMO_ACCOUNTS).some(account => account.email === email);
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    try {
      if (this.realAuthAdapter) {
        await this.realAuthAdapter.logout();
      }

      logHybridOperation('logout_success', 'auth', {}, 'info');
    } catch (error) {
      logHybridOperation('logout_error', 'auth', {
        error: (error as Error).message,
      }, 'error');
    }
  }

  /**
   * Get current user
   */
  async getCurrentUser(): Promise<UniversalUser | undefined> {
    try {
      if (this.realAuthAdapter) {
        const result = await this.realAuthAdapter.getCurrentUser();
        return result.success ? result.data || undefined : undefined;
      }
      return undefined;
    } catch (error) {
      logHybridOperation('get_current_user_error', 'auth', {
        error: (error as Error).message,
      }, 'error');
      return undefined;
    }
  }

  /**
   * Try demo login with email and password
   */
  private tryDemoLogin(email: string, password: string): AdapterResult<UniversalUser> {
    const demoAccount = Object.values(DEMO_ACCOUNTS).find(
      account => account.email === email && account.password === password,
    );

    if (!demoAccount) {
      return {
        success: false,
        error: 'Invalid demo credentials',
      };
    }

    try {
      const universalUser = toUniversalUser(demoAccount.userData, 'mock' as DataSourceType);

      if (!universalUser) {
        return {
          success: false,
          error: 'Failed to transform demo user data',
        };
      }

      return {
        success: true,
        data: universalUser,
        metadata: {
          isDemoAccount: true,
          demoLogin: true,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: `Demo login transformation failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  }

  /**
   * Ensure service is initialized
   */
  private async ensureInitialized(): Promise<void> {
    if (!this.initialized) {
      await this.initialize();
    }
  }
}

// Export singleton instance
export const loginService = LoginService.getInstance();
