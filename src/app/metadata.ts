import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Maroon Blockchain',
  description: 'Private Blockchain for Supply Chain Traceability',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};
