// src/app/packaging/page.tsx
'use client';

import { Package, QrCode, BarChart3, Box, CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { DashboardLayoutUnified as DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { useUser } from '@/contexts/userContext';


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
                <div className="text-xs opacity-90">Process batches</div>
              </div>
            </button>

            <button
              onClick={() => router.push('/packaging/qr-generation')}
              className="bg-teal-600 hover:bg-teal-700 text-white flex items-center gap-2 sm:gap-3 h-auto p-3 sm:p-4 rounded-lg font-medium transition-all hover:scale-105 active:scale-95 shadow-lg"
            >
              <QrCode className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
              <div className="text-left flex-1 min-w-0">
                <div className="font-medium text-sm sm:text-base">QR Generation</div>
                <div className="text-xs opacity-90">Generate codes</div>
              </div>
            </button>

            <button
              onClick={() => router.push('/packaging/inventory')}
              className="bg-cyan-600 hover:bg-cyan-700 text-white flex items-center gap-2 sm:gap-3 h-auto p-3 sm:p-4 rounded-lg font-medium transition-all hover:scale-105 active:scale-95 shadow-lg"
            >
              <Box className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
              <div className="text-left flex-1 min-w-0">
                <div className="font-medium text-sm sm:text-base">Inventory</div>
                <div className="text-xs opacity-90">Track items</div>
              </div>
            </button>

            <button
              onClick={() => router.push('/packaging/quality-check')}
              className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 sm:gap-3 h-auto p-3 sm:p-4 rounded-lg font-medium transition-all hover:scale-105 active:scale-95 shadow-lg"
            >
              <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
              <div className="text-left flex-1 min-w-0">
                <div className="font-medium text-sm sm:text-base">Quality Check</div>
                <div className="text-xs opacity-90">Quality control</div>
              </div>
            </button>

            <button
              onClick={() => router.push('/packaging/reports')}
              className="bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2 sm:gap-3 h-auto p-3 sm:p-4 rounded-lg font-medium transition-all hover:scale-105 active:scale-95 shadow-lg"
            >
              <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
              <div className="text-left flex-1 min-w-0">
                <div className="font-medium text-sm sm:text-base">Reports</div>
                <div className="text-xs opacity-90">View analytics</div>
              </div>
            </button>
          </div>

          {/* Overview Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <Card className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Active Batches</p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900">12</p>
                </div>
                <div className="p-2 sm:p-3 bg-emerald-100 rounded-lg">
                  <Package className="h-4 w-4 sm:h-6 sm:w-6 text-emerald-600" />
                </div>
              </div>
            </Card>

            <Card className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">QR Codes Generated</p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900">248</p>
                </div>
                <div className="p-2 sm:p-3 bg-teal-100 rounded-lg">
                  <QrCode className="h-4 w-4 sm:h-6 sm:w-6 text-teal-600" />
                </div>
              </div>
            </Card>

            <Card className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Quality Checks</p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900">95%</p>
                </div>
                <div className="p-2 sm:p-3 bg-blue-100 rounded-lg">
                  <CheckCircle className="h-4 w-4 sm:h-6 sm:w-6 text-blue-600" />
                </div>
              </div>
            </Card>

            <Card className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Inventory Items</p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900">1,847</p>
                </div>
                <div className="p-2 sm:p-3 bg-cyan-100 rounded-lg">
                  <Box className="h-4 w-4 sm:h-6 sm:w-6 text-cyan-600" />
                </div>
              </div>
            </Card>
          </div>

          {/* Recent Activities */}
          <Card title="Recent Activities" className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="p-2 bg-emerald-100 rounded-lg flex-shrink-0">
                  <Package className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-gray-900 text-sm sm:text-base truncate">Batch #BATCH-001</p>
                  <p className="text-xs sm:text-sm text-gray-500">Processing completed • 2 hours ago</p>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <Badge className="bg-green-100 text-green-800 text-xs">Completed</Badge>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="p-2 bg-teal-100 rounded-lg flex-shrink-0">
                  <QrCode className="h-4 w-4 sm:h-5 sm:w-5 text-teal-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-gray-900 text-sm sm:text-base truncate">QR Code Generation</p>
                  <p className="text-xs sm:text-sm text-gray-500">50 codes generated • 4 hours ago</p>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <Badge className="bg-blue-100 text-blue-800 text-xs">In Progress</Badge>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
                  <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-gray-900 text-sm sm:text-base truncate">Quality Check</p>
                  <p className="text-xs sm:text-sm text-gray-500">Batch #BATCH-002 passed • 6 hours ago</p>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <Badge className="bg-green-100 text-green-800 text-xs">Passed</Badge>
              </div>
            </div>
          </Card>
        </div>
      </DashboardLayout>
    </>
  );
}
