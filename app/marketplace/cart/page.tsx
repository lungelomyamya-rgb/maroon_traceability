// src/app/marketplace/cart/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useUser } from '@/contexts/userContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  ShoppingCart, 
  Plus, 
  Minus, 
  Trash2, 
  ArrowLeft,
  CreditCard,
  Truck,
  Shield,
  ChevronRight,
  QrCode,
  User,
  MapPin,
  CheckCircle,
  XCircle
} from 'lucide-react';

interface CartItem {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  farmer: string;
  location: string;
  image: string;
  quantity: number;
  inStock: boolean;
  stockLevel: number;
}

// Mock cart data
const mockCartItems: CartItem[] = [
  {
    id: 'prod1',
    name: 'Premium Moringa Powder - 250g',
    category: 'Powders',
    price: 89.99,
    originalPrice: 120.00,
    discount: 25,
    farmer: 'Green Valley Farm',
    location: 'Stellenbosch, Western Cape',
    image: '🌿',
    quantity: 2,
    inStock: true,
    stockLevel: 156
  },
  {
    id: 'prod2',
    name: 'Organic Moringa Tea - 20 bags',
    category: 'Teas',
    price: 45.00,
    farmer: 'Herbal Gardens',
    location: 'Franschhoek, Western Cape',
    image: '🍵',
    quantity: 1,
    inStock: true,
    stockLevel: 89
  }
];

