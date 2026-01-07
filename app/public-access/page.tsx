// src/app/public-access/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { QRScanner } from '@/components/qr';
import { Button } from '@/components/ui/button';
import { QrCode, Search, Shield, Users, Globe, Smartphone, Share2, Printer } from 'lucide-react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { ErrorBoundary } from '@/components/errorBoundary';
import { getAssetPath } from '@/lib/utils/assetPath';

export default function PublicAccessPage() {
  const router = useRouter();
  const [scanResult, setScanResult] = useState<string>('');

  const handleScanSuccess = (data: string) => {
    setScanResult(data);
    // Auto-navigate to trace page
    setTimeout(() => {
      router.push(`/public-access/trace/${data}`);
    }, 1500);
  };

  const handleScanError = (error: string) => {
    console.error('Scan error:', error);
  };

  const featuredProducts = [
    { id: 'PRD-2024-001', name: 'Organic Apples', farmer: 'Green Valley Farm' },
    { id: 'PRD-2024-002', name: 'Free Range Eggs', farmer: 'Sunny Acres' },
    { id: 'PRD-2024-003', name: 'Artisanal Cheese', farmer: 'Happy Farms' }
  ];

  return (
    <ErrorBoundary>
      <DashboardLayout
        title="Public Access"
        description="Trace products and verify authenticity without login"
      >
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex flex-col">
          {/* Hero Section */}
          <section className="py-20 px-4 sm:px-6 lg:px-8 flex-1">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
            <Globe className="h-8 w-8 text-green-600" />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Trace Your Food from
            <span className="text-green-600"> Farm to Table</span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Scan QR codes to verify product authenticity, view complete supply chain history, 
            and ensure food safety - all without creating an account.
          </p>

          {/* Quick Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button
              onClick={() => document.getElementById('qr-scanner')?.scrollIntoView({ behavior: 'smooth' })}
              className="!bg-gradient-to-r !from-green-600 !to-green-500 hover:!from-green-700 hover:!to-green-600 text-white px-8 py-3 shadow-lg rounded-full"
            >
              <QrCode className="h-5 w-5 mr-2" />
              Scan Product QR Code
            </Button>
            <Button
              onClick={() => router.push('/public-access/trace/PRD-2024-001')}
              variant="outline"
              className="px-8 py-3"
            >
              <Search className="h-5 w-5 mr-2" />
              View Products
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Public Access Features</h2>
            <p className="text-lg text-gray-600">Complete transparency for everyone</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-4">
                <Smartphone className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Mobile QR Scanning</h3>
              <p className="text-gray-600">Scan product QR codes with your phone camera to instantly verify authenticity</p>
            </div>

            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-4">
                <img src={getAssetPath("/images/maroon-logo.png")} alt="MAROON" className="h-16 w-16 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Complete Timeline</h3>
              <p className="text-gray-600">View the entire product journey from farm to retail with verified events</p>
            </div>

            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mb-4">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Login Required</h3>
              <p className="text-gray-600">Access product information instantly without creating an account</p>
            </div>
          </div>
        </div>
      </section>

      {/* QR Scanner Section */}
      <section id="qr-scanner" className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50 flex-1">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Scan Product QR Code</h2>
            <p className="text-lg text-gray-600">Try our QR scanner with product IDs</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <QRScanner
              onScanSuccess={handleScanSuccess}
              onScanError={handleScanError}
              mockMode={true}
            />

            <div className="space-y-4">
              <div className="bg-white p-6 rounded-lg border">
                <h3 className="font-semibold text-gray-900 mb-3">How to Use:</h3>
                <ol className="space-y-2 text-sm text-gray-600">
                  <li>1. Click "Start Scanning" above</li>
                  <li>2. Enter a demo product ID (or click "Random")</li>
                  <li>3. View the complete product trace</li>
                </ol>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Demo Product IDs:</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• PRD-2024-001 (Organic Apples)</li>
                  <li>• PRD-2024-002 (Free Range Eggs)</li>
                  <li>• PRD-2024-003 (Artisanal Cheese)</li>
                </ul>
              </div>

              {scanResult && (
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-green-800 font-medium">Scanned: {scanResult}</p>
                  <p className="text-green-600 text-sm">Redirecting to trace page...</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section id="demo" className="py-16 px-4 sm:px-6 lg:px-8 bg-white flex-1">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Products</h2>
            <p className="text-lg text-gray-600">Explore these verified products</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredProducts.map((product) => (
              <div key={product.id} className="bg-white border rounded-lg p-4 hover:shadow-lg transition-shadow">
                <div className="mb-4">
                  <div className="w-full h-32 bg-green-100 rounded-lg flex items-center justify-center overflow-hidden">
                    <img src="/images/maroon-logo.png" alt="MAROON" className="h-full w-full object-contain" />
                  </div>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{product.name}</h3>
                <p className="text-sm text-gray-600 mb-4">by {product.farmer}</p>
                <Button
                  onClick={() => router.push(`/public-access/trace/${product.id}`)}
                  variant="outline"
                  className="w-full"
                >
                  View Trace
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-3 pt-3 px-4 pb-0">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <img src="/images/maroon-logo.png" alt="MAROON" className="h-3 w-3" />
            <span className="text-xs font-semibold">Maroon Blockchain</span>
          </div>
          <p className="text-gray-400 text-xs">
            Transparent food supply chain for everyone
          </p>
        </div>
      </footer>
        </div>
      </DashboardLayout>
    </ErrorBoundary>
  );
}
