// src/components/retailers/paymentProcessing/PaymentMetrics.tsx
'use client';

import { DollarSign, TrendingUp, TrendingDown, CreditCard, Wallet, Clock } from 'lucide-react';

import { Card } from '@/src/features/shared/ui/card';

interface PaymentMetricsProps {
  metrics: {
    totalRevenue: number;
    totalTransactions: number;
    averageOrderValue: number;
    successRate: number;
    pendingTransactions: number;
    failedTransactions: number;
    refundAmount: number;
    monthlyRevenue: Array<{ month: string; revenue: number; transactions: number }>;
  };
}

export function PaymentMetrics({ metrics }: PaymentMetricsProps) {
  const metricCards = [
    {
      title: 'Total Revenue',
      value: `R${metrics.totalRevenue.toLocaleString()}`,
      change: '+15.3%',
      changeType: 'positive' as const,
      icon: DollarSign,
      color: 'text-green-600',
    },
    {
      title: 'Total Transactions',
      value: metrics.totalTransactions.toLocaleString(),
      change: '+8.7%',
      changeType: 'positive' as const,
      icon: CreditCard,
      color: 'text-blue-600',
    },
    {
      title: 'Success Rate',
      value: `${metrics.successRate.toFixed(1)}%`,
      change: '+2.1%',
      changeType: 'positive' as const,
      icon: TrendingUp,
      color: 'text-purple-600',
    },
    {
      title: 'Avg Order Value',
      value: `R${metrics.averageOrderValue.toFixed(2)}`,
      change: '+3.4%',
      changeType: 'positive' as const,
      icon: Wallet,
      color: 'text-orange-600',
    },
  ];

  const statusCards = [
    {
      title: 'Pending',
      value: metrics.pendingTransactions,
      color: 'bg-yellow-100 text-yellow-800',
      icon: Clock,
    },
    {
      title: 'Failed',
      value: metrics.failedTransactions,
      color: 'bg-red-100 text-red-800',
      icon: TrendingDown,
    },
    {
      title: 'Refunds',
      value: `R${metrics.refundAmount.toLocaleString()}`,
      color: 'bg-orange-100 text-orange-800',
      icon: TrendingDown,
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

      {/* Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        {statusCards.map((card, index) => (
          <Card key={index} className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{card.title}</p>
                <p className="text-xl font-bold text-gray-900 mt-1">{card.value}</p>
              </div>
              <div className={`p-2 rounded-full ${card.color}`}>
                <card.icon className="h-4 w-4" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
