// src/app/blockchain/page.tsx
'use client';

import { useProducts } from '@/contexts/productContext';
import { useUser } from '@/contexts/userContext';
import { ProductCard } from '@/components/products/productCard';
import { ProductModal } from '@/components/products/productModal';
import { SectionTitle, InfoText } from '@/components/ui/typography';
import { Package, Layers } from 'lucide-react';

export default function BlockchainPage() {
  const { blockchainRecords } = useProducts();
  const { userRole } = useUser();

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="inline-flex items-center gap-3 mb-4 px-6 py-3 bg-gradient-to-r from-primary/5 to-primary/10 rounded-full border border-primary/20">
          <Layers className="h-6 w-6 text-primary" />
          <span className="text-sm font-semibold text-foreground">
            {userRole === 'farmer' ? 'My Products' : 'Available Products'}
          </span>
        </div>
        
        <SectionTitle className="mb-2">
          {userRole === 'farmer' ? 'My Certified Products' : 'Verified Products Marketplace'}
        </SectionTitle>
        
        <div className="flex items-center justify-center gap-2 mt-4">
          <div className="h-2 w-2 bg-primary rounded-full animate-pulse"></div>
          <InfoText className="text-muted-foreground">
            {blockchainRecords.length} products on blockchain
          </InfoText>
        </div>
      </div>

      {/* Products Grid */}
      {blockchainRecords.length === 0 ? (
        <div className="text-center py-20 bg-background rounded-2xl shadow-lg">
          <div className="bg-muted w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
            <Package className="h-12 w-12 text-muted-foreground" />
          </div>
          <SectionTitle className="text-muted-foreground mb-3">No products found</SectionTitle>
          <InfoText className="text-muted-foreground">
            {userRole === 'farmer' 
              ? 'Start by certifying your first product' 
              : 'Check back soon for new certified products'}
          </InfoText>
        </div>
      ) : (
        <div className="space-y-6">
          {blockchainRecords.map((record, index) => (
            <div 
              key={record.id}
              className="animate-slide-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <ProductCard record={record} />
            </div>
          ))}
        </div>
      )}

      <ProductModal />
    </div>
  );
}