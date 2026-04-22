// src/features/registration/index.ts
// Barrel export for registration feature - Golden Template

// Services (Golden Template)
export { RealRegistrationAdapter } from './adapters/RealRegistrationAdapter';
export { registrationApplication, RegistrationApplication } from './application/RegistrationApplication';

// Legacy Services (for backward compatibility)
export { RegistrationRepository, registrationRepository } from './services/RegistrationRepository';
export { SupabaseRegistrationAdapter } from './adapters/SupabaseRegistrationAdapter';
export { MockRegistrationAdapter } from './adapters/MockRegistrationAdapter';

// Domain
export { UserRegistrationService } from './domain/services/UserRegistrationService';

// Application
// Note: Only egistrationApplication exists in the application file

// Presentation
export { RegistrationForm } from './components/RegistrationForm';

// Types
export type { RegistrationData } from './types/RegistrationData';
