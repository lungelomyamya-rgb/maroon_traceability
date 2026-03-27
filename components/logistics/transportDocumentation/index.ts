// src/components/logistics/transportDocumentation/index.ts

/**
 * Transport Documentation Feature Module
 * 
 * This module provides comprehensive transport documentation functionality with:
 * - Document upload and management
 * - Document preview and viewing
 * - Document approval workflow
 * - Metadata tracking for different document types
 * - Status management and filtering
 * - File size and format handling
 * 
 * @example
 * ```tsx
 * import { TransportDocumentation } from '@/components/logistics/transportDocumentation';
 * 
 * function TransportPage() {
 *   return (
 *     <TransportDocumentation 
 *       transportId="trk-001"
 *       onDocumentUpdate={(doc) => console.log('Updated:', doc)}
 *     />
 *   );
 * }
 * ```
 */

// Main component
export { TransportDocumentation } from './TransportDocumentation';

// Sub-components for granular usage
export { DocumentUpload } from './DocumentUpload';
export { DocumentList } from './DocumentList';
export { DocumentPreview } from './DocumentPreview';

// Custom hooks
export { useTransportDocumentation } from './hooks/useTransportDocumentation';

// Types
export type { TransportDocument, DocumentType } from './hooks/useTransportDocumentation';

// Feature metadata
export const transportDocumentationFeature = {
  name: 'Transport Documentation',
  description: 'Comprehensive transport document management system',
  version: '1.0.0',
  components: {
    TransportDocumentation: 'Main transport documentation component',
    DocumentUpload: 'Document upload form with metadata',
    DocumentList: 'Document list with filtering and actions',
    DocumentPreview: 'Document preview modal with approval workflow'
  },
  hooks: {
    useTransportDocumentation: 'Transport documentation state management'
  },
  dependencies: {
    ui: ['@/components/ui/card', '@/components/ui/button', '@/components/ui/badge', '@/components/ui/input', '@/components/ui/textarea', '@/components/ui/select', '@/components/ui/label'],
    icons: ['lucide-react']
  }
};

// Default export for convenience
export { TransportDocumentation as default } from './TransportDocumentation';
