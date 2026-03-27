// src/components/logistics/transportDocumentation/DocumentPreview.tsx
'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Download, Eye, FileText, Calendar, User, HardDrive } from 'lucide-react';
import { TransportDocument } from './hooks/useTransportDocumentation';

interface DocumentPreviewProps {
  document: TransportDocument;
  statusConfig: Record<string, { color: string; icon: string; label: string }>;
  onClose: () => void;
  onApprove?: (documentId: string) => void;
  onReject?: (documentId: string) => void;
}

export function DocumentPreview({ document, statusConfig, onClose, onApprove, onReject }: DocumentPreviewProps) {
  const status = statusConfig[document.status];

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
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getDocumentTypeLabel = (type: string) => {
    const typeMap: Record<string, string> = {
      'bill-of-lading': 'Bill of Lading',
      'delivery-confirmation': 'Delivery Confirmation',
      'vehicle-inspection': 'Vehicle Inspection',
      'driver-certification': 'Driver Certification',
      'insurance': 'Insurance',
      'registration': 'Registration'
    };
    return typeMap[type] || type;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-50 rounded-full">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">{document.title}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <Badge className={`${status.color} text-sm`}>
                    <span className="mr-1">{status.icon}</span>
                    {status.label}
                  </Badge>
                  <span className="text-sm text-gray-500">
                    {getDocumentTypeLabel(document.type)}
                  </span>
                </div>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Document Information */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Document Information</h3>
              <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Document ID</span>
                  <span className="text-sm font-medium">{document.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Type</span>
                  <span className="text-sm font-medium">{getDocumentTypeLabel(document.type)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">File Size</span>
                  <span className="text-sm font-medium">{formatFileSize(document.fileSize)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Status</span>
                  <Badge className={`${status.color} text-xs`}>
                    {status.label}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Upload Details */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Upload Details</h3>
              <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-400" />
                  <div>
                    <span className="text-sm text-gray-600">Uploaded By</span>
                    <p className="text-sm font-medium">{document.uploadedBy}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <div>
                    <span className="text-sm text-gray-600">Upload Date</span>
                    <p className="text-sm font-medium">{formatDate(document.uploadedAt)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Metadata */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Document Details</h3>
              <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
                {Object.entries(document.metadata).filter(([_, value]) => value).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <span className="text-sm text-gray-600 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}:
                    </span>
                    <span className="text-sm font-medium">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Document Preview */}
          <div className="mt-6">
            <h3 className="font-semibold text-gray-900 mb-4">Document Preview</h3>
            <div className="bg-gray-50 rounded-lg p-8 flex items-center justify-center min-h-[400px]">
              {document.fileUrl.endsWith('.pdf') ? (
                <div className="text-center">
                  <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">PDF Document Preview</p>
                  <Button
                    onClick={() => window.open(document.fileUrl, '_blank')}
                    className="inline-flex items-center gap-2"
                  >
                    <Eye className="h-4 w-4" />
                    Open Document
                  </Button>
                </div>
              ) : (
                <div className="text-center">
                  <HardDrive className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">File Preview Not Available</p>
                  <Button
                    onClick={() => window.open(document.fileUrl, '_blank')}
                    className="inline-flex items-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Download File
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-between items-center mt-6 pt-6 border-t">
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => window.open(document.fileUrl, '_blank')}
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              <Button
                variant="outline"
                onClick={() => window.open(document.fileUrl, '_blank')}
              >
                <Eye className="h-4 w-4 mr-2" />
                View
              </Button>
            </div>

            {document.status === 'pending' && (
              <div className="flex gap-3">
                {onReject && (
                  <Button
                    variant="outline"
                    onClick={() => onReject(document.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    Reject
                  </Button>
                )}
                {onApprove && (
                  <Button
                    onClick={() => onApprove(document.id)}
                    className="text-white bg-green-600 hover:bg-green-700"
                  >
                    Approve
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
