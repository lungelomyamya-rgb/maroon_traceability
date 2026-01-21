// src/app/marketplace/orders/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/contexts/userContext';
import ErrorBoundary from '@/components/errorBoundary';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Package, 
  Truck, 
  CheckCircle, 
  Clock, 
  XCircle,
  Eye,
  Search,
  Filter,
  Calendar,
  MapPin,
  Phone,
  Mail,
  User,
  ArrowRight,
  ChevronLeft
} from 'lucide-react';
import { getAssetPath } from '@/lib/utils/assetPath';

interface Order {
  id: string;
  orderNumber: string;
  date: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  items: Array<{
    id: string;
    name: string;
    quantity: number;
    price: number;
    image: string;
    farmer: string;
  }>;
  shipping: {
    address: string;
    city: string;
    province: string;
    postalCode: string;
    method: string;
    trackingNumber?: string;
    estimatedDelivery?: string;
  };
  payment: {
    method: string;
    status: 'paid' | 'pending' | 'failed';
    transactionId?: string;
  };
  customer: {
    name: string;
    email: string;
    phone: string;
  };
}

const mockOrders: Order[] = [
  {
    id: 'order1',
    orderNumber: 'ORD-2024-001',
    date: '2024-01-15',
    status: 'delivered',
    total: 258.97,
    items: [
      {
        id: 'prod1',
        name: 'Premium Moringa Powder - 250g',
        quantity: 2,
        price: 89.99,
        image: '/images/moringa-powder.jpg',
        farmer: 'Thabo Molefe'
      },
      {
        id: 'prod2',
        name: 'Moringa Tea Bags - 20 count',
        quantity: 1,
        price: 45.99,
        image: '/images/moringa-tea.jpg',
        farmer: 'Grace Nkosi'
      }
    ],
    shipping: {
      address: '123 Main Street',
      city: 'Johannesburg',
      province: 'Gauteng',
      postalCode: '2001',
      method: 'Standard Delivery',
      trackingNumber: 'TRK-2024-001',
      estimatedDelivery: '2024-01-18'
    },
    payment: {
      method: 'Credit Card',
      status: 'paid',
      transactionId: 'TXN-2024-001'
    },
    customer: {
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+27 83 123 4567'
    }
  },
  {
    id: 'order2',
    orderNumber: 'ORD-2024-002',
    date: '2024-01-18',
    status: 'shipped',
    total: 125.99,
    items: [
      {
        id: 'prod3',
        name: 'Moringa Capsules - 60 count',
        quantity: 1,
        price: 125.99,
        image: '/images/moringa-capsules.jpg',
        farmer: 'Samuel Khumalo'
      }
    ],
    shipping: {
      address: '456 Oak Avenue',
      city: 'Cape Town',
      province: 'Western Cape',
      postalCode: '8001',
      method: 'Express Delivery',
      trackingNumber: 'TRK-2024-002',
      estimatedDelivery: '2024-01-20'
    },
    payment: {
      method: 'EFT',
      status: 'paid',
      transactionId: 'TXN-2024-002'
    },
    customer: {
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      phone: '+27 21 987 6543'
    }
  },
  {
    id: 'order3',
    orderNumber: 'ORD-2024-003',
    date: '2024-01-20',
    status: 'processing',
    total: 179.98,
    items: [
      {
        id: 'prod1',
        name: 'Premium Moringa Powder - 250g',
        quantity: 2,
        price: 89.99,
        image: '/images/moringa-powder.jpg',
        farmer: 'Thabo Molefe'
      }
    ],
    shipping: {
      address: '789 Pine Road',
      city: 'Durban',
      province: 'KwaZulu-Natal',
      postalCode: '4001',
      method: 'Standard Delivery'
    },
    payment: {
      method: 'Credit Card',
      status: 'paid',
      transactionId: 'TXN-2024-003'
    },
    customer: {
      name: 'Mike Johnson',
      email: 'mike.j@example.com',
      phone: '+27 31 456 7890'
    }
  }
];

