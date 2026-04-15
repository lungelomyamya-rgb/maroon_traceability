// src/components/inspector/thirdPartyVerification/hooks/useThirdPartyVerification.ts
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import type { 
  VerificationProvider, 
  ThirdPartyVerification, 
  VerificationDocument,
} from '@/types/inspector';
import { VERIFICATION_PROVIDERS } from '@/types/inspector';

const thirdPartyVerificationSchema = z.object({
  provider: z.enum(['sgs', 'bureau-veritas', 'intertek']),
  referenceNumber: z.string().min(1, 'Reference number is required'),
  notes: z.string().optional(),
});

export type ThirdPartyVerificationFormData = z.infer<typeof thirdPartyVerificationSchema>;

export interface ThirdPartyVerificationState {
  verifications: ThirdPartyVerification[];
  selectedVerification: ThirdPartyVerification | null;
  showAddForm: boolean;
  isSubmitting: boolean;
  documents: VerificationDocument[];
  selectedProvider: VerificationProvider;
  searchTerm: string;
  providerFilter: string;
  statusFilter: string;
  loading: boolean;
}

export interface ThirdPartyVerificationActions {
  setSelectedVerification: (verification: ThirdPartyVerification | null) => void;
  setShowAddForm: (show: boolean) => void;
  setIsSubmitting: (submitting: boolean) => void;
  setDocuments: (documents: VerificationDocument[]) => void;
  setSelectedProvider: (provider: VerificationProvider) => void;
  setSearchTerm: (term: string) => void;
  setProviderFilter: (provider: string) => void;
  setStatusFilter: (status: string) => void;
  handleDocumentUpload: (files: FileList) => void;
  removeDocument: (docId: string) => void;
  handleFormSubmit: (data: ThirdPartyVerificationFormData) => Promise<void>;
  handleDeleteVerification: (id: string) => void;
  handleViewVerification: (verification: ThirdPartyVerification) => void;
  handleEditVerification: (id: string, updates: Partial<ThirdPartyVerification>) => void;
}

export interface ThirdPartyVerificationComputed {
  filteredVerifications: ThirdPartyVerification[];
  statistics: {
    totalVerifications: number;
    pendingVerifications: number;
    completedVerifications: number;
    totalDocuments: number;
    averageDocumentsPerVerification: number;
    providerDistribution: Record<VerificationProvider, number>;
    statusDistribution: Record<string, number>;
    documentTypeDistribution: Record<string, number>;
  };
  verificationProviders: VerificationProvider[];
  form: ReturnType<typeof useForm<ThirdPartyVerificationFormData>>;
  providerInfo: typeof VERIFICATION_PROVIDERS[keyof typeof VERIFICATION_PROVIDERS];
}

