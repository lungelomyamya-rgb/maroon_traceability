// src/components/inspector/qualityInspection/InspectionForm.tsx
'use client';

import { 
  Droplets, 
  Scale, 
  Palette, 
  Hand,
  Cookie,
  Thermometer,
  Bug,
  Camera,
  Upload,
  Plus,
  X,
} from 'lucide-react';

import { Badge } from '@/src/features/shared/ui/badge';
import { Button } from '@/src/features/shared/ui/button';
import { Card } from '@/src/features/shared/ui/card';
import { Input } from '@/src/features/shared/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/src/features/shared/ui/select';
import { Textarea } from '@/src/features/shared/ui/textarea';
import type { InspectionPhoto } from '@/types/inspector';

import type { QualityInspectionFormData } from './hooks/useQualityInspection';

/* eslint-disable @typescript-eslint/no-explicit-any */
interface InspectionFormProps {
  register: any;
  errors: any;
  watchedValues: Partial<QualityInspectionFormData>;
  photos: InspectionPhoto[];
  newDefect: string;
  newRecommendation: string;
  fileInputRef: any;
  onAddDefect: () => void;
  onRemoveDefect: (defect: string) => void;
  onAddRecommendation: () => void;
  onRemoveRecommendation: (recommendation: string) => void;
  onPhotoUpload: (files: FileList | null) => void;
  onRemovePhoto: (photoId: string) => void;
  setNewDefect: (value: string) => void;
  setNewRecommendation: (value: string) => void;
  getDefectSeverity: (defect: string) => 'low' | 'medium' | 'high';
}

