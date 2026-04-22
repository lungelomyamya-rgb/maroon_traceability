// src/features/auth/index.ts
// Authentication feature barrel export - With Hybrid Architecture

// ============================================================================
// SERVICES (Hybrid Architecture Integration)
// ============================================================================

/**
 * Authentication Application
 * Production-ready authentication with hybrid architecture integration
 */
export { authApplication, AuthApplication } from './application/AuthApplication';

// ============================================================================
// ADAPTER EXPORTS
// ============================================================================

/**
 * Hybrid authentication adapter
 * Bridge between mock and real authentication with fallback
 */
export { HybridAuthAdapter } from './adapters/HybridAuthAdapter';

/**
 * Real authentication adapter
 * Production Supabase authentication
 */
export { RealAuthAdapter } from './adapters/RealAuthAdapter';

/**
 * Mock authentication adapter
 * Simulated authentication for development and testing
 */
export { MockAuthAdapter } from './adapters/MockAuthAdapter';

// ============================================================================
// HOOKS EXPORTS
// ============================================================================

/**
 * Hybrid authentication hooks
 * Dual-mode authentication with seamless switching
 */
export { useHybridAuth, useHybridAuthForm } from './hooks/useHybridAuth';

// ============================================================================
// COMPONENT EXPORTS
// ============================================================================

/**
 * Hybrid login form component
 * Login form with mode switching and demo users
 */
export { HybridLoginForm } from './components';

/**
 * Hybrid authentication page component
 * Complete authentication system with login and registration
 */
export { HybridAuthPage } from './components';

// ============================================================================
// FEATURE METADATA
// ============================================================================

/**
 * Authentication feature metadata
 */
export const AUTH_FEATURE = {
  name: 'authentication',
  version: '3.0.0',
  description: 'Hybrid authentication system with mock and real mode support',
  adapters: {
    mock: 'MockAuthAdapter',
    real: 'RealAuthAdapter',
    hybrid: 'HybridAuthAdapter',
  },
  hooks: {
    hybrid: 'useHybridAuth',
    hybridForm: 'useHybridAuthForm',
    legacy: 'useAuth',
  },
  components: {
    loginForm: 'HybridLoginForm',
    authPage: 'HybridAuthPage',
  },
  capabilities: {
    dualMode: true,
    fallback: true,
    modeSwitching: true,
    healthMonitoring: true,
    demoUsers: true,
    realAuthentication: true,
  },
  status: 'complete',
  lastUpdated: '2024-01-20',
} as const;

// ============================================================================
// DEFAULT EXPORT
// ============================================================================

/**
 * Default export - Hybrid authentication page
 * @default
 * @example
 * ```typescript
 * import HybridAuthPage from '@/features/auth';
 *
 * <HybridAuthPage onSuccess={handleSuccess} />
 * ```
 */
import { HybridAuthPage } from './components';
export { HybridAuthPage as default };
