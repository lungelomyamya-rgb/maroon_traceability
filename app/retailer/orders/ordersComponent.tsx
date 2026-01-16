// src/app/retailer/orders/ordersComponent.tsx
'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Search,
  Filter,
  Eye,
  Edit,
  Truck,
  Package,
  Download,
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock,
  ArrowRight,
  MoreHorizontal,
  Printer,
  Mail
} from 'lucide-react';

interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  items: Array<{
    productId: string;
    productName: string;
    quantity: number;
    price: number;
  }>;
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
  notes?: string;
}

export default function OrdersComponent() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    // Mock data for orders
    const mockOrders: Order[] = [
      {
        id: 'ORD-001',
        customerName: 'Sarah Johnson',
        customerEmail: 'sarah.johnson@email.com',
        items: [
          { productId: 'prod1', productName: 'Premium Organic Moringa Powder', quantity: 2, price: 89.99 }
        ],
        total: 179.98,
        status: 'pending',
        paymentStatus: 'paid',
        createdAt: '2025-01-18T10:30:00Z',
        shippingAddress: {
          street: '123 Main St',
          city: 'Cape Town',
          province: 'Western Cape',
          postalCode: '8001'
        }
      },
      {
        id: 'ORD-002',
        customerName: 'Michael Chen',
        customerEmail: 'michael.chen@email.com',
        items: [
          { productId: 'prod2', productName: 'Moringa Tea Bags', quantity: 1, price: 45.00 },
          { productId: 'prod1', productName: 'Premium Organic Moringa Powder', quantity: 1, price: 89.99 }
        ],
        total: 134.99,
        status: 'confirmed',
        paymentStatus: 'paid',
        createdAt: '2025-01-18T09:15:00Z',
        shippingAddress: {
          street: '456 Oak Ave',
          city: 'Johannesburg',
          province: 'Gauteng',
          postalCode: '2000'
        },
        estimatedDelivery: '2025-01-22'
      },
      {
        id: 'ORD-003',
        customerName: 'Emma Wilson',
        customerEmail: 'emma.wilson@email.com',
        items: [
          { productId: 'prod3', productName: 'Moringa Capsules', quantity: 3, price: 65.00 }
        ],
        total: 195.00,
        status: 'shipped',
        paymentStatus: 'paid',
        createdAt: '2025-01-17T14:20:00Z',
        shippingAddress: {
          street: '789 Pine Rd',
          city: 'Durban',
          province: 'KwaZulu-Natal',
          postalCode: '4001'
        },
        trackingNumber: 'ZAW123456789',
        courier: 'FastCourier',
        estimatedDelivery: '2025-01-20'
      },
      {
        id: 'ORD-004',
        customerName: 'James Brown',
        customerEmail: 'james.brown@email.com',
        items: [
          { productId: 'prod1', productName: 'Premium Organic Moringa Powder', quantity: 1, price: 89.99 }
        ],
        total: 89.99,
        status: 'delivered',
        paymentStatus: 'paid',
        createdAt: '2025-01-15T11:45:00Z',
        shippingAddress: {
          street: '321 Elm St',
          city: 'Pretoria',
          province: 'Gauteng',
          postalCode: '0002'
        },
        trackingNumber: 'ZAW987654321',
        courier: 'FastCourier'
      }
    ];

    setOrders(mockOrders);
    setFilteredOrders(mockOrders);
    setLoading(false);
  }, []);

  useEffect(() => {
    let filtered = orders;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(order => 
        order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    setFilteredOrders(filtered);
  }, [orders, searchTerm, statusFilter]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'processing': return 'bg-purple-100 text-purple-800';
      case 'shipped': return 'bg-indigo-100 text-indigo-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'returned': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'refunded': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const updateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  const generateShippingLabel = (order: Order) => {
    // In a real app, this would generate a PDF shipping label
    alert(`Generating shipping label for order ${order.id}`);
  };

  const sendTrackingEmail = (order: Order) => {
    // In a real app, this would send tracking info email
    alert(`Sending tracking email for order ${order.id}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-3 mb-6">
          <Button variant="outline" size="sm" className="w-full sm:w-auto">
            <Download className="h-4 w-4 mr-2" />
            Export Orders
          </Button>
          <Button variant="outline" size="sm" className="w-full sm:w-auto">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>

        {/* Filters */}
        <Card className="p-3 sm:p-4 mb-4 sm:mb-6">
          <div className="flex flex-col gap-3 sm:gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search orders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 text-sm"
                />
              </div>
            </div>
            <div className="w-full">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="text-sm">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Orders</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                  <SelectItem value="returned">Returned</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        {/* Orders List */}
        <Card className="p-6">
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div key={order.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg">{order.id}</h3>
                      <Badge className={getStatusColor(order.status)}>
                        {order.status}
                      </Badge>
                      <Badge className={getPaymentStatusColor(order.paymentStatus)}>
                        {order.paymentStatus}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-3">
                      <div>
                        <p className="text-sm font-medium text-gray-900">Customer</p>
                        <p className="text-sm text-gray-600">{order.customerName}</p>
                        <p className="text-sm text-gray-500">{order.customerEmail}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Shipping Address</p>
                        <p className="text-sm text-gray-600">{order.shippingAddress.street}</p>
                        <p className="text-sm text-gray-600">
                          {order.shippingAddress.city}, {order.shippingAddress.province} {order.shippingAddress.postalCode}
                        </p>
                      </div>
                    </div>

                    <div className="mb-3">
                      <p className="text-sm font-medium text-gray-900 mb-2">Order Items</p>
                      <div className="space-y-2">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                            <div>
                              <p className="text-sm font-medium">{item.productName}</p>
                              <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                            </div>
                            <p className="text-sm font-medium">R{(item.price * item.quantity).toFixed(2)}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500">
                          Order Date: {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                        {order.estimatedDelivery && (
                          <p className="text-sm text-gray-500">
                            Est. Delivery: {new Date(order.estimatedDelivery).toLocaleDateString()}
                          </p>
                        )}
                        {order.trackingNumber && (
                          <p className="text-sm text-gray-500">
                            Tracking: {order.trackingNumber} ({order.courier})
                          </p>
                        )}
                      </div>
                      <p className="text-lg font-bold text-gray-900">Total: R{order.total.toFixed(2)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <Button variant="outline" size="sm" onClick={() => setSelectedOrder(order)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    
                    {order.status === 'pending' && (
                      <Button size="sm" onClick={() => updateOrderStatus(order.id, 'confirmed')}>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Confirm
                      </Button>
                    )}
                    
                    {order.status === 'confirmed' && (
                      <Button size="sm" onClick={() => updateOrderStatus(order.id, 'processing')}>
                        <Package className="h-4 w-4 mr-2" />
                        Process
                      </Button>
                    )}
                    
                    {order.status === 'processing' && (
                      <Button size="sm" onClick={() => updateOrderStatus(order.id, 'shipped')}>
                        <Truck className="h-4 w-4 mr-2" />
                        Ship
                      </Button>
                    )}
                    
                    {(order.status === 'shipped' || order.status === 'delivered') && (
                      <>
                        <Button variant="outline" size="sm" onClick={() => generateShippingLabel(order)}>
                          <Printer className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => sendTrackingEmail(order)}>
                          <Mail className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
