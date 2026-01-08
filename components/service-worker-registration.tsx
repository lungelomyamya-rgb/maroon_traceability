// src/components/service-worker-registration.tsx
'use client';

import React, { useEffect } from 'react';

export function ServiceWorkerRegistration() {
  useEffect(() => {
    // Only register service worker in production
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      // Determine the correct service worker path based on environment
      const basePath = window.location.hostname.includes('github.io') 
        ? '/maroon_traceability' 
        : '';
      
      // Use versioned service worker file for GitHub Pages cache busting
      const swPath = `${basePath}/sw-v2.js`;
      
      // Unregister any existing service workers first
      navigator.serviceWorker.getRegistrations().then(registrations => {
        return Promise.all(registrations.map(registration => registration.unregister()));
      }).then(() => {
        // Register the versioned service worker
        return navigator.serviceWorker.register(swPath);
      }).then((registration) => {
        console.log('SW v2 registered: ', registration);
      }).catch((registrationError) => {
        console.log('SW v2 registration failed: ', registrationError);
      });
    }
  }, []);

  return null;
}
