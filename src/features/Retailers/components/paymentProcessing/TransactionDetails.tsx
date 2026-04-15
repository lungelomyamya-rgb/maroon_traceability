// src/components/retailers/paymentProcessing/TransactionDetails.tsx
'use client';

import { 
  CreditCard,
  XCircle,
  User,
  FileText,
  Receipt,
  TrendingDown,
} from 'lucide-react';

import { Badge } from '@/src/features/shared/ui/badge';
import { Button } from '@/src/features/shared/ui/button';


interface Transaction {
  id: string;
  orderId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentMethod: string;
  gateway: string;
  customerName: string;
  customerEmail: string;
  createdAt: string;
  processedAt?: string;
  failureReason?: string;
  refundAmount?: number;
  metadata: {
    ip: string;
    device: string;
    location: string;
  };
}

interface TransactionDetailsProps {
  transaction: Transaction;
  onClose: () => void;
}

export function TransactionDetails({ transaction, onClose }: TransactionDetailsProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
    case 'completed':
      return 'bg-green-100 text-green-800';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'failed':
      return 'bg-red-100 text-red-800';
    case 'refunded':
      return 'bg-orange-100 text-orange-800';
    default:
      return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto m-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 sm:p-6 border-b gap-4">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Transaction Details</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="w-full sm:w-auto"
          >
            Close
          </Button>
        </div>
        
        <div className="p-4 sm:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Transaction Information */}
            <div>
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Transaction Information
              </h4>
              <div className="space-y-2 text-sm bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between">
                  <span className="text-gray-600">Transaction ID:</span>
                  <span className="font-medium">{transaction.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Order ID:</span>
                  <span className="font-medium">{transaction.orderId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Gateway:</span>
                  <span className="font-medium">{transaction.gateway}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Method:</span>
                  <span className="font-medium">{transaction.paymentMethod}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Status:</span>
                  <Badge className={getStatusColor(transaction.status)}>
                    {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount:</span>
                  <span className="font-bold text-lg">R{transaction.amount.toFixed(2)} {transaction.currency}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Created:</span>
                  <span className="font-medium">{new Date(transaction.createdAt).toLocaleString()}</span>
                </div>
                {transaction.processedAt && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Processed:</span>
                    <span className="font-medium">{new Date(transaction.processedAt).toLocaleString()}</span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Customer Information */}
            <div>
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <User className="h-4 w-4" />
                Customer Information
              </h4>
              <div className="space-y-2 text-sm bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between">
                  <span className="text-gray-600">Name:</span>
                  <span className="font-medium">{transaction.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Email:</span>
                  <span className="font-medium">{transaction.customerEmail}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">IP Address:</span>
                  <span className="font-medium">{transaction.metadata.ip}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Device:</span>
                  <span className="font-medium">{transaction.metadata.device}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Location:</span>
                  <span className="font-medium">{transaction.metadata.location}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Failure Information */}
          {transaction.failureReason && (
            <div className="mt-6">
              <h4 className="font-medium mb-3 flex items-center gap-2 text-red-600">
                <XCircle className="h-4 w-4" />
                Failure Information
              </h4>
              <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                <p className="text-sm text-red-800">{transaction.failureReason}</p>
              </div>
            </div>
          )}

          {/* Refund Information */}
          {transaction.refundAmount && (
            <div className="mt-6">
              <h4 className="font-medium mb-3 flex items-center gap-2 text-orange-600">
                <TrendingDown className="h-4 w-4" />
                Refund Information
              </h4>
              <div className="bg-orange-50 border border-orange-200 p-4 rounded-lg">
                <p className="text-sm text-orange-800">
                  Refunded Amount: <span className="font-bold">R{transaction.refundAmount.toFixed(2)}</span>
                </p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <Button variant="outline" className="w-full sm:w-auto">
              <Receipt className="h-4 w-4 mr-2" />
              Download Receipt
            </Button>
            <Button variant="outline" className="w-full sm:w-auto">
              <FileText className="h-4 w-4 mr-2" />
              View Invoice
            </Button>
            {transaction.status === 'completed' && (
              <Button variant="outline" className="w-full sm:w-auto text-red-600 hover:text-red-700">
                <TrendingDown className="h-4 w-4 mr-2" />
                Process Refund
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
