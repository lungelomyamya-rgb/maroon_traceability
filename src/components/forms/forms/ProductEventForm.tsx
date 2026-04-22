'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Camera, Upload, X, Wifi, WifiOff } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { eventTypeValues, eventTypes } from '@/lib/constants';

// Create a type from readonly array
type EventTypes = typeof eventTypeValues[number];

// Define schema with fertiliser-specific fields
const eventSchema = z.object({
  type: z.enum(eventTypeValues),
  notes: z.string().optional(),
  location: z.string().optional(),
  timestamp: z.string().datetime(),
  photos: z.array(z.instanceof(File)).optional(),
  // Fertiliser specific fields
  fertiliserType: z.string().optional(),
  fertiliserAmount: z.string().optional(),
  applicationMethod: z.string().optional(),
  // Growth specific fields
  growthStage: z.string().optional(),
  plantHeight: z.string().optional(),
  healthStatus: z.string().optional(),
});

export type EventFormData = z.infer<typeof eventSchema>;

interface ProductEventFormProps {
  productId: string;
  onSubmit: (data: EventFormData) => Promise<void>;
  className?: string;
}

export function ProductEventForm({ productId, onSubmit, className }: ProductEventFormProps) {
  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      timestamp: new Date().toISOString(),
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' && navigator.onLine);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const selectedEventType = watch('type');

  // Monitor online status for PWA functionality
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handlePhotoUpload = (files: FileList | null) => {
    if (!files) {
      return;
    }

    const fileArray = Array.from(files);
    const newPreviews: string[] = [];

    fileArray.forEach(file => {
      if (file.type.startsWith('image/')) {
        const preview = URL.createObjectURL(file);
        newPreviews.push(preview);
      }
    });

    setPhotoPreviews(prev => [...prev, ...newPreviews]);
    setValue('photos', [...(watch('photos') || []), ...fileArray]);
  };

  const removePhoto = (index: number) => {
    const newPreviews = photoPreviews.filter((_, i) => i !== index);
    const currentPhotos = watch('photos') || [];
    const newPhotos = currentPhotos.filter((_, i) => i !== index);

    setPhotoPreviews(newPreviews);
    setValue('photos', newPhotos);
  };

  const handleFormSubmit = async (data: EventFormData) => {
    try {
      setIsSubmitting(true);

      // Store offline data if needed
      if (!isOnline) {
        const offlineData = {
          ...data,
          productId,
          timestamp: new Date().toISOString(),
          syncStatus: 'pending',
        };

        // Store in IndexedDB for PWA offline support
        const offlineEvents = JSON.parse(localStorage.getItem('offlineEvents') || '[]');
        offlineEvents.push(offlineData);
        localStorage.setItem('offlineEvents', JSON.stringify(offlineEvents));

        // Show event saved offline message
        alert('Event saved offline. It will be synced when you reconnect to the internet.');
        return;
      }

      await onSubmit(data);
      // Reset form
      setPhotoPreviews([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      // Handle error submitting event
      console.error('Error submitting event:', error);
      // Show error saving event
      alert('Failed to save event. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show conditional fields based on event type
  const showFertiliserFields = selectedEventType === 'fertiliser';
  const showGrowthFields = selectedEventType === 'growth';

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className={`space-y-4 ${className}`}>
      {/* Online Status Indicator */}
      <div className="flex items-center gap-2 text-sm">
        {isOnline ? (
          <>
            <Wifi className="h-4 w-4 text-green-600" />
            <span className="text-green-600">Online - Events will sync immediately</span>
          </>
        ) : (
          <>
            <WifiOff className="h-4 w-4 text-orange-600" />
            <span className="text-orange-600">Offline - Events will sync when connection is restored</span>
          </>
        )}
      </div>

      <div>
        <label htmlFor="type" className="block text-sm font-medium text-gray-700">
          Event Type
        </label>
        <Select onValueChange={(value) => setValue('type', value as EventTypes)}>
          <SelectTrigger>
            <SelectValue placeholder="Select event type" />
          </SelectTrigger>
          <SelectContent>
            {eventTypes.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.type && <p className="mt-1 text-sm text-red-600">{String(errors.type.message)}</p>}
      </div>

      {/* Fertiliser Specific Fields */}
      {showFertiliserFields && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-blue-50 rounded-lg">
          <div>
            <label htmlFor="fertiliserType" className="block text-sm font-medium text-gray-700">
              Fertiliser Type
            </label>
            <Input
              type="text"
              id="fertiliserType"
              placeholder="e.g., NPK 15-15-15"
              {...register('fertiliserType')}
              className="mt-1 block w-full"
            />
          </div>
          <div>
            <label htmlFor="fertiliserAmount" className="block text-sm font-medium text-gray-700">
              Amount
            </label>
            <Input
              type="text"
              id="fertiliserAmount"
              placeholder="e.g., 50kg per hectare"
              {...register('fertiliserAmount')}
              className="mt-1 block w-full"
            />
          </div>
          <div>
            <label htmlFor="applicationMethod" className="block text-sm font-medium text-gray-700">
              Application Method
            </label>
            <Select onValueChange={(value) => setValue('applicationMethod', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="broadcast">Broadcast</SelectItem>
                <SelectItem value="foliar">Foliar Spray</SelectItem>
                <SelectItem value="drip">Drip Irrigation</SelectItem>
                <SelectItem value="banded">Banded</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {/* Growth Specific Fields */}
      {showGrowthFields && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-green-50 rounded-lg">
          <div>
            <label htmlFor="growthStage" className="block text-sm font-medium text-gray-700">
              Growth Stage
            </label>
            <Select onValueChange={(value) => setValue('growthStage', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select stage" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="seedling">Seedling</SelectItem>
                <SelectItem value="vegetative">Vegetative</SelectItem>
                <SelectItem value="flowering">Flowering</SelectItem>
                <SelectItem value="fruiting">Fruiting</SelectItem>
                <SelectItem value="mature">Mature</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label htmlFor="plantHeight" className="block text-sm font-medium text-gray-700">
              Plant Height
            </label>
            <Input
              type="text"
              id="plantHeight"
              placeholder="e.g., 15cm"
              {...register('plantHeight')}
              className="mt-1 block w-full"
            />
          </div>
          <div>
            <label htmlFor="healthStatus" className="block text-sm font-medium text-gray-700">
              Health Status
            </label>
            <Select onValueChange={(value) => setValue('healthStatus', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="excellent">Excellent</SelectItem>
                <SelectItem value="good">Good</SelectItem>
                <SelectItem value="fair">Fair</SelectItem>
                <SelectItem value="poor">Poor</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
          Notes
        </label>
        <Textarea
          id="notes"
          {...register('notes')}
          placeholder="Add any additional observations or details..."
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
          placeholder="Field location or GPS coordinates"
          {...register('location')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      {/* Photo Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Photos (Crop Conditions, Harvest, etc.)
        </label>

        {/* Photo Preview Grid */}
        {photoPreviews.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
            {photoPreviews.map((preview, index) => (
              <div key={index} className="relative group">
                <img
                  src={preview}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-24 object-cover rounded-lg border"
                />
                <button
                  type="button"
                  onClick={() => removePhoto(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Upload Button */}
        <div className="flex items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            capture="environment"
            onChange={(e) => handlePhotoUpload(e.target.files)}
            className="hidden"
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2"
          >
            <Camera className="h-4 w-4" />
            Take Photo
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2"
          >
            <Upload className="h-4 w-4" />
            Upload Photos
          </Button>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Supported formats: JPG, PNG. Max 5 photos per event.
        </p>
      </div>

      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-indigo-600 text-white hover:bg-indigo-700"
        >
          {isSubmitting ? 'Saving...' : isOnline ? 'Add Event' : 'Save Offline'}
        </Button>
      </div>
    </form>
  );
}
