// src/features/shared/services/index.ts
// Barrel export for shared services

export { indexedDBService } from './indexedDBService';
export { CacheService } from './cacheService';
export { eventLogger } from './eventLogger';
export { PerformanceService } from './performanceService';
export { analytics } from './analytics';
export { BaseHttpClient } from './baseClient';
export { AuthService } from './auth/auth';
export { RolePermissionsService } from './rolePermissionsService';
export type { PhotoRecord } from './indexedDBService';
