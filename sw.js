// public/sw.js - Minimal Service Worker for GitHub Pages
const CACHE_NAME = 'maroon-blockchain-v5';
const OFFLINE_QUEUE = 'offline-queue';

// Base path for GitHub Pages
const BASE_PATH = '/maroon_traceability';

// Cache busting version - force update on every change
const CACHE_VERSION = Date.now().toString();

// Install event - minimal setup
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  
  // Skip waiting to ensure immediate activation
  self.skipWaiting();
});

// Activate event - cleanup old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => {
            console.log('Deleting old cache:', name);
            return caches.delete(name);
          })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - network first with optional caching
self.addEventListener('fetch', (event) => {
  const { request } = event;
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // For API routes, let them fail through
  if (request.url.includes('/api/')) {
    return;
  }

  // For static assets, try network first, then cache
  event.respondWith(
    fetch(request).then((response) => {
      // Only cache successful responses
      if (response.ok) {
        // Cache successful responses for static assets only
        if (request.url.includes(BASE_PATH) || 
           request.url.includes('/_next/static/') ||
           request.url.includes('/images/') ||
           request.url.includes('.js') ||
           request.url.includes('.css') ||
           request.url.includes('.png') ||
           request.url.includes('.svg') ||
           request.url.includes('.jpg') ||
           request.url.includes('.jpeg')) {
          
          // Open cache and store response clone
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, response.clone()).catch((error) => {
              console.warn('Cache put failed:', error, 'URL:', request.url);
            });
          });
        }
      }
      
      return response;
    }).catch((error) => {
      console.log('Network request failed:', error, 'URL:', request.url);
      
      // If network fails, try cache as fallback
      return caches.match(request).then((cached) => {
        if (cached) {
          console.log('Serving from cache:', request.url);
          return cached;
        }
        
        // Return appropriate offline response
        if (request.url.includes(BASE_PATH) && (request.url.endsWith('/') || request.url.includes('.html'))) {
          return new Response('Offline - Please check your connection', {
            status: 503,
            statusText: 'Service Unavailable'
          });
        }
        
        // For failed asset requests, return network error
        return new Response('Network error', {
          status: 503,
          statusText: 'Service Unavailable'
        });
      });
    })
  );
});

console.log('Service Worker loaded successfully');