// src/services/eventLogger.ts

export type EventType = 'user_action' | 'system_event' | 'error' | 'warning' | 'info';

export interface EventLog {
  id: string;
  type: EventType;
  message: string;
  timestamp: number;
  metadata?: Record<string, unknown>;
}

export class EventLogger {
  private static instance: EventLogger;
  private logs: EventLog[] = [];

  static getInstance(): EventLogger {
    if (!EventLogger.instance) {
      EventLogger.instance = new EventLogger();
    }
    return EventLogger.instance;
  }

  log(type: EventType, message: string, metadata?: Record<string, unknown>): void {
    const log: EventLog = {
      id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      message,
      timestamp: Date.now(),
      metadata
    };
    
    this.logs.push(log);
    console.log(`[${type.toUpperCase()}] ${message}`, metadata);
  }

  getLogs(): EventLog[] {
    return [...this.logs];
  }

  clearLogs(): void {
    this.logs = [];
  }
}

export const eventLogger = EventLogger.getInstance();
