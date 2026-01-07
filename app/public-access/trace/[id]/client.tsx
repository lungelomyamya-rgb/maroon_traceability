// app/public-access/trace/[id]/client.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Shield, MapPin, Calendar, User, CheckCircle, Package, ArrowRight, Share2, Printer, Smartphone, QrCode } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { ErrorBoundary } from '@/components/errorBoundary';
import { formatDateTime } from '@/lib/utils';
import { commonColors } from '@/lib/theme/colors';
import { getAssetPath } from '@/lib/utils/assetPath';

interface PublicTraceEvent {
  id: string;
  productId: string;
  type: string;
  actor: string;
  actorRole: string;
  timestamp: string;
  location: string;
  notes: string;
  photos: string[];
  syncStatus: string;
  data: any;
}

const EVENT_CONFIG: Record<string, { icon: string; label: string; description: string }> = {
  planting: { icon: '🌱', label: 'Planting', description: 'Seeds planted' },
  growth: { icon: '🌿', label: 'Growth', description: 'Growing phase' },
  harvest: { icon: '🌾', label: 'Harvest', description: 'Product harvested' },
  'quality-inspection': { icon: '🔍', label: 'Quality Check', description: 'Quality inspection completed' },
  collection: { icon: '🚚', label: 'Collection', description: 'Collected for transport' },
  packaging: { icon: '📦', label: 'Packaging', description: 'Product packaged' },
  shipping: { icon: '🚢', label: 'Shipping', description: 'Product in transit' },
  delivery: { icon: '🏪', label: 'Delivery', description: 'Delivered to retailer' }
};

