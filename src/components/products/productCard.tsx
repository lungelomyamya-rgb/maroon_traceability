// src/components/products/ProductCard.tsx
'use client';

import { Package, MapPin, Calendar, Users, CheckCircle, Award, Image as ImageIcon } from 'lucide-react';
import { BlockchainRecord } from '@/types/blockchain';
import { useUser } from '@/contexts/userContext';
import { useProducts } from '@/contexts/productContext';
import { ROLE_PERMISSIONS } from '@/types/user';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ProductTitle, ProductDetail, BlockchainDetail, Strong } from '@/components/ui/typography';
import { CATEGORY_COLORS } from '@/lib/constants';
import Image from 'next/image';

interface ProductCardProps {
  record: BlockchainRecord;
}

export function ProductCard({ record }: ProductCardProps) {
  const { user } = useUser();
  const { verifyProduct, setSelectedProduct } = useProducts();
  const categoryColor = CATEGORY_COLORS[record.category];
  const rolePermissions = ROLE_PERMISSIONS[user?.role as keyof typeof ROLE_PERMISSIONS];

  const handleVerify = () => {
    if (!rolePermissions.canVerify) {
      alert(`${rolePermissions.displayName} role cannot verify products. Switch to Inspector or Retailer role.`);
      return;
    }
    verifyProduct(record.id);
  };

  // Cast to access photos if they exist
  const recordWithPhotos = record as BlockchainRecord & { photos?: string[] };

  return (
    <Card variant="outline" className="hover:shadow-xl transition-shadow duration-300">
      <div className="flex flex-col lg:flex-row lg:justify-between">
        <div className="flex-1">
          {/* Header with Category Badge */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center flex-1">
              <div className={`${categoryColor.bg} p-2 rounded-lg mr-3`}>
                <span className="text-2xl">{categoryColor.icon({})}</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <ProductTitle>{record.productName}</ProductTitle>
                  <Badge
                    variant={record.status === 'Certified' ? 'success' : 'warning'}
                  >
                    {record.status}
                  </Badge>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${categoryColor.bg} ${categoryColor.text}`}>
                    {record.category}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Photos Preview */}
          {recordWithPhotos.photos && recordWithPhotos.photos.length > 0 && (
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <ImageIcon className="h-4 w-4 text-gray-600" />
                <ProductDetail className="font-medium">Product Photos ({recordWithPhotos.photos.length})</ProductDetail>
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {recordWithPhotos.photos.slice(0, 3).map((photo, idx) => (
                  <Image
                    key={idx}  // Add key prop
                    src={photo}  // Use the photo from the map, not record.photos[0]
                    alt={`Product photo ${idx + 1}`}
                    width={120}
                    height={120}
                    className="w-24 h-24 object-cover rounded-lg border border-gray-200 cursor-pointer hover:opacity-75 transition-opacity"
                    unoptimized
                    onClick={() => setSelectedProduct(record)}
                  />
                ))}
                {recordWithPhotos.photos.length > 3 && (
                  <div className="w-24 h-24 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors"
                    onClick={() => setSelectedProduct(record)}
                  >
                    <span className="text-sm text-gray-600">+{recordWithPhotos.photos.length - 3}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Product Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
            <div className="flex items-center">
              <MapPin className="h-4 w-4 text-gray-500 mr-2 flex-shrink-0" />
              <ProductDetail>{record.location}</ProductDetail>
            </div>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 text-gray-500 mr-2 flex-shrink-0" />
              <ProductDetail>{record.harvestDate}</ProductDetail>
            </div>
            <div className="flex items-center">
              <Users className="h-4 w-4 text-gray-500 mr-2 flex-shrink-0" />
              <ProductDetail>{record.farmer}</ProductDetail>
            </div>
            <div className="flex items-center">
              <Package className="h-4 w-4 text-gray-500 mr-2 flex-shrink-0" />
              <ProductDetail>{record.batchSize}</ProductDetail>
            </div>
          </div>

          {/* Certifications */}
          {record.certifications && record.certifications.length > 0 && (
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Award className="h-4 w-4 text-gray-600" />
                <ProductDetail className="font-medium">Certifications:</ProductDetail>
              </div>
              <div className="flex flex-wrap gap-2">
                {record.certifications.map((cert, idx) => (
                  <Badge key={idx} variant="info">
                    {cert}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Blockchain Details */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-3 rounded-lg space-y-1 border border-gray-200">
            <BlockchainDetail>
              <Strong>Block ID:</Strong> {record.id}
            </BlockchainDetail>
            <BlockchainDetail className="truncate">
              <Strong>Block Hash:</Strong> {record.blockHash}
            </BlockchainDetail>
            <BlockchainDetail className="truncate">
              <Strong>Farmer Address:</Strong> {record.farmerAddress}
            </BlockchainDetail>
            <div className="flex justify-between items-center pt-2 border-t border-gray-200 mt-2">
              <BlockchainDetail>
                <Strong>Fee:</Strong> {(record.transactionFee || 0).toFixed(4)} ETH
              </BlockchainDetail>
              <BlockchainDetail>
                <Strong>Verifications:</Strong> 
                <span className="ml-1 px-2 py-0.5 bg-green-100 text-green-700 rounded-full font-bold">
                  {record.verifications}
                </span>
              </BlockchainDetail>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="lg:ml-6 mt-4 lg:mt-0 flex flex-col gap-2">
          {rolePermissions.canVerify && (
            <Button
              onClick={handleVerify}
              className="w-full lg:w-auto bg-purple-600 hover:bg-purple-700 flex items-center justify-center"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Verify Product
            </Button>
          )}
          <Button
            onClick={() => setSelectedProduct(record)}
            className="w-full lg:w-auto bg-gray-600 hover:bg-gray-700 text-white"
          >
            View Details
          </Button>
        </div>
      </div>
    </Card>
  );
}