export function useThirdPartyVerification(inspectionId: string, existingVerification?: ThirdPartyVerification) {
  // State
  const [verifications, setVerifications] = useState<ThirdPartyVerification[]>([]);
  const [selectedVerification, setSelectedVerification] = useState<ThirdPartyVerification | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [documents, setDocuments] = useState<VerificationDocument[]>(
    existingVerification?.documents || [],
  );
  const [selectedProvider, setSelectedProvider] = useState<VerificationProvider>(
    (existingVerification?.provider as VerificationProvider) || 'sgs',
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [providerFilter, setProviderFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [loading, setLoading] = useState(false);

  // Form setup
  const form = useForm<ThirdPartyVerificationFormData>({
    resolver: zodResolver(thirdPartyVerificationSchema),
    defaultValues: existingVerification ? {
      provider: existingVerification.provider as 'sgs' | 'bureau-veritas' | 'intertek',
      referenceNumber: existingVerification.referenceNumber,
      notes: existingVerification.notes,
    } : {
      provider: 'sgs',
    },
  });

  // Constants
  const verificationProviders = Object.values(VERIFICATION_PROVIDERS);

  // Computed values
  const providerInfo = useMemo(() => {
    return VERIFICATION_PROVIDERS[selectedProvider as keyof typeof VERIFICATION_PROVIDERS];
  }, [selectedProvider]);

  const filteredVerifications = useMemo(() => {
    return verifications.filter(verification => {
      // Search filter
      const matchesSearch = searchTerm === '' || 
        verification.referenceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        verification.notes?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        verification.provider.toLowerCase().includes(searchTerm.toLowerCase());

      // Provider filter
      const matchesProvider = providerFilter === 'all' || verification.provider === providerFilter;

      // Status filter
      const matchesStatus = statusFilter === 'all' || verification.status === statusFilter;

      return matchesSearch && matchesProvider && matchesStatus;
    });
  }, [verifications, searchTerm, providerFilter, statusFilter]);

  const statistics = useMemo(() => {
    const totalVerifications = verifications.length;
    const pendingVerifications = verifications.filter(v => v.status === 'pending').length;
    const completedVerifications = verifications.filter(v => v.status === 'verified').length;
    const totalDocuments = verifications.reduce((sum, v) => sum + v.documents.length, 0);
    const averageDocumentsPerVerification = totalVerifications > 0 ? totalDocuments / totalVerifications : 0;

    // Provider distribution
    const providerDistribution = Object.entries(VERIFICATION_PROVIDERS).reduce((acc, [key, _provider]) => {
      acc[key as VerificationProvider] = verifications.filter(v => v.provider === key).length;
      return acc;
    }, {} as Record<VerificationProvider, number>);

    // Status distribution
    const statusDistribution = verifications.reduce((acc, verification) => {
      acc[verification.status] = (acc[verification.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Document type distribution
    const documentTypeDistribution = verifications.reduce((acc, verification) => {
      verification.documents.forEach(doc => {
        acc[doc.type] = (acc[doc.type] || 0) + 1;
      });
      return acc;
    }, {} as Record<string, number>);

    return {
      totalVerifications,
      pendingVerifications,
      completedVerifications,
      totalDocuments,
      averageDocumentsPerVerification,
      providerDistribution,
      statusDistribution,
      documentTypeDistribution,
    };
  }, [verifications]);

  // Mock data initialization
  useEffect(() => {
    const mockVerifications: ThirdPartyVerification[] = [
      {
        id: 'ver-1',
        inspectionId: inspectionId,
        provider: 'sgs',
        referenceNumber: 'SGS-2024-001234',
        status: 'verified',
        verifiedBy: 'SGS Inspector 001',
        verifiedAt: '2024-01-15T10:00:00Z',
        notes: 'Standard quality inspection completed successfully',
        documents: [
          {
            id: 'doc-1',
            type: 'certificate',
            title: 'Quality Certificate',
            url: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA...',
            uploadedAt: '2024-01-15T10:00:00Z',
          },
          {
            id: 'doc-2',
            type: 'report',
            title: 'Inspection Report',
            url: 'data:application/pdf;base64,JVBERi0x...',
            uploadedAt: '2024-01-15T10:00:00Z',
          },
        ],
      },
      {
        id: 'ver-2',
        inspectionId: inspectionId,
        provider: 'bureau-veritas',
        referenceNumber: 'BV-2024-002345',
        status: 'pending',
        notes: 'Awaiting laboratory results',
        documents: [
          {
            id: 'doc-3',
            type: 'receipt',
            title: 'Payment Receipt',
            url: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABA...',
            uploadedAt: '2024-01-20T14:00:00Z',
          },
        ],
        verifiedBy: '',
        verifiedAt: '',
      },
      {
        id: 'ver-3',
        inspectionId: inspectionId,
        provider: 'intertek',
        referenceNumber: 'ITK-2024-003456',
        status: 'verified',
        verifiedAt: '2024-01-25T16:00:00Z',
        notes: 'Comprehensive testing completed',
        documents: [
          {
            id: 'doc-4',
            type: 'certificate',
            title: 'Compliance Certificate',
            url: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA...',
            uploadedAt: '2024-01-25T16:00:00Z',
          },
          {
            id: 'doc-5',
            type: 'photo',
            title: 'Test Sample Photo 1',
            url: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABA...',
            uploadedAt: '2024-01-25T16:00:00Z',
          },
          {
            id: 'doc-6',
            type: 'photo',
            title: 'Test Sample Photo 2',
            url: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABA...',
            uploadedAt: '2024-01-25T16:00:00Z',
          },
        ],
        verifiedBy: 'Intertek Lab Technician',
      },
    ];

    setVerifications(mockVerifications);
  }, [inspectionId]);

  // Actions
  const handleDocumentUpload = (files: FileList) => {
    if (!files) {
      return;
    }

    Array.from(files).forEach((file, index) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newDoc: VerificationDocument = {
          id: `doc-${Date.now()}-${index}`,
          type: file.name.toLowerCase().includes('certificate') ? 'certificate' :
            file.name.toLowerCase().includes('report') ? 'report' :
              file.name.toLowerCase().includes('receipt') ? 'receipt' : 'photo',
          title: file.name,
          url: e.target?.result as string,
          uploadedAt: new Date().toISOString(),
        };
        setDocuments(prev => [...prev, newDoc]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeDocument = (docId: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== docId));
  };

  const handleFormSubmit = async (data: ThirdPartyVerificationFormData) => {
    try {
      setIsSubmitting(true);

      // Create verification record
      const verificationData: ThirdPartyVerification = {
        id: `ver-${Date.now()}`,
        inspectionId,
        provider: data.provider,
        referenceNumber: data.referenceNumber,
        status: 'pending',
        notes: data.notes,
        documents: documents,
        verifiedBy: '',
        verifiedAt: '',
      };

      setVerifications(prev => [...prev, verificationData]);
      setShowAddForm(false);
      form.reset();

    } catch (_error) {  
      // TODO: Handle failed verification submission
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteVerification = (id: string) => {
    if (window.confirm('Are you sure you want to delete this verification?')) {
      setVerifications(prev => prev.filter(v => v.id !== id));
    }
  };

  const handleViewVerification = (verification: ThirdPartyVerification) => {
    setSelectedVerification(verification);
  };

  const handleEditVerification = (id: string, updates: Partial<ThirdPartyVerification>) => {
    setVerifications(prev => prev.map(v => 
      v.id === id ? { ...v, ...updates } : v,
    ));
  };

  return {
    // State
    verifications,
    selectedVerification,
    showAddForm,
    isSubmitting,
    documents,
    selectedProvider,
    searchTerm,
    providerFilter,
    statusFilter,
    loading,
    
    // Constants
    verificationProviders,
    
    // Computed
    filteredVerifications,
    statistics,
    form,
    providerInfo,
    
    // Actions
    setSelectedVerification,
    setShowAddForm,
    setIsSubmitting,
    setDocuments,
    setSelectedProvider,
    setSearchTerm,
    setProviderFilter,
    setStatusFilter,
    handleDocumentUpload,
    removeDocument,
    handleFormSubmit,
    handleDeleteVerification,
    handleViewVerification,
    handleEditVerification,
  };
}
