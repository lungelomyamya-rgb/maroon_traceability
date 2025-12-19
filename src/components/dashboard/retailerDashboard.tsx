'use client';

import { Package, DollarSign, CheckCircle, Store, ShoppingCart, TrendingUp, Plus, Zap } from 'lucide-react';
import { getCategoryIcon } from '@/lib/constants';
import { ProductCategory } from '@/types/product';
import { useRouter } from 'next/navigation';
import { useProducts } from '@/contexts/productContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MetricsCard } from './metricsCard';
import { CategoryStats } from './categoryStats';
import { PageTitle, PageSubtitle, CardTitle, InfoText } from '@/components/ui/typography';
import { CATEGORY_COLORS } from '@/lib/constants';
import { getBannerGradient, getButtonStyles, getRoleColors } from '@/lib/theme/colors';

export function RetailerDashboard() {
  const router = useRouter();
  const { blockchainRecords, categoryStats } = useProducts();

  // Calculate retailer-specific metrics
  const totalProducts = blockchainRecords.length;
  const certifiedProducts = blockchainRecords.filter(p => p.status === 'Certified').length;
  const totalVerifications = blockchainRecords.reduce((sum, p) => sum + p.verifications, 0);
  const uniqueFarmers = new Set(blockchainRecords.map(p => p.farmer)).size;

  // Get top categories
  const topCategories = Object.entries(categoryStats)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 4);

  return (
    <div className="space-y-8 px-4 sm:px-6 lg:px-8 pt-8 pb-12">
      {/* Hero Section */}
      <div className={`relative overflow-hidden bg-gradient-to-br ${getRoleColors('retailer').hero} rounded-2xl shadow-2xl max-w-4xl mx-auto w-full`}>
        <div className="absolute inset-0 bg-foreground/5"></div>
        <div className="relative z-10 text-center p-8 px-4 sm:px-8">
          <div className="inline-flex items-center mb-4 px-4 py-1.5 bg-background/20 backdrop-blur-sm rounded-full border border-white/10">
            <ShoppingCart className="h-3.5 w-3.5 mr-1.5 text-white" />
            <span className="text-xs font-medium text-white">Retailer Dashboard</span>
          </div>
          <PageTitle className="mb-2 text-white text-2xl sm:text-3xl font-bold">
            Welcome back, {typeof window !== 'undefined' ? (localStorage.getItem('userName') || 'Retailer') : 'Retailer'}!
          </PageTitle>
          <PageSubtitle className="text-white/90 text-sm max-w-md mx-auto">
            Explore certified products and verify supply chain authenticity with blockchain technology
          </PageSubtitle>
          <Button 
            onClick={() => router.push('/blockchain')}
            className="mt-4 bg-white text-primary hover:bg-white/90 shadow-md px-6 py-2 text-sm font-medium"
          >
            Explore Products
          </Button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 px-2 sm:px-0">
        <MetricsCard
          icon={Package}
          label="Total Transactions"
          value={totalProducts}
          variant="total-transactions"
        />
        <MetricsCard
          icon={DollarSign}
          label="Monthly Revenue"
          value={`R${totalProducts * 50}`}
          variant="monthly-revenue"
        />
        <MetricsCard
          icon={CheckCircle}
          label="Certified"
          value={certifiedProducts}
          variant="success"
        />
        <MetricsCard
          icon={Store}
          label="Suppliers"
          value={uniqueFarmers}
          variant="retailers"
        />
        <MetricsCard
          icon={TrendingUp}
          label="Avg. Fee (R)"
          value={10}
          variant="avg-fee"
        />
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 px-2 sm:px-0">
        {/* Top Categories */}
        <div className="lg:col-span-2">
          <Card variant="outline" className="shadow-lg">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <CardTitle>Top Product Categories</CardTitle>
                <Button 
                  onClick={() => router.push('/blockchain')}
                  variant="secondary"
                  size="sm"
                >
                  View All
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {topCategories.map(([category, count]) => {
                const colors = CATEGORY_COLORS[category as keyof typeof CATEGORY_COLORS];
                return (
                  <div 
                    key={category}
                    className={`${colors.bg} p-4 rounded-xl border border-border/30 hover:border-primary/50 transition-all cursor-pointer shadow-sm hover:shadow-md`}
                    onClick={() => router.push('/blockchain')}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className={`p-2 rounded-lg ${colors.border} border border-border/30`}>
                        {(() => {
                          const Icon = getCategoryIcon(category as ProductCategory);
                          return <Icon className={`h-6 w-6 ${colors.text}`} />;
                        })()}
                      </div>
                      <span className={`text-2xl font-bold ${colors.text}`}>{count}</span>
                    </div>
                    <h3 className={`text-base font-semibold ${colors.text}`}>{category}</h3>
                    <InfoText className="text-xs mt-0.5">
                      {count} product{count !== 1 ? 's' : ''} available
                    </InfoText>
                  </div>
                );
              })}
              </div>
              
              {/* All Categories Button */}
              <Button 
                onClick={() => router.push('/blockchain')}
                variant="secondary"
                className="w-full mt-6"
              >
                View All Products
              </Button>
            </div>
          </Card>
        </div>

        {/* Category Stats */}
        <div>
          <CategoryStats />
        </div>
      </div>

      {/* Verification Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card variant="outline" className="shadow-lg bg-success/5">
          <div className="flex items-start gap-4">
            <div className="bg-success/10 p-3 rounded-lg">
              <CheckCircle className="h-8 w-8 text-success" />
            </div>
            <div className="flex-1">
              <CardTitle className="mb-2">Blockchain Verified</CardTitle>
              <InfoText>
                All products on this platform are certified on blockchain, ensuring complete supply chain transparency and authenticity.
              </InfoText>
            </div>
          </div>
        </Card>

        <Card variant="outline" className="shadow-lg bg-primary/5">
          <div className="flex items-start gap-4">
            <div className="bg-primary/10 p-3 rounded-lg">
              <TrendingUp className="h-8 w-8 text-primary" />
            </div>
            <div className="flex-1">
              <CardTitle className="mb-2">Quality Assurance</CardTitle>
              <InfoText>
                Every verification adds trust to the supply chain. Partner with certified farmers for guaranteed quality and traceability.
              </InfoText>
            </div>
          </div>
        </Card>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-lg border">
              <h3 className="text-xl font-bold mb-4 text-gray-800">For Retailers</h3>
              <p className="text-gray-600 mb-4">Verify product origins and build customer confidence.</p>
              <div className="space-y-2">
                <Button 
                  onClick={() => router.push('/blockchain')}
                  className={`w-full ${getButtonStyles('purple')}`}
                >
                  Verify Products
                </Button>
                <Button 
                  onClick={() => router.push('/blockchain')}
                  className={`w-full ${getButtonStyles('orange')}`}
                >
                  Browse Certified Products
                </Button>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg border">
              <h3 className="text-xl font-bold mb-4 text-gray-800">Supply Chain</h3>
              <p className="text-gray-600 mb-4">Track products from farm to store with blockchain transparency.</p>
              <div className="space-y-2">
                <Button 
                  onClick={() => router.push('/blockchain')}
                  className={`w-full ${getButtonStyles('blue')}`}
                >
                  View All Products
                </Button>
                <Button 
                  onClick={() => router.push('/reports')}
                  className={`w-full ${getButtonStyles('green')}`}
                >
                  View Reports
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
