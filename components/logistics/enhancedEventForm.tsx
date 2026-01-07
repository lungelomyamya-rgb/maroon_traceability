// src/components/logistics/enhancedEventForm.tsx
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Truck, User, MapPin, Calendar, Clock, Package, AlertTriangle } from 'lucide-react';
import { eventTypeValues, eventTypes } from '@/lib/constants';
import { Vehicle, Driver } from '@/types/logistics';

// Enhanced event schema with logistics fields
const enhancedEventSchema = z.object({
  type: z.enum(eventTypeValues),
  notes: z.string().optional(),
  location: z.string().optional(),
  timestamp: z.string().datetime(),
  photos: z.array(z.instanceof(File)).optional(),
  // Logistics-specific fields
  vehicleId: z.string().optional(),
  driverId: z.string().optional(),
  transportReference: z.string().optional(),
  collectionDate: z.string().optional(),
  deliveryDate: z.string().optional(),
  routeDetails: z.string().optional(),
  cargoCondition: z.string().optional(),
  temperatureReading: z.string().optional(),
  mileage: z.string().optional(),
  fuelLevel: z.string().optional(),
  vehicleCondition: z.string().optional()
});

type EnhancedEventFormData = z.infer<typeof enhancedEventSchema>;

interface EnhancedEventFormProps {
  productId: string;
  onSubmit: (data: EnhancedEventFormData) => Promise<void>;
  vehicles?: Vehicle[];
  drivers?: Driver[];
  initialData?: Partial<EnhancedEventFormData>;
}

const transportEventTypes = ['collection', 'transport', 'delivery'];
const cargoConditionOptions = [
  'Excellent',
  'Good', 
  'Fair',
  'Poor',
  'Damaged',
  'Temperature Issue',
  'Packaging Issue'
];

