// src/app/blockchain/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useProducts, ProductCategory } from '@/contexts/productContext';
import { useUser } from '@/contexts/userContext';
import { ProductCard } from '@/components/cards';
import { ProductModal } from '@/components/products/productModal';
import { SectionTitle, InfoText } from '@/components/ui/typography';
import { Package, Layers } from 'lucide-react';
import { textColors, commonColors } from '@/lib/theme/colors';
import { BlockchainRecord } from '@/types/blockchain';

function BlockchainContent() {
  const [isClient, setIsClient] = useState(false);
  const { products } = useProducts();
  const { currentUser } = useUser();
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
    
    if (!currentUser) {
      router.push('/');
    }
  }, [currentUser, router]);

  if (!isClient || !currentUser) {
    return null;
  }

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-6 text-center">
        <div className="inline-flex items-center gap-3 mb-4 px-6 py-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-full border border-green-200">
          <Layers className="h-6 w-6 ${commonColors.green600}" />
          <span className="text-sm font-semibold text-green-700">
            {currentUser?.role === 'farmer' ? '👨‍🌾 My Products' : '🛒 Available Products'}
          </span>
        </div>
        
        <SectionTitle className="mb-2">
          {currentUser?.role === 'farmer' ? 'My Certified Products' : 'Verified Products Marketplace'}
        </SectionTitle>
        
        <div className="flex items-center justify-center gap-2 mt-4">
          <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
          <InfoText className={`${textColors.primary}`}>
            {products.length} products on blockchain
          </InfoText>
        </div>
      </div>

      {/* Products Grid */}
      {products.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl shadow-lg">
          <div className="${commonColors.gray100} w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
            <Package className="h-12 w-12 ${commonColors.gray400}" />
          </div>
          <SectionTitle className="${commonColors.gray400} mb-3">No products found</SectionTitle>
          <InfoText className="${commonColors.gray500}">
            {currentUser?.role === 'farmer' 
              ? 'Start by certifying your first product' 
              : 'Check back soon for new certified products'}
          </InfoText>
        </div>
      ) : (
        <div className="space-y-6">
          {products.map((product, index) => {
            // Create a properly typed blockchain record
            const blockchainRecord: BlockchainRecord = {
              id: product.id,
              productName: product.name,
              description: product.description || '',
              category: ProductCategory.FRUITS,
              farmer: currentUser?.name || 'Unknown Farmer',
              location: 'Unknown', // Default location, adjust as needed
              harvestDate: new Date().toISOString().split('T')[0], // Default to today
              photos: [],
              certifications: [],
              timestamp: product.createdAt,
              txHash: '',
              verified: false, // Default to false if not provided
              status: 'Certified',
              batchSize: '1',
              verifications: 0, // Default to 0 verifications
              isPublic: true, // Default to public
              farmerAddress: '', // Default empty address
            };
            
            return (
              <div 
                key={product.id}
                className="animate-slide-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <ProductCard 
                  variant="default"
                  data={{
                    id: blockchainRecord.id,
                    name: blockchainRecord.productName || 'Unnamed Product',
                    category: blockchainRecord.category || ProductCategory.FRUITS,
                    status: 'verified',
                    description: `Harvested on ${blockchainRecord.harvestDate}`,
                    onView: () => router.push(`/trace/${blockchainRecord.id}`),
                    className: 'shadow-md hover:shadow-lg transition-shadow'
                  }}
                />
              </div>
            );
          })}
        </div>
      )}

      <ProductModal />
    </div>
  );
}

export default BlockchainContent;