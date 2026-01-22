// src/app/packaging/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/contexts/userContext';
import { DashboardLayout } from '@/components/dashboard/dashboardLayout';
import { PackagingDashboard } from '@/components/packaging/packagingDashboard';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Package, QrCode, Calendar, BarChart3, Box, Search, CheckCircle } from 'lucide-react';
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
    <>
      {/* Back Button Above DashboardLayout */}
      <div className="px-4 sm:px-6 lg:px-8 pt-4">
      </div>
      
      <DashboardLayout
        description="Manage batch processing and packaging events"
      >
        <div className="space-y-6">
          {/* Hero Section */}
          <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-2xl p-4 sm:p-6 md:p-8 text-white relative overflow-hidden">
            <div className="text-center relative z-10">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2 sm:mb-4">Packaging Management</h1>
              <p className="text-emerald-100 mb-2 sm:mb-4 text-xs sm:text-sm md:text-base">Complete packaging operations and batch management for Maroon Traceability System</p>
              <div className="flex justify-center items-center gap-2 sm:gap-4 md:gap-6 mb-4 sm:mb-6 md:mb-8 flex-wrap">
                <div className="flex items-center gap-1 sm:gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2">
                  <Package className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-6" />
                  <span className="text-xs sm:text-sm font-medium">Active Batches</span>
                </div>
                <div className="flex items-center gap-1 sm:gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2">
                  <QrCode className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-6" />
                  <span className="text-xs sm:text-sm font-medium">QR Codes</span>
                </div>
                <div className="flex items-center gap-1 sm:gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2">
                  <Box className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-6" />
                  <span className="text-xs sm:text-sm font-medium">Inventory Items</span>
                </div>
              </div>
              <div className="hidden lg:block">
                <Package className="h-16 w-16 text-emerald-200 mx-auto opacity-50" />
              </div>
            </div>
            {/* Decorative elements for mobile */}
            <div className="absolute top-0 left-0 w-full h-full opacity-5">
              <div className="absolute top-2 left-2 w-20 h-20 bg-white/5 rounded-full blur-xl"></div>
              <div className="absolute bottom-2 right-2 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-6 lg:gap-8">
            <button
              onClick={() => router.push('/packaging/batch')}
              className="bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-2 sm:gap-3 h-auto p-3 sm:p-4 rounded-lg font-medium transition-all hover:scale-105 active:scale-95 shadow-lg"
            >
              <Package className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
              <div className="text-left flex-1 min-w-0">
                <div className="font-medium text-sm sm:text-base">Batch Processing</div>
                <div className="text-xs opacity-90 sm:block">Process new batches</div>
              </div>
            </button>
            <button
              onClick={() => router.push('/packaging/inventory')}
              className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 sm:gap-3 h-auto p-3 sm:p-4 rounded-lg font-medium transition-all hover:scale-105 active:scale-95 shadow-lg"
            >
              <Box className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
              <div className="text-left flex-1 min-w-0">
                <div className="font-medium text-sm sm:text-base">Inventory</div>
                <div className="text-xs opacity-90 block">Manage stock levels</div>
              </div>
            </button>
            <button
              onClick={() => router.push('/packaging/quality-check')}
              className="bg-red-600 hover:bg-red-700 text-white flex items-center gap-2 sm:gap-3 h-auto p-3 sm:p-4 rounded-lg font-medium transition-all hover:scale-105 active:scale-95 shadow-lg"
            >
              <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
              <div className="text-left flex-1 min-w-0">
                <div className="font-medium text-sm sm:text-base">Quality Check</div>
                <div className="text-xs opacity-90 block">Quality control</div>
              </div>
            </button>
            <button
              onClick={() => router.push('/packaging/qr-generation')}
              className="bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-2 sm:gap-3 h-auto p-3 sm:p-4 rounded-lg font-medium transition-all hover:scale-105 active:scale-95 shadow-lg"
            >
              <QrCode className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
              <div className="text-left flex-1 min-w-0">
                <div className="font-medium text-sm sm:text-base">QR Generation</div>
                <div className="text-xs opacity-90 block">Create QR codes</div>
              </div>
            </button>
            <button
              onClick={() => router.push('/packaging/reports')}
              className="bg-orange-600 hover:bg-orange-700 text-white flex items-center gap-2 sm:gap-3 h-auto p-3 sm:p-4 rounded-lg font-medium transition-all hover:scale-105 active:scale-95 shadow-lg"
            >
              <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
              <div className="text-left flex-1 min-w-0">
                <div className="font-medium text-sm sm:text-base">Reports</div>
                <div className="text-xs opacity-90 block">View analytics</div>
              </div>
            </button>
          </div>

          {/* Main Dashboard */}
          <PackagingDashboard />
        </div>
      </DashboardLayout>
    </>
  );
}