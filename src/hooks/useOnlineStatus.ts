// src/hooks/useOnlineStatus.ts
'use client';

import { useState, useEffect } from 'react';

interface ServiceWorkerRegistrationWithSync extends ServiceWorkerRegistration {
  sync?: {
    register: (tag: string) => Promise<void>;
  };
}

export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(true);
  const [queuedRequests, setQueuedRequests] = useState(0);

  useEffect(() => {
    // Initial status
    setIsOnline(navigator.onLine);

    // Listen for online/offline events
    const handleOnline = () => {
      setIsOnline(true);
      // Trigger sync
      navigator.serviceWorker.ready.then((registration) => {
        const reg = registration as ServiceWorkerRegistrationWithSync;
        if (reg.sync) {
          return reg.sync.register('sync-offline-queue');
        }
        return Promise.resolve();
      });
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check queued requests
    checkQueuedRequests();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const checkQueuedRequests = async () => {
    if ('caches' in window) {
      try {
        const cache = await caches.open('offline-queue');
        const requests = await cache.keys();
        setQueuedRequests(requests.length);
      } catch (error) {
        console.error('Error checking queue:', error);
      }
    }
  };

  return { isOnline, queuedRequests, checkQueuedRequests };
}