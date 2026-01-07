// src/app/providers.tsx
'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { AuthProvider } from '@/contexts/authContext';
import { UserProvider } from '@/contexts/userContext';
import { ProductProvider } from '@/contexts/productContext';
import { ErrorBoundary } from '@/components/errorBoundary';
import { EventLogsProvider } from '@/contexts/eventLogsContext';
import { SearchProvider } from '@/contexts/search-context';

function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  );
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <UserProvider>
            <ProductProvider>
              <EventLogsProvider>
                <SearchProvider>
                  <main className="container mx-auto px-4 py-8">
                    {children}
                  </main>
                </SearchProvider>
              </EventLogsProvider>
            </ProductProvider>
          </UserProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}