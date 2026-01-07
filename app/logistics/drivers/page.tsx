// src/app/logistics/drivers/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/contexts/userContext';
import { DriverManagement } from '@/components/logistics/driverManagement';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
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
    <DashboardLayout
      title="Driver Management"
      subtitle="Manage driver profiles, certifications, and assignments"
    >
      <DriverManagement />
    </DashboardLayout>
  );
}
