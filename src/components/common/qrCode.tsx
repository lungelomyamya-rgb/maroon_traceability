// src/components/common/QRCode.tsx
'use client';

import { useEffect, useRef } from 'react';
import QRCode from 'qrcode';

interface QRCodeProps {
  value: string;
  size?: number;
  level?: 'L' | 'M' | 'Q' | 'H';
  includeMargin?: boolean;
  className?: string;
}

export function QRCodeDisplay({ 
  value, 
  size = 128, 
  level = 'M', 
  includeMargin = false,
  className = '' 
}: QRCodeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    QRCode.toCanvas(canvasRef.current, value, {
      width: size,
      margin: includeMargin ? 2 : 0,
      errorCorrectionLevel: level,
      color: {
        dark: '#000000',
        light: '#ffffff'
      }
    }).catch((err: Error) => {
      console.error('Error generating QR code:', err);
    });
  }, [value, size, level, includeMargin]);

  return <canvas ref={canvasRef} className={className} />;
}