/**
 * @fileoverview Authentication Feature - User authentication and authorization
 * @version 1.0.0
 * @author Maroon Traceability Team
 * @description 
 * Complete authentication system including login, registration, role-based access control,
 * and user management. All components are responsive, accessible, and include comprehensive
 * TypeScript support with proper error handling and security measures.
 * 
 * @example
 * ```typescript
 * import { AuthPage, useAuth, User } from '@/features/auth';
 * 
 * function App() {
 *   const { user, login, logout, isLoading } = useAuth();
 *   
 *   return (
 *     <AuthPage 
 *       onLogin={handleLogin}
 *       onRegister={handleRegister}
 *       theme="light"
 *     />
 *   );
 * }
 * ```
 */

// ============================================================================
// COMPONENT EXPORTS
// ============================================================================

/**
 * Complete authentication page with login and registration forms
 * @component AuthPage
 * @example
 * ```typescript
 * <AuthPage 
 *   onLogin={handleLogin}
 *   onRegister={handleRegister}
 *   showSocialLogin={true}
 *   theme="light"
 * />
 * ```
 */
export { default as AuthPage } from './components/AuthPage';

/**
 * Login form component with validation and error handling
 * @component LoginForm
 * @example
 * ```typescript
 * <LoginForm 
 *   onLogin={handleLogin}
 *   onRegisterClick={showRegister}
 *   loading={isLoading}
 *   error={loginError}
 * />
 * ```
 */
export { default as LoginForm } from './components/LoginForm';

/**
 * Registration form component with role selection and validation
 * @component RegisterForm
 * @example
 * ```typescript
 * <RegisterForm 
 *   onRegister={handleRegister}
 *   onLoginClick={showLogin}
 *   loading={isLoading}
 *   error={registerError}
 *   availableRoles={['farmer', 'inspector', 'retailer']}
 * />
 * ```
 */
export { default as RegisterForm } from './components/RegisterForm';

// Export all components for convenience
export * from './components';

// ============================================================================
// HOOK EXPORTS
// ============================================================================

/**
 * Authentication management hook with state persistence
 * @hook useAuth
 * @returns {Object} Authentication state and management functions
 * @example
 * ```typescript
 * const { 
 *   user, 
 *   login, 
 *   logout, 
 *   register,
 *   isLoading,
 *   error,
 *   isAuthenticated,
 *   updateUser,
 *   clearError
 * } = useAuth();
 * ```
 */
export { useAuth } from './hooks/useAuth';

// ============================================================================
// TYPE EXPORTS
// ============================================================================

/**
 * User interface for authentication system
 * @interface User
 * @property {string} id - Unique user identifier
 * @property {string} name - User's full name
 * @property {string} email - User's email address
 * @property {UserRole} role - User's role in the system
 * @property {string | Address} address - User's address (string or object)
 * @property {boolean} isActive - Whether the user account is active
 * @property {Date} createdAt - Account creation timestamp
 * @property {Date} updatedAt - Last update timestamp
 */
export type { User } from './types/userTypes';

/**
 * User role enumeration for role-based access control
 * @enum UserRole
 * @property {string} farmer - Farmer role with product management
 * @property {string} inspector - Inspector role with verification capabilities
 * @property {string} logistics - Logistics role with transport management
 * @property {string} packaging - Packaging role with batch processing
 * @property {string} retailer - Retailer role with sales management
 * @property {string} public - Public role with read-only access
 * @property {string} government - Government role with oversight
 * @property {string} admin - Administrator role with full access
 */
export type { UserRole } from './types/userTypes';

/**
 * Authentication state interface for auth context
 * @interface AuthState
 * @property {User | null} user - Currently authenticated user
 * @property {boolean} isLoading - Loading state for auth operations
 * @property {string | null} error - Authentication error message
 * @property {boolean} isAuthenticated - Authentication status
 */
export type { AuthState } from './hooks/useAuth';

// ============================================================================
// IMPORTS FOR API OBJECT
// ============================================================================

import AuthPage from './components/AuthPage';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import { useAuth } from './hooks/useAuth';

// ============================================================================
// PUBLIC API
// ============================================================================

/**
 * Authentication Feature Public API
 * Provides clean, type-safe access to all authentication functionality
 * 
 * @namespace AuthAPI
 * @example
 * ```typescript
 * import { authAPI } from '@/features/auth';
 * 
 * // Use components and hooks
 * const { AuthPage, useAuth, User } = authAPI;
 * 
 * // Render authentication
 * <AuthPage />
 * ```
 */
export const authAPI = {
  // Core Components
  AuthPage,
  LoginForm,
  RegisterForm,
  
  // Hooks
  useAuth,
  
  // Types are exported separately for tree-shaking
} as const;

// ============================================================================
// FEATURE METADATA
// ============================================================================

/**
 * Authentication feature metadata
 * @readonly
 * @enum {string}
 */
export const AUTH_FEATURE = {
  /** Feature version */
  VERSION: '1.0.0',
  /** Feature name */
  NAME: 'Authentication',
  /** Feature description */
  DESCRIPTION: 'User authentication and authorization system with role-based access control',
  /** Feature dependencies */
  DEPENDENCIES: ['react', 'next', 'typescript', 'zod'],
  /** Feature tags */
  TAGS: ['authentication', 'authorization', 'login', 'register', 'rbac', 'security'],
} as const;

// ============================================================================
// RE-EXPORTS FOR CONVENIENCE
// ============================================================================

/**
 * Default export - Main AuthPage component
 * @default
 * @example
 * ```typescript
 * import AuthPage from '@/features/auth';
 * 
 * <AuthPage />
 * ```
 */
export { default } from './components/AuthPage';
