// src/components/logistics/transportDocumentation.tsx
'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { FileText, Upload, Download, Eye, CheckCircle, XCircle, Clock, Plus, AlertTriangle } from 'lucide-react';
import { TransportDocument, DocumentType } from '@/types/logistics';

interface TransportDocumentationProps {
  transportId?: string;
  onDocumentUpdate?: (document: TransportDocument) => void;
}

export function TransportDocumentation({ transportId, onDocumentUpdate }: TransportDocumentationProps) {
  const [documents, setDocuments] = useState<TransportDocument[]>([]);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [newDocument, setNewDocument] = useState({
    type: 'bill-of-lading' as DocumentType,
    title: '',
    fileUrl: '',
    metadata: {
      billOfLadingNumber: '',
      deliveryConfirmationNumber: '',
      inspectionDate: '',
      certificateNumber: ''
    }
  });

  const documentTypes: { value: DocumentType; label: string; description: string; required: boolean }[] = [
    { value: 'bill-of-lading', label: 'Bill of Lading', description: 'Transport contract and receipt', required: true },
    { value: 'delivery-confirmation', label: 'Delivery Confirmation', description: 'Proof of delivery signature', required: true },
    { value: 'vehicle-inspection', label: 'Vehicle Inspection', description: 'Pre-trip vehicle inspection report', required: false },
    { value: 'driver-certification', label: 'Driver Certification', description: 'Driver license and certifications', required: false },
    { value: 'insurance', label: 'Insurance', description: 'Vehicle and cargo insurance documents', required: false },
    { value: 'registration', label: 'Registration', description: 'Vehicle registration documents', required: false }
  ];

  const statusConfig = {
    pending: { color: 'bg-yellow-100 text-yellow-800', icon: '⏳', label: 'Pending' },
    approved: { color: 'bg-green-100 text-green-800', icon: '✅', label: 'Approved' },
    rejected: { color: 'bg-red-100 text-red-800', icon: '❌', label: 'Rejected' }
  };

  useEffect(() => {
    // Mock data - replace with API call
    const mockDocuments: TransportDocument[] = [
      {
        id: 'doc1',
        type: 'bill-of-lading',
        title: 'Bill of Lading - PRD-2024-001',
        fileUrl: '/documents/bol-prd-2024-001.pdf',
        uploadedAt: '2025-01-20T10:00:00Z',
        uploadedBy: 'logistics@company.com',
        status: 'approved',
        metadata: {
          billOfLadingNumber: 'BL-2025-001234',
          inspectionDate: '2025-01-20',
          certificateNumber: 'CERT-2025-001'
        }
      },
      {
        id: 'doc2',
        type: 'vehicle-inspection',
        title: 'Pre-Trip Inspection - CA 123456',
        fileUrl: '/documents/inspection-ca-123456.pdf',
        uploadedAt: '2025-01-20T09:30:00Z',
        uploadedBy: 'driver1@company.com',
        status: 'approved',
        metadata: {
          inspectionDate: '2025-01-20'
        }
      },
      {
        id: 'doc3',
        type: 'delivery-confirmation',
        title: 'Delivery Confirmation - Fresh Market',
        fileUrl: '/documents/delivery-confirmation-pending.jpg',
        uploadedAt: '2025-01-25T14:00:00Z',
        uploadedBy: 'retailer@store.com',
        status: 'pending',
        metadata: {
          deliveryConfirmationNumber: 'DC-2025-005678'
        }
      }
    ];

    setDocuments(mockDocuments);
  }, [transportId]);

  const handleUploadDocument = () => {
    const documentData: TransportDocument = {
      id: `doc${Date.now()}`,
      type: newDocument.type,
      title: newDocument.title,
      fileUrl: newDocument.fileUrl || `/documents/${newDocument.title.toLowerCase().replace(/\s+/g, '-')}.pdf`,
      uploadedAt: new Date().toISOString(),
      uploadedBy: 'current-user',
      status: 'pending',
      metadata: Object.fromEntries(
        Object.entries(newDocument.metadata).filter(([_, value]) => value !== '')
      )
    };

    setDocuments([...documents, documentData]);
    setNewDocument({
      type: 'bill-of-lading',
      title: '',
      fileUrl: '',
      metadata: {
        billOfLadingNumber: '',
        deliveryConfirmationNumber: '',
        inspectionDate: '',
        certificateNumber: ''
      }
    });
    setShowUploadForm(false);
    onDocumentUpdate?.(documentData);
  };

  const handleApproveDocument = (documentId: string) => {
    setDocuments(documents.map(doc => 
      doc.id === documentId 
        ? { ...doc, status: 'approved' as const }
        : doc
    ));
  };

  const handleRejectDocument = (documentId: string) => {
    setDocuments(documents.map(doc => 
      doc.id === documentId 
        ? { ...doc, status: 'rejected' as const }
        : doc
    ));
  };

  const getRequiredDocuments = () => {
    return documentTypes.filter(type => type.required);
  };

  const getDocumentStatus = (type: DocumentType) => {
    const doc = documents.find(d => d.type === type);
    return doc?.status || 'missing';
  };

  const isAllRequiredDocumentsUploaded = () => {
    return getRequiredDocuments().every(type => 
      documents.some(doc => doc.type === type.value && doc.status === 'approved')
    );
  };

  const renderMetadataFields = () => {
    const typeConfig = documentTypes.find(t => t.value === newDocument.type);
    
    switch (newDocument.type) {
      case 'bill-of-lading':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bill of Lading Number</label>
              <Input
                value={newDocument.metadata.billOfLadingNumber}
                onChange={(e) => setNewDocument({
                  ...newDocument,
                  metadata: { ...newDocument.metadata, billOfLadingNumber: e.target.value }
                })}
                placeholder="e.g., BL-2025-001234"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Certificate Number</label>
              <Input
                value={newDocument.metadata.certificateNumber}
                onChange={(e) => setNewDocument({
                  ...newDocument,
                  metadata: { ...newDocument.metadata, certificateNumber: e.target.value }
                })}
                placeholder="e.g., CERT-2025-001"
              />
            </div>
          </div>
        );
      
      case 'delivery-confirmation':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Confirmation Number</label>
            <Input
              value={newDocument.metadata.deliveryConfirmationNumber}
              onChange={(e) => setNewDocument({
                ...newDocument,
                metadata: { ...newDocument.metadata, deliveryConfirmationNumber: e.target.value }
              })}
              placeholder="e.g., DC-2025-005678"
            />
          </div>
        );
      
      case 'vehicle-inspection':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Inspection Date</label>
            <Input
              type="date"
              value={newDocument.metadata.inspectionDate}
              onChange={(e) => setNewDocument({
                ...newDocument,
                metadata: { ...newDocument.metadata, inspectionDate: e.target.value }
              })}
            />
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 sm:gap-4">
        <div className="min-w-0">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-700 truncate">Transport Documentation</h2>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
          {isAllRequiredDocumentsUploaded() ? (
            <Badge className="bg-green-100 text-green-800 text-xs whitespace-nowrap">
              <CheckCircle className="h-3 w-3 mr-1" />
              All Required Documents
            </Badge>
          ) : (
            <Badge className="bg-yellow-100 text-yellow-800 text-xs whitespace-nowrap">
              <AlertTriangle className="h-3 w-3 mr-1" />
              Missing Required Documents
            </Badge>
          )}
          <Button 
            onClick={() => setShowUploadForm(!showUploadForm)}
            className="bg-sky-600 hover:bg-sky-700 text-white text-xs sm:text-sm"
          >
            <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            Upload Document
          </Button>
        </div>
      </div>

      {/* Required Documents Status */}
      <Card className="p-3 sm:p-4 lg:p-6">
        <h3 className="text-base sm:text-lg font-medium mb-3 sm:mb-4">Required Documents Status</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {getRequiredDocuments().map((type) => {
            const status = getDocumentStatus(type.value);
            const statusConfigItem = status === 'approved' ? statusConfig.approved :
                                     status === 'rejected' ? statusConfig.rejected :
                                     status === 'pending' ? statusConfig.pending :
                                     { color: 'bg-gray-100 text-gray-600', icon: '📄', label: 'Missing' };

            return (
              <div key={type.value} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-700">{type.label}</h4>
                  <p className="text-sm text-gray-600">{type.description}</p>
                </div>
                <Badge variant="info" className={statusConfigItem.color}>
                  {statusConfigItem.icon} {statusConfigItem.label}
                </Badge>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Upload Document Form */}
      {showUploadForm && (
        <Card className="p-3 sm:p-4 lg:p-6">
          <h3 className="text-base sm:text-lg font-medium mb-3 sm:mb-4">Upload New Document</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Document Type</label>
              <select
                value={newDocument.type}
                onChange={(e) => setNewDocument({...newDocument, type: e.target.value as DocumentType})}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                {documentTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.required ? '⚠️ ' : ''}{type.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Document Title</label>
              <Input
                value={newDocument.title}
                onChange={(e) => setNewDocument({...newDocument, title: e.target.value})}
                placeholder="e.g., Bill of Lading - PRD-2024-001"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">File Upload</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-1">Click to upload or drag and drop</p>
                <p className="text-xs text-gray-500">PDF, JPG, PNG up to 10MB</p>
                <Input
                  type="file"
                  className="hidden"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setNewDocument({...newDocument, title: file.name});
                    }
                  }}
                />
              </div>
            </div>

            <div className="md:col-span-2">
              {renderMetadataFields()}
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setShowUploadForm(false)}>
              Cancel
            </Button>
            <Button onClick={handleUploadDocument}>
              Upload Document
            </Button>
          </div>
        </Card>
      )}

      {/* Documents List */}
      <div className="space-y-3 sm:space-y-4">
        {documents.map((document) => {
          const typeConfig = documentTypes.find(t => t.value === document.type);
          const statusConfigItem = statusConfig[document.status];

          return (
            <Card key={document.id} className="p-3 sm:p-4 lg:p-6">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3 sm:mb-4">
                <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                  <div className="p-1.5 sm:p-2 bg-sky-100 rounded-lg shadow-lg flex-shrink-0">
                    <FileText className="h-4 w-4 sm:h-5 lg:h-6 text-sky-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-700 text-sm sm:text-base truncate" title={document.title}>{document.title}</h3>
                    <p className="text-xs sm:text-sm text-gray-600">{typeConfig?.description}</p>
                    <p className="text-xs text-gray-500">
                      Uploaded by {document.uploadedBy} on {new Date(document.uploadedAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1 sm:gap-2 flex-shrink-0">
                  <Badge variant="info" className={`${statusConfigItem.color} text-xs whitespace-nowrap`}>
                    {statusConfigItem.icon} {statusConfigItem.label}
                  </Badge>
                  {typeConfig?.required && (
                    <Badge className="bg-red-100 text-red-800 text-xs whitespace-nowrap">
                      Required
                    </Badge>
                  )}
                </div>
              </div>

              {/* Document Metadata */}
              {Object.keys(document.metadata || {}).length > 0 && (
                <div className="mt-3 sm:mt-4 p-3 bg-gray-50 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Document Details</h4>
                  <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm">
                    {Object.entries(document.metadata || {}).map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span className="text-gray-600 capitalize">
                          {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </span>
                        <span className="font-medium truncate ml-2">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
                          {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-2 mt-3 sm:mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(document.fileUrl, '_blank')}
                  className="flex-1 text-xs sm:text-sm"
                >
                  <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                  View
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(document.fileUrl, '_blank')}
                  className="flex-1 text-xs sm:text-sm"
                >
                  <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                  Download
                </Button>
                {document.status === 'pending' && (
                  <div className="flex flex-col sm:flex-row gap-2 mt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleApproveDocument(document.id)}
                      className="text-green-600 border-green-300 hover:bg-green-50 text-xs sm:text-sm"
                    >
                      <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                      Approve
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRejectDocument(document.id)}
                      className="text-red-600 border-red-300 hover:bg-red-50 text-xs sm:text-sm"
                    >
                      <XCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                      Reject
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Compliance Summary */}
      <Card className="p-3 sm:p-4 lg:p-6">
        <h3 className="text-base sm:text-lg font-medium mb-3 sm:mb-4">Compliance Summary</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {documents.filter(d => d.status === 'approved').length}
            </div>
            <p className="text-sm text-green-800">Approved Documents</p>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">
              {documents.filter(d => d.status === 'pending').length}
            </div>
            <p className="text-sm text-yellow-800">Pending Review</p>
          </div>
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <div className="text-2xl font-bold text-red-600">
              {getRequiredDocuments().length - documents.filter(d => 
                getRequiredDocuments().some(req => req.value === d.type && d.status === 'approved')
              ).length}
            </div>
            <p className="text-sm text-red-800">Missing Required</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
