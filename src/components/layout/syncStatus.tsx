// src/components/layout/SyncStatus.tsx
'use client';

import { useSync } from '@/contexts/syncContext';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { RefreshCw, CheckCircle, AlertCircle, Clock } from 'lucide-react';

export function SyncStatus() {
  const { pendingChanges: pendingCount, lastSync } = useSync();
  const isOnline = useOnlineStatus();

  if (!isOnline) {
    return (
      <div className="flex items-center text-yellow-600 text-sm">
        <AlertCircle className="h-4 w-4 mr-1" />
        <span>Offline</span>
      </div>
    );
  }

  if (pendingCount > 0) {
    return (
      <div className="flex items-center text-blue-600 text-sm">
        <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
        <span>Syncing {pendingCount} items...</span>
      </div>
    );
  }

  return (
    <div className="flex items-center text-green-600 text-sm">
      <CheckCircle className="h-4 w-4 mr-1" />
      <span>Synced {lastSync ? new Date(lastSync).toLocaleTimeString() : ''}</span>
    </div>
  );
}