// src/components/logistics/transportScheduling/ScheduleForm.tsx
'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { TransportSchedule, Vehicle, Driver } from '@/types/logistics';

interface ScheduleFormProps {
  schedule?: TransportSchedule;
  vehicles: Vehicle[];
  drivers: Driver[];
  onSubmit: (schedule: TransportSchedule) => void;
  onCancel: () => void;
}

const priorityConfig = {
  low: { color: 'bg-gray-100 text-gray-600', icon: '🔹', label: 'Low' },
  medium: { color: 'bg-sky-100 text-sky-800', icon: '🔸', label: 'Medium' },
  high: { color: 'bg-orange-100 text-orange-800', icon: '🔶', label: 'High' },
  urgent: { color: 'bg-red-100 text-red-800', icon: '🔴', label: 'Urgent' }
};

const specialHandlingOptions = [
  'Temperature Controlled',
  'Fragile',
  'Hazardous Materials',
  'Perishable',
  'High Value',
  'Oversized',
  'Refrigerated',
  'Dry Ice Required'
];

export function ScheduleForm({ schedule, vehicles, drivers, onSubmit, onCancel }: ScheduleFormProps) {
  const isEditing = !!schedule;
  const [formData, setFormData] = useState({
    vehicleId: schedule?.vehicleId || '',
    driverId: schedule?.driverId || '',
    productId: schedule?.productId || '',
    originName: schedule?.route.origin.name || '',
    originAddress: schedule?.route.origin.address || '',
    originContact: schedule?.route.origin.contact || '',
    destinationName: schedule?.route.destination.name || '',
    destinationAddress: schedule?.route.destination.address || '',
    destinationContact: schedule?.route.destination.contact || '',
    scheduledDate: schedule?.scheduledDate || '',
    estimatedDuration: schedule?.estimatedDuration?.toString() || '',
    priority: schedule?.priority || 'medium' as const,
    cargoWeight: schedule?.cargoDetails.weight?.toString() || '',
    cargoVolume: schedule?.cargoDetails.volume?.toString() || '',
    temperatureRequirements: schedule?.cargoDetails.temperatureRequirements || '',
    specialHandling: schedule?.cargoDetails.specialHandling || [],
    notes: schedule?.notes || ''
  });

  const toggleSpecialHandling = (handling: string) => {
    setFormData(prev => ({
      ...prev,
      specialHandling: prev.specialHandling.includes(handling)
        ? prev.specialHandling.filter(h => h !== handling)
        : [...prev.specialHandling, handling]
    }));
  };

  const handleSubmit = () => {
    const scheduleData: TransportSchedule = {
      id: schedule?.id || `sched${Date.now()}`,
      vehicleId: formData.vehicleId,
      driverId: formData.driverId,
      productId: formData.productId,
      route: {
        origin: {
          name: formData.originName,
          address: formData.originAddress,
          lat: -33.9249,
          lng: 18.4241,
          contact: formData.originContact
        },
        destination: {
          name: formData.destinationName,
          address: formData.destinationAddress,
          lat: -33.9249,
          lng: 18.4241,
          contact: formData.destinationContact
        }
      },
      scheduledDate: formData.scheduledDate,
      estimatedDuration: parseInt(formData.estimatedDuration),
      status: schedule?.status || 'scheduled',
      priority: formData.priority,
      cargoDetails: {
        weight: parseFloat(formData.cargoWeight),
        volume: parseFloat(formData.cargoVolume),
        temperatureRequirements: formData.temperatureRequirements || undefined,
        specialHandling: formData.specialHandling
      },
      documents: schedule?.documents || [],
      notes: formData.notes,
      createdAt: schedule?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    onSubmit(scheduleData);
  };

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="p-4 sm:p-6">
      <h3 className="text-lg font-medium mb-4">
        {isEditing ? 'Edit Transport Schedule' : 'Schedule New Transport'}
      </h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Product ID */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Product ID</label>
          <Input
            value={formData.productId}
            onChange={(e) => updateField('productId', e.target.value)}
            placeholder="e.g., PRD-2024-001"
          />
        </div>

        {/* Vehicle Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle</label>
          <select
            value={formData.vehicleId}
            onChange={(e) => updateField('vehicleId', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="">Select Vehicle</option>
            {vehicles.map(vehicle => (
              <option key={vehicle.id} value={vehicle.id}>
                {vehicle.make} {vehicle.model} ({vehicle.registrationNumber})
              </option>
            ))}
          </select>
        </div>

        {/* Driver Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Driver</label>
          <select
            value={formData.driverId}
            onChange={(e) => updateField('driverId', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="">Select Driver</option>
            {drivers.map(driver => (
              <option key={driver.id} value={driver.id}>
                {driver.name} ({driver.phone})
              </option>
            ))}
          </select>
        </div>

        {/* Priority */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
          <select
            value={formData.priority}
            onChange={(e) => updateField('priority', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            {Object.entries(priorityConfig).map(([key, config]) => (
              <option key={key} value={key}>{config.icon} {config.label}</option>
            ))}
          </select>
        </div>

        {/* Origin */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Origin</label>
          <Input
            value={formData.originName}
            onChange={(e) => updateField('originName', e.target.value)}
            placeholder="Origin name"
          />
        </div>

        <div className="md:col-span-2">
          <Input
            value={formData.originAddress}
            onChange={(e) => updateField('originAddress', e.target.value)}
            placeholder="Origin address"
          />
        </div>

        {/* Destination */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Destination</label>
          <Input
            value={formData.destinationName}
            onChange={(e) => updateField('destinationName', e.target.value)}
            placeholder="Destination name"
          />
        </div>

        <div className="md:col-span-2">
          <Input
            value={formData.destinationAddress}
            onChange={(e) => updateField('destinationAddress', e.target.value)}
            placeholder="Destination address"
          />
        </div>

        {/* Schedule Details */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Scheduled Date</label>
          <Input
            type="datetime-local"
            value={formData.scheduledDate}
            onChange={(e) => updateField('scheduledDate', e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Duration (minutes)</label>
          <Input
            type="number"
            value={formData.estimatedDuration}
            onChange={(e) => updateField('estimatedDuration', e.target.value)}
            placeholder="e.g., 120"
          />
        </div>

        {/* Cargo Details */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Cargo Weight (kg)</label>
          <Input
            type="number"
            value={formData.cargoWeight}
            onChange={(e) => updateField('cargoWeight', e.target.value)}
            placeholder="e.g., 500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Cargo Volume (m³)</label>
          <Input
            type="number"
            value={formData.cargoVolume}
            onChange={(e) => updateField('cargoVolume', e.target.value)}
            placeholder="e.g., 2.5"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Temperature Requirements</label>
          <Input
            value={formData.temperatureRequirements}
            onChange={(e) => updateField('temperatureRequirements', e.target.value)}
            placeholder="e.g., 2-4°C"
          />
        </div>

        {/* Special Handling */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Special Handling</label>
          <div className="flex flex-wrap gap-2">
            {specialHandlingOptions.map(handling => (
              <label key={handling} className="flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={formData.specialHandling.includes(handling)}
                  onChange={() => toggleSpecialHandling(handling)}
                />
                <span className="text-sm">{handling}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
          <Textarea
            value={formData.notes}
            onChange={(e) => updateField('notes', e.target.value)}
            rows={3}
            placeholder="Additional notes about this transport"
          />
        </div>
      </div>

      <div className="flex justify-end gap-2 mt-4">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSubmit}>
          {isEditing ? 'Update Schedule' : 'Schedule Transport'}
        </Button>
      </div>
    </Card>
  );
}
