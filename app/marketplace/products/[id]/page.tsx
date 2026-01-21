// src/app/marketplace/products/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useUser } from '@/contexts/userContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  ShoppingCart, 
  Star, 
  Heart,
  MapPin,
  Shield,
  Plus,
  Minus,
  ArrowLeft,
  Truck,
  Leaf,
  Award,
  Clock,
  CheckCircle
} from 'lucide-react';
import { mockProducts } from '@/constants/marketplaceData';

interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  farmer: {
    name: string;
    location: string;
    verified: boolean;
    rating: number;
    totalReviews: number;
    yearsExperience: number;
    certifications: string[];
  };
  quality: {
    grade: 'A' | 'B' | 'C';
    certifications: string[];
    inspectionDate: string;
    inspector: string;
  };
  sustainability: {
    organic: boolean;
    fairTrade: boolean;
    carbonFootprint: number;
    waterUsage: number;
  };
  stockLevel: number;
  images: string[];
  marketplaceUrl?: string;
}

export default function ProductDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { currentUser } = useUser();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<any[]>([]);

  useEffect(() => {
    const productId = params.id as string;
    const foundProduct = mockProducts.find(p => p.id === productId);
    
    if (foundProduct) {
      setProduct(foundProduct);
    }
    setLoading(false);
  }, [params.id]);

  const addToCart = () => {
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
      setCart(cart.map(item => 
        item.id === product.id 
          ? { ...item, quantity: item.quantity + quantity }
          : item
      ));
    } else {
      setCart([...cart, {
        id: product.id,
        name: product.name,
        category: product.category,
        price: product.price,
        quantity: quantity,
        image: product.images[0] || '/images/placeholder.jpg',
        farmer: product.farmer.name
      }]);
    }
  };

  const updateQuantity = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= (product?.stockLevel || 1)) {
      setQuantity(newQuantity);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
          <p className="text-gray-600 mb-6">The product you're looking for doesn't exist.</p>
          <Button onClick={() => router.push('/marketplace')}>
            Back to Marketplace
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <nav className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <h1 className="text-lg sm:text-xl font-semibold text-gray-900">
                Product Details
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push('/marketplace/cart')}
                className="relative"
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Cart
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-orange-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cart.reduce((total, item) => total + item.quantity, 0)}
                  </span>
                )}
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Product Details */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button Inside Main Content */}
        <div className="mb-4">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background border border-input hover:bg-accent hover:text-accent-foreground h-10 px-4 rounded-md text-sm sm:text-base"
            aria-label="Go back to previous page"
          >
            Back
          </button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
          {/* Product Image */}
          <div className="space-y-3 sm:space-y-4">
            <div className="aspect-square bg-gradient-to-br from-green-100 to-green-200 rounded-lg sm:rounded-xl overflow-hidden">
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl sm:text-5xl md:text-6xl mb-2 sm:mb-4" role="img" aria-label={`${product.category} icon`}>
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
                  <p className="text-sm sm:text-base text-green-700 font-medium">{product.category}</p>
                </div>
              </div>
            </div>
            
            {/* Product Badges */}
            <div className="flex flex-wrap gap-1 sm:gap-2">
              {product.discount && (
                <Badge className="bg-red-600">
                  -{product.discount}% OFF
                </Badge>
              )}
              {product.sustainability.organic && (
                <Badge className="bg-green-600">
                  <Leaf className="h-3 w-3 mr-1" />
                  Organic
                </Badge>
              )}
              {product.sustainability.fairTrade && (
                <Badge className="bg-blue-600">
                  Fair Trade
                </Badge>
              )}
              <Badge variant="outline" className="border-green-600 text-green-600">
                Grade {product.quality.grade}
              </Badge>
            </div>
          </div>

          {/* Product Information */}
          <div className="space-y-4 sm:space-y-6">
            {/* Title and Price */}
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                {product.name}
              </h1>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center">
                  <span className="text-2xl sm:text-3xl font-bold text-gray-900">
                    R{product.price.toFixed(2)}
                  </span>
                  {product.originalPrice && (
                    <span className="ml-2 text-sm sm:text-base text-gray-500 line-through">
                      R{product.originalPrice.toFixed(2)}
                    </span>
                  )}
                </div>
                <Badge variant="outline" className="text-xs sm:text-sm">
                  {product.stockLevel} in stock
                </Badge>
              </div>
              
              {/* Rating */}
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 sm:h-5 sm:w-5 ${
                        i < Math.floor(product.farmer.rating)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm sm:text-base text-gray-600">
                  {product.farmer.rating} ({product.farmer.totalReviews} reviews)
                </span>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">Description</h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Farmer Information */}
            <Card>
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                      {product.farmer.name}
                    </h3>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 mb-2">
                      <div className="flex items-center text-sm sm:text-base text-gray-600">
                        <MapPin className="h-4 w-4 mr-1" />
                        {product.farmer.location}
                      </div>
                      <div className="flex items-center text-sm sm:text-base text-gray-600">
                        <Shield className="h-4 w-4 mr-1" />
                        {product.farmer.verified ? 'Verified Farmer' : 'Unverified'}
                      </div>
                    </div>
                  </div>
                  <div className="text-right sm:text-left">
                    <div className="text-xs sm:text-sm text-gray-600 mb-1">
                      {product.farmer.yearsExperience} years experience
                    </div>
                    <div className="text-xs sm:text-sm text-gray-600">
                      {product.farmer.certifications.length} certifications
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quantity Selector */}
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">Quantity</h3>
              <div className="flex items-center gap-4">
                <div className="flex items-center border rounded-lg">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => updateQuantity(quantity - 1)}
                    disabled={quantity <= 1}
                    className="h-10 w-10 p-0"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-12 text-center font-medium">
                    {quantity}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => updateQuantity(quantity + 1)}
                    disabled={quantity >= product.stockLevel}
                    className="h-10 w-10 p-0"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <span className="text-sm sm:text-base text-gray-600">
                  Total: R{(product.price * quantity).toFixed(2)}
                </span>
              </div>
            </div>

            {/* Add to Cart Button */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Button
                onClick={addToCart}
                className="flex-1 h-10 sm:h-12 text-sm sm:text-base"
                disabled={product.stockLevel === 0}
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                Add to Cart
              </Button>
                <Button variant="outline" size="lg" className="h-10 sm:h-12 text-sm sm:text-base">
                <Heart className="h-5 w-5 mr-2" />
                Save
              </Button>
            </div>

            {/* Quality & Sustainability */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
              <Card>
                <CardContent className="p-3 sm:p-4">
                  <div className="flex items-center mb-2">
                    <Award className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 mr-2" />
                    <h4 className="text-sm sm:text-base font-semibold text-gray-900">Quality</h4>
                  </div>
                  <div className="space-y-1 text-xs sm:text-sm text-gray-600">
                    <div>Grade: {product.quality.grade}</div>
                    <div>Inspected: {product.quality.inspectionDate}</div>
                    <div>Inspector: {product.quality.inspector}</div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-3 sm:p-4">
                  <div className="flex items-center mb-2">
                    <Leaf className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 mr-2" />
                    <h4 className="text-sm sm:text-base font-semibold text-gray-900">Sustainability</h4>
                  </div>
                  <div className="space-y-1 text-xs sm:text-sm text-gray-600">
                    <div>Organic: {product.sustainability.organic ? 'Yes' : 'No'}</div>
                    <div>Fair Trade: {product.sustainability.fairTrade ? 'Yes' : 'No'}</div>
                    <div>Carbon: {product.sustainability.carbonFootprint}kg CO₂</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
