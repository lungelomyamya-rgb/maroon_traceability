// src/components/logistics/driverManagement.tsx
'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { User, Phone, Mail, Award, Star, Plus, Edit, Eye, Calendar, MapPin, Truck } from 'lucide-react';
import { Driver, DriverStatus } from '@/types/logistics';

interface DriverManagementProps {
  onDriverSelect?: (driver: Driver) => void;
}

export function DriverManagement({ onDriverSelect }: DriverManagementProps) {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingDriver, setEditingDriver] = useState<Driver | null>(null);
  const [newDriver, setNewDriver] = useState({
    name: '',
    phone: '',
    email: '',
    licenseNumber: '',
    licenseExpiry: '',
    certifications: [] as string[],
    experience: 0,
    rating: 5
  });

  const certificationOptions = [
    'Commercial Driver License',
    'Hazardous Materials',
    'Refrigerated Goods',
    'Food Safety Handling',
    'First Aid Certificate',
    'Defensive Driving',
    'Heavy Vehicle License',
    'International Driving Permit'
  ];

  const statusConfig: Record<DriverStatus, { color: string; icon: string; label: string }> = {
    available: { color: 'bg-green-100 text-green-800', icon: '🟢', label: 'Available' },
    'on-delivery': { color: 'bg-sky-100 text-sky-800', icon: '🚚', label: 'On Delivery' },
    unavailable: { color: 'bg-red-100 text-red-800', icon: '🔴', label: 'Unavailable' },
    offline: { color: 'bg-gray-100 text-gray-600', icon: '⚫', label: 'Offline' }
  };

  useEffect(() => {
    // Mock data - replace with API call
    const mockDrivers: Driver[] = [
      {
        id: 'driver1',
        name: 'John Smith',
        phone: '+27 83 123 4567',
        email: 'john.smith@logistics.co.za',
        licenseNumber: 'DL12345678901',
        licenseExpiry: '2025-12-31',
        certifications: ['Commercial Driver License', 'Refrigerated Goods', 'Food Safety Handling'],
        status: 'on-delivery',
        currentVehicle: 'veh1',
        currentLocation: { lat: -33.9249, lng: 18.4241 },
        experience: 8,
        rating: 4.8,
        totalDeliveries: 342,
        onTimeDeliveryRate: 96.5
      },
      {
        id: 'driver2',
        name: 'Maria Johnson',
        phone: '+27 82 987 6543',
        email: 'maria.j@logistics.co.za',
        licenseNumber: 'DL98765432109',
        licenseExpiry: '2026-03-15',
        certifications: ['Commercial Driver License', 'Hazardous Materials', 'Defensive Driving'],
        status: 'available',
        currentLocation: { lat: -33.8688, lng: 18.5058 },
        experience: 5,
        rating: 4.6,
        totalDeliveries: 189,
        onTimeDeliveryRate: 94.2
      },
      {
        id: 'driver3',
        name: 'David Wilson',
        phone: '+27 79 555 1234',
        email: 'david.w@logistics.co.za',
        licenseNumber: 'DL55512398765',
        licenseExpiry: '2025-08-30',
        certifications: ['Commercial Driver License', 'Heavy Vehicle License'],
        status: 'offline',
        currentLocation: { lat: -34.0522, lng: 18.6325 },
        experience: 12,
        rating: 4.9,
        totalDeliveries: 567,
        onTimeDeliveryRate: 98.1
      }
    ];

    setDrivers(mockDrivers);
  }, []);

  const handleAddDriver = () => {
    const driverData: Driver = {
      id: `driver${Date.now()}`,
      name: newDriver.name,
      phone: newDriver.phone,
      email: newDriver.email,
      licenseNumber: newDriver.licenseNumber,
      licenseExpiry: newDriver.licenseExpiry,
      certifications: newDriver.certifications,
      status: 'available',
      experience: newDriver.experience,
      rating: newDriver.rating,
      totalDeliveries: 0,
      onTimeDeliveryRate: 100
    };

    setDrivers([...drivers, driverData]);
    setNewDriver({
      name: '',
      phone: '',
      email: '',
      licenseNumber: '',
      licenseExpiry: '',
      certifications: [],
      experience: 0,
      rating: 5
    });
    setShowAddForm(false);
  };

  const handleUpdateDriver = () => {
    if (!editingDriver) return;

    setDrivers(drivers.map(d => 
      d.id === editingDriver.id ? editingDriver : d
    ));
    setEditingDriver(null);
  };

  const toggleCertification = (cert: string) => {
    if (showAddForm) {
      setNewDriver(prev => ({
        ...prev,
        certifications: prev.certifications.includes(cert)
          ? prev.certifications.filter(c => c !== cert)
          : [...prev.certifications, cert]
      }));
    } else if (editingDriver) {
      setEditingDriver(prev => prev ? {
        ...prev,
        certifications: prev.certifications.includes(cert)
          ? prev.certifications.filter(c => c !== cert)
          : [...prev.certifications, cert]
      } : null);
    }
  };

  const isLicenseExpiringSoon = (expiryDate: string) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const daysUntilExpiry = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 60;
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">Driver Team</h2>
          </div>
        <Button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-teal-600 hover:bg-teal-700 text-white w-full sm:w-auto"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Driver
        </Button>
      </div>

      {/* Add/Edit Driver Form */}
      {(showAddForm || editingDriver) && (
        <Card className="p-4 sm:p-6">
          <h3 className="text-lg font-medium mb-4">
            {showAddForm ? 'Add New Driver' : 'Edit Driver'}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <Input
                value={showAddForm ? newDriver.name : editingDriver?.name}
                onChange={(e) => showAddForm 
                  ? setNewDriver({...newDriver, name: e.target.value})
                  : setEditingDriver(editingDriver ? {...editingDriver, name: e.target.value} : null)
                }
                placeholder="e.g., John Smith"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <Input
                value={showAddForm ? newDriver.phone : editingDriver?.phone}
                onChange={(e) => showAddForm
                  ? setNewDriver({...newDriver, phone: e.target.value})
                  : setEditingDriver(editingDriver ? {...editingDriver, phone: e.target.value} : null)
                }
                placeholder="e.g., +27 83 123 4567"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <Input
                type="email"
                value={showAddForm ? newDriver.email : editingDriver?.email}
                onChange={(e) => showAddForm
                  ? setNewDriver({...newDriver, email: e.target.value})
                  : setEditingDriver(editingDriver ? {...editingDriver, email: e.target.value} : null)
                }
                placeholder="e.g., driver@company.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">License Number</label>
              <Input
                value={showAddForm ? newDriver.licenseNumber : editingDriver?.licenseNumber}
                onChange={(e) => showAddForm
                  ? setNewDriver({...newDriver, licenseNumber: e.target.value})
                  : setEditingDriver(editingDriver ? {...editingDriver, licenseNumber: e.target.value} : null)
                }
                placeholder="e.g., DL12345678901"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">License Expiry</label>
              <Input
                type="date"
                value={showAddForm ? newDriver.licenseExpiry : editingDriver?.licenseExpiry}
                onChange={(e) => showAddForm
                  ? setNewDriver({...newDriver, licenseExpiry: e.target.value})
                  : setEditingDriver(editingDriver ? {...editingDriver, licenseExpiry: e.target.value} : null)
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Years of Experience</label>
              <Input
                type="number"
                value={showAddForm ? newDriver.experience : editingDriver?.experience}
                onChange={(e) => showAddForm
                  ? setNewDriver({...newDriver, experience: parseInt(e.target.value)})
                  : setEditingDriver(editingDriver ? {...editingDriver, experience: parseInt(e.target.value)} : null)
                }
                min="0"
                max="50"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Certifications</label>
              <div className="flex flex-wrap gap-2">
                {certificationOptions.map(cert => (
                  <label key={cert} className="flex items-center gap-1">
                    <input
                      type="checkbox"
                      checked={(showAddForm ? newDriver : editingDriver)?.certifications.includes(cert)}
                      onChange={() => toggleCertification(cert)}
                    />
                    <span className="text-sm">{cert}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => {
              setShowAddForm(false);
              setEditingDriver(null);
            }}>
              Cancel
            </Button>
            <Button onClick={showAddForm ? handleAddDriver : handleUpdateDriver}>
              {showAddForm ? 'Add Driver' : 'Update Driver'}
            </Button>
          </div>
        </Card>
      )}

      {/* Driver Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {drivers.map((driver) => {
          const driverStatusConfig = statusConfig[driver.status];
          const licenseExpiring = isLicenseExpiringSoon(driver.licenseExpiry);

          return (
            <Card key={driver.id} className="p-3 sm:p-4 lg:p-5 hover:shadow-lg transition-all duration-200 hover:scale-[1.02] border-0 shadow-md bg-white rounded-xl w-full min-h-[280px] sm:min-h-[320px] lg:min-h-[360px] flex flex-col">
              {/* Header with Status */}
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-3 mb-3 sm:mb-4">
                <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                  <div className="p-1 sm:p-1.5 bg-green-100 rounded-lg shadow-lg flex-shrink-0">
                    <User className="h-3 w-3 sm:h-4 lg:h-5 text-green-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-700 text-xs sm:text-sm lg:text-base">{driver.name}</h3>
                    <p className="text-xs sm:text-sm text-gray-600 truncate">{driver.phone}</p>
                  </div>
                </div>
                <Badge variant="info" className={`${driverStatusConfig.color} text-xs whitespace-nowrap flex-shrink-0`}>
                  {driverStatusConfig.icon} {driverStatusConfig.label}
                </Badge>
              </div>

              {/* Driver Details */}
              <div className="space-y-2 text-xs sm:text-sm mb-3 sm:mb-4">
                <div className="flex items-center gap-2">
                  <Mail className="h-3 w-3 sm:h-4 text-gray-400" />
                  <span className="text-gray-600 truncate">{driver.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Experience:</span>
                  <span className="font-medium">{driver.experience} years</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">License:</span>
                  <span className={`font-medium text-xs ${licenseExpiring ? 'text-red-600' : ''}`}>
                    {driver.licenseNumber}
                    {licenseExpiring && ' ⚠️'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total:</span>
                  <span className="font-medium">{driver.totalDeliveries}</span>
                </div>
              </div>

              {/* Rating */}
              <div className="mt-4 flex items-center gap-2">
                <div className="flex">
                  {renderStars(driver.rating)}
                </div>
                <span className="text-sm text-gray-600">({driver.rating})</span>
              </div>

              {/* Certifications */}
              {driver.certifications.length > 0 && (
                <div className="mt-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Award className="h-4 w-4 text-gray-400" />
                    <span className="text-xs font-medium text-gray-700">Certifications:</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {driver.certifications.slice(0, 2).map((cert, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {cert}
                      </Badge>
                    ))}
                    {driver.certifications.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{driver.certifications.length - 2} more
                      </Badge>
                    )}
                  </div>
                </div>
              )}

              {/* License Alert */}
              {licenseExpiring && (
                <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
                  <div className="flex items-start gap-2">
                    <Calendar className="h-4 w-4 text-yellow-600 mt-0.5" />
                    <div className="text-xs text-yellow-800">
                      <div>License expiring on {driver.licenseExpiry}</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-2 mt-auto pt-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    onDriverSelect?.(driver);
                  }}
                  className="flex-1 text-xs sm:text-sm"
                >
                  <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                  View
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingDriver(driver)}
                  className="flex-1 text-xs sm:text-sm"
                >
                  <Edit className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {/* Assign vehicle */}}
                  className="flex-1 text-xs sm:text-sm"
                >
                  <Truck className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                  Assign
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
