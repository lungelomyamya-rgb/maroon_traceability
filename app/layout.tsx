// src/app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import ClientLayout from './clientLayout';
import { ServiceWorkerRegistration } from '@/components/service-worker-registration';
import { ClientOnly } from '@/components/clientOnly';

const inter = Inter({ subsets: ['latin'] });

// Use basePath from Next.js config for server-side rendering
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

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
        <ClientLayout>{children}</ClientLayout>
        <ServiceWorkerRegistration />
      </body>
    </html>
  );
}