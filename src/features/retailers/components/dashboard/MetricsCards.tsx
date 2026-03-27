// src/components/retailers/dashboard/MetricsCards.tsx
'use client';

import { Card } from '@/components/ui/card';
import { TrendingUp, Package, ShoppingCart, DollarSign, Users } from 'lucide-react';

interface MetricsCardsProps {
  analytics: {
    totalRevenue: number;
    totalOrders: number;
    averageOrderValue: number;
    conversionRate: number;
  };
}

export function MetricsCards({ analytics }: MetricsCardsProps) {
  const metrics = [
    {
      title: 'Total Revenue',
      value: `$${analytics.totalRevenue.toLocaleString()}`,
      change: '+12.5%',
      changeType: 'positive' as const,
      icon: DollarSign,
      color: 'text-green-600'
    },
    {
      title: 'Total Orders',
      value: analytics.totalOrders.toLocaleString(),
      change: '+8.2%',
      changeType: 'positive' as const,
      icon: ShoppingCart,
      color: 'text-blue-600'
    },
    {
      title: 'Avg Order Value',
      value: `$${analytics.averageOrderValue.toFixed(2)}`,
      change: '+3.1%',
      changeType: 'positive' as const,
      icon: Package,
      color: 'text-purple-600'
    },
    {
      title: 'Conversion Rate',
      value: `${(analytics.conversionRate * 100).toFixed(1)}%`,
      change: '+1.4%',
      changeType: 'positive' as const,
      icon: TrendingUp,
      color: 'text-orange-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {metrics.map((metric, index) => (
        <Card key={index} className="p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{metric.title}</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{metric.value}</p>
              <div className="flex items-center mt-2">
                <span className={`text-sm font-medium ${
                  metric.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {metric.change}
                </span>
                <span className="text-sm text-gray-500 ml-2">vs last month</span>
              </div>
            </div>
            <div className={`p-3 rounded-full bg-gray-50 ${metric.color}`}>
              <metric.icon className="h-6 w-6" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
