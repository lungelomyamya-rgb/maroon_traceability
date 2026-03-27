// src/components/retailers/orders/hooks/useOrders.ts
'use client';

import { useState, useEffect } from 'react';

interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'returned';
  paymentStatus: 'pending' | 'paid' | 'refunded';
  createdAt: string;
  shippingAddress: {
    street: string;
    city: string;
    province: string;
    postalCode: string;
  };
  trackingNumber?: string;
  courier?: string;
  estimatedDelivery?: string;
}

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const statusConfig = {
    'pending': { color: 'bg-yellow-100 text-yellow-800', icon: '⏳', label: 'Pending' },
    'confirmed': { color: 'bg-blue-100 text-blue-800', icon: '✅', label: 'Confirmed' },
    'processing': { color: 'bg-purple-100 text-purple-800', icon: '🔄', label: 'Processing' },
    'shipped': { color: 'bg-indigo-100 text-indigo-800', icon: '🚚', label: 'Shipped' },
    'delivered': { color: 'bg-green-100 text-green-800', icon: '📦', label: 'Delivered' },
    'cancelled': { color: 'bg-red-100 text-red-800', icon: '❌', label: 'Cancelled' },
    'returned': { color: 'bg-orange-100 text-orange-800', icon: '↩️', label: 'Returned' }
  };

  const paymentStatusConfig = {
    'pending': { color: 'bg-yellow-100 text-yellow-800', icon: '💰', label: 'Pending' },
    'paid': { color: 'bg-green-100 text-green-800', icon: '✅', label: 'Paid' },
    'refunded': { color: 'bg-gray-100 text-gray-800', icon: '↩️', label: 'Refunded' }
  };

  useEffect(() => {
    const loadMockOrders = async () => {
      const mockOrders: Order[] = [
        {
          id: 'ORD-2024-001',
          customerName: 'Sarah Johnson',
          customerEmail: 'sarah.j@email.com',
          items: [
            { productId: 'prod-001', productName: 'Organic Tomatoes', quantity: 5, price: 45.99 },
            { productId: 'prod-002', productName: 'Fresh Spinach', quantity: 3, price: 28.50 }
          ],
          total: 214.97,
          status: 'delivered',
          paymentStatus: 'paid',
          createdAt: '2024-03-10T10:30:00Z',
          shippingAddress: {
            street: '123 Main St',
            city: 'Cape Town',
            province: 'Western Cape',
            postalCode: '8001'
          },
          trackingNumber: 'TN-123456789',
          courier: 'FastTrack Delivery',
          estimatedDelivery: '2024-03-12T14:00:00Z'
        },
        {
          id: 'ORD-2024-002',
          customerName: 'Mike Chen',
          customerEmail: 'mike.chen@email.com',
          items: [
            { productId: 'prod-003', productName: 'Free-Range Eggs', quantity: 2, price: 65.00 },
            { productId: 'prod-004', productName: 'Whole Milk', quantity: 4, price: 48.00 }
          ],
          total: 314.00,
          status: 'shipped',
          paymentStatus: 'paid',
          createdAt: '2024-03-15T14:20:00Z',
          shippingAddress: {
            street: '456 Oak Ave',
            city: 'Johannesburg',
            province: 'Gauteng',
            postalCode: '2001'
          },
          trackingNumber: 'TN-987654321',
          courier: 'QuickShip',
          estimatedDelivery: '2024-03-18T10:00:00Z'
        },
        {
          id: 'ORD-2024-003',
          customerName: 'Lisa Thompson',
          customerEmail: 'lisa.thompson@email.com',
          items: [
            { productId: 'prod-005', productName: 'Artisan Bread', quantity: 6, price: 60.00 }
          ],
          total: 360.00,
          status: 'processing',
          paymentStatus: 'paid',
          createdAt: '2024-03-18T09:15:00Z',
          shippingAddress: {
            street: '789 Pine Rd',
            city: 'Durban',
            province: 'KwaZulu-Natal',
            postalCode: '4001'
          }
        },
        {
          id: 'ORD-2024-004',
          customerName: 'David Nkosi',
          customerEmail: 'david.nkosi@email.com',
          items: [
            { productId: 'prod-001', productName: 'Organic Tomatoes', quantity: 3, price: 45.99 },
            { productId: 'prod-006', productName: 'Mixed Herbs', quantity: 2, price: 35.50 }
          ],
          total: 203.47,
          status: 'confirmed',
          paymentStatus: 'pending',
          createdAt: '2024-03-19T16:45:00Z',
          shippingAddress: {
            street: '321 Elm St',
            city: 'Pretoria',
            province: 'Gauteng',
            postalCode: '0002'
          }
        },
        {
          id: 'ORD-2024-005',
          customerName: 'Emma Wilson',
          customerEmail: 'emma.wilson@email.com',
          items: [
            { productId: 'prod-002', productName: 'Fresh Spinach', quantity: 8, price: 28.50 },
            { productId: 'prod-007', productName: 'Seasonal Fruits', quantity: 1, price: 120.00 }
          ],
          total: 348.00,
          status: 'pending',
          paymentStatus: 'pending',
          createdAt: '2024-03-20T11:30:00Z',
          shippingAddress: {
            street: '654 Cedar Ln',
            city: 'Bloemfontein',
            province: 'Free State',
            postalCode: '9301'
          }
        }
      ];

      setOrders(mockOrders);
      setIsLoading(false);
    };

    loadMockOrders();
  }, []);

  const getOrdersByStatus = (status: Order['status']) => {
    return orders.filter(order => order.status === status);
  };

  const getOrdersByPaymentStatus = (paymentStatus: Order['paymentStatus']) => {
    return orders.filter(order => order.paymentStatus === paymentStatus);
  };

  const getRecentOrders = (days: number = 7) => {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    return orders.filter(order => new Date(order.createdAt) >= cutoffDate);
  };

  const getPendingOrders = () => {
    return orders.filter(order =>
      order.status === 'pending' ||
      order.status === 'confirmed' ||
      order.status === 'processing'
    );
  };

  const getDeliveredOrders = () => {
    return orders.filter(order => order.status === 'delivered');
  };

  const getCancelledOrders = () => {
    return orders.filter(order => order.status === 'cancelled' || order.status === 'returned');
  };

  const getOrdersByProvince = (province: string) => {
    return orders.filter(order => order.shippingAddress.province === province);
  };

  const getOrdersStats = () => {
    const total = orders.length;
    const pending = orders.filter(o => o.status === 'pending').length;
    const processing = orders.filter(o => o.status === 'processing').length;
    const shipped = orders.filter(o => o.status === 'shipped').length;
    const delivered = orders.filter(o => o.status === 'delivered').length;
    const cancelled = orders.filter(o => o.status === 'cancelled').length;
    const returned = orders.filter(o => o.status === 'returned').length;

    const totalRevenue = orders
      .filter(o => o.paymentStatus === 'paid')
      .reduce((sum, o) => sum + o.total, 0);

    const pendingRevenue = orders
      .filter(o => o.paymentStatus === 'pending')
      .reduce((sum, o) => sum + o.total, 0);

    const averageOrderValue = total > 0 ? totalRevenue / total : 0;

    const recentOrders = getRecentOrders(7).length;
    const pendingPayments = orders.filter(o => o.paymentStatus === 'pending').length;

    return {
      total,
      pending,
      processing,
      shipped,
      delivered,
      cancelled,
      returned,
      totalRevenue,
      pendingRevenue,
      averageOrderValue,
      recentOrders,
      pendingPayments,
      fulfillmentRate: total > 0 ? ((delivered + shipped) / total) * 100 : 0,
      paymentRate: total > 0 ? ((total - pendingPayments) / total) * 100 : 0
    };
  };

  const searchOrders = (query: string) => {
    const lowercaseQuery = query.toLowerCase();
    return orders.filter(order =>
      order.id.toLowerCase().includes(lowercaseQuery) ||
      order.customerName.toLowerCase().includes(lowercaseQuery) ||
      order.customerEmail.toLowerCase().includes(lowercaseQuery) ||
      order.shippingAddress.city.toLowerCase().includes(lowercaseQuery) ||
      (order.trackingNumber && order.trackingNumber.toLowerCase().includes(lowercaseQuery))
    );
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(prev => prev.map(order =>
      order.id === orderId ? { ...order, status } : order
    ));
  };

  const updatePaymentStatus = (orderId: string, paymentStatus: Order['paymentStatus']) => {
    setOrders(prev => prev.map(order =>
      order.id === orderId ? { ...order, paymentStatus } : order
    ));
  };

  const addTrackingInfo = (orderId: string, trackingNumber: string, courier: string, estimatedDelivery?: string) => {
    setOrders(prev => prev.map(order =>
      order.id === orderId ? {
        ...order,
        trackingNumber,
        courier,
        estimatedDelivery
      } : order
    ));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-ZA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getDaysSinceOrder = (orderDate: string) => {
    const today = new Date();
    const orderDateObj = new Date(orderDate);
    const diffTime = today.getTime() - orderDateObj.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getEstimatedDeliveryDays = (estimatedDelivery?: string) => {
    if (!estimatedDelivery) return null;
    const today = new Date();
    const deliveryDate = new Date(estimatedDelivery);
    const diffTime = deliveryDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  return {
    orders,
    isLoading,
    statusConfig,
    paymentStatusConfig,
    getOrdersByStatus,
    getOrdersByPaymentStatus,
    getRecentOrders,
    getPendingOrders,
    getDeliveredOrders,
    getCancelledOrders,
    getOrdersByProvince,
    getOrdersStats,
    searchOrders,
    updateOrderStatus,
    updatePaymentStatus,
    addTrackingInfo,
    formatCurrency,
    formatDate,
    getDaysSinceOrder,
    getEstimatedDeliveryDays
  };
}

export type { Order, OrderItem };