export function InspectionForm({
  register,
  errors,
  watchedValues,
  photos,
  newDefect,
  newRecommendation,
  fileInputRef,
  onAddDefect,
  onRemoveDefect,
  onAddRecommendation,
  onRemoveRecommendation,
  onPhotoUpload,
  onRemovePhoto,
  setNewDefect,
  setNewRecommendation,
  getDefectSeverity,
}: InspectionFormProps) {
  const getDefectSeverityColor = (severity: 'low' | 'medium' | 'high') => {
    switch (severity) {
    case 'low': return 'bg-yellow-100 text-yellow-800';
    case 'medium': return 'bg-orange-100 text-orange-800';
    case 'high': return 'bg-red-100 text-red-800';
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        {/* Basic Information */}
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
              Batch ID (Optional)
            </label>
            <Input
              {...register('batchId')}
              placeholder="e.g., BATCH-2024-001"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <Input
              {...register('location')}
              placeholder="e.g., Packhouse A, Stellenbosch"
            />
            {errors.location && (
              <p className="text-red-500 text-xs mt-1">{errors.location.message}</p>
            )}
          </div>
        </div>

        {/* Quality Metrics */}
        <div className="border-t pt-6">
          <h4 className="text-md font-semibold text-gray-900 mb-4">Quality Metrics</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Moisture Content */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Droplets className="inline h-4 w-4 mr-1" />
                Moisture Content (%)
              </label>
              <Input
                type="number"
                step="0.1"
                min="0"
                max="100"
                {...register('moistureContent', { valueAsNumber: true })}
                placeholder="e.g., 12.5"
              />
              {errors.moistureContent && (
                <p className="text-red-500 text-xs mt-1">{errors.moistureContent.message}</p>
              )}
            </div>

            {/* Size */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Scale className="inline h-4 w-4 mr-1" />
                Size
              </label>
              <Select onValueChange={(value) => register('size').onChange({ target: { value } })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Large">Large</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Small">Small</SelectItem>
                  <SelectItem value="Mixed">Mixed</SelectItem>
                  <SelectItem value="Irregular">Irregular</SelectItem>
                </SelectContent>
              </Select>
              {errors.size && (
                <p className="text-red-500 text-xs mt-1">{errors.size.message}</p>
              )}
            </div>

            {/* Color */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Palette className="inline h-4 w-4 mr-1" />
                Color Assessment
              </label>
              <Input
                {...register('color')}
                placeholder="e.g., Deep Red, Pinkish"
              />
              {errors.color && (
                <p className="text-red-500 text-xs mt-1">{errors.color.message}</p>
              )}
            </div>

            {/* Firmness */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Hand className="inline h-4 w-4 mr-1" />
                Firmness (1-10)
              </label>
              <Input
                type="number"
                min="1"
                max="10"
                step="0.1"
                {...register('firmness', { valueAsNumber: true })}
                placeholder="e.g., 7.5"
              />
              {errors.firmness && (
                <p className="text-red-500 text-xs mt-1">{errors.firmness.message}</p>
              )}
            </div>

            {/* Sugar Content */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Cookie className="inline h-4 w-4 mr-1" />
                Sugar Content (Brix %)
              </label>
              <Input
                type="number"
                step="0.1"
                min="0"
                max="30"
                {...register('sugarContent', { valueAsNumber: true })}
                placeholder="e.g., 12.0"
              />
              {errors.sugarContent && (
                <p className="text-red-500 text-xs mt-1">{errors.sugarContent.message}</p>
              )}
            </div>

            {/* Weight */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Scale className="inline h-4 w-4 mr-1" />
                Weight (g)
              </label>
              <Input
                type="number"
                min="0"
                {...register('weight', { valueAsNumber: true })}
                placeholder="e.g., 250"
              />
              {errors.weight && (
                <p className="text-red-500 text-xs mt-1">{errors.weight.message}</p>
              )}
            </div>

            {/* Temperature */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Thermometer className="inline h-4 w-4 mr-1" />
                Temperature (°C)
              </label>
              <Input
                type="number"
                step="0.1"
                min="-10"
                max="50"
                {...register('temperature', { valueAsNumber: true })}
                placeholder="e.g., 4.5"
              />
              {errors.temperature && (
                <p className="text-red-500 text-xs mt-1">{errors.temperature.message}</p>
              )}
            </div>

            {/* Pesticide Residue */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Bug className="inline h-4 w-4 mr-1" />
                Pesticide Residue (mg/kg)
              </label>
              <Input
                type="number"
                step="0.001"
                min="0"
                {...register('pesticideResidue', { valueAsNumber: true })}
                placeholder="e.g., 0.05"
              />
              {errors.pesticideResidue && (
                <p className="text-red-500 text-xs mt-1">{errors.pesticideResidue.message}</p>
              )}
            </div>

            {/* Microbial Count */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Bug className="inline h-4 w-4 mr-1" />
                Microbial Count (CFU/g)
              </label>
              <Input
                type="number"
                min="0"
                {...register('microbialCount', { valueAsNumber: true })}
                placeholder="e.g., 1000"
              />
              {errors.microbialCount && (
                <p className="text-red-500 text-xs mt-1">{errors.microbialCount.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Photo Upload */}
        <div className="border-t pt-6">
          <h4 className="text-md font-semibold text-gray-900 mb-4">Inspection Photos</h4>
          
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={(e) => onPhotoUpload(e.target.files)}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
              >
                <Camera className="h-4 w-4 mr-2" />
                <Upload className="h-4 w-4 mr-2" />
                Upload Photos
              </Button>
            </div>

            {photos.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {photos.map((photo) => (
                  <div key={photo.id} className="relative group">
                    <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                      <img
                        src={photo.url}
                        alt={photo.caption}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="absolute top-2 right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity text-red-600 hover:text-red-800"
                      onClick={() => onRemovePhoto(photo.id)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                    <p className="text-xs text-gray-500 mt-1 truncate">{photo.caption}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Defects */}
        <div className="border-t pt-6">
          <h4 className="text-md font-semibold text-gray-900 mb-4">Defects Found</h4>
          
          <div className="space-y-3">
            <div className="flex gap-2">
              <Input
                value={newDefect}
                onChange={(e) => setNewDefect(e.target.value)}
                placeholder="Add defect..."
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), onAddDefect())}
              />
              <Button type="button" onClick={onAddDefect} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {(watchedValues.defects || []).length > 0 && (
              <div className="flex flex-wrap gap-2">
                {(watchedValues.defects || []).map((defect, index) => {
                  const severity = getDefectSeverity(defect);
                  return (
                    <Badge
                      key={index}
                      className={`${getDefectSeverityColor(severity)} flex items-center gap-1`}
                    >
                      {defect}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-3 w-3 p-0 hover:bg-transparent"
                        onClick={() => onRemoveDefect(defect)}
                      >
                        <X className="h-2 w-2" />
                      </Button>
                    </Badge>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Recommendations */}
        <div className="border-t pt-6">
          <h4 className="text-md font-semibold text-gray-900 mb-4">Recommendations</h4>
          
          <div className="space-y-3">
            <div className="flex gap-2">
              <Input
                value={newRecommendation}
                onChange={(e) => setNewRecommendation(e.target.value)}
                placeholder="Add recommendation..."
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), onAddRecommendation())}
              />
              <Button type="button" onClick={onAddRecommendation} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {(watchedValues.recommendations || []).length > 0 && (
              <div className="space-y-2">
                {(watchedValues.recommendations || []).map((rec, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm">{rec}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => onRemoveRecommendation(rec)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
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
            placeholder="Add any additional observations or notes..."
            rows={3}
          />
        </div>
      </div>
    </Card>
  );
}
