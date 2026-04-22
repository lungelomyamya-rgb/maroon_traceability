// src/features/auth/services/TokenProvider.ts
// Token management service

declare global {
  function btoa(data: string): string;
  function atob(data: string): string;
}

import type { ITokenProvider, IStorageService, TokenPair } from '@/core/interfaces/services';
import type { UniversalUser } from '@/types/types';

/**
 * JWT Token Provider Implementation
 * Handles JWT token generation, validation, and lifecycle management
 */
export class TokenProvider implements ITokenProvider {
  readonly name = 'TokenProvider';
  readonly version = '1.0.0';

  constructor(
    private storageService: IStorageService,
  ) {}

  /**
   * Generate access and refresh tokens for a user
   */
  async generateTokens(user: UniversalUser): Promise<TokenPair> {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      iat: Math.floor(Date.now() / 1000),
    };

    // Mock JWT implementation - in production, use real RS256
    const accessToken = this.generateMockJWT(payload, '15m');
    const refreshToken = this.generateMockJWT(payload, '7d');

    // Store refresh token securely
    await this.storageService.setItem('refresh_token', refreshToken);

    return {
      accessToken,
      refreshToken,
      expiresIn: 15 * 60, // 15 minutes in seconds
    };
  }

  /**
   * Refresh tokens using refresh token
   */
  async refreshToken(refreshToken: string): Promise<TokenPair> {
    const storedToken = await this.storageService.getItem('refresh_token');
    if (storedToken !== refreshToken) {
      throw new Error('Invalid refresh token');
    }

    // Mock user lookup - in production, validate refresh token
    const mockUser: UniversalUser = {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'farmer',
      _source: {
        type: 'mock',
        timestamp: new Date().toISOString(),
      },
      _validation: {
        isValid: true,
        validatedAt: new Date().toISOString(),
      },
      _normalized: true,
    };

    return this.generateTokens(mockUser);
  }

  /**
   * Revoke current token
   */
  async revokeCurrentToken(): Promise<void> {
    await this.storageService.removeItem('access_token');
    await this.storageService.removeItem('refresh_token');
  }

  /**
   * Get user from stored token
   */
  async getCurrentUserFromToken(): Promise<UniversalUser | null> {
    const token = await this.storageService.getItem('access_token');
    if (!token) {
      return null;
    }

    // Mock token validation - in production, use real JWT verification
    return this.getUserFromMockToken(token);
  }

  /**
   * Revoke specific token
   */
  async revokeToken(tokenId: string): Promise<void> {
    // In production, add token to blacklist
    console.log(`Token ${tokenId} revoked`);
  }

  /**
   * Generate mock JWT (for development)
   */
  private generateMockJWT(payload: Record<string, unknown>, _expiresIn: string): string {
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payloadStr = btoa(JSON.stringify(payload));
    const signature = btoa('mock-signature');

    return `${header}.${payloadStr}.${signature}`;
  }

  /**
   * Get user from mock token (for development)
   */
  private getUserFromMockToken(token: string): UniversalUser | null {
    try {
      const [, payloadStr] = token.split('.');
      const payload = JSON.parse(atob(payloadStr));

      return {
        id: payload.sub,
        name: 'John Doe',
        email: payload.email,
        role: payload.role,
        _source: {
          type: 'mock',
          timestamp: new Date().toISOString(),
        },
        _validation: {
          isValid: true,
          validatedAt: new Date().toISOString(),
        },
        _normalized: true,
      };
    } catch {
      return null;
    }
  }
}
