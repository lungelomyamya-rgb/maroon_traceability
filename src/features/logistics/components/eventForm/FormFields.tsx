// src/components/logistics/eventForm/FormFields.tsx
'use client';

import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, Calendar, Clock, Package, Thermometer, Gauge, Fuel } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import { EnhancedEventFormData, Vehicle, Driver } from './hooks/useEventForm';

interface FormFieldsProps {
  form: UseFormReturn<EnhancedEventFormData>;
  isTransportEvent: boolean;
  vehicles: Vehicle[];
  drivers: Driver[];
  cargoConditionOptions: string[];
}

export function FormFields({ 
  form, 
  isTransportEvent, 
  vehicles, 
  drivers, 
  cargoConditionOptions 
}: FormFieldsProps) {
  return (
    <div className="space-y-6">
      {/* Basic Fields */}
      <Card className="p-4">
        <h3 className="font-semibold text-gray-900 mb-4">Basic Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="location" className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <MapPin className="h-4 w-4" />
              Location
            </Label>
            <Input
              id="location"
              placeholder="Event location"
              {...form.register('location')}
            />
          </div>
          <div>
            <Label htmlFor="timestamp" className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Calendar className="h-4 w-4" />
              Date & Time
            </Label>
            <Input
              id="timestamp"
              type="datetime-local"
              {...form.register('timestamp')}
            />
          </div>
        </div>
        <div className="mt-4">
          <Label htmlFor="notes" className="text-sm font-medium text-gray-700">
            Notes
          </Label>
          <Textarea
            id="notes"
            placeholder="Add any additional notes about this event..."
            rows={3}
            {...form.register('notes')}
          />
        </div>
      </Card>

      {/* Transport-specific Fields */}
      {isTransportEvent && (
        <>
          <Card className="p-4">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Package className="h-4 w-4" />
              Transport Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="vehicleId" className="text-sm font-medium text-gray-700">
                  Vehicle
                </Label>
                <Select value={form.watch('vehicleId')} onValueChange={(value) => form.setValue('vehicleId', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select vehicle" />
                  </SelectTrigger>
                  <SelectContent>
                    {vehicles.map((vehicle) => (
                      <SelectItem key={vehicle.id} value={vehicle.id}>
                        {vehicle.plateNumber} - {vehicle.type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="driverId" className="text-sm font-medium text-gray-700">
                  Driver
                </Label>
                <Select value={form.watch('driverId')} onValueChange={(value) => form.setValue('driverId', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select driver" />
                  </SelectTrigger>
                  <SelectContent>
                    {drivers.map((driver) => (
                      <SelectItem key={driver.id} value={driver.id}>
                        {driver.name} - {driver.phone}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="transportReference" className="text-sm font-medium text-gray-700">
                  Transport Reference
                </Label>
                <Input
                  id="transportReference"
                  placeholder="e.g., TRK-2024-001"
                  {...form.register('transportReference')}
                />
              </div>
              <div>
                <Label htmlFor="collectionDate" className="text-sm font-medium text-gray-700">
                  Collection Date
                </Label>
                <Input
                  id="collectionDate"
                  type="date"
                  {...form.register('collectionDate')}
                />
              </div>
              <div>
                <Label htmlFor="deliveryDate" className="text-sm font-medium text-gray-700">
                  Delivery Date
                </Label>
                <Input
                  id="deliveryDate"
                  type="date"
                  {...form.register('deliveryDate')}
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="routeDetails" className="text-sm font-medium text-gray-700">
                  Route Details
                </Label>
                <Textarea
                  id="routeDetails"
                  placeholder="Describe the route, waypoints, etc."
                  rows={2}
                  {...form.register('routeDetails')}
                />
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <h3 className="font-semibold text-gray-900 mb-4">Cargo & Vehicle Status</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="cargoCondition" className="text-sm font-medium text-gray-700">
                  Cargo Condition
                </Label>
                <Select value={form.watch('cargoCondition')} onValueChange={(value) => form.setValue('cargoCondition', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select cargo condition" />
                  </SelectTrigger>
                  <SelectContent>
                    {cargoConditionOptions.map((condition) => (
                      <SelectItem key={condition} value={condition}>
                        {condition}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="temperatureReading" className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Thermometer className="h-4 w-4" />
                  Temperature Reading
                </Label>
                <Input
                  id="temperatureReading"
                  placeholder="e.g., 4°C"
                  {...form.register('temperatureReading')}
                />
              </div>
              <div>
                <Label htmlFor="mileage" className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Gauge className="h-4 w-4" />
                  Mileage
                </Label>
                <Input
                  id="mileage"
                  placeholder="e.g., 45,230 km"
                  {...form.register('mileage')}
                />
              </div>
              <div>
                <Label htmlFor="fuelLevel" className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Fuel className="h-4 w-4" />
                  Fuel Level
                </Label>
                <Input
                  id="fuelLevel"
                  placeholder="e.g., 75%"
                  {...form.register('fuelLevel')}
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="vehicleCondition" className="text-sm font-medium text-gray-700">
                  Vehicle Condition
                </Label>
                <Textarea
                  id="vehicleCondition"
                  placeholder="Describe vehicle condition, any issues, etc."
                  rows={2}
                  {...form.register('vehicleCondition')}
                />
              </div>
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
