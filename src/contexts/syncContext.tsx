// src/contexts/syncContext.tsx
'use client';

import { createContext, useContext, useEffect, useState } from 'react';

interface SyncContextType {
  isSyncing: boolean;
  lastSync: Date | null;
  pendingChanges: number;
}

const SyncContext = createContext<SyncContextType>({
  isSyncing: false,
  lastSync: null,
  pendingChanges: 0,
});

export function SyncProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<Omit<SyncContextType, 'setIsSyncing'>>({
    isSyncing: false,
    lastSync: null,
    pendingChanges: 0,
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const updateSyncStatus = () => {
      setState(prev => ({
        ...prev,
        isSyncing: true,
      }));
    };

    const handleSyncComplete = () => {
      setState(prev => ({
        isSyncing: false,
        lastSync: new Date(),
        pendingChanges: 0, // This should be updated based on your actual queue
      }));
    };

    window.addEventListener('syncStart', updateSyncStatus);
    window.addEventListener('syncComplete', handleSyncComplete);

    return () => {
      window.removeEventListener('syncStart', updateSyncStatus);
      window.removeEventListener('syncComplete', handleSyncComplete);
    };
  }, []);

  return (
    <SyncContext.Provider value={state}>
      {children}
    </SyncContext.Provider>
  );
}

export const useSync = () => useContext(SyncContext);