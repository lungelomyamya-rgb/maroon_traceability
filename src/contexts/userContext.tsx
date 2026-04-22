// src/contexts/userContext.tsx
// User Management Context - Combines auth and user state management

'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { DEMO_USERS } from '@/constants/users';
import type { AuthAdapter, RegistrationData } from '@/core/types/adapter';
import { MockAuthAdapter } from '@/features/auth/adapters/MockAuthAdapter';
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
  const [adapter] = useState(() => new MockAuthAdapter());

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
      const result = await adapter.login(email, password);
      if (result.success && result.data) {
        setUser(result.data);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    } finally {
      setLoading(false);
    }
  }, [adapter]);

  const logout = useCallback(async (): Promise<void> => {
    setLoading(true);
    try {
      await adapter.logout();
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setLoading(false);
    }
  }, [adapter]);

  const register = useCallback(async (data: RegistrationData): Promise<boolean> => {
    setLoading(true);
    try {
      const result = await adapter.register(data);
      return result.success;
    } catch (error) {
      console.error('Registration failed:', error);
      return false;
    } finally {
      setLoading(false);
    }
  }, [adapter]);

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

  // User management methods
  const switchUser = useCallback((userId: string) => {
    // Find user in mock data
    const mockUser = DEMO_USERS.find((u: any) => u.id === userId);
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
