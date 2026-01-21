// src/app/retailer/analytics/analyticsComponent.tsx
'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Users,
  Eye,
  Download,
  Calendar,
  BarChart3,
  PieChart,
  Target,
  ArrowUpRight,
  ArrowDownRight,
  Package,
  Star,
  Clock,
  Filter
} from 'lucide-react';

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

export default function AnalyticsComponent() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30days');
  const [selectedMetric, setSelectedMetric] = useState('revenue');

  // Add error boundary and logging
  useEffect(() => {
    try {
      // Mock comprehensive analytics data
      const mockAnalytics: AnalyticsData = {
        totalRevenue: 156789.45,
        totalOrders: 847,
        averageOrderValue: 185.12,
        conversionRate: 3.8,
        totalProducts: 24,
        activeProducts: 18,
        lowStockProducts: 3,
        pendingOrders: 12,
        monthlyRevenue: [
          { month: 'Aug', revenue: 22000, orders: 125 },
          { month: 'Sep', revenue: 28000, orders: 156 },
          { month: 'Oct', revenue: 35000, orders: 198 },
          { month: 'Nov', revenue: 42000, orders: 234 },
          { month: 'Dec', revenue: 51000, orders: 289 },
          { month: 'Jan', revenue: 38789, orders: 220 }
        ],
        topProducts: [
          { 
            productId: 'prod1', 
            name: 'Premium Organic Moringa Powder', 
            sales: 542, 
            revenue: 48789.58,
            views: 3420 
          },
          { 
            productId: 'prod2', 
            name: 'Moringa Tea Bags', 
            sales: 289, 
            revenue: 13005.00,
            views: 1890 
          },
          { 
            productId: 'prod3', 
            name: 'Moringa Capsules', 
            sales: 234, 
            revenue: 15210.00,
            views: 1560 
          },
          { 
            productId: 'prod4', 
            name: 'Organic Moringa Oil', 
            sales: 156, 
            revenue: 23400.00,
            views: 1230 
          },
          { 
            productId: 'prod5', 
            name: 'Moringa Seeds', 
            sales: 98, 
            revenue: 7840.00,
            views: 890 
          }
        ],
        customerMetrics: {
          totalCustomers: 523,
          repeatCustomers: 189,
          newCustomers: 67,
          averageRating: 4.6
        },
        salesByCategory: [
          { category: 'Powders', revenue: 48789.58, percentage: 31.1 },
          { category: 'Teas', revenue: 13005.00, percentage: 8.3 },
          { category: 'Supplements', revenue: 15210.00, percentage: 9.7 },
          { category: 'Oils', revenue: 23400.00, percentage: 14.9 },
          { category: 'Seeds', revenue: 7840.00, percentage: 5.0 },
          { category: 'Fresh', revenue: 32145.87, percentage: 20.5 },
          { category: 'Other', revenue: 16399.00, percentage: 10.5 }
        ],
        recentPerformance: [
          { date: '2025-01-18', revenue: 2456.78, orders: 14 },
          { date: '2025-01-17', revenue: 3124.56, orders: 18 },
          { date: '2025-01-16', revenue: 2890.34, orders: 16 },
          { date: '2025-01-15', revenue: 1987.23, orders: 11 },
          { date: '2025-01-14', revenue: 3567.89, orders: 21 },
          { date: '2025-01-13', revenue: 2234.67, orders: 13 }
        ]
      };

      console.log('Analytics data loaded:', mockAnalytics);
      setAnalytics(mockAnalytics);
      setLoading(false);
    } catch (error) {
      console.error('Error loading analytics:', error);
      setLoading(false);
    }
  }, []);

  const getChangeIcon = (current: number, previous: number) => {
    return current > previous ? 
      <TrendingUp className="h-4 w-4 text-green-600" /> : 
      <TrendingDown className="h-4 w-4 text-red-600" />;
  };

  const getChangeColor = (current: number, previous: number) => {
    return current > previous ? 'text-green-600' : 'text-red-600';
  };

  if (!analytics || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
              <p className="text-gray-600 mt-4">Loading analytics data...</p>
            </>
          ) : (
            <>
              <p className="text-gray-600">Unable to load analytics data</p>
              <Button onClick={() => window.location.reload()} className="mt-4">
                Try Again
              </Button>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-6xl sm:max-w-7xl mx-auto">
        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-3 mb-6 lg:mb-8">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-full sm:w-40 lg:w-48 lg:text-base">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 Days</SelectItem>
              <SelectItem value="30days">Last 30 Days</SelectItem>
              <SelectItem value="90days">Last 90 Days</SelectItem>
              <SelectItem value="1year">Last Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" className="w-full sm:w-auto lg:text-base">
            <Download className="h-4 w-4 lg:h-5 lg:w-5 mr-2" />
            Export Report
          </Button>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <Card className="p-4 sm:p-6 lg:p-8 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-600 lg:text-base">Total Revenue</p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 break-words">R{analytics.totalRevenue.toLocaleString()}</p>
              </div>
              <div className="p-2 sm:p-3 lg:p-4 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </div>
            </div>
          </Card>

          <Card className="p-4 sm:p-6 lg:p-8 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 lg:text-base">Total Orders</p>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">{analytics.totalOrders}</p>
              </div>
              <div className="p-2 sm:p-3 lg:p-4 bg-blue-100 rounded-lg">
                <ShoppingCart className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
              </div>
            </div>
          </Card>

          <Card className="p-4 sm:p-6 lg:p-8 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 lg:text-base">Average Order Value</p>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">R{analytics.averageOrderValue.toFixed(2)}</p>
              </div>
              <div className="p-2 sm:p-3 lg:p-4 bg-purple-100 rounded-lg">
                <Target className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
              </div>
            </div>
          </Card>

          <Card className="p-4 sm:p-6 lg:p-8 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 lg:text-base">Conversion Rate</p>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">{analytics.conversionRate.toFixed(1)}%</p>
              </div>
              <div className="p-2 sm:p-3 lg:p-4 bg-orange-100 rounded-lg">
                <BarChart3 className="h-5 w-5 sm:h-6 sm:w-6 text-orange-600" />
              </div>
            </div>
          </Card>

          <Card className="p-4 sm:p-6 lg:p-8 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 lg:text-base">Active Products</p>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">{analytics.activeProducts}</p>
              </div>
              <div className="p-2 sm:p-3 lg:p-4 bg-indigo-100 rounded-lg">
                <Package className="h-5 w-5 sm:h-6 sm:w-6 text-indigo-600" />
              </div>
            </div>
          </Card>

          <Card className="p-4 sm:p-6 lg:p-8 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 lg:text-base">Low Stock Products</p>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">{analytics.lowStockProducts}</p>
              </div>
              <div className="p-2 sm:p-3 lg:p-4 bg-red-100 rounded-lg">
                <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-red-600" />
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Revenue Chart */}
          <Card className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <h3 className="text-lg font-semibold">Revenue Trend</h3>
              <Select value={selectedMetric} onValueChange={setSelectedMetric}>
                <SelectTrigger className="w-full sm:w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="revenue">Revenue</SelectItem>
                  <SelectItem value="orders">Orders</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Debug Info */}
            <div className="mb-4 p-2 bg-gray-100 rounded text-xs hidden">
              <div>Chart Data: {analytics.monthlyRevenue.length} months</div>
              <div>Selected Metric: {selectedMetric}</div>
              <div>Max Value: {Math.max(...analytics.monthlyRevenue.map(d => selectedMetric === 'revenue' ? d.revenue : d.orders))}</div>
            </div>
            
            <div className="h-32 sm:h-48 md:h-64 lg:h-80 bg-white rounded-xl border-2 border-slate-200 p-3 sm:p-4 md:p-6 relative overflow-hidden">
              {/* Simple Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-slate-100 opacity-20"></div>
              
              {/* Simple Grid Lines */}
              <div className="absolute inset-0 pointer-events-none">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-full h-px bg-slate-200/20"
                    style={{ 
                      bottom: `${i * 20}%`,
                      left: 0,
                      right: 0
                    }}
                  />
                ))}
              </div>
              
              {/* Chart Bars */}
              <div className="relative h-full flex items-end gap-1 sm:gap-2 z-10">
                {analytics.monthlyRevenue.map((item, index) => {
                  const maxValue = Math.max(...analytics.monthlyRevenue.map(d => selectedMetric === 'revenue' ? d.revenue : d.orders));
                  const value = selectedMetric === 'revenue' ? item.revenue : item.orders;
                  const heightPercentage = maxValue > 0 ? (value / maxValue) * 100 : 20;
                  const isHighest = value === maxValue;
                  
                  console.log(`Bar ${index}:`, {
                    month: item.month,
                    value: value,
                    heightPercentage: heightPercentage,
                    maxValue: maxValue,
                    isHighest: isHighest
                  });
                  
                  return (
                    <div key={index} className="relative flex-1 flex flex-col items-center justify-end group">
                      {/* Simple Tooltip */}
                      <div className="absolute -top-16 sm:-top-20 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 pointer-events-none">
                        <div className="bg-slate-900 text-white p-2 rounded-lg shadow-xl border border-slate-700 min-w-[100px] sm:min-w-[120px]">
                          <div className="text-xs font-medium text-slate-300 mb-1">{item.month}</div>
                          <div className="text-xs sm:text-sm font-bold text-white">{selectedMetric === 'revenue' ? `R${(value / 1000).toFixed(1)}k` : value}</div>
                          {selectedMetric === 'revenue' && (
                            <div className="text-xs text-slate-400 mt-1 hidden sm:block">R{((value / 1000).toFixed(0))}k</div>
                          )}
                        </div>
                      </div>
                      
                      {/* Modern Bar - Using CSS Classes for Better Color Control */}
                      <div 
                        className={`w-full rounded-t-lg transition-all duration-500 ease-out transform hover:scale-105 cursor-pointer ${
                          isHighest ? 'chart-bar-highest' : 'chart-bar'
                        }`}
                        style={{ 
                          height: `${Math.max(heightPercentage, 30)}%`
                        }}
                      >
                        {/* Simple Shine Effect */}
                        <div className="absolute inset-0 rounded-t-lg bg-gradient-to-t from-white/20 via-transparent to-transparent opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
                      </div>
                      
                      {/* Labels */}
                      <div className="mt-1 sm:mt-2 text-center">
                        <div className="text-xs font-semibold text-slate-700 group-hover:text-blue-700 transition-colors duration-200">{item.month}</div>
                        <div className="text-xs font-bold text-slate-800 group-hover:text-blue-600 transition-colors duration-200 hidden sm:block">
                          {selectedMetric === 'revenue' ? `R${(value / 1000).toFixed(1)}k` : value}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </Card>

          {/* Sales by Category */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-6">Sales by Category</h3>
            <div className="space-y-3">
              {analytics.salesByCategory.map((category, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-blue-600 rounded"></div>
                    <span className="text-sm font-medium">{category.category}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">R{category.revenue.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">{category.percentage}%</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Top Products */}
          <Card className="p-6 lg:col-span-2">
            <h3 className="text-lg font-semibold mb-6">Top Performing Products</h3>
            <div className="space-y-4">
              {analytics.topProducts.map((product, index) => (
                <div key={product.productId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-4 min-w-0 flex-1">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{product.name}</p>
                      <p className="text-xs text-gray-500">{product.views} views</p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-medium">{product.sales} sold</p>
                    <p className="text-sm font-bold text-green-600">R{product.revenue.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Customer Metrics */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-6">Customer Metrics</h3>
            <div className="space-y-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-blue-600">{analytics.customerMetrics.totalCustomers}</p>
                <p className="text-sm text-blue-600">Total Customers</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-green-600">{analytics.customerMetrics.repeatCustomers}</p>
                <p className="text-sm text-green-600">Repeat Customers</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <Star className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-purple-600">{analytics.customerMetrics.averageRating.toFixed(1)}</p>
                <p className="text-sm text-purple-600">Average Rating</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Recent Performance */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-6">Recent Performance</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {analytics.recentPerformance.map((day, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">{new Date(day.date).toLocaleDateString()}</span>
                  <Badge className="bg-green-100 text-green-800">
                    {day.orders} orders
                  </Badge>
                </div>
                <p className="text-lg font-bold text-gray-900">R{day.revenue.toLocaleString()}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