export default function OrdersPage() {
  const { currentUser } = useUser();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>(mockOrders);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);

  useEffect(() => {
    if (!currentUser || currentUser.role !== 'public') {
      router.push('/login');
      return;
    }
  }, [currentUser, router]);

  useEffect(() => {
    let filtered = orders;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(order =>
        order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.items.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
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
      case 'delivered':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'shipped':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'pending':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="h-4 w-4" />;
      case 'shipped':
        return <Truck className="h-4 w-4" />;
      case 'processing':
        return <Package className="h-4 w-4" />;
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  const viewOrderDetails = (order: Order) => {
    setSelectedOrder(order);
    setShowOrderDetails(true);
  };

  if (!currentUser || currentUser.role !== 'public') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <>
        {/* Header */}
        <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2 sm:gap-4">
              <button
                onClick={() => router.push('/marketplace')}
                className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                aria-label="Go to marketplace"
              >
                <img 
                  src={getAssetPath("/images/maroonLogo.png")} 
                  alt="MAROON" 
                  className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12"
                />
              </button>
              <div>
                <h1 className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent truncate">
                  My Orders
                </h1>
                <p className="text-xs sm:text-sm text-gray-600 hidden sm:block">
                  Track and manage your orders
                </p>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Back Button Below Nav Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => router.push('/marketplace')}
          className="h-8 sm:h-10"
        >
          <span className="hidden sm:inline">Back</span>
          <span className="sm:hidden">Back</span>
        </Button>
      </div>

      {/* Main Content */}
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
          {/* Filters */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4 lg:p-6 mb-4 sm:mb-6">
            <div className="flex flex-col lg:flex-row gap-3 sm:gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search by order number, customer name, or product..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 sm:pl-12 h-10 sm:h-11 text-sm sm:text-base border-gray-300 focus:border-green-500 focus:ring-green-500"
                  />
                </div>
              </div>
              <div className="lg:w-48">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="h-10 sm:h-11 text-sm sm:text-base border-gray-300 focus:border-green-500 focus:ring-green-500">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="shipped">Shipped</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Orders List */}
          {filteredOrders.length === 0 ? (
            <div className="text-center py-8 sm:py-12">
              <Package className="h-12 w-12 sm:h-16 sm:w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">No orders found</h3>
              <p className="text-sm sm:text-base text-gray-600 mb-4">Try adjusting your search or filters</p>
              <Button 
                onClick={() => router.push('/marketplace/products')}
                className="h-9 sm:h-10 px-4 sm:px-6"
              >
                Start Shopping
              </Button>
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {filteredOrders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4 lg:p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 sm:gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 sm:gap-3 mb-2">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                          {order.orderNumber}
                        </h3>
                        <Badge className={`text-xs sm:text-sm ${getStatusColor(order.status)}`}>
                          {getStatusIcon(order.status)}
                          <span className="ml-1 capitalize">{order.status}</span>
                        </Badge>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-600 mb-2">
                        Placed on {new Date(order.date).toLocaleDateString()}
                      </p>
                      <div className="flex flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Package className="h-3 w-3 sm:h-4 sm:w-4" />
                          <span>{order.items.length} items</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3 sm:h-4 sm:w-4" />
                          <span className="truncate">{order.customer.name}</span>
                        </div>
                        {order.shipping.trackingNumber && (
                          <div className="flex items-center gap-1">
                            <Truck className="h-3 w-3 sm:h-4 sm:w-4" />
                            <span className="hidden sm:inline">Tracking: {order.shipping.trackingNumber}</span>
                            <span className="sm:hidden">{order.shipping.trackingNumber}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
                      <div className="text-right">
                        <p className="text-xs sm:text-sm text-gray-600">Total</p>
                        <p className="text-lg sm:text-xl font-bold text-gray-900">
                          R{order.total.toFixed(2)}
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => viewOrderDetails(order)}
                        className="whitespace-nowrap h-8 sm:h-9 px-3 sm:px-4 text-xs sm:text-sm"
                      >
                        <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                        <span className="hidden sm:inline">View Details</span>
                        <span className="sm:hidden">Details</span>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Order Details Modal */}
      {showOrderDetails && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-3 sm:p-4 lg:p-6 border-b">
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 truncate">
                  Order Details - {selectedOrder.orderNumber}
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowOrderDetails(false)}
                  className="h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0"
                >
                  ×
                </Button>
              </div>
            </div>
            
            <div className="p-3 sm:p-4 lg:p-6 space-y-3 sm:space-y-4 lg:space-y-6">
              {/* Order Status */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Order Status</h3>
                <Badge className={getStatusColor(selectedOrder.status)}>
                  {getStatusIcon(selectedOrder.status)}
                  <span className="ml-1 capitalize">{selectedOrder.status}</span>
                </Badge>
              </div>

              {/* Items */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-2 sm:mb-3">Items</h3>
                <div className="space-y-2 sm:space-y-3">
                  {selectedOrder.items.map((item) => (
                    <div key={item.id} className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 p-2 sm:p-3 bg-gray-50 rounded-lg">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Package className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 text-sm sm:text-base truncate">{item.name}</h4>
                        <p className="text-xs sm:text-sm text-gray-600">Farmer: {item.farmer}</p>
                        <p className="text-xs sm:text-sm text-gray-600">Quantity: {item.quantity}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="font-semibold text-gray-900 text-sm sm:text-base">
                          R{(item.price * item.quantity).toFixed(2)}
                        </p>
                        <p className="text-xs sm:text-sm text-gray-600">R{item.price.toFixed(2)} each</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping Information */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-2 sm:mb-3">Shipping Information</h3>
                <div className="bg-gray-50 p-3 sm:p-4 rounded-lg space-y-2">
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-gray-600 flex-shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-sm text-gray-600 break-words">
                      {selectedOrder.shipping.address}, {selectedOrder.shipping.city}, 
                      {selectedOrder.shipping.province} {selectedOrder.shipping.postalCode}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Truck className="h-4 w-4 text-gray-600 flex-shrink-0" />
                    <span className="text-xs sm:text-sm text-gray-600">{selectedOrder.shipping.method}</span>
                  </div>
                  {selectedOrder.shipping.trackingNumber && (
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-gray-600 flex-shrink-0" />
                      <span className="text-xs sm:text-sm text-gray-600 break-all">
                        Tracking: {selectedOrder.shipping.trackingNumber}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Customer Information */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-2 sm:mb-3">Customer Information</h3>
                <div className="bg-gray-50 p-3 sm:p-4 rounded-lg space-y-2">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-600 flex-shrink-0" />
                    <span className="text-xs sm:text-sm text-gray-600 truncate">{selectedOrder.customer.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-600 flex-shrink-0" />
                    <span className="text-xs sm:text-sm text-gray-600 truncate">{selectedOrder.customer.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-600 flex-shrink-0" />
                    <span className="text-xs sm:text-sm text-gray-600">{selectedOrder.customer.phone}</span>
                  </div>
                </div>
              </div>

              {/* Payment Information */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-2 sm:mb-3">Payment Information</h3>
                <div className="bg-gray-50 p-3 sm:p-4 rounded-lg space-y-2">
                  <div className="flex justify-between">
                    <span className="text-xs sm:text-sm text-gray-600">Method:</span>
                    <span className="text-xs sm:text-sm font-medium">{selectedOrder.payment.method}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs sm:text-sm text-gray-600">Status:</span>
                    <Badge className={`text-xs sm:text-sm ${selectedOrder.payment.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {selectedOrder.payment.status}
                    </Badge>
                  </div>
                  {selectedOrder.payment.transactionId && (
                    <div className="flex justify-between">
                      <span className="text-xs sm:text-sm text-gray-600">Transaction ID:</span>
                      <span className="text-xs sm:text-sm font-medium break-all">{selectedOrder.payment.transactionId}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Order Summary */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-2 sm:mb-3">Order Summary</h3>
                <div className="bg-gray-50 p-3 sm:p-4 rounded-lg space-y-2">
                  <div className="flex justify-between">
                    <span className="text-xs sm:text-sm text-gray-600">Subtotal:</span>
                    <span className="text-xs sm:text-sm font-medium">R{selectedOrder.total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs sm:text-sm text-gray-600">Shipping:</span>
                    <span className="text-xs sm:text-sm font-medium">Free</span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between">
                      <span className="font-semibold text-gray-900 text-sm sm:text-base">Total:</span>
                      <span className="font-bold text-base sm:text-lg text-gray-900">R{selectedOrder.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
    </ErrorBoundary>
  );
}
