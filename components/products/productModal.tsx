// src/components/products/ProductModal.tsx
'use client';

import { useState } from 'react';
import { useProducts } from '@/contexts/productContext';
import { formatDateTime } from '@/lib/utils';
import { X, Package, MapPin, Calendar, User, Hash, Award, TrendingUp, Image as ImageIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { CATEGORY_COLORS } from '@/lib/constants';
import { commonColors } from '@/lib/theme/colors';
import Image from 'next/image';
import { Product, ProductCategory, ProductStatus } from '@/types/product';

export function ProductModal() {
  const { selectedProduct, setSelectedProduct } = useProducts();
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);

  if (!selectedProduct) return null;

  // Safely transform the selected product with proper type assertions
  const productData: Product = {
    ...selectedProduct,
    name: selectedProduct.name || 'Unnamed Product',
    category: selectedProduct.category,
    location: selectedProduct.location || 'Unknown',
    harvestDate: selectedProduct.harvestDate || new Date().toISOString().split('T')[0],
    certifications: selectedProduct.certifications || [],
    photos: selectedProduct.photos || [],
    status: selectedProduct.status || 'pending',
    batchSize: selectedProduct.batchSize || 'N/A',
    farmerName: selectedProduct.farmerName || 'Unknown Farmer',
    farmerId: selectedProduct.farmerId || 'unknown',
    verifications: selectedProduct.verifications || 0,
    description: selectedProduct.description || '',
    createdAt: selectedProduct.createdAt || new Date().toISOString(),
    updatedAt: selectedProduct.updatedAt || new Date().toISOString(),
    id: selectedProduct.id,
    metadata: selectedProduct.metadata || {}
  } as Product;

  const category = productData.category;
  // Safely get category color with type assertion
  const categoryColor = CATEGORY_COLORS[category as unknown as keyof typeof CATEGORY_COLORS] || Object.values(CATEGORY_COLORS)[0];
  const photos = productData.photos;

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
                <h3 className="text-2xl font-bold ${commonColors.gray800} mb-1">
                  {productData.name}
                </h3>
                <div className="flex items-center gap-2">
                  <Badge variant={productData.status === 'verified' ? 'success' : 'warning'}>
                    {productData.status.charAt(0).toUpperCase() + productData.status.slice(1)}
                  </Badge>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${categoryColor.bg} ${categoryColor.text}`}>
                    {productData.category}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={() => {
                setSelectedProduct(null);
                setSelectedPhotoIndex(0);
              }}
              className="${commonColors.gray400} hover:${commonColors.gray600} ${commonColors.hoverTransition} ${commonColors.whiteBg} ${commonColors.roundedFull} p-2 ${commonColors.hoverGray100}"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Photos Gallery */}
          {photos.length > 0 && (
            <div className="${commonColors.gray50} rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <ImageIcon className="h-5 w-5 ${commonColors.gray600}" />
                <p className="font-semibold ${commonColors.gray800}">Product Photos ({photos.length})</p>
              </div>
              
              {/* Main Photo */}
              <div className="relative mb-3">
                <Image
                  src={photos[selectedPhotoIndex] || '/placeholder-product.jpg'}
                  alt={`${productData.name} - Main view`}
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
                      alt={`${productData.name} - View ${idx + 1}`}
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
            <div className="flex items-start gap-3 p-4 ${commonColors.gray50} rounded-lg">
              <User className="h-5 w-5 ${commonColors.gray500} mt-0.5" />
              <div>
                <p className="text-xs ${commonColors.gray500} mb-1">Farmer</p>
                <p className="font-semibold ${commonColors.gray800}">{productData.farmerName}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 ${commonColors.gray50} rounded-lg">
              <MapPin className="h-5 w-5 ${commonColors.gray500} mt-0.5" />
              <div>
                <p className="text-xs ${commonColors.gray500} mb-1">Location</p>
                <p className="font-semibold ${commonColors.gray800}">{productData.location}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 ${commonColors.gray50} rounded-lg">
              <Calendar className="h-5 w-5 ${commonColors.gray500} mt-0.5" />
              <div>
                <p className="text-xs ${commonColors.gray500} mb-1">Harvest Date</p>
                <p className="font-semibold ${commonColors.gray800}">{productData.harvestDate}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 ${commonColors.gray50} rounded-lg">
              <Package className="h-5 w-5 ${commonColors.gray500} mt-0.5" />
              <div>
                <p className="text-xs ${commonColors.gray500} mb-1">Batch Size</p>
                <p className="font-semibold ${commonColors.gray800}">{productData.batchSize}</p>
              </div>
            </div>
          </div>

          {/* Certifications */}
          {productData.certifications && productData.certifications.length > 0 && (
            <div className="p-4 ${commonColors.blockchainBg} rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <Award className="h-5 w-5 ${commonColors.blue600}" />
                <p className="font-semibold ${commonColors.gray800}">Certifications</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {productData.certifications.map((cert, idx) => (
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
                <p className="${commonColors.green400}">{productData.id}</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs mb-1">Block Hash</p>
                <p className="${commonColors.green400} break-all">{productData.blockHash || 'N/A'}</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs mb-1">Farmer Wallet Address</p>
                <p className="${commonColors.green400} break-all">{productData.farmerAddress || 'N/A'}</p>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-3 border-t border-gray-700">
                <div>
                  <p className="text-gray-400 text-xs mb-1">Transaction Fee</p>
                  <p className="${commonColors.yellow400} font-semibold">
                    {(productData.transactionFee || 0).toFixed(4)} ETH
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs mb-1">Timestamp</p>
                  <p className="${commonColors.blue500}">
                    {formatDateTime(productData.createdAt || new Date().toISOString())}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Verifications */}
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="${commonColors.red100} p-3 rounded-full">
                <TrendingUp className="h-6 w-6 ${commonColors.green600}" />
              </div>
              <div>
                <p className="text-sm ${commonColors.gray600}">Total Verifications</p>
                <p className="text-2xl font-bold ${commonColors.green700}">{productData.verifications}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs ${commonColors.gray500}">Trust Score</p>
              <p className="text-lg font-semibold ${commonColors.green600}">
                {Math.min(100, (productData.verifications || 0) * 20)}%
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}