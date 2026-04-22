'use client';

import { Calendar, MapPin, Users, Package, AlertTriangle } from 'lucide-react';
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { TransportSchedule, TransportStatus } from '@/types/logistics';

interface EventFormProps {
  className?: string;
  onSubmit?: (event: Partial<TransportSchedule>) => void;
}

export function EventForm({ className, onSubmit }: EventFormProps) {
  const [formData, setFormData] = useState<Partial<TransportSchedule>>({
    status: 'scheduled',
    priority: 'medium',
    cargoDetails: {
      weight: 0,
      volume: 0,
      temperatureRequirements: '',
      specialHandling: [],
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      onSubmit?.(formData);

      // Reset form
      setFormData({
        status: 'scheduled',
        priority: 'medium',
        cargoDetails: {
          weight: 0,
          volume: 0,
          temperatureRequirements: '',
          specialHandling: [],
        },
      });
    } catch (_error) {
      // TODO: Handle error submitting event
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: unknown) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCargoChange = (field: string, value: unknown) => {
    setFormData(prev => ({
      ...prev,
      cargoDetails: {
        weight: prev.cargoDetails?.weight || 0,
        volume: prev.cargoDetails?.volume || 0,
        temperatureRequirements: prev.cargoDetails?.temperatureRequirements || '',
        specialHandling: prev.cargoDetails?.specialHandling || [],
        ...prev.cargoDetails,
        [field]: value,
      },
    }));
  };

  const getStatusColor = (status: TransportStatus) => {
    switch (status) {
    case 'scheduled': return 'bg-blue-100 text-blue-800';
    case 'in-transit': return 'bg-yellow-100 text-yellow-800';
    case 'delivered': return 'bg-green-100 text-green-800';
    case 'delayed': return 'bg-red-100 text-red-800';
    case 'cancelled': return 'bg-gray-100 text-gray-800';
    default: return 'bg-gray-100 text-gray-800';
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const getPriorityColor = (priority: string) => {
    switch (priority) {
    case 'urgent': return 'bg-red-100 text-red-800';
    case 'high': return 'bg-orange-100 text-orange-800';
    case 'medium': return 'bg-yellow-100 text-yellow-800';
    case 'low': return 'bg-green-100 text-green-800';
    default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Create Transport Event</h2>
          <p className="text-gray-600">Schedule and manage transport logistics</p>
        </div>
        <Badge className={getStatusColor(formData.status || 'scheduled')}>
          {formData.status?.replace('-', ' ') || 'Scheduled'}
        </Badge>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="w-5 h-5" />
                <span>Basic Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Event ID
                </label>
                <Input
                  placeholder="Auto-generated"
                  value={formData.id || ''}
                  onChange={(e) => handleInputChange('id', e.target.value)}
                  disabled
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Scheduled Date
                </label>
                <Input
                  type="datetime-local"
                  value={formData.scheduledDate || ''}
                  onChange={(e) => handleInputChange('scheduledDate', e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estimated Duration (minutes)
                </label>
                <Input
                  type="number"
                  placeholder="120"
                  value={formData.estimatedDuration || ''}
                  onChange={(e) => handleInputChange('estimatedDuration', parseInt(e.target.value))}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Priority
                </label>
                <Select value={formData.priority} onValueChange={(value) => handleInputChange('priority', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Assignment */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="w-5 h-5" />
                <span>Assignment</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Vehicle
                </label>
                <Select value={formData.vehicleId} onValueChange={(value) => handleInputChange('vehicleId', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select vehicle" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vehicle-001">CA 123456 - Mercedes Actros</SelectItem>
                    <SelectItem value="vehicle-002">GP 789012 - Volvo FH16</SelectItem>
                    <SelectItem value="vehicle-003">JHB 345678 - Iveco Daily</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Driver
                </label>
                <Select value={formData.driverId} onValueChange={(value) => handleInputChange('driverId', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select driver" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="driver-001">John Smith</SelectItem>
                    <SelectItem value="driver-002">Maria Rodriguez</SelectItem>
                    <SelectItem value="driver-003">Thabo Mbeki</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product
                </label>
                <Select value={formData.productId} onValueChange={(value) => handleInputChange('productId', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select product" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="product-001">Organic Tomatoes</SelectItem>
                    <SelectItem value="product-002">Free Range Eggs</SelectItem>
                    <SelectItem value="product-003">Grass-fed Beef</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Route Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MapPin className="w-5 h-5" />
              <span>Route Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Origin Name
                </label>
                <Input
                  placeholder="Farm location"
                  value={formData.route?.origin?.name || ''}
                  onChange={(e) => handleInputChange('route', {
                    ...formData.route,
                    origin: { ...formData.route?.origin, name: e.target.value },
                  })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Origin Address
                </label>
                <Input
                  placeholder="123 Farm Road, Cape Town"
                  value={formData.route?.origin?.address || ''}
                  onChange={(e) => handleInputChange('route', {
                    ...formData.route,
                    origin: { ...formData.route?.origin, address: e.target.value },
                  })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Destination Name
                </label>
                <Input
                  placeholder="Distribution center"
                  value={formData.route?.destination?.name || ''}
                  onChange={(e) => handleInputChange('route', {
                    ...formData.route,
                    destination: { ...formData.route?.destination, name: e.target.value },
                  })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Destination Address
                </label>
                <Input
                  placeholder="456 Market Street, Johannesburg"
                  value={formData.route?.destination?.address || ''}
                  onChange={(e) => handleInputChange('route', {
                    ...formData.route,
                    destination: { ...formData.route?.destination, address: e.target.value },
                  })}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cargo Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Package className="w-5 h-5" />
              <span>Cargo Details</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Weight (kg)
                </label>
                <Input
                  type="number"
                  placeholder="5000"
                  value={formData.cargoDetails?.weight || ''}
                  onChange={(e) => handleCargoChange('weight', parseFloat(e.target.value))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Volume (m³)
                </label>
                <Input
                  type="number"
                  placeholder="10"
                  value={formData.cargoDetails?.volume || ''}
                  onChange={(e) => handleCargoChange('volume', parseFloat(e.target.value))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Temperature Requirements
                </label>
                <Select value={formData.cargoDetails?.temperatureRequirements} onValueChange={(value) => handleCargoChange('temperatureRequirements', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select temperature" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ambient">Ambient</SelectItem>
                    <SelectItem value="refrigerated">Refrigerated (2-8°C)</SelectItem>
                    <SelectItem value="frozen">Frozen (-18°C)</SelectItem>
                    <SelectItem value="deep-frozen">Deep Frozen (-25°C)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5" />
              <span>Additional Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes
              </label>
              <Textarea
                placeholder="Add any special instructions or notes..."
                value={formData.notes || ''}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline">
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Creating...' : 'Create Event'}
          </Button>
        </div>
      </form>
    </div>
  );
}
