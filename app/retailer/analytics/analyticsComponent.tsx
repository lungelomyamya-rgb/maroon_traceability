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
      <div className="max-w-7xl mx-auto">
        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-3 mb-6">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-full sm:w-40 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 Days</SelectItem>
              <SelectItem value="30days">Last 30 Days</SelectItem>
              <SelectItem value="90days">Last 90 Days</SelectItem>
              <SelectItem value="1year">Last Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" className="w-full sm:w-auto">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">R{analytics.totalRevenue.toLocaleString()}</p>
                <div className="flex items-center mt-2">
                  {analytics && analytics.monthlyRevenue[6] && analytics.monthlyRevenue[5] ? (
                    <>
                      {getChangeIcon(analytics.monthlyRevenue[6].revenue, analytics.monthlyRevenue[5].revenue)}
                      <span className={`text-sm ml-1 ${getChangeColor(analytics.monthlyRevenue[6].revenue, analytics.monthlyRevenue[5].revenue)}`}>
                        {Math.abs(((analytics.monthlyRevenue[6].revenue - analytics.monthlyRevenue[5].revenue) / analytics.monthlyRevenue[5].revenue) * 100).toFixed(1)}%
                      </span>
                    </>
                  ) : (
                    <>
                      <TrendingUp className="h-4 w-4 text-gray-400" />
                      <span className="text-sm ml-1 text-gray-400">Loading...</span>
                    </>
                  )}
                </div>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <DollarSign className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.totalOrders}</p>
                <div className="flex items-center mt-2">
                  {getChangeIcon(analytics.monthlyRevenue[5].orders, analytics.monthlyRevenue[4].orders)}
                  <span className={`text-sm ml-1 ${getChangeColor(analytics.monthlyRevenue[5].orders, analytics.monthlyRevenue[4].orders)}`}>
                    {Math.abs(((analytics.monthlyRevenue[5].orders - analytics.monthlyRevenue[4].orders) / analytics.monthlyRevenue[4].orders) * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <ShoppingCart className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.conversionRate}%</p>
                <div className="flex items-center mt-2">
                  <Target className="h-4 w-4 text-purple-600" />
                  <span className="text-sm ml-1 text-purple-600">+0.3% vs last month</span>
                </div>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <Target className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Order Value</p>
                <p className="text-2xl font-bold text-gray-900">R{analytics.averageOrderValue.toFixed(2)}</p>
                <div className="flex items-center mt-2">
                  <ArrowUpRight className="h-4 w-4 text-green-600" />
                  <span className="text-sm ml-1 text-green-600">+5.2% vs last month</span>
                </div>
              </div>
              <div className="bg-orange-100 p-3 rounded-full">
                <TrendingUp className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Revenue Chart */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Revenue Trend</h3>
              <Select value={selectedMetric} onValueChange={setSelectedMetric}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="revenue">Revenue</SelectItem>
                  <SelectItem value="orders">Orders</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Debug Info */}
            <div className="mb-4 p-2 bg-gray-100 rounded text-xs">
              <div>Chart Data: {analytics.monthlyRevenue.length} months</div>
              <div>Selected Metric: {selectedMetric}</div>
              <div>Max Value: {Math.max(...analytics.monthlyRevenue.map(d => selectedMetric === 'revenue' ? d.revenue : d.orders))}</div>
            </div>
            
            <div className="h-80 bg-white rounded-lg border-2 border-gray-200 p-4 flex items-end justify-between gap-2">
              {analytics.monthlyRevenue.map((item, index) => {
                const maxValue = Math.max(...analytics.monthlyRevenue.map(d => selectedMetric === 'revenue' ? d.revenue : d.orders));
                const value = selectedMetric === 'revenue' ? item.revenue : item.orders;
                const height = maxValue > 0 ? (value / maxValue) * 100 : 15; // Increased minimum height for better visibility
                
                console.log(`Chart bar ${index}:`, {
                  month: item.month,
                  value: value,
                  height: height,
                  maxValue: maxValue
                });

                return (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div 
                      className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-lg transition-all duration-500 hover:from-blue-700 hover:to-blue-500 shadow-md"
                      style={{ height: `${Math.max(height, 15)}%`, minHeight: '60px' }} // Increased minimum height and fixed pixel height
                    />
                    <span className="text-xs text-gray-600 mt-2">{item.month}</span>
                    <span className="text-xs font-medium">
                      {selectedMetric === 'revenue' ? `R${(value / 1000).toFixed(1)}k` : value}
                    </span>
                  </div>
                );
              })}
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
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{product.name}</p>
                      <p className="text-xs text-gray-500">{product.views} views</p>
                    </div>
                  </div>
                  <div className="text-right">
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
