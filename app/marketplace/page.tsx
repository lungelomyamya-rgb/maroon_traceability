// src/app/marketplace/page.tsx
'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { useUser } from '@/contexts/userContext';
import { MarketplacePage } from '@/src/features/marketplace';
import ErrorBoundary from '@/src/features/shared/errorBoundary';

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
