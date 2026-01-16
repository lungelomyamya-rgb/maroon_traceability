// src/app/retailer/product-management/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/contexts/userContext';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import ProductManagementComponent from './productManagementComponent';

export default function ProductManagement() {
  const { currentUser } = useUser();
  const router = useRouter();

  useEffect(() => {
    // Redirect if not logged in or not a retailer (with a small delay to allow context to update)
    const timer = setTimeout(() => {
      if (!currentUser || currentUser.role !== 'retailer') {
        console.log('Product Management page - redirecting to unauthorized. Current user:', currentUser);
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
    <DashboardLayout
      title="Product Management"
      description="Manage your product listings and inventory"
    >
      <ProductManagementComponent />
    </DashboardLayout>
  );
}
