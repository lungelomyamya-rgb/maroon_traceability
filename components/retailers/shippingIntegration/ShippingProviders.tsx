// src/components/retailers/shippingIntegration/ShippingProviders.tsx
'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Truck, 
  Globe, 
  Package, 
  Settings, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Clock,
  Link
} from 'lucide-react';

interface ShippingProvider {
  id: string;
  name: string;
  type: 'local' | 'national' | 'international';
  services: string[];
  pricing: {
    baseRate: number;
    perKg: number;
    perKm: number;
  };
  status: 'active' | 'inactive' | 'error';
  successRate: number;
  averageDeliveryTime: number;
  totalShipments: number;
  tracking: {
    realTime: boolean;
    notifications: boolean;
    api: boolean;
  };
}

interface ShippingProvidersProps {
  providers: ShippingProvider[];
  onConfigure?: (providerId: string) => void;
  onToggleStatus?: (providerId: string) => void;
}

export function ShippingProviders({ providers, onConfigure, onToggleStatus }: ShippingProvidersProps) {
  const getProviderIcon = (type: string) => {
    switch (type) {
      case 'local':
        return Truck;
      case 'national':
        return Globe;
      case 'international':
        return Package;
      default:
        return Truck;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case 'inactive':
        return <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>;
      case 'error':
        return <Badge className="bg-red-100 text-red-800">Error</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Unknown</Badge>;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'local':
        return <Badge className="bg-blue-100 text-blue-800">Local</Badge>;
      case 'national':
        return <Badge className="bg-purple-100 text-purple-800">National</Badge>;
      case 'international':
        return <Badge className="bg-orange-100 text-orange-800">International</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Unknown</Badge>;
    }
  };

  return (
    <Card className="p-4 sm:p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Shipping Providers</h3>
        <Button variant="outline" size="sm">
          Add Provider
        </Button>
      </div>

      <div className="space-y-4">
        {providers.map((provider) => {
          const Icon = getProviderIcon(provider.type);
          
          return (
            <div key={provider.id} className="border rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-gray-50 rounded-lg">
                    <Icon className="h-5 w-5 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-medium text-gray-900">{provider.name}</h4>
                      {getStatusBadge(provider.status)}
                      {getTypeBadge(provider.type)}
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-3">
                      {provider.services.map((service) => (
                        <Badge key={service} variant="outline" className="text-xs">
                          {service}
                        </Badge>
                      ))}
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Base Rate</p>
                        <p className="font-medium">R{provider.pricing.baseRate.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Per Kg</p>
                        <p className="font-medium">R{provider.pricing.perKg.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Per Km</p>
                        <p className="font-medium">R{provider.pricing.perKm.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Success Rate</p>
                        <div className="flex items-center gap-1">
                          <TrendingUp className="h-3 w-3 text-green-500" />
                          <span className="font-medium">{provider.successRate}%</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm mt-3 pt-3 border-t">
                      <div>
                        <p className="text-gray-500">Avg Delivery</p>
                        <p className="font-medium">{provider.averageDeliveryTime.toFixed(1)} days</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Total Shipments</p>
                        <p className="font-medium">{provider.totalShipments}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Tracking</p>
                        <div className="flex gap-1">
                          {provider.tracking.realTime && (
                            <span className="text-green-600 text-xs">Real-time</span>
                          )}
                          {provider.tracking.notifications && (
                            <span className="text-blue-600 text-xs">Alerts</span>
                          )}
                          {provider.tracking.api && (
                            <span className="text-purple-600 text-xs">API</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onConfigure?.(provider.id)}
                  >
                    <Settings className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onToggleStatus?.(provider.id)}
                  >
                    {provider.status === 'active' ? (
                      <AlertTriangle className="h-4 w-4" />
                    ) : (
                      <CheckCircle className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
