// src/app/retailer/payments/paymentProcessingComponent.tsx
'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { 
  CreditCard,
  DollarSign,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Search,
  Filter,
  Plus,
  Eye,
  Edit,
  Download,
  RefreshCw,
  BarChart3,
  Calendar,
  User,
  ShoppingCart,
  Settings,
  Link,
  Shield,
  Zap,
  Globe,
  Phone,
  Mail,
  FileText,
  Receipt,
  Banknote,
  Smartphone,
  Wallet
} from 'lucide-react';

interface PaymentGateway {
  id: string;
  name: string;
  type: 'credit-card' | 'mobile' | 'bank-transfer' | 'digital-wallet';
  supportedMethods: string[];
  fees: {
    percentage: number;
    fixed: number;
    currency: string;
  };
  settlementTime: string;
  status: 'active' | 'inactive' | 'maintenance';
  apiConnected: boolean;
  supportedCurrencies: string[];
  monthlyVolume: number;
  successRate: number;
  supportContact: {
    phone: string;
    email: string;
  };
}

interface Transaction {
  id: string;
  orderId: string;
  customerName: string;
  customerEmail: string;
  amount: number;
  currency: string;
  paymentMethod: string;
  gateway: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded' | 'chargeback';
  createdAt: string;
  processedAt?: string;
  failureReason?: string;
  refundAmount?: number;
  chargebackReason?: string;
  metadata: {
    ip: string;
    device: string;
    location: string;
  };
}

