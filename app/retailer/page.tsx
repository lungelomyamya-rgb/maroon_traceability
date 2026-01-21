// src/app/retailer/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/contexts/userContext';
import { DashboardLayout } from '@/components/dashboard/dashboardLayout';
import dynamic from 'next/dynamic';

// Prevent static generation
export const dynamicConfig = 'force-dynamic';
export const runtime = 'nodejs';

// Dynamically import the enhanced retailer dashboard
const EnhancedRetailerDashboard = dynamic(() => import('../../components/retailers/dashboard'), {
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
    // Redirect if not logged in or not a retailer (with a small delay to allow context to update)
    const timer = setTimeout(() => {
      if (!currentUser || currentUser.role !== 'retailer') {
        console.log('Retailer page - redirecting to unauthorized. Current user:', currentUser);
        router.push('/unauthorized');
        return;
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [currentUser, router]);

  // Show loading while checking auth
  if (!currentUser || currentUser.role !== 'retailer') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout
      description="Manage your products, orders, and analytics"
    >
      <EnhancedRetailerDashboard />
    </DashboardLayout>
  );
}