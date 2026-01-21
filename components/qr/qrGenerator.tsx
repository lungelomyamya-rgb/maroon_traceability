// src/components/qr/QRGenerator.tsx
'use client';

import { useState, useCallback } from 'react';
import { QrCode, Download, Share2, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface QRGeneratorProps {
  productId?: string;
  productName?: string;
  farmer?: string;
  location?: string;
  onGenerate?: (qrData: string) => void;
  mockMode?: boolean;
}

export function QRGenerator({ 
  productId = '',
  productName = '',
  farmer = '',
  location = '',
  onGenerate,
  mockMode = true 
}: QRGeneratorProps) {
  const [qrData, setQrData] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const generateQRData = useCallback(() => {
    if (!productId.trim()) {
      return '';
    }

    // Create structured QR data for the product
    const qrContent = {
      id: productId,
      name: productName,
      farmer: farmer,
      location: location,
      timestamp: new Date().toISOString(),
      source: 'maroon-traceability'
    };

    return JSON.stringify(qrContent);
  }, [productId, productName, farmer, location]);

  const handleGenerate = useCallback(async () => {
    if (!productId.trim()) {
      return;
    }

    setIsGenerating(true);
    
    // Simulate QR generation delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const generatedData = generateQRData();
    setQrData(generatedData);
    setShowPreview(true);
    setIsGenerating(false);
    
    onGenerate?.(generatedData);
  }, [productId, generateQRData, onGenerate]);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(qrData);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [qrData]);

  const handleDownload = useCallback(() => {
    // In a real implementation, this would download the QR code image
    // For mock, we'll download the data as a text file
    const blob = new Blob([qrData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `qr-${productId}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [qrData, productId]);

  const handleShare = useCallback(async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Product QR Code: ${productName}`,
          text: `Scan this QR code to verify ${productName} from ${farmer}`,
          url: qrData
        });
      } catch (error) {
        // Fallback to copying if share fails
        handleCopy();
      }
    } else {
      handleCopy();
    }
  }, [productName, farmer, qrData, handleCopy]);

  const generateMockQR = useCallback(() => {
    // Generate a mock QR code visual representation
    const mockQR = [];
    const size = 25;
    
    for (let i = 0; i < size; i++) {
      const row = [];
      for (let j = 0; j < size; j++) {
        // Create a pattern that looks like a QR code
        const isPositionMarker = 
          (i < 7 && j < 7) || // Top-left
          (i < 7 && j >= size - 7) || // Top-right
          (i >= size - 7 && j < 7); // Bottom-left
        
        const isRandomPattern = Math.random() > 0.5;
        
        row.push(isPositionMarker || isRandomPattern);
      }
      mockQR.push(row);
    }
    
    return mockQR;
  }, []);

  const mockQRPattern = generateMockQR();

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
          <QrCode className="h-8 w-8 text-green-600" />
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 mb-2">QR Code Generator</h3>
        <p className="text-sm text-gray-600">
          {mockMode ? 'Mock Mode - Generate demo QR codes' : 'Generate product QR codes'}
        </p>
      </div>

      <div className="space-y-4">
        {/* Product Info Input */}
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product ID
            </label>
            <input
              type="text"
              value={productId}
              onChange={(e) => setQrData('')} // Clear QR data when input changes
              placeholder="e.g., PRD-2024-001"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Name
            </label>
            <input
              type="text"
              value={productName}
              onChange={(e) => setQrData('')}
              placeholder="e.g., Organic Apples"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Farmer
              </label>
              <input
                type="text"
                value={farmer}
                onChange={(e) => setQrData('')}
                placeholder="Farm name"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setQrData('')}
                placeholder="Location"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Generate Button */}
        <Button
          onClick={handleGenerate}
          disabled={!productId.trim() || isGenerating}
          className="w-full bg-green-600 hover:bg-green-700"
        >
          {isGenerating ? 'Generating...' : 'Generate QR Code'}
        </Button>

        {/* QR Code Preview */}
        {showPreview && qrData && (
          <div className="space-y-4">
            {/* Mock QR Code Visual */}
            <div className="flex justify-center">
              <div className="p-4 bg-white border-2 border-gray-300 rounded-lg">
                <div className="grid grid-cols-25 gap-0" style={{ gridTemplateColumns: `repeat(25, 1fr)` }}>
                  {mockQRPattern.map((row, i) => (
                    row.map((cell, j) => (
                      <div
                        key={`${i}-${j}`}
                        className={`w-1 h-1 ${cell ? 'bg-black' : 'bg-white'}`}
                      />
                    ))
                  ))}
                </div>
              </div>
            </div>

            {/* QR Data Display */}
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-xs font-medium text-gray-700 mb-2">QR Code Data:</p>
              <p className="text-xs font-mono text-gray-600 break-all">
                {qrData}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
                className="flex items-center gap-1"
              >
                {copied ? (
                  <Check className="h-3 w-3" />
                ) : (
                  <Copy className="h-3 w-3" />
                )}
                {copied ? 'Copied!' : 'Copy'}
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={handleDownload}
                className="flex items-center gap-1"
              >
                <Download className="h-3 w-3" />
                Download
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={handleShare}
                className="flex items-center gap-1"
              >
                <Share2 className="h-3 w-3" />
                Share
              </Button>
            </div>

            {/* Product Info Summary */}
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-sm font-medium text-blue-900 mb-1">Product Summary:</p>
              <div className="text-xs text-blue-700 space-y-1">
                <p><strong>ID:</strong> {productId}</p>
                <p><strong>Name:</strong> {productName}</p>
                <p><strong>Farmer:</strong> {farmer}</p>
                <p><strong>Location:</strong> {location}</p>
              </div>
            </div>
          </div>
        )}

        {mockMode && (
          <p className="text-xs text-gray-500 text-center">
            This is a mock implementation for demonstration
          </p>
        )}
      </div>
    </div>
  );
}
