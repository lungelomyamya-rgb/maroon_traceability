/**
 * Development logger utility
 * Provides conditional logging that only works in development environment
 */

type LogLevel = 'log' | 'info' | 'warn' | 'error' | 'debug';

const isDevelopment = process.env.NODE_ENV === 'development';

/**
 * Development-only logger that safely logs messages
 * @param level - Log level
 * @param args - Arguments to log
 */
export const devLog = (level: LogLevel, ...args: unknown[]) => {
  if (isDevelopment) {
    switch (level) {
    case 'log':
      console.log(...args);
      break;
    case 'info':
      console.info(...args);
      break;
    case 'warn':
      console.warn(...args);
      break;
    case 'error':
      console.error(...args);
      break;
    case 'debug':
      console.debug(...args);
      break;
    }
  }
};

/**
 * Convenience methods for different log levels
 */
export const logger = {
  log: (...args: unknown[]) => devLog('log', ...args),
  info: (...args: unknown[]) => devLog('info', ...args),
  warn: (...args: unknown[]) => devLog('warn', ...args),
  error: (...args: unknown[]) => devLog('error', ...args),
  debug: (...args: unknown[]) => devLog('debug', ...args),
};

export default logger;
