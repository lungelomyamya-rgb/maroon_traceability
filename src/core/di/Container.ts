// src/core/di/Container.ts
// Dependency Injection Container for service management

/**
 * Service registration interface
 */
export interface IServiceRegistration<T = unknown> {
  token: string;
  factory: () => T;
  singleton?: boolean;
}

/**
 * Dependency Injection Container
 */
export class DIContainer {
  private services = new Map<string, unknown>();
  private factories = new Map<string, () => unknown>();
  private singletons = new Map<string, unknown>();

  /**
   * Register a service factory
   */
  register<T>(token: string, factory: () => T, singleton = false): void {
    this.factories.set(token, factory);

    if (singleton) {
      this.singletons.set(token, null);
    }
  }

  /**
   * Resolve a service instance
   */
  resolve<T>(token: string): T {
    // Check if singleton and already created
    if (this.singletons.has(token)) {
      const instance = this.singletons.get(token);
      if (instance !== null) {
        return instance as T;
      }
    }

    // Check if service already exists
    if (this.services.has(token)) {
      return this.services.get(token) as T;
    }

    // Create new instance
    const factory = this.factories.get(token) as (() => T) | undefined;
    if (!factory) {
      throw new Error(`Service ${token} not registered`);
    }

    const instance = factory();

    // Store singleton if needed
    if (this.singletons.has(token)) {
      this.singletons.set(token, instance);
    }

    // Store service
    this.services.set(token, instance);
    return instance;
  }

  /**
   * Check if service is registered
   */
  isRegistered(token: string): boolean {
    return this.factories.has(token);
  }

  /**
   * Get all registered services
   */
  getRegisteredServices(): string[] {
    return Array.from(this.factories.keys());
  }

  /**
   * Clear all services (for testing)
   */
  clear(): void {
    this.services.clear();
    this.factories.clear();
    this.singletons.clear();
  }
}

// Global container instance
export const globalContainer = new DIContainer();
