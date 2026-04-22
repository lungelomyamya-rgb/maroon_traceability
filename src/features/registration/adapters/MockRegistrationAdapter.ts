// src/features/registration/adapters/MockRegistrationAdapter.ts
// Mock implementation for registration testing and development

import type {
  RegistrationAdapter,
  AdapterConfig,
  AdapterResult,
  AuthUser,
  RegistrationData,
} from '@/core/types/adapter';
import { MockUser, UserRole } from '@/types/types';

// Using consolidated MockUser interface from types/user.ts

/**
 * Mock Registration Adapter
 * Simulates registration for testing and development
 */
export class MockRegistrationAdapter implements RegistrationAdapter {
  readonly id = 'mock-registration';
  readonly type = 'mock' as const;
  readonly isAvailable = true;

  private mockUsers: MockUser[] = [];
  private config: AdapterConfig;

  constructor(config?: AdapterConfig) {
    this.config = config || { type: 'mock' };
    this.initializeMockData();
  }

  /**
   * Initialize adapter
   */
  async initialize(): Promise<void> {
    // Simulate initialization delay
    const delay = this.config.options?.simulateLatency ?
      Math.random() * 500 + 100 : 0;

    if (delay > 0) {
      await new Promise(resolve => setTimeout(resolve, delay));
    }

    console.log('Mock Registration Adapter initialized');
  }

  /**
   * Cleanup adapter resources
   */
  async cleanup(): Promise<void> {
    this.mockUsers = [];
    console.log('Mock Registration Adapter cleaned up');
  }

