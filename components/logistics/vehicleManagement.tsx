// src/components/logistics/vehicleManagement.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/contexts/userContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Truck, Wrench, AlertTriangle, Plus, Edit, Eye, Calendar, Fuel, Settings, ArrowLeft } from 'lucide-react';
import { Vehicle, VehicleStatus } from '@/types/logistics';

interface VehicleManagementProps {
  onVehicleSelect?: (vehicle: Vehicle) => void;
}

export function VehicleManagement({ onVehicleSelect }: VehicleManagementProps) {
  const router = useRouter();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [newVehicle, setNewVehicle] = useState({
    registrationNumber: '',
    make: '',
    model: '',
    year: new Date().getFullYear(),
    type: 'truck' as const,
    capacity: '',
    features: [] as string[],
    insuranceExpiry: '',
    registrationExpiry: ''
  });

  const vehicleTypes = [
    { value: 'truck', label: 'Truck' },
    { value: 'van', label: 'Van' },
    { value: 'refrigerated', label: 'Refrigerated Truck' },
    { value: 'flatbed', label: 'Flatbed Truck' }
  ];

  const vehicleFeatures = [
    'GPS Tracking', 'Temperature Control', 'Refrigerated', 'Lift Gate', 
    'Air Suspension', 'Backup Camera', 'Sleeping Cabin', 'Loading Ramp'
  ];

  const statusConfig: Record<VehicleStatus, { color: string; icon: string; label: string }> = {
    active: { color: 'bg-green-100 text-green-800', icon: '🟢', label: 'Active' },
    maintenance: { color: 'bg-yellow-100 text-yellow-800', icon: '🔧', label: 'Maintenance' },
    'out-of-service': { color: 'bg-red-100 text-red-800', icon: '🔴', label: 'Out of Service' },
    available: { color: 'bg-sky-100 text-sky-800', icon: '🔵', label: 'Available' }
  };

  useEffect(() => {
    // Mock data - replace with API call
    const mockVehicles: Vehicle[] = [
      {
        id: 'veh1',
        registrationNumber: 'CA 123456',
        make: 'Mercedes-Benz',
        model: 'Actros 1845',
        year: 2022,
        type: 'truck',
        capacity: 28000,
        status: 'active',
        currentDriver: 'driver1',
        lastMaintenance: '2025-01-15',
        nextMaintenance: '2025-04-15',
        insuranceExpiry: '2025-12-31',
        registrationExpiry: '2026-03-31',
        features: ['GPS Tracking', 'Air Suspension', 'Sleeping Cabin'],
        location: { lat: -33.9249, lng: 18.4241 }
      },
      {
        id: 'veh2',
        registrationNumber: 'CA 789012',
        make: 'Isuzu',
        model: 'NPR 300',
        year: 2021,
        type: 'refrigerated',
        capacity: 3500,
        status: 'available',
        lastMaintenance: '2025-01-10',
        nextMaintenance: '2025-04-10',
        insuranceExpiry: '2025-11-30',
        registrationExpiry: '2026-02-28',
        features: ['Temperature Control', 'Refrigerated', 'GPS Tracking'],
        location: { lat: -33.8688, lng: 18.5058 }
      },
      {
        id: 'veh3',
        registrationNumber: 'CA 345678',
        make: 'Hino',
        model: '500 Series',
        year: 2020,
        type: 'flatbed',
        capacity: 15000,
        status: 'maintenance',
        lastMaintenance: '2025-01-20',
        nextMaintenance: '2025-02-20',
        insuranceExpiry: '2025-10-31',
        registrationExpiry: '2025-12-31',
        features: ['Loading Ramp', 'GPS Tracking'],
        location: { lat: -34.0522, lng: 18.6325 }
      }
    ];

    setVehicles(mockVehicles);
  }, []);

  const handleAddVehicle = () => {
    const vehicleData: Vehicle = {
      id: `veh${Date.now()}`,
      registrationNumber: newVehicle.registrationNumber,
      make: newVehicle.make,
      model: newVehicle.model,
      year: newVehicle.year,
      type: newVehicle.type,
      capacity: parseFloat(newVehicle.capacity),
      status: 'available',
      lastMaintenance: new Date().toISOString().split('T')[0],
      nextMaintenance: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      insuranceExpiry: newVehicle.insuranceExpiry,
      registrationExpiry: newVehicle.registrationExpiry,
      features: newVehicle.features
    };

    setVehicles([...vehicles, vehicleData]);
    setNewVehicle({
      registrationNumber: '',
      make: '',
      model: '',
      year: new Date().getFullYear(),
      type: 'truck',
      capacity: '',
      features: [],
      insuranceExpiry: '',
      registrationExpiry: ''
    });
    setShowAddForm(false);
  };

  const handleUpdateVehicle = () => {
    if (!editingVehicle) return;

    setVehicles(vehicles.map(v => 
      v.id === editingVehicle.id ? editingVehicle : v
    ));
    setEditingVehicle(null);
  };

  const toggleFeature = (feature: string) => {
    if (showAddForm) {
      setNewVehicle(prev => ({
        ...prev,
        features: prev.features.includes(feature)
          ? prev.features.filter(f => f !== feature)
          : [...prev.features, feature]
      }));
    } else if (editingVehicle) {
      setEditingVehicle(prev => prev ? {
        ...prev,
        features: prev.features.includes(feature)
          ? prev.features.filter(f => f !== feature)
          : [...prev.features, feature]
      } : null);
    }
  };

  const isMaintenanceDue = (vehicle: Vehicle) => {
    const today = new Date();
    const maintenanceDate = new Date(vehicle.nextMaintenance);
    const daysUntilMaintenance = Math.ceil((maintenanceDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilMaintenance <= 7;
  };

  const isExpiringSoon = (expiryDate: string) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const daysUntilExpiry = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 30;
  };

  return (
    <div className="space-y-6">
      {/* Header with Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">Vehicle Fleet</h2>
        </div>
        <Button
          onClick={() => setShowAddForm(true)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-2 w-full sm:w-auto"
        >
          <Plus className="h-4 w-4" />
          Add Vehicle
        </Button>
      </div>
      {/* Add/Edit Vehicle Form */}
      {(showAddForm || editingVehicle) && (
        <Card className="p-4 sm:p-6 hover:shadow-lg transition-all duration-200 hover:scale-[1.01] border-0 shadow-md">
          <h3 className="text-lg font-medium mb-4">
            {showAddForm ? 'Add New Vehicle' : 'Edit Vehicle'}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Registration Number</label>
              <Input
                value={showAddForm ? newVehicle.registrationNumber : editingVehicle?.registrationNumber}
                onChange={(e) => showAddForm 
                  ? setNewVehicle({...newVehicle, registrationNumber: e.target.value})
                  : setEditingVehicle(editingVehicle ? {...editingVehicle, registrationNumber: e.target.value} : null)
                }
                placeholder="e.g., CA 123456"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Make</label>
              <Input
                value={showAddForm ? newVehicle.make : editingVehicle?.make}
                onChange={(e) => showAddForm
                  ? setNewVehicle({...newVehicle, make: e.target.value})
                  : setEditingVehicle(editingVehicle ? {...editingVehicle, make: e.target.value} : null)
                }
                placeholder="e.g., Mercedes-Benz"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
              <Input
                value={showAddForm ? newVehicle.model : editingVehicle?.model}
                onChange={(e) => showAddForm
                  ? setNewVehicle({...newVehicle, model: e.target.value})
                  : setEditingVehicle(editingVehicle ? {...editingVehicle, model: e.target.value} : null)
                }
                placeholder="e.g., Actros 1845"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
              <Input
                type="number"
                value={showAddForm ? newVehicle.year : editingVehicle?.year}
                onChange={(e) => showAddForm
                  ? setNewVehicle({...newVehicle, year: parseInt(e.target.value)})
                  : setEditingVehicle(editingVehicle ? {...editingVehicle, year: parseInt(e.target.value)} : null)
                }
                min="2000"
                max={new Date().getFullYear() + 1}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Type</label>
              <select
                value={showAddForm ? newVehicle.type : editingVehicle?.type}
                onChange={(e) => showAddForm
                  ? setNewVehicle({...newVehicle, type: e.target.value as any})
                  : setEditingVehicle(editingVehicle ? {...editingVehicle, type: e.target.value as any} : null)
                }
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                {vehicleTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Capacity (kg)</label>
              <Input
                type="number"
                value={showAddForm ? newVehicle.capacity : editingVehicle?.capacity}
                onChange={(e) => showAddForm
                  ? setNewVehicle({...newVehicle, capacity: e.target.value})
                  : setEditingVehicle(editingVehicle ? {...editingVehicle, capacity: parseFloat(e.target.value)} : null)
                }
                placeholder="e.g., 28000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Insurance Expiry</label>
              <Input
                type="date"
                value={showAddForm ? newVehicle.insuranceExpiry : editingVehicle?.insuranceExpiry}
                onChange={(e) => showAddForm
                  ? setNewVehicle({...newVehicle, insuranceExpiry: e.target.value})
                  : setEditingVehicle(editingVehicle ? {...editingVehicle, insuranceExpiry: e.target.value} : null)
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Registration Expiry</label>
              <Input
                type="date"
                value={showAddForm ? newVehicle.registrationExpiry : editingVehicle?.registrationExpiry}
                onChange={(e) => showAddForm
                  ? setNewVehicle({...newVehicle, registrationExpiry: e.target.value})
                  : setEditingVehicle(editingVehicle ? {...editingVehicle, registrationExpiry: e.target.value} : null)
                }
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Features</label>
              <div className="flex flex-wrap gap-2">
                {vehicleFeatures.map(feature => (
                  <label key={feature} className="flex items-center gap-1">
                    <input
                      type="checkbox"
                      checked={(showAddForm ? newVehicle : editingVehicle)?.features.includes(feature)}
                      onChange={() => toggleFeature(feature)}
                    />
                    <span className="text-sm">{feature}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => {
              setShowAddForm(false);
              setEditingVehicle(null);
            }}>
              Cancel
            </Button>
            <Button onClick={showAddForm ? handleAddVehicle : handleUpdateVehicle}>
              {showAddForm ? 'Add Vehicle' : 'Update Vehicle'}
            </Button>
          </div>
        </Card>
      )}

      {/* Vehicle Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {vehicles.map((vehicle) => {
          const vehicleStatusConfig = statusConfig[vehicle.status];
          const maintenanceDue = isMaintenanceDue(vehicle);
          const insuranceExpiring = isExpiringSoon(vehicle.insuranceExpiry);
          const registrationExpiring = isExpiringSoon(vehicle.registrationExpiry);

          return (
            <div key={vehicle.id} className="p-3 sm:p-4 lg:p-5 hover:shadow-lg transition-all duration-200 hover:scale-[1.02] border-0 shadow-md bg-white rounded-xl w-full min-h-[280px] sm:min-h-[320px] lg:min-h-[360px] flex flex-col">
              {/* Header with Status */}
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-3 mb-3 sm:mb-4">
                <div className="flex items-center gap-1.5 sm:gap-2 flex-1 min-w-0">
                  <div className="p-1.5 sm:p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg flex-shrink-0">
                    <Truck className="h-3 w-3 sm:h-4 lg:h-5 text-white flex-shrink-0" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 text-xs sm:text-sm lg:text-base mb-1" title={`${vehicle.make} ${vehicle.model}`}>{vehicle.make} {vehicle.model}</h3>
                    <p className="text-xs sm:text-sm text-gray-600">{vehicle.registrationNumber}</p>
                  </div>
                </div>
                <Badge variant="info" className={`${vehicleStatusConfig.color} text-xs whitespace-nowrap flex-shrink-0`}>
                  {vehicleStatusConfig.icon} {vehicleStatusConfig.label}
                </Badge>
              </div>

              {/* Vehicle Details */}
              <div className="space-y-2 text-xs sm:text-sm mb-3 sm:mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 flex-shrink-0">Type:</span>
                  <span className="font-medium text-right truncate" title={vehicle.type}>{vehicle.type}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 flex-shrink-0">Year:</span>
                  <span className="font-medium text-right">{vehicle.year}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 flex-shrink-0">Capacity:</span>
                  <span className="font-medium text-right truncate" title={`${vehicle.capacity.toLocaleString()} kg`}>{vehicle.capacity.toLocaleString()} kg</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 flex-shrink-0">Next Maintenance:</span>
                  <span className={`font-medium text-right truncate ${maintenanceDue ? 'text-red-600' : ''}`} title={vehicle.nextMaintenance}>
                    {vehicle.nextMaintenance}
                    {maintenanceDue && ' ⚠️'}
                  </span>
                </div>
              </div>

              {/* Alerts */}
              {(maintenanceDue || insuranceExpiring || registrationExpiring) && (
                <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
                    <div className="text-xs text-yellow-800">
                      {maintenanceDue && <div>• Maintenance due soon</div>}
                      {insuranceExpiring && <div>• Insurance expiring soon</div>}
                      {registrationExpiring && <div>• Registration expiring soon</div>}
                    </div>
                  </div>
                </div>
              )}

              {/* Features */}
              {vehicle.features.length > 0 && (
                <div className="mt-4">
                  <div className="flex flex-wrap gap-1">
                    {vehicle.features.slice(0, 3).map((feature, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                    {vehicle.features.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{vehicle.features.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-2 mt-auto pt-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedVehicle(vehicle);
                    onVehicleSelect?.(vehicle);
                  }}
                  className="flex-1 text-xs sm:text-sm"
                >
                  <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                  View
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setEditingVehicle(vehicle);
                    setShowAddForm(true);
                  }}
                  className="flex-1 text-xs sm:text-sm"
                >
                  <Edit className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                  Edit
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
