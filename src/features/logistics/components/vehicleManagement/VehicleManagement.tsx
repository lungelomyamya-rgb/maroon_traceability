// src/components/logistics/vehicleManagement/VehicleManagement.tsx
'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Truck, Plus, Wrench, AlertTriangle } from 'lucide-react';
import { useVehicleManagement, type Vehicle } from './hooks/useVehicleManagement';
import { VehicleList } from './VehicleList';
import { VehicleForm } from './VehicleForm';
import { VehicleDetails } from './VehicleDetails';

interface VehicleManagementProps {
  onVehicleSelect?: (vehicle: Vehicle) => void;
}

export function VehicleManagement({ onVehicleSelect }: VehicleManagementProps) {
  const {
    vehicles,
    isLoading,
    vehicleTypes,
    vehicleFeatures,
    statusConfig,
    createVehicle,
    updateVehicle,
    deleteVehicle,
    getVehicleById,
    updateVehicleStatus,
    getMaintenanceAlerts,
    getVehicleStats
  } = useVehicleManagement();

  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);

  const maintenanceAlerts = getMaintenanceAlerts();
  const stats = getVehicleStats();

  const handleAddVehicle = (vehicleData: any) => {
    const newVehicle = createVehicle(vehicleData);
    setShowAddForm(false);
    onVehicleSelect?.(newVehicle);
  };

  const handleEditVehicle = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
  };

  const handleViewVehicle = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    onVehicleSelect?.(vehicle);
  };

  const handleUpdateVehicle = (vehicleData: any) => {
    if (editingVehicle) {
      const updatedVehicle = { ...editingVehicle, ...vehicleData };
      updateVehicle(updatedVehicle);
      setEditingVehicle(null);
      onVehicleSelect?.(updatedVehicle);
    }
  };

  const handleStatusUpdate = (vehicleId: string, status: Vehicle['status']) => {
    updateVehicleStatus(vehicleId, status);
    const updatedVehicle = getVehicleById(vehicleId);
    if (updatedVehicle) {
      onVehicleSelect?.(updatedVehicle);
    }
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
        <h2 className="text-2xl font-bold text-gray-900">Vehicle Management</h2>
        <Button onClick={() => setShowAddForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Vehicle
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Vehicles</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <Truck className="h-8 w-8 text-blue-600" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active</p>
              <p className="text-2xl font-bold text-green-600">{stats.active}</p>
            </div>
            <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-green-600 text-sm">🟢</span>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">On Route</p>
              <p className="text-2xl font-bold text-blue-600">{stats.onRoute}</p>
            </div>
            <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 text-sm">🚚</span>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Maintenance</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.maintenance}</p>
            </div>
            <div className="h-8 w-8 bg-yellow-100 rounded-full flex items-center justify-center">
              <span className="text-yellow-600 text-sm">🔧</span>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Inactive</p>
              <p className="text-2xl font-bold text-red-600">{stats.inactive}</p>
            </div>
            <div className="h-8 w-8 bg-red-100 rounded-full flex items-center justify-center">
              <span className="text-red-600 text-sm">🔴</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Maintenance Alerts */}
      {maintenanceAlerts.length > 0 && (
        <Card className="p-4 border-yellow-200 bg-yellow-50">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-yellow-600" />
            <div>
              <h4 className="font-medium text-yellow-800">Maintenance Alerts</h4>
              <p className="text-sm text-yellow-700">
                {maintenanceAlerts.length} vehicle(s) have upcoming maintenance requirements
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Vehicle List */}
      <VehicleList
        vehicles={vehicles}
        statusConfig={statusConfig}
        vehicleTypes={vehicleTypes}
        onAddVehicle={() => setShowAddForm(true)}
        onEditVehicle={handleEditVehicle}
        onViewVehicle={handleViewVehicle}
        onStatusUpdate={handleStatusUpdate}
        maintenanceAlerts={maintenanceAlerts}
      />

      {/* Add Vehicle Form */}
      {showAddForm && (
        <VehicleForm
          vehicleTypes={vehicleTypes}
          vehicleFeatures={vehicleFeatures}
          onSubmit={handleAddVehicle}
          onCancel={() => setShowAddForm(false)}
        />
      )}

      {/* Edit Vehicle Form */}
      {editingVehicle && (
        <VehicleForm
          vehicle={editingVehicle}
          vehicleTypes={vehicleTypes}
          vehicleFeatures={vehicleFeatures}
          onSubmit={handleUpdateVehicle}
          onCancel={() => setEditingVehicle(null)}
        />
      )}

      {/* Vehicle Details Modal */}
      {selectedVehicle && (
        <VehicleDetails
          vehicle={selectedVehicle}
          statusConfig={statusConfig}
          onClose={() => setSelectedVehicle(null)}
          onEdit={handleEditVehicle}
          onStatusUpdate={handleStatusUpdate}
        />
      )}
    </div>
  );
}
