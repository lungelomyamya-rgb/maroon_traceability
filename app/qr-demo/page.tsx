// src/app/qr-demo/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { QRScanner, QRGenerator } from '@/components/qr';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { QrCode, Scan, ArrowRight } from 'lucide-react';

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
          Back
        </Button>
      </div>

      {/* Main Content */}
      <div className="min-h-screen bg-gray-50 py-4 sm:py-6 lg:py-8">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          {/* Header */}
          <div className="text-center mb-6 sm:mb-8">
            <div className="inline-flex items-center justify-center w-12 sm:w-14 lg:w-16 h-12 sm:h-14 lg:h-16 bg-blue-100 rounded-full mb-3 sm:mb-4">
              <QrCode className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 text-blue-600" />
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-1 sm:mb-2">QR Code Demo</h1>
            <p className="text-base sm:text-lg text-gray-600">
              Test QR code scanning and generation functionality
            </p>
          </div>

        {/* Results Display */}
        {(scanResult || generatedData) && (
          <Card className="mb-6 sm:mb-8 p-4 sm:p-6">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">Results</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={clearResults}
                className="h-8 sm:h-10 w-8 sm:w-auto"
              >
                Clear
              </Button>
            </div>
            
            {scanResult && (
              <div className="mb-3 sm:mb-4 p-3 sm:p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Scan className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />
                  <h4 className="text-sm sm:text-base font-medium text-green-900">Scan Result:</h4>
                </div>
                <p className="text-xs sm:text-sm text-green-800 font-mono break-all">{scanResult}</p>
              </div>
            )}

            {generatedData && (
              <div className="p-3 sm:p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <QrCode className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
                  <h4 className="text-sm sm:text-base font-medium text-blue-900">Generated QR Data:</h4>
                </div>
                <p className="text-xs sm:text-sm text-blue-800 font-mono break-all">{generatedData}</p>
              </div>
            )}
          </Card>
        )}

        {/* Main Demo Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {/* QR Scanner Demo */}
          <div>
            <div className="flex items-center gap-2 mb-3 sm:mb-4">
              <Scan className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">QR Scanner</h2>
            </div>
            <QRScanner
              onScanSuccess={handleScanSuccess}
              onScanError={handleScanError}
              mockMode={true}
            />
            
            <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-gray-100 rounded-lg">
              <h4 className="text-sm sm:text-base font-medium text-gray-900 mb-2">Test Data:</h4>
              <ul className="text-xs sm:text-sm text-gray-600 space-y-1">
                <li>• APPLE-001 (Organic Apples)</li>
                <li>• TOMATO-002 (Premium Tomatoes)</li>
                <li>• MORINGA-003 (Moringa Powder)</li>
                <li>• Or use the "Random" button above</li>
              </ul>
              <div className="mt-3 pt-3 border-t border-gray-300">
                <p className="text-xs text-gray-500 mb-2">Quick Test:</p>
                <div className="flex gap-2 flex-wrap">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => router.push('/trace/APPLE-001')}
                    className="text-xs"
                  >
                    Test APPLE-001
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => router.push('/trace/TOMATO-002')}
                    className="text-xs"
                  >
                    Test TOMATO-002
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => router.push('/trace/MORINGA-003')}
                    className="text-xs"
                  >
                    Test MORINGA-003
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* QR Generator Demo */}
          <div>
            <div className="flex items-center gap-2 mb-3 sm:mb-4">
              <QrCode className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">QR Generator</h2>
            </div>
            <QRGenerator
              productId={generatedData}
              productName={generatedData ? 'Demo Organic Apples' : ''}
              farmer={generatedData ? 'Demo Farm' : ''}
              location={generatedData ? 'Stellenbosch, Western Cape' : ''}
              onGenerate={handleGenerate}
              mockMode={false}
            />
            
            <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-gray-100 rounded-lg">
              <h4 className="text-sm sm:text-base font-medium text-gray-900 mb-2">Features:</h4>
              <ul className="text-xs sm:text-sm text-gray-600 space-y-1">
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
          <h3 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-gray-900 mb-2 sm:mb-3">Complete Workflow</h3>
          <div className="space-y-6 sm:space-y-8">
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
              <div className="flex-shrink-0">
                <div className="w-10 sm:w-12 lg:w-14 h-10 sm:h-12 lg:h-14 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-base sm:text-lg lg:text-xl font-medium text-blue-600">1</span>
                </div>
              </div>
              <div>
                <h4 className="text-lg sm:text-xl lg:text-2xl font-medium text-gray-900">Generate QR Code</h4>
                <p className="text-base sm:text-lg lg:text-xl text-gray-600 mb-4 sm:mb-6">Create a QR code for a product using the generator above</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <ArrowRight className="h-4 w-4 text-gray-400" />
            </div>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
              <div className="flex-shrink-0">
                <div className="w-10 sm:w-12 lg:w-14 h-10 sm:h-12 lg:h-14 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-base sm:text-lg lg:text-xl font-medium text-green-600">2</span>
                </div>
              </div>
              <div>
                <h4 className="text-lg sm:text-xl lg:text-2xl font-medium text-gray-900">Scan QR Code</h4>
                <p className="text-base sm:text-lg lg:text-xl text-gray-600 mb-4 sm:mb-6">Use the scanner to read the generated QR code data</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <ArrowRight className="h-4 w-4 text-gray-400" />
            </div>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
              <div className="flex-shrink-0">
                <div className="w-10 sm:w-12 lg:w-14 h-10 sm:h-12 lg:h-14 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-base sm:text-lg lg:text-xl font-medium text-purple-600">3</span>
                </div>
              </div>
              <div>
                <h4 className="text-lg sm:text-xl lg:text-2xl font-medium text-gray-900">View Product Trace</h4>
                <p className="text-base sm:text-lg lg:text-xl text-gray-600 mb-4 sm:mb-6">Navigate to the product trace page with scanned data</p>
              </div>
            </div>
          </div>
          <div className="mt-8 sm:mt-10 lg:mt-12 flex flex-col sm:flex-row gap-4 sm:gap-6">
            <Button
              onClick={() => window.open('/trace/DEMO-001', '_blank')}
              className="h-12 sm:h-14 lg:h-16 py-3 sm:py-4 px-6 sm:px-8 text-sm sm:text-base lg:text-lg bg-purple-600 hover:bg-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl rounded-full"
            >
              View Trace
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open('/marketplace', '_blank')}
              className="h-12 sm:h-14 lg:h-16 py-3 sm:py-4 px-6 sm:px-8 text-sm sm:text-base lg:text-lg"
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
