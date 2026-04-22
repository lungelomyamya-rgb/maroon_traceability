/**
 * Environment-Aware Logger Utility
 *
 * Provides clean logging that automatically adjusts based on environment.
 * In production, only errors are logged to console.
 * In development, all logs are shown with proper formatting.
 */

export type LogLevel = 'log' | 'error' | 'warn' | 'info' | 'debug';

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  metadata?: Record<string, unknown>;
  source?: string;
}

/**
 * Logger configuration
 */
interface LoggerConfig {
  enableColors: boolean;
  enableTimestamps: boolean;
  enableSourceTracking: boolean;
  maxLogEntries: number;
  logLevels: LogLevel[];
}

class Logger {
  private config: LoggerConfig;
  private logHistory: LogEntry[] = [];

  constructor() {
    this.config = this.getDefaultConfig();
  }

  private getDefaultConfig(): LoggerConfig {
    const isDev = process.env.NODE_ENV === 'development';

    return {
      enableColors: isDev,
      enableTimestamps: isDev,
      enableSourceTracking: isDev,
      maxLogEntries: isDev ? 1000 : 100,
      logLevels: isDev ? ['log', 'error', 'warn', 'info', 'debug'] : ['error'],
    };
  }

  /**
   * Format log message with timestamp and colors
   */
  private formatMessage(entry: LogEntry): string[] {
    const parts: string[] = [];

    if (this.config.enableTimestamps) {
      const timestamp = new Date(entry.timestamp).toISOString();
      parts.push(`[${timestamp}]`);
    }

    if (this.config.enableSourceTracking && entry.source) {
      parts.push(`[${entry.source}]`);
    }

    parts.push(`[${entry.level.toUpperCase()}]`);
    parts.push(entry.message);

    return parts;
  }

  /**
   * Get caller information for source tracking
   */
  private getCallerInfo(): string {
    const stack = new Error().stack;
    if (!stack) {
return 'unknown';
}

    const lines = stack.split('\n');
    // Skip the current line and the log function call
    const callerLine = lines[3] || lines[2] || 'unknown';

    // Extract file name and line number
    const match = callerLine.match(/at\s+.*\((.*):(\d+):(\d+)\)/);
    if (match) {
      const [, filePath, line] = match;
      const fileName = filePath.split('/').pop() || filePath;
      return `${fileName}:${line}`;
    }

    return 'unknown';
  }

  /**
   * Add log entry to history
   */
  private addToHistory(entry: LogEntry): void {
    this.logHistory.push(entry);

    // Keep only the most recent entries
    if (this.logHistory.length > this.config.maxLogEntries) {
      this.logHistory = this.logHistory.slice(-this.config.maxLogEntries);
    }
  }

  /**
   * Core logging method
   */
  private writeLog(level: LogLevel, message: string, metadata?: Record<string, unknown>): void {
    // Check if this log level is enabled
    if (!this.config.logLevels.includes(level)) {
      return;
    }

    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      metadata,
      source: this.config.enableSourceTracking ? this.getCallerInfo() : undefined,
    };

    // Add to history
    this.addToHistory(entry);

    // Format and output to console
    const formattedMessage = this.formatMessage(entry);

