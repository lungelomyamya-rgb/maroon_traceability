// src/components/products/PhotoUpload.tsx
'use client';

import { useState, useRef } from 'react';
import { Camera, X, Upload, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

interface PhotoUploadProps {
  photos: string[];
  onPhotosChange: (photos: string[]) => void;
  maxPhotos?: number;
}

export function PhotoUpload({ photos, onPhotosChange, maxPhotos = 5 }: PhotoUploadProps) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || photos.length >= maxPhotos) return;

    setUploading(true);

    try {
      const newPhotos: string[] = [];
      
      for (let i = 0; i < Math.min(files.length, maxPhotos - photos.length); i++) {
        const file = files[i];
        
        // Compress and convert to base64
        const compressed = await compressImage(file);
        newPhotos.push(compressed);
      }

      onPhotosChange([...photos, ...newPhotos]);
    } catch (error) {
      console.error('Photo upload error:', error);
      alert('Failed to upload photos. Please try again.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e: Event) => {
        const target = e.target as FileReader;
        const result = target?.result;
        if (!result) {
          return reject(new Error('Failed to read file'));
        }
        
        const img = new window.Image() as HTMLImageElement;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          if (!ctx) {
            return reject(new Error('Could not get canvas context'));
          }
          
          // Max dimensions
          const maxWidth = 1200;
          const maxHeight = 1200;
          let width = img.width;
          let height = img.height;

          // Calculate new dimensions
          if (width > height) {
            if (width > maxWidth) {
              height *= maxWidth / width;
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width *= maxHeight / height;
              height = maxHeight;
            }
          }

          canvas.width = width;
          canvas.height = height;
          ctx?.drawImage(img, 0, 0, width, height);

          // Convert to base64 with compression
          const compressed = canvas.toDataURL('image/jpeg', 0.7);
          resolve(compressed);
        };
        
        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = result as string;
      };
      
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  };

  const removePhoto = (index: number) => {
    onPhotosChange(photos.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">
          Photos ({photos.length}/{maxPhotos})
        </label>
        {photos.length < maxPhotos && (
          <Button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            size="sm"
            variant="secondary"
          >
            {uploading ? (
              <>
                <Upload className="h-4 w-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Camera className="h-4 w-4 mr-2" />
                Add Photo
              </>
            )}
          </Button>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileSelect}
        className="hidden"
        capture="environment"
      />

      {photos.length === 0 ? (
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors cursor-pointer"
        >
          <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
          <p className="text-sm text-gray-600 mb-1">Click to add photos</p>
          <p className="text-xs text-gray-500">JPG, PNG up to 5MB each</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {photos.map((photo, index) => (
            <div key={index} className="relative group">
              <Image
                src={photo}
                alt={`Preview ${index + 1}`}
                width={100}
                height={100}
                className="w-full h-32 object-cover rounded-lg"
                unoptimized
              />
              <button
                type="button"
                onClick={() => removePhoto(index)}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-4 w-4" />
              </button>
              <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                Photo {index + 1}
              </div>
            </div>
          ))}
        </div>
      )}

      <p className="text-xs text-gray-500">
        💡 Tip: Photos increase trust and are required for export compliance
      </p>
    </div>
  );
}