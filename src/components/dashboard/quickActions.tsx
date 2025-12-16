// src/components/dashboard/QuickActions.tsx
'use client';

import { useRouter } from 'next/navigation';
import { useUser } from '@/contexts/userContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { H4, Text } from '@/components/ui/typography';

export function QuickActions() {
  const router = useRouter();
  const { setUserRole } = useUser();

  const handleFarmerCertify = () => {
    setUserRole('farmer');
    router.push('/certify');
  };

  const handleFarmerView = () => {
    setUserRole('farmer');
    router.push('/blockchain');
  };

  const handleRetailerVerify = () => {
    setUserRole('retailer');
    router.push('/blockchain');
  };

  const handleRetailerBrowse = () => {
    setUserRole('retailer');
    router.push('/blockchain');
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card variant="bordered">
        <H4 className="mb-4">For Farmers</H4>
        <Text className="mb-4">
          Certify your products on the blockchain and build trust with retailers.
        </Text>
        <div className="space-y-2">
          <Button 
            onClick={handleFarmerCertify} 
            variant="primary" 
            className="w-full"
          >
            Certify Product
          </Button>
          <Button 
            onClick={handleFarmerView} 
            variant="secondary" 
            className="w-full"
          >
            View My Products
          </Button>
        </div>
      </Card>

      <Card variant="bordered">
        <H4 className="mb-4">For Retailers</H4>
        <Text className="mb-4">
          Verify product origins and build customer confidence.
        </Text>
        <div className="space-y-2">
          <Button 
            onClick={handleRetailerVerify} 
            variant="primary"
            className="w-full bg-accent hover:bg-accent/90"
          >
            Verify Products
          </Button>
          <Button 
            onClick={handleRetailerBrowse} 
            variant="outline" 
            className="w-full border-primary text-primary hover:bg-primary/10"
          >
            Browse Certified Products
          </Button>
        </div>
      </Card>
    </div>
  );
}