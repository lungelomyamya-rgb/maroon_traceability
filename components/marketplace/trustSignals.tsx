// src/components/marketplace/trustSignals.tsx
'use client';

import { CheckCircle, Award, Leaf, Truck, Shield, Users, Package } from 'lucide-react';

interface TrustSignal {
  icon: string;
  title: string;
  description: string;
}

const trustSignals: TrustSignal[] = [
  {
    icon: 'CheckCircle',
    title: 'Verified Farmers',
    description: 'All farmers are verified and certified'
  },
  {
    icon: 'Award',
    title: 'Quality Inspected',
    description: 'Products undergo rigorous quality checks'
  },
  {
    icon: 'Leaf',
    title: 'Sustainably Grown',
    description: 'Environmentally friendly farming practices'
  },
  {
    icon: 'Truck',
    title: 'Fresh Delivery',
    description: 'Fast and reliable delivery nationwide'
  },
  {
    icon: 'Shield',
    title: 'Secure Payments',
    description: 'Safe and secure payment processing'
  },
  {
    icon: 'Users',
    title: 'Customer Support',
    description: 'Dedicated support for all customers'
  }
];

export default function TrustSignals() {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'CheckCircle':
        return <CheckCircle className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 text-green-600" />;
      case 'Award':
        return <Award className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 text-green-600" />;
      case 'Leaf':
        return <Leaf className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 text-green-600" />;
      case 'Truck':
        return <Truck className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 text-green-600" />;
      case 'Shield':
        return <Shield className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 text-green-600" />;
      case 'Users':
        return <Users className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 text-green-600" />;
      default:
        return <Package className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 text-green-600" />;
    }
  };

  return (
    <section 
      className="py-8 sm:py-12 md:py-16 lg:py-20 bg-gray-50"
      aria-labelledby="trust-signals-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12">
          <h2 id="trust-signals-heading" className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Why Trust Lwandle Moringa
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl lg:max-w-3xl mx-auto">
            We ensure quality, transparency, and sustainability in every product
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8" role="list">
          {trustSignals.map((signal, index) => (
            <div 
              key={index}
              className="p-4 sm:p-6 md:p-8 text-center hover:shadow-lg transition-shadow duration-300 bg-white rounded-xl sm:rounded-2xl border border-gray-200"
              role="listitem"
            >
              <div className="flex justify-center mb-3 sm:mb-4 md:mb-6" aria-hidden="true">
                {getIcon(signal.icon)}
              </div>
              <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">
                {signal.title}
              </h3>
              <p className="text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed">
                {signal.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
