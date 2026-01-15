// src/app/qr-demo/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { QRScanner, QRGenerator } from '@/components/qr';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { QrCode, Scan, ArrowRight, ArrowLeft } from 'lucide-react';

export default function QRDemoPage() {
  const router = useRouter();
  const [scanResult, setScanResult] = useState<string>('');
  const [generatedData, setGeneratedData] = useState<string>('');

  const handleGoBack = () => {
    // Use router.back() to navigate to the previous page
    router.back();
  };

  const handleScanSuccess = (data: string) => {
    setScanResult(data);
  };

  const handleScanError = (error: string) => {
    console.error('Scan error:', error);
  };

  const handleGenerate = (qrData: string) => {
    setGeneratedData(qrData);
  };

  const clearResults = () => {
    setScanResult('');
    setGeneratedData('');
  };

  return (
    <>
      {/* Back Button - Separate from main content */}
      <div className="fixed top-2 left-2 z-50">
        <Button 
          variant="outline" 
          size="sm"
          onClick={handleGoBack}
          className="shadow-md"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </div>

      {/* Main Content */}
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <QrCode className="h-8 w-8 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">QR Code Demo</h1>
            <p className="text-lg text-gray-600">
              Test QR code scanning and generation functionality
            </p>
          </div>

        {/* Results Display */}
        {(scanResult || generatedData) && (
          <Card className="mb-8 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Results</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={clearResults}
              >
                Clear
              </Button>
            </div>
            
            {scanResult && (
              <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Scan className="h-4 w-4 text-green-600" />
                  <h4 className="font-medium text-green-900">Scan Result:</h4>
                </div>
                <p className="text-sm text-green-800 font-mono break-all">{scanResult}</p>
              </div>
            )}

            {generatedData && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <QrCode className="h-4 w-4 text-blue-600" />
                  <h4 className="font-medium text-blue-900">Generated QR Data:</h4>
                </div>
                <p className="text-sm text-blue-800 font-mono break-all">{generatedData}</p>
              </div>
            )}
          </Card>
        )}

        {/* Main Demo Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* QR Scanner Demo */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Scan className="h-5 w-5 text-gray-600" />
              <h2 className="text-xl font-semibold text-gray-900">QR Scanner</h2>
            </div>
            <QRScanner
              onScanSuccess={handleScanSuccess}
              onScanError={handleScanError}
              mockMode={true}
            />
            
            <div className="mt-4 p-4 bg-gray-100 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Test Data:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• PRD-2024-001</li>
                <li>• BLK1704123456789</li>
                <li>• TRACE-DEMO-001</li>
                <li>• Or use the "Random" button</li>
              </ul>
            </div>
          </div>

          {/* QR Generator Demo */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <QrCode className="h-5 w-5 text-gray-600" />
              <h2 className="text-xl font-semibold text-gray-900">QR Generator</h2>
            </div>
            <QRGenerator
              productId="DEMO-001"
              productName="Demo Organic Apples"
              farmer="Demo Farm"
              location="Stellenbosch, Western Cape"
              onGenerate={handleGenerate}
              mockMode={true}
            />
            
            <div className="mt-4 p-4 bg-gray-100 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Features:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Structured QR data format</li>
                <li>• Product information encoding</li>
                <li>• Copy, Download, Share options</li>
                <li>• Visual QR preview</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Workflow Demo */}
        <Card className="mt-8 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Complete Workflow</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-blue-600">1</span>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Generate QR Code</h4>
                <p className="text-sm text-gray-600">Create a QR code for a product using the generator above</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <ArrowRight className="h-4 w-4 text-gray-400" />
            </div>

            <div className="flex items-center gap-4">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-green-600">2</span>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Scan QR Code</h4>
                <p className="text-sm text-gray-600">Use the scanner to read the generated QR code data</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <ArrowRight className="h-4 w-4 text-gray-400" />
            </div>

            <div className="flex items-center gap-4">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-purple-600">3</span>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">View Product Trace</h4>
                <p className="text-sm text-gray-600">Navigate to the product trace page with scanned data</p>
              </div>
            </div>
          </div>

          <div className="mt-6 flex gap-4">
            <Button
              onClick={() => window.open('/trace/DEMO-001', '_blank')}
              className="bg-purple-600 hover:bg-purple-700"
            >
              View Trace
            </Button>
            <Button
              variant="outline"
              onClick={() => window.open('/public', '_blank')}
            >
              Public Marketplace
            </Button>
          </div>
        </Card>
      </div>
    </div>
    </>
  );
}
