// src/app/packaging/qr-generation/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/contexts/userContext';
import { DashboardLayout } from '@/components/dashboard/dashboardLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { QrCode, Download, Plus, Search, Package, Copy, Check } from 'lucide-react';
import { QRGenerator } from '@/components/qr';

export default function QRGenerationPage() {
  const { currentUser } = useUser();
  const router = useRouter();
  const [selectedProduct, setSelectedProduct] = useState('');
  const [batchCode, setBatchCode] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [generatedQRs, setGeneratedQRs] = useState<Array<{id: string, data: string, productName: string, batchCode: string}>>([]);

  useEffect(() => {
    // Redirect if user doesn't have packaging role (with delay for context update)
    const timer = setTimeout(() => {
      if (currentUser?.role !== 'packaging') {
        console.log('QR Generation page - redirecting to unauthorized. Current user:', currentUser);
        router.push('/unauthorized');
        return;
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [currentUser, router]);

  if (!currentUser || currentUser.role !== 'packaging') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Mock products for selection
  const products = [
    { id: 'PRD-2024-001', name: 'Organic Apples Premium', batchCode: 'BATCH-2024-CAR-STL-ABC' },
    { id: 'PRD-2024-002', name: 'Fresh Pears Vacuum Sealed', batchCode: 'BATCH-2024-VAC-STL-DEF' },
    { id: 'PRD-2024-003', name: 'Mixed Citrus Bulk', batchCode: 'BATCH-2024-BUL-STL-GHI' }
  ];

  const handleGenerateQR = () => {
    if (!selectedProduct || !batchCode || quantity < 1) return;

    const product = products.find(p => p.id === selectedProduct);
    if (!product) return;

    // Generate QR codes
    const newQRs = [];
    for (let i = 0; i < quantity; i++) {
      newQRs.push({
        id: `qr-${Date.now()}-${i}`,
        data: `QR_${product.batchCode}_${i + 1}_${Date.now()}`,
        productName: product.name,
        batchCode: batchCode
      });
    }

    setGeneratedQRs([...generatedQRs, ...newQRs]);
  };

  const handleDownloadQR = (qrData: string) => {
    // Create download link
    const dataStr = JSON.stringify({ qr: qrData, generated: new Date().toISOString() });
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const link = document.createElement('a');
    link.setAttribute('href', dataUri);
    link.setAttribute('download', `qr-code-${Date.now()}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <>
      {/* Back Button Above DashboardLayout */}
      <div className="px-4 sm:px-6 lg:px-8 pt-4">
        <Button
          variant="outline"
          onClick={() => router.push('/packaging')}
          className="inline-flex items-center gap-2 text-sm"
        >
          Back
        </Button>
      </div>
      
      <DashboardLayout
        title="QR Code Generation"
        description="Generate QR codes for product tracking and traceability"
      >
        <div className="space-y-6">
          {/* QR Generation Form */}
          <Card className="p-4 sm:p-6">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6 text-center">Generate QR Codes</h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
              <div className="w-full lg:w-auto">
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Product</label>
                <select
                  value={selectedProduct}
                  onChange={(e) => setSelectedProduct(e.target.value)}
                  className="w-full p-3 text-base border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="">Choose a product...</option>
                  {products.map(product => (
                    <option key={product.id} value={product.id}>
                      {product.name} ({product.batchCode})
                    </option>
                  ))}
                </select>
              </div>

              <div className="w-full lg:w-auto">
                <label className="block text-sm font-medium text-gray-700 mb-2">Batch Code</label>
                <Input
                  value={batchCode}
                  onChange={(e) => setBatchCode(e.target.value)}
                  placeholder="Enter batch code"
                  className="w-full p-3 text-base"
                />
              </div>

              <div className="w-full lg:w-auto">
                <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                <Input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  min="1"
                  max="100"
                  className="w-full p-3 text-base"
                />
              </div>
            </div>

            <div className="flex justify-center mt-6 sm:mt-8">
              <Button
                onClick={handleGenerateQR}
                disabled={!selectedProduct || !batchCode || quantity < 1}
                className="bg-purple-600 hover:bg-purple-700 text-white w-full sm:w-auto px-6 py-3 text-base font-medium"
              >
                <QrCode className="h-5 w-5 mr-2" />
                Generate {quantity} QR Code{quantity > 1 ? 's' : ''}
              </Button>
            </div>
          </Card>

          {/* Generated QR Codes */}
          {generatedQRs.length > 0 && (
            <Card className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Generated QR Codes</h3>
                  <p className="text-sm text-gray-500">{generatedQRs.length} QR codes ready</p>
                </div>
                <Button variant="outline" className="w-full sm:w-auto">
                  <Download className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Download All</span>
                  <span className="sm:hidden">All</span>
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {generatedQRs.map((qr) => (
                  <Card key={qr.id} className="p-4 border-2 border-dashed border-gray-300 hover:border-purple-300 transition-colors">
                    <div className="text-center">
                      <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                        <QrCode className="h-8 w-8 sm:h-10 sm:w-10 text-gray-400" />
                      </div>
                      <div className="space-y-2">
                        <p className="font-medium text-gray-900 text-sm sm:text-base">{qr.productName}</p>
                        <p className="text-xs text-gray-600">{qr.batchCode}</p>
                        <Badge className="bg-purple-100 text-purple-800 text-xs">
                          QR #{qr.id.split('-')[1]}
                        </Badge>
                      </div>
                      <div className="flex gap-2 mt-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCopyToClipboard(qr.data)}
                          className="flex-1 text-xs sm:text-sm"
                        >
                          <Copy className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                          <span className="hidden sm:inline">Copy Data</span>
                          <span className="sm:hidden">Copy</span>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownloadQR(qr.data)}
                          className="flex-1 text-xs sm:text-sm"
                        >
                          <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                          <span className="hidden sm:inline">Download</span>
                          <span className="sm:hidden">Save</span>
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </Card>
          )}

          {/* QR Generator Component */}
          <Card className="p-4 sm:p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Advanced QR Generator</h3>
            <QRGenerator
              productId={selectedProduct || 'PRD-2024-001'}
              productName={products.find(p => p.id === selectedProduct)?.name || 'Sample Product'}
              farmer="Maroon Farm"
              location="Stellenbosch, South Africa"
              onGenerate={(qrData) => {
                console.log('Advanced QR generated:', qrData);
                setGeneratedQRs([...generatedQRs, {
                  id: `qr-advanced-${Date.now()}`,
                  data: qrData,
                  productName: products.find(p => p.id === selectedProduct)?.name || 'Sample Product',
                  batchCode: batchCode
                }]);
              }}
              mockMode={false}
            />
          </Card>
        </div>
      </DashboardLayout>
    </>
  );
}
