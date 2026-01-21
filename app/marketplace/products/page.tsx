// src/app/marketplace/products/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useUser } from '@/contexts/userContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Search, 
  ShoppingCart, 
  Star, 
  Filter, 
  Heart,
  MapPin,
  Shield,
  Plus,
  Minus,
  Grid,
  List,
  QrCode,
  Grid3X3,
  Package,
  Coffee,
  Leaf,
  Pill,
  Droplet,
  Sprout
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
  };
  inStock: boolean;
  stockLevel: number;
  soldCount: number;
  reviews: number;
  image: string;
}

export default function ProductsPage() {
  const { currentUser } = useUser();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [cart, setCart] = useState<{[key: string]: number}>({});
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Mock products data
  const mockProducts: Product[] = [
    {
      id: 'powder1',
      name: 'Premium Moringa Powder - 250g',
      description: '100% pure moringa leaf powder, rich in nutrients and antioxidants',
      category: 'Powders',
      price: 89.99,
      originalPrice: 120.00,
      discount: 25,
      farmer: {
        name: 'Green Valley Farm',
        location: 'Stellenbosch, Western Cape',
        verified: true,
        rating: 4.8,
        totalReviews: 234
      },
      inStock: true,
      stockLevel: 156,
      soldCount: 892,
      reviews: 234,
      image: '🌿'
    },
    {
      id: 'tea1',
      name: 'Organic Moringa Tea - 20 bags',
      description: 'Premium moringa tea bags, perfect for daily wellness',
      category: 'Teas',
      price: 45.00,
      farmer: {
        name: 'Herbal Gardens',
        location: 'Franschhoek, Western Cape',
        verified: true,
        rating: 4.7,
        totalReviews: 156
      },
      inStock: true,
      stockLevel: 234,
      soldCount: 678,
      reviews: 156,
      image: '🍵'
    },
    {
      id: 'fresh1',
      name: 'Fresh Moringa Leaves - 500g',
      description: 'Freshly harvested moringa leaves, perfect for cooking',
      category: 'Fresh',
      price: 35.00,
      farmer: {
        name: 'Fresh Harvest Farm',
        location: 'Wellington, Western Cape',
        verified: true,
        rating: 4.5,
        totalReviews: 98
      },
      inStock: true,
      stockLevel: 67,
      soldCount: 234,
      reviews: 98,
      image: '🥬'
    },
    {
      id: 'supplement1',
      name: 'Moringa Capsules - 60 count',
      description: 'Convenient moringa supplement capsules for daily nutrition',
      category: 'Supplements',
      price: 65.00,
      farmer: {
        name: 'NutriLife Labs',
        location: 'Cape Town, Western Cape',
        verified: true,
        rating: 4.6,
        totalReviews: 189
      },
      inStock: true,
      stockLevel: 145,
      soldCount: 456,
      reviews: 189,
      image: '💊'
    },
    {
      id: 'oil1',
      name: 'Cold-Pressed Moringa Oil - 100ml',
      description: 'Pure cold-pressed moringa oil for cooking and skincare',
      category: 'Oils',
      price: 78.00,
      farmer: {
        name: 'Organic Oil Co',
        location: 'Paarl, Western Cape',
        verified: true,
        rating: 4.9,
        totalReviews: 267
      },
      inStock: true,
      stockLevel: 89,
      soldCount: 345,
      reviews: 267,
      image: '🫒'
    },
    {
      id: 'seed1',
      name: 'Moringa Seeds - Pack of 50',
      description: 'High-quality moringa seeds for home gardening',
      category: 'Seeds',
      price: 25.00,
      farmer: {
        name: 'Seed Haven',
        location: 'Stellenbosch, Western Cape',
        verified: true,
        rating: 4.4,
        totalReviews: 123
      },
      inStock: true,
      stockLevel: 234,
      soldCount: 567,
      reviews: 123,
      image: '🌱'
    }
  ];

  useEffect(() => {
    // Redirect if not logged in
    if (!currentUser || currentUser.role !== 'public') {
      router.push('/intro');
      return;
    }

    setProducts(mockProducts);
    setFilteredProducts(mockProducts);

    // Handle category query parameter
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category');
    if (category) {
      setSelectedCategory(category.charAt(0).toUpperCase() + category.slice(1));
      const filtered = mockProducts.filter(product => 
        product.category.toLowerCase() === category.toLowerCase()
      );
      setFilteredProducts(filtered);
    }
  }, [currentUser, router]);

  useEffect(() => {
    let filtered = products;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
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
      case 'popularity':
        filtered.sort((a, b) => b.soldCount - a.soldCount);
        break;
      default:
        // Featured - keep original order
        break;
    }

    setFilteredProducts(filtered);
  }, [products, searchTerm, sortBy]);

  const addToCart = (productId: string) => {
    setCart(prev => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 1
    }));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      const newCart = { ...cart };
      delete newCart[productId];
      setCart(newCart);
    } else {
      setCart(prev => ({
        ...prev,
        [productId]: quantity
      }));
    }
  };

  const toggleWishlist = (productId: string) => {
    setWishlist(prev => {
      const newWishlist = new Set(prev);
      if (newWishlist.has(productId)) {
        newWishlist.delete(productId);
      } else {
        newWishlist.add(productId);
      }
      return newWishlist;
    });
  };

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
    if (category === 'All') {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(product => product.category === category);
      setFilteredProducts(filtered);
    }
  };

  if (!currentUser || currentUser.role !== 'public') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <>
      {/* Full-width Header - Separate from main content */}
      <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <button
                  onClick={() => router.push('/marketplace')}
                  className="cursor-pointer"
                  aria-label="Go to marketplace"
                >
                  <img 
                    src="/images/lwandleMoringaBakery.png" 
                    alt="Lwandle Moringa Bakery"
                    className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
                  />
                </button>
              </div>
              <div>
                <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 truncate">Products</h1>
                <p className="text-xs sm:text-sm text-gray-600 hidden sm:block">Browse our complete collection</p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push('/marketplace/cart')}
                className="relative h-8 sm:h-10"
              >
                <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                <span className="hidden sm:inline">Cart</span>
                {Object.keys(cart).length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-orange-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {Object.values(cart).reduce((sum, quantity) => sum + quantity, 0)}
                  </span>
                )}
              </Button>
              <Badge className="bg-green-100 text-green-800">
                {filteredProducts.length} products
              </Badge>
            </div>
          </div>
        </div>
      </nav>

      {/* Floating Back Button - Top Corner */}
        <button
          onClick={() => router.back()}
          className="fixed top-4 left-4 bg-white hover:bg-gray-100 text-gray-800 p-3 rounded-full shadow-lg border border-gray-300 transition-all duration-300 z-30"
          aria-label="Go back to previous page"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            className="h-4 w-4"
          >
          </svg>
        </button>

        {/* Main Content */}
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-8">
          {/* Back Button Inside Main Content */}
          <div className="mb-2">
            <button
              onClick={() => router.back()}
              className="inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background border border-input hover:bg-accent hover:text-accent-foreground h-10 px-4 rounded-md text-sm sm:text-base"
              aria-label="Go back to previous page"
            >
              Back
            </button>
          </div>
          {/* Category Filters */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 flex items-center">
                <Grid3X3 className="h-5 w-5 mr-2 text-green-600" />
                <span className="ml-2">{viewMode === 'grid' ? 'Grid View' : 'List View'}</span>
              </h2>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                className="h-8 sm:h-10 w-8 sm:w-auto"
              >
                {viewMode === 'grid' ? (
                  <List className="h-4 w-4" />
                ) : (
                  <Grid className="h-4 w-4" />
                )}
              </Button>
            </div>
            <div className="flex flex-wrap gap-3 mb-6">
              {['All', 'Powders', 'Teas', 'Fresh', 'Supplements', 'Oils', 'Seeds'].map((category) => (
                <Button
                  key={category}
                  variant={category === selectedCategory ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleCategoryClick(category)}
                  className={category === selectedCategory
                    ? "bg-green-600 hover:bg-green-700 text-white border-green-600 shadow-sm"
                    : "border-gray-300 hover:border-green-400 hover:bg-green-50 transition-all duration-200"
                  }
                >
                  {category === 'All' && (
                    <Grid3X3 className="h-3 w-3 mr-1" />
                  )}
                  {category === 'Powders' && (
                    <Package className="h-3 w-3 mr-1" />
                  )}
                  {category === 'Teas' && (
                    <Coffee className="h-3 w-3 mr-1" />
                  )}
                  {category === 'Fresh' && (
                    <Leaf className="h-3 w-3 mr-1" />
                  )}
                  {category === 'Supplements' && (
                    <Pill className="h-3 w-3 mr-1" />
                  )}
                  {category === 'Oils' && (
                    <Droplet className="h-3 w-3 mr-1" />
                  )}
                  {category === 'Seeds' && (
                    <Sprout className="h-3 w-3 mr-1" />
                  )}
                  {category}
                </Button>
              ))}
            </div>
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search products by name or description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 h-11 border-gray-300 focus:border-green-500 focus:ring-green-500"
                  />
                </div>
              </div>
              <div className="lg:w-56">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="h-11 border-gray-300 focus:border-green-500 focus:ring-green-500">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="featured">Featured</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                    <SelectItem value="popularity">Most Popular</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          {filteredProducts.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-lg">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-600">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6 mt-6' : 'space-y-4 mt-6'}>
              {filteredProducts.map((product) => (
                <Card key={product.id} className={viewMode === 'grid' ? 'overflow-hidden hover:shadow-xl transition-shadow group rounded-2xl' : 'p-4 hover:shadow-md transition-shadow'}>
                  {viewMode === 'grid' ? (
                    // Grid View
                    <>
                      <div className="relative">
                        <div className="w-full h-32 sm:h-40 md:h-48 lg:h-56 bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center group-hover:scale-105 transition-transform duration-300 rounded-t-xl sm:rounded-t-2xl">
                          <div className="text-center">
                            <div className="text-2xl sm:text-3xl md:text-4xl mb-2">{product.image}</div>
                            <p className="text-sm text-green-700 font-medium">{product.category}</p>
                          </div>
                        </div>
                        {product.discount && (
                          <Badge className="absolute top-2 right-2 bg-red-600">
                            -{product.discount}%
                          </Badge>
                        )}
                      </div>
                      <div className="p-3 sm:p-4">
                        <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base line-clamp-2">{product.name}</h3>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < Math.floor(product.farmer.rating)
                                    ? 'text-yellow-400 fill-current'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-gray-500">({product.farmer.totalReviews})</span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">by {product.farmer.name}</p>
                        <p className="text-sm text-gray-500 mb-3 flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          {product.farmer.location}
                        </p>
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-lg sm:text-xl font-bold text-gray-900">R{product.price}</span>
                              {product.originalPrice && (
                                <span className="text-sm text-gray-500 line-through">
                                  R{product.originalPrice}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-gray-500">{product.soldCount} sold</p>
                          </div>
                          <div className="flex items-center gap-1">
                            <Shield className="h-4 w-4 text-green-600" />
                            <span className="text-xs text-green-600">Blockchain</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {cart[product.id] ? (
                            <div className="flex items-center gap-2 flex-1">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => updateCartQuantity(product.id, cart[product.id] - 1)}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="font-medium w-8 text-center">{cart[product.id]}</span>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => updateCartQuantity(product.id, cart[product.id] + 1)}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                          ) : (
                            <Button
                              className="w-full"
                              size="sm"
                              onClick={() => addToCart(product.id)}
                            >
                              <ShoppingCart className="h-4 w-4 mr-2" />
                              Add to Cart
                            </Button>
                          )}
                          <Button 
                            variant={wishlist.has(product.id) ? "default" : "outline"} 
                            size="sm"
                            onClick={() => toggleWishlist(product.id)}
                            className={wishlist.has(product.id) ? "bg-red-50 border-red-200 text-red-600 hover:bg-red-100" : ""}
                          >
                            <Heart className={`h-4 w-4 ${wishlist.has(product.id) ? "fill-current" : ""}`} />
                          </Button>
                        </div>
                      </div>
                    </>
                  ) : (
                    // List View
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-green-50 to-green-100 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0 border border-green-200 shadow-sm">
                        <span className="text-2xl sm:text-3xl">{product.image}</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between mb-2">
                          <div>
                            <h3 className="font-semibold text-gray-900 text-sm sm:text-base">{product.name}</h3>
                            <p className="text-sm text-gray-600">by {product.farmer.name}</p>
                            <p className="text-sm text-gray-500 flex items-center">
                              <MapPin className="h-3 w-3 mr-1" />
                              {product.farmer.location}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="text-base sm:text-lg font-semibold text-gray-900">R{product.price}</div>
                            {product.discount && (
                              <Badge className="bg-red-100 text-red-800 text-xs">
                                -{product.discount}% OFF
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < Math.floor(product.farmer.rating)
                                      ? 'text-yellow-400 fill-current'
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-sm text-gray-500">({product.farmer.totalReviews})</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {cart[product.id] ? (
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => updateCartQuantity(product.id, cart[product.id] - 1)}
                                >
                                  <Minus className="h-3 w-3" />
                                </Button>
                                <span className="font-medium w-8 text-center">{cart[product.id]}</span>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => updateCartQuantity(product.id, cart[product.id] + 1)}
                                >
                                  <Plus className="h-3 w-3" />
                                </Button>
                              </div>
                            ) : (
                              <Button
                                size="sm"
                                onClick={() => addToCart(product.id)}
                              >
                                <ShoppingCart className="h-4 w-4 mr-2" />
                                Add to Cart
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
