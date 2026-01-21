// src/components/marketplace/loadingSkeletons.tsx
'use client';

export default function LoadingSkeletons() {
  return (
    <div className="animate-pulse">
      {/* Search Skeleton */}
      <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <div className="h-10 bg-gray-200 rounded-lg"></div>
          </div>
          <div className="flex gap-2">
            <div className="h-10 w-24 bg-gray-200 rounded-lg"></div>
            <div className="h-10 w-16 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>

      {/* Featured Products Skeleton */}
      <section className="py-8 sm:py-12 md:py-16 lg:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <div className="h-8 sm:h-10 md:h-12 bg-gray-200 rounded-lg w-48 mx-auto mb-4"></div>
            <div className="h-4 sm:h-5 md:h-6 bg-gray-200 rounded-lg w-64 mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6 md:gap-8 lg:gap-12">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="w-full h-32 sm:h-40 md:h-48 lg:h-56 bg-gray-200"></div>
                <div className="p-3 sm:p-4">
                  <div className="h-4 sm:h-5 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 sm:h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
                  <div className="flex justify-between items-center mb-3">
                    <div className="h-5 sm:h-6 bg-gray-200 rounded w-20"></div>
                    <div className="h-3 sm:h-4 bg-gray-200 rounded w-16"></div>
                  </div>
                  <div className="flex gap-2">
                    <div className="h-8 sm:h-10 bg-gray-200 rounded flex-1"></div>
                    <div className="h-8 sm:h-10 w-8 sm:w-10 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Skeleton */}
      <section className="py-8 sm:py-12 md:py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <div className="h-8 sm:h-10 md:h-12 bg-gray-200 rounded-lg w-40 mx-auto mb-4"></div>
            <div className="h-4 sm:h-5 md:h-6 bg-gray-200 rounded-lg w-56 mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {[...Array(12)].map((_, index) => (
              <div key={index} className="bg-gray-50 rounded-lg border border-gray-200 h-20 sm:h-24 md:h-28 lg:h-32"></div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Signals Skeleton */}
      <section className="py-8 sm:py-12 md:py-16 lg:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <div className="h-8 sm:h-10 md:h-12 bg-gray-200 rounded-lg w-44 mx-auto mb-4"></div>
            <div className="h-4 sm:h-5 md:h-6 bg-gray-200 rounded-lg w-60 mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="bg-white rounded-lg p-4 sm:p-6 md:p-8 text-center">
                <div className="h-12 w-12 sm:h-16 sm:w-16 md:h-20 md:w-20 bg-gray-200 rounded-full mx-auto mb-4"></div>
                <div className="h-5 sm:h-6 bg-gray-200 rounded w-24 mx-auto mb-2"></div>
                <div className="h-3 sm:h-4 bg-gray-200 rounded w-32 mx-auto"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

// Product Card Skeleton
export function ProductCardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow">
        <div className="relative">
          <div className="w-full h-32 sm:h-40 md:h-48 lg:h-56 bg-gray-200"></div>
          <div className="absolute top-2 right-2 h-6 w-12 bg-gray-200 rounded"></div>
          <div className="absolute top-2 left-2 h-6 w-16 bg-gray-200 rounded"></div>
        </div>
        
        <div className="p-3 sm:p-4">
          <div className="h-4 sm:h-5 bg-gray-200 rounded mb-2"></div>
          <div className="flex items-center gap-2 mb-2">
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-3 w-3 sm:h-4 sm:w-4 bg-gray-200 rounded"></div>
              ))}
            </div>
            <div className="h-3 sm:h-4 bg-gray-200 rounded w-8"></div>
          </div>
          
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="h-5 sm:h-6 bg-gray-200 rounded w-20 mb-1"></div>
              <div className="h-3 sm:h-4 bg-gray-200 rounded w-24"></div>
            </div>
          </div>

          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="h-5 w-12 bg-gray-200 rounded"></div>
              <div className="h-3 sm:h-4 bg-gray-200 rounded w-16"></div>
            </div>
          </div>

          <div className="flex gap-2">
            <div className="h-8 sm:h-10 bg-gray-200 rounded flex-1"></div>
            <div className="h-8 sm:h-10 w-8 sm:w-10 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Search Results Skeleton
export function SearchResultsSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="mb-4">
        <div className="h-6 bg-gray-200 rounded w-48 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-32"></div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {[...Array(8)].map((_, index) => (
          <ProductCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}

// Product Detail Skeleton
export function ProductDetailSkeleton() {
  return (
    <div className="animate-pulse min-h-screen bg-gray-50">
      {/* Navigation Skeleton */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-4">
              <div className="h-10 w-20 bg-gray-200 rounded"></div>
              <div className="h-6 w-32 bg-gray-200 rounded"></div>
            </div>
            <div className="h-10 w-20 bg-gray-200 rounded"></div>
          </div>
        </div>
      </nav>

      {/* Product Detail Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Image Skeleton */}
          <div className="space-y-4">
            <div className="aspect-square bg-gray-200 rounded-lg"></div>
            <div className="flex gap-2">
              <div className="h-8 w-16 bg-gray-200 rounded"></div>
              <div className="h-8 w-20 bg-gray-200 rounded"></div>
              <div className="h-8 w-16 bg-gray-200 rounded"></div>
            </div>
          </div>

          {/* Product Information Skeleton */}
          <div className="space-y-6">
            <div>
              <div className="h-8 sm:h-10 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="flex items-center gap-4 mb-4">
                <div className="h-8 w-24 bg-gray-200 rounded"></div>
                <div className="h-6 w-20 bg-gray-200 rounded"></div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-5 w-5 bg-gray-200 rounded"></div>
                  ))}
                </div>
                <div className="h-4 bg-gray-200 rounded w-24"></div>
              </div>
            </div>

            <div>
              <div className="h-6 bg-gray-200 rounded w-24 mb-2"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                <div className="h-4 bg-gray-200 rounded w-4/6"></div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="h-6 bg-gray-200 rounded w-32 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-24 mb-1"></div>
                  <div className="h-4 bg-gray-200 rounded w-28"></div>
                </div>
                <div className="text-right">
                  <div className="h-4 bg-gray-200 rounded w-20 mb-1"></div>
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                </div>
              </div>
            </div>

            <div>
              <div className="h-6 bg-gray-200 rounded w-20 mb-2"></div>
              <div className="flex items-center gap-4">
                <div className="flex items-center border rounded-lg">
                  <div className="h-10 w-10 bg-gray-200"></div>
                  <div className="h-6 w-12 bg-gray-200"></div>
                  <div className="h-10 w-10 bg-gray-200"></div>
                </div>
                <div className="h-4 bg-gray-200 rounded w-20"></div>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="h-12 bg-gray-200 rounded flex-1"></div>
              <div className="h-12 w-24 bg-gray-200 rounded"></div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white rounded-lg p-4">
                <div className="h-5 bg-gray-200 rounded w-20 mb-2"></div>
                <div className="space-y-1">
                  <div className="h-3 bg-gray-200 rounded w-16"></div>
                  <div className="h-3 bg-gray-200 rounded w-20"></div>
                  <div className="h-3 bg-gray-200 rounded w-24"></div>
                </div>
              </div>
              <div className="bg-white rounded-lg p-4">
                <div className="h-5 bg-gray-200 rounded w-24 mb-2"></div>
                <div className="space-y-1">
                  <div className="h-3 bg-gray-200 rounded w-16"></div>
                  <div className="h-3 bg-gray-200 rounded w-20"></div>
                  <div className="h-3 bg-gray-200 rounded w-28"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
