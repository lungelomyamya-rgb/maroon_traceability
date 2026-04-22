// src/components/retailers/analytics/AnalyticsOverview.tsx
'use client';

import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  Target,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { AnalyticsData } from './hooks/useAnalytics';

interface AnalyticsOverviewProps {
  data: AnalyticsData;
  formatCurrency: (amount: number) => string;
  formatNumber: (num: number) => string;
  formatPercentage: (value: number) => string;
}

export function AnalyticsOverview({
  data,
  formatCurrency,
  formatNumber,
  formatPercentage,
}: AnalyticsOverviewProps) {
  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
    case 'up':
      return <TrendingUp className="h-4 w-4 text-green-600" />;
    case 'down':
      return <TrendingDown className="h-4 w-4 text-red-600" />;
    default:
      return <div className="h-4 w-4" />;
    }
  };

  const getTrendColor = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
    case 'up':
      return 'text-green-600';
    case 'down':
      return 'text-red-600';
    default:
      return 'text-gray-600';
    }
  };

  // Mock trend calculations for demo purposes
  const revenueTrend: 'up' | 'down' | 'stable' = 'up';
  const ordersTrend: 'up' | 'down' | 'stable' = 'up';
  const conversionTrend: 'up' | 'down' | 'stable' = 'down';
  const customersTrend: 'up' | 'down' | 'stable' = 'up';

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(data.totalRevenue)}</p>
              <div className="flex items-center gap-1 mt-1">
                {getTrendIcon(revenueTrend)}
                <span className={`text-xs ${getTrendColor(revenueTrend)}`}>
                  +12.5% from last month
                </span>
              </div>
            </div>
            <DollarSign className="h-8 w-8 text-blue-600" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">{formatNumber(data.totalOrders)}</p>
              <div className="flex items-center gap-1 mt-1">
                {getTrendIcon(ordersTrend)}
                <span className={`text-xs ${getTrendColor(ordersTrend)}`}>
                  +8.3% from last month
                </span>
              </div>
            </div>
            <ShoppingCart className="h-8 w-8 text-green-600" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Conversion Rate</p>
              <p className="text-2xl font-bold text-gray-900">{formatPercentage(data.conversionRate)}</p>
              <div className="flex items-center gap-1 mt-1">
                {getTrendIcon(conversionTrend)}
                <span className={`text-xs ${getTrendColor(conversionTrend)}`}>
                  -2.1% from last month
                </span>
              </div>
            </div>
            <Target className="h-8 w-8 text-purple-600" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Customers</p>
              <p className="text-2xl font-bold text-gray-900">{formatNumber(data.customerMetrics.totalCustomers)}</p>
              <div className="flex items-center gap-1 mt-1">
                {getTrendIcon(customersTrend)}
                <span className={`text-xs ${getTrendColor(customersTrend)}`}>
                  +15.2% from last month
                </span>
              </div>
            </div>
            <Users className="h-8 w-8 text-orange-600" />
          </div>
        </Card>
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Order Value</p>
              <p className="text-xl font-bold text-gray-900">{formatCurrency(data.averageOrderValue)}</p>
            </div>
            <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
              <DollarSign className="h-4 w-4 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Products</p>
              <p className="text-xl font-bold text-gray-900">{data.activeProducts}/{data.totalProducts}</p>
            </div>
            <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
              <Package className="h-4 w-4 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Low Stock Alerts</p>
              <p className="text-xl font-bold text-gray-900">{data.lowStockProducts}</p>
            </div>
            <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
              data.lowStockProducts > 0 ? 'bg-yellow-100' : 'bg-gray-100'
            }`}>
              <Package className={`h-4 w-4 ${
                data.lowStockProducts > 0 ? 'text-yellow-600' : 'text-gray-600'
              }`} />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending Orders</p>
              <p className="text-xl font-bold text-gray-900">{data.pendingOrders}</p>
            </div>
            <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
              data.pendingOrders > 0 ? 'bg-orange-100' : 'bg-gray-100'
            }`}>
              <ShoppingCart className={`h-4 w-4 ${
                data.pendingOrders > 0 ? 'text-orange-600' : 'text-gray-600'
              }`} />
            </div>
          </div>
        </Card>
      </div>

      {/* Customer Metrics */}
      <Card className="p-4">
        <h3 className="font-semibold text-gray-900 mb-4">Customer Metrics</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">{formatNumber(data.customerMetrics.totalCustomers)}</p>
            <p className="text-sm text-gray-600">Total Customers</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">{formatNumber(data.customerMetrics.repeatCustomers)}</p>
            <p className="text-sm text-gray-600">Repeat Customers</p>
            <Badge className="bg-green-100 text-green-800 text-xs mt-1">
              {formatPercentage((data.customerMetrics.repeatCustomers / data.customerMetrics.totalCustomers) * 100)} retention
            </Badge>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">{formatNumber(data.customerMetrics.newCustomers)}</p>
            <p className="text-sm text-gray-600">New Customers</p>
            <Badge className="bg-blue-100 text-blue-800 text-xs mt-1">
              {formatPercentage((data.customerMetrics.newCustomers / data.customerMetrics.totalCustomers) * 100)} growth
            </Badge>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t">
          <div className="flex items-center justify-center gap-2">
            <span className="text-sm text-gray-600">Average Rating:</span>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <div
                  key={star}
                  className={`h-4 w-4 rounded-full ${
                    star <= Math.floor(data.customerMetrics.averageRating)
                      ? 'bg-yellow-400'
                      : 'bg-gray-300'
                  }`}
                />
              ))}
              <span className="text-sm font-medium text-gray-900 ml-1">
                {data.customerMetrics.averageRating.toFixed(1)}
              </span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
