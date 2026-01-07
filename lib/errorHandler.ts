// src/lib/errorHandler.ts

export interface AppError {
  id: string;
  timestamp: string;
  type: 'network' | 'validation' | 'blockchain' | 'auth' | 'unknown';
  message: string;
  details?: any;
  stack?: string;
  recoverable: boolean;
}

export class ErrorHandler {
  private static errors: AppError[] = [];
  private static maxErrors = 100;

  static createError(
    type: AppError['type'],
    message: string,
    details?: any,
    recoverable: boolean = true
  ): AppError {
    const error: AppError = {
      id: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      type,
      message,
      details,
      stack: new Error().stack,
      recoverable,
    };

    this.logError(error);
    return error;
  }

  static handleAsyncError(
    error: unknown,
    type: AppError['type'] = 'unknown',
    context?: string
  ): AppError {
    const message = error instanceof Error ? error.message : 'Unknown error occurred';
    const details = {
      context,
      originalError: error instanceof Error ? {
        name: error.name,
        message: error.message,
        stack: error.stack,
      } : error,
    };

    return this.createError(type, message, details);
  }

  static handleValidationError(message: string, field?: string): AppError {
    return this.createError('validation', message, { field }, true);
  }

  static handleNetworkError(error: unknown, endpoint?: string): AppError {
    const message = error instanceof Error ? error.message : 'Network request failed';
    return this.createError('network', message, { endpoint }, true);
  }

  static handleBlockchainError(error: unknown, operation?: string): AppError {
    const message = error instanceof Error ? error.message : 'Blockchain operation failed';
    return this.createError('blockchain', message, { operation }, false);
  }

  static handleAuthError(error: unknown, operation?: string): AppError {
    const message = error instanceof Error ? error.message : 'Authentication failed';
    return this.createError('auth', message, { operation }, false);
  }

  private static logError(error: AppError): void {
    // Add to memory log
    this.errors.push(error);
    
    // Keep only the last maxErrors
    if (this.errors.length > this.maxErrors) {
      this.errors = this.errors.slice(-this.maxErrors);
    }

    // Console logging
    const logLevel = error.recoverable ? 'warn' : 'error';
    console[logLevel](`[${error.type.toUpperCase()}] ${error.message}`, error);

    // In production, send to error reporting service
    if (process.env.NODE_ENV === 'production') {
      this.sendToErrorService(error);
    }
  }

  private static sendToErrorService(error: AppError): void {
    // Placeholder for error reporting service integration
    // Example: Sentry.captureException(error);
    console.log('Error sent to reporting service:', error.id);
  }

  static getErrors(): AppError[] {
    return [...this.errors];
  }

  static clearErrors(): void {
    this.errors = [];
  }

  static getErrorById(id: string): AppError | undefined {
    return this.errors.find(error => error.id === id);
  }

  static isRecoverable(error: AppError): boolean {
    return error.recoverable;
  }

  static getUserMessage(error: AppError): string {
    switch (error.type) {
      case 'network':
        return 'Connection issue. Please check your internet connection and try again.';
      case 'validation':
        return 'Please check your input and try again.';
      case 'blockchain':
        return 'Blockchain operation failed. Please try again later.';
      case 'auth':
        return 'Authentication required. Please log in again.';
      default:
        return 'An unexpected error occurred. Please try again.';
    }
  }
}

// Utility function for wrapping async operations
export function withErrorHandling<T extends (...args: any[]) => Promise<any>>(
  operation: T,
  errorType: AppError['type'] = 'unknown',
  context?: string
): T {
  return (async (...args: Parameters<T>) => {
    try {
      return await operation(...args);
    } catch (error) {
      const appError = ErrorHandler.handleAsyncError(error, errorType, context);
      throw appError;
    }
  }) as T;
}

// React hook for error handling
export function useErrorHandler() {
  const handleError = (error: unknown, type?: AppError['type'], context?: string) => {
    const appError = ErrorHandler.handleAsyncError(error, type, context);
    
    // You could integrate with a toast notification system here
    console.error('Handled error:', appError);
    
    return appError;
  };

  const getUserMessage = (error: AppError) => {
    return ErrorHandler.getUserMessage(error);
  };

  return {
    handleError,
    getUserMessage,
    getErrors: ErrorHandler.getErrors,
    clearErrors: ErrorHandler.clearErrors,
  };
}
