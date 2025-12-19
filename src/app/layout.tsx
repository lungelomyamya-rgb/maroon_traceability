// src/app/layout.tsx
import { Inter } from 'next/font/google';
import './globals.css';
import { ErrorBoundary } from '@/components/errorBoundary';
import { Navigation } from '@/components/layout/navigation';
import { Toaster } from '@/components/ui/toaster';
import { Suspense } from 'react';
import { ProductProvider } from '@/contexts/productContext';
import { UserProvider } from '@/contexts/userContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Maroon Traceability',
  description: 'Blockchain-based supply chain traceability',
};

// Create a client component wrapper
function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ErrorBoundary>
          <UserProvider>
            <ProductProvider>
              <div className="min-h-screen flex flex-col">
                <Suspense fallback={<div>Loading navigation...</div>}>
                  <Navigation />
                </Suspense>
                <main className="flex-1">
                  {children}
                </main>
              </div>
              <Toaster />
            </ProductProvider>
          </UserProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}

// Export the client component as default
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <ClientLayout>{children}</ClientLayout>;
}