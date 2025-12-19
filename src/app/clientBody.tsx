'use client';

import { useEffect } from 'react';
import { ProductProvider } from '@/contexts/productContext';
import { UserProvider } from '@/contexts/userContext';
import { Navigation } from '@/components/layout/navigation';
import { OfflineIndicator } from '@/components/layout/offlineIndicator';
import { registerServiceWorker } from '@/lib/pwa';

interface ClientBodyProps {
  children: React.ReactNode;
}

export function ClientBody({ children }: ClientBodyProps) {
  return (
    <UserProvider>
      <ProductProvider>
        <PWARegister />
        <div className="min-h-screen bg-gray-100">
          <Navigation />
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </main>
        </div>
        <OfflineIndicator />
      </ProductProvider>
    </UserProvider>
  );
}

// PWA Registration Component
function PWARegister() {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((registration) => {
            console.log('✅ Service Worker registered');
            })
          .catch((error) => {
            console.error('❌ Service Worker registration failed:', error);
          });
      });
    }
    registerServiceWorker();
  }, []);

  return null;
}