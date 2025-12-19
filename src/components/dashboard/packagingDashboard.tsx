// src/components/dashboard/PackagingDashboard.tsx
'use client';

import { Package, Box, Tag, Clock, QrCode, Package as PackageIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useProducts } from '@/contexts/productContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MetricsCard } from './metricsCard';
import { CategoryStats } from './categoryStats';
import { PageTitle, PageSubtitle, CardTitle, InfoText } from '@/components/ui/typography';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils';

export function PackagingDashboard() {
  const router = useRouter();
  const { blockchainRecords, businessMetrics } = useProducts();

  // Calculate packaging-specific metrics
  const productsPackaged = blockchainRecords.filter(p => p.status === 'Certified').length;
  const pendingPackaging = blockchainRecords.filter(p => !p.verified).length;
  const qrGenerated = blockchainRecords.filter(p => p.txHash).length;
  const totalPackaging = blockchainRecords.reduce((sum, p) => sum + p.verifications, 0);
  const recentProducts = blockchainRecords.slice(0, 3);

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-orange-600/90 to-orange-700/70 rounded-2xl shadow-2xl max-w-4xl mx-auto w-full">
        <div className="absolute inset-0 bg-foreground/5"></div>
        <div className="relative z-10 text-center p-8">
          <div className="inline-block mb-4 px-4 py-1.5 bg-background/20 backdrop-blur-sm rounded-full border border-white/10">
            <span className="text-xs font-medium text-white">Packaging Dashboard</span>
          </div>
          <PageTitle className="mb-2 text-white text-2xl sm:text-3xl">
            Welcome back, {typeof window !== 'undefined' ? (localStorage.getItem('userName') || 'Packaging Manager') : 'Packaging Manager'}!
          </PageTitle>
          <PageSubtitle className="text-white/90 text-sm max-w-md mx-auto">
            Handle product packaging, labeling, and QR code generation
          </PageSubtitle>
          <Button 
            onClick={() => router.push('/packaging')}
            className="mt-4 bg-white text-orange-600 hover:bg-white/90 shadow-md px-6 py-2 text-sm font-medium"
          >
            Start Packaging
          </Button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricsCard
          icon={Package}
          label="Products Packaged"
          value={productsPackaged}
          variant="success"
        />
        <MetricsCard
          icon={Clock}
          label="Pending Packaging"
          value={pendingPackaging}
          variant="warning"
        />
        <MetricsCard
          icon={QrCode}
          label="QR Codes Generated"
          value={qrGenerated}
          variant="primary"
        />
        <MetricsCard
          icon={Box}
          label="Total Packaging"
          value={totalPackaging}
          variant="primary"
        />
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Products */}
        <div className="lg:col-span-2">
          <Card variant="outline" className="shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <CardTitle>Packaging Queue</CardTitle>
              <Button 
                onClick={() => router.push('/packaging')}
                variant="secondary"
                size="sm"
              >
                View All
              </Button>
            </div>
            <div className="space-y-4">
              {recentProducts.length === 0 ? (
                <div className="text-center py-8">
                  <Package className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <InfoText>No products in packaging queue. Check incoming products!</InfoText>
                </div>
              ) : (
                recentProducts.map((product) => (
                  <div 
                    key={product.id} 
                    className="flex items-center justify-between p-4 bg-muted/30 hover:bg-muted/50 rounded-lg hover:shadow-md transition-all cursor-pointer"
                    onClick={() => router.push('/packaging')}
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className="bg-background p-3 rounded-lg shadow-sm">
                        <Package className="h-6 w-6 text-orange-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-foreground">{product.productName}</h4>
                          <Badge variant={product.verified ? 'success' : 'warning'}>
                            {product.verified ? 'Packaged' : 'Pending'}
                          </Badge>
                        </div>
                        <InfoText className="text-xs">{product.location} • {formatDate(product.timestamp.toString())}</InfoText>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-foreground">{product.verifications} packages</div>
                      <InfoText className="text-xs">{product.category}</InfoText>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>

        {/* Category Stats */}
        <div>
          <CategoryStats />
        </div>
      </div>

      {/* Quick Actions */}
      <Card variant="outline" className="shadow-lg bg-background overflow-hidden">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <CardTitle className="text-lg font-semibold text-foreground">Quick Actions</CardTitle>
            <div className="h-1 flex-1 bg-gradient-to-r from-orange-600 to-orange-700/70 rounded-full ml-4 opacity-20"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              onClick={() => router.push('/packaging')}
              className="w-full bg-gradient-to-r from-orange-600 to-orange-700/80 hover:from-orange-600/90 hover:to-orange-700/70 text-white shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5"
            >
              <Package className="h-4 w-4 mr-2" />
              <span className="font-medium">Start Packaging</span>
            </Button>
            <Button 
              onClick={() => router.push('/qr-generator')}
              className="w-full bg-gradient-to-r from-secondary to-secondary/80 hover:from-secondary/90 hover:to-secondary/70 text-secondary-foreground shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5"
            >
              <QrCode className="h-4 w-4 mr-2" />
              <span className="font-medium">Generate QR Codes</span>
            </Button>
            <Button 
              onClick={() => router.push('/labeling')}
              className="w-full bg-gradient-to-r from-accent to-accent/80 hover:from-accent/90 hover:to-accent/70 text-accent-foreground shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5"
            >
              <PackageIcon className="h-4 w-4 mr-2" />
              <span className="font-medium">Manage Labels</span>
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}