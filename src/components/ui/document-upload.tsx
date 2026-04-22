import { Upload, File, X } from 'lucide-react';
import * as React from 'react';
import { Button } from './button';
import { Card } from './card';

export type DocumentType = 'pdf' | 'image' | 'certificate' | 'other' | 'id' | 'address' | 'farm' | 'vet' | 'permit' | 'registration' | 'tax' | 'bank'

export interface Document {
  id: string
  name: string
  type: DocumentType
  size: number
  url?: string
  uploadedAt?: string
}

interface DocumentUploadProps {
  onUpload: (documents: Document[]) => void
  acceptedTypes?: DocumentType[]
  maxFiles?: number
  maxSize?: number
  className?: string
}

export function DocumentUpload({
  onUpload,
  acceptedTypes = ['pdf', 'image', 'certificate'],
  maxFiles = 5,
  maxSize = 10 * 1024 * 1024, // 10MB
  className,
}: DocumentUploadProps) {
  const [dragActive, setDragActive] = React.useState(false);
  const [files, setFiles] = React.useState<File[]>([]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    processFiles(droppedFiles);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      processFiles(selectedFiles);
    }
  };

  const processFiles = (newFiles: File[]) => {
    const validFiles = newFiles.filter(file => {
      const fileType = getDocumentType(file);
      const isValidType = acceptedTypes.includes(fileType);
      const isValidSize = file.size <= maxSize;
      return isValidType && isValidSize;
    });

    const totalFiles = [...files, ...validFiles].slice(0, maxFiles);
    setFiles(totalFiles);

    const documents: Document[] = totalFiles.map((file, index) => ({
      id: `${Date.now()}-${index}`,
      name: file.name,
      type: getDocumentType(file),
      size: file.size,
      uploadedAt: new Date().toISOString(),
    }));

    onUpload(documents);
  };

  const getDocumentType = (file: File): DocumentType => {
    const extension = file.name.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif'].includes(extension || '')) {
return 'image';
}
    if (extension === 'pdf') {
return 'pdf';
}
    if (['cert', 'certificate'].includes(extension || '')) {
return 'certificate';
}
    return 'other';
  };

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);

    const documents: Document[] = newFiles.map((file, i) => ({
      id: `${Date.now()}-${i}`,
      name: file.name,
      type: getDocumentType(file),
      size: file.size,
      uploadedAt: new Date().toISOString(),
    }));

    onUpload(documents);
  };

  return (
    <Card className={className}>
      <div className="p-6">
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragActive
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-lg font-medium text-gray-900 mb-2">
            Drop files here or click to upload
          </p>
          <p className="text-sm text-gray-500 mb-4">
            {acceptedTypes.join(', ')} files up to {maxSize / 1024 / 1024}MB
          </p>
          <input
            type="file"
            multiple
            accept={acceptedTypes.map(type => `.${type}`).join(',')}
            onChange={handleChange}
            className="hidden"
            id="file-upload"
          />
          <Button asChild>
            <label htmlFor="file-upload" className="cursor-pointer">
              Select Files
            </label>
          </Button>
        </div>

        {files.length > 0 && (
          <div className="mt-4 space-y-2">
            <h4 className="font-medium text-gray-900">Selected Files:</h4>
            {files.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <div className="flex items-center space-x-2">
                  <File className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-700">{file.name}</span>
                  <span className="text-xs text-gray-500">
                    ({(file.size / 1024).toFixed(1)} KB)
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}
