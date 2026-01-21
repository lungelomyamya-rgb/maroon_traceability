// src/app/logistics/order-tracking.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/contexts/userContext';
import { DashboardLayout } from '@/components/dashboard/dashboardLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Truck, MapPin, Clock, CheckCircle, AlertCircle, Search, Filter, RefreshCw, Phone, MessageSquare } from 'lucide-react';

interface OrderTracking {
  id: string;
  orderId: string;
  productId: string;
  customerName: string;
  customerPhone: string;
  currentStatus: 'pending' | 'collected' | 'in-transit' | 'out-for-delivery' | 'delivered' | 'delayed' | 'cancelled';
  estimatedDelivery: string;
  actualDelivery?: string;
  currentLocation?: {
    lat: number;
    lng: number;
    address: string;
  };
  driver: {
    id: string;
    name: string;
    phone: string;
    vehicle: string;
  };
  route: {
    origin: string;
    destination: string;
    distance: number;
    estimatedDuration: number;
  };
  updates: Array<{
    timestamp: string;
    status: string;
    location: string;
    notes?: string;
    updatedBy: string;
  }>;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  specialInstructions?: string;
  proofOfDelivery?: {
    signature: string;
    photo?: string;
    timestamp: string;
    receivedBy: string;
  };
}

export default function OrderTrackingPage() {
  const { currentUser } = useUser();
  const router = useRouter();
  const [orders, setOrders] = useState<OrderTracking[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<OrderTracking[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<OrderTracking | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!currentUser || currentUser.role !== 'logistics') {
      router.push('/unauthorized');
      return;
    }

    // Load mock order tracking data
    const mockOrders: OrderTracking[] = [
      {
        id: 'track1',
        orderId: 'ORD-2025-001',
        productId: 'PRD-2024-001',
        customerName: 'Fresh Market Cape Town',
        customerPhone: '+27 21 987 6543',
        currentStatus: 'in-transit',
        estimatedDelivery: '2025-01-25T14:00:00Z',
        currentLocation: {
          lat: -33.8688,
          lng: 18.5058,
          address: 'N1 Highway, near Paarl'
        },
        driver: {
          id: 'driver1',
          name: 'John Smith',
          phone: '+27 83 123 4567',
          vehicle: 'CA 123456 - Mercedes Actros'
        },
        route: {
          origin: 'Green Valley Farm, Stellenbosch',
          destination: 'Fresh Market Cape Town',
          distance: 65,
          estimatedDuration: 120
        },
        updates: [
          {
            timestamp: '2025-01-25T08:00:00Z',
            status: 'collected',
            location: 'Green Valley Farm, Stellenbosch',
            notes: 'Vehicle loaded and inspected',
            updatedBy: 'John Smith'
          },
          {
            timestamp: '2025-01-25T09:30:00Z',
            status: 'in-transit',
            location: 'N1 Highway, near Paarl',
            notes: 'On schedule, traffic normal',
            updatedBy: 'John Smith'
          }
        ],
        priority: 'high',
        specialInstructions: 'Refrigerated goods - maintain 2-4°C'
      },
      {
        id: 'track2',
        orderId: 'ORD-2025-002',
        productId: 'PRD-2024-002',
        customerName: 'Organic Foods Johannesburg',
        customerPhone: '+27 11 234 5678',
        currentStatus: 'delivered',
        estimatedDelivery: '2025-01-24T16:00:00Z',
        actualDelivery: '2025-01-24T15:45:00Z',
        driver: {
          id: 'driver2',
          name: 'Maria Johnson',
          phone: '+27 82 987 6543',
          vehicle: 'CA 789012 - Isuzu NPR'
        },
        route: {
          origin: 'Sunny Acres Farm, Pretoria',
          destination: 'Organic Foods Johannesburg',
          distance: 45,
          estimatedDuration: 90
        },
        updates: [
          {
            timestamp: '2025-01-24T10:00:00Z',
            status: 'collected',
            location: 'Sunny Acres Farm, Pretoria',
            updatedBy: 'Maria Johnson'
          },
          {
            timestamp: '2025-01-24T11:30:00Z',
            status: 'in-transit',
            location: 'N14 Highway',
            updatedBy: 'Maria Johnson'
          },
          {
            timestamp: '2025-01-24T15:45:00Z',
            status: 'delivered',
            location: 'Organic Foods Johannesburg',
            notes: 'Delivered to receiving department',
            updatedBy: 'Maria Johnson'
          }
        ],
        priority: 'medium',
        proofOfDelivery: {
          signature: 'signature_data',
          timestamp: '2025-01-24T15:45:00Z',
          receivedBy: 'James Wilson - Receiving Manager'
        }
      },
      {
        id: 'track3',
        orderId: 'ORD-2025-003',
        productId: 'PRD-2024-003',
        customerName: 'Health Food Store Durban',
        customerPhone: '+27 31 456 7890',
        currentStatus: 'delayed',
        estimatedDelivery: '2025-01-25T12:00:00Z',
        driver: {
          id: 'driver1',
          name: 'John Smith',
          phone: '+27 83 123 4567',
          vehicle: 'CA 123456 - Mercedes Actros'
        },
        route: {
          origin: 'Coastal Farm, Port Elizabeth',
          destination: 'Health Food Store Durban',
          distance: 750,
          estimatedDuration: 480
        },
        updates: [
          {
            timestamp: '2025-01-24T06:00:00Z',
            status: 'collected',
            location: 'Coastal Farm, Port Elizabeth',
            updatedBy: 'John Smith'
          },
          {
            timestamp: '2025-01-24T14:00:00Z',
            status: 'delayed',
            location: 'Rest Stop, Kokstad',
            notes: 'Mechanical issue - tire replacement. Estimated delay: 2 hours',
            updatedBy: 'John Smith'
          }
        ],
        priority: 'urgent',
        specialInstructions: 'Customer notified of delay'
      }
    ];

    setOrders(mockOrders);
    setFilteredOrders(mockOrders);
  }, [currentUser, router]);

  useEffect(() => {
    let filtered = orders;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(order =>
        order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.productId.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.currentStatus === statusFilter);
    }

    // Apply priority filter
    if (priorityFilter !== 'all') {
      filtered = filtered.filter(order => order.priority === priorityFilter);
    }

    setFilteredOrders(filtered);
  }, [orders, searchTerm, statusFilter, priorityFilter]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-gray-100 text-gray-800';
      case 'collected': return 'bg-blue-100 text-blue-800';
      case 'in-transit': return 'bg-yellow-100 text-yellow-800';
      case 'out-for-delivery': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'delayed': return 'bg-red-100 text-red-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'bg-gray-100 text-gray-800';
      case 'medium': return 'bg-blue-100 text-blue-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'urgent': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string, notes?: string) => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    setOrders(prev => prev.map(order => {
      if (order.id === orderId) {
        const updatedOrder = {
          ...order,
          currentStatus: newStatus as any,
          updates: [
            ...order.updates,
            {
              timestamp: new Date().toISOString(),
              status: newStatus,
              location: order.currentLocation?.address || 'Unknown',
              notes,
              updatedBy: currentUser?.name || 'System'
            }
          ]
        };
        return updatedOrder;
      }
      return order;
    }));

    setLoading(false);
  };

  const sendNotification = async (orderId: string, type: 'sms' | 'call') => {
    setLoading(true);
    // Simulate sending notification
    await new Promise(resolve => setTimeout(resolve, 1000));
    alert(`${type === 'sms' ? 'SMS' : 'Call'} notification sent to customer for order ${orderId}`);
    setLoading(false);
  };

  if (!currentUser || currentUser.role !== 'logistics') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div>
      </div>
    );
  }

  return (
    <>
      {/* Back Button Above DashboardLayout */}
      <div className="px-4 sm:px-6 lg:px-8 pt-4">
        <Button
          variant="outline"
          onClick={() => router.push('/logistics')}
          className="inline-flex items-center gap-2 text-sm"
        >
          Back
        </Button>
      </div>
      
      <DashboardLayout
        title="Order Tracking"
        description="Real-time order tracking and delivery management"
      >
        <div className="space-y-6">
          {/* Filters and Search */}
          <Card className="p-4 sm:p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by order ID, customer, or product..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full lg:w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="collected">Collected</SelectItem>
                  <SelectItem value="in-transit">In Transit</SelectItem>
                  <SelectItem value="out-for-delivery">Out for Delivery</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="delayed">Delayed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-full lg:w-48">
                  <SelectValue placeholder="Filter by priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" onClick={() => window.location.reload()}>
                <RefreshCw className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Refresh</span>
                <span className="sm:hidden">↻</span>
              </Button>
            </div>
          </div>
        </Card>

        {/* Orders List */}
        <div className="grid gap-4">
          {filteredOrders.map((order) => (
            <Card key={order.id} className="p-4 sm:p-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                    <h3 className="text-base sm:text-lg font-semibold">{order.orderId}</h3>
                    <div className="flex flex-wrap gap-2">
                      <Badge className={getStatusColor(order.currentStatus)}>
                        {order.currentStatus.replace('-', ' ')}
                      </Badge>
                      <Badge className={getPriorityColor(order.priority)}>
                        {order.priority}
                      </Badge>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Truck className="h-4 w-4 flex-shrink-0" />
                      <span className="truncate">{order.driver.name} - {order.driver.vehicle}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 flex-shrink-0" />
                      <span className="truncate">{order.route.origin} → {order.route.destination}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 flex-shrink-0" />
                      <span className="text-xs">Est: {new Date(order.estimatedDelivery).toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 flex-shrink-0" />
                      <span className="text-xs">{order.customerPhone}</span>
                    </div>
                  </div>
                  {order.specialInstructions && (
                    <p className="text-sm text-amber-600 mt-2">
                      <AlertCircle className="h-4 w-4 inline mr-1" />
                      {order.specialInstructions}
                    </p>
                  )}
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedOrder(order)}
                    className="w-full sm:w-auto"
                  >
                    View Details
                  </Button>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => sendNotification(order.id, 'sms')}
                      disabled={loading}
                    >
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => sendNotification(order.id, 'call')}
                      disabled={loading}
                    >
                      <Phone className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Order Details Modal */}
        {selectedOrder && (
          <Card className="p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-semibold">Order Details - {selectedOrder.orderId}</h3>
              <Button variant="outline" onClick={() => setSelectedOrder(null)}>
                Close
              </Button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-3">Customer Information</h4>
                <div className="space-y-2 text-sm">
                  <p><strong>Name:</strong> {selectedOrder.customerName}</p>
                  <p><strong>Phone:</strong> {selectedOrder.customerPhone}</p>
                  <p><strong>Product:</strong> {selectedOrder.productId}</p>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-3">Driver Information</h4>
                <div className="space-y-2 text-sm">
                  <p><strong>Name:</strong> {selectedOrder.driver.name}</p>
                  <p><strong>Phone:</strong> {selectedOrder.driver.phone}</p>
                  <p><strong>Vehicle:</strong> {selectedOrder.driver.vehicle}</p>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="font-medium mb-3">Tracking Updates</h4>
              <div className="space-y-3">
                {selectedOrder.updates.map((update, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      {update.status === 'delivered' ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : update.status === 'delayed' ? (
                        <AlertCircle className="h-4 w-4 text-red-600" />
                      ) : (
                        <Truck className="h-4 w-4 text-blue-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{update.status.replace('-', ' ')}</p>
                          <p className="text-sm text-gray-600">{update.location}</p>
                          {update.notes && <p className="text-sm text-gray-500 mt-1">{update.notes}</p>}
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-500">
                            {new Date(update.timestamp).toLocaleString()}
                          </p>
                          <p className="text-xs text-gray-400">{update.updatedBy}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {selectedOrder.proofOfDelivery && (
              <div className="mt-6">
                <h4 className="font-medium mb-3">Proof of Delivery</h4>
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <p><strong>Received By:</strong> {selectedOrder.proofOfDelivery.receivedBy}</p>
                    <p><strong>Time:</strong> {new Date(selectedOrder.proofOfDelivery.timestamp).toLocaleString()}</p>
                    <p><strong>Signature:</strong> ✓ Verified</p>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-6 flex flex-wrap gap-2">
              {selectedOrder.currentStatus === 'collected' && (
                <Button onClick={() => updateOrderStatus(selectedOrder.id, 'in-transit')}>
                  Mark In Transit
                </Button>
              )}
              {selectedOrder.currentStatus === 'in-transit' && (
                <Button onClick={() => updateOrderStatus(selectedOrder.id, 'out-for-delivery')}>
                  Out for Delivery
                </Button>
              )}
              {selectedOrder.currentStatus === 'out-for-delivery' && (
                <Button onClick={() => updateOrderStatus(selectedOrder.id, 'delivered')}>
                  Mark Delivered
                </Button>
              )}
            </div>
          </Card>
        )}
        </div>
      </DashboardLayout>
    </>
  );
}
