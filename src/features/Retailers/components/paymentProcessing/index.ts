// src/components/retailers/paymentProcessing/index.ts

/**
 * Payment Processing Feature Module
 * 
 * This module provides comprehensive payment processing functionality with:
 * - Payment metrics and analytics
 * - Transaction management and filtering
 * - Payment gateway configuration
 * - Transaction details and receipts
 * - Refund processing
 * 
 * @example
 * ```tsx
 * import { PaymentProcessing } from '@/features/retailers/components/paymentProcessing';
 * 
 * function PaymentsPage() {
 *   return (
 *     <PaymentProcessing 
 *       title="Payment Management"
 *     />
 *   );
 * }
 * ```
 */

// Main component
export { PaymentProcessing } from './PaymentProcessing';

// Sub-components for granular usage
export { PaymentGateways } from './PaymentGateways';
export { TransactionList } from './TransactionList';
export { TransactionDetails } from './TransactionDetails';

// Custom hooks
export { usePaymentProcessing } from './hooks/usePaymentProcessing';

// Types
export type { PaymentGateway, Transaction, PaymentMetrics } from './hooks/usePaymentProcessing';

// Feature metadata
export const paymentProcessingFeature = {
  name: 'Payment Processing',
  description: 'Comprehensive payment processing and management system',
  version: '1.0.0',
  components: {
    PaymentProcessing: 'Main payment processing component',
    PaymentGateways: 'Payment gateway management',
    TransactionList: 'Transaction list with filtering',
    TransactionDetails: 'Detailed transaction view',
  },
  hooks: {
    usePaymentProcessing: 'Payment processing data management and state',
  },
  dependencies: {
    ui: ['@/components/ui/card', '@/components/ui/button', '@/components/ui/badge', '@/components/ui/input', '@/components/ui/select'],
    icons: ['lucide-react'],
    types: ['@/types/payment', '@/types/transaction'],
  },
};

// Default export for convenience
export { PaymentProcessing as default } from './PaymentProcessing';
