// src/app/retailer/orders/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/contexts/userContext';
import { DashboardLayout } from '@/components/dashboard/dashboardLayout';
import OrdersComponent from '../../../components/retailers/ordersComponent';

export default function Orders() {
  const { currentUser } = useUser();
  const router = useRouter();

  useEffect(() => {
    // Redirect if not logged in or not a retailer (with a small delay to allow context to update)
    const timer = setTimeout(() => {
      if (!currentUser || currentUser.role !== 'retailer') {
        console.log('Orders page - redirecting to unauthorized. Current user:', currentUser);
        router.push('/unauthorized');
        return;
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [currentUser, router]);

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
    <>
      {/* Back Button Above DashboardLayout */}
      <div className="px-4 sm:px-6 lg:px-8 pt-4">
        <button
          onClick={() => router.push('/retailer')}
          className="inline-flex items-center gap-2 text-sm"
        >
          Back
        </button>
      </div>
      
      <DashboardLayout
        title="Order Management"
        description="Process and track customer orders"
      >
        <OrdersComponent />
      </DashboardLayout>
    </>
  );
}