    switch (level) {
      case 'log':
        console.log(...formattedMessage, metadata || '');
        break;
      case 'error':
        console.error(...formattedMessage, metadata || '');
        break;
      case 'warn':
        console.warn(...formattedMessage, metadata || '');
        break;
      case 'info':
        console.info(...formattedMessage, metadata || '');
        break;
      case 'debug':
        console.debug(...formattedMessage, metadata || '');
        break;
    }
  }

  /**
   * Public logging methods
   */
  log = (message: string, metadata?: Record<string, unknown>) => this.writeLog('log', message, metadata);
  error = (message: string, metadata?: Record<string, unknown>) => this.writeLog('error', message, metadata);
  warn = (message: string, metadata?: Record<string, unknown>) => this.writeLog('warn', message, metadata);
  info = (message: string, metadata?: Record<string, unknown>) => this.writeLog('info', message, metadata);
  debug = (message: string, metadata?: Record<string, unknown>) => this.writeLog('debug', message, metadata);

  /**
   * Performance logging
   */
  time = (label: string) => {
    if (this.config.logLevels.includes('log')) {
      console.time(label);
    }
  };

  timeEnd = (label: string) => {
    if (this.config.logLevels.includes('log')) {
      console.timeEnd(label);
    }
  };

  /**
   * Group logging
   */
  group = (label: string) => {
    if (this.config.logLevels.includes('log')) {
      console.group(label);
    }
  };

  groupEnd = () => {
    if (this.config.logLevels.includes('log')) {
      console.groupEnd();
    }
  };

  /**
   * Get log history
   */
  getHistory = (): LogEntry[] => [...this.logHistory];

  /**
   * Clear log history
   */
  clearHistory = (): void => {
    this.logHistory = [];
  };

  /**
   * Export logs for debugging
   */
  exportLogs = (): string => {
    return JSON.stringify(this.logHistory, null, 2);
  };

  /**
   * Update configuration
   */
  updateConfig = (newConfig: Partial<LoggerConfig>): void => {
    this.config = { ...this.config, ...newConfig };
  };

  /**
   * Get current configuration
   */
  getConfig = (): LoggerConfig => ({ ...this.config });
}

// Create singleton instance
const logger = new Logger();

// Export the singleton instance and class
export { logger };
export { Logger };

/**
 * Convenience exports for common usage
 */
export const log = (message: string, metadata?: Record<string, unknown>) => logger.log(message, metadata);
export const error = (message: string, metadata?: Record<string, unknown>) => logger.error(message, metadata);
export const warn = (message: string, metadata?: Record<string, unknown>) => logger.warn(message, metadata);
export const info = (message: string, metadata?: Record<string, unknown>) => logger.info(message, metadata);
export const debug = (message: string, metadata?: Record<string, unknown>) => logger.debug(message, metadata);

/**
 * Performance utilities
 */
export const time = (label: string) => logger.time(label);
export const timeEnd = (label: string) => logger.timeEnd(label);

/**
 * Group utilities
 */
export const group = (label: string) => logger.group(label);
export const groupEnd = () => logger.groupEnd();

/**
 * Advanced logging utilities
 */
export const logWithContext = (message: string, context: string, metadata?: Record<string, unknown>) => {
  logger.log(message, { ...metadata, context });
};

export const logError = (error: Error, context?: string) => {
  logger.error(error.message, {
    stack: error.stack,
    name: error.name,
    context,
  });
};

export const logPerformance = (operation: string, duration: number, metadata?: Record<string, unknown>) => {
  logger.log(`Performance: ${operation}`, {
    duration: `${duration}ms`,
    ...metadata,
  });
};

export const logUserAction = (action: string, userId?: string, metadata?: Record<string, unknown>) => {
  logger.info(`User Action: ${action}`, {
    userId,
    timestamp: new Date().toISOString(),
    ...metadata,
  });
};

export const logNetworkRequest = (url: string, method: string, status: number, duration?: number) => {
  logger.info(`Network: ${method} ${url}`, {
    status,
    duration: duration ? `${duration}ms` : undefined,
    success: status >= 200 && status < 300,
  });
};

/**
 * Development-only logging (will be removed in production)
 */
export const devLog = (message: string, metadata?: Record<string, unknown>) => {
  if (process.env.NODE_ENV === 'development') {
    logger.log(message, metadata);
  }
};

export const devError = (message: string, metadata?: Record<string, unknown>) => {
  if (process.env.NODE_ENV === 'development') {
    logger.error(message, metadata);
  }
};

/**
 * Production-safe logging (always works)
 */
export const prodLog = (message: string, metadata?: Record<string, unknown>) => {
  logger.log(message, metadata);
};

export const prodError = (message: string, metadata?: Record<string, unknown>) => {
  logger.error(message, metadata);
};

export default logger;
