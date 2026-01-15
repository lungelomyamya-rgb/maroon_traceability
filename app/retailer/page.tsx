// src/app/retailer/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/contexts/userContext';
import dynamic from 'next/dynamic';

// Prevent static generation
export const dynamicConfig = 'force-dynamic';
export const runtime = 'nodejs';

// Dynamically import the enhanced retailer dashboard
const EnhancedRetailerDashboard = dynamic(() => import('./dashboard'), {
  loading: () => (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
    </div>
  ),
  ssr: false
});

export default function RetailerPage() {
  const { currentUser } = useUser();
  const router = useRouter();

  useEffect(() => {
    // Redirect if not logged in or not a retailer
    if (!currentUser || currentUser.role !== 'retailer') {
      router.push('/unauthorized');
      return;
    }
  }, [currentUser, router]);

  // Show loading while checking auth
  if (!currentUser || currentUser.role !== 'retailer') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
    </div>
    );
  }

  return <EnhancedRetailerDashboard />;
}