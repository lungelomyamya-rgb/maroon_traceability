// src/app/retailer/payments/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/contexts/userContext';
import { DashboardLayout } from '@/components/dashboard/dashboardLayout';
import PaymentProcessingComponent from '../../../components/retailers/paymentProcessingComponent';

export default function PaymentProcessingPage() {
  const { currentUser } = useUser();
  const router = useRouter();

  useEffect(() => {
    // Redirect if user doesn't have retailer role
    const timer = setTimeout(() => {
      if (currentUser?.role !== 'retailer') {
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
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
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
        title="Payment Processing"
        description="Manage payment gateways and transaction processing"
      >
        <PaymentProcessingComponent />
      </DashboardLayout>
    </>
  );
}
