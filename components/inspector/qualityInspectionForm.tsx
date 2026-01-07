// src/components/inspector/qualityInspectionForm.tsx
'use client';

import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Camera, 
  Upload, 
  CheckCircle, 
  AlertTriangle, 
  Droplets, 
  Scale, 
  Palette, 
  Hand,
  Cookie,
  Thermometer,
  Bug,
  X,
  Plus,
  Eye,
  Download
} from 'lucide-react';
import { 
  QualityMetrics, 
  Grade, 
  InspectionPhoto, 
  DEFECT_TYPES, 
  INSPECTION_CATEGORIES,
  GRADE_CRITERIA 
} from '@/types/inspector';

const qualityInspectionSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  batchId: z.string().optional(),
  location: z.string().min(1, 'Location is required'),
  moistureContent: z.number().min(0).max(100),
  size: z.enum(['Large', 'Medium', 'Small', 'Mixed', 'Irregular']),
  color: z.string().min(1, 'Color assessment is required'),
  firmness: z.number().min(1).max(10),
  sugarContent: z.number().min(0).max(30),
  weight: z.number().min(0),
  temperature: z.number().min(-10).max(50),
  pesticideResidue: z.number().min(0),
  microbialCount: z.number().min(0),
  defects: z.array(z.string()),
  notes: z.string().optional(),
  recommendations: z.array(z.string()).optional()
});

type QualityInspectionFormData = z.infer<typeof qualityInspectionSchema>;

interface QualityInspectionFormProps {
  productId: string;
  onSubmit: (data: QualityInspectionFormData & { photos: InspectionPhoto[] }) => Promise<void>;
  initialData?: Partial<QualityInspectionFormData>;
}

