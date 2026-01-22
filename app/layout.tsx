// src/app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import ClientLayout from './clientLayout';
import { ServiceWorkerRegistration } from '@/components/service-worker-registration';
import { ClientOnly } from '@/components/clientOnly';

const inter = Inter({ subsets: ['latin'] });

// Dynamic base path for assets - only use prefix in production
const getBasePath = () => {
  return process.env.NODE_ENV === 'development' ? '' : '/maroon_traceability';
};

export const metadata: Metadata = {
  title: 'Maroon Traceability System',
  description: 'Blockchain-based product traceability system',
  manifest: `${getBasePath()}/manifest.json?v=` + Date.now(),
  icons: {
    icon: `${getBasePath()}/icon-192.svg`,
    apple: `${getBasePath()}/icon-512.svg`,
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