export default function CartPage() {
  const { currentUser } = useUser();
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>(mockCartItems);
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoDiscount, setPromoDiscount] = useState(0);

  useEffect(() => {
    // Redirect if not logged in
    if (!currentUser || currentUser.role !== 'public') {
      router.push('/intro');
      return;
    }
  }, [currentUser, router]);

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    setCartItems(items => 
      items.map(item => 
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeItem = (id: string) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const calculateShipping = () => {
    const subtotal = calculateSubtotal();
    return subtotal > 500 ? 0 : 50; // Free shipping over R500
  };

  const calculateTax = () => {
    return calculateSubtotal() * 0.15; // 15% VAT
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const shipping = calculateShipping();
    const tax = calculateTax();
    const promo = promoApplied ? subtotal * (promoDiscount / 100) : 0;
    return subtotal + shipping + tax - promo;
  };

  const applyPromoCode = () => {
    if (promoCode.toLowerCase() === 'fresh10') {
      setPromoApplied(true);
      setPromoDiscount(10);
    } else if (promoCode.toLowerCase() === 'welcome20') {
      setPromoApplied(true);
      setPromoDiscount(20);
    } else {
      // Invalid code
      setPromoApplied(false);
      setPromoDiscount(0);
    }
  };

  if (!currentUser || currentUser.role !== 'public') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
              <ShoppingCart className="h-10 w-10 text-gray-400" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
            <p className="text-lg text-gray-600 mb-8">Looks like you haven't added any products yet</p>
            <Button 
              onClick={() => router.push('/marketplace')}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-full"
            >
              Continue Shopping
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
      <>
        {/* Full-width Header - Separate from main content */}
      <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-4">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => router.push('/marketplace')}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Marketplace
              </Button>
              <h1 className="text-2xl font-bold text-gray-900">Shopping Cart</h1>
            </div>
            <Badge className="bg-green-100 text-green-800">
              {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
            </Badge>
          </div>
        </div>
      </nav>

        {/* Main Content */}
        <div className="min-h-screen bg-gray-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-6">
                {cartItems.map((item) => (
                  <Card key={item.id} className="overflow-hidden hover:shadow-md transition-shadow duration-200">
                    <div className="p-6">
                      <div className="flex gap-6">
                        {/* Product Image */}
                        <div className="w-24 h-24 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                          <span className="text-3xl">{item.image}</span>
                        </div>
                        
                        {/* Product Details */}
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900 mb-2 text-lg">{item.name}</h3>
                              <div className="flex items-center gap-4 text-sm text-gray-600">
                                <div className="flex items-center">
                                  <User className="h-4 w-4 mr-1" />
                                  {item.farmer}
                                </div>
                                <div className="flex items-center">
                                  <MapPin className="h-4 w-4 mr-1" />
                                  {item.location}
                                </div>
                              </div>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => removeItem(item.id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                disabled={item.quantity <= 1}
                                className="h-9 w-9 p-0"
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <div className="w-12 text-center">
                                <span className="font-semibold text-lg">{item.quantity}</span>
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                disabled={item.quantity >= item.stockLevel}
                                className="h-9 w-9 p-0"
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                            
                            <div className="text-right">
                              <div className="font-semibold text-xl text-gray-900 mb-1">
                                R{(item.price * item.quantity).toFixed(2)}
                              </div>
                              {item.originalPrice && (
                                <div className="text-sm text-gray-500 line-through mb-1">
                                  R{(item.originalPrice * item.quantity).toFixed(2)}
                                </div>
                              )}
                              {item.discount && (
                                <Badge className="bg-red-100 text-red-800 text-xs">
                                  -{item.discount}% OFF
                                </Badge>
                              )}
                            </div>
                          </div>
                          
                          {/* Stock Status */}
                          <div className="mt-3 pt-3 border-t">
                            <div className="flex items-center justify-between">
                              <span className={`text-sm font-medium ${item.inStock ? 'text-green-600' : 'text-red-600'}`}>
                                {item.inStock ? (
                                  <>
                                    <CheckCircle className="h-4 w-4 mr-1" />
                                    {item.stockLevel} in stock
                                  </>
                                ) : (
                                  <>
                                    <XCircle className="h-4 w-4 mr-1" />
                                    Out of stock
                                  </>
                                )}
                              </span>
                              <span className="text-xs text-gray-500">
                                {item.inStock && `Only ${item.stockLevel} left`}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="p-6 sticky top-24 shadow-lg border-0">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-900">Order Summary</h2>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
                  </Badge>
                </div>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">R{calculateSubtotal().toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium">
                      {calculateShipping() === 0 ? (
                        <span className="text-green-600 font-semibold">FREE</span>
                      ) : (
                        `R${calculateShipping().toFixed(2)}`
                      )}
                    </span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tax (VAT)</span>
                    <span className="font-medium">R{calculateTax().toFixed(2)}</span>
                  </div>
                  
                  {promoApplied && (
                    <div className="flex justify-between text-sm">
                      <span className="text-green-600">Promo Discount</span>
                      <span className="font-medium text-green-600">
                        -R{(calculateSubtotal() * (promoDiscount / 100)).toFixed(2)}
                      </span>
                    </div>
                  )}
                  
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold text-gray-900">Total</span>
                      <span className="text-2xl font-bold text-green-600">
                        R{calculateTotal().toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Promo Code */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Promo Code
                  </label>
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      placeholder="Enter code"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="flex-1 h-11 border-gray-300 focus:border-green-500 focus:ring-green-500"
                    />
                    <Button 
                      variant="outline"
                      onClick={applyPromoCode}
                      disabled={!promoCode}
                      className="h-11"
                    >
                      Apply
                    </Button>
                  </div>
                  {promoApplied && (
                    <p className="text-xs text-green-600 mt-2 flex items-center">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Promo code applied! {promoDiscount}% discount
                    </p>
                  )}
                  {promoCode && !promoApplied && (
                    <p className="text-xs text-red-600 mt-2 flex items-center">
                      <XCircle className="h-3 w-3 mr-1" />
                      Invalid promo code
                    </p>
                  )}
                </div>

                {/* Trust Badges */}
                <div className="flex items-center gap-2 mb-6 p-3 bg-gray-50 rounded-lg">
                  <Shield className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-gray-700">Secure checkout</span>
                </div>

                {/* Checkout Button */}
                <Button 
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-full h-12 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                  onClick={() => router.push('/marketplace/checkout')}
                >
                  <CreditCard className="h-5 w-5 mr-2" />
                  Proceed to Checkout
                  <ChevronRight className="h-5 w-5 ml-2" />
                </Button>

                {/* Free Shipping Notice */}
                {calculateShipping() > 0 && (
                  <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <p className="text-xs text-amber-800 flex items-center">
                      <Truck className="h-3 w-3 mr-1" />
                      Add R${(500 - calculateSubtotal()).toFixed(2)} more for free shipping!
                    </p>
                  </div>
                )}
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
