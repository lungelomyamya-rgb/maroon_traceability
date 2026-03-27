// src/components/retailers/orders/OrdersOverview.tsx
'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Package, 
  TrendingUp, 
  TrendingDown, 
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  RefreshCw,
  Download,
  AlertTriangle
} from 'lucide-react';

interface OrdersOverviewProps {
  stats: {
    total: number;
    pending: number;
    processing: number;
    shipped: number;
    delivered: number;
    cancelled: number;
    returned: number;
    totalRevenue: number;
    pendingRevenue: number;
    averageOrderValue: number;
    recentOrders: number;
    pendingPayments: number;
    fulfillmentRate: number;
    paymentRate: number;
  };
  formatCurrency: (amount: number) => string;
  formatNumber: (num: number) => string;
  onExport?: () => void;
  onRefresh?: () => void;
}

export function OrdersOverview({ 
  stats, 
  formatCurrency, 
  formatNumber,
  onExport,
  onRefresh
}: OrdersOverviewProps) {
  const getFulfillmentColor = (rate: number) => {
    if (rate >= 90) return 'text-green-600';
    if (rate >= 75) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getPaymentColor = (rate: number) => {
    if (rate >= 95) return 'text-green-600';
    if (rate >= 85) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Orders Overview</h3>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={onRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={onExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">{formatNumber(stats.total)}</p>
              <div className="flex items-center gap-1 mt-1">
                <span className="text-xs text-gray-600">
                  {stats.recentOrders} this week
                </span>
              </div>
            </div>
            <Package className="h-8 w-8 text-blue-600" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(stats.totalRevenue)}</p>
              <div className="flex items-center gap-1 mt-1">
                <span className="text-xs text-gray-600">
                  {formatCurrency(stats.pendingRevenue)} pending
                </span>
              </div>
            </div>
            <DollarSign className="h-8 w-8 text-green-600" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Average Order</p>
              <p className="text-2xl font-bold text-purple-600">{formatCurrency(stats.averageOrderValue)}</p>
              <div className="flex items-center gap-1 mt-1">
                <span className="text-xs text-gray-600">
                  Per order value
                </span>
              </div>
            </div>
            <TrendingUp className="h-8 w-8 text-purple-600" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Fulfillment Rate</p>
              <p className={`text-2xl font-bold ${getFulfillmentColor(stats.fulfillmentRate)}`}>
                {stats.fulfillmentRate.toFixed(1)}%
              </p>
              <div className="flex items-center gap-1 mt-1">
                <span className="text-xs text-gray-600">
                  Orders processed
                </span>
              </div>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </Card>
      </div>

      {/* Status Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Order Status Distribution</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-sm">Pending</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{stats.pending}</span>
                <span className="text-xs text-gray-500">({((stats.pending / stats.total) * 100).toFixed(1)}%)</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span className="text-sm">Processing</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{stats.processing}</span>
                <span className="text-xs text-gray-500">({((stats.processing / stats.total) * 100).toFixed(1)}%)</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
                <span className="text-sm">Shipped</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{stats.shipped}</span>
                <span className="text-xs text-gray-500">({((stats.shipped / stats.total) * 100).toFixed(1)}%)</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm">Delivered</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{stats.delivered}</span>
                <span className="text-xs text-gray-500">({((stats.delivered / stats.total) * 100).toFixed(1)}%)</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-sm">Cancelled</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{stats.cancelled}</span>
                <span className="text-xs text-gray-500">({((stats.cancelled / stats.total) * 100).toFixed(1)}%)</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                <span className="text-sm">Returned</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{stats.returned}</span>
                <span className="text-xs text-gray-500">({((stats.returned / stats.total) * 100).toFixed(1)}%)</span>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Payment Status</h3>
          <div className="space-y-4">
            <div className="text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className={`text-2xl font-bold ${getPaymentColor(stats.paymentRate)}`}>
                  {stats.paymentRate.toFixed(0)}%
                </span>
              </div>
              <p className="text-sm text-gray-600">Payment Rate</p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Paid Orders</span>
                <span className="font-medium">{stats.total - stats.pendingPayments}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Pending Payments</span>
                <span className="font-medium text-yellow-600">{stats.pendingPayments}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Revenue Collected</span>
                <span className="font-medium text-green-600">{formatCurrency(stats.totalRevenue)}</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Alerts */}
      {(stats.pending > 0 || stats.pendingPayments > 0) && (
        <div className="space-y-3">
          {stats.pending > 0 && (
            <Card className="p-4 border-yellow-200 bg-yellow-50">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                <div>
                  <h4 className="font-medium text-yellow-800">Pending Orders</h4>
                  <p className="text-sm text-yellow-700">
                    {stats.pending} orders are waiting for confirmation or processing
                  </p>
                </div>
              </div>
            </Card>
          )}

          {stats.pendingPayments > 0 && (
            <Card className="p-4 border-red-200 bg-red-50">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                <div>
                  <h4 className="font-medium text-red-800">Payment Pending</h4>
                  <p className="text-sm text-red-700">
                    {stats.pendingPayments} orders have pending payments totaling {formatCurrency(stats.pendingRevenue)}
                  </p>
                </div>
              </div>
            </Card>
          )}
        </div>
      )}

      {/* Financial Summary */}
      <Card className="p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Financial Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-2xl font-bold text-green-600">{formatCurrency(stats.totalRevenue)}</p>
            <p className="text-sm text-gray-600">Revenue Collected</p>
            <p className="text-xs text-gray-500 mt-1">From completed orders</p>
          </div>

          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <p className="text-2xl font-bold text-yellow-600">{formatCurrency(stats.pendingRevenue)}</p>
            <p className="text-sm text-gray-600">Pending Revenue</p>
            <p className="text-xs text-gray-500 mt-1">Awaiting payment</p>
          </div>

          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-2xl font-bold text-blue-600">{formatCurrency(stats.averageOrderValue)}</p>
            <p className="text-sm text-gray-600">Average Order Value</p>
            <p className="text-xs text-gray-500 mt-1">Across all orders</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
