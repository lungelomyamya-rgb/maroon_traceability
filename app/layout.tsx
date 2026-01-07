// src/app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import ClientLayout from './clientLayout';
import { ServiceWorkerRegistration } from '@/components/service-worker-registration';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Maroon Traceability System',
  description: 'Blockchain-based product traceability system',
  manifest: '/maroon_traceability/manifest.json?v=' + Date.now(),
  icons: {
    icon: '/maroon_traceability/icon-192.svg',
    apple: '/maroon_traceability/icon-512.svg',
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