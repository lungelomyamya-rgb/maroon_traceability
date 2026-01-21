// src/components/qr/QRScanner.tsx
'use client';

import { useState, useCallback, useRef } from 'react';
import { Camera, X, CheckCircle, AlertCircle, QrCode } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

interface QRScannerProps {
  onScanSuccess?: (data: string) => void;
  onScanError?: (error: string) => void;
  onClose?: () => void;
  mockMode?: boolean;
}

export function QRScanner({ 
  onScanSuccess, 
  onScanError, 
  onClose, 
  mockMode = true 
}: QRScannerProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showMockDialog, setShowMockDialog] = useState(false);
  const [mockInput, setMockInput] = useState('');
  const videoRef = useRef<HTMLVideoElement>(null);
  const router = useRouter();

  const startScanning = useCallback(() => {
    if (mockMode) {
      setShowMockDialog(true);
      setIsScanning(true);
      setError(null);
      setScanResult(null);
    } else {
      // Real QR code scanning logic would go here
      setIsScanning(true);
      setError(null);
      setScanResult(null);
    }
  }, [mockMode]);

  const stopScanning = useCallback(() => {
    setIsScanning(false);
    setShowMockDialog(false);
    setMockInput('');
    setError(null);
  }, []);

  const handleMockScan = useCallback(() => {
    if (!mockInput.trim()) {
      const errorMsg = 'Please enter a product ID or QR code data';
      setError(errorMsg);
      onScanError?.(errorMsg);
      return;
    }

    // Simulate successful scan
    setScanResult(mockInput);
    setError(null);
    onScanSuccess?.(mockInput);
    
    // Redirect to product details page immediately after successful scan
    setTimeout(() => {
      console.log('Navigating to:', `/trace/${mockInput}`);
      // Navigate to the trace page with the product ID
      router.push(`/trace/${mockInput}`);
      // Close the scanner after initiating navigation
      stopScanning();
      onClose?.();
    }, 1000); // Reduced timeout for better UX
  }, [mockInput, onScanSuccess, onScanError, onClose, stopScanning, router]);

  const generateMockProductIds = useCallback(() => {
    const mockIds = [
      'APPLE-001',
      'TOMATO-002', 
      'MORINGA-003',
      'BLK1704123456789',
      'TRACE-DEMO-001'
    ];
    return mockIds[Math.floor(Math.random() * mockIds.length)];
  }, []);

  const useMockId = useCallback(() => {
    const mockId = generateMockProductIds();
    setMockInput(mockId);
  }, [generateMockProductIds]);

  if (showMockDialog) {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <QrCode className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">QR Scanner</h3>
                <p className="text-sm text-gray-500">Mock Mode - Enter product ID</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={stopScanning}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {scanResult ? (
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Scan Successful!</h4>
              <p className="text-sm text-gray-600 font-mono bg-gray-100 px-3 py-2 rounded mb-3">
                {scanResult}
              </p>
              <p className="text-sm text-blue-600 animate-pulse">
                Redirecting to product details...
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enter Product ID or QR Data
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={mockInput}
                    onChange={(e) => setMockInput(e.target.value)}
                    placeholder="e.g., APPLE-001"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    autoFocus
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={useMockId}
                    className="whitespace-nowrap"
                  >
                    Random
                  </Button>
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              <div className="flex gap-3">
                <Button
                  onClick={handleMockScan}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  View Product Details
                </Button>
                <Button
                  variant="outline"
                  onClick={stopScanning}
                >
                  Cancel
                </Button>
              </div>

              <div className="text-xs text-gray-500 text-center">
                <p>Try: APPLE-001, TOMATO-002, MORINGA-003, or click "Random"</p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 flex items-center justify-center min-h-[400px]">
      <div className="text-center w-full">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
          <Camera className="h-8 w-8 text-blue-600" />
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 mb-2">QR Code Scanner</h3>
        <p className="text-sm text-gray-600 mb-6">
          {mockMode ? 'Mock Mode - Simulate QR scanning' : 'Scan product QR codes'}
        </p>

        {isScanning ? (
          <div className="space-y-4">
            <div className="relative">
              <div className="w-64 h-64 mx-auto bg-gray-900 rounded-lg overflow-hidden">
                {/* Mock scanning animation */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-white text-center">
                    <QrCode className="h-16 w-16 mx-auto mb-4 animate-pulse" />
                    <p className="text-sm">Scanning...</p>
                  </div>
                </div>
                {/* Scanning line animation */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-b from-blue-400 to-transparent animate-pulse"></div>
              </div>
            </div>
            
            <Button
              onClick={stopScanning}
              variant="outline"
              className="w-full"
            >
              Stop Scanning
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <Button
              onClick={startScanning}
              className="w-full !bg-gradient-to-r !from-green-600 !to-green-500 hover:!from-green-700 hover:!to-green-600 !text-white shadow-lg rounded-full"
            >
              Start Scanning
            </Button>
            
            {mockMode && (
              <p className="text-xs text-gray-500">
                This is a mock implementation for demonstration
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
