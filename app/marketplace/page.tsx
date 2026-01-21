// src/app/marketplace/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/contexts/userContext';
import ErrorBoundary from '@/components/errorBoundary';
import Marketplace from '../../components/marketplace/marketplace';

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
      <Marketplace />
    </ErrorBoundary>
  );
}
