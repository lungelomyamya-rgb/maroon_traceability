// public/sw.js - Ultra-minimal Service Worker for GitHub Pages
// This service worker only handles fetch events, no cache management during install/activate

// Base path for GitHub Pages
const BASE_PATH = '/maroon_traceability';

// Install event - do nothing
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  self.skipWaiting();
});

// Activate event - do nothing
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
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
          caches.open('maroon-cache').then((cache) => {
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