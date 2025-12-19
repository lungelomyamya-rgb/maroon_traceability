// src/app/page.tsx
'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useUser } from '@/contexts/userContext';
import { Skeleton } from '@/components/ui/skeleton';

export default function Home() {
  const { user, loading } = useUser();
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    if (!loading && !isRedirecting) {
      setIsRedirecting(true);
      // Redirect based on user role
      if (user) {
        const rolePath = `/${user.role}`;
        router.push(rolePath);
      } else {
        // Default to viewer for public access
        router.push('/viewer');
      }
    }
  }, [user, loading, isRedirecting, router]);

  if (loading || isRedirecting) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Skeleton className="w-12 h-12 rounded-full" />
      </div>
    );
  }

  return null;
}