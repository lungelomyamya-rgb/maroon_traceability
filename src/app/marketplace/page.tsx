// src/app/marketplace/page.tsx
'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import ErrorBoundary from '@/components/errorBoundary';
import { useUser } from '@/contexts/userContext';
import { MarketplacePage } from '@/src/features/marketplace';


export default function PublicPage() {
  const router = useRouter();
  const { currentUser } = useUser();

  useEffect(() => {
    // Redirect non-public users to login
    if (currentUser && currentUser.role !== 'public') {
      router.push('/login?redirect=/marketplace');
      return;
    }
  }, [currentUser, router]);


  return (
    <ErrorBoundary>
      <MarketplacePage />
    </ErrorBoundary>
  );
}
