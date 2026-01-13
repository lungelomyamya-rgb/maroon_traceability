// public/sw-v2.js - Cache-free Service Worker for GitHub Pages
// Version 2 - completely avoids Cache API during installation

// Base path for GitHub Pages
const BASE_PATH = '/maroon_traceability';

// Simple in-memory cache for runtime use only
const memoryCache = new Map();

// Install event - absolutely no cache operations
self.addEventListener('install', (event) => {
  console.log('Service Worker v2 installing...');
  // Do nothing - no Cache API usage at all
  self.skipWaiting();
});

// Activate event - absolutely no cache operations
self.addEventListener('activate', (event) => {
  console.log('Service Worker v2 activating...');
  // Do nothing - no Cache API usage at all
  self.clients.claim();
});

// Fetch event - network-only with optional memory cache
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

  // Network-first strategy with optional memory cache
  event.respondWith(
    fetch(request)
      .then(response => {
        // Store in memory cache for static assets only (no Cache API)
        if (response.ok && isStaticAsset(request.url)) {
          const responseClone = response.clone();
          responseClone.arrayBuffer().then(buffer => {
            memoryCache.set(request.url, {
              buffer: buffer,
              headers: Object.fromEntries(responseClone.headers.entries()),
              status: responseClone.status,
              statusText: responseClone.statusText
            });
          }).catch(() => {
            // Silently ignore memory cache failures
          });
        }
        return response;
      })
      .catch(() => {
        // Try memory cache if network fails
        const cached = memoryCache.get(request.url);
        if (cached) {
          return new Response(cached.buffer, {
            status: cached.status,
            statusText: cached.statusText,
            headers: cached.headers
          });
        }
        
        // Return offline response
        return new Response('Offline', { 
          status: 503, 
          statusText: 'Service Unavailable' 
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

console.log('Service Worker v2 loaded successfully');
