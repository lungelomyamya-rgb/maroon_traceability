// src/components/packaging/PackagingEventForm.tsx
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Package, 
  Calendar, 
  MapPin, 
  User, 
  Camera, 
  CheckCircle,
  AlertTriangle,
  Plus,
  X,
  QrCode
} from 'lucide-react';
import type { 
  PackagingType, 
  PackagingRecord, 
  PackagingEvent,
  BatchStatus 
} from '@/types/packaging';
import { 
  PACKAGING_TYPES, 
  BATCH_STATUS_COLORS, 
  generateBatchCode,
  getUnitsForPackagingType 
} from '@/types/packaging';

const packagingEventSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  productName: z.string().min(1, 'Product name is required'),
  packagingType: z.enum(['cardboard-box', 'plastic-crate', 'wooden-crate', 'vacuum-sealed', 'bulk-bag', 'paper-bag', 'plastic-pouch', 'glass-jar', 'metal-can', 'custom']),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
  unitOfMeasure: z.string().min(1, 'Unit of measure is required'),
  location: z.string().min(1, 'Location is required'),
  operator: z.string().min(1, 'Operator name is required'),
  packagingDate: z.string().min(1, 'Packaging date is required'),
  notes: z.string().optional()
});

type PackagingEventFormData = z.infer<typeof packagingEventSchema>;

interface PackagingEventFormProps {
  onSubmit: (data: PackagingEventFormData & { photos: string[] }) => Promise<void>;
  initialData?: Partial<PackagingEventFormData>;
  existingRecord?: PackagingRecord;
}

