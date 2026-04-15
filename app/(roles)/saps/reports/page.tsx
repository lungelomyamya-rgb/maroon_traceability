'use client';

import { 
  Filter,
  AlertTriangle, 
  CheckCircle, 
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { useUser } from '@/contexts/userContext';
import { Button } from '@/src/features/shared/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/features/shared/ui/card';
import { Input } from '@/src/features/shared/ui/input';
import { Label } from '@/src/features/shared/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/src/features/shared/ui/select';
import { DataTable } from '@/src/features/shared/ui/table';


export default function SAPSReportsPage() {
  const router = useRouter();
  const { currentUser } = useUser();
  const [isChecking, setIsChecking] = useState(true);
  const [dateRange, setDateRange] = useState('30');
  const [reportType, setReportType] = useState('all');

  useEffect(() => {
    const checkAuth = () => {
      setIsChecking(false);

      // If user is not logged in, redirect to login
      if (!currentUser) {
        router.replace('/login?redirect=/saps/reports');
        return;
      }
      // If user is logged in but not SAPS, redirect to unauthorized
      if (currentUser.role && !['saps'].includes(currentUser.role)) {
        router.replace('/unauthorized');
        return;
      }
    };

    // Add a small delay to prevent flickering
    const timeoutId = setTimeout(checkAuth, 100);

    return () => clearTimeout(timeoutId);
  }, [currentUser, router]);

  // Show loading while checking authentication
  if (isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (!currentUser || currentUser.role !== 'saps') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Redirecting...</p>
        </div>
      </div>
    );
  }

  const theftReports = [
    {
      id: 'THEFT-2024-045',
      date: '2024-01-15',
      location: 'Eastern Cape',
      livestock: 'Cattle (5 head)',
      farmer: 'John Farmer',
      status: 'active',
      value: 'R75,000',
      officer: 'Constable Mthembu',
    },
    {
      id: 'THEFT-2024-044',
      date: '2024-01-14',
      location: 'Free State',
      livestock: 'Sheep (12 head)',
      farmer: 'Sarah Shepherd',
      status: 'active',
      value: 'R24,000',
      officer: 'Sergeant Nkosi',
    },
    {
      id: 'THEFT-2024-043',
      date: '2024-01-13',
      location: 'KwaZulu-Natal',
      livestock: 'Goats (8 head)',
      farmer: 'Mike Goat',
      status: 'recovered',
      value: 'R16,000',
      officer: 'Constable Zulu',
    },
    {
      id: 'THEFT-2024-042',
      date: '2024-01-12',
      location: 'Gauteng',
      livestock: 'Pigs (15 head)',
      farmer: 'Peter Pig',
      status: 'investigating',
      value: 'R45,000',
      officer: 'Sergeant Molefe',
    },
  ];

  const inspectionReports = [
    {
      id: 'INS-2024-001',
      date: '2024-01-15',
      location: 'N3 Highway',
      livestock: 'Cattle (12 head)',
      status: 'verified',
      officer: 'Constable Mthembu',
    },
    {
      id: 'INS-2024-002',
      date: '2024-01-15',
      location: 'R61 Highway',
      livestock: 'Sheep (45 head)',
      status: 'flagged',
      officer: 'Sergeant Nkosi',
    },
    {
      id: 'INS-2024-003',
      date: '2024-01-14',
      location: 'N2 Highway',
      livestock: 'Goats (28 head)',
      status: 'verified',
      officer: 'Constable Zulu',
    },
  ];

  
  return (
    <DashboardLayout
      description="View and manage theft incident reports and inspection logs"
    >
      <div className="space-y-6">
        {/* Back Button */}
        <div className="mb-4">
          <Button variant="outline" onClick={() => router.push('/saps')} className="inline-flex items-center gap-2">
            Back
          </Button>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-center">
              <Filter className="w-5 h-5 mr-2" />
              Report Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date-range">Date Range</Label>
                <Select value={dateRange} onValueChange={setDateRange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7">Last 7 days</SelectItem>
                    <SelectItem value="30">Last 30 days</SelectItem>
                    <SelectItem value="90">Last 3 months</SelectItem>
                    <SelectItem value="365">Last year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="report-type">Report Type</Label>
                <Select value={reportType} onValueChange={setReportType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Reports</SelectItem>
                    <SelectItem value="theft">Theft Cases</SelectItem>
                    <SelectItem value="inspection">Inspections</SelectItem>
                    <SelectItem value="recovery">Recoveries</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input id="location" placeholder="Filter by province/district" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="All statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="recovered">Recovered</SelectItem>
                    <SelectItem value="investigating">Investigating</SelectItem>
                    <SelectItem value="verified">Verified</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Theft Reports */}
        {(reportType === 'all' || reportType === 'theft') && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 mr-2 text-red-600" />
                Theft Cases
              </CardTitle>
              <CardDescription>
                Active theft cases and recovery status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable
                data={theftReports}
                columns={[
                  { header: 'Report ID', key: 'id', label: 'Report ID', accessor: (row: unknown) => (row as { id: string }).id },
                  { header: 'Date', key: 'date', label: 'Date', accessor: (row: unknown) => (row as { date: string }).date },
                  { header: 'Location', key: 'location', label: 'Location', accessor: (row: unknown) => (row as { location: string }).location },
                  { header: 'Livestock', key: 'livestock', label: 'Livestock', accessor: (row: unknown) => (row as { livestock: string }).livestock },
                  { header: 'Farmer', key: 'farmer', label: 'Farmer', accessor: (row: unknown) => (row as { farmer: string }).farmer },
                  { header: 'Status', key: 'status', label: 'Status', accessor: (row: unknown) => (row as { status: string }).status },
                  { header: 'Value', key: 'value', label: 'Value', accessor: (row: unknown) => (row as { value: string }).value },
                  { header: 'Officer', key: 'officer', label: 'Officer', accessor: (row: unknown) => (row as { officer: string }).officer },
                ]}
                onRowClick={(row) => console.log('View report:', (row as { id: string }).id)}
              />
            </CardContent>
          </Card>
        )}

        {/* Inspection Reports */}
        {(reportType === 'all' || reportType === 'inspection') && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-center">
                <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                Inspection Reports
              </CardTitle>
              <CardDescription>
                Roadside inspection logs and verification records
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable
                data={inspectionReports}
                columns={[
                  { header: 'Inspection ID', key: 'id', label: 'Inspection ID', accessor: (row: unknown) => (row as { id: string }).id },
                  { header: 'Date', key: 'date', label: 'Date', accessor: (row: unknown) => (row as { date: string }).date },
                  { header: 'Location', key: 'location', label: 'Location', accessor: (row: unknown) => (row as { location: string }).location },
                  { header: 'Livestock', key: 'livestock', label: 'Livestock', accessor: (row: unknown) => (row as { livestock: string }).livestock },
                  { header: 'Status', key: 'status', label: 'Status', accessor: (row: unknown) => (row as { status: string }).status },
                  { header: 'Officer', key: 'officer', label: 'Officer', accessor: (row: unknown) => (row as { officer: string }).officer },
                ]}
                onRowClick={(row) => console.log('View inspection:', (row as { id: string }).id)}
              />
            </CardContent>
          </Card>
        )}

        {/* Report Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-center">Active Cases</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-3xl font-bold text-red-600">23</div>
              <p className="text-sm text-gray-600 mt-1">Requiring attention</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-center">Recovered Assets</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-3xl font-bold text-green-600">156</div>
              <p className="text-sm text-gray-600 mt-1">This year</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-center">Total Value</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-3xl font-bold text-blue-600">R2.4M</div>
              <p className="text-sm text-gray-600 mt-1">Assets recovered</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-center">Success Rate</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-3xl font-bold text-purple-600">78%</div>
              <p className="text-sm text-gray-600 mt-1">Recovery rate</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
