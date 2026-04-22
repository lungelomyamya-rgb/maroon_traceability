// src/components/retailers/shippingIntegration/ShippingMetrics.tsx
'use client';

import { Truck, Clock, CheckCircle, DollarSign } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface ShippingMetricsProps {
  metrics: {
    totalShipments: number;
    inTransit: number;
    delivered: number;
    pending: number;
    onTimeDeliveryRate: number;
    averageDeliveryTime: number;
    totalShippingCost: number;
    averageCostPerShipment: number;
    shipmentsGrowth: number;
  };
}

export function ShippingMetrics({ metrics }: ShippingMetricsProps) {
  const metricCards = [
    {
      title: 'Total Shipments',
      value: metrics.totalShipments.toLocaleString(),
      change: `+${metrics.shipmentsGrowth.toFixed(1)}%`,
      changeType: 'positive' as const,
      icon: Truck,
      color: 'text-blue-600',
    },
    {
      title: 'In Transit',
      value: metrics.inTransit.toLocaleString(),
      change: '+12.3%',
      changeType: 'positive' as const,
      icon: Clock,
      color: 'text-orange-600',
    },
    {
      title: 'On-Time Rate',
      value: `${metrics.onTimeDeliveryRate.toFixed(1)}%`,
      change: '+2.1%',
      changeType: 'positive' as const,
      icon: CheckCircle,
      color: 'text-green-600',
    },
    {
      title: 'Avg Cost',
      value: `R${metrics.averageCostPerShipment.toFixed(2)}`,
      change: '-3.4%',
      changeType: 'negative' as const,
      icon: DollarSign,
      color: 'text-purple-600',
    },
  ];

  const additionalMetrics = [
    {
      title: 'Delivered',
      value: metrics.delivered.toLocaleString(),
      subtitle: `${((metrics.delivered / metrics.totalShipments) * 100).toFixed(1)}% completion`,
      color: 'bg-green-100 text-green-800',
    },
    {
      title: 'Pending',
      value: metrics.pending.toLocaleString(),
      subtitle: 'Awaiting pickup',
      color: 'bg-yellow-100 text-yellow-800',
    },
    {
      title: 'Avg Delivery',
      value: `${metrics.averageDeliveryTime.toFixed(1)} days`,
      subtitle: 'Average time',
      color: 'bg-blue-100 text-blue-800',
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
                <Truck className="h-4 w-4" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
