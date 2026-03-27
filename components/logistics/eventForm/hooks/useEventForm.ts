// src/components/logistics/eventForm/hooks/useEventForm.ts
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Enhanced event schema with logistics fields
const enhancedEventSchema = z.object({
  type: z.enum([
    'planting', 'harvesting', 'processing', 'packaging', 
    'storage', 'transport', 'collection', 'delivery', 'quality-check', 'other'
  ]),
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

interface Vehicle {
  id: string;
  plateNumber: string;
  type: string;
  capacity: number;
  status: string;
}

interface Driver {
  id: string;
  name: string;
  phone: string;
  status: string;
}

export function useEventForm(initialData?: Partial<EnhancedEventFormData>) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const form = useForm<EnhancedEventFormData>({
    resolver: zodResolver(enhancedEventSchema),
    defaultValues: {
      type: initialData?.type || 'other',
      notes: initialData?.notes || '',
      location: initialData?.location || '',
      timestamp: initialData?.timestamp || new Date().toISOString(),
      photos: initialData?.photos || [],
      vehicleId: initialData?.vehicleId || '',
      driverId: initialData?.driverId || '',
      transportReference: initialData?.transportReference || '',
      collectionDate: initialData?.collectionDate || '',
      deliveryDate: initialData?.deliveryDate || '',
      routeDetails: initialData?.routeDetails || '',
      cargoCondition: initialData?.cargoCondition || '',
      temperatureReading: initialData?.temperatureReading || '',
      mileage: initialData?.mileage || '',
      fuelLevel: initialData?.fuelLevel || '',
      vehicleCondition: initialData?.vehicleCondition || ''
    }
  });

  const transportEventTypes = ['collection', 'transport', 'delivery'];
  
  const cargoConditionOptions = [
    'Excellent',
    'Good',
    'Fair',
    'Poor',
    'Damaged',
    'Contaminated',
    'Temperature Issue',
    'Other'
  ];

  const eventTypeOptions = [
    { value: 'planting', label: 'Planting', icon: '🌱', color: 'bg-green-100 text-green-800' },
    { value: 'harvesting', label: 'Harvesting', icon: '🌾', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'processing', label: 'Processing', icon: '🏭', color: 'bg-blue-100 text-blue-800' },
    { value: 'packaging', label: 'Packaging', icon: '📦', color: 'bg-purple-100 text-purple-800' },
    { value: 'storage', label: 'Storage', icon: '🏪', color: 'bg-gray-100 text-gray-800' },
    { value: 'transport', label: 'Transport', icon: '🚚', color: 'bg-orange-100 text-orange-800' },
    { value: 'collection', label: 'Collection', icon: '📋', color: 'bg-indigo-100 text-indigo-800' },
    { value: 'delivery', label: 'Delivery', icon: '📬', color: 'bg-pink-100 text-pink-800' },
    { value: 'quality-check', label: 'Quality Check', icon: '✅', color: 'bg-emerald-100 text-emerald-800' },
    { value: 'other', label: 'Other', icon: '📝', color: 'bg-slate-100 text-slate-800' }
  ];

  const mockVehicles: Vehicle[] = [
    { id: 'veh-001', plateNumber: 'TRK-001', type: 'Refrigerated Truck', capacity: 5000, status: 'available' },
    { id: 'veh-002', plateNumber: 'TRK-002', type: 'Standard Truck', capacity: 3000, status: 'on-route' },
    { id: 'veh-003', plateNumber: 'TRK-003', type: 'Van', capacity: 1500, status: 'available' },
    { id: 'veh-004', plateNumber: 'TRK-004', type: 'Flatbed', capacity: 4000, status: 'maintenance' }
  ];

  const mockDrivers: Driver[] = [
    { id: 'drv-001', name: 'John Smith', phone: '+27 83 123 4567', status: 'available' },
    { id: 'drv-002', name: 'Maria Garcia', phone: '+27 72 234 5678', status: 'on-route' },
    { id: 'drv-003', name: 'Thabo Mokoena', phone: '+27 61 345 6789', status: 'available' },
    { id: 'drv-004', name: 'Sarah Johnson', phone: '+27 74 456 7890', status: 'off-duty' }
  ];

  const selectedEventType = form.watch('type');
  const isTransportEvent = transportEventTypes.includes(selectedEventType);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setSelectedFiles(prev => [...prev, ...files]);
    form.setValue('photos', [...selectedFiles, ...files]);
  };

  const removeFile = (index: number) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
    form.setValue('photos', newFiles);
  };

  const onSubmit = async (data: EnhancedEventFormData) => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Event submitted:', data);
      return data;
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    form.reset();
    setSelectedFiles([]);
  };

  const getEventTypeConfig = (type: string) => {
    return eventTypeOptions.find(option => option.value === type) || eventTypeOptions[9];
  };

  return {
    form,
    isSubmitting,
    selectedFiles,
    transportEventTypes,
    cargoConditionOptions,
    eventTypeOptions,
    mockVehicles,
    mockDrivers,
    selectedEventType,
    isTransportEvent,
    handleFileChange,
    removeFile,
    onSubmit,
    resetForm,
    getEventTypeConfig
  };
}

export type { EnhancedEventFormData, Vehicle, Driver };
