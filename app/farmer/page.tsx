// src/app/farmer/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/contexts/userContext';
import type { UserRole } from '@/types/user';

export default function FarmerPage() {
  const router = useRouter();
  const { currentUser } = useUser();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      setIsChecking(false);
      
      // If user is logged in and is a farmer, redirect to dashboard
      if (currentUser?.role === 'farmer') {
        router.replace('/farmer/dashboard');
        return;
      }
      // If user is logged in but not a farmer, redirect to unauthorized
      if (currentUser?.role && !['farmer'].includes(currentUser.role)) {
        router.replace('/unauthorized');
        return;
      }
      // If user is not logged in, redirect to login
      if (!currentUser) {
        router.replace('/login?redirect=/farmer');
        return;
      }
    };

    // Add a small delay to prevent flickering
    const timeoutId = setTimeout(checkAuth, 100);

    return () => clearTimeout(timeoutId);
  }, [currentUser, router]);

  // Show loading while checking authentication
  if (isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // This should not be visible due to redirect, but as a fallback:
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-green-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecting...</p>
      </div>
    </div>
  );
}
