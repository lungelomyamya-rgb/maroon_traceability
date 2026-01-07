// public/sw.js - Network-only Service Worker for GitHub Pages
// No cache operations during install/activate to prevent addAll errors

// Base path for GitHub Pages
const BASE_PATH = '/maroon_traceability';

// Install event - do absolutely nothing
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  // Don't do anything during install - no cache operations
  self.skipWaiting();
});

// Activate event - do absolutely nothing  
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  // Don't do anything during activate - no cache operations
  self.clients.claim();
});

// Fetch event - simple network passthrough with minimal caching
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

  // Simple network-first strategy without complex cache operations
  event.respondWith(
    fetch(request)
      .then(response => {
        // Only try to cache if network succeeds and it's a static asset
        if (response.ok && isStaticAsset(request.url)) {
          // Use setTimeout to avoid blocking the response
          setTimeout(() => {
            caches.open('maroon-cache-v1').then(cache => {
              return cache.add(request).catch(err => {
                // Silently fail - don't throw errors
                console.debug('Cache add failed (non-critical):', err.message);
              });
            });
          }, 0);
        }
        return response;
      })
      .catch(() => {
        // Only try cache if network completely fails
        return caches.match(request).then(cached => {
          return cached || new Response('Offline', { 
            status: 503, 
            statusText: 'Service Unavailable' 
          });
        });
      })
  );
});

// Helper function to check if URL is a static asset
function isStaticAsset(url) {
  return url.includes('/_next/static/') ||
         url.includes('/images/') ||
         url.includes('.js') ||
         url.includes('.css') ||
         url.includes('.png') ||
         url.includes('.svg') ||
         url.includes('.jpg') ||
         url.includes('.jpeg') ||
         url.includes('.ico');
}

console.log('Service Worker loaded successfully');