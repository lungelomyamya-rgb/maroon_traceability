// src/app/inspector/reports/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/contexts/userContext';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Download, 
  Calendar,
  TrendingUp,
  BarChart3,
  PieChart,
  Filter,
  Search,
  Eye,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

export default function InspectorReportsPage() {
  const { currentUser } = useUser();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  const [reportType, setReportType] = useState('all');

  useEffect(() => {
    // Redirect if user doesn't have inspector role
    if (currentUser?.role !== 'inspector') {
      router.push('/unauthorized');
      return;
    }
  }, [currentUser, router]);

  if (!currentUser || currentUser.role !== 'inspector') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div>
      </div>
    );
  }

  // Mock data for reports
  const mockReports = [
    {
      id: 'rpt1',
      title: 'Monthly Quality Summary - January 2025',
      type: 'summary',
      generatedAt: '2025-01-31T16:00:00Z',
      period: '2025-01-01 to 2025-01-31',
      inspectionsCount: 45,
      averageGrade: 'B+',
      status: 'completed',
      downloadUrl: '/reports/monthly-summary-jan-2025.pdf'
    },
    {
      id: 'rpt2',
      title: 'SGS Verification Report - Q1 2025',
      type: 'verification',
      generatedAt: '2025-01-30T10:30:00Z',
      period: '2025-01-01 to 2025-03-31',
      inspectionsCount: 12,
      verificationProvider: 'SGS',
      status: 'completed',
      downloadUrl: '/reports/sgs-verification-q1-2025.pdf'
    },
    {
      id: 'rpt3',
      title: 'Quality Trends Analysis - 2024',
      type: 'trends',
      generatedAt: '2025-01-15T14:20:00Z',
      period: '2024-01-01 to 2024-12-31',
      inspectionsCount: 523,
      trendDirection: 'improving',
      status: 'completed',
      downloadUrl: '/reports/quality-trends-2024.pdf'
    },
    {
      id: 'rpt4',
      title: 'Defect Analysis Report - December 2024',
      type: 'defects',
      generatedAt: '2025-01-05T09:15:00Z',
      period: '2024-12-01 to 2024-12-31',
      commonDefects: ['Bruising', 'Color variation', 'Size inconsistency'],
      status: 'completed',
      downloadUrl: '/reports/defect-analysis-dec-2024.pdf'
    },
    {
      id: 'rpt5',
      title: 'Weekly Inspection Performance - Week 4',
      type: 'performance',
      generatedAt: '2025-01-28T17:45:00Z',
      period: '2025-01-22 to 2025-01-28',
      inspectionsCount: 15,
      completionRate: '93%',
      status: 'completed',
      downloadUrl: '/reports/weekly-performance-w4-2025.pdf'
    }
  ];

  const filteredReports = mockReports.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = reportType === 'all' || report.type === reportType;
    return matchesSearch && matchesType;
  });

  const getReportTypeColor = (type: string) => {
    const colors = {
      summary: 'bg-blue-100 text-blue-800',
      verification: 'bg-green-100 text-green-800',
      trends: 'bg-purple-100 text-purple-800',
      defects: 'bg-orange-100 text-orange-800',
      performance: 'bg-indigo-100 text-indigo-800'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getReportTypeIcon = (type: string) => {
    const icons = {
      summary: <BarChart3 className="h-4 w-4" />,
      verification: <CheckCircle className="h-4 w-4" />,
      trends: <TrendingUp className="h-4 w-4" />,
      defects: <AlertTriangle className="h-4 w-4" />,
      performance: <PieChart className="h-4 w-4" />
    };
    return icons[type as keyof typeof icons] || <FileText className="h-4 w-4" />;
  };

  const reportTypeCounts = {
    total: mockReports.length,
    summary: mockReports.filter(r => r.type === 'summary').length,
    verification: mockReports.filter(r => r.type === 'verification').length,
    trends: mockReports.filter(r => r.type === 'trends').length,
    defects: mockReports.filter(r => r.type === 'defects').length,
    performance: mockReports.filter(r => r.type === 'performance').length
  };

  return (
    <DashboardLayout
      title="Inspection Reports"
      description="View and download quality inspection reports and analytics"
    >
      <div className="space-y-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{reportTypeCounts.total}</p>
              </div>
              <div className="p-2 bg-gray-100 rounded-lg">
                <FileText className="h-5 w-5 text-gray-600" />
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Summary</p>
                <p className="text-2xl font-bold text-blue-600">{reportTypeCounts.summary}</p>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <BarChart3 className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Verification</p>
                <p className="text-2xl font-bold text-green-600">{reportTypeCounts.verification}</p>
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Trends</p>
                <p className="text-2xl font-bold text-purple-600">{reportTypeCounts.trends}</p>
              </div>
              <div className="p-2 bg-purple-100 rounded-lg">
                <TrendingUp className="h-5 w-5 text-purple-600" />
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Defects</p>
                <p className="text-2xl font-bold text-orange-600">{reportTypeCounts.defects}</p>
              </div>
              <div className="p-2 bg-orange-100 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* Generate Reports Section */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Generate New Report</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button className="h-auto p-4 flex flex-col items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white">
              <BarChart3 className="h-6 w-6" />
              <div className="text-center">
                <div className="font-medium">Summary Report</div>
                <div className="text-xs opacity-90">Monthly/Quarterly overview</div>
              </div>
            </Button>
            
            <Button className="h-auto p-4 flex flex-col items-center gap-2 bg-green-600 hover:bg-green-700 text-white">
              <CheckCircle className="h-6 w-6" />
              <div className="text-center">
                <div className="font-medium">Verification Report</div>
                <div className="text-xs opacity-90">Third-party verifications</div>
              </div>
            </Button>
            
            <Button className="h-auto p-4 flex flex-col items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white">
              <TrendingUp className="h-6 w-6" />
              <div className="text-center">
                <div className="font-medium">Trends Analysis</div>
                <div className="text-xs opacity-90">Quality trends over time</div>
              </div>
            </Button>
          </div>
        </Card>

        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:border-purple-500 focus:ring-purple-500"
            >
              <option value="all">All Types</option>
              <option value="summary">Summary</option>
              <option value="verification">Verification</option>
              <option value="trends">Trends</option>
              <option value="defects">Defects</option>
              <option value="performance">Performance</option>
            </select>

            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:border-purple-500 focus:ring-purple-500"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
            </select>
          </div>

          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search reports..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-4 py-2 border border-gray-300 rounded-md focus:border-purple-500 focus:ring-purple-500 w-full"
            />
          </div>
        </div>

        {/* Reports List */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Available Reports</h3>
          
          {filteredReports.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No reports found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredReports.map((report) => (
                <div key={report.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        {getReportTypeIcon(report.type)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-gray-900">{report.title}</h4>
                          <Badge className={getReportTypeColor(report.type)}>
                            {report.type}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-500 mb-1">
                          Period: {report.period}
                        </p>
                        <p className="text-sm text-gray-500">
                          Generated: {new Date(report.generatedAt).toLocaleDateString()}
                        </p>
                        {report.inspectionsCount && (
                          <p className="text-sm text-gray-600 mt-1">
                            {report.inspectionsCount} inspections included
                          </p>
                        )}
                        {report.commonDefects && (
                          <p className="text-sm text-gray-600 mt-1">
                            Common defects: {report.commonDefects.join(', ')}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            // View report logic
                            console.log('View report:', report.id);
                          }}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700 text-white"
                          onClick={() => {
                            // Download report logic
                            console.log('Download report:', report.id);
                            window.open(report.downloadUrl, '_blank');
                          }}
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                      </div>
                      
                      <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
                        <Calendar className="h-3 w-3" />
                        PDF Format
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
}