  /**
   * Create new user account
   */
  async createUser(userData: RegistrationData): Promise<AdapterResult<AuthUser>> {
    try {
      // Simulate processing delay
      await this.simulateDelay();

      // Simulate random errors for testing
      if (this.shouldSimulateError()) {
        return {
          success: false,
          error: 'Simulated registration failure',
        };
      }

      const { email, password, name, role, additionalData } = userData;

      // Check if user already exists
      const existingUser = this.mockUsers.find(u =>
        u.email.toLowerCase() === email.toLowerCase(),
      );

      if (existingUser) {
        return {
          success: false,
          error: 'User with this email already exists',
        };
      }

      // Create new user
      const userId = `mock-user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const verificationToken = `mock-token-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      const newUser: MockUser = {
        id: userId,
        email: email.toLowerCase(),
        password, // In real implementation, this would be hashed
        name,
        role,
        isActive: false, // Requires email verification
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        emailVerified: false,
        verificationToken,
        additionalData,
        // Mock-specific fields
        isMockUser: true,
        mockDataQuality: 'high',
        testScenario: 'registration',
        lastUpdated: new Date().toISOString(),
        preferences: {},
        failedLoginAttempts: 0,
        accountLocked: false,
        lockoutUntil: undefined,
        lastLoginIP: '127.0.0.1',
        loginMethod: 'password',
        mfaEnabled: false,
      };

      this.mockUsers.push(newUser);

      const resultUser: AuthUser = {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role as UserRole,
        isActive: newUser.isActive ?? false,
        createdAt: newUser.createdAt ?? new Date().toISOString(),
        updatedAt: newUser.updatedAt ?? new Date().toISOString(),
        emailVerified: newUser.emailVerified,
        lastLoginAt: newUser.lastLoginAt,
      };

      return {
        success: true,
        data: resultUser,
        metadata: {
          requiresEmailVerification: true,
          userId: newUser.id,
          verificationToken: newUser.verificationToken,
          mockData: true,
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
   * Verify user email
   */
  async verifyEmail(token: string): Promise<AdapterResult<void>> {
    try {
      await this.simulateDelay();

      // Find user by verification token
      const userIndex = this.mockUsers.findIndex(u => u.verificationToken === token);

      if (userIndex === -1) {
        return {
          success: false,
          error: 'Invalid or expired verification token',
        };
      }

      // Update user as verified
      this.mockUsers[userIndex] = {
        ...this.mockUsers[userIndex],
        emailVerified: true,
        isActive: true,
        updatedAt: new Date().toISOString(),
        verificationToken: undefined, // Clear token
      };

      return {
        success: true,
        data: undefined,
      };

    } catch (error) {
      return {
        success: false,
        error: `Email verification error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  }

  /**
   * Check if email is available
   */
  async checkEmailAvailability(email: string): Promise<AdapterResult<boolean>> {
    try {
      await this.simulateDelay();

      const existingUser = this.mockUsers.find(u =>
        u.email.toLowerCase() === email.toLowerCase(),
      );

      const isAvailable = !existingUser;

      return {
        success: true,
        data: isAvailable,
      };

    } catch (error) {
      return {
        success: false,
        error: `Email availability check error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  }

  /**
   * Send verification email
   */
  async sendVerificationEmail(email: string): Promise<AdapterResult<void>> {
    try {
      await this.simulateDelay();

      const user = this.mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());

      if (!user) {
        return {
          success: false,
          error: 'User not found',
        };
      }

      if (user.emailVerified) {
        return {
          success: false,
          error: 'Email is already verified',
        };
      }

      // In a real implementation, this would send an actual email
      console.log(`Mock: Verification email sent to ${email}`);
      console.log(`Mock: Verification token: ${user.verificationToken}`);

      return {
        success: true,
        data: undefined,
        metadata: {
          mockEmailSent: true,
          email: user.email,
          verificationToken: user.verificationToken,
        },
      };

    } catch (error) {
      return {
        success: false,
        error: `Verification email error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  }

  /**
   * Get adapter health status
   */
  async getHealthStatus(): Promise<{
    status: 'healthy' | 'degraded' | 'unhealthy';
    details: Record<string, unknown>;
  }> {
    try {
      const startTime = Date.now();

      // Simulate health check
      await this.simulateDelay();

      const responseTime = Date.now() - startTime;

      return {
        status: 'healthy',
        details: {
          responseTime,
          userCount: this.mockUsers.length,
          mockAdapter: true,
        },
      };

    } catch (error) {
      return {
        status: 'unhealthy',
        details: {
          error: error instanceof Error ? error.message : 'Unknown error',
          mockAdapter: true,
        },
      };
    }
  }

  /**
   * Get mock user by ID (for testing)
   */
  getMockUser(id: string): MockUser | undefined {
    return this.mockUsers.find(u => u.id === id);
  }

  /**
   * Get all mock users (for testing)
   */
  getAllMockUsers(): MockUser[] {
    return [...this.mockUsers];
  }

  /**
   * Clear mock data (for testing)
   */
  clearMockData(): void {
    this.mockUsers = [];
  }

  /**
   * Initialize mock data with some test users
   */
  private initializeMockData(): void {
    // Add some pre-existing users for testing
    this.mockUsers = [
      {
        id: 'mock-user-1',
        email: 'existing@demo.com',
        password: 'password123',
        name: 'Existing User',
        role: 'farmer',
        isActive: true,
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
        emailVerified: true,
        // Mock-specific fields
        isMockUser: true,
        mockDataQuality: 'high',
        testScenario: 'existing-user',
        lastUpdated: '2024-01-01T00:00:00.000Z',
        preferences: {},
        additionalData: {},
        verificationToken: undefined,
        failedLoginAttempts: 0,
        accountLocked: false,
        lockoutUntil: undefined,
        lastLoginIP: '127.0.0.1',
        loginMethod: 'password',
        mfaEnabled: false,
      },
      {
        id: 'mock-user-2',
        email: 'unverified@demo.com',
        password: 'password123',
        name: 'Unverified User',
        role: 'inspector',
        isActive: false,
        createdAt: '2024-01-02T00:00:00.000Z',
        updatedAt: '2024-01-02T00:00:00.000Z',
        emailVerified: false,
        verificationToken: 'mock-existing-token',
        // Mock-specific fields
        isMockUser: true,
        mockDataQuality: 'high',
        testScenario: 'unverified-user',
        lastUpdated: '2024-01-02T00:00:00.000Z',
        preferences: {},
        additionalData: {},
        failedLoginAttempts: 0,
        accountLocked: false,
        lockoutUntil: undefined,
        lastLoginIP: '127.0.0.1',
        loginMethod: 'password',
        mfaEnabled: false,
      },
    ];
  }

  /**
   * Simulate processing delay
   */
  private async simulateDelay(): Promise<void> {
    if (this.config.options?.simulateLatency) {
      const range = (this.config.options.latencyRange as [number, number]) || [100, 500];
      const delay = Math.random() * (range[1] - range[0]) + range[0];
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  /**
   * Check if we should simulate an error
   */
  private shouldSimulateError(): boolean {
    const errorRate = (this.config.options?.errorRate as number) || 0;
    return Math.random() < errorRate;
  }
}
