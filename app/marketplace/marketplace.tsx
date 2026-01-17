// src/app/marketplace/marketplace.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/contexts/userContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Search, 
  ShoppingCart, 
  Star, 
  Filter, 
  QrCode, 
  Eye, 
  MapPin, 
  CheckCircle,
  AlertCircle,
  Award,
  Leaf,
  Truck,
  Heart,
  ExternalLink,
  Plus,
  Minus,
  TrendingUp,
  Users,
  Package,
  Clock,
  Shield,
  ChevronRight,
  BarChart3,
  DollarSign,
  Target,
  Zap
} from 'lucide-react';

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
    practices: string[];
  };
  images: string[];
  reviews: Array<{
    id: string;
    userId: string;
    userName: string;
    rating: number;
    comment: string;
    date: string;
    verified: boolean;
    helpful: number;
  }>;
  traceabilityUrl: string;
  marketplaceUrl: string;
  inStock: boolean;
  stockLevel: number;
  soldCount: number;
  viewCount: number;
  tags: string[];
  shipping: {
    weight: number;
    dimensions: { length: number; width: number; height: number };
    options: string[];
    freeShipping: boolean;
  };
  nutrition?: {
    calories: number;
    protein: number;
    vitamins: string[];
    allergens: string[];
  };
}

interface CartItem {
  productId: string;
  quantity: number;
  addedAt: string;
}

interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  trackingNumber?: string;
  shippingAddress: {
    street: string;
    city: string;
    province: string;
    postalCode: string;
  };
}

