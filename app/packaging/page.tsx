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
import { Package, QrCode, Calendar, BarChart3, Box, Search } from 'lucide-react';
import { useState } from 'react';

export default function PackagingPage() {
  const { currentUser } = useUser();
  const router = useRouter();

  useEffect(() => {
    // Redirect if user doesn't have packaging role (with delay for context update)
    const timer = setTimeout(() => {
      if (currentUser?.role !== 'packaging') {
        console.log('Packaging page - redirecting to unauthorized. Current user:', currentUser);
        router.push('/unauthorized');
        return;
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [currentUser, router]);

  if (!currentUser || currentUser.role !== 'packaging') {
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
    <DashboardLayout
      title="Packaging Operations"
      description="Manage batch processing and packaging events"
    >
      <div className="space-y-6">
        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <button
            onClick={() => router.push('/packaging/batch')}
            className="bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-2 h-auto p-4 rounded-md font-medium transition-colors"
          >
            <Package className="h-5 w-5" />
            <div className="text-left">
              <div className="font-medium">Batch Processing</div>
              <div className="text-xs opacity-90">Process new batches</div>
            </div>
          </button>
          <button
            onClick={() => router.push('/packaging/inventory')}
            className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 h-auto p-4 rounded-md font-medium transition-colors"
          >
            <Box className="h-5 w-5" />
            <div className="text-left">
              <div className="font-medium">Inventory</div>
              <div className="text-xs opacity-90">Manage stock levels</div>
            </div>
          </button>
          <button
            onClick={() => router.push('/packaging/qr-generation')}
            className="bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-2 h-auto p-4 rounded-md font-medium transition-colors"
          >
            <QrCode className="h-5 w-5" />
            <div className="text-left">
              <div className="font-medium">QR Generation</div>
              <div className="text-xs opacity-90">Create QR codes</div>
            </div>
          </button>
          <button
            onClick={() => router.push('/packaging/reports')}
            className="bg-orange-600 hover:bg-orange-700 text-white flex items-center gap-2 h-auto p-4 rounded-md font-medium transition-colors"
          >
            <BarChart3 className="h-5 w-5" />
            <div className="text-left">
              <div className="font-medium">Reports</div>
              <div className="text-xs opacity-90">View analytics</div>
            </div>
          </button>
        </div>

        {/* Main Dashboard */}
        <PackagingDashboard />
      </div>
    </DashboardLayout>
  );
}