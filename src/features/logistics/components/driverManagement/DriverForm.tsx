// src/components/logistics/driverManagement/DriverForm.tsx
'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { X, Plus, User } from 'lucide-react';
import { NewDriver } from './hooks/useDriverManagement';

interface DriverFormProps {
  driver?: NewDriver;
  certificationOptions: string[];
  onSubmit: (driverData: NewDriver) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function DriverForm({ 
  driver, 
  certificationOptions, 
  onSubmit, 
  onCancel, 
  isLoading = false 
}: DriverFormProps) {
  const [formData, setFormData] = useState<NewDriver>(
    driver || {
      name: '',
      phone: '',
      email: '',
      licenseNumber: '',
      licenseExpiry: '',
      certifications: [],
      experience: 0,
      rating: 5
    }
  );

  const [newCertification, setNewCertification] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleInputChange = (field: keyof NewDriver, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addCertification = () => {
    if (newCertification.trim() && !formData.certifications.includes(newCertification.trim())) {
      setFormData(prev => ({
        ...prev,
        certifications: [...prev.certifications, newCertification.trim()]
      }));
      setNewCertification('');
    }
  };

  const removeCertification = (certification: string) => {
    setFormData(prev => ({
      ...prev,
      certifications: prev.certifications.filter(cert => cert !== certification)
    }));
  };

  return (
    <Card className="p-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          {driver ? 'Edit Driver' : 'Add New Driver'}
        </h3>
        <Button variant="ghost" size="sm" onClick={onCancel}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <Input
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Enter driver's full name"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <Input
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              placeholder="+27 12 345 6789"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="driver@example.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Years of Experience
            </label>
            <Input
              type="number"
              min="0"
              max="50"
              value={formData.experience}
              onChange={(e) => handleInputChange('experience', parseInt(e.target.value) || 0)}
              placeholder="0"
              required
            />
          </div>
        </div>

        {/* License Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              License Number
            </label>
            <Input
              value={formData.licenseNumber}
              onChange={(e) => handleInputChange('licenseNumber', e.target.value)}
              placeholder="DL123456789"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              License Expiry Date
            </label>
            <Input
              type="date"
              value={formData.licenseExpiry}
              onChange={(e) => handleInputChange('licenseExpiry', e.target.value)}
              required
            />
          </div>
        </div>

        {/* Rating */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Initial Rating (1-5)
          </label>
          <Input
            type="number"
            min="1"
            max="5"
            step="0.1"
            value={formData.rating}
            onChange={(e) => handleInputChange('rating', parseFloat(e.target.value) || 5)}
            placeholder="5.0"
          />
        </div>

        {/* Certifications */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Certifications
          </label>
          <div className="space-y-3">
            {/* Add Certification */}
            <div className="flex gap-2">
              <Input
                value={newCertification}
                onChange={(e) => setNewCertification(e.target.value)}
                placeholder="Add certification or select from options"
                list="certifications"
              />
              <datalist id="certifications">
                {certificationOptions.map(option => (
                  <option key={option} value={option} />
                ))}
              </datalist>
              <Button type="button" onClick={addCertification} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {/* Selected Certifications */}
            {formData.certifications.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.certifications.map((certification) => (
                  <Badge key={certification} variant="secondary" className="flex items-center gap-1">
                    {certification}
                    <button
                      type="button"
                      onClick={() => removeCertification(certification)}
                      className="ml-1 hover:text-red-600"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}

            {/* Quick Add Options */}
            <div className="text-xs text-gray-500">
              Quick add: {certificationOptions.slice(0, 3).join(', ')}...
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" type="button" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Saving...' : driver ? 'Update Driver' : 'Add Driver'}
          </Button>
        </div>
      </form>
    </Card>
  );
}
