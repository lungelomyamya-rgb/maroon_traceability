// src/components/retailers/dashboard/RetailerDashboard.tsx
'use client';

import { RefreshCw, Download } from 'lucide-react';

import { Button } from '@/src/features/shared/ui/button';
import { Card } from '@/src/features/shared/ui/card';

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
