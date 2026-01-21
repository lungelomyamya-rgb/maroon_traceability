// src/components/marketplace/featuredProducts.tsx
'use client';

import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, ShoppingCart, Leaf, Grid, List } from 'lucide-react';
import { Product } from '@/constants/marketplaceData';

interface FeaturedProductsProps {
  products: Product[];
  router: any;
  addToCart: (product: Product) => void;
  cart: CartItem[];
}

interface CartItem {
  id: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
  image: string;
  farmer: string;
}

const ProductListItem = ({ 
  product, 
  addToCart, 
  cart,
  router 
}: { 
  product: Product;
  addToCart: (product: Product) => void;
  cart: CartItem[];
  router: any;
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 p-3 sm:p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 w-full bg-white">
      <div className="w-28 h-28 sm:w-32 sm:h-32 bg-gradient-to-br from-green-50 to-green-100 rounded-xl overflow-hidden flex-shrink-0 border border-green-200 shadow-sm">
        <div className="w-full h-full flex items-center justify-center">
          <div className="text-3xl sm:text-4xl" role="img" aria-label={`${product.category} icon`}>
            {product.category === 'Powders' ? '🌿' :
             product.category === 'Teas' ? '🍵' :
             product.category === 'Supplements' ? '💊' :
             product.category === 'Oils' ? '🫒' :
             product.category === 'Seeds' ? '🌱' :
             product.category === 'Fresh' ? '🥬' :
             product.category === 'Poultry' ? '🐔' :
             product.category === 'Beef' ? '🥩' :
             product.category === 'Vegetables' ? '🥕' :
             product.category === 'Honey' ? '🍯' :
             product.category === 'Grains' ? '🌾' : '📦'}
          </div>
        </div>
      </div>
      <div className="flex-1 flex flex-col w-full">
        <div className="flex-1 w-full">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-medium text-gray-900">{product.name}</h3>
            {(product.discount && product.discount > 0) && (
              <Badge className="bg-red-600 text-white text-xs">
                -{product.discount}%
              </Badge>
            )}
          </div>
          
          <p className="mt-1 text-sm text-gray-600 line-clamp-2">
            {product.description || 'No description available'}
          </p>
          
          <div className="mt-2 flex items-center gap-2">
            <span className="text-lg font-semibold text-gray-900">
              R{product.price.toFixed(2)}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-gray-500 line-through">
                R{product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>
          
          <div className="mt-2 flex items-center gap-2 flex-wrap">
            <div className="flex items-center" role="img" aria-label={`Rating: ${product.farmer.rating} out of 5 stars`}>
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-3 w-3 sm:h-4 sm:w-4 ${
                    i < Math.floor(product.farmer.rating)
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                  }`}
                  aria-hidden="true"
                />
              ))}
              <span className="ml-1 text-xs text-gray-500">({product.farmer.totalReviews})</span>
            </div>
            
            <Badge 
              variant="outline" 
              className={`text-xs ${
                product.quality.grade === 'A' ? 'border-green-600 text-green-600' :
                product.quality.grade === 'B' ? 'border-yellow-600 text-yellow-600' :
                'border-gray-600 text-gray-600'
              }`}
              aria-label={`Quality grade: ${product.quality.grade}`}
            >
              Grade {product.quality.grade}
            </Badge>
            
            <Badge variant="outline" className="text-xs">
              <Leaf className="h-3 w-3 mr-1" />
              Organic
            </Badge>
          </div>
          
          <p className="mt-2 text-xs text-gray-500">
            By {product.farmer.name} • {product.farmer.location} • {product.stockLevel} in stock
          </p>
        </div>
        
        <div className="mt-4 flex flex-col sm:flex-row gap-2">
          <Button 
            size="sm" 
            className="flex-1"
            onClick={() => router.push(`/marketplace/products/${product.id}`)}
            aria-label={`View details for ${product.name}`}
          >
            View Details
          </Button>
          <Button 
            size="sm" 
            variant="outline"
            className="flex-1 sm:flex-initial sm:w-auto"
            onClick={() => addToCart(product)}
            aria-label={`Add ${product.name} to cart`}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Add to Cart
            {cart.find(item => item.id === product.id) && (
              <span className="ml-2 bg-green-600 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs">
                {cart.find(item => item.id === product.id)?.quantity}
              </span>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default function FeaturedProducts({ products, router, addToCart, cart }: FeaturedProductsProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const featured = products.filter(product => product.discount);

  // Load view mode preference from localStorage
  useEffect(() => {
    const savedViewMode = localStorage.getItem('productViewMode') as 'grid' | 'list' | null;
    if (savedViewMode) {
      setViewMode(savedViewMode);
    }
  }, []);

  // Save view mode preference to localStorage
  useEffect(() => {
    localStorage.setItem('productViewMode', viewMode);
  }, [viewMode]);

  return (
    <section 
      className="py-8 sm:py-12 md:py-16 lg:py-20 bg-gray-50"
      aria-labelledby="featured-products-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12">
          <h2 id="featured-products-heading" className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Featured Deals
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-6">
            Special offers on premium quality products
          </p>
          <div className="flex justify-center gap-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="text-xs sm:text-sm"
              aria-label="Grid view"
              aria-pressed={viewMode === 'grid'}
            >
              <Grid className="h-4 w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Grid View</span>
              <span className="sm:hidden">Grid</span>
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="text-xs sm:text-sm"
              aria-label="List view"
              aria-pressed={viewMode === 'list'}
            >
              <List className="h-4 w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">List View</span>
              <span className="sm:hidden">List</span>
            </Button>
          </div>
        </div>
        
        <div 
          className={viewMode === 'grid' 
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6 px-2 sm:px-0" 
            : "flex flex-col gap-4 w-full px-2 sm:px-0"
          } 
          role="list"
        >
          {featured.map((product) =>
            viewMode === 'grid' ? (
              <div 
                key={product.id} 
                className="overflow-hidden hover:shadow-xl transition-shadow group rounded-lg sm:rounded-xl md:rounded-2xl bg-white border border-gray-200 w-full"
                role="listitem"
              >
              <div className="relative">
                <div className="w-full h-32 sm:h-40 md:h-48 lg:h-56 bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center group-hover:scale-105 transition-transform duration-300 rounded-t-xl sm:rounded-t-2xl">
                  <div className="text-center">
                    <div className="text-2xl sm:text-3xl md:text-4xl mb-2" role="img" aria-label={`${product.category} icon`}>
                      {product.category === 'Powders' ? '🌿' :
                       product.category === 'Teas' ? '🍵' :
                       product.category === 'Supplements' ? '💊' :
                       product.category === 'Oils' ? '🫒' :
                       product.category === 'Seeds' ? '🌱' :
                       product.category === 'Fresh' ? '🥬' :
                       product.category === 'Poultry' ? '🐔' :
                       product.category === 'Beef' ? '🥩' :
                       product.category === 'Vegetables' ? '🥕' :
                       product.category === 'Honey' ? '🍯' :
                       product.category === 'Grains' ? '🌾' : '📦'}
                    </div>
                    <p className="text-xs sm:text-sm text-green-700 font-medium">{product.category}</p>
                  </div>
                </div>
                {product.discount && (
                  <Badge 
                    className="absolute top-1 sm:top-2 right-1 sm:right-2 bg-red-600 text-xs"
                    aria-label={`${product.discount}% discount`}
                  >
                    -{product.discount}%
                  </Badge>
                )}
                <div className="absolute top-1 sm:top-2 left-1 sm:left-2">
                  <Badge className="bg-green-600 text-white text-xs">
                    <Leaf className="h-2 w-2 sm:h-3 sm:w-3 mr-1" aria-hidden="true" />
                    <span className="text-xs">Organic</span>
                  </Badge>
                </div>
              </div>
              
              <div className="p-3 sm:p-4">
                <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base line-clamp-1">
                  {product.name}
                </h3>
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex items-center" role="img" aria-label={`Rating: ${product.farmer.rating} out of 5 stars`}>
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3 w-3 sm:h-4 sm:w-4 ${
                          i < Math.floor(product.farmer.rating)
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                        aria-hidden="true"
                      />
                    ))}
                  </div>
                  <span className="text-xs sm:text-sm text-gray-500">
                    ({product.farmer.totalReviews})
                  </span>
                </div>
                
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg sm:text-xl font-bold text-gray-900">
                        R{product.price.toFixed(2)}
                      </span>
                      {product.originalPrice && (
                        <span className="text-xs sm:text-sm text-gray-500 line-through">
                          R{product.originalPrice.toFixed(2)}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-600">
                      by {product.farmer.name} • {product.farmer.location}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${
                        product.quality.grade === 'A' ? 'border-green-600 text-green-600' :
                        product.quality.grade === 'B' ? 'border-yellow-600 text-yellow-600' :
                        'border-gray-600 text-gray-600'
                      }`}
                      aria-label={`Quality grade: ${product.quality.grade}`}
                    >
                      Grade {product.quality.grade}
                    </Badge>
                    <span className="text-xs text-gray-500">
                      {product.stockLevel} in stock
                    </span>
                  </div>
                </div>

                <div className="mt-3 flex gap-2">
                  <Button 
                    size="sm" 
                    className="flex-1 text-xs sm:text-sm"
                    onClick={() => router.push(`/marketplace/products/${product.id}`)}
                    aria-label={`View details for ${product.name}`}
                  >
                    View Details
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="text-xs sm:text-sm"
                    onClick={() => addToCart(product)}
                    aria-label={`Add ${product.name} to cart`}
                  >
                    <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4 mr-1" aria-hidden="true" />
                    <span className="hidden sm:inline">Add</span>
                    {cart.find(item => item.id === product.id) && (
                      <span className="ml-1 text-xs bg-green-600 text-white rounded-full h-4 w-4 flex items-center justify-center">
                        {cart.find(item => item.id === product.id)?.quantity}
                      </span>
                    )}
                  </Button>
                </div>
              </div>
              </div>
            ) : (
              <ProductListItem 
                key={product.id} 
                product={product} 
                addToCart={addToCart}
                cart={cart}
                router={router}
              />
            )
          )}
        </div>
      </div>
    </section>
  );
}
