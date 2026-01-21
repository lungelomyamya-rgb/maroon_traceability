// src/app/logistics/drivers/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/contexts/userContext';
import { DriverManagement } from '@/components/logistics/driverManagement';
import { DashboardLayout } from '@/components/dashboard/dashboardLayout';
import { Button } from '@/components/ui/button';
import { Users } from 'lucide-react';

export default function LogisticsDriversPage() {
  const { currentUser } = useUser();
  const router = useRouter();

  useEffect(() => {
    // Redirect if user doesn't have logistics role
    if (currentUser?.role !== 'logistics') {
      router.push('/unauthorized');
      return;
    }
  }, [currentUser, router]);

  if (!currentUser || currentUser.role !== 'logistics') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div>
      </div>
    );
  }

  return (
    <>
      {/* Back Button Above DashboardLayout */}
      <div className="px-4 sm:px-6 lg:px-8 pt-4">
        <Button
          variant="outline"
          onClick={() => router.push('/logistics')}
          className="inline-flex items-center gap-2 text-sm"
        >
          Back
        </Button>
      </div>
      
      <DashboardLayout
        title="Driver Management"
        subtitle="Manage driver profiles, certifications, and assignments"
      >
        <DriverManagement />
      </DashboardLayout>
    </>
  );
}
