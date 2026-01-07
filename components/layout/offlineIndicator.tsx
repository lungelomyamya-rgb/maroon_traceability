// src/components/layout/OfflineIndicator.tsx
'use client';

import { useOfflineSync } from '@/hooks/useOfflineSync';
import { WifiOff, Wifi, CloudOff, CheckCircle, AlertCircle } from 'lucide-react';

export function OfflineIndicator() {
  const { syncStatus } = useOfflineSync();

  if (syncStatus.isOnline && syncStatus.queuedRequests === 0 && !syncStatus.isSyncing) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-slide-up">
      {!syncStatus.isOnline ? (
        <div className="bg-amber-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3">
          <WifiOff className="h-5 w-5" />
          <div>
            <p className="font-semibold text-sm">Offline Mode</p>
            <p className="text-xs">Data will sync when online</p>
          </div>
        </div>
      ) : syncStatus.isSyncing ? (
        <div className="bg-blue-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3">
          <CloudOff className="h-5 w-5 animate-pulse" />
          <div>
            <p className="font-semibold text-sm">Syncing...</p>
            <p className="text-xs">{syncStatus.queuedRequests} items pending</p>
          </div>
        </div>
      ) : syncStatus.queuedRequests > 0 ? (
        <div className="bg-orange-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3">
          <AlertCircle className="h-5 w-5" />
          <div>
            <p className="font-semibold text-sm">Pending Sync</p>
            <p className="text-xs">{syncStatus.queuedRequests} items to sync</p>
          </div>
        </div>
      ) : syncStatus.syncErrors.length > 0 ? (
        <div className="bg-red-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3">
          <AlertCircle className="h-5 w-5" />
          <div>
            <p className="font-semibold text-sm">Sync Errors</p>
            <p className="text-xs">{syncStatus.syncErrors.length} items failed</p>
          </div>
        </div>
      ) : (
        <div className="bg-green-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3">
          <CheckCircle className="h-5 w-5" />
          <div>
            <p className="font-semibold text-sm">Sync Complete</p>
            <p className="text-xs">All data synchronized</p>
          </div>
        </div>
      )}
    </div>
  );
}