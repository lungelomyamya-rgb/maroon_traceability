// src/components/retailers/customerManagement/CustomerMetrics.tsx
'use client';

import { Users, TrendingUp, DollarSign, Star } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface CustomerMetricsProps {
  metrics: {
    totalCustomers: number;
    activeCustomers: number;
    newCustomers: number;
    averageOrderValue: number;
    totalRevenue: number;
    repeatCustomers: number;
    averageRating: number;
    customerGrowth: number;
  };
}

export function CustomerMetrics({ metrics }: CustomerMetricsProps) {
  const metricCards = [
    {
      title: 'Total Customers',
      value: metrics.totalCustomers.toLocaleString(),
      change: `+${metrics.customerGrowth.toFixed(1)}%`,
      changeType: 'positive' as const,
      icon: Users,
      color: 'text-blue-600',
    },
    {
      title: 'Active Customers',
      value: metrics.activeCustomers.toLocaleString(),
      change: '+12.3%',
      changeType: 'positive' as const,
      icon: TrendingUp,
      color: 'text-green-600',
    },
    {
      title: 'Average Order Value',
      value: `R${metrics.averageOrderValue.toFixed(2)}`,
      change: '+5.7%',
      changeType: 'positive' as const,
      icon: DollarSign,
      color: 'text-purple-600',
    },
    {
      title: 'Average Rating',
      value: metrics.averageRating.toFixed(1),
      change: '+0.3',
      changeType: 'positive' as const,
      icon: Star,
      color: 'text-orange-600',
    },
  ];

  const additionalMetrics = [
    {
      title: 'New Customers',
      value: metrics.newCustomers.toLocaleString(),
      subtitle: 'This month',
      color: 'bg-blue-100 text-blue-800',
    },
    {
      title: 'Repeat Customers',
      value: metrics.repeatCustomers.toLocaleString(),
      subtitle: `${((metrics.repeatCustomers / metrics.totalCustomers) * 100).toFixed(1)}% retention`,
      color: 'bg-green-100 text-green-800',
    },
    {
      title: 'Total Revenue',
      value: `R${metrics.totalRevenue.toLocaleString()}`,
      subtitle: 'All time',
      color: 'bg-purple-100 text-purple-800',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Main Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {metricCards.map((metric, index) => (
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

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        {additionalMetrics.map((metric, index) => (
          <Card key={index} className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{metric.title}</p>
                <p className="text-xl font-bold text-gray-900 mt-1">{metric.value}</p>
                <p className="text-xs text-gray-500 mt-1">{metric.subtitle}</p>
              </div>
              <div className={`p-2 rounded-full ${metric.color}`}>
                <Users className="h-4 w-4" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
