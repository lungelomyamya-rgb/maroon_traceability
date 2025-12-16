// ============================================
// FILE: src/app/layout.tsx
// ============================================
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ProductProvider } from '@/contexts/productContext';
import { UserProvider } from '@/contexts/userContext';
import { Navigation } from '@/components/layout/navigation';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'Maroon Blockchain',
  description: 'Private Blockchain for Supply Chain Traceability',  
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <head>
        <meta name="theme-color" content="#ffffff" />
      </head>
      <body className={`${inter.variable} font-sans antialiased h-full bg-background`}>
        <UserProvider>
          <ProductProvider>
            <div className="min-h-screen flex flex-col">
              <Navigation />
              <main className="flex-1 w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 max-w-[1536px]">
                <div className="w-full h-full">
                  {children}
                </div>
              </main>
            </div>
          </ProductProvider>
        </UserProvider>
      </body>
    </html>
  );
}