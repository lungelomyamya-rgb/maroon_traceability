'use client';

import { useState, useCallback } from 'react';
import { Upload, FileText, X, CheckCircle } from 'lucide-react';
import { Button } from './button';

export type DocumentType = 'id' | 'address' | 'registration' | 'certification' | 'other' | 'farm' | 'vet' | 'permit' | 'tax' | 'bank';

interface Document {
  id: string;
  file: File;
  type: DocumentType;
  name: string;
  size: number;
  uploadedAt: Date;
  status: 'uploading' | 'uploaded' | 'error';
}

interface DocumentUploadProps {
  onUpload: (documents: Document[]) => void;
  documentTypes: { value: DocumentType; label: string; required?: boolean }[];
  multiple?: boolean;
  maxSizeMB?: number;
  className?: string;
}

export const DocumentUpload = ({ 
  onUpload, 
  documentTypes, 
  multiple = false, 
  maxSizeMB = 10, 
  className = '' 
}: DocumentUploadProps) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) setIsDragging(true);
  }, [isDragging]);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleFiles = useCallback((files: File[]) => {
    const newDocuments = files.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      type: 'other' as DocumentType,
      name: file.name,
      size: file.size,
      uploadedAt: new Date(),
      status: 'uploading' as const
    }));

    setDocuments(prev => [...prev, ...newDocuments]);
    // Simulate file upload
    setTimeout(() => {
      setDocuments(prev => 
        prev.map(doc => 
          newDocuments.some(d => d.id === doc.id) 
            ? { ...doc, status: 'uploaded' as const } 
            : doc
        )
      );
      onUpload(newDocuments);
    }, 1500);
  }, [onUpload]);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  }, [handleFiles]);

  const simulateUpload = (docs: Document[]) => {
    docs.forEach(doc => {
      // Simulate upload progress
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 20;
        if (progress >= 100) {
          clearInterval(interval);
          setDocuments(prev => 
            prev.map(d => 
              d.id === doc.id 
                ? { ...d, status: 'uploaded' as const } 
                : d
            )
          );
          setUploadProgress(prev => {
            const newProgress = { ...prev };
            delete newProgress[doc.id];
            return newProgress;
          });
          onUpload(docs);
        } else {
          setUploadProgress(prev => ({
            ...prev,
            [doc.id]: progress
          }));
        }
      }, 200);
    });
  };

  const removeDocument = (id: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== id));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Helper function to handle file input changes
  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(Array.from(e.target.files));
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragging ? 'border-primary bg-primary/10' : 'border-muted-foreground/30'
        } hover:border-primary/50 hover:bg-primary/5 dark:border-muted-foreground/20 dark:hover:border-primary/30`}
      >
        <div className="flex flex-col items-center justify-center space-y-2">
          <Upload className="h-10 w-10 text-muted-foreground" />
          <div className="text-sm text-muted-foreground">
            <label
              htmlFor="document-upload"
              className="relative cursor-pointer font-medium text-primary hover:text-primary/80"
            >
              <span>Upload a file</span>
              <input
                id="document-upload"
                name="document-upload"
                type="file"
                className="sr-only"
                multiple={multiple}
                onChange={handleFileInput}
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              />
            </label>{' '}
            or drag and drop
          </div>
          <p className="text-xs text-muted-foreground">
            PDF, DOC, JPG, or PNG (max {maxSizeMB}MB)
          </p>
        </div>
      </div>

      {documents.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Uploaded Documents</h4>
          <div className="space-y-2">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border border-border"
              >
                <div className="flex items-center space-x-3">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{doc.name}</p>
                    <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                      <span>{formatFileSize(doc.size)}</span>
                      <span>•</span>
                      <span className="capitalize">{doc.type}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {doc.status === 'uploading' && (
                    <div className="w-20 h-1.5 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary transition-all duration-300"
                        style={{ width: `${uploadProgress[doc.id] || 0}%` }}
                      />
                    </div>
                  )}
                  {doc.status === 'uploaded' && (
                    <CheckCircle className="h-4 w-4 text-success" />
                  )}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7"
                    onClick={() => removeDocument(doc.id)}
                  >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Remove</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {documentTypes.map((docType) => {
          const hasUploadedDoc = documents.some(doc => doc.type === docType.value);
          
          return (
            <div key={docType.value} className="p-3 bg-muted/10 rounded-lg border border-border">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium">{docType.label}</h4>
                  <p className="text-xs text-muted-foreground">
                    {docType.required ? 'Required' : 'Optional'}
                    {hasUploadedDoc && (
                      <span className="ml-2 text-success flex items-center">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Uploaded
                      </span>
                    )}
                  </p>
                </div>
                {!hasUploadedDoc && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const input = document.createElement('input');
                      input.type = 'file';
                      input.accept = '.pdf,.doc,.docx,.jpg,.jpeg,.png';
                      input.onchange = (e) => {
                        const files = (e.target as HTMLInputElement).files;
                        if (files && files.length > 0) {
                          const newDoc = {
                            id: Math.random().toString(36).substr(2, 9),
                            file: files[0],
                            type: docType.value as DocumentType,
                            name: files[0].name,
                            size: files[0].size,
                            uploadedAt: new Date(),
                            status: 'uploading' as const,
                          };
                          setDocuments(prev => [...prev, newDoc]);
                          simulateUpload([newDoc]);
                        }
                      };
                      input.click();
                    }}
                  >
                    Upload
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DocumentUpload;
