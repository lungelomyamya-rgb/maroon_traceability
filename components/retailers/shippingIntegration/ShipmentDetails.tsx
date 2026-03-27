// src/components/retailers/shippingIntegration/ShipmentDetails.tsx
'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Truck,
  Package,
  MapPin,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  User,
  DollarSign,
  Calendar,
  Shield,
  FileText,
  Download,
  Edit,
  QrCode,
  Barcode
} from 'lucide-react';

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

interface ShipmentDetailsProps {
  shipment: Shipment;
  onClose: () => void;
  onEdit?: (shipment: Shipment) => void;
}

export function ShipmentDetails({ shipment, onClose, onEdit }: ShipmentDetailsProps) {
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto m-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 sm:p-6 border-b gap-4">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Shipment Details</h3>
          <div className="flex items-center gap-2">
            {onEdit && (
              <Button variant="outline" size="sm" onClick={() => onEdit(shipment)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="w-full sm:w-auto"
            >
              Close
            </Button>
          </div>
        </div>
        
        <div className="p-4 sm:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Shipment Information */}
            <div>
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <Package className="h-4 w-4" />
                Shipment Information
              </h4>
              <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                    <Truck className="h-6 w-6 text-gray-600" />
                  </div>
                  <div>
                    <h5 className="font-medium text-gray-900">{shipment.trackingNumber}</h5>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className={getStatusColor(shipment.status)}>
                        {shipment.status.replace('-', ' ').charAt(0).toUpperCase() + shipment.status.slice(1).replace('-', ' ')}
                      </Badge>
                      <Badge className={getPriorityColor(shipment.priority)}>
                        {shipment.priority.charAt(0).toUpperCase() + shipment.priority.slice(1)}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Order ID</p>
                    <p className="font-medium">{shipment.orderId}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Provider</p>
                    <p className="font-medium">{shipment.provider}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Service</p>
                    <p className="font-medium">{shipment.service}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Cost</p>
                    <p className="font-medium">R{shipment.cost.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Package Information */}
            <div>
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <Package className="h-4 w-4" />
                Package Information
              </h4>
              <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Weight</p>
                    <p className="font-medium">{shipment.weight}kg</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Dimensions</p>
                    <p className="font-medium">
                      {shipment.dimensions.length}x{shipment.dimensions.width}x{shipment.dimensions.height}cm
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Insurance</p>
                    <div className="flex items-center gap-1">
                      <Shield className={`h-4 w-4 ${shipment.insurance ? 'text-green-600' : 'text-gray-400'}`} />
                      <span className="font-medium">{shipment.insurance ? 'Insured' : 'Not Insured'}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-500">Signature Required</p>
                    <div className="flex items-center gap-1">
                      <FileText className={`h-4 w-4 ${shipment.signatureRequired ? 'text-blue-600' : 'text-gray-400'}`} />
                      <span className="font-medium">{shipment.signatureRequired ? 'Required' : 'Not Required'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Delivery Information */}
          <div className="mt-6">
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Delivery Information
            </h4>
            <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Customer Name</p>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-400" />
                    <p className="font-medium">{shipment.customerName}</p>
                  </div>
                </div>
                <div>
                  <p className="text-gray-500">Delivery Address</p>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <p className="font-medium">{shipment.customerAddress}</p>
                  </div>
                </div>
                <div>
                  <p className="text-gray-500">Created Date</p>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <p className="font-medium">{new Date(shipment.createdAt).toLocaleString()}</p>
                  </div>
                </div>
                <div>
                  <p className="text-gray-500">Estimated Delivery</p>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <p className="font-medium">{new Date(shipment.estimatedDelivery).toLocaleString()}</p>
                  </div>
                </div>
              </div>
              {shipment.actualDelivery && (
                <div className="pt-3 border-t">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-gray-500">Actual Delivery:</span>
                    <span className="font-medium">{new Date(shipment.actualDelivery).toLocaleString()}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Tracking Information */}
          <div className="mt-6">
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <Barcode className="h-4 w-4" />
              Tracking Information
            </h4>
            <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Tracking Number</p>
                  <p className="font-mono font-bold text-lg">{shipment.trackingNumber}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <QrCode className="h-4 w-4 mr-2" />
                    QR Code
                  </Button>
                  <Button variant="outline" size="sm">
                    <Barcode className="h-4 w-4 mr-2" />
                    Barcode
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <Button variant="outline" className="w-full sm:w-auto">
              <Download className="h-4 w-4 mr-2" />
              Download Label
            </Button>
            <Button variant="outline" className="w-full sm:w-auto">
              <FileText className="h-4 w-4 mr-2" />
              View Invoice
            </Button>
            <Button variant="outline" className="w-full sm:w-auto">
              <Truck className="h-4 w-4 mr-2" />
              Track Shipment
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