export default function PublicTraceClient() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<any>(null);
  const [events, setEvents] = useState<PublicTraceEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [shareUrl, setShareUrl] = useState('');

  useEffect(() => {
    // Set share URL
    if (typeof window !== 'undefined') {
      setShareUrl(window.location.href);
    }

    // Simulate loading product data
    setTimeout(() => {
      const productId = params.id as string;
      const mockProduct = {
        id: productId,
        productName: productId === 'BLK001' ? 'Organic Apples' : 
                     productId === 'BLK002' ? 'Free-Range Eggs' :
                     productId === 'BLK003' ? 'Grass-Fed Beef' :
                     productId === 'BLK004' ? 'Fresh Spinach' : 'Product',
        description: `High-quality product from our certified farms, grown with sustainable practices and verified for quality and safety.`,
        category: productId === 'BLK001' ? 'Fruits' : 
                  productId === 'BLK002' ? 'Poultry' :
                  productId === 'BLK003' ? 'Beef' :
                  productId === 'BLK004' ? 'Vegetables' : 'Other',
        farmer: productId === 'BLK001' ? 'Green Valley Farm' : 
                productId === 'BLK002' ? 'Sunrise Poultry' :
                productId === 'BLK003' ? 'Karoo Cattle Co.' :
                productId === 'BLK004' ? 'Leafy Greens Farm' : 'Local Farm',
        farmerAddress: '0x742d35Cc6634C0532925a3b8D1750B87B02B6C71',
        location: productId === 'BLK001' ? 'Stellenbosch, Western Cape' : 
                  productId === 'BLK002' ? 'Robertson, Western Cape' :
                  productId === 'BLK003' ? 'Graaff-Reinet, Eastern Cape' :
                  productId === 'BLK004' ? 'Paarl, Western Cape' : 'South Africa',
        harvestDate: '2025-09-10',
        certifications: ['Organic', 'Fair Trade', 'Non-GMO'],
        batchSize: '500kg',
        blockHash: '0x4f3c2a1b8e7d6c5a9b8e7f6d5c4a3b2c1d0e9f8a',
        timestamp: new Date('2025-09-10T08:30:00Z').getTime(),
        txHash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
        verified: true,
        status: 'Certified',
        transactionFee: 0.002,
        verifications: 3,
      };

      const mockEvents: PublicTraceEvent[] = [
        {
          id: 'evt1',
          productId: productId,
          type: 'planting',
          actor: 'John Farmer',
          actorRole: 'farmer',
          timestamp: '2025-07-01T09:00:00Z',
          location: 'Field A, Local Farm',
          notes: 'Planted with organic seeds and sustainable farming practices',
          photos: [],
          syncStatus: 'synced',
          data: {}
        },
        {
          id: 'evt2',
          productId: productId,
          type: 'growth',
          actor: 'John Farmer',
          actorRole: 'farmer',
          timestamp: '2025-08-15T10:30:00Z',
          location: 'Field A, Local Farm',
          notes: 'Healthy growth observed, no pests detected',
          photos: [],
          syncStatus: 'synced',
          data: {}
        },
        {
          id: 'evt3',
          productId: productId,
          type: 'harvest',
          actor: 'John Farmer',
          actorRole: 'farmer',
          timestamp: '2025-09-10T08:30:00Z',
          location: 'Field A, Local Farm',
          notes: 'Harvested at peak freshness, all quality standards met',
          photos: [],
          syncStatus: 'synced',
          data: {}
        },
        {
          id: 'evt4',
          productId: productId,
          type: 'quality-inspection',
          actor: 'Inspector Jane',
          actorRole: 'inspector',
          timestamp: '2025-09-10T14:00:00Z',
          location: 'Local Farm',
          notes: 'Passed all quality checks. Grade A+ quality.',
          photos: [],
          syncStatus: 'synced',
          data: {}
        },
        {
          id: 'evt5',
          productId: productId,
          type: 'collection',
          actor: 'Swift Logistics',
          actorRole: 'logistics',
          timestamp: '2025-09-11T06:00:00Z',
          location: 'Local Farm',
          notes: 'Collected for transport to packaging facility',
          photos: [],
          syncStatus: 'synced',
          data: {}
        },
        {
          id: 'evt6',
          productId: productId,
          type: 'packaging',
          actor: 'Packaging Co',
          actorRole: 'packager',
          timestamp: '2025-09-11T10:00:00Z',
          location: 'Packaging Facility',
          notes: 'Packaged in certified materials, batch codes applied',
          photos: [],
          syncStatus: 'synced',
          data: {}
        },
        {
          id: 'evt7',
          productId: productId,
          type: 'delivery',
          actor: 'Fresh Market',
          actorRole: 'retailer',
          timestamp: '2025-09-12T09:00:00Z',
          location: 'Fresh Market',
          notes: 'Delivered to retail location, ready for consumer purchase',
          photos: [],
          syncStatus: 'synced',
          data: {}
        }
      ];

      setProduct(mockProduct);
      setEvents(mockEvents);
      setLoading(false);
    }, 800);
  }, [params.id]);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Product Trace: ${product?.productName}`,
          text: `Trace ${product?.productName} from ${product?.farmer} on the blockchain`,
          url: shareUrl
        });
      } catch (error) {
        navigator.clipboard.writeText(shareUrl);
        alert('Link copied to clipboard!');
      }
    } else {
      navigator.clipboard.writeText(shareUrl);
      alert('Link copied to clipboard!');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleScanNew = () => {
    router.push('/public-access#qr-scanner');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product information...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-rose-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <Package className="h-16 w-16 text-red-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Product Not Found</h1>
          <p className="text-gray-600 mb-6">This QR code may be invalid or the product doesn't exist in our system.</p>
          <Button onClick={() => router.push('/public-access')} className="bg-green-600 hover:bg-green-700">
            Back to Public Access
          </Button>
        </div>
      </div>
    );
  }

  const getProductIcon = (category: string) => {
    switch (category) {
      case 'Fruits': return '🍎';
      case 'Poultry': return '🥚';
      case 'Beef': return '🥩';
      case 'Vegetables': return '🥬';
      default: return '📦';
    }
  };

  return (
    <ErrorBoundary>
      <DashboardLayout title="Product Trace">
        <main className="max-w-4xl mx-auto px-4 py-8 flex-1">
          {/* Action Buttons */}
          <div className="flex justify-end gap-2 -mt-6 mb-2 print:hidden">
            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
              className="text-green-700 border-green-300 hover:bg-green-100"
            >
              <Share2 className="h-4 w-4 mr-1" />
              Share
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrint}
              className="text-green-700 border-green-300 hover:bg-green-100"
            >
              <Printer className="h-4 w-4 mr-1" />
              Print Certificate
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleScanNew}
              className="text-green-700 border-green-300 hover:bg-green-100"
            >
              <QrCode className="h-4 w-4 mr-1" />
              Scan New
            </Button>
          </div>

          {/* Product Card */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
            <div className="bg-green-100 p-4 border-b relative h-32">
              <div className="absolute right-4 top-4 flex items-center justify-center">
                <img src={getAssetPath("/images/maroon-logo.png")} alt="MAROON" className="h-20 w-20 opacity-80" />
              </div>
              <div className="relative z-10 flex items-center gap-4">
                <div className="text-4xl">{getProductIcon(product.category)}</div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-800 mb-1">{product.productName}</h2>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-200 text-green-800 border-2 border-current">
                      {product.category}
                    </span>
                    <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                      ✓ Blockchain Verified
                    </span>
                    <span className="px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                      Public Access
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <User className="h-5 w-5 text-gray-500 mt-1" />
                <div>
                  <p className="text-xs text-gray-500 mb-1">Farmer</p>
                  <p className="font-semibold text-gray-800">{product.farmer}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-gray-500 mt-1" />
                <div>
                  <p className="text-xs text-gray-500 mb-1">Location</p>
                  <p className="font-semibold text-gray-800">{product.location}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-gray-500 mt-1" />
                <div>
                  <p className="text-xs text-gray-500 mb-1">Harvest Date</p>
                  <p className="font-semibold text-gray-800">{product.harvestDate}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Package className="h-5 w-5 text-gray-500 mt-1" />
                <div>
                  <p className="text-xs text-gray-500 mb-1">Batch Size</p>
                  <p className="font-semibold text-gray-800">{product.batchSize}</p>
                </div>
              </div>
            </div>

            {product.certifications && product.certifications.length > 0 && (
              <div className="px-6 pb-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm font-semibold text-gray-700 mb-2">Certifications:</p>
                  <div className="flex flex-wrap gap-2">
                    {product.certifications?.map((cert: string, idx: number) => (
                      <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                        {cert}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="px-6 pb-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm font-semibold text-gray-700 mb-2">Description:</p>
                <p className="text-sm text-gray-600">{product.description}</p>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
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
                              <h4 className="font-semibold text-gray-800">{config.label}</h4>
                              <p className="text-xs text-gray-500">{config.description}</p>
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
                            <p className="text-gray-600 mt-2 italic">"{event.notes}"</p>
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
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 text-white mb-8">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <img src={getAssetPath("/images/Maroon (4).png")} alt="MAROON" className="h-6 w-6 text-green-400" />
              Blockchain Verification
            </h3>
            <div className="space-y-2 text-sm font-mono">
              <p><span className="text-gray-400">Product ID:</span> <span className="text-green-400">{product.id}</span></p>
              <p><span className="text-gray-400">Block Hash:</span> <span className="text-green-400 break-all">{product.blockHash}</span></p>
              <p><span className="text-gray-400">Transaction:</span> <span className="text-green-400 break-all">{product.txHash}</span></p>
              <p><span className="text-gray-400">Verifications:</span> <span className="text-yellow-400">{product.verifications}</span></p>
              <p><span className="text-gray-400">Status:</span> <span className="text-green-400">{product.status}</span></p>
            </div>
          </div>

          {/* Public Access Info */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8">
            <div className="flex items-center gap-2 mb-2">
              <img src={getAssetPath("/images/Maroon (4).png")} alt="MAROON" className="h-5 w-5 text-green-600" />
              <h4 className="font-semibold text-green-900">Public Access Information</h4>
            </div>
            <p className="text-sm text-green-800 mb-3">
              This product information is publicly accessible for transparency and consumer trust. 
              No login is required to view this trace information.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handleShare}
                className="text-green-700 border-green-300 hover:bg-green-100"
              >
                <Share2 className="h-4 w-4 mr-1" />
                Share This Trace
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrint}
                className="text-green-700 border-green-300 hover:bg-green-100"
              >
                <Printer className="h-4 w-4 mr-1" />
                Print Certificate
              </Button>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center text-xs text-gray-500 print:hidden py-2 pt-2 pb-0">
            <p>Powered by Maroon Blockchain</p>
            <div className="mt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push('/public-access')}
              >
                ← Back to Public Access
              </Button>
            </div>
          </div>
        </main>
      </DashboardLayout>
    </ErrorBoundary>
  );
}
