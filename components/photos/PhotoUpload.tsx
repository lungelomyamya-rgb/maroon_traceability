// src/components/photos/PhotoUpload.tsx
// Photo upload component with offline support

import React, { useState, useRef, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Camera, Upload, X, Image as ImageIcon, WifiOff, CheckCircle, AlertCircle } from 'lucide-react';
import { useOfflineSync } from '@/hooks/useOfflineSync';
import { Button } from '@/components/ui/button';

interface PhotoUploadProps {
  eventId: string;
  productId: string;
  onPhotoUploaded?: (photoId: string) => void;
  maxPhotos?: number;
  acceptedFileTypes?: string[];
  maxFileSize?: number; // in bytes
  className?: string;
}

interface UploadedPhoto {
  id: string;
  file: File;
  preview: string;
  uploadStatus: 'pending' | 'uploading' | 'uploaded' | 'error';
  error?: string;
}

export function PhotoUpload({
  eventId,
  productId,
  onPhotoUploaded,
  maxPhotos = 5,
  acceptedFileTypes = ['image/jpeg', 'image/png', 'image/webp'],
  maxFileSize = 5 * 1024 * 1024, // 5MB
  className = ''
}: PhotoUploadProps) {
  const [uploadedPhotos, setUploadedPhotos] = useState<UploadedPhoto[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadPhoto, syncStatus } = useOfflineSync();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const validFiles = acceptedFiles.filter(file => {
      if (!acceptedFileTypes.includes(file.type)) {
        alert(`File type ${file.type} is not supported`);
        return false;
      }
      if (file.size > maxFileSize) {
        alert(`File size exceeds ${maxFileSize / 1024 / 1024}MB limit`);
        return false;
      }
      return true;
    });

    if (uploadedPhotos.length + validFiles.length > maxPhotos) {
      alert(`Maximum ${maxPhotos} photos allowed`);
      return;
    }

    setIsUploading(true);

    for (const file of validFiles) {
      const preview = URL.createObjectURL(file);
      const newPhoto: UploadedPhoto = {
        id: `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        file,
        preview,
        uploadStatus: syncStatus.isOnline ? 'uploading' : 'pending'
      };

      setUploadedPhotos(prev => [...prev, newPhoto]);

      try {
        const photoId = await uploadPhoto(file, eventId, productId, {
          timestamp: Date.now(),
          location: 'Field Location', // Could be passed as prop
          notes: `Photo for event ${eventId}`
        });

        // Update photo status
        setUploadedPhotos(prev => 
          prev.map(p => 
            p.id === newPhoto.id 
              ? { ...p, id: photoId, uploadStatus: syncStatus.isOnline ? 'uploaded' : 'pending' }
              : p
          )
        );

        onPhotoUploaded?.(photoId);
      } catch (error) {
        setUploadedPhotos(prev => 
          prev.map(p => 
            p.id === newPhoto.id 
              ? { ...p, uploadStatus: 'error', error: 'Upload failed' }
              : p
          )
        );
      }
    }

    setIsUploading(false);
  }, [uploadedPhotos.length, maxPhotos, acceptedFileTypes, maxFileSize, eventId, productId, uploadPhoto, onPhotoUploaded, syncStatus.isOnline]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedFileTypes.reduce((acc, type) => {
      acc[type] = [];
      return acc;
    }, {} as Record<string, string[]>),
    maxSize: maxFileSize,
    multiple: true,
    disabled: uploadedPhotos.length >= maxPhotos || isUploading
  });

  const removePhoto = (photoId: string) => {
    setUploadedPhotos(prev => {
      const photo = prev.find(p => p.id === photoId);
      if (photo) {
        URL.revokeObjectURL(photo.preview);
      }
      return prev.filter(p => p.id !== photoId);
    });
  };

  const getStatusIcon = (status: UploadedPhoto['uploadStatus']) => {
    switch (status) {
      case 'pending':
        return <WifiOff className="h-4 w-4 text-yellow-500" />;
      case 'uploading':
        return <Upload className="h-4 w-4 text-blue-500 animate-pulse" />;
      case 'uploaded':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusText = (status: UploadedPhoto['uploadStatus']) => {
    switch (status) {
      case 'pending':
        return 'Will sync when online';
      case 'uploading':
        return 'Uploading...';
      case 'uploaded':
        return syncStatus.isOnline ? 'Uploaded' : 'Synced locally';
      case 'error':
        return 'Upload failed';
      default:
        return '';
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload area */}
      {uploadedPhotos.length < maxPhotos && (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
            isDragActive
              ? 'border-green-500 bg-green-50'
              : 'border-gray-300 hover:border-gray-400 bg-gray-50'
          } ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <input {...getInputProps()} />
          <Camera className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <p className="text-lg font-medium text-gray-700 mb-2">
            {isDragActive ? 'Drop photos here' : 'Upload Photos'}
          </p>
          <p className="text-sm text-gray-500 mb-4">
            Drag & drop or click to select photos
          </p>
          <div className="flex flex-wrap justify-center gap-2 text-xs text-gray-400">
            <span>Max {maxPhotos} photos</span>
            <span>•</span>
            <span>Max {maxFileSize / 1024 / 1024}MB each</span>
            <span>•</span>
            <span>JPG, PNG, WebP</span>
          </div>
          {!syncStatus.isOnline && (
            <div className="mt-4 p-2 bg-yellow-100 rounded-md">
              <WifiOff className="h-4 w-4 text-yellow-600 mx-auto mb-1" />
              <p className="text-xs text-yellow-800">
                Offline mode: Photos will sync when online
              </p>
            </div>
          )}
        </div>
      )}

      {/* Alternative button */}
      <div className="flex justify-center">
        <Button
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploadedPhotos.length >= maxPhotos || isUploading}
          className="w-full"
        >
          <Upload className="h-4 w-4 mr-2" />
          Choose Photos
        </Button>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept={acceptedFileTypes.join(',')}
        onChange={(e) => {
          const files = Array.from(e.target.files || []);
          if (files.length > 0) {
            onDrop(files);
          }
          e.target.value = ''; // Reset input
        }}
        className="hidden"
      />

      {/* Uploaded photos */}
      {uploadedPhotos.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium text-gray-700">
            Uploaded Photos ({uploadedPhotos.length}/{maxPhotos})
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {uploadedPhotos.map((photo) => (
              <div key={photo.id} className="relative group">
                <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                  <img
                    src={photo.preview}
                    alt="Uploaded photo"
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Status indicator */}
                <div className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-sm">
                  {getStatusIcon(photo.uploadStatus)}
                </div>

                {/* Remove button */}
                <button
                  onClick={() => removePhoto(photo.id)}
                  className="absolute top-2 left-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-3 w-3" />
                </button>

                {/* Status text */}
                <div className="mt-1 text-xs text-gray-500 text-center">
                  {getStatusText(photo.uploadStatus)}
                </div>

                {/* Error message */}
                {photo.error && (
                  <div className="mt-1 text-xs text-red-500 text-center">
                    {photo.error}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Storage info */}
      <div className="text-xs text-gray-500 text-center">
        <ImageIcon className="h-3 w-3 inline mr-1" />
        Photos are stored locally and will sync automatically when online
      </div>
    </div>
  );
}

// Photo gallery component for viewing uploaded photos
export function PhotoGallery({ eventId, className = '' }: { eventId: string; className?: string }) {
  const [photos, setPhotos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { getPhotosByEvent } = useOfflineSync();

  React.useEffect(() => {
    const loadPhotos = async () => {
      try {
        const eventPhotos = await getPhotosByEvent(eventId);
        setPhotos(eventPhotos);
      } catch (error) {
        console.error('Failed to load photos:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPhotos();
  }, [eventId, getPhotosByEvent]);

  if (loading) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
        <p className="text-gray-500">Loading photos...</p>
      </div>
    );
  }

  if (photos.length === 0) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <ImageIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
        <p className="text-gray-500">No photos uploaded yet</p>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <h4 className="font-medium text-gray-700">Event Photos ({photos.length})</h4>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {photos.map((photo) => (
          <div key={photo.id} className="aspect-square rounded-lg overflow-hidden bg-gray-100 border border-gray-200 group cursor-pointer">
            <img
              src={URL.createObjectURL(photo.file)}
              alt="Event photo"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity" />
          </div>
        ))}
      </div>
    </div>
  );
}
