// src/components/logistics/driverManagement/DriverDetails.tsx
'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  Phone, 
  Mail, 
  Calendar, 
  MapPin, 
  Award, 
  Star, 
  Truck, 
  Edit,
  X,
  Clock
} from 'lucide-react';
import { Driver } from './hooks/useDriverManagement';

interface DriverDetailsProps {
  driver: Driver;
  onClose: () => void;
  onEdit?: (driver: Driver) => void;
  onAssignVehicle?: (driver: Driver) => void;
  onUpdateStatus?: (driverId: string, status: Driver['status']) => void;
}

export function DriverDetails({ 
  driver, 
  onClose, 
  onEdit, 
  onAssignVehicle,
  onUpdateStatus 
}: DriverDetailsProps) {
  const statusConfig = {
    available: { color: 'bg-green-100 text-green-800', icon: '🟢', label: 'Available' },
    'on-delivery': { color: 'bg-sky-100 text-sky-800', icon: '🚚', label: 'On Delivery' },
    unavailable: { color: 'bg-red-100 text-red-800', icon: '🔴', label: 'Unavailable' },
    offline: { color: 'bg-gray-100 text-gray-600', icon: '⚫', label: 'Offline' }
  } as const;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-ZA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-ZA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  const isLicenseExpiring = (licenseExpiry: string) => {
    const expiryDate = new Date(licenseExpiry);
    const today = new Date();
    const threeMonthsFromNow = new Date();
    threeMonthsFromNow.setMonth(today.getMonth() + 3);
    return expiryDate <= threeMonthsFromNow;
  };

  const status = statusConfig[driver.status];
  const licenseExpiring = isLicenseExpiring(driver.licenseExpiry);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-50 rounded-full">
                <User className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">{driver.name}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <Badge className={`${status.color} text-sm`}>
                    <span className="mr-1">{status.icon}</span>
                    {status.label}
                  </Badge>
                  <div className="flex items-center gap-1">
                    {renderStars(driver.rating)}
                    <span className="text-sm text-gray-600 ml-1">({driver.rating})</span>
                  </div>
                </div>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Contact Information */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <User className="h-4 w-4" />
                Contact Information
              </h3>
              <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium">{driver.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{driver.email}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* License Information */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Award className="h-4 w-4" />
                License Information
              </h3>
              <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between">
                  <div>
                    <p className="text-sm text-gray-500">License Number</p>
                    <p className="font-medium">{driver.licenseNumber}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Experience</p>
                    <p className="font-medium">{driver.experience} years</p>
                  </div>
                </div>
                <div className="flex justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Expiry Date</p>
                    <p className={`font-medium ${licenseExpiring ? 'text-red-600' : ''}`}>
                      {formatDate(driver.licenseExpiry)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Total Deliveries</p>
                    <p className="font-medium">{driver.totalDeliveries}</p>
                  </div>
                </div>
                {licenseExpiring && (
                  <div className="p-2 bg-yellow-50 rounded-lg">
                    <div className="flex items-center gap-2 text-yellow-800">
                      <Calendar className="h-4 w-4" />
                      <span className="text-sm font-medium">
                        License expiring soon!
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Certifications */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Award className="h-4 w-4" />
                Certifications
              </h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                {driver.certifications.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {driver.certifications.map((certification) => (
                      <Badge key={certification} variant="outline">
                        {certification}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No certifications recorded</p>
                )}
              </div>
            </div>

            {/* Status & Activity */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Status & Activity
              </h3>
              <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Current Status</p>
                    <Badge className={`${status.color} text-sm`}>
                      <span className="mr-1">{status.icon}</span>
                      {status.label}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Joined Date</p>
                    <p className="font-medium">{formatDate(driver.joinedDate)}</p>
                  </div>
                </div>
                {driver.currentVehicle && (
                  <div className="flex items-center gap-3">
                    <Truck className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Current Vehicle</p>
                      <p className="font-medium">{driver.currentVehicle}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Last Active</p>
                    <p className="font-medium">{formatDateTime(driver.lastActive)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 mt-6 pt-6 border-t">
            <Button variant="outline" onClick={() => onEdit?.(driver)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Driver
            </Button>
            <Button 
              variant="outline" 
              onClick={() => onAssignVehicle?.(driver)}
              disabled={driver.status === 'on-delivery'}
            >
              <Truck className="h-4 w-4 mr-2" />
              {driver.currentVehicle ? 'Change Vehicle' : 'Assign Vehicle'}
            </Button>
            <div className="flex gap-2 ml-auto">
              {driver.status !== 'available' && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onUpdateStatus?.(driver.id, 'available')}
                >
                  Set Available
                </Button>
              )}
              {driver.status === 'available' && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onUpdateStatus?.(driver.id, 'offline')}
                >
                  Set Offline
                </Button>
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
