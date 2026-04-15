// src/components/retailers/paymentProcessing/PaymentGateways.tsx
'use client';

import { CreditCard, Smartphone, Wallet, Settings, CheckCircle, AlertTriangle } from 'lucide-react';

import { Badge } from '@/src/features/shared/ui/badge';
import { Button } from '@/src/features/shared/ui/button';
import { Card } from '@/src/features/shared/ui/card';


interface PaymentGateway {
  id: string;
  name: string;
  type: 'credit-card' | 'mobile' | 'bank-transfer' | 'digital-wallet';
  supportedMethods: string[];
  fees: {
    percentage: number;
    fixed: number;
  };
  status: 'active' | 'inactive' | 'error';
  successRate: number;
  monthlyVolume: number;
}

interface PaymentGatewaysProps {
  gateways: PaymentGateway[];
  onConfigure?: (gatewayId: string) => void;
  onToggleStatus?: (gatewayId: string) => void;
}

export function PaymentGateways({ gateways, onConfigure, onToggleStatus }: PaymentGatewaysProps) {
  const getGatewayIcon = (type: string) => {
    switch (type) {
    case 'credit-card':
      return CreditCard;
    case 'mobile':
      return Smartphone;
    case 'digital-wallet':
      return Wallet;
    default:
      return CreditCard;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
    case 'active':
      return <Badge className="bg-green-100 text-green-800">Active</Badge>;
    case 'inactive':
      return <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>;
    case 'error':
      return <Badge className="bg-red-100 text-red-800">Error</Badge>;
    default:
      return <Badge className="bg-gray-100 text-gray-800">Unknown</Badge>;
    }
  };

  return (
    <Card className="p-4 sm:p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Payment Gateways</h3>
        <Button variant="outline" size="sm">
          Add Gateway
        </Button>
      </div>

      <div className="space-y-4">
        {gateways.map((gateway) => {
          const Icon = getGatewayIcon(gateway.type);
          
          return (
            <div key={gateway.id} className="border rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-gray-50 rounded-lg">
                    <Icon className="h-5 w-5 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-gray-900">{gateway.name}</h4>
                      {getStatusBadge(gateway.status)}
                    </div>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {gateway.supportedMethods.map((method) => (
                        <Badge key={method} variant="outline" className="text-xs">
                          {method}
                        </Badge>
                      ))}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Fees</p>
                        <p className="font-medium">
                          {gateway.fees.percentage}% + R{gateway.fees.fixed.toFixed(2)}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">Success Rate</p>
                        <p className="font-medium">{gateway.successRate}%</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Monthly Volume</p>
                        <p className="font-medium">R{gateway.monthlyVolume.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onConfigure?.(gateway.id)}
                  >
                    <Settings className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onToggleStatus?.(gateway.id)}
                  >
                    {gateway.status === 'active' ? (
                      <AlertTriangle className="h-4 w-4" />
                    ) : (
                      <CheckCircle className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
