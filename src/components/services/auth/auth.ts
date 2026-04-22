// src/features/shared/services/auth/auth.ts
// Authentication service

import type { UniversalUser, UserRole } from '@/types/types';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: string;
  address?: string;
}

export interface AuthResponse {
  success: boolean;
  user?: UniversalUser;
  token?: string;
  refreshToken?: string;
  error?: string;
}

export class AuthService {
  private static instance: AuthService;
  private token: string | null = null;

  private constructor() {
    // Empty constructor for singleton pattern
  }

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  setToken(token: string): void {
    this.token = token;
    localStorage.setItem('auth_token', token);
  }

  getToken(): string | null {
    if (this.token) {
      return this.token;
    }

    const storedToken = localStorage.getItem('auth_token');
    if (storedToken) {
      this.token = storedToken;
      return storedToken;
    }

    return null;
  }

  clearToken(): void {
    this.token = null;
    localStorage.removeItem('auth_token');
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    // Mock implementation - replace with actual API call
    const mockUser: UniversalUser = {
      id: '1',
      name: 'John Doe',
      email: credentials.email,
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

    const token = 'mock-jwt-token-' + Date.now();
    this.setToken(token);

    return {
      success: true,
      user: mockUser,
      token,
    };
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    // Mock implementation - replace with actual API call
    const mockUser: UniversalUser = {
      id: '2',
      name: data.name,
      email: data.email,
      role: data.role as UserRole,
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

    const token = 'mock-jwt-token-' + Date.now();
    this.setToken(token);

    return {
      success: true,
      user: mockUser,
      token,
    };
  }

  async logout(): Promise<void> {
    this.clearToken();
    localStorage.removeItem('user_data');
  }

  async getCurrentUser(): Promise<UniversalUser | null> {
    const token = this.getToken();
    if (!token) {
      return null;
    }

    // Mock implementation - replace with actual API call
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

    return mockUser;
  }
}

// Export singleton instance for convenience
export const authService = AuthService.getInstance();
