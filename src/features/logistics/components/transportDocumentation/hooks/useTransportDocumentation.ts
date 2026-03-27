// src/components/logistics/transportDocumentation/hooks/useTransportDocumentation.ts
'use client';

import { useState, useEffect } from 'react';

interface TransportDocument {
  id: string;
  type: DocumentType;
  title: string;
  fileUrl: string;
  status: 'pending' | 'approved' | 'rejected';
  uploadedAt: string;
  uploadedBy: string;
  fileSize: number;
  metadata: {
    billOfLadingNumber?: string;
    deliveryConfirmationNumber?: string;
    inspectionDate?: string;
    certificateNumber?: string;
    [key: string]: string | undefined;
  };
}

type DocumentType = 'bill-of-lading' | 'delivery-confirmation' | 'vehicle-inspection' | 'driver-certification' | 'insurance' | 'registration';

interface NewDocument {
  type: DocumentType;
  title: string;
  fileUrl: string;
  metadata: {
    billOfLadingNumber: string;
    deliveryConfirmationNumber: string;
    inspectionDate: string;
    certificateNumber: string;
  };
}

export function useTransportDocumentation(transportId?: string) {
  const [documents, setDocuments] = useState<TransportDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const documentTypes = [
    { value: 'bill-of-lading' as DocumentType, label: 'Bill of Lading', description: 'Transport contract and receipt', required: true },
    { value: 'delivery-confirmation' as DocumentType, label: 'Delivery Confirmation', description: 'Proof of delivery signature', required: true },
    { value: 'vehicle-inspection' as DocumentType, label: 'Vehicle Inspection', description: 'Pre-trip vehicle inspection report', required: false },
    { value: 'driver-certification' as DocumentType, label: 'Driver Certification', description: 'Driver license and certifications', required: false },
    { value: 'insurance' as DocumentType, label: 'Insurance', description: 'Vehicle and cargo insurance documents', required: false },
    { value: 'registration' as DocumentType, label: 'Registration', description: 'Vehicle registration documents', required: false }
  ];

  const statusConfig = {
    pending: { color: 'bg-yellow-100 text-yellow-800', icon: '⏳', label: 'Pending' },
    approved: { color: 'bg-green-100 text-green-800', icon: '✅', label: 'Approved' },
    rejected: { color: 'bg-red-100 text-red-800', icon: '❌', label: 'Rejected' }
  };

  useEffect(() => {
    // Mock data loading - replace with API calls
    const loadMockDocuments = async () => {
      const mockDocuments: TransportDocument[] = [
        {
          id: 'doc-001',
          type: 'bill-of-lading',
          title: 'Bill of Lading - TRK-001',
          fileUrl: '/documents/bol-trk001.pdf',
          status: 'approved',
          uploadedAt: '2024-03-15T09:30:00Z',
          uploadedBy: 'John Smith',
          fileSize: 2048576,
          metadata: {
            billOfLadingNumber: 'BOL-2024-001234',
            deliveryConfirmationNumber: 'DC-2024-005678'
          }
        },
        {
          id: 'doc-002',
          type: 'delivery-confirmation',
          title: 'Delivery Confirmation - Customer A',
          fileUrl: '/documents/delivery-conf-a.pdf',
          status: 'approved',
          uploadedAt: '2024-03-18T14:45:00Z',
          uploadedBy: 'Maria Garcia',
          fileSize: 1024000,
          metadata: {
            deliveryConfirmationNumber: 'DC-2024-005679'
          }
        },
        {
          id: 'doc-003',
          type: 'vehicle-inspection',
          title: 'Pre-trip Inspection - TRK-001',
          fileUrl: '/documents/inspection-trk001.pdf',
          status: 'pending',
          uploadedAt: '2024-03-20T08:15:00Z',
          uploadedBy: 'Thabo Mokoena',
          fileSize: 1536000,
          metadata: {
            inspectionDate: '2024-03-20',
            certificateNumber: 'INS-2024-001'
          }
        },
        {
          id: 'doc-004',
          type: 'insurance',
          title: 'Vehicle Insurance - TRK-001',
          fileUrl: '/documents/insurance-trk001.pdf',
          status: 'approved',
          uploadedAt: '2024-03-10T11:20:00Z',
          uploadedBy: 'Sarah Johnson',
          fileSize: 3072000,
          metadata: {
            certificateNumber: 'INS-2024-002'
          }
        }
      ];

      setDocuments(mockDocuments);
      setIsLoading(false);
    };

    loadMockDocuments();
  }, [transportId]);

  const createDocument = (documentData: NewDocument) => {
    const newDocument: TransportDocument = {
      ...documentData,
      id: `doc-${Date.now()}`,
      status: 'pending',
      uploadedAt: new Date().toISOString(),
      uploadedBy: 'Current User', // Replace with actual user
      fileSize: Math.floor(Math.random() * 5000000) + 500000 // Mock file size
    };
    
    setDocuments(prev => [...prev, newDocument]);
    return newDocument;
  };

  const updateDocument = (updatedDocument: TransportDocument) => {
    setDocuments(prev => prev.map(doc => 
      doc.id === updatedDocument.id ? updatedDocument : doc
    ));
  };

  const deleteDocument = (documentId: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== documentId));
  };

  const approveDocument = (documentId: string) => {
    updateDocument({
      ...getDocumentById(documentId)!,
      status: 'approved'
    });
  };

  const rejectDocument = (documentId: string) => {
    updateDocument({
      ...getDocumentById(documentId)!,
      status: 'rejected'
    });
  };

  const getDocumentById = (id: string) => {
    return documents.find(doc => doc.id === id);
  };

  const getDocumentsByType = (type: DocumentType) => {
    return documents.filter(doc => doc.type === type);
  };

  const getDocumentsByStatus = (status: TransportDocument['status']) => {
    return documents.filter(doc => doc.status === status);
  };

  const getRequiredDocuments = () => {
    return documentTypes.filter(docType => docType.required);
  };

  const getMissingRequiredDocuments = () => {
    const requiredTypes = getRequiredDocuments().map(type => type.value);
    const existingTypes = documents.map(doc => doc.type);
    const missingTypes = requiredTypes.filter(type => !existingTypes.includes(type));
    return missingTypes;
  };

  const getDocumentStats = () => {
    const total = documents.length;
    const pending = documents.filter(doc => doc.status === 'pending').length;
    const approved = documents.filter(doc => doc.status === 'approved').length;
    const rejected = documents.filter(doc => doc.status === 'rejected').length;
    const totalSize = documents.reduce((sum, doc) => sum + doc.fileSize, 0);

    return {
      total,
      pending,
      approved,
      rejected,
      totalSize,
      requiredMissing: getMissingRequiredDocuments().length
    };
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-ZA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return {
    documents,
    isLoading,
    documentTypes,
    statusConfig,
    createDocument,
    updateDocument,
    deleteDocument,
    approveDocument,
    rejectDocument,
    getDocumentById,
    getDocumentsByType,
    getDocumentsByStatus,
    getRequiredDocuments,
    getMissingRequiredDocuments,
    getDocumentStats,
    formatFileSize,
    formatDate
  };
}

export type { TransportDocument, DocumentType, NewDocument };
