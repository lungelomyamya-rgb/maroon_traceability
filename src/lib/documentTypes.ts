// src/lib/documentTypes.ts
import { type DocumentType } from '@/components/ui/document-upload';

export const productCertificationDocs: { value: DocumentType; label: string }[] = [
  { value: 'certificate', label: 'Production Records' },
  { value: 'pdf', label: 'Quality Certificate' },
  { value: 'image', label: 'Safety Inspection Report' },
  { value: 'other', label: 'Proof of Origin' },
  { value: 'registration', label: 'Farm Registration' },
  { value: 'certificate', label: 'Address Proof' },
  { value: 'permit', label: 'Business Registration' },
  { value: 'bank', label: 'Other Documentation' },
];
