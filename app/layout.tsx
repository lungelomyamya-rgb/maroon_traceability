// src/app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import ClientLayout from './clientLayout';
import { ServiceWorkerRegistration } from '@/components/service-worker-registration';
import { ClientOnly } from '@/components/ClientOnly';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Maroon Traceability System',
  description: 'Blockchain-based product traceability system',
  manifest: process.env.NODE_ENV === 'production' 
    ? '/maroon_traceability/manifest.json?v=' + Date.now()
    : '/manifest-dev.json?v=' + Date.now(),
  icons: {
    icon: process.env.NODE_ENV === 'production' 
      ? '/maroon_traceability/icon-192.svg'
      : '/icon-192.svg?v=' + Date.now(),
    apple: process.env.NODE_ENV === 'production' 
      ? '/maroon_traceability/icon-512.svg'
      : '/icon-512.svg?v=' + Date.now(),
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
        <ClientLayout>{children}</ClientLayout>
        <ServiceWorkerRegistration />
      </body>
    </html>
  );
}