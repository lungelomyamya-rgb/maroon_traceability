// src/components/marketplace/qRScannerSection.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CheckCircle, AlertCircle, QrCode } from 'lucide-react';

export default function QRScannerSection() {
  const router = useRouter();
  const [mockInput, setMockInput] = useState('');
  const [scanResult, setScanResult] = useState('');
  const [error, setError] = useState('');

  const handleScan = () => {
    if (!mockInput.trim()) {
      setError('Please enter a product ID or QR code data');
      return;
    }

    // Simulate successful scan
    setScanResult(mockInput);
    setError('');

    // Navigate to trace page after 2 seconds
    setTimeout(() => {
      console.log('Navigating to trace page for:', mockInput);
      router.push(`/trace/${mockInput}`);
      setScanResult('');
      setMockInput('');
    }, 2000);
  };

  const useRandomId = () => {
    const mockIds = ['APPLE-001', 'TOMATO-002', 'MORINGA-003', 'BLK1704123456789', 'TRACE-DEMO-001'];
    const randomId = mockIds[Math.floor(Math.random() * mockIds.length)];
    setMockInput(randomId);
    setError('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleScan();
    }
  };

  return (
    <section 
      id="qr-scanner" 
      className="py-8 sm:py-12 md:py-16 lg:py-20 px-3 sm:px-4 lg:px-8 bg-gray-50"
      aria-labelledby="qr-scanner-heading"
    >
      <div className="max-w-4xl sm:max-w-5xl md:max-w-6xl lg:max-w-7xl mx-auto">
        <div className="text-center mb-6 sm:mb-8">
          <h2 id="qr-scanner-heading" className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
            Scan Product QR Code
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Enter a product ID to trace its journey from farm to shelf
          </p>
        </div>
        
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 p-4 sm:p-6 md:p-8">
          {scanResult ? (
            <div className="text-center py-6 sm:py-8 md:py-12">
              <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-green-100 rounded-full mb-3 sm:mb-4 md:mb-6">
                <CheckCircle className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 text-green-600" aria-hidden="true" />
              </div>
              <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">
                Scan Successful!
              </h3>
              <p 
                className="text-sm sm:text-base md:text-lg text-gray-600 font-mono bg-gray-100 px-2 sm:px-3 py-1 sm:py-2 rounded"
                role="status"
                aria-live="polite"
              >
                {scanResult}
              </p>
              <p className="text-xs sm:text-sm md:text-base text-gray-500 mt-2 sm:mt-3">
                Redirecting to trace page...
              </p>
            </div>
          ) : (
            <div className="space-y-4 sm:space-y-6 md:space-y-8">
              <div>
                <label 
                  htmlFor="qr-input"
                  className="block text-sm sm:text-base md:text-lg font-medium text-gray-700 mb-2 sm:mb-3"
                >
                  Enter Product ID or QR Code Data
                </label>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 md:gap-4">
                  <input
                    id="qr-input"
                    type="text"
                    value={mockInput}
                    onChange={(e) => setMockInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="e.g., APPLE-001"
                    className="flex-1 px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm sm:text-base md:text-lg"
                    autoFocus
                    aria-label="Product ID or QR code input"
                    aria-describedby={error ? "error-message" : undefined}
                  />
                  <Button
                    variant="outline"
                    onClick={useRandomId}
                    className="w-full sm:w-auto whitespace-nowrap text-sm sm:text-base md:text-lg"
                    aria-label="Generate random product ID"
                  >
                    Random
                  </Button>
                </div>
              </div>

              {error && (
                <div 
                  id="error-message"
                  className="flex items-center gap-2 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg"
                  role="alert"
                  aria-live="polite"
                >
                  <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-600 flex-shrink-0" aria-hidden="true" />
                  <p className="text-sm sm:text-base md:text-lg text-red-700">{error}</p>
                </div>
              )}

              <Button
                onClick={handleScan}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 sm:py-4 md:py-6 text-sm sm:text-base md:text-lg font-medium"
                aria-label="Scan and trace product"
              >
                <QrCode className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 mr-2" aria-hidden="true" />
                Scan & Trace Product
              </Button>
            </div>
          )}
        </div>

        {/* Additional Help Section */}
        <div className="mt-6 sm:mt-8 md:mt-12 grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
          <div className="bg-white p-4 sm:p-6 rounded-lg border">
            <h3 className="font-semibold text-gray-900 mb-3 sm:mb-4 text-sm sm:text-base md:text-lg">
              How to Use:
            </h3>
            <ol className="space-y-2 text-sm sm:text-base md:text-lg text-gray-600">
              <li>1. Enter a product ID in the field above</li>
              <li>2. Click "Trace Product" to view the journey</li>
              <li>3. Explore complete traceability information</li>
            </ol>
          </div>
          <div className="bg-blue-50 p-3 sm:p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2 sm:mb-3 text-sm sm:text-base md:text-lg">
              Demo Product IDs:
            </h4>
            <ul className="text-sm sm:text-base md:text-lg text-blue-800 space-y-1">
              <li>• APPLE-001 (Organic Apples)</li>
              <li>• TOMATO-002 (Premium Tomatoes)</li>
              <li>• MORINGA-003 (Moringa Powder)</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
