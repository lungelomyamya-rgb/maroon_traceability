// src/infrastructure/adapters/MockAdapter.ts
// Mock adapter implementation for testing and development

import type {
  AdapterConfig,
  ValidationResult,
  AdapterCapabilities,
  ValidationError,
  ValidationWarning,
} from '../../core/interfaces';
import { BaseAdapter } from './BaseAdapter';

/**
 * Mock adapter implementation
 * Provides mock data transformation and validation for testing
 */
export class MockAdapter<TInput, TOutput> extends BaseAdapter<TInput, TOutput> {
  private mockData: Map<string, unknown> = new Map();
  private responseDelay: number;

  constructor(
    name: string,
    feature: string,
    priority: number = 1,
    responseDelay: number = 100,
  ) {
    super(name, 'mock', feature, priority);
    this.responseDelay = responseDelay;
  }

  /**
   * Initialize mock adapter
   */
  protected async initializeImpl(config: AdapterConfig): Promise<void> {
    // Load mock data from configuration if available
    if (config.featureConfig?.mockData) {
      Object.entries(config.featureConfig.mockData).forEach(([key, value]) => {
        this.mockData.set(key, value);
      });
    }

    this.logOperation('initialized', {
      mockDataSize: this.mockData.size,
      responseDelay: this.responseDelay,
    });
  }

  /**
   * Transform input data (mock implementation)
   */
  protected async transformImpl(input: TInput): Promise<TOutput> {
    await this.simulateDelay();

    this.logOperation('transform', { input });

    // Simple mock transformation - in real implementation this would be more sophisticated
    const transformed = this.performMockTransformation(input);

    return transformed as TOutput;
  }

  /**
   * Reverse transform output data (mock implementation)
   */
  protected async reverseTransformImpl(output: TOutput): Promise<TInput> {
    await this.simulateDelay();

    this.logOperation('reverseTransform', { output });

    // Simple mock reverse transformation
    const reversed = this.performMockReverseTransformation(output);

    return reversed as TInput;
  }

