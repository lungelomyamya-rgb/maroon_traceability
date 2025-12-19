// src/components/layout/OfflineIndicator.tsx
'use client';

import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { WifiOff, Wifi, CloudOff } from 'lucide-react';

export function OfflineIndicator() {
  const { isOnline, queuedRequests } = useOnlineStatus();

  if (isOnline && queuedRequests === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-slide-up">
      {!isOnline ? (
        <div className="bg-amber-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3">
          <WifiOff className="h-5 w-5" />
          <div>
            <p className="font-semibold text-sm">Offline Mode</p>
            <p className="text-xs">Data will sync when online</p>
          </div>
        </div>
      ) : queuedRequests > 0 ? (
        <div className="bg-blue-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3">
          <CloudOff className="h-5 w-5 animate-pulse" />
          <div>
            <p className="font-semibold text-sm">Syncing...</p>
            <p className="text-xs">{queuedRequests} items pending</p>
          </div>
        </div>
      ) : null}
    </div>
  );
}