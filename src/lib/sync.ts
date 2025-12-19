// src/lib/sync.ts
import { mockDb } from './mockDb';
import { Product } from '@/types/database';
import { ProductEvent } from '@/types/database';

const SYNC_INTERVAL = 10000; // 10 seconds

// Add proper return type
export function initSync(): () => void {
  // Skip if not in browser
  if (typeof window === 'undefined') {
    return () => {};
  }

  const processQueue = async () => {
    if (!navigator.onLine) return;
    const queue = mockDb.getQueue();
    if (queue.length === 0) return;
    const queueItem = queue[0];
    if (!queueItem) return;
    try {
      if (queueItem.type === 'productCreate') {
        await mockDb.createProduct(queueItem.data as Omit<Product, 'id' | 'createdAt'>);
      } else if (queueItem.type === 'eventCreate') {
        await mockDb.createEvent(queueItem.data as Omit<ProductEvent, 'id' | 'timestamp'>);
      }
      
      // Remove from queue
      mockDb.shiftQueue();
      console.log('Queue processed successfully');
      
      // Notify UI
      window.dispatchEvent(new Event('syncUpdate'));
    } catch (error) {
      console.error('Failed to process queue item:', error);
    }
  };

  // Process queue when coming online
  window.addEventListener('online', processQueue);
  
  // Process queue periodically
  const interval = setInterval(processQueue, SYNC_INTERVAL);
  
  // Initial process
  processQueue();
  
  // Cleanup function
  return () => {
    window.removeEventListener('online', processQueue);
    clearInterval(interval);
  };
}