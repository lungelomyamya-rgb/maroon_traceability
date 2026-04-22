// src/features/registration/types.ts
// Registration-specific type definitions

import type { AuthUser, RegistrationData as _RegistrationData } from '@/src/core/types/adapter';

/**
 * Registration form state
 */
export interface RegistrationFormState {
  email: string;
  password: string;
  name: string;
  role: string;
  additionalData: Record<string, unknown>;
}

/**
 * Registration validation errors
 */
export interface RegistrationValidationErrors {
  email?: string;
  password?: string;
  name?: string;
  role?: string;
}

/**
 * Registration API response
 */
export interface RegistrationResponse {
  success: boolean;
  user?: AuthUser;
  error?: string;
  requiresEmailVerification?: boolean;
}

/**
 * Email verification response
 */
export interface EmailVerificationResponse {
  success: boolean;
  error?: string;
}

/**
 * Registration component props
 */
export interface RegistrationComponentProps {
  onSuccess?: (user: AuthUser) => void;
  onCancel?: () => void;
  className?: string;
}

/**
 * Registration flow props
 */
export interface RegistrationFlowProps extends RegistrationComponentProps {
  redirectTo?: string;
  showLoginLink?: boolean;
}

/**
 * Registration statistics
 */
export interface RegistrationStats {
  totalUsers: number;
  activeUsers: number;
  recentRegistrations: number;
  registrationsByRole: Record<string, number>;
}
