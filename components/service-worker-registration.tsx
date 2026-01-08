// src/components/service-worker-registration.tsx
'use client';

import React, { useEffect } from 'react';

export function ServiceWorkerRegistration() {
  useEffect(() => {
    // Service worker disabled for GitHub Pages due to caching issues
    // TODO: Re-enable with proper cache busting strategy
    console.log('Service Worker temporarily disabled for GitHub Pages');
  }, []);

  return null;
}
