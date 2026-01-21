// src/app/inspector/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/contexts/userContext';
import { DashboardLayout } from '@/components/dashboard/dashboardLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle, 
  ClipboardList, 
  Camera, 
  FileText, 
  Plus, 
  Eye, 
  AlertTriangle,
  TrendingUp,
  Users,
  Calendar,
  MapPin
} from 'lucide-react';
import { InspectionRecord, InspectionStatus, Grade } from '@/types/inspector';

export default function InspectorPage() {
  const { currentUser } = useUser();
  const router = useRouter();
  const [inspections, setInspections] = useState<InspectionRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Redirect if user doesn't have inspector role (with delay for context update)
    const timer = setTimeout(() => {
      if (currentUser?.role !== 'inspector') {
        console.log('Inspector page - redirecting to unauthorized. Current user:', currentUser);
        router.push('/unauthorized');
        return;
      }
      setLoading(false);
    }, 200);

    return () => clearTimeout(timer);
  }, [currentUser, router]);

  // Load mock inspection data
  useEffect(() => {
    const mockInspections: InspectionRecord[] = [
      {
        id: 'insp1',
        productId: 'PRD-2024-001',
        batchId: 'BATCH-001',
        inspectorId: currentUser?.id || '',
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
        inspectorId: currentUser?.id || '',
        inspectionDate: '2025-01-21T09:00:00Z',
        location: 'Cold Storage 2, Cape Town',
        status: 'completed',
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
        inspectorId: currentUser?.id || '',
        inspectionDate: '2025-01-22T11:00:00Z',
        location: 'Processing Facility, Paarl',
        status: 'in-progress',
        grade: 'B',
        qualityMetrics: {
          moistureContent: 14.8,
          size: 'Medium',
          color: 'Red',
          firmness: 7.5,
          sugarContent: 14.5,
          defects: ['Minor bruising', 'Color variation'],
          weight: 200,
          temperature: 4.1,
          pesticideResidue: 0.04,
          microbialCount: 1100
        },
        photos: [],
        notes: 'Inspection in progress - initial assessment shows B grade quality',
        recommendations: ['Address color variation issues', 'Monitor moisture levels'],
        verificationProvider: 'internal',
        createdAt: '2025-01-22T11:00:00Z',
        updatedAt: '2025-01-22T11:00:00Z'
      },
      {
        id: 'insp4',
        productId: 'PRD-2024-004',
        batchId: 'BATCH-004',
        inspectorId: currentUser?.id || '',
        inspectionDate: '2025-01-19T14:00:00Z',
        location: 'Farm Gate Inspection, Stellenbosch',
        status: 'completed',
        grade: 'A',
        qualityMetrics: {
          moistureContent: 12.8,
          size: 'Large',
          color: 'Deep Red',
          firmness: 8.8,
          sugarContent: 17.2,
          defects: [],
          weight: 300,
          temperature: 4.0,
          pesticideResidue: 0.01,
          microbialCount: 750
        },
        photos: [],
        notes: 'Premium quality produce, excellent storage conditions',
        recommendations: ['Ready for export market', 'Maintain cold chain'],
        verificationProvider: 'sgs',
        verificationReference: 'SGS-2024-001235',
        verifiedBy: 'Dr. Sarah Johnson',
        verifiedAt: '2025-01-19T16:30:00Z',
        createdAt: '2025-01-19T14:00:00Z',
        updatedAt: '2025-01-19T16:30:00Z'
      },
      {
        id: 'insp5',
        productId: 'PRD-2024-005',
        batchId: 'BATCH-005',
        inspectorId: currentUser?.id || '',
        inspectionDate: '2025-01-18T08:00:00Z',
        location: 'Orchard Block A, Grabouw',
        status: 'completed',
        grade: 'A',
        qualityMetrics: {
          moistureContent: 13.5,
          size: 'Extra Large',
          color: 'Crimson',
          firmness: 9.0,
          sugarContent: 18.5,
          defects: [],
          weight: 320,
          temperature: 3.9,
          pesticideResidue: 0.015,
          microbialCount: 680
        },
        photos: [],
        notes: 'Outstanding quality - exceeds all grade A requirements',
        recommendations: ['Premium pricing recommended', 'Expedite processing'],
        verificationProvider: 'sgs',
        verificationReference: 'SGS-2024-001236',
        verifiedBy: 'Dr. Michael Chen',
        verifiedAt: '2025-01-18T10:15:00Z',
        createdAt: '2025-01-18T08:00:00Z',
        updatedAt: '2025-01-18T10:15:00Z'
      },
      {
        id: 'insp6',
        productId: 'PRD-2024-006',
        batchId: 'BATCH-006',
        inspectorId: currentUser?.id || '',
        inspectionDate: '2025-01-23T10:00:00Z',
        location: 'Distribution Center, Cape Town',
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
        createdAt: '2025-01-23T10:00:00Z',
        updatedAt: '2025-01-23T10:00:00Z'
      }
    ];

    setInspections(mockInspections);
  }, [currentUser]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (!currentUser || currentUser.role !== 'inspector') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div>
      </div>
    );
  }

  const completedInspections = inspections.filter(i => i.status === 'completed').length;
  const pendingInspections = inspections.filter(i => i.status === 'pending').length;
  const inProgressInspections = inspections.filter(i => i.status === 'in-progress').length;
  const averageGrade = inspections.filter(i => i.grade).reduce((acc, i) => {
    const gradeValues = { 'A': 6, 'B': 5, 'C': 4, 'D': 3, 'E': 2, 'F': 1 };
    return acc + (gradeValues[i.grade as Grade] || 0);
  }, 0) / inspections.filter(i => i.grade).length || 0;

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

  return (
    <DashboardLayout
      description="Inspector dashboard and overview">
      <div className="space-y-6">
          {/* Hero Section */}
          <div className="bg-gradient-to-r from-purple-600 to-purple-800 rounded-2xl p-4 sm:p-6 lg:p-8 text-white">
            <div className="text-center">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2 sm:mb-4">Quality Inspector</h1>
              <p className="text-sm sm:text-base lg:text-lg text-purple-100 mb-4 sm:mb-6">Comprehensive quality assessment and verification system</p>
              <div className="flex justify-center items-center gap-3 sm:gap-4 lg:gap-6 mb-4 sm:mb-6 lg:mb-8">
                <div className="flex items-center gap-2 sm:gap-3">
                  <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />
                  <span className="text-sm sm:text-base">{completedInspections} Completed</span>
                </div>
                <div className="flex items-center gap-2 sm:gap-3">
                  <ClipboardList className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />
                  <span className="text-sm sm:text-base">{inProgressInspections} In Progress</span>
                </div>
                <div className="flex items-center gap-2 sm:gap-3">
                  <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />
                  <span className="text-sm sm:text-base">Avg Grade: {averageGrade.toFixed(1)}</span>
                </div>
              </div>
              <div className="hidden md:block">
                <Camera className="h-8 w-8 sm:h-12 sm:w-12 lg:h-16 lg:w-16 text-purple-200 mx-auto" />
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <button
              onClick={() => router.push('/inspector/inspections')}
              className="bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-2 sm:gap-3 h-auto p-3 sm:p-4 rounded-md font-medium transition-colors"
            >
              <ClipboardList className="h-4 w-4 sm:h-5 sm:w-5" />
              <div className="text-left">
                <div className="font-medium text-sm sm:text-base">New Inspection</div>
                <div className="text-xs opacity-90">Start quality assessment</div>
              </div>
            </button>
            <button
              onClick={() => router.push('/inspector/verification')}
              className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 h-auto p-4 rounded-md font-medium transition-colors"
            >
              <CheckCircle className="h-5 w-5" />
              <div className="text-left">
                <div className="font-medium">Request Verification</div>
                <div className="text-xs opacity-90">Third-party certification</div>
              </div>
            </button>
            <button
              onClick={() => router.push('/inspector/reports')}
              className="bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2 h-auto p-4 rounded-md font-medium transition-colors"
            >
              <FileText className="h-5 w-5" />
              <div className="text-left">
                <div className="font-medium">View Reports</div>
                <div className="text-xs opacity-90">Inspection analytics</div>
              </div>
            </button>
          </div>

          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-gray-900">{completedInspections}</p>
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">In Progress</p>
                  <p className="text-2xl font-bold text-gray-900">{inProgressInspections}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <ClipboardList className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-gray-900">{pendingInspections}</p>
                </div>
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <AlertTriangle className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg Grade</p>
                  <p className="text-2xl font-bold text-gray-900">{averageGrade.toFixed(1)}</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </Card>
          </div>

          {/* Recent Activities */}
          <Card title="Recent Activities" className="space-y-4">
            {inspections.slice(0, 3).map((inspection, index) => (
              <Card key={index} className="p-4 sm:p-6 hover:shadow-lg transition-all duration-200 hover:scale-[1.02] border-0 shadow-md">
                <div className="flex flex-col sm:flex-row justify-between gap-4">
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg flex-shrink-0">
                      <Camera className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-gray-900 text-base sm:text-lg truncate mb-1">{inspection.productId}</p>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <p className="text-xs text-gray-600">Quality Score: 95/100</p>
                      </div>
                      <p className="text-sm text-gray-600 flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-purple-500" />
                        <span className="hidden sm:inline">{inspection.location}</span>
                        <span className="sm:hidden">{inspection.location.split(',')[0]}</span>
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(inspection.inspectionDate).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="flex flex-col sm:flex-row gap-2 mb-1">
                      <Badge className={`
                        ${getStatusColor(inspection.status)} 
                        px-3 py-1.5 text-xs font-semibold
                        border-0 shadow-sm
                      `}>
                        {inspection.status}
                      </Badge>
                      {inspection.grade && (
                        <Badge className={`
                          ${getGradeColor(inspection.grade)} 
                          px-3 py-1.5 text-xs font-semibold
                          border-0 shadow-sm
                        `}>
                          Grade {inspection.grade}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </Card>
        </div>
    </DashboardLayout>
  );
}