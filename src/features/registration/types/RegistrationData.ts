// src/features/registration/types/RegistrationData.ts
// Registration data types

import type { UserRole } from '@/src/core/types/adapter';

/**
 * User registration data
 */
export interface RegistrationData {
  /** User email address */
  email: string;

  /** User password */
  password: string;

  /** User's full name */
  name: string;

  /** User's role in the system */
  role: UserRole;

  /** Additional registration data */
  additionalData?: Record<string, unknown>;
}
