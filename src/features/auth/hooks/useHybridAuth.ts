// src/features/auth/hooks/useHybridAuth.ts
// Hybrid authentication hooks for dual-mode authentication


import type { UniversalUser } from '@/types/types';
import { toUniversalUser } from '@/types/types';
import { useState, useCallback, useEffect } from 'react';
import type { RegistrationData } from '../../../core/types/adapter';
import { HybridAuthAdapter } from '../adapters/HybridAuthAdapter';

/**
 * Authentication state interface
 */
export interface HybridAuthState {
  user: UniversalUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  mode: 'mock' | 'real';
  fallbackEnabled: boolean;
  lastError: string | null | undefined;
  healthStatus: {
    status: 'healthy' | 'degraded' | 'unhealthy';
    details: Record<string, unknown>;
  } | null;
}

/**
 * Authentication actions interface
 */
export interface HybridAuthActions {
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: RegistrationData) => Promise<boolean>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  resetPassword: (email: string) => Promise<boolean>;
  switchMode: (mode: 'mock' | 'real') => void;
  toggleFallback: () => void;
  clearError: () => void;
}

/**
 * Hybrid authentication hook return type
 */
export type UseHybridAuth = HybridAuthState & HybridAuthActions & {
  checkHealth: () => Promise<void>;
};

/**
 * Hybrid authentication hook
 * Manages both mock and real authentication adapters
 */
