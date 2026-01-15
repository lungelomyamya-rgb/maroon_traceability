// src/app/unauthorized/page.tsx
'use client';

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { commonColors } from '@/lib/theme/colors';

export default function UnauthorizedPage() {
  const router = useRouter();

  // Scroll to top when page loads
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className={`min-h-screen flex items-center justify-center ${commonColors.gray50}`}>
      <div className="text-center">
        <h1 className={`text-4xl font-bold ${commonColors.red800} mb-4`}>401 Unauthorized</h1>
        <p className={`${commonColors.gray600} mb-8`}>You don't have permission to access this page.</p>
        <Button onClick={() => router.push('/')}>
          Return to Dashboard
        </Button>
      </div>
    </div>
  );
}