export function EnhancedEventForm({ 
  productId, 
  onSubmit, 
  vehicles = [], 
  drivers = [], 
  initialData 
}: EnhancedEventFormProps) {
  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm<EnhancedEventFormData>({
    resolver: zodResolver(enhancedEventSchema),
    defaultValues: {
      timestamp: new Date().toISOString(),
      ...initialData
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const selectedEventType = watch('type');
  const isTransportEvent = transportEventTypes.includes(selectedEventType);

  const handleFormSubmit = async (data: EnhancedEventFormData) => {
    try {
      setIsSubmitting(true);
      await onSubmit(data);
    } catch (error) {
      console.error('Error submitting event:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getVehicleInfo = (vehicleId: string) => {
    return vehicles.find(v => v.id === vehicleId);
  };

  const getDriverInfo = (driverId: string) => {
    return drivers.find(d => d.id === driverId);
  };

  const getVehicleDisplay = (vehicleId: string) => {
    const vehicle = getVehicleInfo(vehicleId);
    if (!vehicle) return '';
    return `${vehicle.make || ''} ${vehicle.model || ''}`.trim();
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <div className="p-2 bg-sky-100 rounded-lg">
          <Truck className="h-5 w-5 text-sky-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-700">Logistics Event</h3>
          <p className="text-sm text-gray-600">Record transport and logistics activities</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        {/* Basic Event Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Event Type
            </label>
            <select
              {...register('type')}
              className="w-full p-2 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Select event type</option>
              {eventTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
            {errors.type && (
              <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date & Time
            </label>
            <Input
              type="datetime-local"
              {...register('timestamp')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.timestamp && (
              <p className="mt-1 text-sm text-red-600">{errors.timestamp.message}</p>
            )}
          </div>
        </div>

        {/* Logistics-specific fields */}
        {isTransportEvent && (
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2 mb-4">
                <Truck className="h-5 w-5 text-blue-600" />
                <h4 className="font-medium text-blue-900">Transport Information</h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Vehicle
                  </label>
                  <select
                    {...register('vehicleId')}
                    className="w-full p-2 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="">Select vehicle</option>
                    {vehicles.map((vehicle) => (
                      <option key={vehicle.id} value={vehicle.id}>
                        {vehicle.make} {vehicle.model} ({vehicle.registrationNumber})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Driver
                  </label>
                  <select
                    {...register('driverId')}
                    className="w-full p-2 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="">Select driver</option>
                    {drivers.map((driver) => (
                      <option key={driver.id} value={driver.id}>
                        {driver.name} ({driver.phone})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Transport Reference
                  </label>
                  <Input
                    {...register('transportReference')}
                    placeholder="e.g., TR-2025-001234"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Collection Date
                  </label>
                  <Input
                    type="datetime-local"
                    {...register('collectionDate')}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Expected Delivery Date
                  </label>
                  <Input
                    type="datetime-local"
                    {...register('deliveryDate')}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Route Details
                  </label>
                  <Textarea
                    {...register('routeDetails')}
                    rows={2}
                    placeholder="e.g., Cape Town → Johannesburg via N1, estimated 15 hours"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Vehicle Status Fields */}
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="h-5 w-5 text-green-600" />
                <h4 className="font-medium text-green-900">Vehicle Status</h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mileage (km)
                  </label>
                  <Input
                    type="number"
                    {...register('mileage')}
                    placeholder="e.g., 125500"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fuel Level (%)
                  </label>
                  <Input
                    type="number"
                    {...register('fuelLevel')}
                    placeholder="e.g., 75"
                    min="0"
                    max="100"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Temperature (°C)
                  </label>
                  <Input
                    {...register('temperatureReading')}
                    placeholder="e.g., 4.5"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div className="md:col-span-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Vehicle Condition
                  </label>
                  <Textarea
                    {...register('vehicleCondition')}
                    rows={2}
                    placeholder="e.g., All systems operational, tires in good condition, refrigeration unit functioning properly"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Cargo Condition */}
            <div className="p-4 bg-yellow-50 rounded-lg">
              <div className="flex items-center gap-2 mb-4">
                <Package className="h-5 w-5 text-yellow-600" />
                <h4 className="font-medium text-yellow-900">Cargo Condition</h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cargo Condition
                  </label>
                  <select
                    {...register('cargoCondition')}
                    className="w-full p-2 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="">Select condition</option>
                    {cargoConditionOptions.map((condition) => (
                      <option key={condition} value={condition}>
                        {condition}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cargo Notes
                  </label>
                  <Textarea
                    {...register('notes')}
                    rows={3}
                    placeholder="Detailed notes about cargo condition, handling requirements, special observations..."
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Standard event fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <Input
              {...register('location')}
              placeholder="e.g., Green Valley Farm, Stellenbosch"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Photos
            </label>
            <Input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => {
                const files = Array.from(e.target.files || []);
                setValue('photos', files);
              }}
              className="mt-1 block w-full"
            />
            <p className="text-xs text-gray-500 mt-1">
              Upload photos of cargo, vehicle condition, or documentation
            </p>
          </div>
        </div>

        {/* Selected Vehicle/Driver Info */}
        {isTransportEvent && (watch('vehicleId') || watch('driverId')) && (
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-700 mb-3">Selected Resources</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {watch('vehicleId') && (
                <div className="flex items-center gap-3">
                  <Truck className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Vehicle</p>
                    <p className="text-xs text-gray-600">
                      {getVehicleDisplay(watch('vehicleId') || '')}
                    </p>
                    <p className="text-xs text-gray-500">
                      {getVehicleInfo(watch('vehicleId') || '')?.registrationNumber || ''}
                    </p>
                  </div>
                </div>
              )}
              {watch('driverId') && (
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Driver</p>
                    <p className="text-xs text-gray-600">
                      {getDriverInfo(watch('driverId') || '')?.name || ''}
                    </p>
                    <p className="text-xs text-gray-500">
                      {getDriverInfo(watch('driverId') || '')?.phone || ''}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => {/* Cancel logic */}}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-sky-600 text-white hover:bg-sky-700"
          >
            {isSubmitting ? 'Submitting...' : 'Record Event'}
          </Button>
        </div>
      </form>
    </Card>
  );
}
