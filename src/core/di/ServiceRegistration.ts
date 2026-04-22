// src/core/di/ServiceRegistration.ts
// Service registration for dependency injection

import { MockUserRepository } from '../../features/auth/repositories/MockUserRepository';
import { EncryptionEngine } from '../../features/auth/services/EncryptionEngine';
import { IdentityService } from '../../features/auth/services/IdentityService';
import { StorageService } from '../../features/auth/services/StorageService';
import { TokenProvider } from '../../features/auth/services/TokenProvider';
import { SERVICE_TOKENS } from '../constants/serviceTokens';
import { globalContainer } from './Container';

/**
 * Register all services with the DI container
 */
export function registerServices(): void {
  // Register repositories
  globalContainer.register(SERVICE_TOKENS.USER_REPOSITORY, () => new MockUserRepository());

  // Register identity services
  globalContainer.register(SERVICE_TOKENS.IDENTITY_SERVICE, () => new IdentityService(
    globalContainer.resolve(SERVICE_TOKENS.USER_REPOSITORY),
  ));

  // Register token providers
  globalContainer.register(SERVICE_TOKENS.TOKEN_PROVIDER, () => new TokenProvider(
    globalContainer.resolve(SERVICE_TOKENS.STORAGE_SERVICE),
  ));

  // Register encryption engines
  globalContainer.register(SERVICE_TOKENS.ENCRYPTION_ENGINE, () => new EncryptionEngine());

  // Register storage services
  globalContainer.register(SERVICE_TOKENS.STORAGE_SERVICE, () => new StorageService());
}

/**
 * Get the global container
 */
export function getContainer() {
  return globalContainer;
}
