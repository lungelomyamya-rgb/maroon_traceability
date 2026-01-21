// src/app/marketplace/checkout/page.tsx
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
  CreditCard,
  Truck,
  Shield,
  CheckCircle,
  MapPin,
  Phone,
  Mail,
  User,
  ChevronRight,
  ShoppingCart,
  QrCode
} from 'lucide-react';

interface CheckoutFormData {
  // Shipping Information
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  
  // Payment Information
  cardNumber: string;
  cardName: string;
  expiryDate: string;
  cvv: string;
  
  // Order Notes
  orderNotes: string;
}

export default function CheckoutPage() {
  const { currentUser } = useUser();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  
  const [formData, setFormData] = useState<CheckoutFormData>({
    // Shipping Information
    firstName: '',
    lastName: '',
    email: currentUser?.email || '',
    phone: '',
    address: '',
    city: '',
    province: '',
    postalCode: '',
    
    // Payment Information
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
    
    // Order Notes
    orderNotes: ''
  });

  // Mock order summary
  const orderSummary = {
    subtotal: 224.98,
    shipping: 0,
    tax: 33.75,
    discount: 22.50,
    total: 236.23,
    items: [
      {
        name: 'Premium Moringa Powder - 250g',
        quantity: 2,
        price: 89.99
      },
      {
        name: 'Organic Moringa Tea - 20 bags',
        quantity: 1,
        price: 45.00
      }
    ]
  };

  useEffect(() => {
    // Redirect if not logged in
    if (!currentUser || currentUser.role !== 'public') {
      router.push('/intro');
      return;
    }
  }, [currentUser, router]);

  const handleInputChange = (field: keyof CheckoutFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    // Basic validation
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'province', 'postalCode'];
    return requiredFields.every(field => formData[field as keyof CheckoutFormData].trim() !== '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      alert('Please fill in all required fields');
      return;
    }

    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setOrderComplete(true);
      setOrderNumber(`ORD-${Date.now()}`);
    }, 3000);
  };

  if (!currentUser || currentUser.role !== 'public') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (orderComplete) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">Shipping Information</h2>
            <p className="text-lg text-gray-600 mb-2">Thank you for your purchase</p>
            <p className="text-sm text-gray-500 mb-8">Order #{orderNumber}</p>
            
            <Card className="max-w-md mx-auto p-6 mb-8">
              <h3 className="font-semibold text-gray-900 mb-4">Order Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Order Number:</span>
                  <span className="font-medium">{orderNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Amount:</span>
                  <span className="font-medium">R{orderSummary.total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Estimated Delivery:</span>
                  <span className="font-medium">3-5 business days</span>
                </div>
              </div>
            </Card>
            
            <div className="flex gap-4 justify-center">
              <Button 
                onClick={() => router.push('/marketplace')}
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-full"
              >
                Continue Shopping
              </Button>
              <Button 
                variant="outline"
                onClick={() => router.push('/marketplace/orders')}
              >
                View Orders
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Full-width Header - Separate from main content */}
      <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="w-full px-3 sm:px-4 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2 sm:gap-4">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => router.push('/marketplace')}
                className="h-8 sm:h-10"
              >
                <span className="hidden sm:inline">Back to Cart</span>
              </Button>
              <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 truncate">Checkout</h1>
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
        <div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Shipping Information */}
          <div className="lg:col-span-2 space-y-8">
            <Card className="overflow-hidden shadow-lg border-0">
              <div className="bg-gradient-to-r from-green-600 to-green-700 p-6">
                <h2 className="text-lg sm:text-xl font-bold text-white flex items-center">
                  <MapPin className="h-6 w-6 mr-3" />
                  Shipping Information
                </h2>
              </div>
              
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm sm:text-base"
                      placeholder="Enter your first name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm sm:text-base"
                      placeholder="Enter your last name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm sm:text-base"
                      placeholder="your.email@example.com"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm sm:text-base"
                      placeholder="+27 (XX) XXX-XXXX"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Street Address *
                    </label>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm sm:text-base"
                      placeholder="123 Main Street, Apartment 4B"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({...formData, city: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm sm:text-base"
                      placeholder="Cape Town"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Province *
                    </label>
                    <input
                      type="text"
                      value={formData.province}
                      onChange={(e) => setFormData({...formData, province: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm sm:text-base"
                      placeholder="Western Cape"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Postal Code *
                    </label>
                    <input
                      type="text"
                      value={formData.postalCode}
                      onChange={(e) => setFormData({...formData, postalCode: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm sm:text-base"
                      placeholder="8000"
                    />
                  </div>
                </div>
              </div>
            </Card>

            {/* Payment Information */}
            <Card className="overflow-hidden shadow-lg border-0">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6">
                <h2 className="text-lg sm:text-xl font-bold text-white flex items-center">
                  <CreditCard className="h-6 w-6 mr-3" />
                  Payment Information
                </h2>
              </div>
              
              <div className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Card Number *
                  </label>
                  <input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    value={formData.cardNumber}
                    onChange={(e) => setFormData({...formData, cardNumber: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Name on Card *
                  </label>
                  <input
                    type="text"
                    value={formData.cardName}
                    onChange={(e) => setFormData({...formData, cardName: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                    placeholder="John Doe"
                  />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Expiry Date *
                    </label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      value={formData.expiryDate}
                      onChange={(e) => setFormData({...formData, expiryDate: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      CVV *
                    </label>
                    <input
                      type="text"
                      placeholder="123"
                      value={formData.cvv}
                      onChange={(e) => setFormData({...formData, cvv: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                    />
                  </div>
                </div>
              </div>
              
              {/* Security Notice */}
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-blue-600" />
                  <span className="text-sm text-blue-700 font-medium">
                    Your payment information is encrypted and secure
                  </span>
                </div>
              </div>
            </Card>

            {/* Order Notes */}
            <Card className="overflow-hidden shadow-lg border-0">
              <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-6">
                <h2 className="text-lg sm:text-xl font-bold text-white flex items-center">
                  <Mail className="h-6 w-6 mr-3" />
                  Order Notes (Optional)
                </h2>
              </div>
              
              <div className="p-6">
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base resize-none"
                  rows={3}
                  placeholder="Special instructions for delivery, preferred delivery time, or any other notes..."
                  value={formData.orderNotes}
                  onChange={(e) => setFormData({...formData, orderNotes: e.target.value})}
                />
              </div>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="overflow-hidden shadow-lg border-0 sticky top-24">
              <div className="bg-gradient-to-r from-green-600 to-green-700 p-6">
                <h2 className="text-lg sm:text-xl font-bold text-white flex items-center">
                  <ShoppingCart className="h-6 w-6 mr-3" />
                  Order Summary
                </h2>
              </div>
              
              <div className="p-6">
                {/* Items */}
                <div className="space-y-4 sm:space-y-6">
                  {orderSummary.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-start pb-3 border-b last:border-0">
                      <div className="flex-1">
                        <span className="font-medium text-gray-900">{item.name}</span>
                        <span className="text-gray-500 ml-2">x{item.quantity}</span>
                      </div>
                      <span className="font-semibold text-gray-900">R{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                
                {/* Pricing */}
                <div className="border-t pt-4 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">R{orderSummary.subtotal.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium">
                      {orderSummary.shipping === 0 ? (
                        <span className="text-green-600 font-semibold">FREE</span>
                      ) : (
                        `R${orderSummary.shipping.toFixed(2)}`
                      )}
                    </span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tax (VAT)</span>
                    <span className="font-medium">R{orderSummary.tax.toFixed(2)}</span>
                  </div>
                  
                  {orderSummary.discount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-green-600">Discount</span>
                      <span className="font-medium text-green-600">
                        -R{orderSummary.discount.toFixed(2)}
                      </span>
                    </div>
                  )}
                  
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-bold text-gray-900">Total</span>
                      <span className="text-2xl font-bold text-green-600">
                        R{orderSummary.total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Place Order Button */}
                <Button 
                  type="submit"
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-2 sm:py-3 rounded-full h-10 sm:h-12 text-sm sm:text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                  onClick={handleSubmit}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard className="h-5 w-5 mr-2" />
                      Place Order
                      <ChevronRight className="h-5 w-5 ml-2" />
                    </>
                  )}
                </Button>

                {/* Trust Badges */}
                <div className="mt-6 space-y-3">
                  <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                    <Shield className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-gray-700">SSL Encrypted Payment</span>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                    <Truck className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-gray-700">Free shipping on orders over R500</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </form>
      </div>
    </div>
    </>
  );
}
