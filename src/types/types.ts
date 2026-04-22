// src/types/types.ts
// Legacy compatibility file for test imports
// Re-exports all types from index.ts for backward compatibility

// Re-export everything from index.ts
export * from './index';

// Additional exports for specific test compatibility
export type { User, UniversalUser, BaseUser, CompleteUser, AuthUser } from './user';
export { toUniversalUser, toUIUser, isUniversalUser } from './user';
