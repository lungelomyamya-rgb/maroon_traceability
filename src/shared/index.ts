// src/shared/index.ts
// Shared utilities and components barrel export

// Components (will be added as we migrate)
// export { Button, Input, Card, Badge } from './components';

// Hooks (will be added as we migrate)
// export { useLocalStorage, useDebounce } from './hooks';

// Utils (will be added as we migrate)
// export { cn, formatDate, generateId } from './utils';

// Public API - clean interface for external consumers
export const sharedAPI = {
  // Button: Button, // Will be added
  // useLocalStorage: useLocalStorage, // Will be added
  // cn: cn, // Will be added
} as const;
