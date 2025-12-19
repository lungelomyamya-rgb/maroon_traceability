// src/components/dashboard/InspectorDashboard.tsx
'use client';

import { Search, CheckCircle, AlertTriangle, Clock, Eye, FileCheck, ClipboardList, Shield, FileText, Zap } from 'lucide-react';
import { MetricsCard } from './metricsCard';
import { CategoryStats } from './categoryStats';
import { PageTitle, PageSubtitle, CardTitle, InfoText } from '@/components/ui/typography';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { useProducts } from '@/contexts/productContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function InspectorDashboard() {
  const router = useRouter();
  const { blockchainRecords, businessMetrics } = useProducts();

  // Calculate inspector-specific metrics
  const pendingInspections = blockchainRecords.filter(p => !p.verified).length;
  const completedInspections = blockchainRecords.filter(p => p.verified).length;
  const qualityIssues = blockchainRecords.filter(p => p.status === 'Delivered').length;
  const totalInspections = blockchainRecords.reduce((sum, p) => sum + p.verifications, 0);
  const recentProducts = blockchainRecords.slice(0, 3);

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-purple-600/90 to-purple-700/70 rounded-2xl shadow-2xl max-w-4xl mx-auto w-full">
        <div className="absolute inset-0 bg-foreground/5"></div>
        <div className="relative z-10 text-center p-8">
          <div className="inline-block mb-4 px-4 py-1.5 bg-background/20 backdrop-blur-sm rounded-full border border-white/10">
            <span className="text-xs font-medium text-white">Inspector Dashboard</span>
          </div>
          <PageTitle className="mb-2 text-white text-2xl sm:text-3xl">
            Welcome back, {typeof window !== 'undefined' ? (localStorage.getItem('userName') || 'Inspector') : 'Inspector'}!
          </PageTitle>
          <PageSubtitle className="text-white/90 text-sm max-w-md mx-auto">
            Conduct quality checks and ensure compliance standards
          </PageSubtitle>
          <Button 
            onClick={() => router.push('/inspections')}
            className="mt-4 bg-white text-purple-600 hover:bg-white/90 shadow-md px-6 py-2 text-sm font-medium"
          >
            Start Inspection
          </Button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricsCard
          icon={Clock}
          label="Pending Inspections"
          value={pendingInspections}
          variant="warning"
        />
        <MetricsCard
          icon={CheckCircle}
          label="Completed"
          value={completedInspections}
          variant="success"
        />
        <MetricsCard
          icon={AlertTriangle}
          label="Quality Issues"
          value={qualityIssues}
          variant="error"
        />
        <MetricsCard
          icon={FileCheck}
          label="Total Inspections"
          value={totalInspections}
          variant="primary"
        />
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Products */}
        <div className="lg:col-span-2">
          <Card variant="outline" className="shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <CardTitle>Recent Inspections</CardTitle>
              <Button 
                onClick={() => router.push('/inspections')}
                variant="secondary"
                size="sm"
              >
                View All
              </Button>
            </div>
            <div className="space-y-4">
              {recentProducts.length === 0 ? (
                <div className="text-center py-8">
                  <Search className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <InfoText>No inspections scheduled. Check your inspection queue!</InfoText>
                </div>
              ) : (
                recentProducts.map((product) => (
                  <div 
                    key={product.id} 
                    className="flex items-center justify-between p-4 bg-muted/30 hover:bg-muted/50 rounded-lg hover:shadow-md transition-all cursor-pointer"
                    onClick={() => router.push('/inspections')}
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className="bg-background p-3 rounded-lg shadow-sm">
                        <Search className="h-6 w-6 text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-foreground">{product.productName}</h4>
                          <Badge variant={product.verified ? 'success' : 'warning'}>
                            {product.verified ? 'Verified' : 'Pending'}
                          </Badge>
                        </div>
                        <InfoText className="text-xs">{product.location} • {formatDate(product.timestamp.toString())}</InfoText>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-foreground">{product.verifications} verifications</div>
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
      <Card variant="outline" className="bg-background overflow-hidden shadow-sm">
        <div className="p-5">
          <div className="flex items-center justify-between mb-5">
            <CardTitle className="text-base font-semibold text-foreground flex items-center">
              <Zap className="h-4 w-4 text-warning mr-2" />
              Quick Actions
            </CardTitle>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent ml-4"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Button 
              onClick={() => router.push('/inspections')}
              variant="primary"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm hover:shadow-md transition-all duration-200"
            >
              <FileCheck className="h-4 w-4 mr-2 text-white" />
              <span className="font-medium text-sm">Quality Check</span>
            </Button>
            <Button 
              onClick={() => router.push('/compliance')}
              variant="secondary"
              className="w-full bg-background border hover:bg-muted/50 text-foreground shadow-sm hover:shadow-sm transition-all duration-200"
            >
              <Shield className="h-4 w-4 mr-2 text-primary" />
              <span className="font-medium text-sm">Compliance Review</span>
            </Button>
            <Button 
              onClick={() => router.push('/reports')}
              variant="secondary"
              className="w-full bg-background border hover:bg-muted/50 text-foreground shadow-sm hover:shadow-sm transition-all duration-200"
            >
              <FileText className="h-4 w-4 mr-2 text-primary" />
              <span className="font-medium text-sm">Quality Reports</span>
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}