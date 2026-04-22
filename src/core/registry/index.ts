// src/core/registry/index.ts
// Barrel export for registry system

export {
  AdapterRegistry,
  adapterRegistry,
  AdapterRegistrationError,
  AdapterNotFoundError,
  AdapterModeSwitchError,
} from './AdapterRegistry';

export type { RegistryStats } from './AdapterRegistry';

export {
  ServiceRegistry,
  serviceRegistry,
  ServiceRegistrationError,
  ServiceNotFoundError,
  ServiceModeSwitchError,
} from './ServiceRegistry';

export type { ServiceRegistryStats } from './ServiceRegistry';
