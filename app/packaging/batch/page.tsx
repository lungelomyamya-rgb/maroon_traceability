// src/app/packaging/batch/page.tsx
'use client';

import dynamic from 'next/dynamic';
import { ClientOnly } from '@/components/clientOnly';

// Dynamically import the BatchProcessing component with SSR disabled
const BatchProcessing = dynamic(
  () => import('@/components/packaging/batchProcessing').then(mod => mod.BatchProcessing),
  { ssr: false, loading: () => (
    <div className="flex items-center justify-center min-h-[300px]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  )}
);

export default function BatchProcessingPage() {
  return (
    <ClientOnly>
      <BatchProcessing />
    </ClientOnly>
  );
}
 