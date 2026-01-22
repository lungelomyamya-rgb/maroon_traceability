// src/app/packaging/reports/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/contexts/userContext';
import { DashboardLayout } from '@/components/dashboard/dashboardLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BarChart3, Download, Calendar, Filter, Search, Package, TrendingUp, AlertTriangle, PieChart, Activity, Clock, Eye } from 'lucide-react';

export default function ReportsPage() {
  const { currentUser } = useUser();
  const router = useRouter();
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Redirect if user doesn't have packaging role (with delay for context update)
    const timer = setTimeout(() => {
      if (currentUser?.role !== 'packaging') {
        console.log('Reports page - redirecting to unauthorized. Current user:', currentUser);
        router.push('/unauthorized');
        return;
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [currentUser, router]);

  if (!currentUser || currentUser.role !== 'packaging') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Mock reports data
  const reportsData = [
    {
      id: 'rpt1',
      title: 'Daily Packaging Summary',
      period: '2025-01-20',
      totalBatches: 15,
      completedBatches: 12,
      pendingQC: 3,
      totalQRs: 45,
      efficiency: 80
    },
    {
      id: 'rpt2',
      title: 'Weekly Performance',
      period: '2025-01-14 to 2025-01-20',
      totalBatches: 85,
      completedBatches: 78,
      pendingQC: 7,
      totalQRs: 234,
      efficiency: 91.8
    },
    {
      id: 'rpt3',
      title: 'Monthly Overview',
      period: 'January 2025',
      totalBatches: 320,
      completedBatches: 295,
      pendingQC: 25,
      totalQRs: 890,
      efficiency: 92.2
    }
  ];

  // Mock analytics data
  const packagingTypeData = [
    { name: 'Cardboard Box', value: 45, color: 'bg-blue-500' },
    { name: 'Vacuum Sealed', value: 25, color: 'bg-green-500' },
    { name: 'Bulk Bag', value: 15, color: 'bg-yellow-500' },
    { name: 'Plastic Crate', value: 10, color: 'bg-purple-500' },
    { name: 'Others', value: 5, color: 'bg-gray-500' }
  ];

  const efficiencyTrend = [
    { day: 'Mon', efficiency: 85 },
    { day: 'Tue', efficiency: 88 },
    { day: 'Wed', efficiency: 92 },
    { day: 'Thu', efficiency: 87 },
    { day: 'Fri', efficiency: 91 },
    { day: 'Sat', efficiency: 94 },
    { day: 'Sun', efficiency: 89 }
  ];

  const topProducts = [
    { name: 'Organic Apples Premium', batches: 45, efficiency: 95 },
    { name: 'Fresh Pears Vacuum Sealed', batches: 32, efficiency: 88 },
    { name: 'Mixed Citrus Bulk', batches: 28, efficiency: 92 },
    { name: 'Premium Tomatoes', batches: 22, efficiency: 85 },
    { name: 'Exotic Mangoes', batches: 18, efficiency: 90 }
  ];

  const recentActivities = [
    {
      id: 'act1',
      type: 'batch_completed',
      description: 'Batch BATCH-2024-CAR-STL-ABC completed',
      timestamp: '2025-01-20T10:30:00Z',
      user: 'John Smith'
    },
    {
      id: 'act2',
      type: 'qr_generated',
      description: '25 QR codes generated for Fresh Pears',
      timestamp: '2025-01-20T09:15:00Z',
      user: 'Maria Chen'
    },
    {
      id: 'act3',
      type: 'low_stock_alert',
      description: 'Mixed Citrus Bulk running low',
      timestamp: '2025-01-20T08:45:00Z',
      user: 'System'
    }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'batch_completed': return <Package className="h-4 w-4" />;
      case 'qr_generated': return <Download className="h-4 w-4" />;
      case 'low_stock_alert': return <AlertTriangle className="h-4 w-4" />;
      default: return <Calendar className="h-4 w-4" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'batch_completed': return 'bg-green-100 text-green-800';
      case 'qr_generated': return 'bg-blue-100 text-blue-800';
      case 'low_stock_alert': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <>
      {/* Back Button Above DashboardLayout */}
      <div className="px-4 sm:px-6 lg:px-8 pt-4">
        <Button
          variant="outline"
          onClick={() => router.push('/packaging')}
          className="inline-flex items-center gap-2 text-sm"
        >
          Back
        </Button>
      </div>
      
      <DashboardLayout
        title="Packaging Reports"
        description="View analytics and packaging performance reports"
      >
        <div className="space-y-6">
          {/* Report Period Selection */}
          <Card className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Report Period</h3>
                <p className="text-sm text-gray-500">Select time period for reports</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500 w-full sm:w-auto"
                >
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                  <option value="quarter">This Quarter</option>
                  <option value="year">This Year</option>
                </select>
                <Button variant="outline" className="w-full sm:w-auto">
                  <Filter className="h-4 w-4 mr-2" />
                  Custom Range
                </Button>
                <Button className="bg-orange-600 hover:bg-orange-700 text-white w-full sm:w-auto">
                  <Download className="h-4 w-4 mr-2" />
                  Export Report
                </Button>
              </div>
            </div>
          </Card>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Batches</p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900">
                    {selectedPeriod === 'week' ? '85' : selectedPeriod === 'month' ? '320' : '15'}
                  </p>
                </div>
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Package className="h-5 w-5 text-blue-600" />
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-xl sm:text-2xl font-bold text-green-600">
                    {selectedPeriod === 'week' ? '78' : selectedPeriod === 'month' ? '295' : '12'}
                  </p>
                </div>
                <div className="p-2 bg-green-100 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending QC</p>
                  <p className="text-xl sm:text-2xl font-bold text-yellow-600">
                    {selectedPeriod === 'week' ? '7' : selectedPeriod === 'month' ? '25' : '3'}
                  </p>
                </div>
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-yellow-600" />
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Efficiency</p>
                  <p className="text-xl sm:text-2xl font-bold text-purple-600">
                    {selectedPeriod === 'week' ? '91.8%' : selectedPeriod === 'month' ? '92.2%' : '80%'}
                  </p>
                </div>
                <div className="p-2 bg-purple-100 rounded-lg">
                  <BarChart3 className="h-5 w-5 text-purple-600" />
                </div>
              </div>
            </Card>
          </div>

          {/* Packaging Type Distribution */}
          <Card className="p-4 sm:p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Packaging Type Distribution</h3>
                <p className="text-sm text-gray-500">Most used packaging types this period</p>
              </div>
              <PieChart className="h-5 w-5 text-gray-400" />
            </div>
            <div className="space-y-3 sm:space-y-4">
              {packagingTypeData.map((type, index) => (
                <div key={index} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full ${type.color}`}></div>
                    <div className="flex-1 min-w-0">
                      <span className="font-medium text-sm sm:text-base">{type.name}</span>
                      <p className="text-xs text-gray-500 hidden sm:block">Packaging type</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-16 sm:w-20 bg-gray-200 rounded-full h-2 sm:h-3">
                      <div 
                        className={`h-2 sm:h-3 rounded-full ${type.color}`}
                        style={{ width: `${type.value}%` }}
                      ></div>
                    </div>
                    <span className="text-sm sm:text-base font-bold text-gray-900 w-12 sm:w-16 text-right">{type.value}%</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Efficiency Trend */}
          <Card className="p-4 sm:p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Weekly Efficiency Trend</h3>
                <p className="text-sm text-gray-500">Packaging efficiency over the week</p>
              </div>
              <TrendingUp className="h-5 w-5 text-gray-400" />
            </div>
            <div className="space-y-3 sm:space-y-4">
              {efficiencyTrend.map((day, index) => (
                <div key={index} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <span className="text-sm sm:text-base font-medium w-12 sm:w-16 text-gray-600">{day.day}</span>
                  <div className="flex items-center gap-2 flex-1">
                    <div className="w-full sm:w-32 bg-gray-200 rounded-full h-2 sm:h-3">
                      <div 
                        className={`h-2 sm:h-3 rounded-full ${
                          day.efficiency >= 90 ? 'bg-green-500' : 
                          day.efficiency >= 80 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${day.efficiency}%` }}
                      ></div>
                    </div>
                    <span className="text-sm sm:text-base font-bold text-gray-900 w-12 sm:w-16 text-right">{day.efficiency}%</span>
                  </div>
                  <div className="sm:hidden text-xs text-gray-500">
                    {day.efficiency >= 90 ? 'Excellent' : 
                     day.efficiency >= 80 ? 'Good' : 'Needs Improvement'}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Top Products */}
          <Card className="p-4 sm:p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Top Products</h3>
                <p className="text-sm text-gray-500">Highest performing products this period</p>
              </div>
              <Activity className="h-5 w-5 text-gray-400" />
            </div>
            <div className="space-y-4 sm:space-y-6">
              {topProducts.map((product, index) => (
                <div key={index} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-white border-2 border-gray-200 rounded-xl hover:border-purple-300 hover:shadow-lg transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-12 lg:w-14 lg:h-16 bg-orange-100 rounded-full flex items-center justify-center text-sm sm:text-base lg:text-lg font-bold text-orange-600">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div>
                        <h4 className="font-bold text-gray-900 text-xs sm:text-sm lg:text-base">{product.name}</h4>
                        <p className="text-xs sm:text-xs lg:text-sm text-gray-500">{product.batches} batches</p>
                      </div>
                    </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1">
                      <span className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-green-600">{product.efficiency}%</span>
                      <span className="text-xs sm:text-sm lg:text-base text-gray-500">efficiency</span>
                    </div>
                  </div>
                </div>
                  <div className="flex gap-2 mt-3 sm:mt-4">
                    <Button variant="outline" size="sm" className="flex-1 text-xs sm:text-sm">
                      <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                      <span className="hidden sm:inline">View Details</span>
                      <span className="sm:hidden">View</span>
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1 text-xs sm:text-sm">
                      <Package className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                      <span className="hidden sm:inline">Batch Report</span>
                      <span className="sm:hidden">Batch</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Detailed Reports Table */}
          <Card className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Detailed Reports</h3>
                <p className="text-sm text-gray-500">Comprehensive packaging analytics</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search reports..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
                <Button variant="outline" className="w-full sm:w-auto">
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Report Title</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Period</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Batches</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Completed</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pending QC</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">QR Codes</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Efficiency</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {reportsData.map((report) => (
                    <tr key={report.id} className="hover:bg-gray-50">
                      <td className="px-2 sm:px-4 py-3 text-xs sm:text-xs lg:text-sm font-medium text-gray-900">{report.title}</td>
                      <td className="px-2 sm:px-4 py-3 text-sm text-gray-600">{report.period}</td>
                      <td className="px-2 sm:px-4 py-3 text-sm text-gray-900">{report.totalBatches}</td>
                      <td className="px-2 sm:px-4 py-3 text-sm text-green-600">{report.completedBatches}</td>
                      <td className="px-2 sm:px-4 py-3 text-sm text-yellow-600">{report.pendingQC}</td>
                      <td className="px-2 sm:px-4 py-3 text-sm text-blue-600">{report.totalQRs}</td>
                      <td className="px-2 sm:px-4 py-3 text-sm text-purple-600">{report.efficiency}%</td>
                      <td className="px-2 sm:px-4 py-3 text-sm text-left">
                        <Button variant="outline" size="sm" className="w-full sm:w-auto">
                          <Download className="h-3 w-3 mr-1" />
                          Download
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Recent Activities */}
          <Card className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Recent Activities</h3>
                <p className="text-sm text-gray-500">Latest packaging system activities</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="w-full sm:w-auto">
                  <Clock className="h-4 w-4 mr-2" />
                  Activity Log
                </Button>
                <Button variant="outline" className="w-full sm:w-auto">
                  View All Activities
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="p-2 bg-gray-100 rounded-full">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1">
                    <p className="text-xs sm:text-xs lg:text-sm font-medium text-gray-900">{activity.description}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(activity.timestamp).toLocaleString()} • {activity.user}
                    </p>
                  </div>
                  <Badge className={getActivityColor(activity.type)}>
                    {activity.type.replace('_', ' ').charAt(0).toUpperCase() + activity.type.slice(1).replace('_', ' ')}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>

          {/* Quick Actions */}
          <Card className="p-4 sm:p-6 bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Quick Actions</h3>
              <p className="text-sm text-gray-600 mb-6">Generate common reports and exports</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <Button variant="outline" className="h-auto p-3 flex-col gap-2">
                  <Download className="h-5 w-5" />
                  <span className="text-sm">Daily Summary</span>
                </Button>
                <Button variant="outline" className="h-auto p-3 flex-col gap-2">
                  <BarChart3 className="h-5 w-5" />
                  <span className="text-sm">Analytics</span>
                </Button>
                <Button variant="outline" className="h-auto p-3 flex-col gap-2">
                  <Package className="h-5 w-5" />
                  <span className="text-sm">Batch Report</span>
                </Button>
                <Button variant="outline" className="h-auto p-3 flex-col gap-2">
                  <Calendar className="h-5 w-5" />
                  <span className="text-sm">Schedule Report</span>
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </DashboardLayout>
    </>
  );
}
