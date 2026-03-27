// src/components/logistics/vehicleManagement/VehicleList.tsx
'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Truck, 
  Wrench, 
  AlertTriangle, 
  Plus, 
  Edit, 
  Eye, 
  Search,
  Filter
} from 'lucide-react';
import { Vehicle } from './hooks/useVehicleManagement';

interface VehicleListProps {
  vehicles: Vehicle[];
  statusConfig: Record<string, { color: string; icon: string; label: string }>;
  vehicleTypes: { value: string; label: string }[];
  onAddVehicle: () => void;
  onEditVehicle: (vehicle: Vehicle) => void;
  onViewVehicle: (vehicle: Vehicle) => void;
  onStatusUpdate: (vehicleId: string, status: Vehicle['status']) => void;
  maintenanceAlerts: Vehicle[];
}

export function VehicleList({ 
  vehicles, 
  statusConfig, 
  vehicleTypes,
  onAddVehicle, 
  onEditVehicle, 
  onViewVehicle, 
  onStatusUpdate,
  maintenanceAlerts
}: VehicleListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch = vehicle.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicle.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicle.model.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || vehicle.status === statusFilter;
    const matchesType = typeFilter === 'all' || vehicle.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const getVehicleTypeLabel = (type: string) => {
    return vehicleTypes.find(vType => vType.value === type)?.label || type;
  };

  const formatCapacity = (capacity: string) => {
    return capacity;
  };

  const formatMileage = (mileage: number) => {
    return `${mileage.toLocaleString()} km`;
  };

  const formatFuelLevel = (level: number) => {
    return `${level}%`;
  };

  const getFuelColor = (level: number) => {
    if (level > 50) return 'text-green-600';
    if (level > 25) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Vehicle Fleet</h3>
        <Button onClick={onAddVehicle}>
          <Plus className="h-4 w-4 mr-2" />
          Add Vehicle
        </Button>
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

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search vehicles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[150px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="on-route">On Route</SelectItem>
            <SelectItem value="maintenance">Maintenance</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-full sm:w-[150px]">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {vehicleTypes.map(type => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Vehicle Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVehicles.length === 0 ? (
          <div className="col-span-full text-center py-8">
            <Truck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No vehicles found</p>
            <p className="text-sm text-gray-400 mt-1">Try adjusting your filters or add a new vehicle</p>
          </div>
        ) : (
          filteredVehicles.map((vehicle) => {
            const status = statusConfig[vehicle.status];
            const hasMaintenanceAlert = maintenanceAlerts.some(alert => alert.id === vehicle.id);
            
            return (
              <Card key={vehicle.id} className="p-4">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <Truck className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{vehicle.registrationNumber}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className={`${status.color} text-xs`}>
                          <span className="mr-1">{status.icon}</span>
                          {status.label}
                        </Badge>
                        {hasMaintenanceAlert && (
                          <AlertTriangle className="h-3 w-3 text-yellow-500" />
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onViewVehicle(vehicle)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEditVehicle(vehicle)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Make/Model</span>
                    <span className="font-medium">{vehicle.make} {vehicle.model}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Type</span>
                    <span className="font-medium">{getVehicleTypeLabel(vehicle.type)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Capacity</span>
                    <span className="font-medium">{formatCapacity(vehicle.capacity)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Mileage</span>
                    <span className="font-medium">{formatMileage(vehicle.mileage)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Fuel Level</span>
                    <span className={`font-medium ${getFuelColor(vehicle.fuelLevel)}`}>
                      {formatFuelLevel(vehicle.fuelLevel)}
                    </span>
                  </div>
                  {vehicle.currentDriver && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Driver</span>
                      <span className="font-medium">{vehicle.currentDriver}</span>
                    </div>
                  )}
                </div>

                {/* Quick Actions */}
                <div className="mt-4 pt-4 border-t flex gap-2">
                  <Select value={vehicle.status} onValueChange={(value) => onStatusUpdate(vehicle.id, value as Vehicle['status'])}>
                    <SelectTrigger className="text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="on-route">On Route</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
