// src/app/certify/page.tsx
'use client';

import { CertifyProductForm } from '@/components/products/certifyProductForm';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useUser } from '@/contexts/userContext';

export default function CertifyPage() {
  const router = useRouter();
  const { user } = useUser();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Check permissions on client side only
    if (user && !user.permissions?.canCreate) {
      router.push('/unauthorized');
    }
  }, [user, router]);

  if (!isClient) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 animate-fade-in">
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">Certify Your Products</h1>
        <CertifyProductForm />
      </div>
    </div>
  );
}