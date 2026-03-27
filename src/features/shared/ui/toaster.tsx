// src/components/ui/toaster.tsx
import React from 'react';
import { commonColors } from '@/lib/theme/colors';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info' | 'warning';
}

export function Toaster() {
  return (
    <div className="fixed top-4 right-4 z-50">
      <div className={`${commonColors.whiteBg} ${commonColors.borderGray200} ${commonColors.roundedLg} ${commonColors.shadowLg} p-4 mb-2`}>
        <p className={`text-sm ${commonColors.gray700}`}>Toast notifications will appear here</p>
      </div>
    </div>
  );
}
