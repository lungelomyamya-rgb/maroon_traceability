// src/lib/pwa.ts
interface ServiceWorkerRegistrationWithSync extends ServiceWorkerRegistration {
  sync?: {
    register: (tag: string) => Promise<void>;
  };
}
export async function registerServiceWorker() {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    try {
      const registration = (await navigator.serviceWorker.register(
        '/sw.js'
      )) as ServiceWorkerRegistrationWithSync;
      
      console.log('✅ Service Worker registered');
      
      // Check for updates periodically
      setInterval(() => {
        registration.update();
      }, 60000); // Check every minute
      
      // Listen for sync events
      if (registration.sync) {
        window.addEventListener('online', () => {
          registration.sync?.register('sync-offline-queue');
        });
      }
      
      return registration;
    } catch (error) {
      console.error('❌ Service Worker registration failed:', error);
      throw error;
    }
  }
  return null;
}

export function unregisterServiceWorker() {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then((registration) => {
      registration.unregister();
    });
  }
}