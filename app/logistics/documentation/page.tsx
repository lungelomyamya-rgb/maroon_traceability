// src/app/logistics/documentation/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/contexts/userContext';
import { TransportDocumentation } from '@/components/logistics/transportDocumentation';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { FileText } from 'lucide-react';

export default function LogisticsDocumentationPage() {
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
      title="Transport Documentation"
      subtitle="Manage bills of lading, delivery confirmations, and compliance documents"
    >
      <TransportDocumentation />
    </DashboardLayout>
  );
}
