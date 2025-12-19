// src/components/ProductForm.tsx
'use client';

import { useState } from 'react';
import { useForm } from '@/hooks/useForm';
import { validateProduct, ProductFormData } from '@/lib/validation';
import { createProduct } from '@/lib/api';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { Product } from '@/types/database';

const initialFormState: Omit<Product, 'id' | 'createdAt'> = {
  name: '',
  description: '',  // Added missing required field
  category: '',
  harvestDate: new Date().toISOString().split('T')[0],
  location: '',
  updatedAt: undefined,  // Optional field
};

export function ProductForm() {
  const isOnline = useOnlineStatus();
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'idle' | 'success' | 'error' | 'queued';
    message: string;
  }>({ type: 'idle', message: '' });

  const {
    values,
    errors,
    isSubmitting,
    handleChange,
    validateForm,
    setErrors,
    setIsSubmitting,
  } = useForm(
    initialFormState, 
    validateProduct
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitStatus({ type: 'idle', message: '' });

    const result = validateForm();
    if (!result.success) return;

    try {
      setIsSubmitting(true);
      const response = await createProduct(values);
      
      if ('queued' in response) {
        setSubmitStatus({
          type: 'queued',
          message: 'Product will be created when online',
        });
      } else {
        setSubmitStatus({
          type: 'success',
          message: 'Product created successfully!',
        });
      }
    } catch (error) {
      setSubmitStatus({
        type: 'error',
        message: error instanceof Error ? error.message : 'Failed to create product',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      {!isOnline && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                You are currently offline. Your changes will be synced when you&apost;re back online.
              </p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Product&apos; Name</label>
          <input
            type="text"
            name="name"
            value={values.name}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md ${
              errors.name ? 'border-red-300' : 'border-gray-300'
            } shadow-sm`}
          />
          {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Category</label>
          <select
            name="category"
            value={values.category}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md ${
              errors.category ? 'border-red-300' : 'border-gray-300'
            } shadow-sm`}
          >
            <option value="">Select a category</option>
            <option value="fruit">Fruit</option>
            <option value="vegetable">Vegetable</option>
            <option value="grain">Grain</option>
            <option value="dairy">Dairy</option>
          </select>
          {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Harvest Date</label>
          <input
            type="date"
            name="harvestDate"
            value={values.harvestDate}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md ${
              errors.harvestDate ? 'border-red-300' : 'border-gray-300'
            } shadow-sm`}
          />
          {errors.harvestDate && <p className="mt-1 text-sm text-red-600">{errors.harvestDate}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Location</label>
          <input
            type="text"
            name="location"
            value={values.location}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md ${
              errors.location ? 'border-red-300' : 'border-gray-300'
            } shadow-sm`}
            placeholder="e.g., Field A7, Greenhouse 2"
          />
          {errors.location && <p className="mt-1 text-sm text-red-600">{errors.location}</p>}
        </div>

        <div className="flex items-center space-x-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
          >
            {isSubmitting ? 'Saving...' : 'Save Product'}
          </button>
          
          {submitStatus.type !== 'idle' && (
            <p className={`text-sm ${
              submitStatus.type === 'error' ? 'text-red-600' : 
              submitStatus.type === 'success' ? 'text-green-600' : 
              'text-yellow-600'
            }`}>
              {submitStatus.message}
            </p>
          )}
        </div>
      </form>
    </div>
  );
}