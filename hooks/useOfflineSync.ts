// src/hooks/useOfflineSync.ts
// Hook for managing offline sync operations

import { useState, useEffect, useCallback } from 'react';
import { indexedDBService, PhotoRecord, SyncQueueItem } from '@/services/indexedDBService';

interface SyncStatus {
  isOnline: boolean;
  queuedRequests: number;
  lastSyncTime: number | null;
  isSyncing: boolean;
  syncErrors: string[];
}

export function useOfflineSync() {
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    isOnline: navigator.onLine,
    queuedRequests: 0,
    lastSyncTime: null,
    isSyncing: false,
    syncErrors: []
  });

  // Update online status
  useEffect(() => {
    const handleOnline = () => {
      setSyncStatus(prev => ({ ...prev, isOnline: true }));
      triggerSync();
    };

    const handleOffline = () => {
      setSyncStatus(prev => ({ ...prev, isOnline: false }));
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial sync queue count
    updateQueueCount();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const updateQueueCount = useCallback(async () => {
    try {
      const queue = await indexedDBService.getSyncQueue();
      setSyncStatus(prev => ({ ...prev, queuedRequests: queue.length }));
    } catch (error) {
      console.error('Failed to update queue count:', error);
    }
  }, []);

  const triggerSync = useCallback(async () => {
    if (!navigator.onLine || syncStatus.isSyncing) return;

    setSyncStatus(prev => ({ ...prev, isSyncing: true, syncErrors: [] }));

    try {
      const queue = await indexedDBService.getSyncQueue();
      
      for (const item of queue) {
        try {
          if (item.type === 'photo') {
            await syncPhoto(item.data);
          } else if (item.type === 'event') {
            await syncEvent(item.data);
          }
          
          // Remove from queue after successful sync
          await indexedDBService.removeFromSyncQueue(item.id);
        } catch (error) {
          console.error(`Failed to sync item ${item.id}:`, error);
          
          // Update retry count
          item.retryCount++;
          if (item.retryCount >= item.maxRetries) {
            setSyncStatus(prev => ({
              ...prev,
              syncErrors: [...prev.syncErrors, `Failed to sync ${item.type} after ${item.maxRetries} attempts`]
            }));
            await indexedDBService.removeFromSyncQueue(item.id);
          }
          // Could implement exponential backoff here
        }
      }

      setSyncStatus(prev => ({
        ...prev,
        lastSyncTime: Date.now(),
        queuedRequests: 0
      }));
      
      await updateQueueCount();
    } catch (error) {
      console.error('Sync failed:', error);
      setSyncStatus(prev => ({
        ...prev,
        syncErrors: [...prev.syncErrors, 'Sync operation failed']
      }));
    } finally {
      setSyncStatus(prev => ({ ...prev, isSyncing: false }));
    }
  }, [syncStatus.isSyncing, updateQueueCount]);

  const syncPhoto = async (photoData: PhotoRecord): Promise<void> => {
    // Mock API call - in real implementation, this would upload to server
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate 90% success rate
        if (Math.random() > 0.1) {
          indexedDBService.updatePhotoSyncStatus(photoData.id, 'synced');
          resolve();
        } else {
          indexedDBService.updatePhotoSyncStatus(photoData.id, 'failed', 'Upload failed');
          reject(new Error('Photo upload failed'));
        }
      }, 1000 + Math.random() * 2000); // 1-3 seconds
    });
  };

  const syncEvent = async (eventData: any): Promise<void> => {
    // Mock API call - in real implementation, this would send to server
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate 95% success rate
        if (Math.random() > 0.05) {
          resolve();
        } else {
          reject(new Error('Event sync failed'));
        }
      }, 500 + Math.random() * 1000); // 0.5-1.5 seconds
    });
  };

  const uploadPhoto = async (file: File, eventId: string, productId: string, metadata?: any): Promise<string> => {
    try {
      const photoId = await indexedDBService.savePhoto({
        eventId,
        productId,
        file,
        ...metadata
      });

      await updateQueueCount();
      
      // Trigger sync if online
      if (navigator.onLine) {
        triggerSync();
      }

      return photoId;
    } catch (error) {
      console.error('Failed to save photo:', error);
      throw error;
    }
  };

  const getPhotosByEvent = async (eventId: string): Promise<PhotoRecord[]> => {
    return indexedDBService.getPhotosByEvent(eventId);
  };

  const getPhotosByProduct = async (productId: string): Promise<PhotoRecord[]> => {
    return indexedDBService.getPhotosByProduct(productId);
  };

  const getStorageUsage = async () => {
    return indexedDBService.getStorageUsage();
  };

  return {
    syncStatus,
    triggerSync,
    uploadPhoto,
    getPhotosByEvent,
    getPhotosByProduct,
    getStorageUsage,
    updateQueueCount
  };
}
