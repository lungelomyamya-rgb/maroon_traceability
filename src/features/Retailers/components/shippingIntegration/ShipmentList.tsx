// src/components/retailers/shippingIntegration/ShipmentList.tsx
'use client';

import { 
  Search, 
  Clock,
  Truck,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Barcode,
  RefreshCw,
  Download,
  Package,
  MapPin,
  Eye,
  Edit,
} from 'lucide-react';
import { useState } from 'react';

import { Badge } from '@/src/features/shared/ui/badge';
import { Button } from '@/src/features/shared/ui/button';
import { Card } from '@/src/features/shared/ui/card';
import { Input } from '@/src/features/shared/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/src/features/shared/ui/select';

interface Shipment {
  id: string;
  orderId: string;
  trackingNumber: string;
  provider: string;
  service: string;
  status: 'pending' | 'in-transit' | 'delivered' | 'failed' | 'returned';
  cost: number;
  weight: number;
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  customerName: string;
  customerAddress: string;
  createdAt: string;
  estimatedDelivery: string;
  actualDelivery?: string;
  insurance: boolean;
  signatureRequired: boolean;
  priority: 'standard' | 'express' | 'overnight';
}

interface ShipmentListProps {
  shipments: Shipment[];
  onViewDetails?: (shipment: Shipment) => void;
  onEdit?: (shipment: Shipment) => void;
  onExport?: () => void;
  onRefresh?: () => void;
  isLoading?: boolean;
}

export function ShipmentList({ 
  shipments, 
  onViewDetails, 
  onEdit, 
  onExport, 
  onRefresh,
  isLoading = false,
}: ShipmentListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [providerFilter, setProviderFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');

  const getStatusColor = (status: string) => {
    switch (status) {
    case 'delivered':
      return 'bg-green-100 text-green-800';
    case 'in-transit':
      return 'bg-blue-100 text-blue-800';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'failed':
      return 'bg-red-100 text-red-800';
    case 'returned':
      return 'bg-orange-100 text-orange-800';
    default:
      return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
    case 'delivered':
      return CheckCircle;
    case 'in-transit':
      return Truck;
    case 'pending':
      return Clock;
    case 'failed':
      return XCircle;
    case 'returned':
      return AlertTriangle;
    default:
      return Clock;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
    case 'overnight':
      return 'bg-red-100 text-red-800';
    case 'express':
      return 'bg-orange-100 text-orange-800';
    case 'standard':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredShipments = shipments.filter(shipment => {
    const matchesSearch = shipment.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         shipment.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         shipment.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || shipment.status === statusFilter;
    const matchesProvider = providerFilter === 'all' || shipment.provider === providerFilter;
    const matchesPriority = priorityFilter === 'all' || shipment.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesProvider && matchesPriority;
  });

  const uniqueProviders = Array.from(new Set(shipments.map(s => s.provider)));
  const uniquePriorities = Array.from(new Set(shipments.map(s => s.priority)));

  return (
    <Card className="p-4 sm:p-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Shipments</h3>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={onRefresh} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={onExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by tracking #, order ID, or customer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[150px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="in-transit">In Transit</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
            <SelectItem value="returned">Returned</SelectItem>
          </SelectContent>
        </Select>
        <Select value={providerFilter} onValueChange={setProviderFilter}>
          <SelectTrigger className="w-full sm:w-[150px]">
            <SelectValue placeholder="Provider" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Providers</SelectItem>
            {uniqueProviders.map(provider => (
              <SelectItem key={provider} value={provider}>{provider}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
          <SelectTrigger className="w-full sm:w-[150px]">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priority</SelectItem>
            {uniquePriorities.map(priority => (
              <SelectItem key={priority} value={priority}>
                {priority.charAt(0).toUpperCase() + priority.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Shipment List */}
      <div className="space-y-4">
        {filteredShipments.length === 0 ? (
          <div className="text-center py-8">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No shipments found</p>
            <p className="text-sm text-gray-400 mt-1">Try adjusting your filters</p>
          </div>
        ) : (
          filteredShipments.map((shipment) => {
            const StatusIcon = getStatusIcon(shipment.status);
            
            return (
              <div key={shipment.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-gray-50 rounded-lg">
                      <Package className="h-5 w-5 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-gray-900">{shipment.trackingNumber}</h4>
                        <Badge className={getStatusColor(shipment.status)}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {shipment.status.replace('-', ' ').charAt(0).toUpperCase() + shipment.status.slice(1).replace('-', ' ')}
                        </Badge>
                        <Badge className={getPriorityColor(shipment.priority)}>
                          {shipment.priority.charAt(0).toUpperCase() + shipment.priority.slice(1)}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                        <div className="flex items-center gap-1">
                          <Truck className="h-3 w-3" />
                          {shipment.provider}
                        </div>
                        <div className="flex items-center gap-1">
                          <Barcode className="h-3 w-3" />
                          {shipment.orderId}
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {shipment.customerAddress}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(shipment.estimatedDelivery).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500">Weight</p>
                          <p className="font-medium">{shipment.weight}kg</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Dimensions</p>
                          <p className="font-medium">{shipment.dimensions.length}x{shipment.dimensions.width}x{shipment.dimensions.height}cm</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Cost</p>
                          <p className="font-medium">R{shipment.cost.toFixed(2)}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Insurance</p>
                          <p className="font-medium">{shipment.insurance ? 'Yes' : 'No'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onViewDetails?.(shipment)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit?.(shipment)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </Card>
  );
}
