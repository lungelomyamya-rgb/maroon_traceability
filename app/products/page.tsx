// src/app/products/page.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/cards';
import { Plus, Search, Filter } from 'lucide-react';
import { getAssetPath } from '@/lib/utils/assetPath';
import { Package, Layers, Shield } from 'lucide-react';
import { textColors, commonColors } from '@/lib/theme/colors';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { ErrorBoundary } from '@/components/errorBoundary';
import { ProductCategory } from '@/types/product';
import { CATEGORY_COLORS } from '@/lib/constants';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { InfoText, SectionTitle } from '@/components/ui/typography';

// Mock public products data
const mockPublicProducts = [
  {
    id: 'PRD-2024-001',
    name: 'Organic Apples',
    category: 'Fruits' as ProductCategory,
    farmer: 'Green Valley Farm',
    location: 'Stellenbosch, Western Cape',
    harvestDate: '2025-09-10',
    certifications: ['Organic', 'Fair Trade'],
    status: 'verified',
    price: 45.99,
    image: getAssetPath('/images/maroon-logo.png'),
    description: 'Fresh organic apples grown without pesticides'
  },
  {
    id: 'PRD-2024-002',
    name: 'Free Range Eggs',
    category: 'Dairy' as ProductCategory,
    farmer: 'Sunny Side Farm',
    location: 'Paarl, Western Cape',
    harvestDate: '2025-09-08',
    certifications: ['Free Range', 'Organic'],
    status: 'verified',
    price: 28.50,
    image: getAssetPath('/images/maroon-logo.png'),
    description: 'Farm-fresh eggs from free-range chickens'
  },
  {
    id: 'PRD-2024-003',
    name: 'Heirloom Tomatoes',
    category: 'Vegetables' as ProductCategory,
    farmer: 'Heritage Gardens',
    location: 'Franschhoek, Western Cape',
    harvestDate: '2025-09-12',
    certifications: ['Organic', 'Heirloom'],
    status: 'verified',
    price: 32.75,
    image: getAssetPath('/images/maroon-logo.png'),
    description: 'Premium heirloom tomatoes with rich flavor'
  },
  {
    id: 'PRD-2024-004',
    name: 'Artisan Cheese',
    category: 'Dairy' as ProductCategory,
    farmer: 'Mountain Dairy',
    location: 'Greyton, Western Cape',
    harvestDate: '2025-09-05',
    certifications: ['Artisan', 'Organic'],
    status: 'verified',
    price: 89.99,
    image: getAssetPath('/images/maroon-logo.png'),
    description: 'Handcrafted artisan cheese from grass-fed cows'
  },
  {
    id: 'PRD-2024-005',
    name: 'Wild Honey',
    category: 'Other' as ProductCategory,
    farmer: 'Bee Haven',
    location: 'Cederberg, Western Cape',
    harvestDate: '2025-08-20',
    certifications: ['Wild', 'Organic'],
    status: 'verified',
    price: 65.00,
    image: getAssetPath('/images/maroon-logo.png'),
    description: 'Pure wild honey from remote mountain regions'
  },
  {
    id: 'PRD-2024-006',
    name: 'Organic Spinach',
    category: 'Vegetables' as ProductCategory,
    farmer: 'Green Leaf Farm',
    location: 'Wellington, Western Cape',
    harvestDate: '2025-09-11',
    certifications: ['Organic', 'Non-GMO'],
    status: 'verified',
    price: 18.99,
    image: getAssetPath('/images/maroon-logo.png'),
    description: 'Fresh organic spinach rich in nutrients'
  }
];

