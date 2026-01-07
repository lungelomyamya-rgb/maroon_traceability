// src/lib/errorHandling.ts
import { ErrorInfo } from 'react';

export interface AppError {
  id: string;
  timestamp: string;
  message: string;
  stack?: string;
  componentStack?: string;
  context?: {
    url?: string;
    userAgent?: string;
    userId?: string;
    action?: string;
    field?: string;
    value?: string;
  };
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: 'user' | 'network' | 'validation' | 'system' | 'unknown';
}

export class AppErrorHandler {
  private static instance: AppErrorHandler;
  private errors: AppError[] = [];
  private maxErrors = 100;

  private constructor() {
    this.loadStoredErrors();
  }

  static getInstance(): AppErrorHandler {
    if (!AppErrorHandler.instance) {
      AppErrorHandler.instance = new AppErrorHandler();
    }
    return AppErrorHandler.instance;
  }

  private loadStoredErrors() {
    try {
      const stored = localStorage.getItem('appErrors');
      if (stored) {
        this.errors = JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Failed to load stored errors:', error);
    }
  }

  private storeErrors() {
    try {
      localStorage.setItem('appErrors', JSON.stringify(this.errors));
    } catch (error) {
      console.warn('Failed to store errors:', error);
    }
  }

  private generateErrorId(): string {
    return `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private categorizeError(error: Error): AppError['category'] {
    if (error.message.includes('Network') || error.message.includes('fetch')) {
      return 'network';
    }
    if (error.message.includes('validation') || error.message.includes('required')) {
      return 'validation';
    }
    if (error.message.includes('permission') || error.message.includes('unauthorized')) {
      return 'user';
    }
    return 'unknown';
  }

  private determineSeverity(error: Error): AppError['severity'] {
    if (error.name === 'TypeError' || error.message.includes('Cannot read')) {
      return 'critical';
    }
    if (error.name === 'ReferenceError') {
      return 'high';
    }
    if (error.message.includes('Network') || error.message.includes('fetch')) {
      return 'medium';
    }
    return 'low';
  }

  logError(error: Error, errorInfo?: ErrorInfo, context?: Partial<AppError['context']>) {
    const appError: AppError = {
      id: this.generateErrorId(),
      timestamp: new Date().toISOString(),
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo?.componentStack || undefined,
      context: {
        url: typeof window !== 'undefined' ? window.location.href : undefined,
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
        ...context
      },
      severity: this.determineSeverity(error),
      category: this.categorizeError(error)
    };

    this.addError(appError);
    return appError.id;
  }

  private addError(error: AppError) {
    this.errors.push(error);
    
    // Keep only the most recent errors
    if (this.errors.length > this.maxErrors) {
      this.errors = this.errors.slice(-this.maxErrors);
    }
    
    this.storeErrors();
    
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('App Error:', error);
    }
    
    // In production, send to error reporting service
    if (process.env.NODE_ENV === 'production' && error.severity === 'critical') {
      this.reportError(error);
    }
  }

  private async reportError(error: AppError) {
    try {
      // In production, send to your error reporting service
      // Example: await fetch('/api/errors', { method: 'POST', body: JSON.stringify(error) });
      console.log('Critical error reported:', error);
    } catch (reportingError) {
      console.error('Failed to report error:', reportingError);
    }
  }

  getErrors(): AppError[] {
    return [...this.errors];
  }

  getErrorsByCategory(category: AppError['category']): AppError[] {
    return this.errors.filter(error => error.category === category);
  }

  getErrorsBySeverity(severity: AppError['severity']): AppError[] {
    return this.errors.filter(error => error.severity === severity);
  }

  clearErrors() {
    this.errors = [];
    this.storeErrors();
  }

  clearOldErrors(olderThanHours: number = 24) {
    const cutoffTime = Date.now() - (olderThanHours * 60 * 60 * 1000);
    this.errors = this.errors.filter(error => 
      new Date(error.timestamp).getTime() > cutoffTime
    );
    this.storeErrors();
  }

  getErrorStats() {
    const stats = {
      total: this.errors.length,
      byCategory: {} as Record<AppError['category'], number>,
      bySeverity: {} as Record<AppError['severity'], number>,
      recent: this.errors.filter(error => 
        new Date(error.timestamp).getTime() > Date.now() - (60 * 60 * 1000) // Last hour
      ).length
    };

    this.errors.forEach(error => {
      stats.byCategory[error.category] = (stats.byCategory[error.category] || 0) + 1;
      stats.bySeverity[error.severity] = (stats.bySeverity[error.severity] || 0) + 1;
    });

    return stats;
  }
}

// Export singleton instance
export const errorHandler = AppErrorHandler.getInstance();

// Utility functions
export const logError = (error: Error, errorInfo?: ErrorInfo, context?: Partial<AppError['context']>) => {
  return errorHandler.logError(error, errorInfo, context);
};

export const logUserAction = (action: string, error?: Error) => {
  if (error) {
    return errorHandler.logError(error, undefined, { action });
  } else {
    // Log successful action if needed
    console.log('User action:', action);
    return undefined;
  }
};

export const logNetworkError = (url: string, error: Error) => {
  return errorHandler.logError(error, undefined, { action: `network_request_${url}` });
};

export const logValidationError = (field: string, value: any, error: Error) => {
  return errorHandler.logError(error, undefined, { 
    action: `validation_${field}`,
    field,
    value: String(value)
  });
};

// React Hook for error handling
export const useErrorHandler = () => {
  const handleError = (error: Error, context?: Partial<AppError['context']>) => {
    return errorHandler.logError(error, undefined, context);
  };

  const handleAsyncError = async (asyncFn: () => Promise<any>, context?: Partial<AppError['context']>) => {
    try {
      return await asyncFn();
    } catch (error) {
      handleError(error as Error, context);
      throw error;
    }
  };

  return {
    handleError,
    handleAsyncError,
    getErrors: errorHandler.getErrors.bind(errorHandler),
    getErrorStats: errorHandler.getErrorStats.bind(errorHandler),
    clearErrors: errorHandler.clearErrors.bind(errorHandler)
  };
};
