// src/components/ui/document-upload.tsx
import React from 'react';

export type DocumentType = 'certificate' | 'inspection' | 'transport' | 'quality' | 'compliance' | 'id' | 'address' | 'farm' | 'vet' | 'permit' | 'tax' | 'bank' | 'registration';

interface DocumentUploadProps {
  children?: React.ReactNode;
  accept?: string;
  multiple?: boolean;
  onUpload?: (files: File[]) => void;
  documentTypes?: any[];
  className?: string;
}

export function DocumentUpload({ children, accept, multiple = false, onUpload, className = '' }: DocumentUploadProps) {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && onUpload) {
      onUpload(Array.from(files));
    }
  };

  return (
    <div className={`border-2 border-dashed border-gray-300 rounded-lg p-6 text-center ${className}`}>
      <input
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleFileChange}
        className="hidden"
        id="document-upload"
      />
      <label htmlFor="document-upload" className="cursor-pointer">
        {children || (
          <div>
            <div className="text-gray-400">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88 7.903A3 3 0 1110-5.654z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 13h3m-3-8v8m0 0l3 3m-3-8a3 3 0 00-6 0z" />
              </svg>
            </div>
            <p className="mt-2 text-sm text-gray-600">
              Click to upload documents
            </p>
          </div>
        )}
      </label>
    </div>
  );
}
