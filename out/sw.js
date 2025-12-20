// public/sw.js
const CACHE_NAME = 'maroon-blockchain-v1';
const OFFLINE_QUEUE = 'offline-queue';

// Assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/certify',
  '/blockchain',
  '/manifest.json',
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate event - cleanup old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME && name !== OFFLINE_QUEUE)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // API requests - network first, queue if offline
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          return response;
        })
        .catch(() => {
          // Queue for later sync
          return queueOfflineRequest(request);
        })
    );
    return;
  }

  // Static assets - cache first, network fallback
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) {
        return cached;
      }

      return fetch(request).then((response) => {
        // Cache successful responses
        if (response.ok) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseClone);
          });
        }
        return response;
      });
    })
  );
});

// Queue offline requests
async function queueOfflineRequest(request) {
  const cache = await caches.open(OFFLINE_QUEUE);
  const requestData = {
    url: request.url,
    method: request.method,
    headers: Object.fromEntries(request.headers.entries()),
    body: await request.text(),
    timestamp: Date.now(),
  };
  
  await cache.put(
    new Request(`offline-${Date.now()}`),
    new Response(JSON.stringify(requestData))
  );

  return new Response(
    JSON.stringify({ 
      queued: true, 
      message: 'Request queued for sync when online' 
    }),
    { 
      status: 202,
      headers: { 'Content-Type': 'application/json' }
    }
  );
}

// Background sync - process queued requests
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-offline-queue') {
    event.waitUntil(processOfflineQueue());
  }
});

async function processOfflineQueue() {
  const cache = await caches.open(OFFLINE_QUEUE);
  const requests = await cache.keys();

  for (const request of requests) {
    try {
      const response = await cache.match(request);
      const data = await response.json();

      // Retry the original request
      await fetch(data.url, {
        method: data.method,
        headers: data.headers,
        body: data.body,
      });

      // Remove from queue on success
      await cache.delete(request);
    } catch (error) {
      console.error('Failed to sync request:', error);
      // Keep in queue for next sync
    }
  }
}

// Push notifications (for future use)
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {};
  
  const options = {
    body: data.body || 'New update available',
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    vibrate: [200, 100, 200],
    data: data,
  };

  event.waitUntil(
    self.registration.showNotification(data.title || 'Maroon Blockchain', options)
  );
});