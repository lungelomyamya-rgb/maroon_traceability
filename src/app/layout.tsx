// src/app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ServiceWorkerRegistration } from '@/components/service-worker-registration';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import ClientLayout from './clientLayout';

const inter = Inter({ subsets: ['latin'] });

// Use basePath from Next.js config for server-side rendering (only in production)
const basePath = process.env.NODE_ENV === 'development' ? '' : (process.env.NEXT_PUBLIC_BASE_PATH || '');

export const metadata: Metadata = {
  title: 'Maroon Traceability System',
  description: 'Blockchain-based product traceability system',
  manifest: `${basePath}/manifest.json?v=` + Date.now(),
  icons: {
    icon: `${basePath}/icon-192.svg`,
    apple: `${basePath}/icon-512.svg`,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ClientLayout>
          {children}
          <ThemeToggle />
        </ClientLayout>
        <ServiceWorkerRegistration />
      </body>
    </html>
  );
}
