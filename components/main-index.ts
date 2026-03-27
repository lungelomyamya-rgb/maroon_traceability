// Main Components Index - Organized access to all components

// Shared/Reusable Components
export * from './shared';

// UI Components
export * from './ui';

// Feature Components (with existing index files)
export * from './auth';
export * from './marketplace';

// Large Components (need refactoring)
export { RoleSelector } from './roleSelector';
export { ProductForm } from './productForm';

// Utility Components
export { ErrorBoundary } from './errorBoundary';
export { ClientOnly } from './clientOnly';
