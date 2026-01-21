// src/components/marketplace/Categories.tsx
'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Grid3X3 } from 'lucide-react';

interface CategoriesProps {
  categories: string[];
  router: any;
}

export default function Categories({ categories, router }: CategoriesProps) {
  const handleCategoryClick = (category: string) => {
    router.push(`/marketplace/products?category=${encodeURIComponent(category)}`);
  };

  return (
    <section 
      className="py-8 sm:py-12 md:py-16 lg:py-20 bg-white"
      aria-labelledby="categories-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12">
          <h2 id="categories-heading" className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Shop by Category
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl lg:max-w-3xl mx-auto">
            Find exactly what you're looking for from our wide selection of premium agricultural products
          </p>
        </div>
        
        <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 xs:gap-4 sm:gap-4 md:gap-6 lg:gap-8" role="list">
          {categories.map((category) => (
            <Button
              key={category}
              variant="outline"
              onClick={() => handleCategoryClick(category)}
              className="h-20 sm:h-24 md:h-28 lg:h-32 flex flex-col items-center justify-center gap-2 sm:gap-3 hover:border-green-500 hover:bg-green-50 transition-all duration-200 group p-3 sm:p-4 rounded-xl sm:rounded-2xl"
              role="listitem"
              aria-label={`Browse ${category} category`}
            >
              <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl group-hover:scale-110 transition-transform" role="img" aria-label={`${category} icon`}>
                {category === 'Powders' ? '🌿' :
                 category === 'Teas' ? '🍵' :
                 category === 'Supplements' ? '💊' :
                 category === 'Oils' ? '🫒' :
                 category === 'Seeds' ? '🌱' :
                 category === 'Fresh' ? '🥬' :
                 category === 'Poultry' ? '🐔' :
                 category === 'Beef' ? '🥩' :
                 category === 'Vegetables' ? '🥕' :
                 category === 'Honey' ? '🍯' :
                 category === 'Grains' ? '🌾' : '📦'}
              </div>
              <span className="text-xs sm:text-sm font-medium text-gray-700 group-hover:text-green-700">
                {category}
              </span>
            </Button>
          ))}
        </div>

        <div className="mt-8 sm:mt-12 text-center">
          <Button
            onClick={() => router.push('/marketplace/products')}
            className="bg-green-600 hover:bg-green-700 text-white px-6 sm:px-8 md:px-12 py-3 sm:py-4 text-sm sm:text-base md:text-lg"
            aria-label="View all products in all categories"
          >
            <Grid3X3 className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 mr-2" aria-hidden="true" />
            View All Products
          </Button>
        </div>
      </div>
    </section>
  );
}