export function QualityInspectionForm({ 
  productId, 
  onSubmit, 
  initialData 
}: QualityInspectionFormProps) {
  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm<QualityInspectionFormData>({
    resolver: zodResolver(qualityInspectionSchema),
    defaultValues: {
      productId,
      defects: [],
      recommendations: [],
      ...initialData
    }
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [photos, setPhotos] = useState<InspectionPhoto[]>([]);
  const [newDefect, setNewDefect] = useState('');
  const [newRecommendation, setNewRecommendation] = useState('');
  const [suggestedGrade, setSuggestedGrade] = useState<Grade | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const watchedValues = watch();
  
  // Auto-calculate grade based on metrics
  const calculateGrade = (metrics: Partial<QualityInspectionFormData>): Grade => {
    for (const [grade, criteria] of Object.entries(GRADE_CRITERIA)) {
      if (
        metrics.moistureContent !== undefined &&
        metrics.moistureContent >= criteria.moistureMin &&
        metrics.moistureContent <= criteria.moistureMax &&
        criteria.sizeRange.includes(metrics.size || '') &&
        metrics.firmness !== undefined &&
        metrics.firmness >= criteria.firmnessMin &&
        metrics.sugarContent !== undefined &&
        metrics.sugarContent >= criteria.sugarContentMin &&
        (metrics.defects?.length || 0) <= criteria.maxDefects
      ) {
        return grade as Grade;
      }
    }
    return 'F'; // Default to lowest grade if no criteria match
  };

  // Update suggested grade when metrics change
  useState(() => {
    const grade = calculateGrade(watchedValues);
    setSuggestedGrade(grade);
  });

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    Array.from(files).forEach((file, index) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newPhoto: InspectionPhoto = {
          id: `photo-${Date.now()}-${index}`,
          url: e.target?.result as string,
          caption: `Inspection photo ${index + 1}`,
          category: 'overall',
          uploadedAt: new Date().toISOString(),
          metadata: {
            size: file.size,
            format: file.type,
            dimensions: { width: 0, height: 0 } // Would be calculated in real implementation
          }
        };
        setPhotos(prev => [...prev, newPhoto]);
      };
      reader.readAsDataURL(file);
    });
  };

  const addDefect = () => {
    if (newDefect.trim() && !watchedValues.defects.includes(newDefect.trim())) {
      setValue('defects', [...watchedValues.defects, newDefect.trim()]);
      setNewDefect('');
    }
  };

  const removeDefect = (defect: string) => {
    setValue('defects', watchedValues.defects.filter(d => d !== defect));
  };

  const addRecommendation = () => {
    if (newRecommendation.trim()) {
      setValue('recommendations', [...(watchedValues.recommendations || []), newRecommendation.trim()]);
      setNewRecommendation('');
    }
  };

  const removeRecommendation = (rec: string) => {
    setValue('recommendations', (watchedValues.recommendations || []).filter(r => r !== rec));
  };

  const handleFormSubmit = async (data: QualityInspectionFormData) => {
    try {
      setIsSubmitting(true);
      await onSubmit({ ...data, photos });
    } catch (error) {
      console.error('Error submitting inspection:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getGradeColor = (grade: Grade) => {
    const colors = {
      'A': 'bg-green-100 text-green-800',
      'B': 'bg-blue-100 text-blue-800',
      'C': 'bg-yellow-100 text-yellow-800',
      'D': 'bg-orange-100 text-orange-800',
      'E': 'bg-red-100 text-red-800',
      'F': 'bg-gray-100 text-gray-800'
    };
    return colors[grade];
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <CheckCircle className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Quality Inspection</h3>
              <p className="text-sm text-gray-500">Comprehensive quality assessment and grading</p>
            </div>
          </div>
          {suggestedGrade && (
            <Badge className={getGradeColor(suggestedGrade)}>
              Suggested Grade: {suggestedGrade}
            </Badge>
          )}
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product ID</label>
              <Input
                {...register('productId')}
                placeholder="e.g., PRD-2024-001"
              />
              {errors.productId && (
                <p className="text-red-500 text-xs mt-1">{errors.productId.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Batch ID</label>
              <Input
                {...register('batchId')}
                placeholder="e.g., BATCH-001"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Inspection Location</label>
              <Input
                {...register('location')}
                placeholder="e.g., Packhouse 1, Stellenbosch"
              />
              {errors.location && (
                <p className="text-red-500 text-xs mt-1">{errors.location.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Inspection Date</label>
              <Input
                type="datetime-local"
                defaultValue={new Date().toISOString().slice(0, 16)}
              />
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
                  placeholder="e.g., 13.5"
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
                <select
                  {...register('size')}
                  className="w-full p-2 border border-gray-300 rounded-md focus:border-purple-500 focus:ring-purple-500"
                >
                  <option value="">Select size</option>
                  <option value="Large">Large</option>
                  <option value="Medium">Medium</option>
                  <option value="Small">Small</option>
                  <option value="Mixed">Mixed</option>
                  <option value="Irregular">Irregular</option>
                </select>
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
                  placeholder="e.g., Deep Red"
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
                  {...register('firmness', { valueAsNumber: true })}
                  placeholder="e.g., 8"
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
                  placeholder="e.g., 14.2"
                />
                {errors.sugarContent && (
                  <p className="text-red-500 text-xs mt-1">{errors.sugarContent.message}</p>
                )}
              </div>

              {/* Weight */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Scale className="inline h-4 w-4 mr-1" />
                  Weight (grams)
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

          {/* Defects */}
          <div className="border-t pt-6">
            <h4 className="text-md font-semibold text-gray-900 mb-4">Defect Assessment</h4>
            
            <div className="space-y-3">
              <div className="flex gap-2">
                <select
                  value={newDefect}
                  onChange={(e) => setNewDefect(e.target.value)}
                  className="flex-1 p-2 border border-gray-300 rounded-md"
                >
                  <option value="">Select defect type...</option>
                  {DEFECT_TYPES.map(defect => (
                    <option key={defect} value={defect}>{defect}</option>
                  ))}
                </select>
                <Button type="button" onClick={addDefect} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {watchedValues.defects.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {watchedValues.defects.map((defect, index) => (
                    <Badge key={index} variant="destructive" className="flex items-center gap-1">
                      {defect}
                      <button
                        type="button"
                        onClick={() => removeDefect(defect)}
                        className="ml-1 hover:text-red-700"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Photo Upload */}
          <div className="border-t pt-6">
            <h4 className="text-md font-semibold text-gray-900 mb-4">Visual Evidence</h4>
            
            <div className="space-y-4">
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />
              
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="w-full"
              >
                <Camera className="h-4 w-4 mr-2" />
                Upload Photos
              </Button>

              {photos.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {photos.map((photo) => (
                    <div key={photo.id} className="relative group">
                      <img
                        src={photo.url}
                        alt={photo.caption}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setPhotos(photos.filter(p => p.id !== photo.id))}
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

          {/* Recommendations */}
          <div className="border-t pt-6">
            <h4 className="text-md font-semibold text-gray-900 mb-4">Recommendations</h4>
            
            <div className="space-y-3">
              <div className="flex gap-2">
                <Input
                  value={newRecommendation}
                  onChange={(e) => setNewRecommendation(e.target.value)}
                  placeholder="Add recommendation..."
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addRecommendation())}
                />
                <Button type="button" onClick={addRecommendation} size="sm">
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
                        onClick={() => removeRecommendation(rec)}
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
              rows={4}
              placeholder="Enter any additional observations or notes..."
            />
          </div>

          {/* Submit */}
          <div className="flex justify-end gap-3 pt-6 border-t">
            <Button type="button" variant="outline">
              Save as Draft
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit Inspection'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