  /**
   * Validate input data (mock implementation)
   */
  protected async validateImpl(input: TInput): Promise<ValidationResult> {
    await this.simulateDelay();

    this.logOperation('validate', { input });

    // Basic mock validation
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    // Check if input is null or undefined
    if (input === null || input === undefined) {
      errors.push({
        field: 'input',
        message: 'Input cannot be null or undefined',
        code: 'NULL_INPUT',
        value: input,
      });
    }

    // Check if input is empty object
    if (typeof input === 'object' && input !== null && Object.keys(input).length === 0) {
      warnings.push({
        field: 'input',
        message: 'Input object is empty',
        code: 'EMPTY_INPUT',
        value: input,
      });
    }

    // Feature-specific validation can be added here
    const featureValidation = this.performFeatureValidation(input);
    errors.push(...featureValidation.errors);
    warnings.push(...featureValidation.warnings);

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Get adapter capabilities
   */
  protected getCapabilitiesImpl(): AdapterCapabilities {
    return {
      supportsCaching: true,
      supportsCompression: false,
      supportsStreaming: false,
      supportsBatching: true,
      supportsTransactions: false,
      supportsRealTime: false,
      maxConnections: 10,
      supportedOperations: ['transform', 'reverseTransform', 'validate'],
    };
  }

  /**
   * Cleanup adapter resources
   */
  protected async cleanupImpl(): Promise<void> {
    this.mockData.clear();
    this.logOperation('cleanup');
  }

  /**
   * Perform mock transformation
   */
  private performMockTransformation(input: TInput): unknown {
    // Default mock transformation - can be overridden in subclasses
    if (typeof input === 'object' && input !== null) {
      return {
        ...input,
        _mock: true,
        _transformedAt: new Date().toISOString(),
        _adapter: this.name,
      };
    }

    return input;
  }

  /**
   * Perform mock reverse transformation
   */
  private performMockReverseTransformation(output: TOutput): unknown {
    // Default mock reverse transformation
    if (typeof output === 'object' && output !== null) {
      const result = { ...output } as Record<string, unknown>;
      delete result._mock;
      delete result._transformedAt;
      delete result._adapter;
      return result;
    }

    return output;
  }

  /**
   * Perform feature-specific validation
   */
  private performFeatureValidation(input: TInput): {
    errors: ValidationError[];
    warnings: ValidationWarning[];
  } {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    // Feature-specific validation based on adapter feature
    switch (this.feature) {
    case 'authentication':
      errors.push(...this.validateAuthInput(input));
      break;
    case 'registration':
      errors.push(...this.validateRegistrationInput(input));
      break;
    case 'farmer':
    case 'inspector':
    case 'logistics':
    case 'packaging':
    case 'retailer':
      errors.push(...this.validateBusinessInput(input));
      break;
    default:
      // Generic validation
      break;
    }

    return { errors, warnings };
  }

  /**
   * Validate authentication input
   */
  private validateAuthInput(input: TInput): ValidationError[] {
    const errors: ValidationError[] = [];
    const authInput = input as Record<string, unknown>;

    if (!authInput.email || typeof authInput.email !== 'string') {
      errors.push({
        field: 'email',
        message: 'Valid email is required',
        code: 'INVALID_EMAIL',
        value: authInput.email,
      });
    }

    if (!authInput.password || typeof authInput.password !== 'string') {
      errors.push({
        field: 'password',
        message: 'Password is required',
        code: 'INVALID_PASSWORD',
        value: '[REDACTED]',
      });
    }

    return errors;
  }

  /**
   * Validate registration input
   */
  private validateRegistrationInput(input: TInput): ValidationError[] {
    const errors: ValidationError[] = [];
    const regInput = input as Record<string, unknown>;

    // Email validation
    if (!regInput.email || typeof regInput.email !== 'string') {
      errors.push({
        field: 'email',
        message: 'Valid email is required',
        code: 'INVALID_EMAIL',
        value: regInput.email,
      });
    }

    // Password validation
    if (!regInput.password || typeof regInput.password !== 'string') {
      errors.push({
        field: 'password',
        message: 'Password is required',
        code: 'INVALID_PASSWORD',
        value: '[REDACTED]',
      });
    } else if (regInput.password.length < 8) {
      errors.push({
        field: 'password',
        message: 'Password must be at least 8 characters',
        code: 'PASSWORD_TOO_SHORT',
        value: '[REDACTED]',
      });
    }

    // Name validation
    if (!regInput.name || typeof regInput.name !== 'string') {
      errors.push({
        field: 'name',
        message: 'Name is required',
        code: 'INVALID_NAME',
        value: regInput.name,
      });
    }

    return errors;
  }

  /**
   * Validate business input
   */
  private validateBusinessInput(input: TInput): ValidationError[] {
    const errors: ValidationError[] = [];
    const businessInput = input as Record<string, unknown>;

    // Check for required business fields
    if (!businessInput.id) {
      errors.push({
        field: 'id',
        message: 'ID is required',
        code: 'MISSING_ID',
        value: businessInput.id,
      });
    }

    return errors;
  }

  /**
   * Simulate network delay
   */
  private async simulateDelay(): Promise<void> {
    if (this.responseDelay > 0) {
      await new Promise(resolve => setTimeout(resolve, this.responseDelay));
    }
  }

  /**
   * Set mock data for testing
   */
  public setMockData(key: string, value: unknown): void {
    this.mockData.set(key, value);
  }

  /**
   * Get mock data for testing
   */
  public getMockData(key: string): unknown {
    return this.mockData.get(key);
  }

  /**
   * Clear all mock data
   */
  public clearMockData(): void {
    this.mockData.clear();
  }

  /**
   * Set response delay for testing
   */
  public setResponseDelay(delay: number): void {
    this.responseDelay = delay;
  }
}
