// src/app/trace/[id]/traceClient.tsx
'use client';

import React from 'react';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { productCategories } from '@/lib/productCategories';
import { Shield, MapPin, Calendar, User, CheckCircle, Package, ArrowRight, ArrowLeft } from 'lucide-react';
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
      // Mock data - replace with API call
      setProduct({
        id: params.id as string,
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
        status: 'Certified',
        transactionFee: 0.002,
        verifications: 3,
      });

      setEvents([
        {
          id: 'evt1',
          productId: params.id as string,
          type: 'planting',
          actor: 'John Doe',
          actorRole: 'farmer',
          timestamp: '2025-07-01T09:00:00Z',
          location: 'Field A, Green Valley Farm',
          notes: 'Planted 1000 apple seedlings',
          photos: [],
          syncStatus: 'synced',
          data: {}
        },
        {
          id: 'evt2',
          productId: params.id as string,
          type: 'growth',
          actor: 'John Doe',
          actorRole: 'farmer',
          timestamp: '2025-08-15T10:30:00Z',
          location: 'Field A, Green Valley Farm',
          notes: 'Healthy growth, no pests detected',
          photos: [],
          syncStatus: 'synced',
          data: {}
        },
        {
          id: 'evt3',
          productId: params.id as string,
          type: 'harvest',
          actor: 'John Doe',
          actorRole: 'farmer',
          timestamp: '2025-09-10T08:30:00Z',
          location: 'Field A, Green Valley Farm',
          notes: 'Harvested 500kg of organic apples',
          photos: [],
          syncStatus: 'synced',
          data: {}
        },
        {
          id: 'evt4',
          productId: params.id as string,
          type: 'quality-inspection',
          actor: 'Inspector Jane',
          actorRole: 'inspector',
          timestamp: '2025-09-10T14:00:00Z',
          location: 'Green Valley Farm',
          notes: 'Passed all quality checks. Grade A+',
          photos: [],
          syncStatus: 'synced',
          data: {}
        },
        {
          id: 'evt5',
          productId: params.id as string,
          type: 'collection',
          actor: 'Swift Logistics',
          actorRole: 'logistics',
          timestamp: '2025-09-11T06:00:00Z',
          location: 'Green Valley Farm',
          notes: 'Collected 500kg for transport',
          photos: [],
          syncStatus: 'synced',
          data: {}
        },
      ]);

      setLoading(false);
    }, 500);
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="${commonColors.gray600}">Loading product information...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-rose-50 flex items-center justify-center p-4">
        <div className="text-center">
          <Package className="h-16 w-16 text-red-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold ${commonColors.gray800} mb-2">Product Not Found</h1>
          <p className="${commonColors.gray600}">This QR code may be invalid or expired.</p>
        </div>
      </div>
    );
  }

  const categoryColor = (product.category in CATEGORY_COLORS) 
    ? CATEGORY_COLORS[product.category as keyof typeof CATEGORY_COLORS] 
    : CATEGORY_COLORS[ProductCategory.FRUITS];

  return (
    <>
      {/* Back Button - Top Corner */}
      <div className="fixed top-2 left-2 z-50">
        <button
          onClick={handleGoBack}
          className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg shadow-md hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="text-sm font-medium">Back</span>
        </button>
      </div>

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Header */}
        <header className="bg-white shadow-sm border-b sticky top-0 z-40">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <div className="flex items-center gap-3">
              <img src={getAssetPath("/images/maroon-logo.png")} alt="MAROON" className="h-8 w-8 text-green-600" />
              <div>
                <h1 className="text-xl font-bold ${commonColors.gray800}">Maroon Blockchain</h1>
                <p className="text-xs ${commonColors.gray500}">Verified Supply Chain</p>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-4xl mx-auto px-4 py-8">
          {/* Product Card */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
            <div className={`${categoryColor.bg} p-6 border-b`}>
              <div className="flex items-center gap-4 mb-4">
                <div className="text-6xl">
                  <span className="h-16 w-16 flex items-center justify-center">
                    {categoryColor.icon}
                  </span>
                </div>
                <div className="flex-1">
                  <h2 className="text-3xl font-bold ${commonColors.gray800} mb-2">{product.productName}</h2>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${categoryColor.bg} ${categoryColor.text} border-2 border-current`}>
                      {product.category}
                    </span>
                    <span className="px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800">
                      ✓ Blockchain Verified
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <User className="h-5 w-5 ${commonColors.gray500} mt-1" />
                <div>
                  <p className="text-xs ${commonColors.gray500} mb-1">Farmer</p>
                  <p className="font-semibold ${commonColors.gray800}">{product.farmer}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 ${commonColors.gray500} mt-1" />
                <div>
                  <p className="text-xs ${commonColors.gray500} mb-1">Location</p>
                  <p className="font-semibold ${commonColors.gray800}">{product.location}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 ${commonColors.gray500} mt-1" />
                <div>
                  <p className="text-xs ${commonColors.gray500} mb-1">Harvest Date</p>
                  <p className="font-semibold ${commonColors.gray800}">{product.harvestDate}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Package className="h-5 w-5 ${commonColors.gray500} mt-1" />
                <div>
                  <p className="text-xs ${commonColors.gray500} mb-1">Batch Size</p>
                  <p className="font-semibold ${commonColors.gray800}">{product.batchSize}</p>
                </div>
              </div>
            </div>

            {product.certifications && product.certifications.length > 0 && (
              <div className="px-6 pb-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm font-semibold text-gray-700 mb-2">Certifications:</p>
                  <div className="flex flex-wrap gap-2">
                    {product.certifications?.map((cert, idx) => (
                      <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                        {cert}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h3 className="text-2xl font-bold ${commonColors.gray800} mb-6 flex items-center gap-2">
              <CheckCircle className="h-6 w-6 text-green-600" />
              Supply Chain Journey
            </h3>

            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-green-500 via-blue-500 to-purple-500"></div>

              {/* Events */}
              <div className="space-y-6">
                {events.map((event, index) => {
                  const config = EVENT_CONFIG[event.type];
                  return (
                    <div key={event.id} className="relative flex gap-4 pl-16">
                      {/* Timeline dot */}
                      <div className="absolute left-3 top-2 w-6 h-6 rounded-full bg-white border-4 border-green-500 shadow-md"></div>

                      {/* Event card */}
                      <div className="flex-1 bg-gradient-to-br from-gray-50 to-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">{config.icon}</span>
                            <div>
                              <h4 className="font-semibold ${commonColors.gray800}">{config.label}</h4>
                              <p className="text-xs ${commonColors.gray500}">{config.description}</p>
                            </div>
                          </div>
                          {index < events.length - 1 && (
                            <ArrowRight className="h-5 w-5 text-gray-400" />
                          )}
                        </div>

                        <div className="mt-3 space-y-1 text-sm">
                          <p className="text-gray-700"><strong>By:</strong> {event.actor} ({event.actorRole})</p>
                          <p className="text-gray-700"><strong>When:</strong> {formatDateTime(event.timestamp)}</p>
                          {event.location && (
                            <p className="text-gray-700"><strong>Where:</strong> {event.location}</p>
                          )}
                          {event.notes && (
                            <p className="${commonColors.gray600} mt-2 italic">&quot;{event.notes}&quot;</p>
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
          <div className="mt-8 bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 text-white">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <img src={getAssetPath("/images/maroon-logo.png")} alt="MAROON" className="h-6 w-6 text-green-400" />
              Blockchain Verification
            </h3>
            <div className="space-y-2 text-sm font-mono">
              <p><span className="text-gray-400">Block ID:</span> <span className="text-green-400">{product.id}</span></p>
              <p><span className="text-gray-400">Block Hash:</span> <span className="text-green-400 break-all">{product.blockHash}</span></p>
              <p><span className="text-gray-400">Verifications:</span> <span className="text-yellow-400">{product.verifications}</span></p>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center text-sm ${commonColors.gray500}">
            <p>Powered by Maroon Blockchain</p>
            <p className="mt-1">Immutable • Transparent • Verified</p>
          </div>
        </main>
      </div>
    </>
  );
}