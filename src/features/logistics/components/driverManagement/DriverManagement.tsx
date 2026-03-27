// src/components/logistics/driverManagement/DriverManagement.tsx
'use client';

import { useState } from 'react';
import { DriverList } from './DriverList';
import { DriverForm } from './DriverForm';
import { DriverDetails } from './DriverDetails';
import { useDriverManagement, type Driver, type NewDriver } from './hooks/useDriverManagement';
import { Button } from '@/components/ui/button';
import { Plus, Users, Truck, Star, AlertTriangle } from 'lucide-react';

interface DriverManagementProps {
  onDriverSelect?: (driver: Driver) => void;
}

export function DriverManagement({ onDriverSelect }: DriverManagementProps) {
  const {
    drivers,
    isLoading,
    certificationOptions,
    statusConfig,
    createDriver,
    updateDriver,
    getDriverStats,
    getLicenseExpiryAlerts
  } = useDriverManagement();

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingDriver, setEditingDriver] = useState<Driver | null>(null);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);

  const stats = getDriverStats();
  const licenseAlerts = getLicenseExpiryAlerts();

  const handleAddDriver = (driverData: NewDriver) => {
    createDriver(driverData);
    setShowAddForm(false);
  };

  const handleEditDriver = (driver: Driver) => {
    setEditingDriver(driver);
  };

  const handleUpdateDriver = (driverData: NewDriver) => {
    if (editingDriver) {
      updateDriver({ ...editingDriver, ...driverData });
      setEditingDriver(null);
    }
  };

  const handleViewDetails = (driver: Driver) => {
    setSelectedDriver(driver);
    onDriverSelect?.(driver);
  };

  const handleAssignVehicle = (driver: Driver) => {
    console.log('Assign vehicle to driver:', driver.id);
    // TODO: Implement vehicle assignment modal
  };

  const handleUpdateStatus = (driverId: string, status: Driver['status']) => {
    updateDriver({ ...getDriverById(driverId)!, status });
  };

  const getDriverById = (id: string): Driver | undefined => {
    return drivers.find(driver => driver.id === id);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Driver Management</h2>
        <Button onClick={() => setShowAddForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Driver
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Drivers</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <Users className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Available</p>
              <p className="text-2xl font-bold text-green-600">{stats.available}</p>
            </div>
            <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-green-600 text-sm">🟢</span>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">On Delivery</p>
              <p className="text-2xl font-bold text-blue-600">{stats.onDelivery}</p>
            </div>
            <Truck className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Rating</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.averageRating.toFixed(1)}</p>
            </div>
            <Star className="h-8 w-8 text-yellow-600" />
          </div>
        </div>
      </div>

      {/* License Alerts */}
      {licenseAlerts.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-5 w-5 text-yellow-600" />
            <h3 className="font-semibold text-yellow-800">License Expiry Alerts</h3>
          </div>
          <p className="text-yellow-700 text-sm">
            {licenseAlerts.length} driver(s) have licenses expiring within 3 months
          </p>
        </div>
      )}

      {/* Driver List */}
      <DriverList
        drivers={drivers}
        statusConfig={statusConfig}
        onDriverSelect={handleViewDetails}
        onEditDriver={handleEditDriver}
        onAssignVehicle={handleAssignVehicle}
      />

      {/* Add Driver Form Modal */}
      {showAddForm && (
        <DriverForm
          certificationOptions={certificationOptions}
          onSubmit={handleAddDriver}
          onCancel={() => setShowAddForm(false)}
        />
      )}

      {/* Edit Driver Form Modal */}
      {editingDriver && (
        <DriverForm
          driver={editingDriver}
          certificationOptions={certificationOptions}
          onSubmit={handleUpdateDriver}
          onCancel={() => setEditingDriver(null)}
        />
      )}

      {/* Driver Details Modal */}
      {selectedDriver && (
        <DriverDetails
          driver={selectedDriver}
          onClose={() => setSelectedDriver(null)}
          onEdit={handleEditDriver}
          onAssignVehicle={handleAssignVehicle}
          onUpdateStatus={handleUpdateStatus}
        />
      )}
    </div>
  );
}
