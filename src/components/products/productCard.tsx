// src/components/products/ProductCard.tsx
'use client';

import { Package, MapPin, Calendar, Users, CheckCircle, Award, Check } from 'lucide-react';
import { BlockchainRecord } from '@/types/blockchain';
import { useUser } from '@/contexts/userContext';
import { useProducts } from '@/contexts/productContext';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui/status-badge';
import { ProductTitle, ProductDetail, BlockchainDetail, Strong } from '@/components/ui/typography';
import { CATEGORY_COLORS, getCategoryIcon } from '@/lib/constants';
import { useState } from 'react';

interface ProductCardProps {
  record: BlockchainRecord;
}

export function ProductCard({ record }: ProductCardProps) {
  const { userRole } = useUser();
  const { verifyProduct, setSelectedProduct } = useProducts();
  const categoryColor = CATEGORY_COLORS[record.category];
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  const handleVerify = async () => {
    try {
      setIsVerifying(true);
      await verifyProduct(record.id);
      setIsVerified(true);
      // Optional: Show a success message or toast
    } catch (error) {
      console.error('Verification failed:', error);
      // Optional: Show an error message
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <Card variant="bordered" className="hover:shadow-xl transition-shadow duration-300 bg-background">
      <div className="flex flex-col lg:flex-row lg:justify-between">
        <div className="flex-1">
          {/* Header with Category Badge */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center flex-1">
              <div className={`${categoryColor.bg} p-2 rounded-lg mr-3`}>
                {(() => {
                  const Icon = getCategoryIcon(record.category);
                  return <Icon className={`h-6 w-6 ${categoryColor.text}`} />;
                })()}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <ProductTitle>{record.productName}</ProductTitle>
                  <StatusBadge status={record.status} />
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${categoryColor.bg} ${categoryColor.text}`}>
                    {record.category}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Product Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
            <div className="flex items-center">
              <MapPin className="h-4 w-4 text-muted-foreground/70 mr-2 flex-shrink-0" />
              <ProductDetail className="text-foreground">{record.location}</ProductDetail>
            </div>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 text-muted-foreground/70 mr-2 flex-shrink-0" />
              <ProductDetail className="text-foreground">{record.harvestDate}</ProductDetail>
            </div>
            <div className="flex items-center">
              <Users className="h-4 w-4 text-muted-foreground/70 mr-2 flex-shrink-0" />
              <ProductDetail className="text-foreground">{record.farmer}</ProductDetail>
            </div>
            <div className="flex items-center">
              <Package className="h-4 w-4 text-muted-foreground/70 mr-2 flex-shrink-0" />
              <ProductDetail className="text-foreground">{record.batchSize}</ProductDetail>
            </div>
          </div>

          {/* Certifications */}
          {record.certifications && record.certifications.length > 0 && (
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Award className="h-4 w-4 text-muted-foreground" />
                <ProductDetail className="font-medium text-foreground">Certifications:</ProductDetail>
              </div>
              <div className="flex flex-wrap gap-2">
                {record.certifications.map((cert, idx) => (
                  <Badge key={idx} variant="default">
                    {cert}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Blockchain Details */}
          <div className="bg-muted/30 p-3 rounded-lg space-y-1 border border-border">
            <BlockchainDetail>
              <Strong>Block ID:</Strong> {record.id}
            </BlockchainDetail>
            <BlockchainDetail className="truncate">
              <Strong>Block Hash:</Strong> {record.blockHash}
            </BlockchainDetail>
            <BlockchainDetail className="truncate">
              <Strong>Farmer Address:</Strong> {record.farmerAddress}
            </BlockchainDetail>
            <div className="flex justify-between items-center pt-2 border-t border-border/50 mt-2">
              <BlockchainDetail>
                <Strong>Fee:</Strong> {record.transactionFee.toFixed(4)} ETH
              </BlockchainDetail>
              <BlockchainDetail>
                <Strong>Verifications:</Strong> 
                <span className="ml-1 px-2 py-0.5 bg-success/10 text-success-foreground rounded-full font-bold">
                  {record.verifications}
                </span>
              </BlockchainDetail>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="lg:ml-6 mt-4 lg:mt-0 flex flex-col gap-2">
          {userRole === 'retailer' && (
            <>
              {isVerified || record.verifications > 0 ? (
                <div className="flex items-center justify-center gap-2 px-4 py-2 bg-success/10 text-success rounded-md">
                  <Check className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    {isVerified ? 'Verified!' : `Verified ${record.verifications} times`}
                  </span>
                </div>
              ) : (
                <Button
                  onClick={handleVerify}
                  variant="primary"
                  className="w-full lg:w-auto flex items-center justify-center"
                  disabled={isVerifying}
                >
                  {isVerifying ? (
                    'Verifying...'
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Verify Product
                    </>
                  )}
                </Button>
              )}
            </>
          )}
          <Button
            onClick={() => setSelectedProduct(record)}
            variant="secondary"
            className="w-full lg:w-auto"
          >
            View Details
          </Button>
        </div>
      </div>
    </Card>
  );
}