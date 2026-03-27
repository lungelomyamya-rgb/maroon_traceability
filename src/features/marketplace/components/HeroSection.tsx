// src/components/marketplace/HeroSection.tsx
'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  CheckCircle, 
  Award, 
  Leaf, 
  Truck 
} from 'lucide-react';

interface HeroSectionProps {
  router: any;
}

export default function HeroSection({ router }: HeroSectionProps) {
  return (
    <section 
      className="bg-gradient-to-r from-green-600 to-emerald-700 text-white py-6 sm:py-8 md:py-12 rounded-t-3xl"
      role="banner"
      aria-label="Marketplace Hero Section"
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        <div className="text-center">
          <Badge 
            className="bg-white/20 text-white mb-2 sm:mb-3"
            aria-label="100% Traceable Products Badge"
          >
            <Leaf className="h-3 w-3 sm:h-4 sm:w-4 mr-1" aria-hidden="true" />
            <span className="text-xs sm:text-sm">100% Traceable Products</span>
          </Badge>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4">
            Lwandle Moringa
          </h1>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl mb-4 sm:mb-6 text-green-100 max-w-xl sm:max-w-2xl lg:max-w-3xl mx-auto">
            Farm-to-Shelf Transparency. Every product tells a story of quality, sustainability, and trust.
          </p>
          
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-4 sm:mb-8" role="list">
            <div className="flex items-center gap-1 sm:gap-2 bg-white/10 px-2 sm:px-3 py-1 rounded-full" role="listitem">
              <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4" aria-hidden="true" />
              <span className="text-xs sm:text-sm">Verified Farmers</span>
            </div>
            <div className="flex items-center gap-1 sm:gap-2 bg-white/10 px-2 sm:px-3 py-1 rounded-full" role="listitem">
              <Award className="h-3 w-3 sm:h-4 sm:w-4" aria-hidden="true" />
              <span className="text-xs sm:text-sm">Quality Inspected</span>
            </div>
            <div className="flex items-center gap-1 sm:gap-2 bg-white/10 px-2 sm:px-3 py-1 rounded-full" role="listitem">
              <Leaf className="h-3 w-3 sm:h-4 sm:w-4" aria-hidden="true" />
              <span className="text-xs sm:text-sm">Sustainably Grown</span>
            </div>
            <div className="flex items-center gap-1 sm:gap-2 bg-white/10 px-2 sm:px-3 py-1 rounded-full" role="listitem">
              <Truck className="h-3 w-3 sm:h-4 sm:w-4" aria-hidden="true" />
              <span className="text-xs sm:text-sm">Fresh Delivery</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mt-6 sm:mt-8">
            <button 
              onClick={() => router.push('/qr-demo')}
              className="inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-green-600 hover:bg-green-700 text-white h-10 sm:h-12 py-2 px-4 sm:px-6 md:px-8 text-sm sm:text-base"
              aria-label="Scan Product QR Code to trace product origin"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="lucide lucide-qr-code h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2"
                aria-hidden="true"
              >
                <rect width="5" height="5" x="3" y="3" rx="1"></rect>
                <rect width="5" height="5" x="16" y="3" rx="1"></rect>
                <rect width="5" height="5" x="3" y="16" rx="1"></rect>
                <path d="M7 8h10"></path>
                <path d="M8 12h8"></path>
                <path d="M7 16h10"></path>
                <path d="M12 8v8"></path>
                <path d="M21 12v.01"></path>
                <path d="M12 21v-1"></path>
              </svg>
              <span className="text-xs sm:text-sm">Scan Product QR Code</span>
            </button>
            <button 
              onClick={() => router.push('/marketplace/products')}
              className="inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background border border-input hover:bg-accent hover:text-accent-foreground h-10 sm:h-12 py-2 px-4 sm:px-6 md:px-8 bg-white/10 hover:bg-white/20 text-white border-white/20 text-sm sm:text-base"
              aria-label="Browse all products in the marketplace"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="lucide lucide-search h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2"
                aria-hidden="true"
              >
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
