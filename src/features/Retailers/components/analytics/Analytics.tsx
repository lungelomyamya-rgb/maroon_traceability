// src/components/retailers/analytics/Analytics.tsx
'use client';

import { 
  BarChart3, 
  Download, 
  Calendar, 
  Filter,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
} from 'lucide-react';
import { useState } from 'react';

import { Badge } from '@/src/features/shared/ui/badge';
import { Button } from '@/src/features/shared/ui/button';
import { Card } from '@/src/features/shared/ui/card';

import { AnalyticsOverview } from './AnalyticsOverview';
import { SalesChart } from './SalesChart';
import { TopProducts } from './TopProducts';
import { useAnalytics } from './hooks/useAnalytics';

interface AnalyticsProps {
  onExport?: (data: unknown) => void;
}

export function Analytics({ onExport }: AnalyticsProps) {
  const {
    data,
    isLoading,
    selectedTimeRange,
    timeRanges,
    setSelectedTimeRange,
    formatCurrency,
    formatNumber,
    formatPercentage,
    getPerformanceInsights,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    exportData,
  } = useAnalytics();

  const [showInsights, setShowInsights] = useState(true);
  const insights = getPerformanceInsights();

  const handleExport = () => {
    const exportData = data ? {
      summary: {
        totalRevenue: data.totalRevenue,
        totalOrders: data.totalOrders,
        averageOrderValue: data.averageOrderValue,
        conversionRate: data.conversionRate,
      },
      monthlyRevenue: data.monthlyRevenue,
      topProducts: data.topProducts,
      customerMetrics: data.customerMetrics,
      salesByCategory: data.salesByCategory,
      recentPerformance: data.recentPerformance,
      exportedAt: new Date().toISOString(),
      timeRange: selectedTimeRange,
    } : null;

    if (exportData) {
      onExport?.(exportData);
      
      // Create downloadable JSON file
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `analytics-${selectedTimeRange}-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-8">
        <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">No analytics data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => setShowInsights(!showInsights)}>
            <Filter className="h-4 w-4 mr-2" />
            {showInsights ? 'Hide' : 'Show'} Insights
          </Button>
          <Button onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
        </div>
      </div>

      {/* Performance Insights */}
      {showInsights && insights.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-900">Performance Insights</h3>
          {insights.map((insight, index) => (
            <Card key={index} className={`p-4 ${
              insight.type === 'positive' ? 'border-green-200 bg-green-50' : 
                insight.type === 'warning' ? 'border-yellow-200 bg-yellow-50' : 
                  'border-blue-200 bg-blue-50'
            }`}>
              <div className="flex items-start gap-3">
                <div className="text-lg">{insight.icon}</div>
                <div className="flex-1">
                  <h4 className={`font-medium ${
                    insight.type === 'positive' ? 'text-green-900' : 
                      insight.type === 'warning' ? 'text-yellow-900' : 
                        'text-blue-900'
                  }`}>
                    {insight.title}
                  </h4>
                  <p className={`text-sm mt-1 ${
                    insight.type === 'positive' ? 'text-green-700' : 
                      insight.type === 'warning' ? 'text-yellow-700' : 
                        'text-blue-700'
                  }`}>
                    {insight.description}
                  </p>
                </div>
                {insight.type === 'positive' && (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                )}
                {insight.type === 'warning' && (
                  <AlertTriangle className="h-5 w-5 text-yellow-600" />
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Analytics Overview */}
      <AnalyticsOverview
        data={data}
        formatCurrency={formatCurrency}
        formatNumber={formatNumber}
        formatPercentage={formatPercentage}
      />

      {/* Charts and Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SalesChart
          data={data}
          selectedTimeRange={selectedTimeRange}
          timeRanges={timeRanges}
          onTimeRangeChange={setSelectedTimeRange}
          formatCurrency={formatCurrency}
          formatNumber={formatNumber}
          formatPercentage={formatPercentage}
        />
        
        <TopProducts
          data={data}
          formatCurrency={formatCurrency}
          formatNumber={formatNumber}
          formatPercentage={formatPercentage}
        />
      </div>

      {/* Quick Stats Summary */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">Quick Summary</h3>
          <Badge className="bg-blue-100 text-blue-800 text-xs">
            {timeRanges.find(range => range.value === selectedTimeRange)?.label}
          </Badge>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-center mb-2">
              <TrendingUp className="h-6 w-6 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(data.totalRevenue)}</p>
            <p className="text-sm text-gray-600">Total Revenue</p>
          </div>
          
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-center mb-2">
              <Calendar className="h-6 w-6 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{formatNumber(data.totalOrders)}</p>
            <p className="text-sm text-gray-600">Total Orders</p>
          </div>
          
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-center mb-2">
              <div className="h-6 w-6 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-purple-600 text-xs font-bold">%</span>
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">{formatPercentage(data.conversionRate)}</p>
            <p className="text-sm text-gray-600">Conversion Rate</p>
          </div>
          
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-center mb-2">
              <div className="h-6 w-6 bg-orange-100 rounded-full flex items-center justify-center">
                <span className="text-orange-600 text-xs font-bold">R</span>
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(data.averageOrderValue)}</p>
            <p className="text-sm text-gray-600">Avg Order Value</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
