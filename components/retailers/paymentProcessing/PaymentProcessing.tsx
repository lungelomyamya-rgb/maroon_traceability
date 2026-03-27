// src/components/retailers/paymentProcessing/PaymentProcessing.tsx
'use client';

import { useState } from 'react';
import { PaymentMetrics } from './PaymentMetrics';
import { PaymentGateways } from './PaymentGateways';
import { TransactionList } from './TransactionList';
import { TransactionDetails } from './TransactionDetails';
import { usePaymentProcessing, type Transaction } from './hooks/usePaymentProcessing';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, Download } from 'lucide-react';

interface PaymentProcessingProps {
  title?: string;
}

export function PaymentProcessing({ title = "Payment Processing" }: PaymentProcessingProps) {
  const {
    transactions,
    gateways,
    metrics,
    isLoading,
    refreshData,
    configureGateway,
    toggleGatewayStatus,
    exportTransactions,
    processRefund
  } = usePaymentProcessing();

  const [showTransactionDetails, setShowTransactionDetails] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  const handleViewDetails = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setShowTransactionDetails(true);
  };

  const handleCloseDetails = () => {
    setShowTransactionDetails(false);
    setSelectedTransaction(null);
  };

  if (isLoading || !metrics) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Loading...
            </Button>
          </div>
        </div>
        
        {/* Loading skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="p-6 bg-gray-100 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={refreshData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={exportTransactions}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Payment Metrics */}
      <PaymentMetrics metrics={metrics} />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Transaction List */}
        <div className="lg:col-span-2">
          <TransactionList
            transactions={transactions}
            onViewDetails={handleViewDetails}
            onExport={exportTransactions}
            onRefresh={refreshData}
            isLoading={isLoading}
          />
        </div>

        {/* Payment Gateways */}
        <div className="lg:col-span-1">
          <PaymentGateways
            gateways={gateways}
            onConfigure={configureGateway}
            onToggleStatus={toggleGatewayStatus}
          />
        </div>
      </div>

      {/* Transaction Details Modal */}
      {showTransactionDetails && selectedTransaction && (
        <TransactionDetails
          transaction={selectedTransaction}
          onClose={handleCloseDetails}
        />
      )}
    </div>
  );
}
