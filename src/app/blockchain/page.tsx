// src/app/blockchain/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useProducts } from '@/contexts/productContext';
import { useUser } from '@/contexts/userContext';
import { ProductCard } from '@/components/products/productCard';
import { ProductModal } from '@/components/products/productModal';
import { SectionTitle, InfoText } from '@/components/ui/typography';
import { Package, Layers } from 'lucide-react';

export default function BlockchainPage() {
  const { products } = useProducts();
  const { user } = useUser();
  // If not logged in, redirect to home
  const router = useRouter();
  useEffect(() => {
    if (!user) {
      router.push('/');
    }
  }, [user, router]);

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-6 text-center">
        <div className="inline-flex items-center gap-3 mb-4 px-6 py-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-full border border-green-200">
          <Layers className="h-6 w-6 text-green-600" />
          <span className="text-sm font-semibold text-green-700">
            {user?.role === 'farmer' ? '👨‍🌾 My Products' : '🛒 Available Products'}
          </span>
        </div>
        
        <SectionTitle className="mb-2">
          {user?.role === 'farmer' ? 'My Certified Products' : 'Verified Products Marketplace'}
        </SectionTitle>
        
        <div className="flex items-center justify-center gap-2 mt-4">
          <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
          <InfoText className="text-gray-600">
            {products.length} products on blockchain
          </InfoText>
        </div>
      </div>

      {/* Products Grid */}
      {products.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl shadow-lg">
          <div className="bg-gray-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
            <Package className="h-12 w-12 text-gray-400" />
          </div>
          <SectionTitle className="text-gray-400 mb-3">No products found</SectionTitle>
          <InfoText className="text-gray-500">
            {user?.role === 'farmer' 
              ? 'Start by certifying your first product' 
              : 'Check back soon for new certified products'}
          </InfoText>
        </div>
      ) : (
        <div className="space-y-6">
          {products.map((record, index) => (
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