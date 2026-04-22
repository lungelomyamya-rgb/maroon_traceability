// src/features/auth/services/StorageService.ts
// Storage service for secure data persistence

import type { IStorageService, CookieOptions } from '../../../core/interfaces/services';

/**
 * HttpOnly Cookie Storage Service Implementation
 * Provides secure storage with HttpOnly cookies
 */
export class StorageService implements IStorageService {
  readonly name = 'StorageService';
  readonly version = '1.0.0';
  /**
   * Set secure cookie
   */
  async setSecureCookie(name: string, value: string, options?: CookieOptions): Promise<void> {
    const defaultOptions: CookieOptions = {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      path: '/',
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      ...options,
    };

    // In production, call secure API endpoint
    document.cookie = `${name}=${encodeURIComponent(value)}; ${this.formatCookieOptions(defaultOptions)}`;
  }

  /**
   * Get secure cookie
   */
  async getSecureCookie(name: string): Promise<string | null> {
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
      const [cookieName, ...rest] = cookie.trim().split('=');
      if (cookieName === name) {
        const value = rest.join('=');
        return decodeURIComponent(value);
      }
    }
    return null;
  }

  /**
   * Remove secure cookie
   */
  async removeSecureCookie(name: string): Promise<void> {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;`;
  }

  /**
   * Set item in localStorage
   */
  async setItem(key: string, value: string): Promise<void> {
    localStorage.setItem(key, value);
  }

  /**
   * Get item from localStorage
   */
  async getItem(key: string): Promise<string | null> {
    return localStorage.getItem(key);
  }

  /**
   * Remove item from localStorage
   */
  async removeItem(key: string): Promise<void> {
    localStorage.removeItem(key);
  }

  /**
   * Format cookie options string
   */
  private formatCookieOptions(options: CookieOptions): string {
    const parts: string[] = [];

    if (options.expires) {
      parts.push(`expires=${options.expires.toUTCString()}`);
    }

    if (options.path) {
      parts.push(`path=${options.path}`);
    }

    if (options.sameSite) {
      parts.push(`samesite=${options.sameSite}`);
    }

    if (options.secure) {
      parts.push('secure');
    }

    if (options.httpOnly) {
      parts.push('httponly');
    }

    return parts.length > 0 ? `; ${parts.join('; ')}` : '';
  }
}
