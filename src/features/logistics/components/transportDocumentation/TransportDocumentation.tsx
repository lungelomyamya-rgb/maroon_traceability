// src/components/logistics/transportDocumentation/TransportDocumentation.tsx
'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Upload, FileText, AlertTriangle, CheckCircle } from 'lucide-react';
import { useTransportDocumentation, type TransportDocument } from './hooks/useTransportDocumentation';
import { DocumentUpload } from './DocumentUpload';
import { DocumentList } from './DocumentList';
import { DocumentPreview } from './DocumentPreview';

interface TransportDocumentationProps {
  transportId?: string;
  onDocumentUpdate?: (document: TransportDocument) => void;
}

export function TransportDocumentation({ transportId, onDocumentUpdate }: TransportDocumentationProps) {
  const {
    documents,
    isLoading,
    documentTypes,
    statusConfig,
    createDocument,
    updateDocument,
    deleteDocument,
    approveDocument,
    rejectDocument,
    getDocumentStats,
    formatFileSize,
    formatDate
  } = useTransportDocumentation(transportId);

  const [showUploadForm, setShowUploadForm] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<TransportDocument | null>(null);

  const stats = getDocumentStats();

  const handleUpload = (documentData: any) => {
    const newDoc = createDocument(documentData);
    setShowUploadForm(false);
    onDocumentUpdate?.(newDoc);
  };

  const handleView = (document: TransportDocument) => {
    setSelectedDocument(document);
  };

  const handleApprove = (documentId: string) => {
    approveDocument(documentId);
    onDocumentUpdate?.(getDocumentById(documentId)!);
  };

  const handleReject = (documentId: string) => {
    rejectDocument(documentId);
    onDocumentUpdate?.(getDocumentById(documentId)!);
  };

  const getDocumentById = (id: string) => {
    return documents.find(doc => doc.id === id);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Transport Documentation</h2>
        <Button onClick={() => setShowUploadForm(true)}>
          <Upload className="h-4 w-4 mr-2" />
          Upload Document
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Documents</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <FileText className="h-8 w-8 text-blue-600" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
            </div>
            <div className="h-8 w-8 bg-yellow-100 rounded-full flex items-center justify-center">
              <span className="text-yellow-600 text-sm">⏳</span>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Approved</p>
              <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
            </div>
            <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-green-600 text-sm">✅</span>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Rejected</p>
              <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
            </div>
            <div className="h-8 w-8 bg-red-100 rounded-full flex items-center justify-center">
              <span className="text-red-600 text-sm">❌</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Alerts */}
      {stats.requiredMissing > 0 && (
        <Card className="p-4 border-yellow-200 bg-yellow-50">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-yellow-600" />
            <div>
              <h4 className="font-medium text-yellow-800">Missing Required Documents</h4>
              <p className="text-sm text-yellow-700">
                {stats.requiredMissing} required document types are missing from this transport
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Document List */}
      <DocumentList
        documents={documents}
        documentTypes={documentTypes}
        statusConfig={statusConfig}
        onUpload={() => setShowUploadForm(true)}
        onView={handleView}
        onApprove={handleApprove}
        onReject={handleReject}
      />

      {/* Upload Form Modal */}
      {showUploadForm && (
        <DocumentUpload
          documentTypes={documentTypes}
          onSubmit={handleUpload}
          onCancel={() => setShowUploadForm(false)}
        />
      )}

      {/* Document Preview Modal */}
      {selectedDocument && (
        <DocumentPreview
          document={selectedDocument}
          statusConfig={statusConfig}
          onClose={() => setSelectedDocument(null)}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      )}
    </div>
  );
}
