// src/components/retailers/analytics/SalesChart.tsx
'use client';

import { TrendingUp, Download } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AnalyticsData, TimeRange } from './hooks/useAnalytics';

interface SalesChartProps {
  data: AnalyticsData;
  selectedTimeRange: string;
  timeRanges: TimeRange[];
  onTimeRangeChange: (range: string) => void;
  formatCurrency: (amount: number) => string;
  formatNumber: (num: number) => string;
  formatPercentage: (value: number) => string;
}

export function SalesChart({
  data,
  selectedTimeRange,
  timeRanges,
  onTimeRangeChange,
  formatCurrency,
  formatNumber,
  formatPercentage,
}: SalesChartProps) {
  const [chartType, setChartType] = useState<'revenue' | 'orders'>('revenue');

  const getMaxValue = () => {
    if (chartType === 'revenue') {
      return Math.max(...data.monthlyRevenue.map(month => month.revenue));
    } else {
      return Math.max(...data.monthlyRevenue.map(month => month.orders));
    }
  };

  const getBarHeight = (value: number) => {
    const maxValue = getMaxValue();
    return (value / maxValue) * 100;
  };

  const getBarColor = (index: number) => {
    const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500', 'bg-pink-500', 'bg-indigo-500'];
    return colors[index % colors.length];
  };

  return (
    <div className="space-y-6">
      {/* Monthly Revenue Chart */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-semibold text-gray-900">Monthly Performance</h3>
          <div className="flex items-center gap-3">
            <Select value={chartType} onValueChange={(value) => setChartType(value as 'revenue' | 'orders')}>
              <SelectTrigger className="w-[150px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="revenue">Revenue</SelectItem>
                <SelectItem value="orders">Orders</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedTimeRange} onValueChange={onTimeRangeChange}>
              <SelectTrigger className="w-[150px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {timeRanges.map(range => (
                  <SelectItem key={range.value} value={range.value}>
                    {range.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Chart */}
        <div className="h-64 flex items-end justify-between gap-2 mb-4">
          {data.monthlyRevenue.map((month, index) => (
            <div key={month.month} className="flex-1 flex flex-col items-center">
              <div className="w-full flex flex-col items-center">
                <span className="text-xs text-gray-600 mb-1">
                  {chartType === 'revenue' ? formatCurrency(month.revenue) : formatNumber(month.orders)}
                </span>
                <div className="w-full bg-gray-200 rounded-t relative h-48">
                  <div
                    className={`absolute bottom-0 w-full ${getBarColor(index)} rounded-t transition-all duration-500`}
                    style={{ height: `${getBarHeight(chartType === 'revenue' ? month.revenue : month.orders)}%` }}
                  />
                </div>
              </div>
              <span className="text-xs text-gray-500 mt-2">{month.month}</span>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t">
          <div className="text-center">
            <p className="text-sm text-gray-600">Total {chartType === 'revenue' ? 'Revenue' : 'Orders'}</p>
            <p className="text-lg font-bold text-gray-900">
              {chartType === 'revenue'
                ? formatCurrency(data.monthlyRevenue.reduce((sum, month) => sum + month.revenue, 0))
                : formatNumber(data.monthlyRevenue.reduce((sum, month) => sum + month.orders, 0))
              }
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Average</p>
            <p className="text-lg font-bold text-gray-900">
              {chartType === 'revenue'
                ? formatCurrency(data.monthlyRevenue.reduce((sum, month) => sum + month.revenue, 0) / data.monthlyRevenue.length)
                : formatNumber(Math.round(data.monthlyRevenue.reduce((sum, month) => sum + month.orders, 0) / data.monthlyRevenue.length))
              }
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Peak Month</p>
            <p className="text-lg font-bold text-gray-900">
              {data.monthlyRevenue.reduce((max, month) =>
                (chartType === 'revenue' ? month.revenue : month.orders) > (chartType === 'revenue' ? max.revenue : max.orders) ? month : max,
              ).month}
            </p>
          </div>
        </div>
      </Card>

      {/* Sales by Category */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-semibold text-gray-900">Sales by Category</h3>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>

        <div className="space-y-3">
          {data.salesByCategory.map((category, index) => (
            <div key={category.category} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded" style={{ backgroundColor: getBarColor(index).replace('bg-', '#').replace('500', '600') }} />
                <span className="text-sm font-medium">{category.category}</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${getBarColor(index)}`}
                    style={{ width: `${category.percentage}%` }}
                  />
                </div>
                <span className="text-sm text-gray-600 w-20 text-right">{formatPercentage(category.percentage)}</span>
                <span className="text-sm font-medium w-24 text-right">{formatCurrency(category.revenue)}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Total Revenue</span>
            <span className="text-lg font-bold text-gray-900">
              {formatCurrency(data.salesByCategory.reduce((sum, cat) => sum + cat.revenue, 0))}
            </span>
          </div>
        </div>
      </Card>

      {/* Recent Performance */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-semibold text-gray-900">Recent Performance</h3>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-green-600" />
            <span className="text-sm text-green-600">Last 7 days</span>
          </div>
        </div>

        <div className="space-y-3">
          {data.recentPerformance.map((day, _index) => (
            <div key={day.date} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600">
                  {new Date(day.date).toLocaleDateString('en-ZA', { weekday: 'short', month: 'short', day: 'numeric' })}
                </span>
              </div>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Revenue:</span>
                  <span className="text-sm font-medium">{formatCurrency(day.revenue)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Orders:</span>
                  <span className="text-sm font-medium">{day.orders}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t grid grid-cols-2 gap-4">
          <div>
            <span className="text-sm text-gray-600">Avg Daily Revenue</span>
            <p className="text-lg font-bold text-gray-900">
              {formatCurrency(data.recentPerformance.reduce((sum, day) => sum + day.revenue, 0) / data.recentPerformance.length)}
            </p>
          </div>
          <div>
            <span className="text-sm text-gray-600">Avg Daily Orders</span>
            <p className="text-lg font-bold text-gray-900">
              {Math.round(data.recentPerformance.reduce((sum, day) => sum + day.orders, 0) / data.recentPerformance.length)}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
