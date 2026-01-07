// public/sw.js
const CACHE_NAME = 'maroon-blockchain-v1';
const OFFLINE_QUEUE = 'offline-queue';

// Base path for GitHub Pages
const BASE_PATH = '/maroon_traceability';

// Install event - minimal setup to avoid errors
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Service Worker installed');
      // Skip caching for now to avoid errors
      return Promise.resolve();
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

// Fetch event - basic network first strategy
self.addEventListener('fetch', (event) => {
  const { request } = event;
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Basic network first with optional caching
  event.respondWith(
    fetch(request).then((response) => {
      // Cache successful responses for static assets
      if (response.ok && request.url.includes(BASE_PATH)) {
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(request, responseClone);
        });
      }
      return response;
    }).catch(() => {
      // Try cache as fallback
      return caches.match(request).then((cached) => {
        if (cached) {
          return cached;
        }
        return new Response('Offline', { status: 503 });
      });
    })
  );
});

// Queue offline requests (simplified)
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