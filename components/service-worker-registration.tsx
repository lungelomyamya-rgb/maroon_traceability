// src/components/service-worker-registration.tsx
'use client';

import React, { useEffect } from 'react';

export function ServiceWorkerRegistration() {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      // Determine the correct service worker path based on environment
      const swPath = window.location.hostname.includes('github.io') 
        ? '/maroon_traceability/sw.js' 
        : '/sw.js';
      
      navigator.serviceWorker.register(swPath)
        .then((registration) => {
          console.log('SW registered: ', registration);
        })
        .catch((registrationError) => {
          console.log('SW registration failed: ', registrationError);
        });
    }
  }, []);

  return null;
}
