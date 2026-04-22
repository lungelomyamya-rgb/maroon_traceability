// src/core/errors/UserNormalizationError.ts
// Custom error for user data normalization failures

/**
 * Custom error for user normalization failures
 * Provides detailed context about what went wrong during user data transformation
 */
export class UserNormalizationError extends Error {
  public readonly source: string;
  public readonly reason: string;
  public readonly originalData: unknown;
  public readonly timestamp: string;

  constructor(source: string, reason: string, originalData?: unknown) {
    super(`Failed to normalize user from ${source}: ${reason}`);
    this.name = 'UserNormalizationError';
    this.source = source;
    this.reason = reason;
    this.originalData = originalData;
    this.timestamp = new Date().toISOString();

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, UserNormalizationError);
    }
  }

  /**
   * Get error details as a plain object for logging
   */
  toJSON(): Record<string, unknown> {
    return {
      name: this.name,
      message: this.message,
      source: this.source,
      reason: this.reason,
      timestamp: this.timestamp,
      stack: this.stack,
      // Only include original data if it's safe (no sensitive info)
      originalData: this.isSafeToLog(this.originalData) ? this.originalData : '[REDACTED - SENSITIVE DATA]',
    };
  }

  /**
   * Check if data is safe to log (no sensitive information)
   */
  private isSafeToLog(data: unknown): boolean {
    if (!data || typeof data !== 'object') {
      return true;
    }

    const sensitiveFields = ['password', 'token', 'secret', 'key', 'auth'];
    const dataStr = JSON.stringify(data).toLowerCase();

    return !sensitiveFields.some(field => dataStr.includes(field));
  }

  /**
   * Create error for missing required fields
   */
  static forMissingRequiredField(
    source: string,
    fieldName: string,
    originalData?: unknown,
  ): UserNormalizationError {
    return new UserNormalizationError(
      source,
      `Missing required field: ${fieldName}`,
      originalData,
    );
  }

  /**
   * Create error for invalid field type
   */
  static forInvalidFieldType(
    source: string,
    fieldName: string,
    expectedType: string,
    actualType: string,
    originalData?: unknown,
  ): UserNormalizationError {
    return new UserNormalizationError(
      source,
      `Invalid field type for ${fieldName}: expected ${expectedType}, got ${actualType}`,
      originalData,
    );
  }

  /**
   * Create error for invalid role
   */
  static forInvalidRole(
    source: string,
    role: string,
    validRoles: string[],
    originalData?: unknown,
  ): UserNormalizationError {
    return new UserNormalizationError(
      source,
      `Invalid role "${role}". Valid roles: ${validRoles.join(', ')}`,
      originalData,
    );
  }

  /**
   * Create error for transformation failure
   */
  static forTransformationFailure(
    source: string,
    transformation: string,
    originalError: Error | string,
    originalData?: unknown,
  ): UserNormalizationError {
    const reason = typeof originalError === 'string'
      ? originalError
      : originalError.message;

    return new UserNormalizationError(
      source,
      `Failed ${transformation}: ${reason}`,
      originalData,
    );
  }

  /**
   * Create error for validation failure
   */
  static forValidationFailure(
    source: string,
    validationRule: string,
    originalData?: unknown,
  ): UserNormalizationError {
    return new UserNormalizationError(
      source,
      `Validation failed: ${validationRule}`,
      originalData,
    );
  }
}

/**
 * Helper function to create user normalization errors with consistent format
 */
export function createUserNormalizationError(
  source: string,
  reason: string,
  originalData?: unknown,
): UserNormalizationError {
  return new UserNormalizationError(source, reason, originalData);
}

/**
 * Type guard to check if error is a UserNormalizationError
 */
export function isUserNormalizationError(error: unknown): error is UserNormalizationError {
  return error instanceof UserNormalizationError;
}
