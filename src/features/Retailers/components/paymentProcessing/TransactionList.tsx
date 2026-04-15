// src/components/retailers/paymentProcessing/TransactionList.tsx
'use client';

import { 
  Search, 
  Eye, 
  Download, 
  RefreshCw,
  CreditCard,
  Smartphone,
  Wallet,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
} from 'lucide-react';
import { useState } from 'react';

import { Badge } from '@/src/features/shared/ui/badge';
import { Button } from '@/src/features/shared/ui/button';
import { Card } from '@/src/features/shared/ui/card';
import { Input } from '@/src/features/shared/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/src/features/shared/ui/select';

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

interface TransactionListProps {
  transactions: Transaction[];
  onViewDetails?: (transaction: Transaction) => void;
  onExport?: () => void;
  onRefresh?: () => void;
  isLoading?: boolean;
}

export function TransactionList({ 
  transactions, 
  onViewDetails, 
  onExport, 
  onRefresh,
  isLoading = false,
}: TransactionListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [gatewayFilter, setGatewayFilter] = useState<string>('all');

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

  const getStatusIcon = (status: string) => {
    switch (status) {
    case 'completed':
      return CheckCircle;
    case 'pending':
      return Clock;
    case 'failed':
      return XCircle;
    case 'refunded':
      return AlertTriangle;
    default:
      return Clock;
    }
  };

  const getPaymentIcon = (method: string) => {
    if (method.toLowerCase().includes('card')) {
      return CreditCard;
    }
    if (method.toLowerCase().includes('mobile')) {
      return Smartphone;
    }
    return Wallet;
  };

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || transaction.status === statusFilter;
    const matchesGateway = gatewayFilter === 'all' || transaction.gateway === gatewayFilter;
    
    return matchesSearch && matchesStatus && matchesGateway;
  });

  const uniqueGateways = Array.from(new Set(transactions.map(t => t.gateway)));

  return (
    <Card className="p-4 sm:p-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={onRefresh} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={onExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by name, order ID, or transaction ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[150px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
            <SelectItem value="refunded">Refunded</SelectItem>
          </SelectContent>
        </Select>
        <Select value={gatewayFilter} onValueChange={setGatewayFilter}>
          <SelectTrigger className="w-full sm:w-[150px]">
            <SelectValue placeholder="Gateway" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Gateways</SelectItem>
            {uniqueGateways.map(gateway => (
              <SelectItem key={gateway} value={gateway}>{gateway}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Transaction List */}
      <div className="space-y-3">
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-8">
            <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No transactions found</p>
            <p className="text-sm text-gray-400 mt-1">Try adjusting your filters</p>
          </div>
        ) : (
          filteredTransactions.map((transaction) => {
            const StatusIcon = getStatusIcon(transaction.status);
            const PaymentIcon = getPaymentIcon(transaction.paymentMethod);
            
            return (
              <div key={transaction.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-gray-50 rounded-lg">
                      <PaymentIcon className="h-5 w-5 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-gray-900">{transaction.customerName}</h4>
                        <Badge className={getStatusColor(transaction.status)}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500">Order ID</p>
                          <p className="font-medium">{transaction.orderId}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Amount</p>
                          <p className="font-medium">R{transaction.amount.toFixed(2)} {transaction.currency}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Gateway</p>
                          <p className="font-medium">{transaction.gateway}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Date</p>
                          <p className="font-medium">{new Date(transaction.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onViewDetails?.(transaction)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </Card>
  );
}
