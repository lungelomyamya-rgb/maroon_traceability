// src/contexts/userContext.tsx
// User Management Context - Combines auth and user state management

'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { DEMO_USERS } from '@/constants/users';
import type { AuthAdapter, RegistrationData } from '@/core/types/adapter';
import { MockAuthAdapter } from '@/features/auth/adapters/MockAuthAdapter';
import { RealAuthAdapter } from '@/features/auth/adapters/RealAuthAdapter';
import { DualAuthService } from '@/features/auth/application/DualAuthService';
import { enrichUserFromRegistration } from '@/lib/enrichUserFromRegistration';
import type { User, UniversalUser, UserRole } from '@/types';
import { toUniversalUser } from '@/types';

/**
 * User Context Type
 * Combines authentication and user management functionality
 */
export interface UserContextType {
  // User state
  user: User | UniversalUser | null;
  currentUser: User | UniversalUser | null; // Backward compatibility
  loading: boolean;

  // Authentication methods
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  register: (data: RegistrationData) => Promise<boolean>;
  refreshToken: () => Promise<boolean>;

  // User management methods
  setUser: (user: User | UniversalUser | null) => void;
  switchUser: (userId: string) => void;
  updateUserRole: (role: UserRole) => void;

  // Token management methods
  getAuthToken: () => Promise<string | null>;

  // Auth adapter
  adapter: AuthAdapter;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

/**
 * User Provider
 * Manages both authentication and user state in a single context
 */
export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState< User | UniversalUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [adapter] = useState(() => {
    // Use RealAuthAdapter for real authentication, MockAuthAdapter for demo
    const realAdapter = new RealAuthAdapter();
    if (realAdapter.isAvailable) {
      console.log('Using RealAuthAdapter (Supabase)');
      return realAdapter;
    } else {
      console.log('RealAuthAdapter not available, using MockAuthAdapter for demo');
      return new MockAuthAdapter();
    }
  });

  // Initialize adapter and restore session
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setLoading(true);
        await adapter.initialize();
        
        const result = await adapter.getCurrentUser();
        if (result.success && result.data) {
          setUser(result.data);
        }
      } catch (error) {
        console.error('Failed to initialize auth:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, [adapter]);

  // Authentication methods
  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    try {
      const realAdapter = new RealAuthAdapter();

      // Password login always prefers Supabase when configured.
      // DO NOT fall back to DualAuthService - that accepts demo passwords
      // even when Supabase Auth rejected the request (security hole).
      if (realAdapter.isAvailable) {
        const result = await realAdapter.login(email, password);
        if (result.success && result.data) {
          setUser(result.data);
          return true;
        }
        return false;
      }

      // Supabase not confirmed (local demo without env): allow DualAuth only then
      const dualResult = await DualAuthService.getInstance().login(email, password);
      if (dualResult.success && dualResult.data) {
        setUser(dualResult.data);
        return true;
      }

      return false;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async (): Promise<void> => {
    setLoading(true);
    try {
      await adapter.logout();
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setUser(null);
      if (typeof window !== 'undefined') {
        try {
          // Legacy tokens
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          // Any leftover Supabase keys in localStorage from before sessionStorage migration
          Object.keys(localStorage).forEach((key) => {
            if (key.startsWith('sb-') || key.includes('supabase')) {
              localStorage.removeItem(key);
            }
          });
        } catch {
          // ignore storage errors
        }
      }
      setLoading(false);
    }
  }, [adapter]);

  const register = useCallback(async (data: RegistrationData): Promise<boolean> => {
    setLoading(true);
    try {
      console.log('Starting registration process for:', data.email);

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = (await response.json()) as {
        success: boolean;
        data?: Record<string, unknown>;
        error?: string;
      };

      if (!response.ok || !result.success || !result.data) {
        console.error('Registration failed:', result.error ?? response.statusText);
        return false;
      }

      const realAdapter = new RealAuthAdapter();
      if (realAdapter.isAvailable) {
        const loginResult = await realAdapter.login(data.email, data.password);
        if (loginResult.success && loginResult.data) {
          setUser(enrichUserFromRegistration(loginResult.data, data));
          return true;
        }
      }

      const universalUser = toUniversalUser(result.data, 'api', {
        adapterId: 'supabase-registration-server',
        version: '1.0.0',
      });

      if (!universalUser) {
        console.error('Failed to normalize user after registration');
        return false;
      }

      setUser(enrichUserFromRegistration(universalUser, data));
      return true;
    } catch (error) {
      console.error('Registration failed:', error);
      return false;
    } finally {
      setLoading(false);
    }
  }, [setUser]);

  const refreshToken = useCallback(async (): Promise<boolean> => {
    try {
      const result = await adapter.refreshToken?.();
      if (result?.success && result.data) {
        setUser(result.data as unknown as User | UniversalUser);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Token refresh failed:', error);
      return false;
    }
  }, [adapter]);

  const getAuthToken = useCallback(async (): Promise<string | null> => {
    try {
      console.log('Getting auth token, adapter type:', adapter.type);
      
      // Try to get token from storage service
      if ('getAuthToken' in adapter) {
        console.log('Using adapter getAuthToken method');
        return await (adapter as any).getAuthToken();
      }
      
      // For RealAuthAdapter (Supabase), get token from Supabase session
      if (adapter.type === 'real') {
        console.log('Using Supabase session for token');
        const { supabase } = await import('@/features/registration/services/supabaseClient');
        if (supabase) {
          const { data: { session } } = await supabase.auth.getSession();
          console.log('Supabase session found:', session ? 'Yes' : 'No');
          return session?.access_token || null;
        }
      }
      
      // Fallback to localStorage for adapters that don't implement getAuthToken
      if (typeof window !== 'undefined') {
        const localToken = localStorage.getItem('access_token');
        console.log('localStorage token found:', localToken ? 'Yes' : 'No');
        return localToken;
      }
      
      console.log('No token found anywhere');
      return null;
    } catch (error) {
      console.error('Failed to get auth token:', error);
      return null;
    }
  }, [adapter]);

  // User management methods
  const switchUser = useCallback((userId: string) => {
    // Find user in mock data (demo functionality)
    const mockUser = DEMO_USERS.find((u: User) => u.id === userId);
    if (mockUser) {
      const universalUser = toUniversalUser(mockUser, 'mock');
      if (universalUser) {
        setUser(universalUser);
      }
    }
  }, []);

  const updateUserRole = useCallback((role: UserRole) => {
    setUser((prevUser: User | UniversalUser | null) => {
      if (!prevUser) {
        return null;
      }
      return {
        ...prevUser,
        role,
      };
    });
  }, []);

  const contextValue: UserContextType = {
    user,
    currentUser: user, // Alias for backward compatibility
    loading,
    login,
    logout,
    register,
    refreshToken,
    setUser,
    switchUser,
    updateUserRole,
    getAuthToken,
    adapter,
  };

  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  );
}

/**
 * Hook to use unified user context
 */
export function useUser(): UserContextType {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}

/**
 * Backward compatibility hooks
 * These provide the same interface as the old contexts
 */
export function useAuth() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within a UserProvider');
  }
  const { user, loading, login, logout, register, refreshToken } = context;
  return {
    user: user as User | null,
    loading,
    login,
    logout,
    register,
    refreshToken,
  };
}

// Export the context for advanced usage
export { UserContext };
