// src/services/indexedDBService.ts
// Offline-first photo storage and sync service for Maroon Traceability

interface PhotoRecord {
  id: string;
  eventId: string;
  productId: string;
  file: File;
  timestamp: number;
  location?: string;
  notes?: string;
  syncStatus: 'pending' | 'syncing' | 'synced' | 'failed';
  uploadedAt?: number;
  errorMessage?: string;
}

interface SyncQueueItem {
  id: string;
  type: 'photo' | 'event';
  data: any;
  timestamp: number;
  retryCount: number;
  maxRetries: number;
}

class IndexedDBService {
  private dbName = 'MaroonTraceabilityDB';
  private version = 1;
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Photos store
        if (!db.objectStoreNames.contains('photos')) {
          const photoStore = db.createObjectStore('photos', { keyPath: 'id' });
          photoStore.createIndex('eventId', 'eventId', { unique: false });
          photoStore.createIndex('productId', 'productId', { unique: false });
          photoStore.createIndex('syncStatus', 'syncStatus', { unique: false });
          photoStore.createIndex('timestamp', 'timestamp', { unique: false });
        }

        // Sync queue store
        if (!db.objectStoreNames.contains('syncQueue')) {
          const syncStore = db.createObjectStore('syncQueue', { keyPath: 'id' });
          syncStore.createIndex('type', 'type', { unique: false });
          syncStore.createIndex('timestamp', 'timestamp', { unique: false });
        }

        // Events store (for offline event creation)
        if (!db.objectStoreNames.contains('events')) {
          const eventStore = db.createObjectStore('events', { keyPath: 'id' });
          eventStore.createIndex('productId', 'productId', { unique: false });
          eventStore.createIndex('type', 'type', { unique: false });
          eventStore.createIndex('syncStatus', 'syncStatus', { unique: false });
        }
      };
    });
  }

  // Photo Management
  async savePhoto(photo: Omit<PhotoRecord, 'id' | 'syncStatus'>): Promise<string> {
    if (!this.db) await this.init();
    
    const id = `photo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const photoRecord: PhotoRecord = {
      ...photo,
      id,
      syncStatus: 'pending',
      timestamp: Date.now()
    };

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['photos'], 'readwrite');
      const store = transaction.objectStore('photos');
      const request = store.add(photoRecord);

      request.onsuccess = () => {
        // Add to sync queue
        this.addToSyncQueue({
          id: `sync_${id}`,
          type: 'photo',
          data: photoRecord,
          timestamp: Date.now(),
          retryCount: 0,
          maxRetries: 3
        });
        resolve(id);
      };
      request.onerror = () => reject(request.error);
    });
  }

  async getPhotosByEvent(eventId: string): Promise<PhotoRecord[]> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['photos'], 'readonly');
      const store = transaction.objectStore('photos');
      const index = store.index('eventId');
      const request = index.getAll(eventId);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async getPhotosByProduct(productId: string): Promise<PhotoRecord[]> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['photos'], 'readonly');
      const store = transaction.objectStore('photos');
      const index = store.index('productId');
      const request = index.getAll(productId);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async getPendingPhotos(): Promise<PhotoRecord[]> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['photos'], 'readonly');
      const store = transaction.objectStore('photos');
      const index = store.index('syncStatus');
      const request = index.getAll('pending');

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async updatePhotoSyncStatus(photoId: string, status: PhotoRecord['syncStatus'], errorMessage?: string): Promise<void> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['photos'], 'readwrite');
      const store = transaction.objectStore('photos');
      const getRequest = store.get(photoId);

      getRequest.onsuccess = () => {
        const photo = getRequest.result;
        if (photo) {
          photo.syncStatus = status;
          if (status === 'synced') {
            photo.uploadedAt = Date.now();
          }
          if (errorMessage) {
            photo.errorMessage = errorMessage;
          }
          const updateRequest = store.put(photo);
          updateRequest.onsuccess = () => resolve();
          updateRequest.onerror = () => reject(updateRequest.error);
        } else {
          reject(new Error('Photo not found'));
        }
      };
      getRequest.onerror = () => reject(getRequest.error);
    });
  }

  // Sync Queue Management
  private async addToSyncQueue(item: SyncQueueItem): Promise<void> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['syncQueue'], 'readwrite');
      const store = transaction.objectStore('syncQueue');
      const request = store.add(item);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getSyncQueue(): Promise<SyncQueueItem[]> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['syncQueue'], 'readonly');
      const store = transaction.objectStore('syncQueue');
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result.sort((a, b) => a.timestamp - b.timestamp));
      request.onerror = () => reject(request.error);
    });
  }

  async removeFromSyncQueue(itemId: string): Promise<void> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['syncQueue'], 'readwrite');
      const store = transaction.objectStore('syncQueue');
      const request = store.delete(itemId);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // Event Management (for offline event creation)
  async saveEvent(event: any): Promise<string> {
    if (!this.db) await this.init();
    
    const eventWithSync = {
      ...event,
      id: event.id || `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      syncStatus: 'pending' as const,
      timestamp: Date.now()
    };

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['events'], 'readwrite');
      const store = transaction.objectStore('events');
      const request = store.add(eventWithSync);

      request.onsuccess = () => {
        // Add to sync queue
        this.addToSyncQueue({
          id: `sync_${eventWithSync.id}`,
          type: 'event',
          data: eventWithSync,
          timestamp: Date.now(),
          retryCount: 0,
          maxRetries: 3
        });
        resolve(eventWithSync.id);
      };
      request.onerror = () => reject(request.error);
    });
  }

  // Storage Management
  async getStorageUsage(): Promise<{ used: number; available: number; photos: number }> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['photos'], 'readonly');
      const store = transaction.objectStore('photos');
      const request = store.getAll();

      request.onsuccess = () => {
        const photos = request.result;
        let totalSize = 0;
        photos.forEach((photo: PhotoRecord) => {
          if (photo.file && photo.file.size) {
            totalSize += photo.file.size;
          }
        });

        // Estimate available storage (navigator.storage is not widely supported)
        const estimated = {
          used: totalSize,
          available: 50 * 1024 * 1024, // 50MB estimated
          photos: photos.length
        };
        resolve(estimated);
      };
      request.onerror = () => reject(request.error);
    });
  }

  // Cleanup
  async cleanupOldPhotos(daysOld: number = 30): Promise<number> {
    if (!this.db) await this.init();
    
    const cutoffTime = Date.now() - (daysOld * 24 * 60 * 60 * 1000);
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['photos'], 'readwrite');
      const store = transaction.objectStore('photos');
      const index = store.index('timestamp');
      const request = index.openCursor(IDBKeyRange.upperBound(cutoffTime));
      
      let deletedCount = 0;

      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest).result;
        if (cursor) {
          cursor.delete();
          deletedCount++;
          cursor.continue();
        } else {
          resolve(deletedCount);
        }
      };
      request.onerror = () => reject(request.error);
    });
  }
}

export const indexedDBService = new IndexedDBService();
export type { PhotoRecord, SyncQueueItem };
