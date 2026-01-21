// src/app/inspector/inspections/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/contexts/userContext';
import { DashboardLayout } from '@/components/dashboard/dashboardLayout';
import { QualityInspectionForm } from '@/components/inspector/qualityInspectionForm';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ClipboardList, 
  Camera, 
  Plus, 
  Eye, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Filter,
  Search
} from 'lucide-react';
import { InspectionRecord, InspectionStatus, Grade } from '@/types/inspector';

export default function InspectorInspectionsPage() {
  const { currentUser } = useUser();
  const router = useRouter();
  const [inspections, setInspections] = useState<InspectionRecord[]>([]);
  const [selectedInspection, setSelectedInspection] = useState<InspectionRecord | null>(null);
  const [showNewForm, setShowNewForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<InspectionStatus | 'all'>('all');

  useEffect(() => {
    // Redirect if user doesn't have inspector role
    if (currentUser?.role !== 'inspector') {
      router.push('/unauthorized');
      return;
    }

    // Load mock inspection data
    const mockInspections: InspectionRecord[] = [
      {
        id: 'insp1',
        productId: 'PRD-2024-001',
        batchId: 'BATCH-001',
        inspectorId: currentUser.id,
        inspectionDate: '2025-01-20T10:00:00Z',
        location: 'Packhouse 1, Stellenbosch',
        status: 'completed',
        grade: 'A',
        qualityMetrics: {
          moistureContent: 13.2,
          size: 'Large',
          color: 'Deep Red',
          firmness: 8.5,
          sugarContent: 16.8,
          defects: [],
          weight: 280,
          temperature: 4.2,
          pesticideResidue: 0.02,
          microbialCount: 850
        },
        photos: [],
        notes: 'Excellent quality apples, perfect for premium market',
        recommendations: ['Maintain current storage conditions', 'Ready for immediate distribution'],
        verificationProvider: 'sgs',
        verificationReference: 'SGS-2024-001234',
        verifiedBy: 'Dr. John Smith',
        verifiedAt: '2025-01-20T14:30:00Z',
        createdAt: '2025-01-20T10:00:00Z',
        updatedAt: '2025-01-20T14:30:00Z'
      },
      {
        id: 'insp2',
        productId: 'PRD-2024-002',
        batchId: 'BATCH-002',
        inspectorId: currentUser.id,
        inspectionDate: '2025-01-21T09:00:00Z',
        location: 'Cold Storage 2, Cape Town',
        status: 'in-progress',
        grade: 'B',
        qualityMetrics: {
          moistureContent: 14.5,
          size: 'Medium',
          color: 'Red',
          firmness: 7.2,
          sugarContent: 14.1,
          defects: ['Minor bruising'],
          weight: 220,
          temperature: 3.8,
          pesticideResidue: 0.03,
          microbialCount: 1200
        },
        photos: [],
        notes: 'Good quality with minor cosmetic imperfections',
        recommendations: ['Sort out bruised fruits', 'Consider price adjustment'],
        verificationProvider: 'internal',
        createdAt: '2025-01-21T09:00:00Z',
        updatedAt: '2025-01-21T09:00:00Z'
      },
      {
        id: 'insp3',
        productId: 'PRD-2024-003',
        batchId: 'BATCH-003',
        inspectorId: currentUser.id,
        inspectionDate: '2025-01-22T11:00:00Z',
        location: 'Processing Facility, Paarl',
        status: 'pending',
        grade: undefined,
        qualityMetrics: {
          moistureContent: 0,
          size: '',
          color: '',
          firmness: 0,
          sugarContent: 0,
          defects: [],
          weight: 0,
          temperature: 0,
          pesticideResidue: 0,
          microbialCount: 0
        },
        photos: [],
        notes: '',
        recommendations: [],
        verificationProvider: 'internal',
        createdAt: '2025-01-22T11:00:00Z',
        updatedAt: '2025-01-22T11:00:00Z'
      }
    ];

    setInspections(mockInspections);
  }, [currentUser, router]);

  if (!currentUser || currentUser.role !== 'inspector') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div>
      </div>
    );
  }

  const handleInspectionSubmit = async (data: any) => {
    console.log('Inspection submitted:', data);
    // In real implementation, this would save to database
    setShowNewForm(false);
    setSelectedInspection(null);
  };

  const getStatusColor = (status: InspectionStatus) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      'in-progress': 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      approved: 'bg-emerald-100 text-emerald-800',
      rejected: 'bg-red-100 text-red-800'
    };
    return colors[status];
  };

  const getGradeColor = (grade?: Grade) => {
    if (!grade) return 'bg-gray-100 text-gray-800';
    const colors = {
      'A': 'bg-green-100 text-green-800',
      'B': 'bg-blue-100 text-blue-800',
      'C': 'bg-yellow-100 text-yellow-800',
      'D': 'bg-orange-100 text-orange-800',
      'E': 'bg-red-100 text-red-800',
      'F': 'bg-gray-100 text-gray-800'
    };
    return colors[grade];
  };

  const filteredInspections = inspections.filter(inspection => {
    const matchesSearch = inspection.productId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         inspection.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || inspection.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusCounts = {
    total: inspections.length,
    pending: inspections.filter(i => i.status === 'pending').length,
    'in-progress': inspections.filter(i => i.status === 'in-progress').length,
    completed: inspections.filter(i => i.status === 'completed').length
  };

  return (
    <>
      {/* Back Button Above DashboardLayout */}
      <div className="px-4 sm:px-6 lg:px-8 pt-4">
        <Button
          variant="outline"
          onClick={() => router.push('/inspector')}
          className="inline-flex items-center gap-2 text-sm"
        >
          Back
        </Button>
      </div>
      
      <DashboardLayout
        title="Quality Inspections"
        description="Manage product quality assessments and grading"
      >
        <div className="space-y-6">
        {/* Status Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <Card className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm sm:text-base font-medium text-gray-600">Total</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">{statusCounts.total}</p>
              </div>
              <div className="p-2 sm:p-3 bg-gray-100 rounded-lg">
                <ClipboardList className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
              </div>
            </div>
          </Card>

          <Card className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm sm:text-base font-medium text-gray-600">Pending</p>
                <p className="text-xl sm:text-2xl font-bold text-yellow-600">{statusCounts.pending}</p>
              </div>
              <div className="p-2 sm:p-3 bg-yellow-100 rounded-lg">
                <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-600" />
              </div>
            </div>
          </Card>

          <Card className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm sm:text-base font-medium text-gray-600">In Progress</p>
                <p className="text-xl sm:text-2xl font-bold text-blue-600">{statusCounts['in-progress']}</p>
              </div>
              <div className="p-2 sm:p-3 bg-blue-100 rounded-lg">
                <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
              </div>
            </div>
          </Card>

          <Card className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm sm:text-base font-medium text-gray-600">Completed</p>
                <p className="text-xl sm:text-2xl font-bold text-green-600">{statusCounts.completed}</p>
              </div>
              <div className="p-2 sm:p-3 bg-green-100 rounded-lg">
                <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* Actions and Filters */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <Button
            onClick={() => {
              setShowNewForm(true);
              setSelectedInspection(null);
            }}
            className="bg-purple-600 hover:bg-purple-700 text-white w-full lg:w-auto h-10 sm:h-auto px-4 sm:px-6 py-2 text-sm sm:text-base"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Inspection
          </Button>

          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search inspections..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:border-purple-500 focus:ring-purple-500 w-full sm:w-64 text-sm"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as InspectionStatus | 'all')}
              className="px-4 py-2 border border-gray-300 rounded-md focus:border-purple-500 focus:ring-purple-500 text-sm"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>

        {/* Inspection Form or List */}
        {(showNewForm || selectedInspection) ? (
          <QualityInspectionForm
            productId={selectedInspection?.productId || "PRD-NEW-001"}
            onSubmit={handleInspectionSubmit}
            initialData={selectedInspection || undefined}
          />
        ) : (
          /* Inspections List */
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Inspection Records</h3>
            
            {filteredInspections.length === 0 ? (
              <div className="text-center py-12">
                <ClipboardList className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No inspections found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredInspections.map((inspection) => (
                  <div key={inspection.id} className="border rounded-lg p-3 sm:p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex flex-col sm:flex-row justify-between gap-4">
                      <div className="flex items-start gap-3 sm:gap-4">
                        <div className="p-2 bg-purple-100 rounded-lg flex-shrink-0">
                          <Camera className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
                            <h4 className="font-medium text-gray-900 text-sm sm:text-base truncate">{inspection.productId}</h4>
                            {inspection.batchId && (
                              <Badge variant="outline" className="text-xs">
                                {inspection.batchId}
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs sm:text-sm text-gray-500">
                            <span className="hidden sm:inline">{inspection.location} • </span>
                            <span className="sm:hidden">{inspection.location.split(',')[0]} • </span>
                            {new Date(inspection.inspectionDate).toLocaleDateString()}
                          </p>
                          {inspection.notes && (
                            <p className="text-xs sm:text-sm text-gray-600 mt-1 line-clamp-2">{inspection.notes}</p>
                          )}
                        </div>
                      </div>
                      
                      <div className="text-right flex-shrink-0">
                        <div className="flex flex-col sm:flex-row gap-2 mb-2">
                          <Badge className={`${getStatusColor(inspection.status)} text-xs`}>
                            {inspection.status}
                          </Badge>
                          {inspection.grade && (
                            <Badge className={`${getGradeColor(inspection.grade)} text-xs`}>
                              Grade {inspection.grade}
                            </Badge>
                          )}
                        </div>
                        
                        <div className="flex flex-col sm:flex-row gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedInspection(inspection)}
                            className="text-xs"
                          >
                            <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                            <span className="hidden sm:inline">View</span>
                            <span className="sm:hidden">View</span>
                          </Button>
                          
                          {inspection.status === 'pending' && (
                            <Button
                              size="sm"
                              className="bg-purple-600 hover:bg-purple-700 text-white text-xs"
                              onClick={() => {
                                setSelectedInspection(inspection);
                                setShowNewForm(true);
                              }}
                            >
                              <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                              <span className="hidden sm:inline">Start</span>
                              <span className="sm:hidden">Start</span>
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        )}
      </div>
    </DashboardLayout>
    </>
  );
}