// Enhanced Marketplace Components
function HeroSection({ router }: { router: any }) {
  return (
    <section className="bg-gradient-to-r from-green-600 to-emerald-700 text-white py-6 sm:py-8 md:py-12 rounded-t-3xl">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        <div className="text-center">
          <Badge className="bg-white/20 text-white mb-2 sm:mb-3">
            <Leaf className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
            <span className="text-xs sm:text-sm">100% Traceable Products</span>
          </Badge>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
            Lwandle Moringa Marketplace
          </h1>
          <p className="text-sm sm:text-base md:text-lg mb-4 sm:mb-6 text-green-100 max-w-xl sm:max-w-2xl mx-auto">
            Farm-to-Shelf Transparency. Every product tells a story of quality, sustainability, and trust.
          </p>
          
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-4 sm:mb-8">
            <div className="flex items-center gap-1 sm:gap-2 bg-white/10 px-2 sm:px-3 py-1 rounded-full">
              <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="text-xs sm:text-sm">Verified Farmers</span>
            </div>
            <div className="flex items-center gap-1 sm:gap-2 bg-white/10 px-2 sm:px-3 py-1 rounded-full">
              <Award className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="text-xs sm:text-sm">Quality Inspected</span>
            </div>
            <div className="flex items-center gap-1 sm:gap-2 bg-white/10 px-2 sm:px-3 py-1 rounded-full">
              <Leaf className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="text-xs sm:text-sm">Sustainably Grown</span>
            </div>
            <div className="flex items-center gap-1 sm:gap-2 bg-white/10 px-2 sm:px-3 py-1 rounded-full">
              <Truck className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="text-xs sm:text-sm">Fresh Delivery</span>
            </div>
          </div>

          {/* Added Traceability CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mt-6 sm:mt-8">
            <button 
              onClick={() => router.push('/qr-demo')}
              className="inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background border border-input hover:bg-accent hover:text-accent-foreground h-10 py-2 px-4 !bg-gradient-to-r !from-green-600 !to-green-500 hover:!from-green-700 hover:!to-green-600 text-white px-4 sm:px-8 py-2 sm:py-3 shadow-lg rounded-full text-sm sm:text-base"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-qr-code h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2">
                <rect width="5" height="5" x="3" y="3" rx="1"></rect>
                <rect width="5" height="5" x="16" y="3" rx="1"></rect>
                <rect width="5" height="5" x="3" y="16" rx="1"></rect>
                <path d="M21 16h-3a2 2 0 0 0-2 2v3"></path>
                <path d="M21 21v.01"></path>
                <path d="M12 7v3a2 2 0 0 1-2 2H7"></path>
                <path d="M3 12h.01"></path>
                <path d="M12 3h.01"></path>
                <path d="M12 16v.01"></path>
                <path d="M16 12h1"></path>
                <path d="M21 12v.01"></path>
                <path d="M12 21v-1"></path>
              </svg>
              <span className="text-xs sm:text-sm">Scan Product QR Code</span>
            </button>
            <button 
              onClick={() => router.push('/marketplace/products')}
              className="inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background border border-input hover:bg-accent hover:text-accent-foreground h-10 py-2 px-4 px-4 sm:px-8 py-2 sm:py-3 bg-white/10 hover:bg-white/20 text-white border-white/20 text-sm sm:text-base"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-search h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.3-4.3"></path>
              </svg>
              <span className="text-xs sm:text-sm">View Products</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function FeaturedProducts({ products, router }: { products: Product[]; router: any }) {
  const featured = products.filter(p => p.discount && p.discount > 0).slice(0, 9);
  
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Featured Deals</h2>
          <p className="text-base md:text-lg text-gray-600">Special offers on premium quality products</p>
        </div>
        
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {featured.map((product) => (
            <Card key={product.id} className="overflow-hidden hover:shadow-xl transition-shadow group rounded-xl sm:rounded-2xl">
              <div className="relative">
                <div className="w-full h-32 sm:h-48 bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center group-hover:scale-105 transition-transform duration-300 rounded-t-xl sm:rounded-t-2xl">
                  <div className="text-center">
                    <div className="text-2xl sm:text-4xl mb-2">
                      {product.category === 'Powders' ? '🌿' :
                       product.category === 'Teas' ? '🍵' :
                       product.category === 'Supplements' ? '💊' :
                       product.category === 'Oils' ? '🫒' :
                       product.category === 'Seeds' ? '🌱' :
                       product.category === 'Fresh' ? '🥬' :
                       product.category === 'Poultry' ? '🥚' :
                       product.category === 'Beef' ? '🥩' :
                       product.category === 'Vegetables' ? '🥦' :
                       product.category === 'Honey' ? '🍯' :
                       product.category === 'Grains' ? '🌾' : '📦'}
                    </div>
                    <p className="text-xs sm:text-sm text-green-700 font-medium">{product.category}</p>
                  </div>
                </div>
                {product.discount && (
                  <Badge className="absolute top-1 sm:top-2 right-1 sm:right-2 bg-red-600 text-xs">
                    -{product.discount}%
                  </Badge>
                )}
                <div className="absolute top-1 sm:top-2 left-1 sm:left-2">
                  <Badge className="bg-green-600 text-white text-xs">
                    <Leaf className="h-2 w-2 sm:h-3 sm:w-3 mr-1" />
                    <span className="text-xs">Organic</span>
                  </Badge>
                </div>
              </div>
              
              <div className="p-3 sm:p-4">
                <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base line-clamp-1">{product.name}</h3>
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3 w-3 sm:h-4 sm:w-4 ${
                          i < Math.floor(product.farmer.rating)
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs sm:text-sm text-gray-500">({product.farmer.totalReviews})</span>
                </div>
                
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg sm:text-xl font-bold text-gray-900">R{product.price.toFixed(2)}</span>
                      {product.originalPrice && (
                        <span className="text-xs sm:text-sm text-gray-500 line-through">R{product.originalPrice.toFixed(2)}</span>
                      )}
                    </div>
                    <p className="text-xs sm:text-sm text-gray-500">{product.soldCount} sold</p>
                  </div>
                </div>
                
                <Button 
                  onClick={() => router.push('/marketplace/cart')}
                  className="w-full text-sm sm:text-base" 
                  size="sm"
                >
                  <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                  <span className="hidden sm:inline">Add to Cart</span>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function TrustSignals() {
  const trustBadges = [
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Fully Traceable",
      description: "Complete farm-to-shelf journey visible for every product",
      color: "text-blue-600"
    },
    {
      icon: <CheckCircle className="h-8 w-8" />,
      title: "Verified Farmers",
      description: "All farmers are verified and regularly inspected",
      color: "text-green-600"
    },
    {
      icon: <Award className="h-8 w-8" />,
      title: "Quality Assured",
      description: "Rigorous quality testing and certification process",
      color: "text-purple-600"
    },
    {
      icon: <Leaf className="h-8 w-8" />,
      title: "Sustainability",
      description: "Track environmental impact and sustainable practices",
      color: "text-orange-600"
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Trust Our Marketplace?</h2>
          <p className="text-lg text-gray-600">Transparency and quality at every step</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
          {trustBadges.map((badge, index) => (
            <div key={index} className="text-center">
              <div className={`w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 ${badge.color}`}>
                {badge.icon}
              </div>
              <h3 className="font-semibold text-base sm:text-lg mb-2">{badge.title}</h3>
              <p className="text-gray-600 text-sm sm:text-base">{badge.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function QRScannerSection() {
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<string>('');
  const [mockInput, setMockInput] = useState('');
  const [error, setError] = useState<string>('');

  const startScanning = () => {
    setIsScanning(true);
    setError('');
    setScanResult('');
  };

  const stopScanning = () => {
    setIsScanning(false);
    setMockInput('');
    setError('');
  };

  const handleScan = () => {
    if (!mockInput.trim()) {
      setError('Please enter a product ID');
      return;
    }
    setScanResult(mockInput);
    setTimeout(() => {
      // Navigate to trace page with the scanned ID
      window.open(`/trace/${mockInput}`, '_blank');
      stopScanning();
    }, 1500);
  };

  const useRandomId = () => {
    const mockIds = ['PRD-2024-001', 'PRD-2024-002', 'PRD-2024-003', 'BLK1704123456789', 'TRACE-DEMO-001'];
    setMockInput(mockIds[Math.floor(Math.random() * mockIds.length)]);
  };

  return (
    <section id="qr-scanner" className="py-12 sm:py-16 px-3 sm:px-4 lg:px-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">Scan Product QR Code</h2>
          <p className="text-base sm:text-lg text-gray-600">Enter a product ID to trace its journey</p>
        </div>
        
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 p-4 sm:p-8">
          {scanResult ? (
            <div className="text-center py-6 sm:py-8">
              <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-full mb-3 sm:mb-4">
                <CheckCircle className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">Scan Successful!</h3>
              <p className="text-sm text-gray-600 font-mono bg-gray-100 px-2 sm:px-3 py-1 sm:py-2 rounded">{scanResult}</p>
              <p className="text-xs text-gray-500 mt-2">Opening trace page...</p>
            </div>
          ) : (
            <div className="space-y-4 sm:space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enter Product ID or QR Code Data
                </label>
                <div className="flex gap-2 sm:gap-3">
                  <input
                    type="text"
                    value={mockInput}
                    onChange={(e) => setMockInput(e.target.value)}
                    placeholder="e.g., PRD-2024-001"
                    className="flex-1 px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm sm:text-base"
                    autoFocus
                  />
                  <Button
                    variant="outline"
                    onClick={useRandomId}
                    className="whitespace-nowrap text-sm sm:text-base"
                  >
                    Random
                  </Button>
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              <div className="flex gap-2 sm:gap-3">
                <Button
                  onClick={handleScan}
                  className="flex-1 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white shadow-lg text-sm sm:text-base py-2 sm:py-3"
                >
                  <QrCode className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                  <span className="hidden sm:inline">Trace Product</span>
                </Button>
                {isScanning && (
                  <Button
                    variant="outline"
                    onClick={stopScanning}
                    className="text-sm sm:text-base"
                  >
                    Cancel
                  </Button>
                )}
              </div>

              <div className="text-xs text-gray-500 text-center mt-4 sm:mt-6">
                <p>Try: PRD-2024-001, BLK1704123456789, or click "Random"</p>
              </div>
            </div>
          )}
        </div>
        
        <div className="mt-6 sm:mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          <div className="bg-white p-4 sm:p-6 rounded-lg border">
            <h3 className="font-semibold text-gray-900 mb-3">How to Use:</h3>
            <ol className="space-y-2 text-sm text-gray-600">
              <li>1. Enter a product ID in the field above</li>
              <li>2. Click "Trace Product" to view the journey</li>
              <li>3. Explore the complete traceability information</li>
            </ol>
          </div>
          <div className="bg-blue-50 p-3 sm:p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Demo Product IDs:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• PRD-2024-001 (Organic Apples)</li>
              <li>• PRD-2024-002 (Free Range Eggs)</li>
              <li>• PRD-2024-003 (Artisanal Cheese)</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

function Categories({ categories, router }: { categories: string[]; router: any }) {
  const categoryIcons: Record<string, string> = {
    'Powders': '🌿',
    'Teas': '🍵',
    'Supplements': '💊',
    'Oils': '🫒',
    'Seeds': '🌱',
    'Fresh': '🥬',
    'Poultry': '🥚',
    'Beef': '🥩',
    'Vegetables': '🥦',
    'Honey': '🍯',
    'Grains': '🌾'
  };

  const handleCategoryClick = (category: string) => {
    router.push(`/marketplace/products?category=${category.toLowerCase()}`);
  };

  return (
    <section className="py-16 bg-gradient-to-br from-green-50 to-emerald-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Shop by Category</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">Browse our wide selection of premium agricultural products, from superfoods to fresh produce</p>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 sm:gap-6">
          {categories.map((category, index) => (
            <div 
              key={category} 
              className="group relative overflow-hidden bg-white border-2 border-transparent hover:border-green-500 hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-105 rounded-xl sm:rounded-2xl aspect-square"
              onClick={() => handleCategoryClick(category)}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-emerald-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
              <div className="relative p-3 sm:p-4 text-center flex flex-col justify-center h-full">
                <div className="mb-2 sm:mb-3">
                  <div className="w-8 h-8 sm:w-12 sm:h-12 mx-auto bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <span className="text-lg sm:text-2xl filter drop-shadow-sm">
                      {categoryIcons[category] || '📦'}
                    </span>
                  </div>
                  <div className="absolute -top-1 -right-1 w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                
                <h3 className="font-bold text-xs sm:text-sm text-gray-900 mb-1 sm:mb-2 group-hover:text-green-700 transition-colors duration-300 leading-tight">
                  {category}
                </h3>
                
                <div className="space-y-1">
                  <p className="text-xs sm:text-sm text-gray-500 group-hover:text-gray-700 transition-colors duration-300 leading-tight">
                    {category === 'Powders' && 'Superfoods'}
                    {category === 'Teas' && 'Herbal Teas'}
                    {category === 'Supplements' && 'Daily Nutrition'}
                    {category === 'Oils' && 'Cold-Pressed Oils'}
                    {category === 'Seeds' && 'Planting & Growing'}
                    {category === 'Fresh' && 'Fresh Produce'}
                    {category === 'Poultry' && 'Eggs & Poultry'}
                    {category === 'Beef' && 'Grass-Fed Meat'}
                    {category === 'Vegetables' && 'Organic Veggies'}
                    {category === 'Honey' && 'Natural Sweeteners'}
                    {category === 'Grains' && 'Whole Grains'}
                  </p>
                   
                  <div className="flex items-center justify-center text-green-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="text-xs font-medium leading-tight">Browse</span>
                    <svg className="w-2 h-2 sm:w-3 sm:h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
              
              {/* Hover effect overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-green-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <p className="text-sm text-gray-500 mb-4">
            <span className="inline-flex items-center">
              <svg className="w-4 h-4 mr-2 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              All products are traceable from farm to table
            </span>
          </p>
          <Button 
            variant="outline" 
            className="border-green-600 text-green-600 hover:bg-green-600 hover:text-white transition-colors duration-300"
            onClick={() => router.push('/marketplace/products')}
          >
            View All Products
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Button>
        </div>
      </div>
    </section>
  );
}

export default function Marketplace() {
  const { currentUser } = useUser();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [priceFilter, setPriceFilter] = useState<string>('all');
  const [qualityFilter, setQualityFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('featured');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showCart, setShowCart] = useState(false);
  const [loading, setLoading] = useState(false);

  // Mock data with enhanced e-commerce features
  useEffect(() => {
    const mockProducts: Product[] = [
      {
        id: 'prod1',
        name: 'Premium Organic Moringa Powder - 250g',
        description: '100% organic moringa powder, rich in nutrients and antioxidants. Perfect for smoothies and health drinks. Sourced from certified organic farms in South Africa.',
        category: 'Powders',
        price: 89.99,
        originalPrice: 120.00,
        discount: 25,
        farmer: {
          name: 'Green Valley Farm',
          location: 'Stellenbosch, Western Cape',
          verified: true,
          rating: 4.8,
          totalReviews: 127,
          yearsExperience: 15,
          certifications: ['Organic Certified', 'Fair Trade', 'GMP']
        },
        quality: {
          grade: 'A',
          certifications: ['Organic', 'GMP', 'HACCP'],
          inspectionDate: '2025-01-15',
          inspector: 'Cape Quality Inspections'
        },
        sustainability: {
          organic: true,
          fairTrade: true,
          carbonFootprint: 2.3,
          waterUsage: 150,
          practices: ['Water Conservation', 'Renewable Energy', 'Composting']
        },
        images: ['/images/moringa-powder.jpg'],
        reviews: [
          {
            id: 'rev1',
            userId: 'user1',
            userName: 'Sarah Johnson',
            rating: 5,
            comment: 'Excellent quality! Very fresh and potent. Love the traceability feature.',
            date: '2025-01-18',
            verified: true,
            helpful: 12
          }
        ],
        traceabilityUrl: '/trace/QR-PROD-001',
        marketplaceUrl: 'https://lwandlemoringa.co.za/product/moringa-powder-premium',
        inStock: true,
        stockLevel: 85,
        soldCount: 342,
        viewCount: 1250,
        tags: ['organic', 'premium', 'superfood', 'antioxidant'],
        shipping: {
          weight: 0.25,
          dimensions: { length: 10, width: 10, height: 15 },
          options: ['Standard', 'Express'],
          freeShipping: true
        },
        nutrition: {
          calories: 25,
          protein: 2.5,
          vitamins: ['Vitamin C', 'Vitamin A', 'Iron', 'Calcium'],
          allergens: []
        }
      },
      {
        id: 'prod2',
        name: 'Organic Moringa Tea Bags - 20 Count',
        description: 'Premium quality moringa tea bags made from fresh moringa leaves. Perfect for daily wellness routine with natural energy boost.',
        category: 'Teas',
        price: 45.00,
        originalPrice: 60.00,
        discount: 25,
        farmer: {
          name: 'Sunny Acres Farm',
          location: 'Pretoria, Gauteng',
          verified: true,
          rating: 4.7,
          totalReviews: 89,
          yearsExperience: 12,
          certifications: ['Organic Certified', 'Fair Trade']
        },
        quality: {
          grade: 'A',
          certifications: ['Organic', 'Fair Trade'],
          inspectionDate: '2025-01-12',
          inspector: 'Gauteng Quality Inspections'
        },
        sustainability: {
          organic: true,
          fairTrade: true,
          carbonFootprint: 1.8,
          waterUsage: 120,
          practices: ['Water Conservation', 'Renewable Energy']
        },
        images: [],
        reviews: [
          {
            id: 'rev2',
            userId: 'user2',
            userName: 'Michael Chen',
            rating: 5,
            comment: 'Excellent tea! Great taste and quality. Love the convenience of tea bags.',
            date: '2025-01-17',
            verified: true,
            helpful: 8
          }
        ],
        traceabilityUrl: '/trace/QR-PROD-002',
        marketplaceUrl: 'https://lwandlemoringa.co.za/product/moringa-tea-bags',
        inStock: true,
        stockLevel: 156,
        soldCount: 234,
        viewCount: 890,
        tags: ['organic', 'tea', 'caffeine-free', 'wellness'],
        shipping: {
          weight: 0.15,
          dimensions: { length: 8, width: 8, height: 12 },
          options: ['Standard', 'Express'],
          freeShipping: false
        },
        nutrition: {
          calories: 2,
          protein: 0.3,
          vitamins: ['Vitamin C', 'Antioxidants'],
          allergens: []
        }
      },
      {
        id: 'prod3',
        name: 'Moringa Capsules - 60 Count',
        description: 'Convenient moringa capsules for daily supplement. Perfect for busy lifestyles with all the benefits of moringa in easy-to-swallow capsules.',
        category: 'Supplements',
        price: 65.00,
        originalPrice: 85.00,
        discount: 24,
        farmer: {
          name: 'Green Valley Farm',
          location: 'Stellenbosch, Western Cape',
          verified: true,
          rating: 4.6,
          totalReviews: 156,
          yearsExperience: 15,
          certifications: ['Organic Certified', 'GMP']
        },
        quality: {
          grade: 'A',
          certifications: ['Organic', 'GMP'],
          inspectionDate: '2025-01-14',
          inspector: 'Cape Quality Inspections'
        },
        sustainability: {
          organic: true,
          fairTrade: false,
          carbonFootprint: 2.1,
          waterUsage: 140,
          practices: ['Water Conservation', 'Composting']
        },
        images: [],
        reviews: [
          {
            id: 'rev3',
            userId: 'user3',
            userName: 'Emma Wilson',
            rating: 4,
            comment: 'Very convenient and effective. Good quality capsules.',
            date: '2025-01-16',
            verified: true,
            helpful: 6
          }
        ],
        traceabilityUrl: '/trace/QR-PROD-003',
        marketplaceUrl: 'https://lwandlemoringa.co.za/product/moringa-capsules',
        inStock: true,
        stockLevel: 89,
        soldCount: 178,
        viewCount: 670,
        tags: ['organic', 'supplements', 'convenient', 'daily'],
        shipping: {
          weight: 0.2,
          dimensions: { length: 6, width: 6, height: 10 },
          options: ['Standard', 'Express'],
          freeShipping: true
        },
        nutrition: {
          calories: 5,
          protein: 0.8,
          vitamins: ['Vitamin C', 'Vitamin A', 'Iron'],
          allergens: []
        }
      },
      {
        id: 'prod4',
        name: 'Cold-Pressed Moringa Oil - 100ml',
        description: 'Pure cold-pressed moringa oil rich in nutrients and antioxidants. Excellent for skin care and culinary use.',
        category: 'Oils',
        price: 120.00,
        originalPrice: 150.00,
        discount: 20,
        farmer: {
          name: 'Karoo Naturals',
          location: 'Graaff-Reinet, Eastern Cape',
          verified: true,
          rating: 4.9,
          totalReviews: 67,
          yearsExperience: 8,
          certifications: ['Organic Certified', 'Cold-Pressed']
        },
        quality: {
          grade: 'A',
          certifications: ['Organic', 'Cold-Pressed'],
          inspectionDate: '2025-01-13',
          inspector: 'Eastern Cape Quality Inspections'
        },
        sustainability: {
          organic: true,
          fairTrade: true,
          carbonFootprint: 3.2,
          waterUsage: 200,
          practices: ['Cold-Pressing', 'Zero Waste']
        },
        images: [],
        reviews: [
          {
            id: 'rev4',
            userId: 'user4',
            userName: 'Sarah Johnson',
            rating: 5,
            comment: 'Amazing quality oil! Perfect for my skin care routine.',
            date: '2025-01-15',
            verified: true,
            helpful: 12
          }
        ],
        traceabilityUrl: '/trace/QR-PROD-004',
        marketplaceUrl: 'https://lwandlemoringa.co.za/product/moringa-oil',
        inStock: true,
        stockLevel: 45,
        soldCount: 89,
        viewCount: 450,
        tags: ['organic', 'oil', 'skincare', 'culinary'],
        shipping: {
          weight: 0.12,
          dimensions: { length: 5, width: 5, height: 8 },
          options: ['Standard', 'Express'],
          freeShipping: true
        },
        nutrition: {
          calories: 120,
          protein: 0,
          vitamins: ['Vitamin E', 'Antioxidants'],
          allergens: []
        }
      },
      {
        id: 'prod5',
        name: 'Moringa Seeds - Pack of 50',
        description: 'Premium quality moringa seeds for planting. High germination rate perfect for home gardening and small farms.',
        category: 'Seeds',
        price: 35.00,
        originalPrice: 45.00,
        discount: 22,
        farmer: {
          name: 'Seedlings SA',
          location: 'Paarl, Western Cape',
          verified: true,
          rating: 4.5,
          totalReviews: 34,
          yearsExperience: 20,
          certifications: ['Heirloom', 'Non-GMO']
        },
        quality: {
          grade: 'A',
          certifications: ['Heirloom', 'Non-GMO'],
          inspectionDate: '2025-01-16',
          inspector: 'Western Cape Agricultural Inspections'
        },
        sustainability: {
          organic: true,
          fairTrade: false,
          carbonFootprint: 0.8,
          waterUsage: 50,
          practices: ['Heirloom Preservation', 'Organic Farming']
        },
        images: [],
        reviews: [
          {
            id: 'rev5',
            userId: 'user5',
            userName: 'Tom Gardner',
            rating: 4,
            comment: 'Great seeds! Almost all of them germinated. Very happy with the quality.',
            date: '2025-01-14',
            verified: true,
            helpful: 4
          }
        ],
        traceabilityUrl: '/trace/QR-PROD-005',
        marketplaceUrl: 'https://lwandlemoringa.co.za/product/moringa-seeds',
        inStock: true,
        stockLevel: 200,
        soldCount: 67,
        viewCount: 320,
        tags: ['organic', 'seeds', 'planting', 'heirloom'],
        shipping: {
          weight: 0.05,
          dimensions: { length: 4, width: 4, height: 6 },
          options: ['Standard'],
          freeShipping: false
        },
        nutrition: {
          calories: 0,
          protein: 0,
          vitamins: [],
          allergens: []
        }
      },
      {
        id: 'prod6',
        name: 'Fresh Moringa Leaves - 500g',
        description: 'Freshly harvested moringa leaves perfect for salads, smoothies, and cooking. Packed with nutrients and flavor.',
        category: 'Fresh',
        price: 55.00,
        originalPrice: 70.00,
        discount: 21,
        farmer: {
          name: 'Leafy Greens Farm',
          location: 'Paarl, Western Cape',
          verified: true,
          rating: 4.8,
          totalReviews: 92,
          yearsExperience: 10,
          certifications: ['Organic Certified', 'Fresh Harvest']
        },
        quality: {
          grade: 'A',
          certifications: ['Organic', 'Fresh Harvest'],
          inspectionDate: '2025-01-18',
          inspector: 'Fresh Produce Inspections'
        },
        sustainability: {
          organic: true,
          fairTrade: true,
          carbonFootprint: 1.2,
          waterUsage: 80,
          practices: ['Daily Harvest', 'Minimal Packaging']
        },
        images: [],
        reviews: [
          {
            id: 'rev6',
            userId: 'user6',
            userName: 'Lisa Cook',
            rating: 5,
            comment: 'So fresh and delicious! Perfect for my morning smoothies.',
            date: '2025-01-18',
            verified: true,
            helpful: 8
          }
        ],
        traceabilityUrl: '/trace/QR-PROD-006',
        marketplaceUrl: 'https://lwandlemoringa.co.za/product/fresh-moringa-leaves',
        inStock: true,
        stockLevel: 78,
        soldCount: 145,
        viewCount: 560,
        tags: ['organic', 'fresh', 'culinary', 'smoothies'],
        shipping: {
          weight: 0.5,
          dimensions: { length: 12, width: 12, height: 8 },
          options: ['Express'],
          freeShipping: false
        },
        nutrition: {
          calories: 45,
          protein: 4.2,
          vitamins: ['Vitamin C', 'Vitamin A', 'Iron', 'Calcium'],
          allergens: []
        }
      },
      {
        id: 'prod7',
        name: 'Organic Avocados - 6 Pack',
        description: 'Premium quality avocados from South African farms. Perfect for toast, salads, and healthy meals. Rich in healthy fats and nutrients.',
        category: 'Fresh',
        price: 75.00,
        originalPrice: 95.00,
        discount: 21,
        farmer: {
          name: 'Green Valley Farm',
          location: 'Stellenbosch, Western Cape',
          verified: true,
          rating: 4.7,
          totalReviews: 234,
          yearsExperience: 15,
          certifications: ['Organic Certified', 'GlobalGAP']
        },
        quality: {
          grade: 'A',
          certifications: ['Organic', 'GlobalGAP'],
          inspectionDate: '2025-01-17',
          inspector: 'Cape Quality Inspections'
        },
        sustainability: {
          organic: true,
          fairTrade: true,
          carbonFootprint: 2.8,
          waterUsage: 180,
          practices: ['Water Conservation', 'Renewable Energy', 'Composting']
        },
        images: [],
        reviews: [
          {
            id: 'rev7',
            userId: 'user7',
            userName: 'James Cook',
            rating: 5,
            comment: 'Perfect avocados! Always ripe and delicious. Great quality.',
            date: '2025-01-17',
            verified: true,
            helpful: 15
          }
        ],
        traceabilityUrl: '/trace/QR-PROD-007',
        marketplaceUrl: 'https://maroon.co.za/product/organic-avocados',
        inStock: true,
        stockLevel: 120,
        soldCount: 456,
        viewCount: 1890,
        tags: ['organic', 'fresh', 'avocado', 'healthy-fats'],
        shipping: {
          weight: 0.9,
          dimensions: { length: 15, width: 15, height: 10 },
          options: ['Standard', 'Express'],
          freeShipping: true
        },
        nutrition: {
          calories: 160,
          protein: 2,
          vitamins: ['Vitamin K', 'Vitamin C', 'Folate'],
          allergens: []
        }
      },
      {
        id: 'prod8',
        name: 'Free-Range Eggs - Dozen',
        description: 'Farm-fresh free-range eggs from happy hens. Rich in protein and omega-3. Perfect for breakfast and baking.',
        category: 'Poultry',
        price: 55.00,
        originalPrice: 70.00,
        discount: 21,
        farmer: {
          name: 'Sunrise Poultry',
          location: 'Robertson, Western Cape',
          verified: true,
          rating: 4.8,
          totalReviews: 189,
          yearsExperience: 12,
          certifications: ['Free-Range Certified', 'Humane']
        },
        quality: {
          grade: 'A',
          certifications: ['Free-Range', 'Humane'],
          inspectionDate: '2025-01-16',
          inspector: 'Western Cape Poultry Inspections'
        },
        sustainability: {
          organic: true,
          fairTrade: true,
          carbonFootprint: 1.5,
          waterUsage: 90,
          practices: ['Free-Range', 'Sustainable Farming']
        },
        images: [],
        reviews: [
          {
            id: 'rev8',
            userId: 'user8',
            userName: 'Maria Santos',
            rating: 5,
            comment: 'Best eggs I have ever bought! The yolks are so rich and yellow.',
            date: '2025-01-16',
            verified: true,
            helpful: 12
          }
        ],
        traceabilityUrl: '/trace/QR-PROD-008',
        marketplaceUrl: 'https://maroon.co.za/product/free-range-eggs',
        inStock: true,
        stockLevel: 200,
        soldCount: 678,
        viewCount: 2340,
        tags: ['free-range', 'eggs', 'protein', 'organic'],
        shipping: {
          weight: 0.6,
          dimensions: { length: 12, width: 8, height: 6 },
          options: ['Standard', 'Express'],
          freeShipping: false
        },
        nutrition: {
          calories: 70,
          protein: 6,
          vitamins: ['Vitamin D', 'B12'],
          allergens: ['Eggs']
        }
      },
      {
        id: 'prod9',
        name: 'Grass-Fed Beef - 1kg',
        description: 'Premium grass-fed beef from Karoo farms. High-quality protein with rich flavor. Perfect for grilling and roasting.',
        category: 'Beef',
        price: 180.00,
        originalPrice: 220.00,
        discount: 18,
        farmer: {
          name: 'Karoo Cattle Co.',
          location: 'Graaff-Reinet, Eastern Cape',
          verified: true,
          rating: 4.9,
          totalReviews: 145,
          yearsExperience: 25,
          certifications: ['Grass-Fed Certified', 'HACCP']
        },
        quality: {
          grade: 'A',
          certifications: ['Grass-Fed', 'HACCP'],
          inspectionDate: '2025-01-15',
          inspector: 'Eastern Cape Meat Inspections'
        },
        sustainability: {
          organic: true,
          fairTrade: false,
          carbonFootprint: 4.2,
          waterUsage: 350,
          practices: ['Rotational Grazing', 'No Antibiotics']
        },
        images: [],
        reviews: [
          {
            id: 'rev9',
            userId: 'user9',
            userName: 'John Butcher',
            rating: 5,
            comment: 'Exceptional quality beef! The flavor is amazing and the marbling is perfect.',
            date: '2025-01-15',
            verified: true,
            helpful: 18
          }
        ],
        traceabilityUrl: '/trace/QR-PROD-009',
        marketplaceUrl: 'https://maroon.co.za/product/grass-fed-beef',
        inStock: true,
        stockLevel: 85,
        soldCount: 234,
        viewCount: 1560,
        tags: ['grass-fed', 'beef', 'protein', 'karoo'],
        shipping: {
          weight: 1.0,
          dimensions: { length: 20, width: 15, height: 8 },
          options: ['Express'],
          freeShipping: true
        },
        nutrition: {
          calories: 250,
          protein: 26,
          vitamins: ['B12', 'Iron', 'Zinc'],
          allergens: []
        }
      },
      {
        id: 'prod10',
        name: 'Organic Spinach - 500g',
        description: 'Fresh organic spinach packed with nutrients. Perfect for salads, smoothies, and cooking. Rich in iron and vitamins.',
        category: 'Vegetables',
        price: 35.00,
        originalPrice: 45.00,
        discount: 22,
        farmer: {
          name: 'Leafy Greens Farm',
          location: 'Paarl, Western Cape',
          verified: true,
          rating: 4.6,
          totalReviews: 98,
          yearsExperience: 10,
          certifications: ['Organic Certified', 'Fresh Harvest']
        },
        quality: {
          grade: 'A',
          certifications: ['Organic', 'Fresh Harvest'],
          inspectionDate: '2025-01-18',
          inspector: 'Fresh Produce Inspections'
        },
        sustainability: {
          organic: true,
          fairTrade: true,
          carbonFootprint: 0.9,
          waterUsage: 70,
          practices: ['Water Conservation', 'Minimal Packaging']
        },
        images: [],
        reviews: [
          {
            id: 'rev10',
            userId: 'user10',
            userName: 'Lisa Green',
            rating: 4,
            comment: 'Very fresh and clean spinach. Great for my morning smoothies.',
            date: '2025-01-18',
            verified: true,
            helpful: 7
          }
        ],
        traceabilityUrl: '/trace/QR-PROD-010',
        marketplaceUrl: 'https://maroon.co.za/product/organic-spinach',
        inStock: true,
        stockLevel: 150,
        soldCount: 189,
        viewCount: 780,
        tags: ['organic', 'spinach', 'vegetables', 'iron'],
        shipping: {
          weight: 0.5,
          dimensions: { length: 10, width: 10, height: 8 },
          options: ['Standard', 'Express'],
          freeShipping: false
        },
        nutrition: {
          calories: 23,
          protein: 2.9,
          vitamins: ['Vitamin K', 'Vitamin A', 'Iron', 'Folate'],
          allergens: []
        }
      },
      {
        id: 'prod11',
        name: 'Raw Honey - 500g',
        description: 'Pure raw honey from Western Cape wildflowers. Unprocessed and full of natural enzymes. Perfect sweetener and natural remedy.',
        category: 'Honey',
        price: 85.00,
        originalPrice: 105.00,
        discount: 19,
        farmer: {
          name: 'Cape Beekeepers',
          location: 'Cederberg, Western Cape',
          verified: true,
          rating: 4.8,
          totalReviews: 167,
          yearsExperience: 18,
          certifications: ['Raw Honey Certified', 'Bee Friendly']
        },
        quality: {
          grade: 'A',
          certifications: ['Raw Honey', 'Bee Friendly'],
          inspectionDate: '2025-01-14',
          inspector: 'Western Cape Honey Inspections'
        },
        sustainability: {
          organic: true,
          fairTrade: true,
          carbonFootprint: 1.2,
          waterUsage: 20,
          practices: ['Sustainable Beekeeping', 'Wildflower Protection']
        },
        images: [],
        reviews: [
          {
            id: 'rev11',
            userId: 'user11',
            userName: 'Sweet Tooth',
            rating: 5,
            comment: 'Amazing raw honey! The taste is incredible and it helped with my allergies.',
            date: '2025-01-14',
            verified: true,
            helpful: 14
          }
        ],
        traceabilityUrl: '/trace/QR-PROD-011',
        marketplaceUrl: 'https://maroon.co.za/product/raw-honey',
        inStock: true,
        stockLevel: 95,
        soldCount: 278,
        viewCount: 1120,
        tags: ['raw', 'honey', 'natural', 'wildflower'],
        shipping: {
          weight: 0.6,
          dimensions: { length: 8, width: 8, height: 10 },
          options: ['Standard', 'Express'],
          freeShipping: true
        },
        nutrition: {
          calories: 64,
          protein: 0.1,
          vitamins: ['Antioxidants', 'Enzymes'],
          allergens: ['Honey']
        }
      },
      {
        id: 'prod12',
        name: 'Organic Quinoa - 500g',
        description: 'Premium organic quinoa grain. Complete protein source perfect for healthy meals. Gluten-free and nutrient-dense.',
        category: 'Grains',
        price: 95.00,
        originalPrice: 120.00,
        discount: 21,
        farmer: {
          name: 'Highland Grains',
          location: 'Bergville, KwaZulu-Natal',
          verified: true,
          rating: 4.7,
          totalReviews: 89,
          yearsExperience: 14,
          certifications: ['Organic Certified', 'Gluten-Free']
        },
        quality: {
          grade: 'A',
          certifications: ['Organic', 'Gluten-Free'],
          inspectionDate: '2025-01-16',
          inspector: 'KZN Agricultural Inspections'
        },
        sustainability: {
          organic: true,
          fairTrade: true,
          carbonFootprint: 2.1,
          waterUsage: 160,
          practices: ['Water Conservation', 'Crop Rotation']
        },
        images: [],
        reviews: [
          {
            id: 'rev12',
            userId: 'user12',
            userName: 'Healthy Eater',
            rating: 4,
            comment: 'Great quality quinoa! Cooks perfectly and tastes amazing.',
            date: '2025-01-16',
            verified: true,
            helpful: 8
          }
        ],
        traceabilityUrl: '/trace/QR-PROD-012',
        marketplaceUrl: 'https://maroon.co.za/product/organic-quinoa',
        inStock: true,
        stockLevel: 110,
        soldCount: 156,
        viewCount: 690,
        tags: ['organic', 'quinoa', 'grains', 'gluten-free'],
        shipping: {
          weight: 0.5,
          dimensions: { length: 8, width: 8, height: 12 },
          options: ['Standard', 'Express'],
          freeShipping: false
        },
        nutrition: {
          calories: 120,
          protein: 4.4,
          vitamins: ['B Vitamins', 'Iron', 'Magnesium'],
          allergens: []
        }
      }
    ];

    setProducts(mockProducts);
    setFilteredProducts(mockProducts);
  }, []);

  // Enhanced filtering and sorting logic
  useEffect(() => {
    let filtered = products;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.farmer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Apply category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(product => product.category === categoryFilter);
    }

    // Apply price filter
    if (priceFilter !== 'all') {
      filtered = filtered.filter(product => {
        switch (priceFilter) {
          case 'under-50': return product.price < 50;
          case '50-100': return product.price >= 50 && product.price <= 100;
          case '100-200': return product.price > 100 && product.price <= 200;
          case 'over-200': return product.price > 200;
          default: return true;
        }
      });
    }

    // Apply quality filter
    if (qualityFilter !== 'all') {
      filtered = filtered.filter(product => product.quality.grade === qualityFilter);
    }

    // Apply sorting
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.farmer.rating - a.farmer.rating);
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.quality.inspectionDate).getTime() - new Date(a.quality.inspectionDate).getTime());
        break;
      case 'popular':
        filtered.sort((a, b) => b.soldCount - a.soldCount);
        break;
      default:
        // Featured - keep original order
        break;
    }

    setFilteredProducts(filtered);
  }, [products, searchTerm, categoryFilter, priceFilter, qualityFilter, sortBy]);

  const categories = ['Powders', 'Teas', 'Supplements', 'Oils', 'Seeds', 'Fresh', 'Poultry', 'Beef', 'Vegetables', 'Honey', 'Grains'];

  return (
    <>
      {/* Marketplace Navigation Header - Responsive */}
      <nav className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="w-full px-3 sm:px-4 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center flex-1 min-w-0">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 mr-2 sm:mr-4 truncate">Lwandle Moringa Marketplace</h1>
                <Badge className="bg-green-100 text-green-800 hidden sm:flex">
                  <Leaf className="h-3 w-3 mr-1" />
                  <span className="hidden sm:inline">100% Traceable</span>
                  <span className="sm:hidden">100%</span>
                </Badge>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <Button variant="outline" size="sm" onClick={() => router.push('/qr-demo')} className="hidden sm:flex">
                <QrCode className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Scan QR</span>
              </Button>
              {currentUser ? (
                <>
                  <Button onClick={() => router.push('/marketplace/cart')} className="relative" size="sm">
                    <ShoppingCart className="h-4 w-4 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">Cart</span>
                    {cart.length > 0 && (
                      <span className="absolute -top-2 -right-2 bg-orange-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {cart.reduce((sum, item) => sum + item.quantity, 0)}
                      </span>
                    )}
                  </Button>
                  <Button onClick={() => router.push('/login')} size="sm">
                    <span className="hidden sm:inline">Account</span>
                    <span className="sm:hidden">Acct</span>
                  </Button>
                </>
              ) : (
                <Button onClick={() => router.push('/login')} size="sm">
                  Login
                </Button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="min-h-screen bg-gray-50 pt-16">
        {/* Scroll to Top Button */}

      {/* Hero Section */}
      <HeroSection router={router} />

      {/* Featured Products */}
      <FeaturedProducts products={products} router={router} />

      {/* Categories */}
      <Categories categories={categories} router={router} />

      {/* Trust Signals */}
      <TrustSignals />

      {/* QR Scanner Section */}
      <QRScannerSection />

      {/* Shopping Cart Sidebar */}
      {showCart && (
        <div className="fixed right-0 top-0 h-full w-80 bg-white shadow-xl z-50 overflow-y-auto">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Shopping Cart</h3>
              <Button variant="outline" size="sm" onClick={() => setShowCart(false)}>
                ×
              </Button>
            </div>
          </div>
          
          <div className="p-6">
            {cart.length === 0 ? (
              <p className="text-gray-500 text-center py-8">Your cart is empty</p>
            ) : (
              <>
                <div className="space-y-4 mb-6">
                  {cart.map((item) => {
                    const product = products.find(p => p.id === item.productId);
                    if (!product) return null;
                    
                    return (
                      <div key={item.productId} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                        <img 
                          src={product.images[0] || '/images/placeholder.jpg'} 
                          alt={product.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{product.name}</h4>
                          <p className="text-gray-600">R{product.price.toFixed(2)}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">R{(product.price * item.quantity).toFixed(2)}</p>
                          <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                <Button className="w-full" onClick={() => router.push('/checkout')}>
                  Proceed to Checkout
                </Button>
              </>
            )}
          </div>
        </div>
      )}
      </main>
    </>
  );
}
