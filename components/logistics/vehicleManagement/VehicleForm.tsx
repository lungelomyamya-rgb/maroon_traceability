// src/components/logistics/vehicleManagement/VehicleForm.tsx
'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, Truck, Calendar, Fuel } from 'lucide-react';
import { Vehicle, NewVehicle } from './hooks/useVehicleManagement';

interface VehicleFormProps {
  vehicle?: Vehicle;
  vehicleTypes: { value: string; label: string }[];
  vehicleFeatures: string[];
  onSubmit: (vehicleData: NewVehicle) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function VehicleForm({ 
  vehicle, 
  vehicleTypes, 
  vehicleFeatures, 
  onSubmit, 
  onCancel, 
  isLoading = false 
}: VehicleFormProps) {
  const [formData, setFormData] = useState<NewVehicle>({
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

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (vehicle) {
      setFormData({
        registrationNumber: vehicle.registrationNumber,
        make: vehicle.make,
        model: vehicle.model,
        year: vehicle.year,
        type: vehicle.type,
        capacity: vehicle.capacity,
        features: vehicle.features,
        insuranceExpiry: vehicle.insuranceExpiry,
        registrationExpiry: vehicle.registrationExpiry
      });
    }
  }, [vehicle]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.registrationNumber.trim()) {
      newErrors.registrationNumber = 'Registration number is required';
    }
    if (!formData.make.trim()) {
      newErrors.make = 'Make is required';
    }
    if (!formData.model.trim()) {
      newErrors.model = 'Model is required';
    }
    if (!formData.capacity.trim()) {
      newErrors.capacity = 'Capacity is required';
    }
    if (!formData.insuranceExpiry) {
      newErrors.insuranceExpiry = 'Insurance expiry date is required';
    }
    if (!formData.registrationExpiry) {
      newErrors.registrationExpiry = 'Registration expiry date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleInputChange = (field: keyof NewVehicle, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleFeatureToggle = (feature: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      features: checked 
        ? [...prev.features, feature]
        : prev.features.filter(f => f !== feature)
    }));
  };

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 10 }, (_, i) => currentYear - i);

  return (
    <Card className="p-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Truck className="h-6 w-6 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            {vehicle ? 'Edit Vehicle' : 'Add New Vehicle'}
          </h3>
        </div>
        <Button variant="ghost" size="sm" onClick={onCancel}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Basic Information</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="registrationNumber">Registration Number</Label>
              <Input
                id="registrationNumber"
                value={formData.registrationNumber}
                onChange={(e) => handleInputChange('registrationNumber', e.target.value)}
                placeholder="e.g., TRK-001"
                className={errors.registrationNumber ? 'border-red-500' : ''}
              />
              {errors.registrationNumber && (
                <p className="text-sm text-red-500 mt-1">{errors.registrationNumber}</p>
              )}
            </div>
            <div>
              <Label htmlFor="make">Make</Label>
              <Input
                id="make"
                value={formData.make}
                onChange={(e) => handleInputChange('make', e.target.value)}
                placeholder="e.g., Mercedes-Benz"
                className={errors.make ? 'border-red-500' : ''}
              />
              {errors.make && (
                <p className="text-sm text-red-500 mt-1">{errors.make}</p>
              )}
            </div>
            <div>
              <Label htmlFor="model">Model</Label>
              <Input
                id="model"
                value={formData.model}
                onChange={(e) => handleInputChange('model', e.target.value)}
                placeholder="e.g., Actros"
                className={errors.model ? 'border-red-500' : ''}
              />
              {errors.model && (
                <p className="text-sm text-red-500 mt-1">{errors.model}</p>
              )}
            </div>
            <div>
              <Label htmlFor="year">Year</Label>
              <Select value={formData.year.toString()} onValueChange={(value) => handleInputChange('year', parseInt(value))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {yearOptions.map(year => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Vehicle Type and Capacity */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Vehicle Specifications</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="type">Vehicle Type</Label>
              <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {vehicleTypes.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="capacity">Capacity</Label>
              <Input
                id="capacity"
                value={formData.capacity}
                onChange={(e) => handleInputChange('capacity', e.target.value)}
                placeholder="e.g., 20 tons"
                className={errors.capacity ? 'border-red-500' : ''}
              />
              {errors.capacity && (
                <p className="text-sm text-red-500 mt-1">{errors.capacity}</p>
              )}
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Vehicle Features</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {vehicleFeatures.map(feature => (
              <Button
                key={feature}
                type="button"
                variant={formData.features.includes(feature) ? "default" : "outline"}
                size="sm"
                onClick={() => handleFeatureToggle(feature, !formData.features.includes(feature))}
                className="justify-start"
              >
                {formData.features.includes(feature) ? '✓ ' : ''}{feature}
              </Button>
            ))}
          </div>
        </div>

        {/* Expiry Dates */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Expiry Information</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="insuranceExpiry" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Insurance Expiry Date
              </Label>
              <Input
                id="insuranceExpiry"
                type="date"
                value={formData.insuranceExpiry}
                onChange={(e) => handleInputChange('insuranceExpiry', e.target.value)}
                className={errors.insuranceExpiry ? 'border-red-500' : ''}
              />
              {errors.insuranceExpiry && (
                <p className="text-sm text-red-500 mt-1">{errors.insuranceExpiry}</p>
              )}
            </div>
            <div>
              <Label htmlFor="registrationExpiry" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Registration Expiry Date
              </Label>
              <Input
                id="registrationExpiry"
                type="date"
                value={formData.registrationExpiry}
                onChange={(e) => handleInputChange('registrationExpiry', e.target.value)}
                className={errors.registrationExpiry ? 'border-red-500' : ''}
              />
              {errors.registrationExpiry && (
                <p className="text-sm text-red-500 mt-1">{errors.registrationExpiry}</p>
              )}
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Saving...' : (vehicle ? 'Update Vehicle' : 'Add Vehicle')}
          </Button>
        </div>
      </form>
    </Card>
  );
}
