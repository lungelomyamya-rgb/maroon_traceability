// ============================================
// FILE: src/app/layout.tsx
// ============================================
'use client';
import { Suspense, useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import './globals.css';
import { ProductProvider } from '@/contexts/productContext';
import { UserProvider } from '@/contexts/userContext';
import { Navigation } from '@/components/layout/navigation';

// Inline metadata since we can't export it from a client component
const metadata = {
  title: 'Maroon Blockchain',
  description: 'Private Blockchain for Supply Chain Traceability',
};

function NavigationEvents() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Ensure we're using the correct base path
    const basePath = '/maroon_traceability';
    if (typeof window !== 'undefined' && !window.location.pathname.startsWith(basePath)) {
      window.location.href = `${basePath}${window.location.pathname}${window.location.search}`;
    }
  }, [pathname, searchParams]);

  return null;
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <head>
        <meta name="theme-color" content="#ffffff" />
        <meta name="title" content={metadata.title} />
        <meta name="description" content={metadata.description} />
        <base href="/maroon_traceability/" />
      </head>
      <body className="font-sans antialiased h-full bg-background">
        <UserProvider>
          <ProductProvider>
            <div className="min-h-screen flex flex-col">
              <Navigation />
              <main className="flex-1 w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 max-w-[1536px]">
                <div className="w-full h-full">
                  <Suspense fallback={null}>
                    <NavigationEvents />
                    {children}
                  </Suspense>
                </div>
              </main>
            </div>
          </ProductProvider>
        </UserProvider>
      </body>
    </html>
  );
}