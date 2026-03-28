'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="mb-8">
          <div className="text-6xl mb-4">🌾</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h1>
          <p className="text-gray-600 mb-6">
            The product you're looking for doesn't exist or you don't have permission to view it.
          </p>
        </div>
        
        <div className="space-y-4">
          <Link href="/farmer/products">
            <Button className="w-full">
              Back to Products
            </Button>
          </Link>
          
          <Link href="/farmer">
            <Button variant="outline" className="w-full">
              Farmer Dashboard
            </Button>
          </Link>
        </div>
        
        <div className="mt-8 text-sm text-gray-500">
          <p>If you believe this is an error, please contact our support team.</p>
        </div>
      </div>
    </div>
  );
}
