// src/lib/documentTypes.ts
import { type DocumentType } from '@/components/ui/document-upload';

export const productCertificationDocs: { value: DocumentType; label: string }[] = [
  { value: 'certification', label: 'Production Records' },
  { value: 'certification', label: 'Quality Certificate' },
  { value: 'certification', label: 'Safety Inspection Report' },
  { value: 'certification', label: 'Proof of Origin' },
];
