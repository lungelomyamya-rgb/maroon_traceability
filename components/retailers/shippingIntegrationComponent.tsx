// src/app/retailer/shipping/shippingIntegrationComponent.tsx
'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { 
  Truck,
  Package,
  MapPin,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Search,
  Filter,
  Plus,
  Eye,
  Edit,
  Download,
  RefreshCw,
  BarChart3,
  TrendingUp,
  TrendingDown,
  MoreHorizontal,
  Send,
  Printer,
  Calendar,
  DollarSign,
  Zap,
  Globe,
  Phone,
  Mail,
  Settings,
  Link,
  QrCode,
  FileText,
  User
} from 'lucide-react';

interface ShippingProvider {
  id: string;
  name: string;
  type: 'local' | 'national' | 'international';
  services: string[];
  pricing: {
    baseRate: number;
    ratePerKg: number;
    freeShippingThreshold: number;
  };
  deliveryTime: {
    min: number;
    max: number;
    unit: 'hours' | 'days';
  };
  tracking: boolean;
  insurance: boolean;
  status: 'active' | 'inactive' | 'maintenance';
  apiConnected: boolean;
  supportContact: {
    phone: string;
    email: string;
  };
}

interface Shipment {
  id: string;
  orderId: string;
  customerName: string;
  customerAddress: string;
  provider: string;
  service: string;
  trackingNumber: string;
  status: 'pending' | 'picked-up' | 'in-transit' | 'out-for-delivery' | 'delivered' | 'returned' | 'lost';
  estimatedDelivery: string;
  actualDelivery?: string;
  cost: number;
  weight: number;
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  insurance: boolean;
  signatureRequired: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function ShippingIntegrationComponent() {
  const [providers, setProviders] = useState<ShippingProvider[]>([]);
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [providerFilter, setProviderFilter] = useState('all');
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
  const [showShipmentDetails, setShowShipmentDetails] = useState(false);

  useEffect(() => {
    // Mock shipping providers
    const mockProviders: ShippingProvider[] = [
      {
        id: 'provider1',
        name: 'SA Express',
        type: 'national',
        services: ['Standard', 'Express', 'Same Day'],
        pricing: {
          baseRate: 45.00,
          ratePerKg: 12.50,
          freeShippingThreshold: 500.00
        },
        deliveryTime: {
          min: 1,
          max: 3,
          unit: 'days'
        },
        tracking: true,
        insurance: true,
        status: 'active',
        apiConnected: true,
        supportContact: {
          phone: '+27 11 123 4567',
          email: 'support@saexpress.co.za'
        }
      },
      {
        id: 'provider2',
        name: 'FastCourier',
        type: 'local',
        services: ['Local Delivery', 'Express Local'],
        pricing: {
          baseRate: 25.00,
          ratePerKg: 8.00,
          freeShippingThreshold: 200.00
        },
        deliveryTime: {
          min: 2,
          max: 6,
          unit: 'hours'
        },
        tracking: true,
        insurance: false,
        status: 'active',
        apiConnected: true,
        supportContact: {
          phone: '+27 21 987 6543',
          email: 'info@fastcourier.co.za'
        }
      },
      {
        id: 'provider3',
        name: 'DHL South Africa',
        type: 'international',
        services: ['International Express', 'International Standard'],
        pricing: {
          baseRate: 150.00,
          ratePerKg: 45.00,
          freeShippingThreshold: 1000.00
        },
        deliveryTime: {
          min: 3,
          max: 7,
          unit: 'days'
        },
        tracking: true,
        insurance: true,
        status: 'active',
        apiConnected: false,
        supportContact: {
          phone: '+27 11 555 1234',
          email: 'business@dhl.co.za'
        }
      }
    ];

    // Mock shipments
    const mockShipments: Shipment[] = [
      {
        id: 'ship1',
        orderId: 'ORD-2024-001',
        customerName: 'Sarah Johnson',
        customerAddress: '123 Main Street, Cape Town, 8001',
        provider: 'SA Express',
        service: 'Standard',
        trackingNumber: 'SA123456789ZA',
        status: 'in-transit',
        estimatedDelivery: '2024-01-18',
        cost: 67.50,
        weight: 2.5,
        dimensions: { length: 20, width: 15, height: 10 },
        insurance: true,
        signatureRequired: true,
        createdAt: '2024-01-15',
        updatedAt: '2024-01-16'
      },
      {
        id: 'ship2',
        orderId: 'ORD-2024-002',
        customerName: 'Michael Chen',
        customerAddress: '456 Oak Avenue, Johannesburg, 2001',
        provider: 'FastCourier',
        service: 'Local Delivery',
        trackingNumber: 'FC987654321',
        status: 'delivered',
        estimatedDelivery: '2024-01-16',
        actualDelivery: '2024-01-16',
        cost: 35.00,
        weight: 1.8,
        dimensions: { length: 15, width: 10, height: 8 },
        insurance: false,
        signatureRequired: false,
        createdAt: '2024-01-15',
        updatedAt: '2024-01-16'
      },
      {
        id: 'ship3',
        orderId: 'ORD-2024-003',
        customerName: 'Emma Wilson',
        customerAddress: '789 Pine Road, Durban, 4001',
        provider: 'SA Express',
        service: 'Express',
        trackingNumber: 'SA555777999ZA',
        status: 'out-for-delivery',
        estimatedDelivery: '2024-01-17',
        cost: 85.00,
        weight: 3.2,
        dimensions: { length: 25, width: 20, height: 15 },
        insurance: true,
        signatureRequired: true,
        createdAt: '2024-01-16',
        updatedAt: '2024-01-17'
      }
    ];

    setProviders(mockProviders);
    setShipments(mockShipments);
  }, []);

  const filteredShipments = shipments.filter(shipment => {
    const matchesSearch = shipment.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         shipment.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         shipment.orderId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || shipment.status === statusFilter;
    const matchesProvider = providerFilter === 'all' || shipment.provider === providerFilter;
    return matchesSearch && matchesStatus && matchesProvider;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'out-for-delivery': return 'bg-blue-100 text-blue-800';
      case 'in-transit': return 'bg-yellow-100 text-yellow-800';
      case 'picked-up': return 'bg-purple-100 text-purple-800';
      case 'pending': return 'bg-gray-100 text-gray-800';
      case 'returned': return 'bg-red-100 text-red-800';
      case 'lost': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getProviderStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const activeProviders = providers.filter(p => p.status === 'active').length;
  const connectedProviders = providers.filter(p => p.apiConnected).length;
  const totalShipments = shipments.length;
  const deliveredShipments = shipments.filter(s => s.status === 'delivered').length;
  const totalShippingCost = shipments.reduce((sum, s) => sum + s.cost, 0);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
        <Card className="p-4 sm:p-6 lg:p-8 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 lg:text-base">Active Providers</p>
              <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">{activeProviders}</p>
            </div>
            <div className="p-2 sm:p-3 lg:p-4 bg-blue-100 rounded-lg">
              <Truck className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4 sm:p-6 lg:p-8 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 lg:text-base">Connected APIs</p>
              <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-green-600">{connectedProviders}</p>
            </div>
            <div className="p-2 sm:p-3 lg:p-4 bg-green-100 rounded-lg">
              <Link className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4 sm:p-6 lg:p-8 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 lg:text-base">Total Shipments</p>
              <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">{totalShipments}</p>
            </div>
            <div className="p-2 sm:p-3 lg:p-4 bg-purple-100 rounded-lg">
              <Package className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4 sm:p-6 lg:p-8 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 lg:text-base">Delivered</p>
              <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-green-600">{deliveredShipments}</p>
            </div>
            <div className="p-2 sm:p-3 lg:p-4 bg-green-100 rounded-lg">
              <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by customer, tracking number, or order ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full lg:w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="picked-up">Picked Up</SelectItem>
              <SelectItem value="in-transit">In Transit</SelectItem>
              <SelectItem value="out-for-delivery">Out for Delivery</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="returned">Returned</SelectItem>
            </SelectContent>
          </Select>
          <Select value={providerFilter} onValueChange={setProviderFilter}>
            <SelectTrigger className="w-full lg:w-48">
              <SelectValue placeholder="Filter by provider" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Providers</SelectItem>
              {providers.map(provider => (
                <SelectItem key={provider.id} value={provider.name}>
                  {provider.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={() => {}}>
            <Plus className="h-4 w-4 mr-2" />
            New Shipment
          </Button>
        </div>
      </Card>

      {/* Shipments List */}
      <Card className="p-6 lg:p-8 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 lg:text-xl lg:mb-6">Recent Shipments</h3>
        <div className="space-y-4 lg:space-y-6">
          {filteredShipments.map((shipment) => (
            <div key={shipment.id} className="border rounded-lg p-4 sm:p-6 lg:p-8 hover:shadow-lg transition-shadow">
              <div className="flex flex-col gap-4 lg:gap-6">
                <div className="flex flex-col gap-3">
                  <div className="flex items-start gap-3 lg:gap-4">
                    <div className="p-2 sm:p-3 lg:p-4 bg-blue-100 rounded-lg flex-shrink-0">
                      <Package className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-gray-900 text-sm sm:text-base lg:text-lg break-words">{shipment.orderId}</h4>
                      <p className="text-xs sm:text-sm text-gray-500 truncate lg:text-base">{shipment.trackingNumber}</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 lg:gap-3">
                    <Badge className={`${getStatusColor(shipment.status)} text-xs sm:text-sm lg:text-base`}>
                      {shipment.status.replace('-', ' ').charAt(0).toUpperCase() + shipment.status.slice(1).replace('-', ' ')}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 text-sm">
                  <div className="flex items-center gap-2 lg:gap-3">
                    <User className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                    <span className="text-xs sm:text-sm truncate lg:text-base">{shipment.customerName}</span>
                  </div>
                  <div className="flex items-center gap-2 lg:gap-3">
                    <Truck className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                    <span className="text-xs sm:text-sm truncate lg:text-base">{shipment.provider}</span>
                  </div>
                  <div className="flex items-center gap-2 lg:gap-3">
                    <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                    <span className="text-xs sm:text-sm font-medium lg:text-base">R{shipment.cost.toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-2 sm:flex sm:items-center sm:justify-between lg:gap-4">
                  <div className="flex items-center gap-1 text-xs text-gray-500 lg:text-sm">
                    <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                    <span className="text-xs truncate lg:text-sm">{shipment.customerAddress}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-500 lg:text-sm">
                    <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                    <span className="text-xs lg:text-sm">Est. Delivery: {new Date(shipment.estimatedDelivery).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 lg:gap-3 lg:mt-0">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedShipment(shipment);
                      setShowShipmentDetails(true);
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
                    <QrCode className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                    <span className="whitespace-nowrap">Label</span>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Shipping Providers */}
      <Card className="p-6 lg:p-8 shadow-sm">
        <div className="flex justify-between items-center mb-4 lg:mb-6">
          <h3 className="text-lg font-semibold text-gray-900 lg:text-xl">Shipping Providers</h3>
          <Button onClick={() => {}} className="lg:text-base">
            <Plus className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
            Add Provider
          </Button>
        </div>
        <div className="space-y-4 lg:space-y-6">
          {providers.map((provider) => (
            <div key={provider.id} className="border rounded-lg p-4 sm:p-6 lg:p-8 hover:shadow-lg transition-shadow">
              <div className="flex flex-col gap-4 lg:gap-6">
                <div className="flex items-start gap-3 lg:gap-4">
                  <div className="p-2 sm:p-3 lg:p-4 bg-blue-100 rounded-lg flex-shrink-0">
                    <Truck className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-gray-900 text-sm sm:text-base lg:text-lg break-words">{provider.name}</h4>
                    <p className="text-xs sm:text-sm text-gray-500 lg:text-base">{provider.type.charAt(0).toUpperCase() + provider.type.slice(1)} Shipping</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 lg:gap-3">
                  <Badge className={`${getProviderStatusColor(provider.status)} text-xs sm:text-sm lg:text-base`}>
                    {provider.status.charAt(0).toUpperCase() + provider.status.slice(1)}
                  </Badge>
                  {provider.apiConnected && (
                    <Badge className="bg-green-100 text-green-800 text-xs sm:text-sm lg:text-base">
                      API Connected
                    </Badge>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 text-sm">
                  <div>
                    <p className="text-gray-600 mb-1 text-xs sm:text-sm lg:text-base">Services:</p>
                    <div className="flex flex-wrap gap-1">
                      {provider.services.map((service, index) => (
                        <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded lg:text-sm">
                          {service}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-600 mb-1 text-xs sm:text-sm lg:text-base">Pricing:</p>
                    <p className="text-xs sm:text-sm lg:text-base">Base: R{provider.pricing.baseRate.toFixed(2)} + R{provider.pricing.ratePerKg.toFixed(2)}/kg</p>
                    <p className="text-xs lg:text-sm">Free shipping over R{provider.pricing.freeShippingThreshold.toFixed(2)}</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 lg:gap-3 lg:mt-0">
                  <Button variant="outline" size="sm" className="flex-1 lg:text-base">
                    <Settings className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                    Configure
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 lg:text-base">
                    <RefreshCw className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                    Test API
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        <Card className="p-6 lg:p-8 shadow-sm hover:shadow-md transition-shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 lg:text-xl lg:mb-6">Shipping Performance</h3>
          <div className="space-y-4 lg:space-y-6">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 lg:text-base">On-Time Delivery Rate</span>
              <span className="text-sm font-medium lg:text-lg">92%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 lg:text-base">Average Delivery Time</span>
              <span className="text-sm font-medium lg:text-lg">2.3 days</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 lg:text-base">Total Shipping Cost</span>
              <span className="text-sm font-medium lg:text-lg">R{totalShippingCost.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 lg:text-base">Average Cost per Shipment</span>
              <span className="text-sm font-medium lg:text-lg">R{(totalShippingCost / totalShipments).toFixed(2)}</span>
            </div>
          </div>
        </Card>

        <Card className="p-6 lg:p-8 shadow-sm hover:shadow-md transition-shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 lg:text-xl lg:mb-6">Provider Performance</h3>
          <div className="space-y-4 lg:space-y-6">
            {providers.map((provider) => (
              <div key={provider.id} className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium lg:text-base">{provider.name}</p>
                  <p className="text-xs text-gray-500 lg:text-sm">{shipments.filter(s => s.provider === provider.name).length} shipments</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium lg:text-lg">95%</p>
                  <p className="text-xs text-gray-500 lg:text-sm">Success rate</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Shipment Details Modal */}
      {showShipmentDetails && selectedShipment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto m-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 sm:p-6 border-b gap-4">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Shipment Details</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowShipmentDetails(false)}
                className="w-full sm:w-auto"
              >
                Close
              </Button>
            </div>
            <div className="p-4 sm:p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3">Shipment Information</h4>
                  <div className="space-y-2 text-sm">
                    <p><strong>Order ID:</strong> {selectedShipment.orderId}</p>
                    <p><strong>Tracking Number:</strong> {selectedShipment.trackingNumber}</p>
                    <p><strong>Provider:</strong> {selectedShipment.provider}</p>
                    <p><strong>Service:</strong> {selectedShipment.service}</p>
                    <p><strong>Status:</strong> <Badge className={getStatusColor(selectedShipment.status)}>{selectedShipment.status.replace('-', ' ').charAt(0).toUpperCase() + selectedShipment.status.slice(1).replace('-', ' ')}</Badge></p>
                    <p><strong>Cost:</strong> R{selectedShipment.cost.toFixed(2)}</p>
                    <p><strong>Created:</strong> {new Date(selectedShipment.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-3">Delivery Information</h4>
                  <div className="space-y-2 text-sm">
                    <p><strong>Customer:</strong> {selectedShipment.customerName}</p>
                    <p><strong>Address:</strong> {selectedShipment.customerAddress}</p>
                    <p><strong>Weight:</strong> {selectedShipment.weight}kg</p>
                    <p><strong>Dimensions:</strong> {selectedShipment.dimensions.length}x{selectedShipment.dimensions.width}x{selectedShipment.dimensions.height}cm</p>
                    <p><strong>Estimated Delivery:</strong> {new Date(selectedShipment.estimatedDelivery).toLocaleDateString()}</p>
                    {selectedShipment.actualDelivery && (
                      <p><strong>Actual Delivery:</strong> {new Date(selectedShipment.actualDelivery).toLocaleDateString()}</p>
                    )}
                    <p><strong>Insurance:</strong> {selectedShipment.insurance ? 'Yes' : 'No'}</p>
                    <p><strong>Signature Required:</strong> {selectedShipment.signatureRequired ? 'Yes' : 'No'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
