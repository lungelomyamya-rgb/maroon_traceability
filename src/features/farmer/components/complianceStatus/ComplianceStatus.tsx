// src/features/Farmer/components/complianceStatus.tsx
'use client';

import { Shield, AlertTriangle } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface ComplianceStatusProps {
  products?: unknown[];
}

/* eslint-disable */
export function ComplianceStatus({ products = [] }: ComplianceStatusProps) {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Compliance Status</h1>
 
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <Shield className="h-8 w-8 text-green-600" />
            <div>
              <p className="text-sm text-gray-600">Compliant Products</p>
              <p className="text-2xl font-bold">{products.filter((p: any) => {
                return (p as any).compliant;
              }).length}</p>
            </div>
          </div>
        </Card>
 
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-8 w-8 text-orange-600" />
            <div>
              <p className="text-sm text-gray-600">Needs Review</p>
              <p className="text-2xl font-bold">{products.filter((p: any) => { 
                return !(p as any).compliant;
              }).length}</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
 
