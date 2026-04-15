// src/components/retailers/orders/OrdersList.tsx
'use client';

import { 
  Search,
  Eye,
  Truck,
  Package,
} from 'lucide-react';
import { useState } from 'react';

import { Badge } from '@/src/features/shared/ui/badge';
import { Button } from '@/src/features/shared/ui/button';
import { Card } from '@/src/features/shared/ui/card';
import { Input } from '@/src/features/shared/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/src/features/shared/ui/select';

import { Order } from './hooks/useOrders';

interface OrdersListProps {
  orders: Order[];
  statusConfig: Record<string, { color: string; icon: string; label: string }>;
  paymentStatusConfig: Record<string, { color: string; icon: string; label: string }>;
  onViewOrder: (order: Order) => void;
  onUpdateStatus: (orderId: string, status: Order['status']) => void;
  onAddTracking: (orderId: string) => void;
  formatCurrency: (amount: number) => string;
  formatDate: (dateString: string) => string;
  getDaysSinceOrder: (orderDate: string) => number;
  getEstimatedDeliveryDays: (estimatedDelivery?: string) => number | null;
}

export function OrdersList({ 
  orders, 
  statusConfig,
  paymentStatusConfig,
  onViewOrder,
  onUpdateStatus,
  onAddTracking,
  formatCurrency,
  formatDate,
  getDaysSinceOrder,
  getEstimatedDeliveryDays,
}: OrdersListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [paymentFilter, setPaymentFilter] = useState<string>('all');

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (order.trackingNumber && order.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesPayment = paymentFilter === 'all' || order.paymentStatus === paymentFilter;
    
    return matchesSearch && matchesStatus && matchesPayment;
  });

  const handleStatusChange = (orderId: string, newStatus: Order['status']) => {
    onUpdateStatus(orderId, newStatus);
  };

  const getStatusActions = (order: Order) => {
    switch (order.status) {
    case 'pending':
      return [
        { label: 'Confirm Order', value: 'confirmed' as const, color: 'text-blue-600' },
      ];
    case 'confirmed':
      return [
        { label: 'Start Processing', value: 'processing' as const, color: 'text-purple-600' },
      ];
    case 'processing':
      return [
        { label: 'Mark as Shipped', value: 'shipped' as const, color: 'text-indigo-600' },
      ];
    case 'shipped':
      return [
        { label: 'Mark as Delivered', value: 'delivered' as const, color: 'text-green-600' },
      ];
    default:
      return [];
    }
  };

  const getUrgencyColor = (days: number) => {
    if (days <= 1) {
      return 'text-red-600';
    }
    if (days <= 3) {
      return 'text-yellow-600';
    }
    if (days <= 7) {
      return 'text-blue-600';
    }
    return 'text-gray-600';
  };

  const getUrgencyLabel = (days: number) => {
    if (days <= 1) {
      return 'Urgent';
    }
    if (days <= 3) {
      return 'High Priority';
    }
    if (days <= 7) {
      return 'Normal';
    }
    return 'Low Priority';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Orders List</h3>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>{filteredOrders.length} of {orders.length} orders</span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[150px]">
            <SelectValue placeholder="Order Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="processing">Processing</SelectItem>
            <SelectItem value="shipped">Shipped</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
            <SelectItem value="returned">Returned</SelectItem>
          </SelectContent>
        </Select>
        <Select value={paymentFilter} onValueChange={setPaymentFilter}>
          <SelectTrigger className="w-full sm:w-[150px]">
            <SelectValue placeholder="Payment Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Payments</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="refunded">Refunded</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-8">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No orders found</p>
            <p className="text-sm text-gray-400 mt-1">Try adjusting your filters</p>
          </div>
        ) : (
          filteredOrders.map((order) => {
            const status = statusConfig[order.status];
            const paymentStatus = paymentStatusConfig[order.paymentStatus];
            const daysSinceOrder = getDaysSinceOrder(order.createdAt);
            const estimatedDeliveryDays = getEstimatedDeliveryDays(order.estimatedDelivery);
            const availableActions = getStatusActions(order);

            return (
              <Card key={order.id} className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <Package className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-gray-900">{order.id}</h4>
                        <Badge className={`${status.color} text-xs`}>
                          <span className="mr-1">{status.icon}</span>
                          {status.label}
                        </Badge>
                        <Badge className={`${paymentStatus.color} text-xs`}>
                          <span className="mr-1">{paymentStatus.icon}</span>
                          {paymentStatus.label}
                        </Badge>
                        {daysSinceOrder <= 7 && (
                          <Badge className={`text-xs ${getUrgencyColor(daysSinceOrder)}`}>
                            {getUrgencyLabel(daysSinceOrder)}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                        <span>{order.customerName}</span>
                        <span>•</span>
                        <span>{order.customerEmail}</span>
                        <span>•</span>
                        <span>{order.items.length} item{order.items.length !== 1 ? 's' : ''}</span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>{order.shippingAddress.city}, {order.shippingAddress.province}</span>
                        <span>•</span>
                        <span>Ordered {formatDate(order.createdAt)}</span>
                        {order.trackingNumber && (
                          <>
                            <span>•</span>
                            <span>Tracking: {order.trackingNumber}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onViewOrder(order)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    {(order.status === 'processing' || order.status === 'confirmed') && !order.trackingNumber && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onAddTracking(order.id)}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        <Truck className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mt-4 pt-4 border-t">
                  <div>
                    <p className="text-xs text-gray-500">Total Amount</p>
                    <p className="text-sm font-medium">{formatCurrency(order.total)}</p>
                    <p className="text-xs text-gray-400">{order.items.length} items</p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">Order Date</p>
                    <p className="text-sm font-medium">{formatDate(order.createdAt)}</p>
                    <p className="text-xs text-gray-400">{daysSinceOrder} days ago</p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">Payment</p>
                    <Badge className={`${paymentStatus.color} text-xs`}>
                      {paymentStatus.label}
                    </Badge>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">Status</p>
                    <Badge className={`${status.color} text-xs`}>
                      {status.label}
                    </Badge>
                  </div>

                  {order.trackingNumber ? (
                    <div>
                      <p className="text-xs text-gray-500">Tracking</p>
                      <p className="text-sm font-medium">{order.trackingNumber}</p>
                      <p className="text-xs text-gray-400">{order.courier}</p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-xs text-gray-500">Shipping</p>
                      <p className="text-sm font-medium">Not shipped</p>
                      {availableActions.length > 0 && (
                        <p className="text-xs text-blue-600">Ready to ship</p>
                      )}
                    </div>
                  )}

                  {estimatedDeliveryDays !== null ? (
                    <div>
                      <p className="text-xs text-gray-500">Delivery</p>
                      <p className="text-sm font-medium">
                        {estimatedDeliveryDays > 0 ? `${estimatedDeliveryDays} days` : 'Overdue'}
                      </p>
                      <p className="text-xs text-gray-400">
                        {order.estimatedDelivery ? formatDate(order.estimatedDelivery) : 'N/A'}
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-xs text-gray-500">Actions</p>
                      <div className="flex gap-1">
                        {availableActions.slice(0, 1).map((action, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            size="sm"
                            onClick={() => handleStatusChange(order.id, action.value)}
                            className={`text-xs px-2 py-1 h-6 ${action.color}`}
                          >
                            {action.label}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Quick Actions */}
                {availableActions.length > 0 && (
                  <div className="mt-4 pt-4 border-t flex gap-2">
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 mb-1">Quick Actions</p>
                      <div className="flex gap-2">
                        {availableActions.map((action, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            size="sm"
                            onClick={() => handleStatusChange(order.id, action.value)}
                            className={action.color}
                          >
                            {action.label}
                          </Button>
                        ))}
                        {(order.status === 'processing' || order.status === 'confirmed') && !order.trackingNumber && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onAddTracking(order.id)}
                            className="text-blue-600 hover:text-blue-700"
                          >
                            <Truck className="h-4 w-4 mr-2" />
                            Add Tracking
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
