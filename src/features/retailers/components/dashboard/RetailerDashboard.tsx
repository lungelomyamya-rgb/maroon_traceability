// src/components/retailers/dashboard/RetailerDashboard.tsx
'use client';

import { RefreshCw, Download, Plus, BarChart3, Store } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { InventoryAlerts } from './InventoryAlerts';
import { MetricsCards } from './MetricsCards';
import { RecentOrders } from './RecentOrders';
import { SalesChart } from './SalesChart';
import { TopProducts } from './TopProducts';
import { useRetailerDashboard } from './hooks/useRetailerDashboard';


interface RetailerDashboardProps {
  title?: string;
}

export function RetailerDashboard({ title = 'Retailer Dashboard' }: RetailerDashboardProps) {
  const router = useRouter();
  const { products, orders, analytics, isLoading, refreshData } = useRetailerDashboard();

  if (isLoading || !analytics) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Loading...
            </Button>
          </div>
        </div>

        {/* Loading skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="p-6 bg-gray-100 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 sm:p-8 lg:p-10 text-white">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-center gap-6 text-center lg:text-left">
          <div className="flex-1 max-w-4xl">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">
              Retailer
            </h1>
            <p className="text-lg sm:text-xl text-blue-100 mb-6 max-w-2xl mx-auto lg:mx-0">
              Manage your products, track orders, analyze sales, and grow your business with powerful tools designed for South African retailers.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              <Button
                onClick={() => router.push('/retailer/product-management')}
                className="bg-white text-blue-600 hover:bg-blue-50 px-6 py-3"
              >
                <Plus className="h-5 w-5 mr-2" />
                Add New Product
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push('/retailer/analytics')}
                className="border-white text-white hover:bg-white hover:text-blue-600 px-6 py-3"
              >
                <BarChart3 className="h-5 w-5 mr-2" />
                View Analytics
              </Button>
            </div>
          </div>
          <div className="hidden lg:block">
            <Store className="h-32 w-32 text-white/20" />
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={refreshData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Metrics Cards */}
      <MetricsCards analytics={analytics} />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2">
          <RecentOrders orders={orders} />
        </div>

        {/* Top Products */}
        <div className="hidden lg:block">
          <TopProducts products={products} />
        </div>
      </div>

      {/* Second Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Sales Chart */}
        <div className="lg:col-span-2">
          <SalesChart data={analytics.monthlyRevenue} />
        </div>

        {/* Inventory Alerts */}
        <div className="hidden lg:block">
          <InventoryAlerts products={products} />
        </div>
      </div>

      {/* Mobile Layout - Show Top Products and Inventory on mobile */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:hidden gap-4 sm:gap-6 mt-4 sm:mt-6">
        <div className="sm:col-span-1">
          <TopProducts products={products} />
        </div>
        <div className="sm:col-span-1">
          <InventoryAlerts products={products} />
        </div>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-4 sm:mt-6">
        <Card className="p-3 sm:p-4 lg:p-6 text-center">
          <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-blue-600 mb-1 sm:mb-2">
            {analytics.totalProducts}
          </div>
          <p className="text-xs sm:text-sm text-gray-600">Total Products</p>
        </Card>
        <Card className="p-3 sm:p-4 lg:p-6 text-center">
          <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-green-600 mb-1 sm:mb-2">
            {analytics.activeProducts}
          </div>
          <p className="text-xs sm:text-sm text-gray-600">Active Listings</p>
        </Card>
        <Card className="p-3 sm:p-4 lg:p-6 text-center">
          <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-purple-600 mb-1 sm:mb-2">
            {analytics.customerMetrics.totalCustomers}
          </div>
          <p className="text-xs sm:text-sm text-gray-600">Total Customers</p>
        </Card>
        <Card className="p-3 sm:p-4 lg:p-6 text-center">
          <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-orange-600 mb-1 sm:mb-2">
            {analytics.customerMetrics.averageRating.toFixed(1)}
          </div>
          <p className="text-xs sm:text-sm text-gray-600">Average Rating</p>
        </Card>
      </div>
    </div>
  );
}
