// src/components/products/document-verification.tsx
'use client';

import { File as FileIcon, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button, Card, DocumentUpload } from '@/components/ui';
import type { DocumentType, Document as UIDocument } from '@/components/ui/document-upload';

interface UploadedFile extends File {
  preview: string;
}

type DocumentVerificationProps = {
  onDocumentsVerified: (verified: boolean) => void;
  onFilesUploaded?: (files: File[]) => void;
  documentTypes: { value: DocumentType; label: string }[];
  required?: boolean;
};

export function DocumentVerification({
  onDocumentsVerified,
  onFilesUploaded,
  documentTypes,
  required = true,
}: DocumentVerificationProps) {
  const [uploadedDocs, setUploadedDocs] = useState<Record<string, boolean>>({});
  const [files, setFiles] = useState<UploadedFile[]>([]);

  useEffect(() => {
    // Cleanup object URLs to avoid memory leaks
    return () => {
      files.forEach(file => URL.revokeObjectURL(file.preview));
    };
  }, [files]);

  const handleDocumentUpload = (docs: UIDocument[]) => {
    // Convert UIDocument to UploadedFile for display
    const newFiles = docs.map(doc => {
      // Create a File object from the document data
      const file = new File([doc.name], doc.name, {
        type: doc.type === 'pdf' ? 'application/pdf' :
              doc.type === 'image' ? 'image/jpeg' :
              'application/octet-stream',
      });

      const uploadedFile = Object.assign(file, {
        preview: doc.url || '',
        type: doc.type,
      }) as UploadedFile;

      return uploadedFile;
    });

    setFiles(prev => [...prev, ...newFiles]);

    // Update verification status
    const verifiedDocs = { ...uploadedDocs };
    docs.forEach(doc => {
      verifiedDocs[doc.type] = true;
    });

    setUploadedDocs(verifiedDocs);
    const allVerified = documentTypes.every(docType => verifiedDocs[docType.value]);
    onDocumentsVerified(allVerified);

    // Notify parent component - we don't have actual File objects from UIDocument
    if (onFilesUploaded) {
      onFilesUploaded([]);
    }
  };

  const removeFile = (index: number) => {
    const newFiles = [...files];
    URL.revokeObjectURL(newFiles[index].preview);
    newFiles.splice(index, 1);
    setFiles(newFiles);

    // Update verification status
    const verifiedDocs = { ...uploadedDocs };
    delete verifiedDocs[files[index].name];
    setUploadedDocs(verifiedDocs);

    const allVerified = documentTypes.every(doc => verifiedDocs[doc.label]);
    onDocumentsVerified(allVerified);
  };

  return (
    <Card className="p-6 space-y-4">
      <div>
        <h3 className="text-lg font-semibold">Document Verification</h3>
        <p className="text-sm text-muted-foreground">
          {required
            ? 'Please upload the required documents to verify this product.'
            : 'Additional supporting documents (optional)'}
        </p>
      </div>

      <DocumentUpload
        acceptedTypes={documentTypes.map(dt => dt.value)}
        onUpload={handleDocumentUpload}
      />

      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          <h3 className="text-sm font-medium">Uploaded Documents</h3>
          <div className="space-y-2">
            {files.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-md">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-muted rounded">
                    <FileIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium truncate max-w-xs">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {Math.round(file.size / 1024)} KB · {file.type}
                    </p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(index)}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Remove file</span>
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {required && documentTypes.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium mb-2">Required Documents</h4>
          <ul className="space-y-1 text-sm text-muted-foreground">
            {documentTypes.map((doc, index) => (
              <li key={index} className="flex items-center">
                <span className={`inline-block w-2 h-2 rounded-full mr-2 ${
                  uploadedDocs[doc.label] ? 'bg-emerald-500' : 'bg-muted-foreground/30'
                }`}></span>
                {doc.label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  );
}
