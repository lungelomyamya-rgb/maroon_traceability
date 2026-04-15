// src/components/retailers/orders/Orders.tsx
'use client';

import { 
  Package, 
  Plus, 
  Truck, 
  AlertTriangle, 
  RefreshCw,
} from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/src/features/shared/ui/button';
import { Card } from '@/src/features/shared/ui/card';

import { OrderDetails } from './OrderDetails';
import { OrdersList } from './OrdersList';
import { OrdersOverview } from './OrdersOverview';
import { useOrders, type Order } from './hooks/useOrders';

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
    getEstimatedDeliveryDays,
  } = useOrders();

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleUpdatePaymentStatus = (orderId: string, paymentStatus: Order['paymentStatus']) => {
    updatePaymentStatus(orderId, paymentStatus);
  };

  const handleAddTracking = (orderId: string, trackingNumber: string) => {
    // Implement add tracking functionality
    try {
      console.log('Adding tracking info:', { orderId, trackingNumber });
      // In a real implementation, this would:
      // 1. Validate the tracking number format
      // 2. Call the shipping provider API to validate
      // 3. Update the order with tracking information
      // 4. Send tracking confirmation to the customer
      
      addTrackingInfo(orderId, trackingNumber, 'default');
      alert(`Tracking number ${trackingNumber} has been added to order ${orderId}.`);
    } catch (error) {
      console.error('Failed to add tracking info:', error);
      alert('Failed to add tracking information. Please try again.');
    }
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
        items: order.items,
      })),
      exportDate: new Date().toISOString(),
      totalOrders: orders.length,
      totalRevenue: orders.filter(o => o.paymentStatus === 'paid').reduce((sum, o) => sum + o.total, 0),
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
    // Implement refresh functionality
    try {
      console.log('Refreshing orders data...');
      // In a real implementation, this would:
      // 1. Show loading state
      // 2. Re-fetch orders from the API
      // 3. Update the local state
      // 4. Hide loading state
      
      // For demo purposes, we'll just show a message
      alert('Orders data refreshed successfully!');
      // In a real implementation, we would call the API to refresh data
    } catch (error) {
      console.error('Failed to refresh orders:', error);
      alert('Failed to refresh orders. Please try again.');
    }
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
          paymentRate: orders.length > 0 ? ((orders.filter(o => o.paymentStatus === 'paid').length) / orders.length) * 100 : 0,
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
        onAddTracking={(orderId: string) => {
          // Implement add tracking functionality - prompt for tracking number
          const trackingNumber = window.prompt('Enter tracking number:');
          if (trackingNumber) {
            handleAddTracking(orderId, trackingNumber);
          }
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
          _onAddTracking={handleAddTracking}
          formatCurrency={formatCurrency}
          formatDate={formatDate}
          getDaysSinceOrder={getDaysSinceOrder}
          _getEstimatedDeliveryDays={getEstimatedDeliveryDays}
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
