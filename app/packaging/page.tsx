// src/app/packaging/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/contexts/userContext';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { PackagingDashboard } from '@/components/packaging/PackagingDashboard';
import { BatchProcessing } from '@/app/packaging/batch/batchProcessing';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Package, QrCode, Calendar, BarChart3 } from 'lucide-react';
import { useState } from 'react';

export default function PackagingPage() {
  const { currentUser } = useUser();
  const router = useRouter();

  useEffect(() => {
    // Redirect if user doesn't have packaging role
    if (currentUser?.role !== 'packaging') {
      router.push('/unauthorized');
      return;
    }
  }, [currentUser, router]);

  if (!currentUser || currentUser.role !== 'packaging') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <DashboardLayout
      title="Packaging Operations"
      description="Manage batch processing and packaging events"
    >
      <PackagingDashboard />
    </DashboardLayout>
  );
}