export function PackagingEventForm({ 
  onSubmit, 
  initialData, 
  existingRecord 
}: PackagingEventFormProps) {
  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm<PackagingEventFormData>({
    resolver: zodResolver(packagingEventSchema),
    defaultValues: {
      packagingDate: new Date().toISOString().slice(0, 16),
      unitOfMeasure: 'pieces',
      ...initialData,
      ...existingRecord
    }
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [photos, setPhotos] = useState<string[]>([]);
  const [generatedBatchCode, setGeneratedBatchCode] = useState<string>('');
  const [showBatchCode, setShowBatchCode] = useState(false);

  const watchedPackagingType = watch('packagingType');
  const watchedLocation = watch('location');

  // Generate batch code when packaging type or location changes
  const handleGenerateBatchCode = () => {
    if (watchedPackagingType && watchedLocation) {
      const batchCode = generateBatchCode(watchedPackagingType, watchedLocation);
      setGeneratedBatchCode(batchCode);
      setShowBatchCode(true);
    }
  };

  // Update unit of measure when packaging type changes
  const handlePackagingTypeChange = (type: PackagingType) => {
    const units = getUnitsForPackagingType(type);
    if (units.length > 0) {
      setValue('unitOfMeasure', units[0]);
    }
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    Array.from(files).forEach((file, index) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const photoUrl = e.target?.result as string;
        setPhotos(prev => [...prev, photoUrl]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const handleFormSubmit = async (data: PackagingEventFormData) => {
    try {
      setIsSubmitting(true);
      await onSubmit({ ...data, photos });
    } catch (error) {
      console.error('Error submitting packaging event:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusColor = (status: BatchStatus) => {
    return BATCH_STATUS_COLORS[status];
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Package className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Packaging Event</h3>
              <p className="text-sm text-gray-500">Record packaging details and generate batch codes</p>
            </div>
          </div>
          {existingRecord && (
            <Badge className={getStatusColor(existingRecord.status)}>
              {existingRecord.status}
            </Badge>
          )}
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          {/* Product Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product ID
              </label>
              <Input
                {...register('productId')}
                placeholder="e.g., PRD-2024-001"
              />
              {errors.productId && (
                <p className="text-red-500 text-xs mt-1">{errors.productId.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Name
              </label>
              <Input
                {...register('productName')}
                placeholder="e.g., Organic Apples"
              />
              {errors.productName && (
                <p className="text-red-500 text-xs mt-1">{errors.productName.message}</p>
              )}
            </div>
          </div>

          {/* Packaging Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Package className="inline h-4 w-4 mr-1" />
                Packaging Type
              </label>
              <select
                {...register('packagingType')}
                onChange={(e) => {
                  const type = e.target.value as PackagingType;
                  handlePackagingTypeChange(type);
                }}
                className="w-full p-2 border border-gray-300 rounded-md focus:border-purple-500 focus:ring-purple-500"
              >
                <option value="">Select packaging type</option>
                {Object.entries(PACKAGING_TYPES).map(([key, type]) => (
                  <option key={key} value={key}>
                    {type.icon} {type.label}
                  </option>
                ))}
              </select>
              {errors.packagingType && (
                <p className="text-red-500 text-xs mt-1">{errors.packagingType.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quantity
              </label>
              <Input
                type="number"
                min="1"
                {...register('quantity', { valueAsNumber: true })}
                placeholder="e.g., 100"
              />
              {errors.quantity && (
                <p className="text-red-500 text-xs mt-1">{errors.quantity.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Unit of Measure
              </label>
              <select
                {...register('unitOfMeasure')}
                className="w-full p-2 border border-gray-300 rounded-md focus:border-purple-500 focus:ring-purple-500"
              >
                {watchedPackagingType && getUnitsForPackagingType(watchedPackagingType).map(unit => (
                  <option key={unit} value={unit}>{unit}</option>
                ))}
              </select>
              {errors.unitOfMeasure && (
                <p className="text-red-500 text-xs mt-1">{errors.unitOfMeasure.message}</p>
              )}
            </div>
          </div>

          {/* Batch Code Generation */}
          <div className="border-t pt-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-md font-semibold text-gray-900">Batch Code Generation</h4>
              <Button
                type="button"
                variant="outline"
                onClick={handleGenerateBatchCode}
                disabled={!watchedPackagingType || !watchedLocation}
                className="flex items-center gap-2"
              >
                <QrCode className="h-4 w-4" />
                Generate Batch Code
              </Button>
            </div>

            {showBatchCode && generatedBatchCode && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-900">Generated Batch Code:</p>
                    <p className="text-lg font-mono text-blue-800">{generatedBatchCode}</p>
                  </div>
                  <Badge className="bg-green-100 text-green-800">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Ready
                  </Badge>
                </div>
              </div>
            )}
          </div>

          {/* Location and Date */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <MapPin className="inline h-4 w-4 mr-1" />
                Packaging Location
              </label>
              <Input
                {...register('location')}
                placeholder="e.g., Packhouse 1, Stellenbosch"
              />
              {errors.location && (
                <p className="text-red-500 text-xs mt-1">{errors.location.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Calendar className="inline h-4 w-4 mr-1" />
                Packaging Date
              </label>
              <Input
                type="datetime-local"
                {...register('packagingDate')}
              />
              {errors.packagingDate && (
                <p className="text-red-500 text-xs mt-1">{errors.packagingDate.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <User className="inline h-4 w-4 mr-1" />
                Operator Name
              </label>
              <Input
                {...register('operator')}
                placeholder="e.g., John Smith"
              />
              {errors.operator && (
                <p className="text-red-500 text-xs mt-1">{errors.operator.message}</p>
              )}
            </div>
          </div>

          {/* Photo Upload */}
          <div className="border-t pt-6">
            <h4 className="text-md font-semibold text-gray-900 mb-4">Visual Evidence</h4>
            
            <div className="space-y-4">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
                id="photo-upload"
              />
              
              <label
                htmlFor="photo-upload"
                className="flex items-center justify-center gap-2 w-full p-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-purple-500 hover:bg-purple-50"
              >
                <Camera className="h-5 w-5 text-gray-400" />
                <span className="text-sm text-gray-600">Upload packaging photos</span>
              </label>

              {photos.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {photos.map((photo, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={photo}
                        alt={`Packaging photo ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removePhoto(index)}
                          className="text-white hover:text-red-300"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Notes */}
          <div className="border-t pt-6">
            <h4 className="text-md font-semibold text-gray-900 mb-4">Additional Notes</h4>
            <Textarea
              {...register('notes')}
              rows={4}
              placeholder="Enter any additional observations or notes about the packaging process..."
            />
          </div>

          {/* Submit */}
          <div className="flex justify-end gap-3 pt-6 border-t">
            <Button type="button" variant="outline">
              Save as Draft
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Record Packaging Event'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
