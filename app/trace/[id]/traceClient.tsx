// src/app/trace/[id]/traceClient.tsx
'use client';

import React from 'react';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { productCategories } from '@/lib/productCategories';
import { Shield, MapPin, Calendar, User, CheckCircle, Package, ArrowRight } from 'lucide-react';
import { Product, ProductCategory } from '@/types/product';
import type { BlockchainRecord } from '@/types/blockchain';
import { ProductEvent, EVENT_CONFIG } from '@/types/events';
import { CATEGORY_COLORS } from '@/lib/constants';
import { formatDateTime } from '@/lib/utils';
import { commonColors } from '@/lib/theme/colors';
import { getAssetPath } from '@/lib/utils/assetPath';

interface TraceClientProps {
  id: string;
}

// Extend BlockchainRecord to include the category as a key of CATEGORY_COLORS
type ProductWithCategory = Omit<BlockchainRecord, 'category'> & {
  category: keyof typeof CATEGORY_COLORS;
};

export default function TraceClient({ id }: TraceClientProps) {
  const params = useParams();
    const [product, setProduct] = useState<ProductWithCategory | null>(null);
  const [events, setEvents] = useState<ProductEvent[]>([]);
  const [loading, setLoading] = useState(true);

  const handleGoBack = () => {
    console.log('Back button clicked');
    try {
      window.history.back();
    } catch (error) {
      console.error('Error going back:', error);
      // Fallback to navigate to home
      window.location.href = '/';
    }
  };

  useEffect(() => {
    // In production, fetch from API
    // For now, simulate loading
    setTimeout(() => {
      // Mock data based on product ID - replace with API call
      const productId = params.id as string;
      let mockProduct;
      let mockEvents;

      // Different mock data based on product ID
      if (productId.includes('APPLE') || productId.includes('001')) {
        mockProduct = {
          id: productId,
          productName: 'Organic Apples',
          description: 'Fresh organic apples from Green Valley Farm',
          category: 'Fruits' as keyof typeof CATEGORY_COLORS,
          farmer: 'Green Valley Farm',
          farmerAddress: '0x742d35Cc6634C0532925a3b8D1750B87B02B6C71',
          location: 'Stellenbosch, Western Cape',
          harvestDate: '2025-09-10',
          certifications: ['Organic', 'Fair Trade'],
          batchSize: '500kg',
          blockHash: '0x4f3c2a1b8e7d6c5a9b8e7f6d5c4a3b2c1d0e9f8a',
          timestamp: new Date('2025-09-10T08:30:00Z').getTime(),
          txHash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
          verified: true,
          status: 'Certified' as const,
          transactionFee: 0.002,
          verifications: 3,
        };
      } else if (productId.includes('TOMATO') || productId.includes('002')) {
        mockProduct = {
          id: productId,
          productName: 'Premium Tomatoes',
          description: 'Vine-ripened tomatoes grown with sustainable practices',
          category: 'Vegetables' as keyof typeof CATEGORY_COLORS,
          farmer: 'Sunshine Vegetables',
          farmerAddress: '0x8ba1f109551bD432803012645Hac136c',
          location: 'Pretoria, Gauteng',
          harvestDate: '2025-09-15',
          certifications: ['Organic', 'Non-GMO'],
          batchSize: '300kg',
          blockHash: '0x8a7b6c5d4e3f2a1b9c8d7e6f5a4b3c2d1e0f9a8',
          timestamp: new Date('2025-09-15T07:00:00Z').getTime(),
          txHash: '0x2345678901bcdef1234567890bcdef1234567890bcdef1234567890bcdef1',
          verified: true,
          status: 'Certified' as const,
          transactionFee: 0.0015,
          verifications: 5,
        };
      } else if (productId.includes('MORINGA') || productId.includes('003')) {
        mockProduct = {
          id: productId,
          productName: 'Moringa Powder',
          description: 'Premium organic moringa leaf powder',
          category: 'Herbs' as keyof typeof CATEGORY_COLORS,
          farmer: 'Moringa Wellness Farm',
          farmerAddress: '0x9c2b1a0d9f8e7c6b5a4d3c2b1a0f9e8d7c6b5a4',
          location: 'Limpopo Province',
          harvestDate: '2025-08-20',
          certifications: ['Organic', 'Kosher', 'Halal'],
          batchSize: '50kg',
          blockHash: '0x7d6c5b4a3f2e1d9c8b7a6f5e4d3c2b1a0f9e8d7',
          timestamp: new Date('2025-08-20T10:15:00Z').getTime(),
          txHash: '0x3456789012cdef1234567890cdef1234567890cdef1234567890cdef12',
          verified: true,
          status: 'Certified' as const,
          transactionFee: 0.003,
          verifications: 7,
        };
      } else {
        // Default mock product
        mockProduct = {
          id: productId,
          productName: 'Certified Product',
          description: 'Quality verified agricultural product',
          category: 'Vegetables' as keyof typeof CATEGORY_COLORS,
          farmer: 'Local Farm Cooperative',
          farmerAddress: '0x1234567890abcdef1234567890abcdef12345678',
          location: 'Western Cape, South Africa',
          harvestDate: '2025-09-01',
          certifications: ['Organic'],
          batchSize: '100kg',
          blockHash: '0x6c5b4a3f2e1d9c8b7a6f5e4d3c2b1a0f9e8d7c6b',
          timestamp: new Date('2025-09-01T09:00:00Z').getTime(),
          txHash: '0x4567890123def1234567890def1234567890def1234567890def123',
          verified: true,
          status: 'Certified' as const,
          transactionFee: 0.001,
          verifications: 2,
        };
      }

      // Generate events based on product type
      if (productId.includes('APPLE') || productId.includes('001')) {
        mockEvents = [
          {
            id: 'evt1',
            productId: productId,
            type: 'planting' as const,
            actor: 'John Doe',
            actorRole: 'farmer',
            timestamp: '2025-07-01T09:00:00Z',
            location: 'Field A, Green Valley Farm',
            notes: 'Planted 1000 apple seedlings',
            photos: [],
            syncStatus: 'synced' as const,
            data: {}
          },
          {
            id: 'evt2',
            productId: productId,
            type: 'growth' as const,
            actor: 'John Doe',
            actorRole: 'farmer',
            timestamp: '2025-08-15T10:30:00Z',
            location: 'Field A, Green Valley Farm',
            notes: 'Healthy growth, no pests detected',
            photos: [],
            syncStatus: 'synced' as const,
            data: {}
          },
          {
            id: 'evt3',
            productId: productId,
            type: 'harvest' as const,
            actor: 'John Doe',
            actorRole: 'farmer',
            timestamp: '2025-09-10T08:30:00Z',
            location: 'Field A, Green Valley Farm',
            notes: 'Harvested 500kg of organic apples',
            photos: [],
            syncStatus: 'synced' as const,
            data: {}
          },
          {
            id: 'evt4',
            productId: productId,
            type: 'quality-inspection' as const,
            actor: 'Inspector Jane',
            actorRole: 'inspector',
            timestamp: '2025-09-10T14:00:00Z',
            location: 'Green Valley Farm',
            notes: 'Passed all quality checks. Grade A+',
            photos: [],
            syncStatus: 'synced' as const,
            data: {}
          },
          {
            id: 'evt5',
            productId: productId,
            type: 'collection' as const,
            actor: 'Swift Logistics',
            actorRole: 'logistics',
            timestamp: '2025-09-11T06:00:00Z',
            location: 'Green Valley Farm',
            notes: 'Collected 500kg for transport',
            photos: [],
            syncStatus: 'synced' as const,
            data: {}
          },
        ];
      } else if (productId.includes('TOMATO') || productId.includes('002')) {
        mockEvents = [
          {
            id: 'evt1',
            productId: productId,
            type: 'planting' as const,
            actor: 'Maria Rodriguez',
            actorRole: 'farmer',
            timestamp: '2025-07-15T08:00:00Z',
            location: 'Greenhouse B, Sunshine Vegetables',
            notes: 'Planted tomato seedlings in controlled environment',
            photos: [],
            syncStatus: 'synced' as const,
            data: {}
          },
          {
            id: 'evt2',
            productId: productId,
            type: 'growth' as const,
            actor: 'Maria Rodriguez',
            actorRole: 'farmer',
            timestamp: '2025-08-20T09:15:00Z',
            location: 'Greenhouse B, Sunshine Vegetables',
            notes: 'Optimal growth conditions maintained',
            photos: [],
            syncStatus: 'synced' as const,
            data: {}
          },
          {
            id: 'evt3',
            productId: productId,
            type: 'harvest' as const,
            actor: 'Maria Rodriguez',
            actorRole: 'farmer',
            timestamp: '2025-09-15T07:00:00Z',
            location: 'Greenhouse B, Sunshine Vegetables',
            notes: 'Harvested 300kg of vine-ripened tomatoes',
            photos: [],
            syncStatus: 'synced' as const,
            data: {}
          },
          {
            id: 'evt4',
            productId: productId,
            type: 'quality-inspection' as const,
            actor: 'Inspector Chen',
            actorRole: 'inspector',
            timestamp: '2025-09-15T12:30:00Z',
            location: 'Sunshine Vegetables',
            notes: 'Excellent quality, perfect ripeness',
            photos: [],
            syncStatus: 'synced' as const,
            data: {}
          },
        ];
      } else {
        // Default events
        mockEvents = [
          {
            id: 'evt1',
            productId: productId,
            type: 'planting' as const,
            actor: 'Farmer Brown',
            actorRole: 'farmer',
            timestamp: '2025-06-01T08:00:00Z',
            location: 'Farm Field',
            notes: 'Initial planting completed',
            photos: [],
            syncStatus: 'synced' as const,
            data: {}
          },
          {
            id: 'evt2',
            productId: productId,
            type: 'harvest' as const,
            actor: 'Farmer Brown',
            actorRole: 'farmer',
            timestamp: '2025-09-01T09:00:00Z',
            location: 'Farm Field',
            notes: 'Product harvested successfully',
            photos: [],
            syncStatus: 'synced' as const,
            data: {}
          },
          {
            id: 'evt3',
            productId: productId,
            type: 'quality-inspection' as const,
            actor: 'Quality Inspector',
            actorRole: 'inspector',
            timestamp: '2025-09-01T14:00:00Z',
            location: 'Processing Facility',
            notes: 'Quality inspection passed',
            photos: [],
            syncStatus: 'synced' as const,
            data: {}
          },
        ];
      }

      setProduct(mockProduct);
      setEvents(mockEvents);
      setLoading(false);
    }, 500);
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-sm sm:text-base text-gray-600">Loading product information...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-rose-50 flex items-center justify-center p-4">
        <div className="text-center max-w-sm">
          <Package className="h-12 w-12 sm:h-16 sm:w-16 text-red-400 mx-auto mb-4" />
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">Product Not Found</h1>
          <p className="text-sm sm:text-base text-gray-600">This QR code may be invalid or expired.</p>
        </div>
      </div>
    );
  }

  const categoryColor = (product.category in CATEGORY_COLORS) 
    ? CATEGORY_COLORS[product.category as keyof typeof CATEGORY_COLORS] 
    : CATEGORY_COLORS[ProductCategory.FRUITS];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Header */}
      <header className="relative z-20">
        <div className="max-w-6xl mx-auto px-0.8 sm:px-1.2 lg:px-1.6 py-0.8 sm:py-1.6 lg:py-3.2">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img src={getAssetPath("/images/maroonLogo.png")} alt="MAROON" className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12" />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-base sm:text-lg lg:text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent truncate">Maroon Blockchain</h1>
              <p className="text-xs sm:text-sm text-gray-500 font-medium hidden sm:block">Verified Supply Chain Traceability</p>
            </div>
            <div className="flex-shrink-0">
              <button
                onClick={handleGoBack}
                className="flex items-center gap-2 px-2 sm:px-3 py-2 bg-white/90 backdrop-blur-sm border border-gray-300 rounded-lg shadow-md hover:bg-white hover:shadow-lg transition-all duration-200"
                aria-label="Go back to previous page"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span className="text-xs sm:text-sm font-medium hidden sm:inline">Back</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-0.8 sm:px-1.2 lg:px-1.6 py-0.8 sm:py-1.6 lg:py-3.2">
        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-4 lg:gap-8 mb-2 lg:mb-4">
            <div className="relative flex-shrink-0">
              <div className="text-4xl sm:text-5xl lg:text-6xl filter drop-shadow-lg">
                <span className="h-14 w-14 sm:h-16 sm:w-16 lg:h-20 lg:w-20 flex items-center justify-center bg-white/60 backdrop-blur-sm rounded-2xl p-2 sm:p-3">
                  {categoryColor.icon}
                </span>
              </div>
              <div className="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 w-5 h-5 sm:w-6 sm:h-6 bg-green-500 rounded-full flex items-center justify-center">
                <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-gray-800" />
              </div>
            </div>
            <div className="flex-1 text-center lg:text-left">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-2 lg:mb-3 drop-shadow-md">{product.productName}</h2>
              <p className="text-sm sm:text-base lg:text-lg text-gray-700 mb-3 sm:mb-4 max-w-3xl">{product.description}</p>
              <div className="flex flex-wrap justify-center lg:justify-start gap-2 sm:gap-3">
                <span className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-semibold ${categoryColor.bg} ${categoryColor.text} border-2 border-white/30 backdrop-blur-sm`}>
                  {product.category}
                </span>
                <span className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-semibold bg-white/80 backdrop-blur-sm text-gray-800 border border-white/30">
                  ✓ Blockchain Verified
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-6 lg:p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          <div className="bg-gradient-to-br from-gray-50 to-white p-3 sm:p-4 lg:p-6 rounded-xl border border-gray-200 hover:shadow-md transition-all duration-200 group">
            <div className="flex items-start gap-2 sm:gap-3">
              <div className="p-1.5 sm:p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors flex-shrink-0">
                <User className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-gray-500 mb-1">Farmer</p>
                <p className="font-semibold text-gray-900 text-sm sm:text-base truncate">{product.farmer}</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-50 to-white p-3 sm:p-4 lg:p-6 rounded-xl border border-gray-200 hover:shadow-md transition-all duration-200 group">
            <div className="flex items-start gap-2 sm:gap-3">
              <div className="p-1.5 sm:p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors flex-shrink-0">
                <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-gray-500 mb-1">Location</p>
                <p className="font-semibold text-gray-900 text-sm sm:text-base truncate">{product.location}</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-50 to-white p-3 sm:p-4 lg:p-6 rounded-xl border border-gray-200 hover:shadow-md transition-all duration-200 group">
            <div className="flex items-start gap-2 sm:gap-3">
              <div className="p-1.5 sm:p-2 bg-orange-100 rounded-lg group-hover:bg-orange-200 transition-colors flex-shrink-0">
                <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-gray-500 mb-1">Harvest Date</p>
                <p className="font-semibold text-gray-900 text-sm sm:text-base truncate">{product.harvestDate}</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-50 to-white p-3 sm:p-4 lg:p-6 rounded-xl border border-gray-200 hover:shadow-md transition-all duration-200 group">
            <div className="flex items-start gap-2 sm:gap-3">
              <div className="p-1.5 sm:p-2 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors flex-shrink-0">
                <Package className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-gray-500 mb-1">Batch Size</p>
                <p className="font-semibold text-gray-900 text-sm sm:text-base truncate">{product.batchSize}</p>
              </div>
            </div>
          </div>
        </div>

        {product.certifications && product.certifications.length > 0 && (
          <div className="px-4 sm:px-6 lg:px-8 pb-4 sm:pb-6">
            <div className="bg-blue-50 p-3 sm:p-4 rounded-lg">
              <p className="text-sm font-semibold text-gray-700 mb-2">Certifications:</p>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {product.certifications?.map((cert, idx) => (
                  <span key={idx} className="px-2 sm:px-3 py-1 bg-blue-100 text-blue-800 text-xs sm:text-sm rounded-full">
                    {cert}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Timeline */}
      <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 lg:p-8">
        <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6 flex items-center gap-2">
          <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
          Supply Chain Journey
        </h3>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-4 sm:left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-green-500 via-blue-500 to-purple-500"></div>

          {/* Events */}
          <div className="space-y-4 sm:space-y-6">
            {events.map((event, index) => {
              const config = EVENT_CONFIG[event.type];
              return (
                <div key={event.id} className="relative flex gap-3 sm:gap-4 pl-12 sm:pl-16">
                  {/* Timeline dot */}
                  <div className="absolute left-1.5 sm:left-3 top-2 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-white border-4 border-green-500 shadow-md">
                    {event.syncStatus === 'synced' && (
                      <CheckCircle className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                    )}
                  </div>

                  {/* Event card */}
                  <div className="flex-1 bg-gradient-to-br from-gray-50 to-white p-3 sm:p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xl sm:text-2xl">{config.icon}</span>
                        <div>
                          <h4 className="font-semibold text-gray-800 text-sm sm:text-base">{config.label}</h4>
                          <p className="text-xs sm:text-xs text-gray-500 hidden sm:block">{config.description}</p>
                        </div>
                      </div>
                      {index < events.length - 1 && (
                        <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 flex-shrink-0 hidden sm:block" />
                      )}
                    </div>

                    <div className="mt-2 sm:mt-3 space-y-1 text-xs sm:text-sm">
                      <p className="text-gray-700"><strong>By:</strong> {event.actor} ({event.actorRole})</p>
                      <p className="text-gray-700"><strong>When:</strong> {formatDateTime(event.timestamp)}</p>
                      {event.location && (
                        <p className="text-gray-700"><strong>Where:</strong> {event.location}</p>
                      )}
                      {event.notes && (
                        <p className="text-gray-600 mt-2 italic">&quot;{event.notes}&quot;</p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Blockchain Verification */}
      <div className="mt-6 sm:mt-8 bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-4 sm:p-6 text-white">
        <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 flex items-center gap-2">
          <img src={getAssetPath("/images/maroonLogo.png")} alt="MAROON" className="h-5 w-5 sm:h-6 sm:w-6 text-green-400" />
          Blockchain Verification
        </h3>
        <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm font-mono">
          <p><span className="text-gray-400">Block ID:</span> <span className="text-green-400 break-all">{product.id}</span></p>
          <p><span className="text-gray-400">Block Hash:</span> <span className="text-green-400 break-all text-xs sm:text-sm">{product.blockHash}</span></p>
          <p><span className="text-gray-400">Verifications:</span> <span className="text-yellow-400">{product.verifications}</span></p>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-6 sm:mt-8 text-center text-xs sm:text-sm text-gray-500">
        <p>Powered by Maroon Blockchain</p>
        <p className="mt-1">Immutable • Transparent • Verified</p>
      </div>
    </div>
  );
}