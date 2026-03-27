// src/components/logistics/vehicleManagement/VehicleDetails.tsx
'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Truck, Calendar, Fuel, MapPin, User, Wrench, Edit } from 'lucide-react';
import { Vehicle } from './hooks/useVehicleManagement';

interface VehicleDetailsProps {
  vehicle: Vehicle;
  statusConfig: Record<string, { color: string; icon: string; label: string }>;
  onClose: () => void;
  onEdit?: (vehicle: Vehicle) => void;
  onStatusUpdate?: (vehicleId: string, status: Vehicle['status']) => void;
}

export function VehicleDetails({ 
  vehicle, 
  statusConfig, 
  onClose, 
  onEdit, 
  onStatusUpdate 
}: VehicleDetailsProps) {
  const status = statusConfig[vehicle.status];

  const getVehicleTypeLabel = (type: string) => {
    const typeMap: Record<string, string> = {
      'truck': 'Truck',
      'van': 'Van',
      'refrigerated': 'Refrigerated Truck',
      'flatbed': 'Flatbed Truck'
    };
    return typeMap[type] || type;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-ZA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatMileage = (mileage: number) => {
    return `${mileage.toLocaleString()} km`;
  };

  const getFuelColor = (level: number) => {
    if (level > 50) return 'text-green-600';
    if (level > 25) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getFuelLevel = (level: number) => {
    const percentage = level;
    let color = 'bg-gray-200';
    if (percentage > 50) color = 'bg-green-500';
    else if (percentage > 25) color = 'bg-yellow-500';
    else color = 'bg-red-500';

    return (
      <div className="flex items-center gap-2">
        <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className={`h-full transition-all ${color}`}
            style={{ width: `${percentage}%` }}
          />
        </div>
        <span className={`text-sm font-medium ${getFuelColor(level)}`}>
          {percentage}%
        </span>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-50 rounded-full">
                <Truck className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">{vehicle.registrationNumber}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <Badge className={`${status.color} text-sm`}>
                    <span className="mr-1">{status.icon}</span>
                    {status.label}
                  </Badge>
                  <span className="text-sm text-gray-500">
                    {getVehicleTypeLabel(vehicle.type)}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {onEdit && (
                <Button variant="outline" size="sm" onClick={() => onEdit(vehicle)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              )}
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Vehicle Information */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Vehicle Information</h3>
              <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Registration</span>
                  <span className="text-sm font-medium">{vehicle.registrationNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Make/Model</span>
                  <span className="text-sm font-medium">{vehicle.make} {vehicle.model}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Year</span>
                  <span className="text-sm font-medium">{vehicle.year}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Type</span>
                  <span className="text-sm font-medium">{getVehicleTypeLabel(vehicle.type)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Capacity</span>
                  <span className="text-sm font-medium">{vehicle.capacity}</span>
                </div>
              </div>
            </div>

            {/* Current Status */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Current Status</h3>
              <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Fuel Level</span>
                  {getFuelLevel(vehicle.fuelLevel)}
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Mileage</span>
                  <span className="text-sm font-medium">{formatMileage(vehicle.mileage)}</span>
                </div>
                {vehicle.currentDriver && (
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-400" />
                    <div>
                      <span className="text-sm text-gray-600">Current Driver</span>
                      <p className="text-sm font-medium">{vehicle.currentDriver}</p>
                    </div>
                  </div>
                )}
                {vehicle.currentLocation && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <div>
                      <span className="text-sm text-gray-600">Current Location</span>
                      <p className="text-sm font-medium">{vehicle.currentLocation}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Maintenance Information */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Maintenance Information</h3>
              <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-2">
                  <Wrench className="h-4 w-4 text-gray-400" />
                  <div>
                    <span className="text-sm text-gray-600">Last Maintenance</span>
                    <p className="text-sm font-medium">{formatDate(vehicle.lastMaintenance)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <div>
                    <span className="text-sm text-gray-600">Insurance Expiry</span>
                    <p className="text-sm font-medium">{formatDate(vehicle.insuranceExpiry)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <div>
                    <span className="text-sm text-gray-600">Registration Expiry</span>
                    <p className="text-sm font-medium">{formatDate(vehicle.registrationExpiry)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="mt-6">
            <h3 className="font-semibold text-gray-900 mb-4">Vehicle Features</h3>
            <div className="flex flex-wrap gap-2">
              {vehicle.features.map(feature => (
                <Badge key={feature} variant="outline" className="text-xs">
                  {feature}
                </Badge>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-between items-center mt-6 pt-6 border-t">
            <div className="text-sm text-gray-500">
              Vehicle ID: {vehicle.id}
            </div>
            {onStatusUpdate && (
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => onStatusUpdate(vehicle.id, 'maintenance')}
                  disabled={vehicle.status === 'maintenance'}
                >
                  <Wrench className="h-4 w-4 mr-2" />
                  Maintenance
                </Button>
                <Button
                  variant="outline"
                  onClick={() => onStatusUpdate(vehicle.id, 'active')}
                  disabled={vehicle.status === 'active'}
                >
                  Set Active
                </Button>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
