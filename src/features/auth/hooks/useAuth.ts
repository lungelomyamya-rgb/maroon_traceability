// src/features/auth/hooks/useAuth.ts
// Authentication hook for auth feature

import { useState, useEffect } from 'react';

import type { User, UserRole } from '../types/userTypes';

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: false,
    error: null,
  });

  const login = async (email: string, password: string) => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      // Mock authentication logic - replace with real auth service
      const mockUsers = [
        { id: '1', email: 'farmer@example.com', name: 'John Farmer', role: 'farmer' as UserRole },
        { id: '2', email: 'inspector@example.com', name: 'Jane Inspector', role: 'inspector' as UserRole },
        { id: '3', email: 'retailer@example.com', name: 'Bob Retailer', role: 'retailer' as UserRole },
      ];

      const user = mockUsers.find(u => u.email === email);
      
      if (user && password === 'password') {
        setAuthState({ user, loading: false, error: null });
        return { success: true, user };
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Login failed',
      }));
      return { success: false, error: error instanceof Error ? error.message : 'Login failed' };
    }
  };

  const logout = () => {
    setAuthState({ user: null, loading: false, error: null });
  };

  const clearError = () => {
    setAuthState(prev => ({ ...prev, error: null }));
  };

  const updateUser = (updates: Partial<User>) => {
    setAuthState(prev => ({
      ...prev,
      user: prev.user ? { ...prev.user, ...updates } : null,
    }));
  };

  return {
    ...authState,
    login,
    logout,
    clearError,
    updateUser,
  };
};
