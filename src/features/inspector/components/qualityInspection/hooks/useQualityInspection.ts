// src/components/inspector/qualityInspection/hooks/useQualityInspection.ts
'use client';

import { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
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

export type QualityInspectionFormData = z.infer<typeof qualityInspectionSchema>;

export interface QualityInspectionState {
  isSubmitting: boolean;
  photos: InspectionPhoto[];
  newDefect: string;
  newRecommendation: string;
  suggestedGrade: Grade | null;
  watchedValues: Partial<QualityInspectionFormData>;
  errors: Record<string, string>;
}

export interface QualityInspectionActions {
  addDefect: () => void;
  removeDefect: (defect: string) => void;
  addRecommendation: () => void;
  removeRecommendation: (recommendation: string) => void;
  handlePhotoUpload: (files: FileList | null) => void;
  removePhoto: (photoId: string) => void;
  handleFormSubmit: (data: QualityInspectionFormData) => Promise<void>;
  setNewDefect: (value: string) => void;
  setNewRecommendation: (value: string) => void;
  getGradeColor: (grade: Grade) => string;
  getDefectSeverity: (defect: string) => 'low' | 'medium' | 'high';
}

export interface QualityInspectionComputed {
  gradeMetrics: {
    moistureScore: number;
    sizeScore: number;
    firmnessScore: number;
    sugarScore: number;
    safetyScore: number;
  };
  inspectionStats: {
    totalPhotos: number;
    totalDefects: number;
    totalRecommendations: number;
    overallQuality: 'excellent' | 'good' | 'fair' | 'poor';
  };
  gradeDistribution: Record<Grade, number>;
}

export function useQualityInspection(
  productId: string,
  onSubmit: (data: QualityInspectionFormData & { photos: InspectionPhoto[] }) => Promise<void>,
  initialData?: Partial<QualityInspectionFormData>
) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Form setup
  const { register, handleSubmit, formState: { errors }, watch, setValue, setError, clearErrors } = useForm<QualityInspectionFormData>({
    resolver: zodResolver(qualityInspectionSchema),
    defaultValues: {
      productId,
      defects: [],
      recommendations: [],
      ...initialData
    }
  });

  // State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [photos, setPhotos] = useState<InspectionPhoto[]>([]);
  const [newDefect, setNewDefect] = useState('');
  const [newRecommendation, setNewRecommendation] = useState('');
  const [suggestedGrade, setSuggestedGrade] = useState<Grade | null>(null);

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
    return 'F'; // Default to lowest grade if no criteria met
  };

  // Update suggested grade when metrics change
  useEffect(() => {
    const grade = calculateGrade(watchedValues);
    setSuggestedGrade(grade);
  }, [watchedValues]);

  // Photo management
  const handlePhotoUpload = (files: FileList | null) => {
    if (!files) return;

    const newPhotos: InspectionPhoto[] = Array.from(files).map((file, index) => ({
      id: `photo-${Date.now()}-${index}`,
      url: URL.createObjectURL(file),
      caption: `Inspection photo ${photos.length + index + 1}`,
      category: 'documentation' as const,
      uploadedAt: new Date().toISOString()
    }));

    setPhotos(prev => [...prev, ...newPhotos]);
  };

  const removePhoto = (photoId: string) => {
    setPhotos(prev => {
      const photo = prev.find(p => p.id === photoId);
      if (photo?.url.startsWith('blob:')) {
        URL.revokeObjectURL(photo.url);
      }
      return prev.filter(p => p.id !== photoId);
    });
  };

  // Defect management
  const addDefect = () => {
    if (newDefect.trim()) {
      setValue('defects', [...(watchedValues.defects || []), newDefect.trim()]);
      setNewDefect('');
    }
  };

  const removeDefect = (defect: string) => {
    setValue('defects', (watchedValues.defects || []).filter(d => d !== defect));
  };

  // Recommendation management
  const addRecommendation = () => {
    if (newRecommendation.trim()) {
      setValue('recommendations', [...(watchedValues.recommendations || []), newRecommendation.trim()]);
      setNewRecommendation('');
    }
  };

  const removeRecommendation = (rec: string) => {
    setValue('recommendations', (watchedValues.recommendations || []).filter(r => r !== rec));
  };

  // Form submission
  const handleFormSubmit = async (data: QualityInspectionFormData) => {
    try {
      setIsSubmitting(true);
      await onSubmit({ ...data, photos });
    } catch (error) {
      console.error('Error submitting inspection:', error);
      // Handle error display if needed
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper functions
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

  const getDefectSeverity = (defect: string): 'low' | 'medium' | 'high' => {
    const highSeverityDefects = ['mold', 'pests', 'decay', 'contamination'];
    const mediumSeverityDefects = ['discoloration', 'bruising', 'soft spots'];
    
    if (highSeverityDefects.some(d => defect.toLowerCase().includes(d))) return 'high';
    if (mediumSeverityDefects.some(d => defect.toLowerCase().includes(d))) return 'medium';
    return 'low';
  };

  // Computed values
  const computed: QualityInspectionComputed = {
    gradeMetrics: {
      moistureScore: watchedValues.moistureContent ? Math.max(0, 100 - Math.abs(watchedValues.moistureContent - 12) * 5) : 0,
      sizeScore: watchedValues.size ? 80 : 0,
      firmnessScore: watchedValues.firmness ? watchedValues.firmness * 10 : 0,
      sugarScore: watchedValues.sugarContent ? Math.min(100, watchedValues.sugarContent * 3) : 0,
      safetyScore: (watchedValues.pesticideResidue !== undefined && watchedValues.microbialCount !== undefined) 
        ? Math.max(0, 100 - (watchedValues.pesticideResidue * 1000 + watchedValues.microbialCount * 0.1))
        : 0
    },
    inspectionStats: {
      totalPhotos: photos.length,
      totalDefects: watchedValues.defects?.length || 0,
      totalRecommendations: watchedValues.recommendations?.length || 0,
      overallQuality: (suggestedGrade ? 
        (['A', 'B'].includes(suggestedGrade) ? 'excellent' :
         ['C', 'D'].includes(suggestedGrade) ? 'good' : 'fair') : 'poor') as 'excellent' | 'good' | 'fair' | 'poor'
    },
    gradeDistribution: {
      'A': 0, 'B': 0, 'C': 0, 'D': 0, 'E': 0, 'F': 0
    }
  };

  return {
    // Form controls
    register,
    handleSubmit,
    errors,
    watch,
    setValue,
    setError,
    clearErrors,
    fileInputRef,
    
    // State
    isSubmitting,
    photos,
    newDefect,
    newRecommendation,
    suggestedGrade,
    watchedValues,
    
    // Computed
    computed,
    
    // Actions
    addDefect,
    removeDefect,
    addRecommendation,
    removeRecommendation,
    handlePhotoUpload,
    removePhoto,
    handleFormSubmit,
    setNewDefect,
    setNewRecommendation,
    getGradeColor,
    getDefectSeverity
  };
}
