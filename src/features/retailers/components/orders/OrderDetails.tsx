// src/components/retailers/orders/OrderDetails.tsx
'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Package, DollarSign, Calendar, MapPin, Truck, Mail, Printer, Edit } from 'lucide-react';
import { Order } from './hooks/useOrders';

interface OrderDetailsProps {
  order: Order;
  statusConfig: Record<string, { color: string; icon: string; label: string }>;
  paymentStatusConfig: Record<string, { color: string; icon: string; label: string }>;
  onClose: () => void;
  onEdit?: (order: Order) => void;
  onUpdateStatus?: (orderId: string, status: Order['status']) => void;
  onAddTracking?: (orderId: string, trackingNumber: string, courier: string, estimatedDelivery?: string) => void;
  formatCurrency: (amount: number) => string;
  formatDate: (dateString: string) => string;
  getDaysSinceOrder: (orderDate: string) => number;
  getEstimatedDeliveryDays: (estimatedDelivery?: string) => number | null;
}

export function OrderDetails({ 
  order, 
  statusConfig,
  paymentStatusConfig,
  onClose, 
  onEdit,
  onUpdateStatus,
  onAddTracking,
  formatCurrency,
  formatDate,
  getDaysSinceOrder,
  getEstimatedDeliveryDays
}: OrderDetailsProps) {
  const status = statusConfig[order.status];
  const paymentStatus = paymentStatusConfig[order.paymentStatus];
  const daysSinceOrder = getDaysSinceOrder(order.createdAt);
  const estimatedDeliveryDays = getEstimatedDeliveryDays(order.estimatedDelivery);

  const getNextStatusOptions = (currentStatus: Order['status']) => {
    const statusFlow: Record<Order['status'], Order['status'][]> = {
      'pending': ['confirmed'],
      'confirmed': ['processing'],
      'processing': ['shipped'],
      'shipped': ['delivered'],
      'delivered': [],
      'cancelled': [],
      'returned': []
    };
    return statusFlow[currentStatus] || [];
  };

  const nextStatusOptions = getNextStatusOptions(order.status);

  const handleStatusUpdate = (newStatus: Order['status']) => {
    onUpdateStatus?.(order.id, newStatus);
  };

  const handlePrintOrder = () => {
    window.print();
  };

  const handleEmailCustomer = () => {
    const subject = `Order ${order.id} Update`;
    const body = `Dear ${order.customerName},\n\nYour order ${order.id} status has been updated.\n\nOrder Details:\n- Status: ${status.label}\n- Total: ${formatCurrency(order.total)}\n${order.trackingNumber ? `- Tracking: ${order.trackingNumber}\n` : ''}\nThank you for your business!\n\nBest regards,\nYour Store Team`;
    window.open(`mailto:${order.customerEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-50 rounded-full">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">{order.id}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <Badge className={`${status.color} text-sm`}>
                    <span className="mr-1">{status.icon}</span>
                    {status.label}
                  </Badge>
                  <Badge className={`${paymentStatus.color} text-sm`}>
                    <span className="mr-1">{paymentStatus.icon}</span>
                    {paymentStatus.label}
                  </Badge>
                  <span className="text-sm text-gray-500">
                    {daysSinceOrder} days ago
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handlePrintOrder}>
                <Printer className="h-4 w-4 mr-2" />
                Print
              </Button>
              <Button variant="outline" size="sm" onClick={handleEmailCustomer}>
                <Mail className="h-4 w-4 mr-2" />
                Email
              </Button>
              {onEdit && (
                <Button variant="outline" size="sm" onClick={() => onEdit(order)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              )}
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Customer Information */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Customer Details</h3>
              <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Name</span>
                  <span className="text-sm font-medium">{order.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Email</span>
                  <span className="text-sm font-medium">{order.customerEmail}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Order Date</span>
                  <span className="text-sm font-medium">{formatDate(order.createdAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Amount</span>
                  <span className="text-sm font-medium">{formatCurrency(order.total)}</span>
                </div>
              </div>

              {/* Shipping Address */}
              <h3 className="font-semibold text-gray-900">Shipping Address</h3>
              <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium">{order.customerName}</p>
                    <p>{order.shippingAddress.street}</p>
                    <p>{order.shippingAddress.city}, {order.shippingAddress.province}</p>
                    <p>{order.shippingAddress.postalCode}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Order Items ({order.items.length})</h3>
              <div className="space-y-3 bg-gray-50 p-4 rounded-lg max-h-60 overflow-y-auto">
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
                    <div>
                      <p className="text-sm font-medium">{item.productName}</p>
                      <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{formatCurrency(item.price)}</p>
                      <p className="text-xs text-gray-600">each</p>
                    </div>
                  </div>
                ))}
                <div className="flex justify-between items-center pt-2 border-t border-gray-300">
                  <span className="text-sm font-medium">Total</span>
                  <span className="text-sm font-bold">{formatCurrency(order.total)}</span>
                </div>
              </div>
            </div>

            {/* Status & Tracking */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Status & Tracking</h3>
              <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Order Status</span>
                  <Badge className={`${status.color} text-xs`}>
                    {status.label}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Payment Status</span>
                  <Badge className={`${paymentStatus.color} text-xs`}>
                    {paymentStatus.label}
                  </Badge>
                </div>

                {order.trackingNumber ? (
                  <>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Tracking Number</span>
                      <span className="text-sm font-medium">{order.trackingNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Courier</span>
                      <span className="text-sm font-medium">{order.courier}</span>
                    </div>
                    {order.estimatedDelivery && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Estimated Delivery</span>
                        <span className="text-sm font-medium">{formatDate(order.estimatedDelivery)}</span>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-4">
                    <Truck className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Not shipped yet</p>
                  </div>
                )}
              </div>

              {/* Status Actions */}
              {nextStatusOptions.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900">Update Status</h4>
                  <div className="flex flex-col gap-2">
                    {nextStatusOptions.map((nextStatus) => (
                      <Button
                        key={nextStatus}
                        variant="outline"
                        size="sm"
                        onClick={() => handleStatusUpdate(nextStatus)}
                        className="w-full"
                      >
                        Mark as {statusConfig[nextStatus].label}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Order Timeline */}
          <div className="space-y-4 mt-6">
            <h3 className="font-semibold text-gray-900">Order Timeline</h3>
            <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Package className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">Order Placed</p>
                  <p className="text-xs text-gray-600">{formatDate(order.createdAt)}</p>
                </div>
              </div>

              {['confirmed', 'processing', 'shipped', 'delivered'].includes(order.status) && (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 text-sm">✓</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Order Confirmed</p>
                    <p className="text-xs text-gray-600">Status updated to {status.label}</p>
                  </div>
                </div>
              )}

              {order.trackingNumber && (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Truck className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Order Shipped</p>
                    <p className="text-xs text-gray-600">
                      Tracking: {order.trackingNumber} via {order.courier}
                    </p>
                  </div>
                </div>
              )}

              {order.status === 'delivered' && (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 text-sm">✓</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Order Delivered</p>
                    <p className="text-xs text-gray-600">Successfully completed</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-between items-center mt-6 pt-6 border-t">
            <div className="text-sm text-gray-500">
              Order ID: {order.id} • Customer: {order.customerName}
            </div>
            <div className="flex gap-3">
              <Button variant="outline">
                Download Invoice
              </Button>
              <Button variant="outline">
                View History
              </Button>
              <Button variant="outline">
                Customer Notes
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
