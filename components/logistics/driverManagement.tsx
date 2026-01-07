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
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-700">Driver Management</h2>
        <Button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-teal-600 hover:bg-teal-700 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Driver
        </Button>
      </div>

      {/* Add/Edit Driver Form */}
      {(showAddForm || editingDriver) && (
        <Card className="p-6">
          <h3 className="text-lg font-medium mb-4">
            {showAddForm ? 'Add New Driver' : 'Edit Driver'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {drivers.map((driver) => {
          const driverStatusConfig = statusConfig[driver.status];
          const licenseExpiring = isLicenseExpiringSoon(driver.licenseExpiry);

          return (
            <Card key={driver.id} className="p-6">
              {/* Header with Status */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3 flex-1">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <User className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-700">{driver.name}</h3>
                    <p className="text-sm text-gray-600">{driver.phone}</p>
                  </div>
                </div>
                <Badge variant="info" className={driverStatusConfig.color}>
                  {driverStatusConfig.icon} {driverStatusConfig.label}
                </Badge>
              </div>

              {/* Driver Details */}
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">{driver.email}</span>
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
                  <span className="text-gray-600">Total Deliveries:</span>
                  <span className="font-medium">{driver.totalDeliveries}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">On-time Rate:</span>
                  <span className="font-medium">{driver.onTimeDeliveryRate}%</span>
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
              <div className="flex gap-2 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    onDriverSelect?.(driver);
                  }}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingDriver(driver)}
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {/* Assign vehicle */}}
                >
                  <Truck className="h-4 w-4 mr-1" />
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
