// src/components/retailers/dashboard/SalesChart.tsx
'use client';

import { BarChart3, TrendingUp } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface MonthlyRevenue {
  month: string;
  revenue: number;
  orders: number;
}

interface SalesChartProps {
  data: MonthlyRevenue[];
}

export function SalesChart({ data }: SalesChartProps) {
  // Simple chart implementation - in a real app, you'd use a charting library
  const maxRevenue = Math.max(...data.map(d => d.revenue));

  return (
    <Card className="p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Sales Overview</h3>
        <div className="flex items-center gap-2 text-sm text-green-600">
          <TrendingUp className="h-4 w-4" />
          <span>+12.5%</span>
        </div>
      </div>

      <div className="space-y-4">
        {data.map((item, index) => (
          <div key={index} className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">{item.month}</span>
              <span className="font-medium">${item.revenue.toLocaleString()}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(item.revenue / maxRevenue) * 100}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>{item.orders} orders</span>
              <span>Avg: ${(item.revenue / item.orders).toFixed(2)}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-600">Total Revenue</span>
          </div>
          <span className="text-lg font-bold text-gray-900">
            ${data.reduce((sum, item) => sum + item.revenue, 0).toLocaleString()}
          </span>
        </div>
      </div>
    </Card>
  );
}
