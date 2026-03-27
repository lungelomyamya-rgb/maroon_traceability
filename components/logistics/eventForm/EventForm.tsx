// src/components/logistics/eventForm/EventForm.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, X, Camera, FileText } from 'lucide-react';
import { EventTypeSelector } from './EventTypeSelector';
import { FormFields } from './FormFields';
import { ValidationDisplay } from './ValidationDisplay';
import { useEventForm, type EnhancedEventFormData } from './hooks/useEventForm';

interface EventFormProps {
  productId: string;
  onSubmit: (data: EnhancedEventFormData) => Promise<void>;
  initialData?: Partial<EnhancedEventFormData>;
}

export function EventForm({ productId, onSubmit, initialData }: EventFormProps) {
  const {
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
    onSubmit: handleSubmit,
    resetForm,
    getEventTypeConfig
  } = useEventForm(initialData);

  const onFormSubmit = async (data: EnhancedEventFormData) => {
    try {
      await onSubmit(data);
      resetForm();
    } catch (error) {
      console.error('Submit error:', error);
    }
  };

  const eventTypeConfig = getEventTypeConfig(selectedEventType);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card className="p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Logistics Event Form</h2>
          <p className="text-gray-600 mt-1">Record a logistics event for product: {productId}</p>
        </div>

        <form onSubmit={form.handleSubmit(onFormSubmit)} className="space-y-6">
          {/* Event Type Selector */}
          <EventTypeSelector
            options={eventTypeOptions}
            selectedType={selectedEventType}
            onSelect={(type) => form.setValue('type', type as any)}
          />

          {/* Form Fields */}
          <FormFields
            form={form}
            isTransportEvent={isTransportEvent}
            vehicles={mockVehicles}
            drivers={mockDrivers}
            cargoConditionOptions={cargoConditionOptions}
          />

          {/* Photo Upload */}
          <Card className="p-4">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Camera className="h-4 w-4" />
              Photo Evidence
            </h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="photos" className="text-sm font-medium text-gray-700">
                  Upload Photos
                </Label>
                <div className="mt-2">
                  <Input
                    id="photos"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileChange}
                    className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                </div>
              </div>

              {/* Selected Files */}
              {selectedFiles.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Selected Files</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {selectedFiles.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center gap-2 truncate">
                          <FileText className="h-4 w-4 text-gray-400 flex-shrink-0" />
                          <span className="text-sm truncate">{file.name}</span>
                          <span className="text-xs text-gray-500">
                            ({(file.size / 1024 / 1024).toFixed(2)} MB)
                          </span>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(index)}
                          className="flex-shrink-0"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Upload Instructions */}
              <div className="text-xs text-gray-500">
                <div className="flex items-center gap-2 mb-1">
                  <Upload className="h-3 w-3" />
                  <span>Upload photos to document the event</span>
                </div>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Supported formats: JPG, PNG, GIF</li>
                  <li>Maximum file size: 10MB per file</li>
                  <li>Multiple files can be uploaded</li>
                </ul>
              </div>
            </div>
          </Card>

          {/* Validation Display */}
          <ValidationDisplay form={form} isSubmitting={isSubmitting} />

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-6 border-t">
            <Button type="button" variant="outline" onClick={resetForm}>
              Reset Form
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting || !form.formState.isValid}
              className="min-w-32"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                  Submitting...
                </>
              ) : (
                <>
                  {eventTypeConfig.icon} Submit Event
                </>
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