export const useHybridAuth = (config?: {
  initialMode?: 'mock' | 'real';
  fallbackEnabled?: boolean;
}): UseHybridAuth => {
  const [state, setState] = useState<HybridAuthState>({
    user: null,
    isLoading: false,
    isAuthenticated: false,
    mode: config?.initialMode || 'mock',
    fallbackEnabled: config?.fallbackEnabled ?? true,
    lastError: null,
    healthStatus: null,
  });

  // Initialize adapter
  const [adapter] = useState(() => {
    const hybridAdapter = new HybridAuthAdapter({
      type: config?.initialMode || 'mock',
      mode: config?.initialMode || 'mock',
      fallbackEnabled: config?.fallbackEnabled ?? true,
    });

    // Initialize adapter
    hybridAdapter.initialize().catch(error => {
      console.error('Failed to initialize hybrid adapter:', error);
    });

    return hybridAdapter;
  });

  // Login function
  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    setState(prev => ({ ...prev, isLoading: true, lastError: null }));

    try {
      const result = await adapter.login(email, password);

      if (result.success) {
        const universalUser = result.data ? toUniversalUser(result.data, 'api') : null;
        setState(prev => ({
          ...prev,
          user: universalUser,
          isAuthenticated: !!universalUser,
          isLoading: false,
          lastError: null,
        }));
        return true;
      } else {
        setState(prev => ({
          ...prev,
          user: null,
          isAuthenticated: false,
          isLoading: false,
          lastError: result.error,
        }));
        return false;
      }
    } catch (error) {
      const errorMessage = `Login error: ${error instanceof Error ? error.message : 'Unknown error'}`;
      setState(prev => ({
        ...prev,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        lastError: errorMessage,
      }));
      return false;
    }
  }, [adapter]);

  // Register function
  const register = useCallback(async (userData: RegistrationData): Promise<boolean> => {
    setState(prev => ({ ...prev, isLoading: true, lastError: null }));

    try {
      const result = await adapter.register(userData);

      if (result.success) {
        const universalUser = result.data ? toUniversalUser(result.data, 'api') : null;
        setState(prev => ({
          ...prev,
          user: universalUser,
          isAuthenticated: !!universalUser,
          isLoading: false,
          lastError: null,
        }));
        return true;
      } else {
        setState(prev => ({
          ...prev,
          user: null,
          isAuthenticated: false,
          isLoading: false,
          lastError: result.error,
        }));
        return false;
      }
    } catch (error) {
      const errorMessage = `Registration error: ${error instanceof Error ? error.message : 'Unknown error'}`;
      setState(prev => ({
        ...prev,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        lastError: errorMessage,
      }));
      return false;
    }
  }, [adapter]);

  // Logout function
  const logout = useCallback(async (): Promise<void> => {
    setState(prev => ({ ...prev, isLoading: true }));

    try {
      await adapter.logout();
      setState(prev => ({
        ...prev,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        lastError: null,
      }));
    } catch (error) {
      const errorMessage = `Logout error: ${error instanceof Error ? error.message : 'Unknown error'}`;
      setState(prev => ({
        ...prev,
        isLoading: false,
        lastError: errorMessage,
      }));
    }
  }, [adapter]);

  // Refresh user function
  const refreshUser = useCallback(async (): Promise<void> => {
    setState(prev => ({ ...prev, isLoading: true }));

    try {
      const result = await adapter.getCurrentUser();

      if (result.success) {
        const universalUser = result.data ? toUniversalUser(result.data, 'api') : null;
        setState(prev => ({
          ...prev,
          user: universalUser,
          isAuthenticated: !!universalUser,
          isLoading: false,
          lastError: null,
        }));
      } else {
        setState(prev => ({
          ...prev,
          isLoading: false,
          lastError: result.error,
        }));
      }
    } catch (error) {
      const errorMessage = `Refresh user error: ${error instanceof Error ? error.message : 'Unknown error'}`;
      setState(prev => ({
        ...prev,
        isLoading: false,
        lastError: errorMessage,
      }));
    }
  }, [adapter]);

  // Reset password function
  const resetPassword = useCallback(async (email: string): Promise<boolean> => {
    setState(prev => ({ ...prev, isLoading: true, lastError: null }));

    try {
      const result = await adapter.resetPassword(email);

      if (result.success) {
        setState(prev => ({
          ...prev,
          isLoading: false,
          lastError: null,
        }));
        return true;
      } else {
        setState(prev => ({
          ...prev,
          isLoading: false,
          lastError: result.error,
        }));
        return false;
      }
    } catch (error) {
      const errorMessage = `Reset password error: ${error instanceof Error ? error.message : 'Unknown error'}`;
      setState(prev => ({
        ...prev,
        isLoading: false,
        lastError: errorMessage,
      }));
      return false;
    }
  }, [adapter]);

  // Switch mode function
  const switchMode = useCallback((mode: 'mock' | 'real') => {
    adapter.switchMode(mode);
    setState(prev => ({ ...prev, mode }));
  }, [adapter]);

  // Toggle fallback function
  const toggleFallback = useCallback(() => {
    const newFallbackEnabled = !state.fallbackEnabled;
    adapter.setFallbackEnabled(newFallbackEnabled);
    setState(prev => ({ ...prev, fallbackEnabled: newFallbackEnabled }));
  }, [adapter, state.fallbackEnabled]);

  // Clear error function
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, lastError: null }));
  }, []);

  // Check health status
  const checkHealth = useCallback(async () => {
    try {
      const health = await adapter.getHealth();
      // Transform health object to match expected interface
      const transformedHealth = {
        status: health.status,
        details: {
          adapterId: health.adapterId,
          lastCheck: health.lastCheck,
          metrics: health.metrics,
          currentMode: health.currentMode,
          fallbackEnabled: health.fallbackEnabled,
        },
      };
      setState(prev => ({ ...prev, healthStatus: transformedHealth }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setState(prev => ({
        ...prev,
        healthStatus: {
          status: 'unhealthy',
          details: { error: errorMessage },
        },
      }));
    }
  }, [adapter]);

  // Auto-check health status on mount and mode changes
  useEffect(() => {
    checkHealth();
  }, [checkHealth, state.mode]);

  // Auto-refresh user on mount
  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  return {
    // State
    user: state.user,
    isLoading: state.isLoading,
    isAuthenticated: state.isAuthenticated,
    mode: state.mode,
    fallbackEnabled: state.fallbackEnabled,
    lastError: state.lastError,
    healthStatus: state.healthStatus,

    // Actions
    login,
    register,
    logout,
    refreshUser,
    resetPassword,
    switchMode,
    toggleFallback,
    clearError,
    checkHealth,
  };
};

/**
 * Authentication form hook
 * Specialized hook for authentication forms with validation
 */
export const useHybridAuthForm = (config?: {
  initialMode?: 'mock' | 'real';
  fallbackEnabled?: boolean;
}) => {
  const auth = useHybridAuth(config);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validate email
  const validateEmail = (email: string): string => {
    if (!email) {
      return 'Email is required';
    }
    if (!email.includes('@')) {
      return 'Invalid email format';
    }
    return '';
  };

  // Validate password
  const validatePassword = (password: string): string => {
    if (!password) {
      return 'Password is required';
    }
    if (password.length < 6) {
      return 'Password must be at least 6 characters';
    }
    return '';
  };

  // Handle field changes
  const handleFieldChange = (field: 'email' | 'password', value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // Clear error for this field
    setErrors(prev => ({ ...prev, [field]: '' }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate form
    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);

    if (emailError || passwordError) {
      setErrors({ email: emailError, password: passwordError });
      setIsSubmitting(false);
      return;
    }

    // Attempt login
    const success = await auth.login(formData.email, formData.password);

    if (success) {
      // Reset form on successful login
      setFormData({ email: '', password: '' });
      setErrors({ email: '', password: '' });
    }

    setIsSubmitting(false);
  };

  // Reset form
  const resetForm = () => {
    setFormData({ email: '', password: '' });
    setErrors({ email: '', password: '' });
    setIsSubmitting(false);
    auth.clearError();
  };

  return {
    // Form state
    formData,
    errors,
    isSubmitting,

    // Form actions
    handleFieldChange,
    handleSubmit,
    resetForm,

    // Auth state and actions
    user: auth.user,
    isLoading: auth.isLoading,
    isAuthenticated: auth.isAuthenticated,
    mode: auth.mode,
    fallbackEnabled: auth.fallbackEnabled,
    lastError: auth.lastError,
    healthStatus: auth.healthStatus,
    login: auth.login,
    register: auth.register,
    logout: auth.logout,
    refreshUser: auth.refreshUser,
    resetPassword: auth.resetPassword,
    switchMode: auth.switchMode,
    toggleFallback: auth.toggleFallback,
    clearError: auth.clearError,
    checkHealth: auth.checkHealth,
  };
};
