// src/components/events/EventForm.tsx
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { eventTypeValues, eventTypes } from '@/lib/constants';

// Create a type from the readonly array
type EventTypes = typeof eventTypeValues[number];

// Define the schema with proper types
const eventSchema = z.object({
  type: z.enum(eventTypeValues),
  notes: z.string().optional(),
  location: z.string().optional(),
  timestamp: z.string().datetime(),
  photos: z.array(z.instanceof(File)).optional(),
});

type EventFormData = z.infer<typeof eventSchema>;

interface EventFormProps {
  productId: string;
  onSubmit: (data: EventFormData) => Promise<void>;
}

export function EventForm({ productId, onSubmit }: EventFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      timestamp: new Date().toISOString(),
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFormSubmit = async (data: EventFormData) => {
    try {
      setIsSubmitting(true);
      await onSubmit(data);
      // Reset form or show success message
    } catch (error) {
      console.error('Error submitting event:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div>
        <label htmlFor="type" className="block text-sm font-medium text-gray-700">
          Event Type
        </label>
        <select
          id="type"
          {...register('type')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          {eventTypes.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
        {errors.type && <p className="mt-1 text-sm text-red-600">{String(errors.type.message)}</p>}
      </div>

      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
          Notes
        </label>
        <Textarea
          id="notes"
          {...register('notes')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          rows={3}
        />
      </div>

      <div>
        <label htmlFor="location" className="block text-sm font-medium text-gray-700">
          Location
        </label>
        <Input
          type="text"
          id="location"
          {...register('location')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Photos</label>
        <Input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => {
            // Handle file uploads
            const files = Array.from(e.target.files || []);
            // Update form state with files
          }}
          className="mt-1 block w-full"
        />
      </div>

      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-indigo-600 text-white hover:bg-indigo-700"
        >
          {isSubmitting ? 'Submitting...' : 'Add Event'}
        </Button>
      </div>
    </form>
  );
}