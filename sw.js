// public/sw.js - Minimal Service Worker for GitHub Pages
const CACHE_NAME = 'maroon-blockchain-v4';
const OFFLINE_QUEUE = 'offline-queue';

// Base path for GitHub Pages
const BASE_PATH = '/maroon_traceability';

// Cache busting version - force update on every change
const CACHE_VERSION = Date.now().toString();

// Install event - minimal setup with aggressive cache busting
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  
  // Force delete all caches to ensure fresh start
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((name) => {
          console.log('Deleting old cache:', name);
          return caches.delete(name);
        })
      );
    })
  );
  
  self.skipWaiting();
});

// Activate event - cleanup old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME && name !== OFFLINE_QUEUE)
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
      // Cache successful responses for static assets only
      if (response.ok && 
          (request.url.includes(BASE_PATH) || 
           request.url.includes('/_next/static/') ||
           request.url.includes('/images/') ||
           request.url.includes('.js') ||
           request.url.includes('.css'))) {
        
        // Open cache and store response
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(request, response.clone()).catch((error) => {
            console.warn('Cache put failed:', error);
          });
        });
      }
      
      return response;
    }).catch((error) => {
      // If network fails, try cache as fallback
      return caches.match(request).then((cached) => {
        if (cached) {
          console.log('Serving from cache:', request.url);
          return cached;
        }
        
        // Return offline response for HTML pages
        if (request.url.includes(BASE_PATH) && request.url.endsWith('/') || request.url.includes('.html')) {
          return new Response('Offline - Please check your connection', {
            status: 503,
            statusText: 'Service Unavailable'
          });
        }
        
        return new Response('Network error', {
          status: 503,
          statusText: 'Service Unavailable'
        });
      });
    })
  );
});

console.log('Service Worker loaded successfully');