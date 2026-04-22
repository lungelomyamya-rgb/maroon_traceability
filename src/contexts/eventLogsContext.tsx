// src/contexts/eventLogsContext.tsx
'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface EventLog {
  id: string;
  timestamp: string;
  message: string;
  type: string;
}

interface EventLogsContextType {
  logs: EventLog[];
  addLog: (log: Omit<EventLog, 'id'>) => void;
  clearLogs: () => void;
}

const EventLogsContext = createContext<EventLogsContextType | undefined>(undefined);

export function EventLogsProvider({ children }: { children: ReactNode }) {
  const [logs, setLogs] = useState<EventLog[]>([]);

  const addLog = (log: Omit<EventLog, 'id'>) => {
    const newLog: EventLog = {
      ...log,
      id: `log_${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
    setLogs(prev => [...prev, newLog]);
  };

  const clearLogs = () => {
    setLogs([]);
  };

  const value = { logs, addLog, clearLogs };

  return (
    <EventLogsContext.Provider value={value}>
      {children}
    </EventLogsContext.Provider>
  );
}

export function useEventLogs() {
  const context = useContext(EventLogsContext);
  if (context === undefined) {
    throw new Error('useEventLogs must be used within an EventLogsProvider');
  }
  return context;
}