function ProductsContent() {
  const [isClient, setIsClient] = useState(false);
  const [products, setProducts] = useState(mockPublicProducts);
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'all'>('all');
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(product => product.category === selectedCategory);

  const categories = Array.from(new Set(products.map(p => p.category)));

  const handleViewTrace = (productId: string) => {
    router.push(`/public-access/trace/${productId}`);
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="inline-flex items-center gap-3 mb-4 px-6 py-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-full border border-green-200">
          <Layers className="h-6 w-6 text-green-600" />
          <span className="text-sm font-semibold text-green-700">
            🛒 Verified Products on Blockchain
          </span>
        </div>
        
        <InfoText className="text-primary mb-6">
          Explore our selection of blockchain-verified products from trusted local farmers
        </InfoText>

        <div className="flex items-center justify-center gap-2">
          <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
          <InfoText className={`${textColors.primary}`}>
            {filteredProducts.length} products found
          </InfoText>
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl shadow-lg">
          <div className={`${commonColors.gray100} w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6`}>
            <Package className="h-12 w-12 text-gray-400" />
          </div>
          <SectionTitle className="text-gray-400 mb-3">No products found</SectionTitle>
          <InfoText className="text-gray-500">
            Try selecting a different category or check back soon
          </InfoText>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => {
            const categoryColor = CATEGORY_COLORS[product.category as keyof typeof CATEGORY_COLORS];
            const defaultColor = { bg: 'bg-gray-100', text: 'text-gray-800', icon: '📦' };
            const safeCategoryColor = categoryColor || defaultColor;
            
            // Maroon category icons mapping
            const categoryIcons: Record<string, string> = {
              'Fruits': '🍎',
              'Vegetables': '🥬',
              'Dairy': '🥛',
              'Other': '🍯',
              'Meat': '🥩',
              'Grains': '🌾'
            };
            
            const categoryIcon = categoryIcons[product.category] || '📦';
            
            return (
              <div key={product.id} className="bg-white border rounded-2xl overflow-hidden hover:shadow-xl transition-shadow group">
                {/* Image Section */}
                <div className="relative">
                  <div className="w-full h-32 bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center group-hover:scale-105 transition-transform duration-300 rounded-t-2xl">
                    <div className="text-center">
                      <div className="text-4xl mb-2">
                        {categoryIcon}
                      </div>
                      <p className="text-sm text-green-700 font-medium">{product.category}</p>
                    </div>
                  </div>
                </div>
                
                {/* Content Section */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{product.name}</h3>
                  
                  {/* Category and Verification Badges */}
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">{safeCategoryColor.icon}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${safeCategoryColor.bg} ${safeCategoryColor.text} border-2 border-current`}>
                      {product.category}
                    </span>
                    <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                      ✓ Verified
                    </span>
                  </div>
                  
                  {/* Farmer Info */}
                  <p className="text-sm text-gray-600 mb-2">by {product.farmer}</p>
                  <p className="text-sm text-gray-500 mb-3">{product.location}</p>
                  
                  {/* Blockchain Verification */}
                  <div className="flex items-center justify-end mb-4">
                    <div className="flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-shield h-4 w-4 text-green-600">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"></path>
                      </svg>
                      <span className="text-xs text-green-600">Blockchain</span>
                    </div>
                  </div>

                  {/* View Full Trace Button */}
                  <Button
                    onClick={() => handleViewTrace(product.id)}
                    variant="outline"
                    className="w-full"
                    size="sm"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-shield h-4 w-4 mr-2">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"></path>
                    </svg>
                    View Full Trace
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Footer Info */}
      <div className="mt-12 text-center">
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Shield className="h-5 w-5 text-green-600" />
            <h4 className="font-semibold text-green-900">Public Blockchain Verification</h4>
          </div>
          <p className="text-sm text-green-800 mb-4">
            All products are verified on the blockchain for complete transparency. 
            Click "View Full Trace" to see the complete supply chain journey.
          </p>
          <Button
            onClick={() => router.push('/public-access')}
            variant="outline"
            className="text-green-700 border-green-300 hover:bg-green-100"
          >
            Back to Public Access
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <ErrorBoundary>
      <DashboardLayout
        title="Products Marketplace"
        subtitle="Browse blockchain-verified products from trusted farmers"
      >
        <ProductsContent />
      </DashboardLayout>
    </ErrorBoundary>
  );
}
