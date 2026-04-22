// src/features/auth/adapters/DecoupledAuthAdapter.ts
// Decoupled authentication adapter using focused services

import type { UniversalUser } from '@/types/types';
import type { IAuthAdapter, AuthResult, AdapterHealth } from '../../../core/interfaces/IAdapter';
import type { IIdentityService, ITokenProvider, IStorageService } from '../../../core/interfaces/services';

/**
 * Decoupled Auth Adapter Implementation
 * Uses dependency injection and focused services for better maintainability
 */
export class DecoupledAuthAdapter implements IAuthAdapter {
  readonly type = 'decoupled';
  readonly id = 'decoupled-auth';

  constructor(
    private identityService: IIdentityService,
    private tokenProvider: ITokenProvider,
    private storageService: IStorageService,
  ) {}

  async initialize(): Promise<void> {
    console.log('DecoupledAuthAdapter initialized');
  }

  async cleanup(): Promise<void> {
    console.log('DecoupledAuthAdapter cleaned up');
  }

  async getHealth(): Promise<AdapterHealth> {
    return {
      isHealthy: true,
      lastCheck: new Date(),
      responseTime: 0,
      errorCount: 0,
      uptime: 100,
      status: 'healthy',
      consecutiveFailures: 0,
    };
  }

  /**
   * Authenticate user credentials
   */
  async login(email: string, password: string): Promise<AuthResult> {
    const user = await this.identityService.authenticate(email, password);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const tokens = await this.tokenProvider.generateTokens(user);

    // Store access token
    await this.storageService.setItem('access_token', tokens.accessToken);

    return {
      success: true,
      data: user,
      token: tokens.accessToken,
    };
  }

  /**
   * Register new user
   */
  async register(userData: Partial<UniversalUser>): Promise<AuthResult> {
    const user = await this.identityService.register(userData);
    const tokens = await this.tokenProvider.generateTokens(user);

    // Store access token
    await this.storageService.setItem('access_token', tokens.accessToken);

    return {
      success: true,
      data: user,
      token: tokens.accessToken,
    };
  }

  /**
   * Get current authenticated user
   */
  async getCurrentUser(): Promise<AuthResult> {
    const token = await this.storageService.getItem('access_token');
    if (!token) {
      return { success: false, error: 'No token found' };
    }

    const user = await this.tokenProvider.getCurrentUserFromToken();
    if (!user) {
      return { success: false, error: 'Invalid token' };
    }

    return { success: true, data: user };
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    await this.tokenProvider.revokeCurrentToken();
    await this.storageService.removeItem('access_token');
    await this.storageService.removeItem('refresh_token');
  }

  /**
   * Refresh tokens
   */
  async refreshToken(): Promise<AuthResult> {
    const refreshToken = await this.storageService.getItem('refresh_token');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const tokens = await this.tokenProvider.refreshToken(refreshToken);
    const user = await this.tokenProvider.getCurrentUserFromToken();

    if (user) {
      await this.storageService.setItem('access_token', tokens.accessToken);
    }

    return {
      success: true,
      data: user || undefined,
      token: tokens.accessToken,
    };
  }

  /**
   * Update user profile
   */
  async updateUser(id: string, updates: Partial<UniversalUser>): Promise<UniversalUser> {
    return await this.identityService.updateProfile(id, updates);
  }

  /**
   * Change password
   */
  async changePassword(_oldPassword: string, _newPassword: string): Promise<void> {
    // This would need the current user ID - for now, just a placeholder
    // In a real implementation, you'd get the current user from token/session
    console.log('Password change requested');
  }

  /**
   * Reset password
   */
  async resetPassword(email: string): Promise<void> {
    console.log('Password reset requested for:', email);
  }

  /**
   * Deactivate account
   */
  async deactivateAccount(userId: string): Promise<void> {
    await this.identityService.deactivateAccount(userId);
  }
}
