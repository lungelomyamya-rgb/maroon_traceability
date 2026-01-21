// src/components/marketplace/marketplace.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/contexts/userContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ShoppingCart, 
  QrCode, 
  ArrowUp
} from 'lucide-react';
import ErrorBoundary from '@/components/errorBoundary';
import { useSkipLinks } from './keyboardNavigation';
import HeroSection from './heroSection';
import FeaturedProducts from './featuredProducts';
import CategoriesComponent from './categories';
import TrustSignals from './trustSignals';
import QRScannerSection from './qRScannerSection';
import SearchAndFilter from './searchAndFilter';
import { mockProducts, categories } from '@/constants/marketplaceData';
import { Product } from '@/constants/marketplaceData';

interface CartItem {
  id: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
  image: string;
  farmer: string;
}

export default function Marketplace() {
  const { currentUser } = useUser();
  const router = useRouter();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(mockProducts);
  const products = mockProducts;

  // Initialize skip links
  useSkipLinks();

  // Scroll to top functionality
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const addToCart = (product: Product) => {
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
      setCart(cart.map(item => 
        item.id === product.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, {
        id: product.id,
        name: product.name,
        category: product.category,
        price: product.price,
        quantity: 1,
        image: product.images[0] || '/images/placeholder.jpg',
        farmer: product.farmer.name
      }]);
    }
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      setCart(cart.map(item => 
        item.id === productId 
          ? { ...item, quantity }
          : item
      ));
    }
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartItemCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50">
        {/* Marketplace Navigation Header - Responsive */}
        <nav className="bg-white shadow-sm border-b sticky top-0 z-40" role="navigation" aria-label="Marketplace navigation">
          <div className="w-full px-3 sm:px-4 lg:px-8">
            <div className="flex justify-between h-14 sm:h-16 items-center">
              <div className="flex items-center flex-1 min-w-0">
                <div className="flex-shrink-0 flex items-center">
                  <img 
                    src="/images/lwandleMoringaBakery.png" 
                    alt="Lwandle Moringa Bakery Logo"
                    className="h-10 w-10 sm:h-12 sm:w-12 mr-3 rounded-lg"
                  />
                  <div className="block">
                    <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 truncate">Lwandle Moringa</h1>
                    <p className="text-green-600 text-xs sm:text-sm hidden xs:block">100% Traceable Products</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1 sm:gap-2 lg:gap-4">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => router.push('/qr-demo')} 
                  className="hidden xs:flex px-2"
                  aria-label="Scan QR code"
                >
                  <QrCode className="h-4 w-4" />
                  <span className="hidden sm:inline ml-2">Scan QR</span>
                </Button>
                {currentUser ? (
                  <>
                    <Button 
                      onClick={() => router.push('/marketplace/cart')} 
                      className="relative px-2 sm:px-3" 
                      size="sm"
                      aria-label={`Shopping cart with ${getCartItemCount()} items`}
                    >
                      <ShoppingCart className="h-4 w-4" />
                      <span className="hidden sm:inline ml-2">Cart</span>
                      {cart.length > 0 && (
                        <span 
                          className="absolute -top-1 -right-1 bg-orange-600 text-white text-xs rounded-full h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center"
                          aria-label={`${getCartItemCount()} items in cart`}
                        >
                          {getCartItemCount()}
                        </span>
                      )}
                    </Button>
                    <Button 
                      onClick={() => router.push('/marketplace/orders')} 
                      size="sm"
                      className="px-2 sm:px-3"
                      aria-label="View orders"
                    >
                      <span className="hidden sm:inline">Orders</span>
                      <span className="sm:hidden">📦</span>
                    </Button>
                    <Button 
                      onClick={() => router.push('/login')} 
                      size="sm"
                      className="px-2 sm:px-3"
                      aria-label="Account"
                    >
                      <span className="hidden sm:inline">Account</span>
                      <span className="sm:hidden">👤</span>
                    </Button>
                  </>
                ) : (
                  <Button 
                    onClick={() => router.push('/login')} 
                    size="sm"
                    className="px-2 sm:px-3 text-xs sm:text-sm"
                    aria-label="Login to marketplace"
                  >
                    Login
                  </Button>
                )}
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main id="main-content" className="min-h-screen bg-gray-50">
          {/* Back Button Inside Main Content */}
          <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4">
            
          </div>

          {/* Hero Section */}
          <HeroSection router={router} />

          {/* Search and Filter Section */}
          <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 mb-6">
            <SearchAndFilter products={products} onFilter={setFilteredProducts} />
          </div>

          {/* Featured Products */}
          <FeaturedProducts products={filteredProducts} router={router} addToCart={addToCart} cart={cart} />

          {/* Categories */}
          <CategoriesComponent categories={categories} router={router} />

          {/* Trust Signals */}
          <TrustSignals />

          {/* QR Scanner Section */}
          <QRScannerSection />
        </main>

        {/* Scroll to Top Button */}
        {showScrollTop && (
          <button
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 bg-green-600 hover:bg-green-700 text-white p-3 rounded-full shadow-lg transition-all duration-300 z-30"
            aria-label="Scroll to top"
          >
            <ArrowUp className="h-5 w-5" />
          </button>
        )}

        {/* Shopping Cart Sidebar */}
        {cart.length > 0 && (
          <div className="fixed right-0 top-0 h-full w-80 bg-white shadow-xl z-50 overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Shopping Cart</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCart([])}
                  aria-label="Clear cart"
                >
                  Clear
                </Button>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                  <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">📦</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{item.name}</h4>
                    <p className="text-xs text-gray-600">{item.farmer}</p>
                    <p className="text-sm font-semibold">R{item.price.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      aria-label={`Decrease quantity of ${item.name}`}
                    >
                      -
                    </Button>
                    <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      aria-label={`Increase quantity of ${item.name}`}
                    >
                      +
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="p-6 border-t">
              <div className="flex justify-between mb-4">
                <span className="font-semibold">Total:</span>
                <span className="font-bold text-lg">R{getCartTotal().toFixed(2)}</span>
              </div>
              <Button
                onClick={() => router.push('/marketplace/checkout')}
                className="w-full bg-green-600 hover:bg-green-700 text-white"
                aria-label="Proceed to checkout"
              >
                Proceed to Checkout
              </Button>
            </div>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
}
