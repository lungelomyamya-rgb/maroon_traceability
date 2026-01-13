'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/contexts/userContext';

export default function HomePage() {
  const router = useRouter();
  const { currentUser } = useUser();

  useEffect(() => {
    // If user is logged in and has a specific role, redirect to their dashboard
    if (currentUser?.role && currentUser.role !== 'viewer') {
      router.replace(`/${currentUser.role}`);
      return;
    }
    
    // For viewer role or no user, go to intro page first
    router.replace('/intro');
  }, [currentUser, router]);

  // Show loading while redirecting
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  );
}
