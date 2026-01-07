'use client';

import React, { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CreateProduct, ProductCategory } from '@/types/product';
import { useProducts } from '@/contexts/productContext';
import { ErrorHandler } from '@/lib/errorHandler';
import { AVAILABLE_CERTIFICATIONS } from '@/constants/demoData';

const productCategories = Object.values(ProductCategory);

// Form validation schema
const productSchema = z.object({
  name: z.string().min(2, 'Product name must be at least 2 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  category: z.nativeEnum(ProductCategory),
  location: z.string().min(2, 'Location must be at least 2 characters'),
  harvestDate: z.string().min(1, 'Harvest date is required'),
  batchSize: z.string().min(1, 'Batch size is required'),
  certifications: z.array(z.string()),
  photos: z.array(z.string()),
});

type ProductFormData = z.infer<typeof productSchema>;

interface ProductFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  initialData?: Partial<CreateProduct>;
}

export function ProductForm({ onSuccess, onCancel, initialData }: ProductFormProps) {
  const { addProduct } = useProducts();
  const [selectedCertifications, setSelectedCertifications] = useState<string[]>(
    initialData?.certifications || []
  );
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>(
    initialData?.photos || []
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
    setValue,
    watch,
    trigger
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: initialData?.name || '',
      description: initialData?.description || '',
      category: initialData?.category || ProductCategory.FRUITS,
      location: initialData?.location || '',
      harvestDate: initialData?.harvestDate || '',
      batchSize: initialData?.batchSize || '',
      certifications: initialData?.certifications ?? [],
      photos: initialData?.photos ?? [],
    },
  });

  const handleCertificationToggle = useCallback((certification: string) => {
    const updated = selectedCertifications.includes(certification)
      ? selectedCertifications.filter(c => c !== certification)
      : [...selectedCertifications, certification];
    
    setSelectedCertifications(updated);
    setValue('certifications', updated, { shouldValidate: true });
  }, [selectedCertifications, setValue]);

  const handlePhotoUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (result) {
          const updated = [...uploadedPhotos, result];
          setUploadedPhotos(updated);
          setValue('photos', updated, { shouldValidate: true });
        }
      };
      reader.readAsDataURL(file);
    });
  }, [uploadedPhotos, setValue]);

  const handlePhotoRemove = useCallback((index: number) => {
    const updated = uploadedPhotos.filter((_, i) => i !== index);
    setUploadedPhotos(updated);
    setValue('photos', updated, { shouldValidate: true });
  }, [uploadedPhotos, setValue]);

  const onSubmit = useCallback(async (data: ProductFormData) => {
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      const productData: CreateProduct = {
        ...data,
        certifications: selectedCertifications,
        photos: uploadedPhotos,
      };

      await addProduct(productData);
      
      if (onSuccess) {
        onSuccess();
      } else {
        reset();
        setSelectedCertifications([]);
        setUploadedPhotos([]);
      }
    } catch (error) {
      const appError = ErrorHandler.handleAsyncError(error, 'blockchain', 'productForm');
      setSubmitError(ErrorHandler.getUserMessage(appError));
      console.error('Failed to create product:', appError);
    } finally {
      setIsSubmitting(false);
    }
  }, [addProduct, selectedCertifications, uploadedPhotos, onSuccess, reset]);

  const handleCancel = useCallback(() => {
    if (onCancel) {
      onCancel();
    } else {
      reset();
      setSelectedCertifications([]);
      setUploadedPhotos([]);
    }
  }, [onCancel, reset]);

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {initialData ? 'Edit Product' : 'Register New Product'}
        </h2>
        <p className="text-gray-600 mt-2">
          Register your product on the blockchain for complete traceability
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Product Name *
            </label>
            <input
              id="name"
              {...register('name')}
              placeholder="e.g., Organic Apples"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">
              Category *
            </label>
            <select
              id="category"
              {...register('category')}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.category ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              {productCategories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="text-sm text-red-500">{errors.category.message}</p>
            )}
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description *
          </label>
          <textarea
            id="description"
            {...register('description')}
            placeholder="Describe your product, growing methods, and unique characteristics..."
            rows={3}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.description ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.description && (
            <p className="text-sm text-red-500">{errors.description.message}</p>
          )}
        </div>

        {/* Location and Date */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="location" className="block text-sm font-medium text-gray-700">
              Farm Location *
            </label>
            <input
              id="location"
              {...register('location')}
              placeholder="e.g., Stellenbosch, Western Cape"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.location ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.location && (
              <p className="text-sm text-red-500">{errors.location.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="harvestDate" className="block text-sm font-medium text-gray-700">
              Harvest Date *
            </label>
            <input
              id="harvestDate"
              type="date"
              {...register('harvestDate')}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.harvestDate ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.harvestDate && (
              <p className="text-sm text-red-500">{errors.harvestDate.message}</p>
            )}
          </div>
        </div>

        {/* Batch Size */}
        <div className="space-y-2">
          <label htmlFor="batchSize" className="block text-sm font-medium text-gray-700">
            Batch Size *
          </label>
          <input
            id="batchSize"
            {...register('batchSize')}
            placeholder="e.g., 500kg, 1200 eggs"
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.batchSize ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.batchSize && (
            <p className="text-sm text-red-500">{errors.batchSize.message}</p>
          )}
        </div>

        {/* Error Display */}
        {submitError && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Registration Failed</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{submitError}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Form Actions */}
        <div className="flex justify-end space-x-4 pt-4">
          <button
            type="button"
            onClick={handleCancel}
            disabled={isSubmitting}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!isDirty || isSubmitting}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
          >
            {isSubmitting ? 'Registering...' : 'Register Product'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default React.memo(ProductForm);