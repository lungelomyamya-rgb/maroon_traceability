// Global declarations for browser APIs and Node.js environment

declare global {
  // Browser APIs
  declare const window: {
    alert: (message?: string) => void;
    confirm: (message?: string) => boolean;
    prompt: (message?: string, _default?: string) => string | null;
    location: Location;
    history: History;
    document: Document;
    navigator: Navigator;
    localStorage: Storage;
    sessionStorage: Storage;
  };

  declare const console: {
    log: (message?: unknown, ...optionalParams: unknown[]) => void;
    error: (message?: unknown, ...optionalParams: unknown[]) => void;
    warn: (message?: unknown, ...optionalParams: unknown[]) => void;
    info: (message?: unknown, ...optionalParams: unknown[]) => void;
    debug: (message?: unknown, ...optionalParams: unknown[]) => void;
  };

  declare const alert: (message?: string) => void;
  declare const setTimeout: (handler: TimerHandler, timeout?: number, ...args: unknown[]) => number;
  declare const clearTimeout: (id: number) => void;
  declare const setInterval: (handler: TimerHandler, timeout?: number, ...args: unknown[]) => number;
  declare const clearInterval: (id: number) => void;

  // Node.js APIs
  declare const process: {
    env: Record<string, string | undefined>;
    cwd: () => string;
  };

  // Error handling
  declare const error: Error;
}

export {};
