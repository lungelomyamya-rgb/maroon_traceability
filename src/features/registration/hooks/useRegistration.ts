// src/features/registration/hooks/useRegistration.ts
// Clean UI hook for registration functionality

import { useState, useCallback, useEffect } from 'react';
import type { AuthUser, RegistrationData } from '@/src/core/types/adapter';
import { RegistrationRepository } from '@/src/features/registration/services/RegistrationRepository';

const registrationRepository = RegistrationRepository.getInstance();

/**
 * Registration state interface
 */
export interface RegistrationState {
  isLoading: boolean;
  isRegistered: boolean;
  isEmailVerified: boolean;
  error: string | null;
  user: AuthUser | null;
}

/**
 * Registration actions interface
 */
export interface RegistrationActions {
  register: (userData: RegistrationData) => Promise<boolean>;
  verifyEmail: (token: string) => Promise<boolean>;
  checkEmailAvailability: (email: string) => Promise<boolean>;
  sendVerificationEmail: (email: string) => Promise<boolean>;
  clearError: () => void;
  reset: () => void;
}

/**
 * Registration hook return type
 */
export type UseRegistration = RegistrationState & RegistrationActions;

/**
 * Registration hook
 * Provides clean interface for registration functionality
 */
export const useRegistration = (): UseRegistration => {
  const [state, setState] = useState<RegistrationState>({
    isLoading: false,
    isRegistered: false,
    isEmailVerified: false,
    error: null,
    user: null,
  });

  /**
   * Update state helper
   */
  const updateState = useCallback((updates: Partial<RegistrationState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  /**
   * Set loading state
   */
  const setLoading = useCallback((loading: boolean) => {
    updateState({ isLoading: loading });
  }, [updateState]);

  /**
   * Set error state
   */
  const setError = useCallback((error: string | null) => {
    updateState({ error, isLoading: false });
  }, [updateState]);

  /**
   * Register a new user
   */
  const register = useCallback(async (userData: RegistrationData): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const result = await registrationRepository.registerUser(userData);

      if (result.success && result.data) {
        updateState({
          isRegistered: true,
          user: result.data,
          isLoading: false,
          error: null,
        });
        return true;
      } else {
        setError(result.error || 'Registration failed');
        return false;
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Registration failed');
      return false;
    }
  }, [updateState, setError, setLoading]);

  /**
   * Verify user email
   */
  const verifyEmail = useCallback(async (token: string): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const result = await registrationRepository.verifyEmail(token);

      if (result.success) {
        updateState({
          isEmailVerified: true,
          isLoading: false,
          error: null,
        });
        return true;
      } else {
        setError(result.error || 'Email verification failed');
        return false;
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Email verification failed');
      return false;
    }
  }, [updateState, setError, setLoading]);

  /**
   * Check if email is available
   */
  const checkEmailAvailability = useCallback(async (email: string): Promise<boolean> => {
    try {
      console.log('Checking email availability for:', email);
      const result = await registrationRepository.checkEmailAvailability(email);
      console.log('Email availability result:', result);

      if (!result.success) {
        // If the adapter is not available, throw an error with the actual message
        const errorMessage = result.error || 'Email availability check failed';
        console.error('Registration hook: Throwing error:', errorMessage);
        throw new Error(errorMessage);
      }

      return result.data || false;
    } catch (error) {
      console.error('Email availability check failed:', error);
      // Re-throw the error so the calling code can handle it properly
      throw error;
    }
  }, []);

  /**
   * Send verification email
   */
  const sendVerificationEmail = useCallback(async (email: string): Promise<boolean> => {
    try {
      const result = await registrationRepository.sendVerificationEmail(email);
      return result.success;
    } catch (error) {
      console.error('Failed to send verification email:', error);
      return false;
    }
  }, []);

  /**
   * Clear error state
   */
  const clearError = useCallback(() => {
    setError(null);
  }, [setError]);

  /**
   * Reset registration state
   */
  const reset = useCallback(() => {
    setState({
      isLoading: false,
      isRegistered: false,
      isEmailVerified: false,
      error: null,
      user: null,
    });
  }, []);

  /**
   * Initialize repository on mount
   */
  useEffect(() => {
    const initializeRepository = async () => {
      try {
        await registrationRepository.initialize();
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to initialize registration');
      }
    };

    initializeRepository();

    // Cleanup on unmount
    return () => {
      registrationRepository.cleanup().catch(console.error);
    };
  }, [setError]);

  return {
    ...state,
    register,
    verifyEmail,
    checkEmailAvailability,
    sendVerificationEmail,
    clearError,
    reset,
  };
};

/**
 * Registration form hook
 * Specialized hook for registration forms with validation
 */
export const useRegistrationForm = () => {
  const registration = useRegistration();
  const [formData, setFormData] = useState<RegistrationData>({
    email: '',
    password: '',
    name: '',
    role: 'farmer',
    additionalData: {},
  });

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  /**
   * Validate form field
   */
  const validateField = useCallback((field: keyof RegistrationData, value: string): string | null => {
    switch (field) {
    case 'email':
      if (!value) {
        return 'Email is required';
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        return 'Invalid email format';
      }
      return null;

    case 'password':
      if (!value) {
        return 'Password is required';
      }
      if (value.length < 8) {
        return 'Password must be at least 8 characters';
      }
      if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
        return 'Password must contain uppercase, lowercase, and number';
      }
      return null;

    case 'name':
      if (!value) {
        return 'Name is required';
      }
      if (value.length < 2) {
        return 'Name must be at least 2 characters';
      }
      return null;

    case 'role':
      if (!value) {
        return 'Role is required';
      }
      return null;

    default:
      return null;
    }
  }, []);

  /**
   * Update form field
   */
  const updateField = useCallback((field: keyof RegistrationData, value: string | boolean | Record<string, unknown>) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // Clear field error when user starts typing
    if (fieldErrors[field]) {
      setFieldErrors(prev => ({ ...prev, [field]: '' }));
    }
  }, [fieldErrors]);

  /**
   * Validate entire form
   */
  const validateForm = useCallback((): boolean => {
    const errors: Record<string, string> = {};
    let isValid = true;

    Object.entries(formData).forEach(([field, value]) => {
      const error = validateField(field as keyof RegistrationData, value);
      if (error) {
        errors[field] = error;
        isValid = false;
      }
    });

    setFieldErrors(errors);
    return isValid;
  }, [formData, validateField]);

  /**
   * Handle form submission
   */
  const handleSubmit = useCallback(async (): Promise<boolean> => {
    if (!validateForm()) {
      return false;
    }

    return await registration.register(formData);
  }, [formData, registration, validateForm]);

  /**
   * Reset form
   */
  const resetForm = useCallback(() => {
    setFormData({
      email: '',
      password: '',
      name: '',
      role: 'farmer',
      additionalData: {},
    });
    setFieldErrors({});
    registration.reset();
  }, [registration]);

  return {
    // Form data
    formData,
    fieldErrors,

    // Registration state
    ...registration,

    // Form actions
    updateField,
    validateField,
    validateForm,
    handleSubmit,
    resetForm,

    // Form state
    isValidForm: Object.keys(fieldErrors).length === 0,
    isDirty: Object.values(formData).some(value => value !== ''),
  };
};
