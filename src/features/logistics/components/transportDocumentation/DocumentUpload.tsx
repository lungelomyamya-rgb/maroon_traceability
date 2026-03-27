// src/components/logistics/transportDocumentation/DocumentUpload.tsx
'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, X, FileText, AlertTriangle } from 'lucide-react';
import { DocumentType, NewDocument } from './hooks/useTransportDocumentation';

interface DocumentUploadProps {
  documentTypes: { value: DocumentType; label: string; description: string; required: boolean }[];
  onSubmit: (document: NewDocument) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function DocumentUpload({ documentTypes, onSubmit, onCancel, isLoading = false }: DocumentUploadProps) {
  const [formData, setFormData] = useState<NewDocument>({
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

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleInputChange = (field: keyof NewDocument, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleMetadataChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      metadata: { ...prev.metadata, [field]: value }
    }));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setFormData(prev => ({
        ...prev,
        title: prev.title || file.name,
        fileUrl: URL.createObjectURL(file)
      }));
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    setFormData(prev => ({
      ...prev,
      fileUrl: ''
    }));
  };

  const selectedType = documentTypes.find(type => type.value === formData.type);
  const requiredMetadata = getRequiredMetadata(formData.type);

  function getRequiredMetadata(type: DocumentType): string[] {
    switch (type) {
      case 'bill-of-lading':
        return ['billOfLadingNumber'];
      case 'delivery-confirmation':
        return ['deliveryConfirmationNumber'];
      case 'vehicle-inspection':
        return ['inspectionDate'];
      case 'driver-certification':
        return ['certificateNumber'];
      case 'insurance':
        return ['certificateNumber'];
      case 'registration':
        return ['certificateNumber'];
      default:
        return [];
    }
  }

  return (
    <Card className="p-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Upload Document</h3>
        <Button variant="ghost" size="sm" onClick={onCancel}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Document Type */}
        <div>
          <Label htmlFor="type" className="text-sm font-medium text-gray-700">
            Document Type
          </Label>
          <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value as DocumentType)}>
            <SelectTrigger>
              <SelectValue placeholder="Select document type" />
            </SelectTrigger>
            <SelectContent>
              {documentTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  <div>
                    <div className="font-medium">{type.label}</div>
                    <div className="text-sm text-gray-500">{type.description}</div>
                    {type.required && <div className="text-xs text-red-600">Required</div>}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {selectedType && (
            <p className="text-xs text-gray-500 mt-1">{selectedType.description}</p>
          )}
        </div>

        {/* Document Title */}
        <div>
          <Label htmlFor="title" className="text-sm font-medium text-gray-700">
            Document Title
          </Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            placeholder="Enter document title"
            required
          />
        </div>

        {/* File Upload */}
        <div>
          <Label className="text-sm font-medium text-gray-700">
            Document File
          </Label>
          <div className="mt-2">
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 mb-3 text-gray-400" />
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">PDF, DOC, DOCX up to 10MB</p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                />
              </label>
            </div>

            {selectedFile && (
              <div className="mt-3 p-3 bg-gray-50 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-700">{selectedFile.name}</span>
                  <span className="text-xs text-gray-500">
                    ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                  </span>
                </div>
                <Button type="button" variant="ghost" size="sm" onClick={clearFile}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Metadata Fields */}
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-3">
            Document Information
          </Label>
          <div className="space-y-4">
            {requiredMetadata.includes('billOfLadingNumber') && (
              <div>
                <Label htmlFor="billOfLadingNumber" className="text-sm text-gray-600">
                  Bill of Lading Number
                </Label>
                <Input
                  id="billOfLadingNumber"
                  value={formData.metadata.billOfLadingNumber}
                  onChange={(e) => handleMetadataChange('billOfLadingNumber', e.target.value)}
                  placeholder="e.g., BOL-2024-001234"
                  required
                />
              </div>
            )}

            {requiredMetadata.includes('deliveryConfirmationNumber') && (
              <div>
                <Label htmlFor="deliveryConfirmationNumber" className="text-sm text-gray-600">
                  Delivery Confirmation Number
                </Label>
                <Input
                  id="deliveryConfirmationNumber"
                  value={formData.metadata.deliveryConfirmationNumber}
                  onChange={(e) => handleMetadataChange('deliveryConfirmationNumber', e.target.value)}
                  placeholder="e.g., DC-2024-005678"
                  required
                />
              </div>
            )}

            {requiredMetadata.includes('inspectionDate') && (
              <div>
                <Label htmlFor="inspectionDate" className="text-sm text-gray-600">
                  Inspection Date
                </Label>
                <Input
                  id="inspectionDate"
                  type="date"
                  value={formData.metadata.inspectionDate}
                  onChange={(e) => handleMetadataChange('inspectionDate', e.target.value)}
                  required
                />
              </div>
            )}

            {requiredMetadata.includes('certificateNumber') && (
              <div>
                <Label htmlFor="certificateNumber" className="text-sm text-gray-600">
                  Certificate Number
                </Label>
                <Input
                  id="certificateNumber"
                  value={formData.metadata.certificateNumber}
                  onChange={(e) => handleMetadataChange('certificateNumber', e.target.value)}
                  placeholder="e.g., CERT-2024-001234"
                  required
                />
              </div>
            )}
          </div>
        </div>

        {/* Validation Warning */}
        {!selectedFile && (
          <div className="flex items-center gap-2 p-3 bg-yellow-50 rounded-lg">
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
            <span className="text-sm text-yellow-800">
              Please select a file to upload
            </span>
          </div>
        )}

        {/* Form Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading || !selectedFile}>
            {isLoading ? 'Uploading...' : 'Upload Document'}
          </Button>
        </div>
      </form>
    </Card>
  );
}
