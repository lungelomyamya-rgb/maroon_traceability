// src/app/inspector/verification/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/contexts/userContext';
import { DashboardLayout } from '@/components/dashboard/dashboardLayout';
import { ThirdPartyVerification } from '@/components/inspector/thirdPartyVerification';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle, 
  Plus, 
  Eye, 
  AlertTriangle,
  Clock,
  ExternalLink,
  Search,
  FileText
} from 'lucide-react';
import { ThirdPartyVerification as VerificationType, VerificationProvider } from '@/types/inspector';

export default function InspectorVerificationPage() {
  const { currentUser } = useUser();
  const router = useRouter();
  const [verifications, setVerifications] = useState<VerificationType[]>([]);
  const [selectedVerification, setSelectedVerification] = useState<VerificationType | null>(null);
  const [showNewForm, setShowNewForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Redirect if user doesn't have inspector role
    if (currentUser?.role !== 'inspector') {
      router.push('/unauthorized');
      return;
    }

    // Load mock verification data
    const mockVerifications: VerificationType[] = [
      {
        id: 'ver1',
        inspectionId: 'insp1',
        provider: 'sgs',
        referenceNumber: 'SGS-2024-001234',
        verifiedAt: '2025-01-20T14:30:00Z',
        verifiedBy: 'Dr. John Smith',
        status: 'verified',
        documents: [
          {
            id: 'doc1',
            type: 'certificate',
            title: 'Quality Certificate - SGS-2024-001234',
            url: '/documents/sgs-cert-001234.pdf',
            uploadedAt: '2025-01-20T14:30:00Z'
          },
          {
            id: 'doc2',
            type: 'report',
            title: 'Laboratory Analysis Report',
            url: '/documents/sgs-report-001234.pdf',
            uploadedAt: '2025-01-20T14:30:00Z'
          }
        ],
        notes: 'All quality parameters within acceptable limits'
      },
      {
        id: 'ver2',
        inspectionId: 'insp2',
        provider: 'bureau-veritas',
        referenceNumber: 'BV-2024-005678',
        verifiedAt: '2025-01-21T16:45:00Z',
        verifiedBy: 'Maria Chen',
        status: 'pending',
        documents: [
          {
            id: 'doc3',
            type: 'report',
            title: 'Preliminary Assessment Report',
            url: '/documents/bv-prelim-005678.pdf',
            uploadedAt: '2025-01-21T16:45:00Z'
          }
        ],
        notes: 'Awaiting final laboratory results'
      },
      {
        id: 'ver3',
        inspectionId: 'insp3',
        provider: 'intertek',
        referenceNumber: 'ITK-2024-009012',
        verifiedAt: '',
        verifiedBy: '',
        status: 'pending',
        documents: [],
        notes: 'Verification request submitted, awaiting assignment'
      }
    ];

    setVerifications(mockVerifications);
  }, [currentUser, router]);

  if (!currentUser || currentUser.role !== 'inspector') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div>
      </div>
    );
  }

  const handleVerificationSubmit = async (data: any) => {
    console.log('Verification submitted:', data);
    // In real implementation, this would save to database
    setShowNewForm(false);
    setSelectedVerification(null);
  };

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      verified: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getProviderInfo = (provider: VerificationProvider) => {
    const providers = {
      sgs: { name: 'SGS South Africa', color: 'bg-blue-100 text-blue-800' },
      'bureau-veritas': { name: 'Bureau Veritas', color: 'bg-purple-100 text-purple-800' },
      intertek: { name: 'Intertek', color: 'bg-green-100 text-green-800' },
      internal: { name: 'Internal Verification', color: 'bg-gray-100 text-gray-800' }
    };
    return providers[provider as keyof typeof providers];
  };

  const filteredVerifications = verifications.filter(verification => {
    const matchesSearch = verification.referenceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         verification.inspectionId.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const statusCounts = {
    total: verifications.length,
    pending: verifications.filter(v => v.status === 'pending').length,
    verified: verifications.filter(v => v.status === 'verified').length,
    rejected: verifications.filter(v => v.status === 'rejected').length
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
        title="Third-Party Verification"
        description="Manage external verification requests and certificates"
      >
        <div className="space-y-6">
        {/* Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <Card className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm sm:text-base font-medium text-gray-600">Total</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">{statusCounts.total}</p>
              </div>
              <div className="p-2 sm:p-3 bg-gray-100 rounded-lg">
                <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
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
                <p className="text-sm sm:text-base font-medium text-gray-600">Verified</p>
                <p className="text-xl sm:text-2xl font-bold text-green-600">{statusCounts.verified}</p>
              </div>
              <div className="p-2 sm:p-3 bg-green-100 rounded-lg">
                <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
              </div>
            </div>
          </Card>

          <Card className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm sm:text-base font-medium text-gray-600">Rejected</p>
                <p className="text-xl sm:text-2xl font-bold text-red-600">{statusCounts.rejected}</p>
              </div>
              <div className="p-2 sm:p-3 bg-red-100 rounded-lg">
                <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-red-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* Actions and Search */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <Button
            onClick={() => {
              setShowNewForm(true);
              setSelectedVerification(null);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white w-full lg:w-auto h-10 sm:h-auto px-4 sm:px-6 py-2 text-sm sm:text-base"
          >
            <Plus className="h-4 w-4 mr-2" />
            Request Verification
          </Button>

          <div className="relative w-full lg:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search verifications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-blue-500 w-full text-sm"
            />
          </div>
        </div>

        {/* Verification Form or List */}
        {(showNewForm || selectedVerification) ? (
          <ThirdPartyVerification
            inspectionId={selectedVerification?.inspectionId || "insp-new"}
            onSubmit={handleVerificationSubmit}
            existingVerification={selectedVerification || undefined}
          />
        ) : (
          /* Verifications List */
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Verification Requests</h3>
            
            {filteredVerifications.length === 0 ? (
              <div className="text-center py-12">
                <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No verification requests found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredVerifications.map((verification) => {
                  const providerInfo = getProviderInfo(verification.provider);
                  
                  return (
                    <div key={verification.id} className="border rounded-lg p-3 sm:p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex flex-col sm:flex-row justify-between gap-4">
                        <div className="flex items-start gap-3 sm:gap-4">
                          <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
                            <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
                              <h4 className="font-medium text-gray-900 text-sm sm:text-base truncate">{verification.referenceNumber}</h4>
                              <div className="flex flex-wrap gap-1">
                                <Badge className={`${providerInfo.color} text-xs`}>
                                  {providerInfo.name}
                                </Badge>
                                <Badge className={`${getStatusColor(verification.status)} text-xs`}>
                                  {verification.status}
                                </Badge>
                              </div>
                            </div>
                            <p className="text-xs sm:text-sm text-gray-500">
                              Inspection: {verification.inspectionId}
                            </p>
                            {verification.verifiedAt && (
                              <p className="text-xs sm:text-sm text-gray-500">
                                Verified: {new Date(verification.verifiedAt).toLocaleDateString()} by {verification.verifiedBy}
                              </p>
                            )}
                            {verification.notes && (
                              <p className="text-xs sm:text-sm text-gray-600 mt-1 line-clamp-2">{verification.notes}</p>
                            )}
                          </div>
                        </div>
                        
                        <div className="text-right flex-shrink-0">
                          <div className="flex flex-col sm:flex-row gap-2 mb-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedVerification(verification)}
                              className="text-xs"
                            >
                              <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                              <span className="hidden sm:inline">View</span>
                              <span className="sm:hidden">View</span>
                            </Button>
                            
                            {verification.status === 'pending' && (
                              <Button
                                size="sm"
                                className="bg-blue-600 hover:bg-blue-700 text-white text-xs"
                                onClick={() => {
                                  setSelectedVerification(verification);
                                  setShowNewForm(true);
                                }}
                              >
                                <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                                <span className="hidden sm:inline">Process</span>
                                <span className="sm:hidden">Process</span>
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        )}
      </div>
    </DashboardLayout>
    </>
  );
}
