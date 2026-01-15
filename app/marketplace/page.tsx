// src/app/marketplace/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/contexts/userContext';
import dynamic from 'next/dynamic';

// Prevent static generation
export const dynamicConfig = 'force-dynamic';
export const runtime = 'nodejs';

// Dynamically import the enhanced marketplace
const Marketplace = dynamic(() => import('./marketplace'), {
  loading: () => (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
    </div>
  ),
  ssr: false
});

export default function PublicPage() {
  const { currentUser } = useUser();
  const router = useRouter();

  useEffect(() => {
    // Redirect if not logged in or not a public user
    if (!currentUser || currentUser.role !== 'public') {
      router.push('/intro');
      return;
    }
  }, [currentUser, router]);

  // Show loading while checking auth
  if (!currentUser || currentUser.role !== 'public') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return <Marketplace />;
}
