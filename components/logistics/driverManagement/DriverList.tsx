// src/components/logistics/driverManagement/DriverList.tsx
'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User, Phone, Mail, Star, Eye, Edit, Truck, Calendar, MapPin } from 'lucide-react';
import { Driver } from './hooks/useDriverManagement';

interface DriverListProps {
  drivers: Driver[];
  statusConfig: Record<string, { color: string; icon: string; label: string }>;
  onDriverSelect?: (driver: Driver) => void;
  onEditDriver?: (driver: Driver) => void;
  onAssignVehicle?: (driver: Driver) => void;
}

export function DriverList({ 
  drivers, 
  statusConfig, 
  onDriverSelect, 
  onEditDriver, 
  onAssignVehicle 
}: DriverListProps) {
  const isLicenseExpiring = (licenseExpiry: string) => {
    const expiryDate = new Date(licenseExpiry);
    const today = new Date();
    const threeMonthsFromNow = new Date();
    threeMonthsFromNow.setMonth(today.getMonth() + 3);
    return expiryDate <= threeMonthsFromNow;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-ZA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-3 w-3 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {drivers.map((driver) => {
        const status = statusConfig[driver.status];
        const licenseExpiring = isLicenseExpiring(driver.licenseExpiry);

        return (
          <Card key={driver.id} className="p-4 hover:shadow-lg transition-shadow">
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-blue-50 rounded-full">
                    <User className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{driver.name}</h3>
                    <Badge className={`${status.color} text-xs`}>
                      <span className="mr-1">{status.icon}</span>
                      {status.label}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {renderStars(driver.rating)}
                  <span className="text-xs text-gray-600 ml-1">{driver.rating}</span>
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-2 text-sm text-gray-600 mb-3">
                <div className="flex items-center gap-2">
                  <Phone className="h-3 w-3" />
                  <span>{driver.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-3 w-3" />
                  <span className="truncate">{driver.email}</span>
                </div>
                {driver.currentVehicle && (
                  <div className="flex items-center gap-2">
                    <Truck className="h-3 w-3" />
                    <span>{driver.currentVehicle}</span>
                  </div>
                )}
              </div>

              {/* License & Experience */}
              <div className="space-y-1 text-xs text-gray-500 mb-3">
                <div className="flex justify-between">
                  <span>License: {driver.licenseNumber}</span>
                  <span>Exp: {formatDate(driver.licenseExpiry)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Experience: {driver.experience} years</span>
                  <span>Deliveries: {driver.totalDeliveries}</span>
                </div>
              </div>

              {/* Certifications */}
              {driver.certifications.length > 0 && (
                <div className="mb-3">
                  <div className="flex flex-wrap gap-1">
                    {driver.certifications.slice(0, 2).map((cert, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {cert}
                      </Badge>
                    ))}
                    {driver.certifications.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{driver.certifications.length - 2}
                      </Badge>
                    )}
                  </div>
                </div>
              )}

              {/* License Alert */}
              {licenseExpiring && (
                <div className="mb-3 p-2 bg-yellow-50 rounded-lg">
                  <div className="flex items-start gap-1">
                    <Calendar className="h-3 w-3 text-yellow-600 mt-0.5" />
                    <div className="text-xs text-yellow-800">
                      License expiring on {formatDate(driver.licenseExpiry)}
                    </div>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-2 mt-auto pt-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDriverSelect?.(driver)}
                  className="flex-1 text-xs"
                >
                  <Eye className="h-3 w-3 mr-1" />
                  View
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEditDriver?.(driver)}
                  className="flex-1 text-xs"
                >
                  <Edit className="h-3 w-3 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onAssignVehicle?.(driver)}
                  className="flex-1 text-xs"
                  disabled={driver.status === 'on-delivery'}
                >
                  <Truck className="h-3 w-3 mr-1" />
                  Assign
                </Button>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
