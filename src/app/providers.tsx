// In src/app/providers.tsx
'use client';
import { ReactNode, Suspense, useState, useEffect } from 'react';
import { SyncProvider } from '@/contexts/syncContext';
import { UserProvider } from '@/contexts/userContext';
import { ProductProvider } from '@/contexts/productContext';
import { initSync } from '@/lib/sync';
import { ErrorBoundary } from '@/components/errorBoundary';

function SyncInitializer({ children }: { children: ReactNode }) {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      initSync();
      setIsInitialized(true);
    }
  }, []);

  if (!isInitialized) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
}

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary fallback={<div>Something went wrong. Please refresh the page.</div>}>
      <UserProvider>
        <ProductProvider>
          <SyncProvider>
            <Suspense fallback={<div>Loading...</div>}>
              <SyncInitializer>
                {children}
              </SyncInitializer>
            </Suspense>
          </SyncProvider>
        </ProductProvider>
      </UserProvider>
    </ErrorBoundary>
  );
}