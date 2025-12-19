// src/components/products/ProductModal.tsx
'use client';

import { useState } from 'react';
import { useProducts } from '@/contexts/productContext';
import { formatDateTime } from '@/lib/utils';
import { X, Package, MapPin, Calendar, User, Hash, Award, TrendingUp, Image as ImageIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { CATEGORY_COLORS } from '@/lib/constants';
import Image from 'next/image';
import { BlockchainRecord } from '@/types/blockchain';

type ProductWithPhotos = BlockchainRecord & {
  photos?: string[];
};

export function ProductModal() {
  const { selectedProduct, setSelectedProduct } = useProducts();
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);

  if (!selectedProduct) return null;

  const categoryColor = CATEGORY_COLORS[selectedProduct.category];
  const productWithPhotos = selectedProduct as ProductWithPhotos;
  const photos: string[] = productWithPhotos.photos || [];

  const nextPhoto = () => {
    setSelectedPhotoIndex((prev) => (prev + 1) % photos.length);
  };

  const prevPhoto = () => {
    setSelectedPhotoIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-slide-up">
        {/* Header */}
        <div className={`${categoryColor.bg} p-6 border-b`}>
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-4">
              <div className="text-5xl"><span>{categoryColor.icon({})}</span></div>
              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-1">
                  {selectedProduct.productName}
                </h3>
                <div className="flex items-center gap-2">
                  <Badge variant={selectedProduct.status === 'Certified' ? 'success' : 'warning'}>
                    {selectedProduct.status}
                  </Badge>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${categoryColor.bg} ${categoryColor.text}`}>
                    {selectedProduct.category}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={() => {
                setSelectedProduct(null);
                setSelectedPhotoIndex(0);
              }}
              className="text-gray-400 hover:text-gray-600 transition-colors bg-white rounded-full p-2 hover:bg-gray-100"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Photos Gallery */}
          {photos.length > 0 && (
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <ImageIcon className="h-5 w-5 text-gray-600" />
                <p className="font-semibold text-gray-800">Product Photos ({photos.length})</p>
              </div>
              
              {/* Main Photo */}
              <div className="relative mb-3">
                <Image
                  src={photos[selectedPhotoIndex] || '/placeholder-product.jpg'}
                  alt={`${selectedProduct.productName} - Main view`}
                  width={600}
                  height={400}
                  className="w-full h-96 object-cover rounded-lg"
                  unoptimized
                />
                
                {photos.length > 1 && (
                  <>
                    <button
                      onClick={prevPhoto}
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full p-2 hover:bg-black/70 transition-colors"
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </button>
                    <button
                      onClick={nextPhoto}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full p-2 hover:bg-black/70 transition-colors"
                    >
                      <ChevronRight className="h-6 w-6" />
                    </button>
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/60 text-white text-xs px-3 py-1 rounded-full">
                      {selectedPhotoIndex + 1} / {photos.length}
                    </div>
                  </>
                )}
              </div>

              {/* Thumbnail Gallery */}
              {photos.length > 1 && (
                <div className="flex gap-2 overflow-x-auto">
                  {photos.map((photo: string, idx: number) => (
                    <Image
                      key={`photo-${idx}`}
                      src={photo}
                      alt={`${selectedProduct.productName} - View ${idx + 1}`}
                      width={80}
                      height={80}
                      className={`w-24 h-24 object-cover rounded-md cursor-pointer transition-all ${
                        idx === selectedPhotoIndex ? 'ring-2 ring-blue-500' : 'opacity-70 hover:opacity-100'
                      }`}
                      onClick={() => setSelectedPhotoIndex(idx)}
                      unoptimized
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Product Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
              <User className="h-5 w-5 text-gray-500 mt-0.5" />
              <div>
                <p className="text-xs text-gray-500 mb-1">Farmer</p>
                <p className="font-semibold text-gray-800">{selectedProduct.farmer}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
              <MapPin className="h-5 w-5 text-gray-500 mt-0.5" />
              <div>
                <p className="text-xs text-gray-500 mb-1">Location</p>
                <p className="font-semibold text-gray-800">{selectedProduct.location}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
              <Calendar className="h-5 w-5 text-gray-500 mt-0.5" />
              <div>
                <p className="text-xs text-gray-500 mb-1">Harvest Date</p>
                <p className="font-semibold text-gray-800">{selectedProduct.harvestDate}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
              <Package className="h-5 w-5 text-gray-500 mt-0.5" />
              <div>
                <p className="text-xs text-gray-500 mb-1">Batch Size</p>
                <p className="font-semibold text-gray-800">{selectedProduct.batchSize}</p>
              </div>
            </div>
          </div>

          {/* Certifications */}
          {selectedProduct.certifications && selectedProduct.certifications.length > 0 && (
            <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <Award className="h-5 w-5 text-blue-600" />
                <p className="font-semibold text-gray-800">Certifications</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedProduct.certifications.map((cert, idx) => (
                  <Badge key={idx} variant="info" className="text-sm">
                    {cert}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Blockchain Details */}
          <div className="p-4 bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg text-white">
            <div className="flex items-center gap-2 mb-4">
              <Hash className="h-5 w-5" />
              <p className="font-semibold">Blockchain Information</p>
            </div>
            <div className="space-y-3 text-sm font-mono">
              <div>
                <p className="text-gray-400 text-xs mb-1">Block ID</p>
                <p className="text-green-400">{selectedProduct.id}</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs mb-1">Block Hash</p>
                <p className="text-green-400 break-all">{selectedProduct.blockHash}</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs mb-1">Farmer Wallet Address</p>
                <p className="text-green-400 break-all">{selectedProduct.farmerAddress}</p>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-3 border-t border-gray-700">
                <div>
                  <p className="text-gray-400 text-xs mb-1">Transaction Fee</p>
                  <p className="text-yellow-400 font-semibold">
                    {(selectedProduct.transactionFee || 0).toFixed(4)} ETH
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs mb-1">Timestamp</p>
                  <p className="text-blue-400">{formatDateTime(selectedProduct.timestamp)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Verifications */}
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 p-3 rounded-full">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Verifications</p>
                <p className="text-2xl font-bold text-green-700">{selectedProduct.verifications}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">Trust Score</p>
              <p className="text-lg font-semibold text-green-600">
                {Math.min(100, (selectedProduct.verifications || 0) * 20)}%
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}