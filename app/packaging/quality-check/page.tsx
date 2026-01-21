// src/app/packaging/quality-check/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/contexts/userContext';
import { DashboardLayout } from '@/components/dashboard/dashboardLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  CheckCircle, 
  AlertTriangle, 
  X, 
  Eye, 
  Download, 
  Camera,
  Package,
  Scale,
  Droplets,
  Thermometer,
  Search,
  Filter,
  Plus
} from 'lucide-react';

interface QualityCheck {
  id: string;
  batchId: string;
  productName: string;
  productId: string;
  checkDate: string;
  checkedBy: string;
  status: 'passed' | 'failed' | 'pending';
  issues: string[];
  temperature: number;
  weight: number;
  packagingIntegrity: 'excellent' | 'good' | 'fair' | 'poor';
  visualInspection: string;
  notes: string;
  photos: string[];
}

export default function QualityCheckPage() {
  const { currentUser } = useUser();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedCheck, setSelectedCheck] = useState<QualityCheck | null>(null);
  const [showNewCheckForm, setShowNewCheckForm] = useState(false);

  useEffect(() => {
    // Redirect if user doesn't have packaging role
    const timer = setTimeout(() => {
      if (currentUser?.role !== 'packaging') {
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

  // Mock quality checks data
  const qualityChecks: QualityCheck[] = [
    {
      id: 'qc1',
      batchId: 'BATCH-2024-CAR-STL-001',
      productName: 'Organic Carrots Premium',
      productId: 'PRD-2024-003',
      checkDate: '2024-01-15T10:30:00Z',
      checkedBy: 'John Packager',
      status: 'passed',
      issues: [],
      temperature: 4.2,
      weight: 25.1,
      packagingIntegrity: 'excellent',
      visualInspection: 'Fresh appearance, vibrant color, no damage',
      notes: 'Quality meets all standards. Ready for distribution.',
      photos: ['carrots-check1.jpg', 'carrots-check2.jpg']
    },
    {
      id: 'qc2',
      batchId: 'BATCH-2024-APP-STL-002',
      productName: 'Organic Apples Premium',
      productId: 'PRD-2024-001',
      checkDate: '2024-01-15T14:15:00Z',
      checkedBy: 'Sarah Packager',
      status: 'failed',
      issues: ['Minor bruising on 15% of apples', 'Inconsistent sizing'],
      temperature: 3.8,
      weight: 24.8,
      packagingIntegrity: 'good',
      visualInspection: 'Some bruising detected, color good',
      notes: 'Requires re-sorting. Bruised apples to be removed.',
      photos: ['apples-check1.jpg', 'apples-issue1.jpg']
    },
    {
      id: 'qc3',
      batchId: 'BATCH-2024-LET-STL-003',
      productName: 'Organic Lettuce Mix',
      productId: 'PRD-2024-002',
      checkDate: '2024-01-15T16:45:00Z',
      checkedBy: 'Mike Packager',
      status: 'pending',
      issues: [],
      temperature: 5.1,
      weight: 15.2,
      packagingIntegrity: 'excellent',
      visualInspection: 'Fresh, crisp leaves, no wilting',
      notes: 'Awaiting final inspection results.',
      photos: ['lettuce-check1.jpg']
    }
  ];

  const filteredChecks = qualityChecks.filter(check => {
    const matchesSearch = check.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         check.batchId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         check.productId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || check.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'passed': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getIntegrityColor = (integrity: string) => {
    switch (integrity) {
      case 'excellent': return 'bg-green-100 text-green-800';
      case 'good': return 'bg-blue-100 text-blue-800';
      case 'fair': return 'bg-yellow-100 text-yellow-800';
      case 'poor': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const passedCount = qualityChecks.filter(check => check.status === 'passed').length;
  const failedCount = qualityChecks.filter(check => check.status === 'failed').length;
  const pendingCount = qualityChecks.filter(check => check.status === 'pending').length;

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
        title="Quality Check"
        description="Perform quality control checks on packaged products"
      >
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
            <Card className="p-3 sm:p-4 lg:p-5 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Total Checks</p>
                  <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">{qualityChecks.length}</p>
                </div>
                <div className="p-1.5 sm:p-2 lg:p-3 bg-blue-100 rounded-lg">
                  <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                </div>
              </div>
            </Card>

            <Card className="p-3 sm:p-4 lg:p-5 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Passed</p>
                  <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-green-600">{passedCount}</p>
                </div>
                <div className="p-1.5 sm:p-2 lg:p-3 bg-green-100 rounded-lg">
                  <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                </div>
              </div>
            </Card>

            <Card className="p-3 sm:p-4 lg:p-5 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Failed</p>
                  <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-red-600">{failedCount}</p>
                </div>
                <div className="p-1.5 sm:p-2 lg:p-3 bg-red-100 rounded-lg">
                  <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-red-600" />
                </div>
              </div>
            </Card>

            <Card className="p-3 sm:p-4 lg:p-5 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-yellow-600">{pendingCount}</p>
                </div>
                <div className="p-1.5 sm:p-2 lg:p-3 bg-yellow-100 rounded-lg">
                  <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-600" />
                </div>
              </div>
            </Card>
          </div>

          {/* Search and Filters */}
          <Card className="p-4 sm:p-6">
            <div className="flex flex-col lg:flex-row gap-3 sm:gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search by product name, batch ID, or product ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 text-sm sm:text-base"
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full lg:w-48 text-sm sm:text-base">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="passed">Passed</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={() => setShowNewCheckForm(true)} className="text-sm sm:text-base">
                <Plus className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                New Check
              </Button>
            </div>
          </Card>

          {/* Quality Checks List */}
          <Card className="p-4 sm:p-6">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Recent Quality Checks</h3>
            <div className="space-y-3 sm:space-y-4">
              {filteredChecks.map((check) => (
                <div key={check.id} className="border rounded-lg p-3 sm:p-4 lg:p-5 hover:shadow-md transition-shadow">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-3 sm:gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 sm:gap-3 mb-3">
                        <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 flex items-center justify-center">
                          <Package className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-sm sm:text-base lg:text-lg truncate" title={check.productName}>{check.productName}</h4>
                          <p className="text-xs sm:text-sm text-gray-500">{check.batchId}</p>
                        </div>
                        <Badge className={`${getStatusColor(check.status)} text-xs px-2 py-1 sm:px-3 sm:py-2 font-medium whitespace-nowrap`}>
                          {check.status.charAt(0).toUpperCase() + check.status.slice(1)}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 text-xs sm:text-sm">
                        <div className="flex items-center gap-2">
                          <div className="flex-shrink-0 w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center">
                            <Thermometer className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
                          </div>
                          <span className="text-gray-600">Temp:</span>
                          <span className="font-medium">{check.temperature}°C</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex-shrink-0 w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center">
                            <Scale className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
                          </div>
                          <span className="text-gray-600">Weight:</span>
                          <span className="font-medium">{check.weight}kg</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex-shrink-0 w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center">
                            <Package className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
                          </div>
                          <span className="text-gray-600">Integrity:</span>
                          <Badge className={`${getIntegrityColor(check.packagingIntegrity)} text-xs px-2 py-1`}>
                            {check.packagingIntegrity.charAt(0).toUpperCase() + check.packagingIntegrity.slice(1)}
                          </Badge>
                        </div>
                      </div>

                      <div className="mt-3 sm:mt-4">
                        <p className="text-xs sm:text-sm text-gray-600 mb-1">Visual Inspection:</p>
                        <p className="text-xs sm:text-sm">{check.visualInspection}</p>
                      </div>

                      {check.issues.length > 0 && (
                        <div className="mt-3 sm:mt-4">
                          <p className="text-xs sm:text-sm text-gray-600 mb-2">Issues Found:</p>
                          <ul className="list-disc list-inside space-y-1">
                            {check.issues.map((issue, index) => (
                              <li key={index} className="text-xs sm:text-sm text-red-600">{issue}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <div className="mt-3 sm:mt-4">
                        <p className="text-xs sm:text-sm text-gray-600 mb-1">Notes:</p>
                        <p className="text-xs sm:text-sm">{check.notes}</p>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2 lg:mt-0">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedCheck(check)}
                        className="flex-1 text-xs h-7 sm:h-8 min-w-[120px]"
                      >
                        <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                        <span className="whitespace-nowrap">View Details</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 text-xs h-7 sm:h-8 min-w-[120px]"
                      >
                        <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                        <span className="whitespace-nowrap">Export</span>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Quality Check Details Modal */}
          {selectedCheck && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto m-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 sm:p-6 border-b gap-4">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Quality Check Details</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedCheck(null)}
                    className="w-full sm:w-auto"
                  >
                    <X className="h-4 w-4 sm:h-5 sm:w-5" />
                    <span className="ml-2 hidden sm:inline">Close</span>
                  </Button>
                </div>
                <div className="p-4 sm:p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-3">Product Information</h4>
                      <div className="space-y-2 text-sm">
                        <p><strong>Product Name:</strong> {selectedCheck.productName}</p>
                        <p><strong>Product ID:</strong> {selectedCheck.productId}</p>
                        <p><strong>Batch ID:</strong> {selectedCheck.batchId}</p>
                        <p><strong>Check Date:</strong> {new Date(selectedCheck.checkDate).toLocaleDateString()}</p>
                        <p><strong>Checked By:</strong> {selectedCheck.checkedBy}</p>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-3">Quality Metrics</h4>
                      <div className="space-y-2 text-sm">
                        <p><strong>Temperature:</strong> {selectedCheck.temperature}°C</p>
                        <p><strong>Weight:</strong> {selectedCheck.weight}kg</p>
                        <p><strong>Packaging Integrity:</strong> <Badge className={getIntegrityColor(selectedCheck.packagingIntegrity)}>{selectedCheck.packagingIntegrity}</Badge></p>
                        <p><strong>Status:</strong> <Badge className={getStatusColor(selectedCheck.status)}>{selectedCheck.status}</Badge></p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <h4 className="font-medium mb-3">Inspection Details</h4>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Visual Inspection:</p>
                        <p className="text-sm">{selectedCheck.visualInspection}</p>
                      </div>
                      
                      {selectedCheck.issues.length > 0 && (
                        <div>
                          <p className="text-sm text-gray-600 mb-2">Issues Found:</p>
                          <ul className="list-disc list-inside space-y-1">
                            {selectedCheck.issues.map((issue, index) => (
                              <li key={index} className="text-sm text-red-600">{issue}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <div>
                        <p className="text-sm text-gray-600 mb-1">Notes:</p>
                        <p className="text-sm">{selectedCheck.notes}</p>
                      </div>

                      <div>
                        <p className="text-sm text-gray-600 mb-2">Photos:</p>
                        <div className="flex flex-wrap gap-2">
                          {selectedCheck.photos.map((photo, index) => (
                            <div key={index} className="border rounded p-2">
                              <Camera className="h-8 w-8 text-gray-400" />
                              <p className="text-xs mt-1">{photo}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* New Quality Check Form Modal */}
          {showNewCheckForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto m-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 sm:p-6 border-b gap-4">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900">New Quality Check</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowNewCheckForm(false)}
                    className="w-full sm:w-auto"
                  >
                    <X className="h-4 w-4 sm:h-5 sm:w-5" />
                    <span className="ml-2 hidden sm:inline">Cancel</span>
                  </Button>
                </div>
                <div className="p-4 sm:p-6">
                  <form className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Product Name</label>
                        <Input placeholder="Enter product name" />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Batch ID</label>
                        <Input placeholder="Enter batch ID" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Temperature (°C)</label>
                        <Input type="number" step="0.1" placeholder="4.0" />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Weight (kg)</label>
                        <Input type="number" step="0.1" placeholder="25.0" />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Packaging Integrity</label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select integrity" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="excellent">Excellent</SelectItem>
                            <SelectItem value="good">Good</SelectItem>
                            <SelectItem value="fair">Fair</SelectItem>
                            <SelectItem value="poor">Poor</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700">Visual Inspection</label>
                      <Textarea placeholder="Describe visual appearance..." rows={3} />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700">Issues Found</label>
                      <Textarea placeholder="List any issues found..." rows={3} />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700">Notes</label>
                      <Textarea placeholder="Additional notes..." rows={3} />
                    </div>

                    <div className="flex gap-2">
                      <Button type="button" className="flex-1">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Save Check
                      </Button>
                      <Button type="button" variant="outline" onClick={() => setShowNewCheckForm(false)}>
                        Cancel
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      </DashboardLayout>
    </>
  );
}
