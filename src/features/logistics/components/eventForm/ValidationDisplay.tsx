// src/components/logistics/eventForm/ValidationDisplay.tsx
'use client';

import { AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { UseFormReturn } from 'react-hook-form';
import { EnhancedEventFormData } from './hooks/useEventForm';

interface ValidationDisplayProps {
  form: UseFormReturn<EnhancedEventFormData>;
  isSubmitting: boolean;
}

export function ValidationDisplay({ form, isSubmitting }: ValidationDisplayProps) {
  const errors = form.formState.errors;
  const isDirty = form.formState.isDirty;
  const isValid = form.formState.isValid;

  const getValidationStatus = () => {
    if (!isDirty) return { status: 'info', message: 'Fill in the form to see validation status' };
    if (isSubmitting) return { status: 'info', message: 'Submitting...' };
    if (Object.keys(errors).length > 0) return { status: 'error', message: 'Please fix the errors below' };
    if (isValid) return { status: 'success', message: 'Form is ready to submit' };
    return { status: 'warning', message: 'Please complete all required fields' };
  };

  const validationStatus = getValidationStatus();

  const renderValidationIcon = () => {
    switch (validationStatus.status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      default:
        return <Info className="h-4 w-4 text-blue-600" />;
    }
  };

  const getValidationColor = () => {
    switch (validationStatus.status) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      default:
        return 'bg-blue-50 border-blue-200 text-blue-800';
    }
  };

  const getFieldErrors = () => {
    const fieldErrors: { field: string; message: string }[] = [];
    
    Object.entries(errors).forEach(([field, error]) => {
      fieldErrors.push({
        field: field.charAt(0).toUpperCase() + field.slice(1),
        message: error.message as string
      });
    });

    return fieldErrors;
  };

  const getRequiredFields = () => {
    const formData = form.getValues();
    const required: { field: string; filled: boolean }[] = [
      { field: 'Type', filled: !!formData.type },
      { field: 'Timestamp', filled: !!formData.timestamp },
    ];

    if (['collection', 'transport', 'delivery'].includes(formData.type)) {
      required.push(
        { field: 'Vehicle', filled: !!formData.vehicleId },
        { field: 'Driver', filled: !!formData.driverId }
      );
    }

    return required;
  };

  return (
    <div className="space-y-4">
      {/* Overall Validation Status */}
      <Card className={`p-4 border ${getValidationColor()}`}>
        <div className="flex items-center gap-3">
          {renderValidationIcon()}
          <div>
            <h4 className="font-medium">Validation Status</h4>
            <p className="text-sm opacity-90">{validationStatus.message}</p>
          </div>
        </div>
      </Card>

      {/* Required Fields */}
      <Card className="p-4">
        <h4 className="font-medium text-gray-900 mb-3">Required Fields</h4>
        <div className="space-y-2">
          {getRequiredFields().map((field) => (
            <div key={field.field} className="flex items-center justify-between">
              <span className="text-sm text-gray-600">{field.field}</span>
              <Badge 
                variant={field.filled ? "default" : "secondary"}
                className={field.filled ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"}
              >
                {field.filled ? "✓ Complete" : "○ Required"}
              </Badge>
            </div>
          ))}
        </div>
      </Card>

      {/* Field Errors */}
      {Object.keys(errors).length > 0 && (
        <Card className="p-4 border-red-200 bg-red-50">
          <h4 className="font-medium text-red-800 mb-3 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Form Errors
          </h4>
          <div className="space-y-2">
            {getFieldErrors().map((error, index) => (
              <div key={index} className="text-sm text-red-700">
                <span className="font-medium">{error.field}:</span> {error.message}
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Form Summary */}
      <Card className="p-4">
        <h4 className="font-medium text-gray-900 mb-3">Form Summary</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Fields filled:</span>
            <span className="ml-2 font-medium">
              {Object.values(form.getValues()).filter(value => 
                value !== undefined && value !== '' && 
                !(Array.isArray(value) && value.length === 0)
              ).length} / {Object.keys(form.getValues()).length}
            </span>
          </div>
          <div>
            <span className="text-gray-600">Form status:</span>
            <span className="ml-2 font-medium">
              {isValid ? "Valid" : "Invalid"}
            </span>
          </div>
          <div>
            <span className="text-gray-600">Dirty:</span>
            <span className="ml-2 font-medium">
              {isDirty ? "Yes" : "No"}
            </span>
          </div>
          <div>
            <span className="text-gray-600">Submitting:</span>
            <span className="ml-2 font-medium">
              {isSubmitting ? "Yes" : "No"}
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
}
