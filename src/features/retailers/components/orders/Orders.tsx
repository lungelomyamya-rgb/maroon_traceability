// src/components/retailers/orders/Orders.tsx
'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Package, 
  Plus, 
  Truck, 
  AlertTriangle, 
  Download,
  RefreshCw
} from 'lucide-react';
import { useOrders, type Order } from './hooks/useOrders';
import { OrdersOverview } from './OrdersOverview';
import { OrdersList } from './OrdersList';
import { OrderDetails } from './OrderDetails';

interface OrdersProps {
  onOrderSelect?: (order: Order) => void;
}

export function Orders({ onOrderSelect }: OrdersProps) {
  const {
    orders,
    isLoading,
    statusConfig,
    paymentStatusConfig,
    updateOrderStatus,
    updatePaymentStatus,
    addTrackingInfo,
    formatCurrency,
    formatDate,
    getDaysSinceOrder,
    getEstimatedDeliveryDays
  } = useOrders();

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showAddOrder, setShowAddOrder] = useState(false);

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    onOrderSelect?.(order);
  };

  const handleUpdateOrderStatus = (orderId: string, status: Order['status']) => {
    updateOrderStatus(orderId, status);
    const updatedOrder = orders.find(o => o.id === orderId);
    if (updatedOrder) {
      onOrderSelect?.(updatedOrder);
    }
  };

  const handleUpdatePaymentStatus = (orderId: string, paymentStatus: Order['paymentStatus']) => {
    updatePaymentStatus(orderId, paymentStatus);
  };

  const handleAddTracking = (orderId: string, trackingNumber: string, courier: string, estimatedDelivery?: string) => {
    addTrackingInfo(orderId, trackingNumber, courier, estimatedDelivery);
  };

  const handleExport = () => {
    const exportData = {
      orders: orders.map(order => ({
        id: order.id,
        customerName: order.customerName,
        customerEmail: order.customerEmail,
        total: order.total,
        status: order.status,
        paymentStatus: order.paymentStatus,
        createdAt: order.createdAt,
        trackingNumber: order.trackingNumber,
        courier: order.courier,
        estimatedDelivery: order.estimatedDelivery,
        items: order.items
      })),
      exportDate: new Date().toISOString(),
      totalOrders: orders.length,
      totalRevenue: orders.filter(o => o.paymentStatus === 'paid').reduce((sum, o) => sum + o.total, 0)
    };

    // Create downloadable JSON file
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `orders-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleRefresh = () => {
    // This would refresh the data - for now just log
    console.log('Refreshing orders data...');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Order Management</h2>
        <div className="flex items-center gap-3">
          <Button onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={() => setShowAddOrder(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Order
          </Button>
        </div>
      </div>

      {/* Overview */}
      <OrdersOverview
        stats={{
          total: orders.length,
          pending: orders.filter(o => o.status === 'pending').length,
          processing: orders.filter(o => o.status === 'processing').length,
          shipped: orders.filter(o => o.status === 'shipped').length,
          delivered: orders.filter(o => o.status === 'delivered').length,
          cancelled: orders.filter(o => o.status === 'cancelled').length,
          returned: orders.filter(o => o.status === 'returned').length,
          totalRevenue: orders.filter(o => o.paymentStatus === 'paid').reduce((sum, o) => sum + o.total, 0),
          pendingRevenue: orders.filter(o => o.paymentStatus === 'pending').reduce((sum, o) => sum + o.total, 0),
          averageOrderValue: orders.length > 0 ? orders.reduce((sum, o) => sum + o.total, 0) / orders.length : 0,
          recentOrders: orders.filter(o => {
            const orderDate = new Date(o.createdAt);
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            return orderDate >= weekAgo;
          }).length,
          pendingPayments: orders.filter(o => o.paymentStatus === 'pending').length,
          fulfillmentRate: orders.length > 0 ? ((orders.filter(o => o.status === 'delivered' || o.status === 'shipped').length) / orders.length) * 100 : 0,
          paymentRate: orders.length > 0 ? ((orders.filter(o => o.paymentStatus === 'paid').length) / orders.length) * 100 : 0
        }}
        formatCurrency={formatCurrency}
        formatNumber={(num) => new Intl.NumberFormat('en-ZA').format(num)}
        onExport={handleExport}
        onRefresh={handleRefresh}
      />

      {/* Orders List */}
      <OrdersList
        orders={orders}
        statusConfig={statusConfig}
        paymentStatusConfig={paymentStatusConfig}
        onViewOrder={handleViewOrder}
        onUpdateStatus={handleUpdateOrderStatus}
        onAddTracking={(orderId) => {
          // This would open a tracking form - for now just log
          console.log('Add tracking for order:', orderId);
        }}
        formatCurrency={formatCurrency}
        formatDate={formatDate}
        getDaysSinceOrder={getDaysSinceOrder}
        getEstimatedDeliveryDays={getEstimatedDeliveryDays}
      />

      {/* Order Details Modal */}
      {selectedOrder && (
        <OrderDetails
          order={selectedOrder}
          statusConfig={statusConfig}
          paymentStatusConfig={paymentStatusConfig}
          onClose={() => setSelectedOrder(null)}
          onUpdateStatus={handleUpdateOrderStatus}
          onAddTracking={handleAddTracking}
          formatCurrency={formatCurrency}
          formatDate={formatDate}
          getDaysSinceOrder={getDaysSinceOrder}
          getEstimatedDeliveryDays={getEstimatedDeliveryDays}
        />
      )}

      {/* Quick Actions Summary */}
      <Card className="p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-center mb-2">
              <Package className="h-6 w-6 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-blue-600">
              {orders.filter(o => o.status === 'pending' || o.status === 'confirmed').length}
            </p>
            <p className="text-sm text-gray-600">Orders to Process</p>
            <Button variant="outline" size="sm" className="mt-2">
              Process Orders
            </Button>
          </div>

          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <div className="flex items-center justify-center mb-2">
              <Truck className="h-6 w-6 text-yellow-600" />
            </div>
            <p className="text-2xl font-bold text-yellow-600">
              {orders.filter(o => o.status === 'processing' && !o.trackingNumber).length}
            </p>
            <p className="text-sm text-gray-600">Ready to Ship</p>
            <Button variant="outline" size="sm" className="mt-2">
              Ship Orders
            </Button>
          </div>

          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="flex items-center justify-center mb-2">
              <AlertTriangle className="h-6 w-6 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-green-600">
              {orders.filter(o => o.paymentStatus === 'pending').length}
            </p>
            <p className="text-sm text-gray-600">Pending Payments</p>
            <Button variant="outline" size="sm" className="mt-2">
              Send Reminders
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