export default function PaymentProcessingComponent() {
  const [gateways, setGateways] = useState<PaymentGateway[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [gatewayFilter, setGatewayFilter] = useState('all');
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [showTransactionDetails, setShowTransactionDetails] = useState(false);

  useEffect(() => {
    // Mock payment gateways
    const mockGateways: PaymentGateway[] = [
      {
        id: 'gateway1',
        name: 'PayFast',
        type: 'credit-card',
        supportedMethods: ['Credit Card', 'Debit Card', 'EFT', 'Instant EFT'],
        fees: {
          percentage: 2.9,
          fixed: 2.50,
          currency: 'ZAR'
        },
        settlementTime: '2-3 business days',
        status: 'active',
        apiConnected: true,
        supportedCurrencies: ['ZAR', 'USD', 'EUR'],
        monthlyVolume: 125000.00,
        successRate: 98.5,
        supportContact: {
          phone: '+27 21 300 3400',
          email: 'support@payfast.co.za'
        }
      },
      {
        id: 'gateway2',
        name: 'Yoco',
        type: 'credit-card',
        supportedMethods: ['Credit Card', 'Debit Card', 'Yoco Card'],
        fees: {
          percentage: 2.95,
          fixed: 0.00,
          currency: 'ZAR'
        },
        settlementTime: 'Next business day',
        status: 'active',
        apiConnected: true,
        supportedCurrencies: ['ZAR'],
        monthlyVolume: 89000.00,
        successRate: 97.8,
        supportContact: {
          phone: '+27 87 555 5555',
          email: 'support@yoco.co.za'
        }
      },
      {
        id: 'gateway3',
        name: 'OZOW',
        type: 'bank-transfer',
        supportedMethods: ['EFT', 'Instant EFT'],
        fees: {
          percentage: 1.5,
          fixed: 5.00,
          currency: 'ZAR'
        },
        settlementTime: 'Same day',
        status: 'active',
        apiConnected: true,
        supportedCurrencies: ['ZAR'],
        monthlyVolume: 45000.00,
        successRate: 96.2,
        supportContact: {
          phone: '+27 10 590 3000',
          email: 'support@ozow.com'
        }
      },
      {
        id: 'gateway4',
        name: 'SnapScan',
        type: 'mobile',
        supportedMethods: ['SnapScan QR', 'Mobile Banking'],
        fees: {
          percentage: 3.0,
          fixed: 0.15,
          currency: 'ZAR'
        },
        settlementTime: 'Next business day',
        status: 'active',
        apiConnected: true,
        supportedCurrencies: ['ZAR'],
        monthlyVolume: 34000.00,
        successRate: 95.5,
        supportContact: {
          phone: '+27 21 460 3800',
          email: 'support@snapscan.co.za'
        }
      }
    ];

    // Mock transactions
    const mockTransactions: Transaction[] = [
      {
        id: 'txn1',
        orderId: 'ORD-2024-001',
        customerName: 'Sarah Johnson',
        customerEmail: 'sarah.j@email.com',
        amount: 245.67,
        currency: 'ZAR',
        paymentMethod: 'Credit Card',
        gateway: 'PayFast',
        status: 'completed',
        createdAt: '2024-01-15T10:30:00Z',
        processedAt: '2024-01-15T10:32:00Z',
        metadata: {
          ip: '196.45.123.89',
          device: 'Chrome on Windows',
          location: 'Cape Town, South Africa'
        }
      },
      {
        id: 'txn2',
        orderId: 'ORD-2024-002',
        customerName: 'Michael Chen',
        customerEmail: 'm.chen@email.com',
        amount: 89.99,
        currency: 'ZAR',
        paymentMethod: 'Instant EFT',
        gateway: 'OZOW',
        status: 'failed',
        createdAt: '2024-01-16T14:15:00Z',
        failureReason: 'Insufficient funds',
        metadata: {
          ip: '41.78.234.12',
          device: 'Safari on iPhone',
          location: 'Johannesburg, South Africa'
        }
      },
      {
        id: 'txn3',
        orderId: 'ORD-2024-003',
        customerName: 'Emma Wilson',
        customerEmail: 'emma.w@email.com',
        amount: 156.78,
        currency: 'ZAR',
        paymentMethod: 'Yoco Card',
        gateway: 'Yoco',
        status: 'completed',
        createdAt: '2024-01-17T09:45:00Z',
        processedAt: '2024-01-17T09:46:00Z',
        metadata: {
          ip: '165.89.45.123',
          device: 'App on Android',
          location: 'Durban, South Africa'
        }
      },
      {
        id: 'txn4',
        orderId: 'ORD-2024-004',
        customerName: 'James Brown',
        customerEmail: 'j.brown@email.com',
        amount: 78.50,
        currency: 'ZAR',
        paymentMethod: 'SnapScan QR',
        gateway: 'SnapScan',
        status: 'refunded',
        createdAt: '2024-01-14T16:20:00Z',
        processedAt: '2024-01-14T16:22:00Z',
        refundAmount: 78.50,
        metadata: {
          ip: '197.234.89.45',
          device: 'Chrome on Android',
          location: 'Pretoria, South Africa'
        }
      }
    ];

    setGateways(mockGateways);
    setTransactions(mockTransactions);
  }, []);

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || transaction.status === statusFilter;
    const matchesGateway = gatewayFilter === 'all' || transaction.gateway === gatewayFilter;
    return matchesSearch && matchesStatus && matchesGateway;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'refunded': return 'bg-gray-100 text-gray-800';
      case 'chargeback': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getGatewayStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentIcon = (method: string) => {
    switch (method.toLowerCase()) {
      case 'credit card':
      case 'debit card':
        return <CreditCard className="h-4 w-4" />;
      case 'snapscan qr':
      case 'mobile banking':
        return <Smartphone className="h-4 w-4" />;
      case 'eft':
      case 'instant eft':
        return <Banknote className="h-4 w-4" />;
      default:
        return <Wallet className="h-4 w-4" />;
    }
  };

  const activeGateways = gateways.filter(g => g.status === 'active').length;
  const connectedGateways = gateways.filter(g => g.apiConnected).length;
  const totalTransactions = transactions.length;
  const completedTransactions = transactions.filter(t => t.status === 'completed').length;
  const totalRevenue = transactions.filter(t => t.status === 'completed').reduce((sum, t) => sum + t.amount, 0);
  const failedTransactions = transactions.filter(t => t.status === 'failed').length;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
        <Card className="p-4 sm:p-6 lg:p-8 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 lg:text-base">Active Gateways</p>
              <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">{activeGateways}</p>
            </div>
            <div className="p-2 sm:p-3 lg:p-4 bg-blue-100 rounded-lg">
              <CreditCard className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4 sm:p-6 lg:p-8 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 lg:text-base">Connected APIs</p>
              <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-green-600">{connectedGateways}</p>
            </div>
            <div className="p-2 sm:p-3 lg:p-4 bg-green-100 rounded-lg">
              <Link className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4 sm:p-6 lg:p-8 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 lg:text-base">Total Revenue</p>
              <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-green-600">R{totalRevenue.toFixed(2)}</p>
            </div>
            <div className="p-2 sm:p-3 lg:p-4 bg-green-100 rounded-lg">
              <DollarSign className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4 sm:p-6 lg:p-8 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 lg:text-base">Success Rate</p>
              <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-blue-600">
                {totalTransactions > 0 ? ((completedTransactions / totalTransactions) * 100).toFixed(1) : 0}%
              </p>
            </div>
            <div className="p-2 sm:p-3 lg:p-4 bg-blue-100 rounded-lg">
              <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="p-6 lg:p-8 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 lg:h-5 lg:w-5" />
              <Input
                placeholder="Search by customer, email, order ID, or transaction ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 lg:text-base"
              />
            </div>
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full lg:w-48 lg:text-base">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
              <SelectItem value="refunded">Refunded</SelectItem>
              <SelectItem value="chargeback">Chargeback</SelectItem>
            </SelectContent>
          </Select>
          <Select value={gatewayFilter} onValueChange={setGatewayFilter}>
            <SelectTrigger className="w-full lg:w-48 lg:text-base">
              <SelectValue placeholder="Filter by gateway" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Gateways</SelectItem>
              {gateways.map(gateway => (
                <SelectItem key={gateway.id} value={gateway.name}>
                  {gateway.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={() => {}} className="lg:text-base">
            <Download className="h-4 w-4 lg:h-5 lg:w-5 mr-2" />
            Export
          </Button>
        </div>
      </Card>

      {/* Transactions List */}
      <Card className="p-6 lg:p-8 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 lg:text-xl lg:mb-6">Recent Transactions</h3>
        <div className="space-y-4 lg:space-y-6">
          {filteredTransactions.map((transaction) => (
            <div key={transaction.id} className="border rounded-lg p-4 sm:p-6 lg:p-8 hover:shadow-lg transition-shadow">
              <div className="flex flex-col gap-4 lg:gap-6">
                <div className="flex items-start gap-3 lg:gap-4">
                  <div className="p-2 sm:p-3 lg:p-4 bg-blue-100 rounded-lg flex-shrink-0">
                    {getPaymentIcon(transaction.paymentMethod)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-gray-900 text-sm sm:text-base lg:text-lg break-words">{transaction.orderId}</h4>
                    <p className="text-xs sm:text-sm text-gray-500 truncate lg:text-base">{transaction.id}</p>
                  </div>
                  <Badge className={`${getStatusColor(transaction.status)} text-xs sm:text-sm lg:text-base`}>
                    {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 text-sm">
                  <div className="flex items-center gap-2 lg:gap-3">
                    <User className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                    <span className="text-xs sm:text-sm truncate lg:text-base">{transaction.customerName}</span>
                  </div>
                  <div className="flex items-center gap-2 lg:gap-3">
                    <CreditCard className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                    <span className="text-xs sm:text-sm truncate lg:text-base">{transaction.gateway}</span>
                  </div>
                  <div className="flex items-center gap-2 lg:gap-3">
                    <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                    <span className="text-xs sm:text-sm font-medium lg:text-base">R{transaction.amount.toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-2 sm:flex sm:items-center sm:justify-between lg:gap-4">
                  <div className="flex items-center gap-1 text-xs text-gray-500 lg:text-sm">
                    <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                    <span className="text-xs truncate lg:text-sm">{transaction.customerEmail}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-500 lg:text-sm">
                    <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                    <span className="text-xs lg:text-sm">{new Date(transaction.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                {transaction.failureReason && (
                  <div className="mt-3 lg:mt-4">
                    <p className="text-sm text-red-600 lg:text-base">Failure: {transaction.failureReason}</p>
                  </div>
                )}

                {transaction.refundAmount && (
                  <div className="mt-3 lg:mt-4">
                    <p className="text-sm text-gray-600 lg:text-base">Refunded: R{transaction.refundAmount.toFixed(2)}</p>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-2 lg:gap-3 lg:mt-0">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedTransaction(transaction);
                      setShowTransactionDetails(true);
                    }}
                    className="flex-1 lg:text-base"
                  >
                    <Eye className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                    <span className="whitespace-nowrap">View Details</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 lg:text-base"
                  >
                    <Receipt className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                    <span className="whitespace-nowrap">Receipt</span>
                  </Button>
                </div>
              </div>
            </div>
          ))}

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 text-sm">
        </div>
        </div>
      </Card>

      {/* Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Performance</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Success Rate</span>
              <span className="text-sm font-medium">
                {totalTransactions > 0 ? ((completedTransactions / totalTransactions) * 100).toFixed(1) : 0}%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Failed Transactions</span>
              <span className="text-sm font-medium">{failedTransactions}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Average Transaction Value</span>
              <span className="text-sm font-medium">
                R{completedTransactions > 0 ? (totalRevenue / completedTransactions).toFixed(2) : '0.00'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Total Processing Fees</span>
              <span className="text-sm font-medium">R{(totalRevenue * 0.029).toFixed(2)}</span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Gateway Performance</h3>
          <div className="space-y-4">
            {gateways.map((gateway) => (
              <div key={gateway.id} className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium">{gateway.name}</p>
                  <p className="text-xs text-gray-500">{transactions.filter(t => t.gateway === gateway.name).length} transactions</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{gateway.successRate}%</p>
                  <p className="text-xs text-gray-500">Success rate</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Transaction Details Modal */}
      {showTransactionDetails && selectedTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto m-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 sm:p-6 border-b gap-4">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Transaction Details</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowTransactionDetails(false)}
                className="w-full sm:w-auto"
              >
                Close
              </Button>
            </div>
            <div className="p-4 sm:p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3">Transaction Information</h4>
                  <div className="space-y-2 text-sm">
                    <p><strong>Transaction ID:</strong> {selectedTransaction.id}</p>
                    <p><strong>Order ID:</strong> {selectedTransaction.orderId}</p>
                    <p><strong>Gateway:</strong> {selectedTransaction.gateway}</p>
                    <p><strong>Payment Method:</strong> {selectedTransaction.paymentMethod}</p>
                    <p><strong>Status:</strong> <Badge className={getStatusColor(selectedTransaction.status)}>{selectedTransaction.status.charAt(0).toUpperCase() + selectedTransaction.status.slice(1)}</Badge></p>
                    <p><strong>Amount:</strong> R{selectedTransaction.amount.toFixed(2)} {selectedTransaction.currency}</p>
                    <p><strong>Created:</strong> {new Date(selectedTransaction.createdAt).toLocaleDateString()}</p>
                    {selectedTransaction.processedAt && (
                      <p><strong>Processed:</strong> {new Date(selectedTransaction.processedAt).toLocaleDateString()}</p>
                    )}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-3">Customer Information</h4>
                  <div className="space-y-2 text-sm">
                    <p><strong>Name:</strong> {selectedTransaction.customerName}</p>
                    <p><strong>Email:</strong> {selectedTransaction.customerEmail}</p>
                    <p><strong>IP Address:</strong> {selectedTransaction.metadata.ip}</p>
                    <p><strong>Device:</strong> {selectedTransaction.metadata.device}</p>
                    <p><strong>Location:</strong> {selectedTransaction.metadata.location}</p>
                  </div>
                </div>
              </div>

              {selectedTransaction.failureReason && (
                <div className="mt-6">
                  <h4 className="font-medium mb-3">Failure Information</h4>
                  <p className="text-sm text-red-600">{selectedTransaction.failureReason}</p>
                </div>
              )}

              {selectedTransaction.refundAmount && (
                <div className="mt-6">
                  <h4 className="font-medium mb-3">Refund Information</h4>
                  <p className="text-sm">Refunded Amount: R{selectedTransaction.refundAmount.toFixed(2)}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
