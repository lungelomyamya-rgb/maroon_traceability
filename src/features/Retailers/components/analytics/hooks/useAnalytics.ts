// src/components/retailers/analytics/hooks/useAnalytics.ts
'use client';

import { useState, useEffect } from 'react';

interface AnalyticsData {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  conversionRate: number;
  totalProducts: number;
  activeProducts: number;
  lowStockProducts: number;
  pendingOrders: number;
  monthlyRevenue: Array<{ month: string; revenue: number; orders: number }>;
  topProducts: Array<{ productId: string; name: string; sales: number; revenue: number; views: number }>;
  customerMetrics: {
    totalCustomers: number;
    repeatCustomers: number;
    newCustomers: number;
    averageRating: number;
  };
  salesByCategory: Array<{ category: string; revenue: number; percentage: number }>;
  recentPerformance: Array<{ date: string; revenue: number; orders: number }>;
}

interface TimeRange {
  value: string;
  label: string;
  days: number;
}

export function useAnalytics() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTimeRange, setSelectedTimeRange] = useState('30days');

  const timeRanges: TimeRange[] = [
    { value: '7days', label: 'Last 7 Days', days: 7 },
    { value: '30days', label: 'Last 30 Days', days: 30 },
    { value: '90days', label: 'Last 90 Days', days: 90 },
    { value: '1year', label: 'Last Year', days: 365 },
  ];

  const categories = [
    { value: 'vegetables', label: 'Vegetables' },
    { value: 'fruits', label: 'Fruits' },
    { value: 'grains', label: 'Grains' },
    { value: 'dairy', label: 'Dairy' },
    { value: 'meat', label: 'Meat' },
    { value: 'herbs', label: 'Herbs' },
    { value: 'processed', label: 'Processed Foods' },
  ];

  useEffect(() => {
    const loadMockData = async () => {
      const mockData: AnalyticsData = {
        totalRevenue: 485760.50,
        totalOrders: 1247,
        averageOrderValue: 389.67,
        conversionRate: 3.4,
        totalProducts: 156,
        activeProducts: 142,
        lowStockProducts: 8,
        pendingOrders: 23,
        monthlyRevenue: [
          { month: 'Jan', revenue: 42350, orders: 108 },
          { month: 'Feb', revenue: 38920, orders: 95 },
          { month: 'Mar', revenue: 52180, orders: 134 },
          { month: 'Apr', revenue: 45670, orders: 117 },
          { month: 'May', revenue: 49890, orders: 128 },
          { month: 'Jun', revenue: 52340, orders: 142 },
        ],
        topProducts: [
          { productId: 'prod-001', name: 'Organic Tomatoes', sales: 342, revenue: 15723, views: 1820 },
          { productId: 'prod-002', name: 'Fresh Spinach', sales: 289, revenue: 8235, views: 945 },
          { productId: 'prod-003', name: 'Free-Range Eggs', sales: 412, revenue: 26780, views: 2340 },
          { productId: 'prod-004', name: 'Whole Milk', sales: 198, revenue: 11880, views: 1567 },
          { productId: 'prod-005', name: 'Artisan Bread', sales: 267, revenue: 16020, views: 1234 },
        ],
        customerMetrics: {
          totalCustomers: 892,
          repeatCustomers: 534,
          newCustomers: 358,
          averageRating: 4.6,
        },
        salesByCategory: [
          { category: 'vegetables', revenue: 125680, percentage: 25.9 },
          { category: 'fruits', revenue: 98450, percentage: 20.3 },
          { category: 'dairy', revenue: 87340, percentage: 18.0 },
          { category: 'meat', revenue: 76590, percentage: 15.8 },
          { category: 'grains', revenue: 54230, percentage: 11.2 },
          { category: 'herbs', revenue: 28970, percentage: 6.0 },
          { category: 'processed', revenue: 14500, percentage: 3.0 },
        ],
        recentPerformance: [
          { date: '2024-03-20', revenue: 2340, orders: 6 },
          { date: '2024-03-21', revenue: 3456, orders: 9 },
          { date: '2024-03-22', revenue: 2890, orders: 7 },
          { date: '2024-03-23', revenue: 4123, orders: 11 },
          { date: '2024-03-24', revenue: 3678, orders: 8 },
          { date: '2024-03-25', revenue: 4567, orders: 12 },
          { date: '2024-03-26', revenue: 5234, orders: 14 },
        ],
      };

      setData(mockData);
      setIsLoading(false);
    };

    loadMockData();
  }, [selectedTimeRange]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-ZA').format(num);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const getTrendDirection = (current: number, previous: number) => {
    if (current > previous) {
      return 'up';
    }
    if (current < previous) {
      return 'down';
    }
    return 'stable';
  };

  const getTrendPercentage = (current: number, previous: number) => {
    if (previous === 0) {
      return 0;
    }
    return ((current - previous) / previous) * 100;
  };

  const getCategoryLabel = (category: string) => {
    return categories.find(cat => cat.value === category)?.label || category;
  };

  const getPerformanceInsights = () => {
    if (!data) {
      return [];
    }

    const insights = [];

    // Revenue insights
    const avgMonthlyRevenue = data.monthlyRevenue.reduce((sum, month) => sum + month.revenue, 0) / data.monthlyRevenue.length;
    const latestMonth = data.monthlyRevenue[data.monthlyRevenue.length - 1];
    if (latestMonth.revenue > avgMonthlyRevenue * 1.1) {
      insights.push({
        type: 'positive',
        title: 'Revenue Growth',
        description: `Latest month revenue is ${formatPercentage(((latestMonth.revenue - avgMonthlyRevenue) / avgMonthlyRevenue) * 100)} above average`,
        icon: '📈',
      });
    }

    // Conversion rate insights
    if (data.conversionRate > 3.5) {
      insights.push({
        type: 'positive',
        title: 'High Conversion Rate',
        description: `Your conversion rate of ${formatPercentage(data.conversionRate)} is performing well`,
        icon: '🎯',
      });
    }

    // Low stock alerts
    if (data.lowStockProducts > 5) {
      insights.push({
        type: 'warning',
        title: 'Low Stock Alert',
        description: `${data.lowStockProducts} products need restocking soon`,
        icon: '⚠️',
      });
    }

    // Customer insights
    const repeatRate = (data.customerMetrics.repeatCustomers / data.customerMetrics.totalCustomers) * 100;
    if (repeatRate > 60) {
      insights.push({
        type: 'positive',
        title: 'Customer Loyalty',
        description: `${formatPercentage(repeatRate)} of customers are repeat buyers`,
        icon: '👥',
      });
    }

    return insights;
  };

  const exportData = () => {
    if (!data) {
      return null;
    }

    const exportData = {
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
    };

    return exportData;
  };

  return {
    data,
    isLoading,
    selectedTimeRange,
    timeRanges,
    categories,
    setSelectedTimeRange,
    formatCurrency,
    formatNumber,
    formatPercentage,
    getTrendDirection,
    getTrendPercentage,
    getCategoryLabel,
    getPerformanceInsights,
    exportData,
  };
}

export type { AnalyticsData, TimeRange };
