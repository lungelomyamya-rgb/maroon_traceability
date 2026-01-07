// src/lib/documentTypes.ts
import { type DocumentType } from '@/components/ui/document-upload';

export const productCertificationDocs: { value: DocumentType; label: string }[] = [
  { value: 'certificate', label: 'Production Records' },
  { value: 'inspection', label: 'Quality Certificate' },
  { value: 'transport', label: 'Safety Inspection Report' },
  { value: 'quality', label: 'Proof of Origin' },
  { value: 'compliance', label: 'Farm Registration' },
  { value: 'certificate', label: 'Address Proof' },
  { value: 'inspection', label: 'Business Registration' },
  { value: 'transport', label: 'Other Documentation' },
];
